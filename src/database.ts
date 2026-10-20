
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

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const dataDirectory = resolve(currentDirectory, "../data");
const databasePath = resolve(dataDirectory, "hub.db");

mkdirSync(dataDirectory, { recursive: true });

const database = new DatabaseSync(databasePath);

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

  if (result.length > 10_000) {
    throw new Error("Task result cannot exceed 10,000 characters.");
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
