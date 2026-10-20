
import { lstatSync, readdirSync } from "node:fs";
import { join } from "node:path";

export interface ProjectCheckResult {
  projectName: string;
  projectPath: string;
  status: "completed" | "incomplete" | "failed";
  fileCount: number;
  directoryCount: number;
  excludedDirectories: string[];
  checkedAt: string;
  errors: string[];
}

const EXCLUDED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".next",
  "coverage",
  ".venv"
]);

/**
 * Inspects a configured project directory without reading file contents
 * or changing the filesystem.
 *
 * The root path must come from AI Hub's trusted project configuration.
 */
export function checkProject(
  projectName: string,
  projectPath: string
): ProjectCheckResult {
  const result: ProjectCheckResult = {
    projectName,
    projectPath,
    status: "completed",
    fileCount: 0,
    directoryCount: 0,
    excludedDirectories: [...EXCLUDED_DIRECTORIES],
    checkedAt: new Date().toISOString(),
    errors: []
  };

  let rootInfo;

  try {
    rootInfo = lstatSync(projectPath);

    if (rootInfo.isSymbolicLink()) {
      throw new Error("The project root is a symbolic link; inspection refused.");
    }

    if (!rootInfo.isDirectory()) {
      throw new Error("The configured project path is not a directory.");
    }
  } catch (error) {
    result.status = "failed";
    result.errors.push(
      error instanceof Error ? error.message : "Could not inspect project root."
    );
    return result;
  }

  function scanDirectory(directoryPath: string): void {
    let entries;

    try {
      entries = readdirSync(directoryPath, { withFileTypes: true });
    } catch (error) {
      result.status = "incomplete";
      result.errors.push(
        `${directoryPath}: ${
          error instanceof Error ? error.message : "Could not read directory."
        }`
      );
      return;
    }

    for (const entry of entries) {
      // Never follow symbolic links.
      if (entry.isSymbolicLink()) {
        continue;
      }

      const entryPath = join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        if (EXCLUDED_DIRECTORIES.has(entry.name)) {
          continue;
        }

        result.directoryCount += 1;
        scanDirectory(entryPath);
      } else if (entry.isFile()) {
        result.fileCount += 1;
      }
      // Ignore sockets, devices, and other non-file/non-directory entries.
    }
  }

  scanDirectory(projectPath);
  return result;
}
