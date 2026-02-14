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

export function usePages(params?: { search?: string }) {
  return useQuery({
    queryKey: [api.pages.list.path, params?.search ?? ""],
    queryFn: async () => {
      const url =
        params?.search && params.search.trim().length > 0
          ? `${api.pages.list.path}?${new URLSearchParams({ search: params.search.trim() }).toString()}`
          : api.pages.list.path;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch pages");
      const json = await res.json();

      // Coerce date fields because JSON returns strings
      const coerceSchema = api.pages.list.responses[200].transform((items) => items).pipe(
        z.array(
          z.object({
            id: z.number(),
            slug: z.string(),
            title: z.string(),
            summary: z.string().nullable().optional(),
            content: z.string(),
            updatedAt: z.coerce.date(),
          }),
        ),
      );

      return parseWithLogging(coerceSchema, json, "pages.list");
    },
  });
}

export function usePageBySlug(slug?: string) {
  return useQuery({
    queryKey: [api.pages.getBySlug.path, slug ?? ""],
    enabled: !!slug,
    queryFn: async () => {
      const url = buildUrl(api.pages.getBySlug.path, { slug: String(slug) });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch page");

      const json = await res.json();
      const coerceSchema = z.object({
        id: z.number(),
        slug: z.string(),
        title: z.string(),
        summary: z.string().nullable().optional(),
        content: z.string(),
        updatedAt: z.coerce.date(),
      });

      return parseWithLogging(coerceSchema, json, "pages.getBySlug");
    },
  });
}
