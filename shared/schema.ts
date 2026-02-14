import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sitePages = pgTable("site_pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary"),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: text("title").notNull(),
  oneLiner: text("one_liner").notNull(),
  overview: text("overview").notNull(),
  architecture: text("architecture"),
  technicalDecisions: text("technical_decisions"),
  techStack: text("tech_stack"),
  links: text("links"),
  lessonsLearned: text("lessons_learned"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const labNotes = pgTable("lab_notes", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSitePageSchema = createInsertSchema(sitePages).omit({
  id: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  updatedAt: true,
});

export const insertLabNoteSchema = createInsertSchema(labNotes).omit({
  id: true,
  updatedAt: true,
});

export type SitePage = typeof sitePages.$inferSelect;
export type InsertSitePage = z.infer<typeof insertSitePageSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type LabNote = typeof labNotes.$inferSelect;
export type InsertLabNote = z.infer<typeof insertLabNoteSchema>;

// === EXPLICIT API CONTRACT TYPES ===

export type CreateSitePageRequest = InsertSitePage;
export type UpdateSitePageRequest = Partial<InsertSitePage>;
export type SitePageResponse = SitePage;
export type SitePagesListResponse = SitePage[];

export type CreateProjectRequest = InsertProject;
export type UpdateProjectRequest = Partial<InsertProject>;
export type ProjectResponse = Project;
export type ProjectsListResponse = Project[];

export type CreateLabNoteRequest = InsertLabNote;
export type UpdateLabNoteRequest = Partial<InsertLabNote>;
export type LabNoteResponse = LabNote;
export type LabNotesListResponse = LabNote[];

export interface ListQueryParams {
  search?: string;
}
