import { z } from "zod";
import { insertLabNoteSchema, insertProjectSchema, insertSitePageSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

const listQuerySchema = z
  .object({
    search: z.string().optional(),
  })
  .optional();

export const api = {
  pages: {
    list: {
      method: "GET" as const,
      path: "/api/pages" as const,
      input: listQuerySchema,
      responses: {
        200: z.array(insertSitePageSchema.extend({ id: z.number(), updatedAt: z.date() })),
      },
    },
    getBySlug: {
      method: "GET" as const,
      path: "/api/pages/:slug" as const,
      responses: {
        200: insertSitePageSchema.extend({ id: z.number(), updatedAt: z.date() }),
        404: errorSchemas.notFound,
      },
    },
  },
  projects: {
    list: {
      method: "GET" as const,
      path: "/api/projects" as const,
      input: listQuerySchema,
      responses: {
        200: z.array(insertProjectSchema.extend({ id: z.number(), updatedAt: z.date() })),
      },
    },
    getBySlug: {
      method: "GET" as const,
      path: "/api/projects/:slug" as const,
      responses: {
        200: insertProjectSchema.extend({ id: z.number(), updatedAt: z.date() }),
        404: errorSchemas.notFound,
      },
    },
  },
  labNotes: {
    list: {
      method: "GET" as const,
      path: "/api/lab-notes" as const,
      input: listQuerySchema,
      responses: {
        200: z.array(insertLabNoteSchema.extend({ id: z.number(), updatedAt: z.date() })),
      },
    },
    getBySlug: {
      method: "GET" as const,
      path: "/api/lab-notes/:slug" as const,
      responses: {
        200: insertLabNoteSchema.extend({ id: z.number(), updatedAt: z.date(), date: z.date() }),
        404: errorSchemas.notFound,
      },
    },
  },
} as const;

export function buildUrl(
  path: string,
  params?: Record<string, string | number>
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type PageListResponse = z.infer<typeof api.pages.list.responses[200]>;
export type PageResponse = z.infer<typeof api.pages.getBySlug.responses[200]>;

export type ProjectsListResponse = z.infer<typeof api.projects.list.responses[200]>;
export type ProjectResponse = z.infer<typeof api.projects.getBySlug.responses[200]>;

export type LabNotesListResponse = z.infer<typeof api.labNotes.list.responses[200]>;
export type LabNoteResponse = z.infer<typeof api.labNotes.getBySlug.responses[200]>;

export type ValidationError = z.infer<typeof errorSchemas.validation>;
export type NotFoundError = z.infer<typeof errorSchemas.notFound>;
export type InternalError = z.infer<typeof errorSchemas.internal>;
