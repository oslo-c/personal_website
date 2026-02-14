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

const labNoteSchemaCoerced = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  date: z.coerce.date(),
  content: z.string(),
  updatedAt: z.coerce.date(),
});

export function useLabNotes(params?: { search?: string }) {
  return useQuery({
    queryKey: [api.labNotes.list.path, params?.search ?? ""],
    queryFn: async () => {
      const url =
        params?.search && params.search.trim().length > 0
          ? `${api.labNotes.list.path}?${new URLSearchParams({ search: params.search.trim() }).toString()}`
          : api.labNotes.list.path;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch lab notes");
      const json = await res.json();

      const schema = z.array(labNoteSchemaCoerced);
      return parseWithLogging(schema, json, "labNotes.list");
    },
  });
}

export function useLabNoteBySlug(slug?: string) {
  return useQuery({
    queryKey: [api.labNotes.getBySlug.path, slug ?? ""],
    enabled: !!slug,
    queryFn: async () => {
      const url = buildUrl(api.labNotes.getBySlug.path, { slug: String(slug) });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch lab note");
      const json = await res.json();

      return parseWithLogging(labNoteSchemaCoerced, json, "labNotes.getBySlug");
    },
  });
}
