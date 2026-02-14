import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Seo } from "@/components/Seo";
import { SectionHeader } from "@/components/SectionHeader";
import { useProjects } from "@/hooks/use-projects";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, FolderKanban, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SortMode = "recent" | "title";

export default function Projects() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("recent");

  const query = useProjects({ search: search.trim() ? search.trim() : undefined });

  const items = useMemo(() => {
    const data = query.data ?? [];
    const sorted = data.slice();
    if (sort === "recent") {
      sorted.sort((a, b) => (b.updatedAt?.getTime?.() ?? 0) - (a.updatedAt?.getTime?.() ?? 0));
    } else {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [query.data, sort]);

  return (
    <div className="surface-grid">
      <Seo title="Projects — Ethan Hamilton" description="Projects written like engineering documentation." />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Projects"
          title="Engineering documentation"
          description="Overview, architecture, technical decisions, stack, and links—kept explicit."
          data-testid="projects-header"
          right={
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setSort((s) => (s === "recent" ? "title" : "recent"))}
                data-testid="button-projects-sort"
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort: {sort === "recent" ? "Recent" : "Title"}
              </Button>
            </div>
          }
        />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xl flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search projects…"
              className="pl-9"
              data-testid="input-projects-search"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setSearch("")}
              data-testid="button-clear-projects-search"
              disabled={!search}
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        <div className="mt-6">
          {query.isLoading ? (
            <LoadingState data-testid="loading-projects" />
          ) : query.error ? (
            <ErrorState
              data-testid="error-projects"
              message={(query.error as Error).message}
              onRetry={() => query.refetch()}
            />
          ) : items.length === 0 ? (
            <EmptyState
              data-testid="empty-projects"
              title="No projects found"
              description="Try adjusting your search or check the backend seed data."
              icon={<FolderKanban className="h-5 w-5 text-muted-foreground" />}
              actionLabel="Reset"
              onAction={() => setSearch("")}
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {items.map((p) => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className={cn("block rounded-lg border bg-card shadow-sm hover-elevate active-elevate-2")}
                  data-testid={`project-card-${p.slug}`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-base font-semibold tracking-tight">{p.title}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{p.oneLiner}</div>
                      </div>
                      <div className="mono-chip">
                        <span className="font-mono">updated</span>
                        <span className="font-mono">
                          {p.updatedAt ? p.updatedAt.toISOString().slice(0, 10) : "—"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-md border bg-muted/40 p-3">
                        <div className="text-xs font-medium text-muted-foreground">Slug</div>
                        <div className="mt-1 font-mono text-xs text-foreground">/projects/{p.slug}</div>
                      </div>
                      <div className="rounded-md border bg-muted/40 p-3">
                        <div className="text-xs font-medium text-muted-foreground">Tech stack</div>
                        <div className="mt-1 line-clamp-1 font-mono text-xs text-foreground">
                          {p.techStack || "—"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm font-medium">
                      Open doc <span className="text-muted-foreground">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
