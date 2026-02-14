import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Seo } from "@/components/Seo";
import { SectionHeader } from "@/components/SectionHeader";
import { useLabNotes } from "@/hooks/use-lab-notes";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FlaskConical, Search, X } from "lucide-react";

export default function LabNotes() {
  const [search, setSearch] = useState("");
  const query = useLabNotes({ search: search.trim() ? search.trim() : undefined });

  const items = useMemo(() => {
    const data = query.data ?? [];
    const sorted = data.slice().sort((a, b) => (b.date?.getTime?.() ?? 0) - (a.date?.getTime?.() ?? 0));
    return sorted;
  }, [query.data]);

  return (
    <div className="surface-grid">
      <Seo title="Lab Notes — Ethan Hamilton" description="Short, chronological engineering notes." />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Lab notes"
          title="Chronological entries"
          description="Experiments, implementation notes, and small findings—kept close to the work."
          data-testid="lab-notes-header"
          right={
            <div className="mono-chip">
              <span className="font-mono">/</span> opens palette
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
              placeholder="Search lab notes…"
              className="pl-9"
              data-testid="input-lab-notes-search"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setSearch("")}
            data-testid="button-clear-lab-notes-search"
            disabled={!search}
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>

        <div className="mt-6">
          {query.isLoading ? (
            <LoadingState data-testid="loading-lab-notes" />
          ) : query.error ? (
            <ErrorState
              data-testid="error-lab-notes"
              message={(query.error as Error).message}
              onRetry={() => query.refetch()}
            />
          ) : items.length === 0 ? (
            <EmptyState
              data-testid="empty-lab-notes"
              title="No lab notes found"
              description="Try a different search or seed /api/lab-notes."
              icon={<FlaskConical className="h-5 w-5 text-muted-foreground" />}
              actionLabel="Reset"
              onAction={() => setSearch("")}
            />
          ) : (
            <div className="grid gap-3">
              {items.map((n) => (
                <Link
                  key={n.slug}
                  href={`/lab-notes/${n.slug}`}
                  className="block rounded-lg border bg-card shadow-sm hover-elevate active-elevate-2"
                  data-testid={`lab-note-row-${n.slug}`}
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{n.title}</div>
                        <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{n.content}</div>
                      </div>
                      <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                        <span className="mono-chip">
                          {n.date ? n.date.toISOString().slice(0, 10) : "—"}
                        </span>
                        <span className="mono-chip">/lab-notes/{n.slug}</span>
                      </div>
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
