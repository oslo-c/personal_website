import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import { Seo } from "@/components/Seo";
import { useLabNoteBySlug } from "@/hooks/use-lab-notes";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { SectionHeader } from "@/components/SectionHeader";
import { DocSection } from "@/components/DocSection";
import { Prose } from "@/components/Prose";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FlaskConical, Link2 } from "lucide-react";

export default function LabNoteDetail() {
  const [, params] = useRoute("/lab-notes/:slug");
  const slug = params?.slug;

  const query = useLabNoteBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (query.isLoading) {
    return (
      <div className="surface-grid">
        <Seo title="Lab note — Ethan Hamilton" description="Lab note details." />
        <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <LoadingState data-testid="loading-lab-note-detail" lines={10} />
        </main>
      </div>
    );
  }

  if (query.error) {
    return (
      <div className="surface-grid">
        <Seo title="Lab note — Ethan Hamilton" description="Lab note details." />
        <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <ErrorState
            data-testid="error-lab-note-detail"
            message={(query.error as Error).message}
            onRetry={() => query.refetch()}
          />
        </main>
      </div>
    );
  }

  if (!query.data) {
    return (
      <div className="surface-grid">
        <Seo title="Lab note not found — Ethan Hamilton" description="This lab note could not be found." />
        <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <EmptyState
            data-testid="empty-lab-note-detail"
            title="Lab note not found"
            description="The slug may be missing or the item is not available."
            icon={<FlaskConical className="h-5 w-5 text-muted-foreground" />}
            actionLabel="Back to lab notes"
            onAction={() => (window.location.href = "/lab-notes")}
          />
        </main>
      </div>
    );
  }

  const n = query.data;

  return (
    <div className="surface-grid">
      <Seo
        title={`${n.title} — Lab Notes — Ethan Hamilton`}
        description={(n.content || "").slice(0, 160)}
      />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <Link href="/lab-notes" className="inline-flex" data-testid="link-back-lab-notes">
            <Button variant="outline" onClick={() => {}}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Lab Notes
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.navigator.clipboard?.writeText?.(window.location.href)}
            data-testid="button-copy-lab-note-url"
          >
            <Link2 className="mr-2 h-4 w-4" />
            Copy URL
          </Button>
        </div>

        <SectionHeader
          eyebrow={`Lab note • ${n.date ? n.date.toISOString().slice(0, 10) : "—"} • /lab-notes/${n.slug}`}
          title={n.title}
          description="Short entry. Monospace reserved for code and system labels."
          data-testid="lab-note-detail-header"
        />

        <div className="mt-6 grid gap-4">
          <DocSection title="Entry" eyebrow="01" data-testid="lab-note-entry" collapsible defaultOpen>
            <Prose content={n.content} />
          </DocSection>

          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-4 sm:p-5">
              <div className="mono-chip w-fit">Metadata</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border bg-muted/40 p-3">
                  <div className="text-xs font-medium text-muted-foreground">Slug</div>
                  <div className="mt-1 font-mono text-xs text-foreground">{n.slug}</div>
                </div>
                <div className="rounded-md border bg-muted/40 p-3">
                  <div className="text-xs font-medium text-muted-foreground">Date</div>
                  <div className="mt-1 font-mono text-xs text-foreground">
                    {n.date ? n.date.toISOString() : "—"}
                  </div>
                </div>
                <div className="rounded-md border bg-muted/40 p-3">
                  <div className="text-xs font-medium text-muted-foreground">Updated</div>
                  <div className="mt-1 font-mono text-xs text-foreground">
                    {n.updatedAt ? n.updatedAt.toISOString() : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/lab-notes" className="inline-flex" data-testid="link-lab-note-back-bottom">
              <Button variant="outline" onClick={() => {}}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
