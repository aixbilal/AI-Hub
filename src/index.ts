import { existsSync } from "node:fs";
import { cpus, freemem, platform, release, totalmem } from "node:os";
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { askOllama } from "./ollama.js";
import {
  createTask,
  listTasks,
  updateTask
} from "./database.js";

const projectRoots = [
  { name: "Account OS", path: "E:\\Account OS" },
  { name: "AIxBilal Projects", path: "E:\\AIxBilal Projects" },
  { name: "Le Grain OS", path: "E:\\Le Grain OS" },
  { name: "Performance Buddy OS", path: "E:\\Performance Buddy OS" },
  { name: "TinyTots OS", path: "E:\\TINYTOTS OS" }
];

serveStdio(() => {
  const server = new McpServer({
    name: "aixbilal-ai-hub",
    version: "0.1.0"
  });

  server.registerTool(
    "hub_status",
    {
      description: "Return basic runtime and system resource information for the local AI Hub.",
      inputSchema: z.object({})
    },
    async () => {
      const status = {
        hub: "AI Hub",
        version: "0.1.0",
        status: "running",
        platform: platform(),
        osRelease: release(),
        nodeVersion: process.version,
        logicalCpuCount: cpus().length,
        totalSystemMemoryGB: Number((totalmem() / 1024 ** 3).toFixed(1)),
        freeSystemMemoryGB: Number((freemem() / 1024 ** 3).toFixed(1)),
        timestamp: new Date().toISOString()
      };

      return {
        content: [
          { type: "text", text: JSON.stringify(status, null, 2) }
        ]
      };
    }
  );

  server.registerTool(
    "list_project_roots",
    {
      description: "List the configured AIxBilal project folders and whether each exists. Does not read project files.",
      inputSchema: z.object({})
    },
    async () => {
      const roots = projectRoots.map((project) => ({
        name: project.name,
        path: project.path,
        exists: existsSync(project.path)
      }));

      return {
        content: [
          { type: "text", text: JSON.stringify(roots, null, 2) }
        ]
      };
    }
  );
  server.registerTool(
    "ask_local_ai",
    {
      description:
        "Ask the local Qwen3 model a question. Generates an answer without performing actions.",
      inputSchema: z.object({
        prompt: z.string().min(1).max(4000)
      })
    },
    async ({ prompt }) => {
      try {
        const answer = await askOllama(prompt);

        return {
          content: [{ type: "text", text: answer }]
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";

        return {
          content: [
            { type: "text", text: `Local AI request failed: ${message}` }
          ],
          isError: true
        };
      }
    }
  );
  
  server.registerTool(
    "create_task",
    {
      description: "Save a new task in the local AI Hub database.",
      inputSchema: z.object({
        title: z.string().trim().min(1).max(500)
      })
    },
    async ({ title }) => {
      try {
        const id = createTask(title);

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              id,
              title: title.trim(),
              status: "pending"
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: error instanceof Error ? error.message : "Could not create task."
          }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    "list_tasks",
    {
      description: "List the latest saved AI Hub tasks.",
      inputSchema: z.object({})
    },
    async () => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify(listTasks(), null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: error instanceof Error ? error.message : "Could not list tasks."
          }],
          isError: true
        };
      }
    }
  );

  
  server.registerTool(
    "hub_review",
    {
      description:
        "Summarize saved AI Hub tasks by status and identify pending work. Read-only; does not change tasks.",
      inputSchema: z.object({})
    },
    async () => {
      try {
        const tasks = listTasks();

        const pending = tasks.filter(
          (task) => task.status === "pending"
        );
        const completed = tasks.filter(
          (task) => task.status === "completed"
        );
        const failed = tasks.filter(
          (task) => task.status === "failed"
        );

        const report = {
          generatedAt: new Date().toISOString(),
          totalTasks: tasks.length,
          counts: {
            pending: pending.length,
            completed: completed.length,
            failed: failed.length
          },
          needsAttention: pending.map((task) => ({
            id: task.id,
            title: task.title,
            status: task.status
          })),
          recentTasks: tasks.slice(0, 10).map((task) => ({
            id: task.id,
            title: task.title,
            status: task.status,
            result: task.result,
            updatedAt: task.updated_at
          }))
        };

        return {
          content: [{
            type: "text",
            text: JSON.stringify(report, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: error instanceof Error
              ? error.message
              : "Could not generate the review report."
          }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    "update_task",
    {
      description: "Update a saved task's status and result.",
      inputSchema: z.object({
        id: z.number().int().positive(),
        status: z.enum(["pending", "completed", "failed"]),
        result: z.string().max(10000)
      })
    },
    async ({ id, status, result }) => {
      try {
        updateTask(id, status, result);

        return {
          content: [{
            type: "text",
            text: `Task ${id} updated to ${status}.`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: error instanceof Error ? error.message : "Could not update task."
          }],
          isError: true
        };
      }
    }
  );

  return server;
});
