import type { Express } from "express";
import type { Server } from "http";
import { z } from "zod";
import { api } from "@shared/routes";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  await storage.seedIfEmpty();

  app.get(api.pages.list.path, async (req, res) => {
    const query = api.pages.list.input?.parse({
      search: typeof req.query.search === "string" ? req.query.search : undefined,
    });
    const pages = await storage.listPages(query);
    return res.json(pages);
  });

  app.get(api.pages.getBySlug.path, async (req, res) => {
    const page = await storage.getPageBySlug(req.params.slug);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    return res.json(page);
  });

  app.get(api.projects.list.path, async (req, res) => {
    const query = api.projects.list.input?.parse({
      search: typeof req.query.search === "string" ? req.query.search : undefined,
    });
    const items = await storage.listProjects(query);
    return res.json(items);
  });

  app.get(api.projects.getBySlug.path, async (req, res) => {
    const item = await storage.getProjectBySlug(req.params.slug);
    if (!item) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json(item);
  });

  app.get(api.labNotes.list.path, async (req, res) => {
    const query = api.labNotes.list.input?.parse({
      search: typeof req.query.search === "string" ? req.query.search : undefined,
    });
    const items = await storage.listLabNotes(query);
    return res.json(items);
  });

  app.get(api.labNotes.getBySlug.path, async (req, res) => {
    const item = await storage.getLabNoteBySlug(req.params.slug);
    if (!item) {
      return res.status(404).json({ message: "Lab note not found" });
    }
    return res.json(item);
  });

  app.use((err: unknown, _req: unknown, res: any, _next: any) => {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: err.errors[0]?.message ?? "Invalid request",
        field: err.errors[0]?.path?.join("."),
      });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  });

  return httpServer;
}
