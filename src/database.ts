
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

export type TaskStatus = "pending" | "completed" | "failed";

export interface HubTask {
  id: number;
  title: string;
  status: TaskStatus;
  result: string | null;
  created_at: string;
  updated_at: string;
}

export type ProjectCheckStatus =
  | "completed"
  | "incomplete"
  | "failed";

export interface ProjectCheckRecord {
  id: number;
  project_name: string;
  project_path: string;
  status: ProjectCheckStatus;
  file_count: number;
  directory_count: number;
  checked_at: string;
  errors: string;
}

export interface ProjectCheckInput {
  projectName: string;
  projectPath: string;
  status: ProjectCheckStatus;
  fileCount: number;
  directoryCount: number;
  checkedAt: string;
  errors: string[];
}

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const dataDirectory = resolve(currentDirectory, "../data");
const databasePath = resolve(dataDirectory, "hub.db");

mkdirSync(dataDirectory, { recursive: true });

const database = new DatabaseSync(databasePath);

// Existing task storage.
database.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    status TEXT NOT NULL
      CHECK (status IN ('pending', 'completed', 'failed')),
    result TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);

// Persistent history of read-only project inspections.
database.exec(`
  CREATE TABLE IF NOT EXISTS project_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_name TEXT NOT NULL,
    project_path TEXT NOT NULL,
    status TEXT NOT NULL
      CHECK (status IN ('completed', 'incomplete', 'failed')),
    file_count INTEGER NOT NULL,
    directory_count INTEGER NOT NULL,
    checked_at TEXT NOT NULL,
    errors TEXT NOT NULL
  )
`);

export function createTask(title: string): number {
  const cleanTitle = title.trim();

  if (!cleanTitle || cleanTitle.length > 500) {
    throw new Error("Task title must contain 1–500 characters.");
  }

  const now = new Date().toISOString();

  const statement = database.prepare(`
    INSERT INTO tasks (title, status, result, created_at, updated_at)
    VALUES (?, 'pending', NULL, ?, ?)
  `);

  const created = statement.run(cleanTitle, now, now);
  return Number(created.lastInsertRowid);
}

export function listTasks(): HubTask[] {
  return database.prepare(`
    SELECT id, title, status, result, created_at, updated_at
    FROM tasks
    ORDER BY id DESC
    LIMIT 100
  `).all() as unknown as HubTask[];
}

export function updateTask(
  id: number,
  status: TaskStatus,
  result: string
): void {
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error("Task ID must be a positive integer.");
  }

  if (!["pending", "completed", "failed"].includes(status)) {
    throw new Error("Invalid task status.");
  }

  if (typeof result !== "string" || result.length > 10_000) {
    throw new Error("Task result must be a string of at most 10,000 characters.");
  }

  const now = new Date().toISOString();

  const updated = database.prepare(`
    UPDATE tasks
    SET status = ?, result = ?, updated_at = ?
    WHERE id = ?
  `).run(status, result, now, id);

  if (Number(updated.changes) === 0) {
    throw new Error(`Task ${id} was not found.`);
  }
}

export function saveProjectCheck(
  check: ProjectCheckInput
): number {
  if (
    typeof check.projectName !== "string" ||
    !check.projectName.trim() ||
    typeof check.projectPath !== "string" ||
    !check.projectPath.trim()
  ) {
    throw new Error("Project name and path are required.");
  }

  if (
    !["completed", "incomplete", "failed"].includes(check.status)
  ) {
    throw new Error("Invalid project-check status.");
  }

  if (
    !Number.isSafeInteger(check.fileCount) ||
    check.fileCount < 0 ||
    !Number.isSafeInteger(check.directoryCount) ||
    check.directoryCount < 0
  ) {
    throw new Error("Project-check counts must be non-negative integers.");
  }

  if (
    typeof check.checkedAt !== "string" ||
    !Number.isFinite(Date.parse(check.checkedAt))
  ) {
    throw new Error("Project-check timestamp must be a valid date.");
  }

  if (
    !Array.isArray(check.errors) ||
    !check.errors.every((error) => typeof error === "string")
  ) {
    throw new Error("Project-check errors must be an array of strings.");
  }

  const statement = database.prepare(`
    INSERT INTO project_checks (
      project_name,
      project_path,
      status,
      file_count,
      directory_count,
      checked_at,
      errors
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const saved = statement.run(
    check.projectName.trim(),
    check.projectPath.trim(),
    check.status,
    check.fileCount,
    check.directoryCount,
    check.checkedAt,
    JSON.stringify(check.errors)
  );

  return Number(saved.lastInsertRowid);
}

export function listProjectChecks(): ProjectCheckRecord[] {
  return database.prepare(`
    SELECT
      id,
      project_name,
      project_path,
      status,
      file_count,
      directory_count,
      checked_at,
      errors
    FROM project_checks
    ORDER BY id DESC
    LIMIT 10
  `).all() as unknown as ProjectCheckRecord[];
}
