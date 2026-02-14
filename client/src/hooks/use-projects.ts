import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

const projectSchemaCoerced = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  oneLiner: z.string(),
  overview: z.string(),
  architecture: z.string().nullable().optional(),
  technicalDecisions: z.string().nullable().optional(),
  techStack: z.string().nullable().optional(),
  links: z.string().nullable().optional(),
  lessonsLearned: z.string().nullable().optional(),
  updatedAt: z.coerce.date(),
});

export function useProjects(params?: { search?: string }) {
  return useQuery({
    queryKey: [api.projects.list.path, params?.search ?? ""],
    queryFn: async () => {
      const url =
        params?.search && params.search.trim().length > 0
          ? `${api.projects.list.path}?${new URLSearchParams({ search: params.search.trim() }).toString()}`
          : api.projects.list.path;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch projects");
      const json = await res.json();

      const schema = z.array(projectSchemaCoerced);
      return parseWithLogging(schema, json, "projects.list");
    },
  });
}

export function useProjectBySlug(slug?: string) {
  return useQuery({
    queryKey: [api.projects.getBySlug.path, slug ?? ""],
    enabled: !!slug,
    queryFn: async () => {
      const url = buildUrl(api.projects.getBySlug.path, { slug: String(slug) });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch project");
      const json = await res.json();
      return parseWithLogging(projectSchemaCoerced, json, "projects.getBySlug");
    },
  });
}
