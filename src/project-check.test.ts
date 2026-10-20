
import {
    mkdtempSync,
    mkdirSync,
    writeFileSync,
    symlinkSync,
    rmSync
  } from "node:fs";
  import { tmpdir } from "node:os";
  import { join } from "node:path";
  import {
    afterEach,
    beforeEach,
    describe,
    it
  } from "node:test";
  import assert from "node:assert/strict";
  
  import { checkProject } from "./project-check.js";
  
  let testRoot: string;
  
  beforeEach(() => {
    testRoot = mkdtempSync(join(tmpdir(), "ai-hub-project-check-"));
  });
  
  afterEach(() => {
    rmSync(testRoot, { recursive: true, force: true });
  });
  
  describe("checkProject", () => {
    it("counts regular files and directories", () => {
      mkdirSync(join(testRoot, "src"));
      writeFileSync(join(testRoot, "README.md"), "test");
      writeFileSync(join(testRoot, "src", "index.ts"), "test");
  
      const result = checkProject("Test Project", testRoot);
  
      assert.equal(result.status, "completed");
      assert.equal(result.fileCount, 2);
      assert.equal(result.directoryCount, 1);
      assert.deepEqual(result.errors, []);
    });
  
    it("excludes configured dependency and build directories", () => {
      for (const name of [
        "node_modules",
        ".git",
        "dist",
        "build",
        ".next",
        "coverage",
        ".venv"
      ]) {
        mkdirSync(join(testRoot, name));
        writeFileSync(join(testRoot, name, "ignored.txt"), "test");
      }
  
      writeFileSync(join(testRoot, "keep.txt"), "test");
  
      const result = checkProject("Test Project", testRoot);
  
      assert.equal(result.status, "completed");
      assert.equal(result.fileCount, 1);
      assert.equal(result.directoryCount, 0);
  
      for (const name of [
        "node_modules",
        ".git",
        "dist",
        "build",
        ".next",
        "coverage",
        ".venv"
      ]) {
        assert.ok(result.excludedDirectories.includes(name));
      }
    });
  
    it("returns failed for a missing project path", () => {
      const missingPath = join(testRoot, "does-not-exist");
  
      const result = checkProject("Missing Project", missingPath);
  
      assert.equal(result.status, "failed");
      assert.equal(result.fileCount, 0);
      assert.equal(result.directoryCount, 0);
      assert.ok(result.errors.length > 0);
    });
  
    it("returns failed when the project path is a file", () => {
      const filePath = join(testRoot, "not-a-folder.txt");
      writeFileSync(filePath, "test");
  
      const result = checkProject("Invalid Project", filePath);
  
      assert.equal(result.status, "failed");
      assert.ok(
        result.errors.some((error) =>
          error.includes("not a directory")
        )
      );
    });
  
    it("returns the project details and a valid timestamp", () => {
      const result = checkProject("Timestamp Test", testRoot);
  
      assert.equal(result.projectName, "Timestamp Test");
      assert.equal(result.projectPath, testRoot);
      assert.match(
        result.checkedAt,
        /^\d{4}-\d{2}-\d{2}T.*Z$/
      );
      assert.ok(Array.isArray(result.excludedDirectories));
      assert.ok(Array.isArray(result.errors));
    });
  
    it("does not follow a symbolic link inside a project", (t) => {
      const outsideDirectory = join(testRoot, "outside");
      const projectDirectory = join(testRoot, "project");
  
      mkdirSync(outsideDirectory);
      mkdirSync(projectDirectory);
      writeFileSync(join(outsideDirectory, "outside.txt"), "test");
  
      const linkPath = join(projectDirectory, "linked-folder");
  
      try {
        symlinkSync(outsideDirectory, linkPath, "junction");
      } catch {
        t.skip(
          "The operating system did not allow creation of a directory symlink."
        );
        return;
      }
  
      const result = checkProject("Symlink Test", projectDirectory);
  
      assert.equal(result.status, "completed");
      assert.equal(result.fileCount, 0);
      assert.equal(result.directoryCount, 0);
      assert.deepEqual(result.errors, []);
    });
  
    it("refuses a symbolic link as the project root", (t) => {
      const targetDirectory = join(testRoot, "target");
      const linkPath = join(testRoot, "root-link");
  
      mkdirSync(targetDirectory);
      writeFileSync(join(targetDirectory, "file.txt"), "test");
  
      try {
        symlinkSync(targetDirectory, linkPath, "junction");
      } catch {
        t.skip(
          "The operating system did not allow creation of a directory symlink."
        );
        return;
      }
  
      const result = checkProject("Root Symlink Test", linkPath);
  
      assert.equal(result.status, "failed");
      assert.ok(
        result.errors.some((error) =>
          error.includes("symbolic link")
        )
      );
    });
  });
  