import { useEffect, useMemo } from "react";
import { Link, useRoute } from "wouter";
import { Seo } from "@/components/Seo";
import { useProjectBySlug } from "@/hooks/use-projects";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { SectionHeader } from "@/components/SectionHeader";
import { DocSection } from "@/components/DocSection";
import { Prose } from "@/components/Prose";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, FolderKanban, Link2 } from "lucide-react";

function parseLinks(raw?: string | null): { label: string; url: string }[] {
  if (!raw) return [];
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const items: { label: string; url: string }[] = [];
  for (const line of lines) {
    // formats:
    // - "Label: https://..."
    // - "https://..."
    const m = line.match(/^(.+?):\s*(https?:\/\/\S+)$/i);
    if (m) items.push({ label: m[1].trim(), url: m[2].trim() });
    else if (/^https?:\/\//i.test(line)) items.push({ label: "Link", url: line });
    else items.push({ label: line, url: line });
  }
  return items.slice(0, 8);
}

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:slug");
  const slug = params?.slug;

  const query = useProjectBySlug(slug);

  const links = useMemo(() => parseLinks(query.data?.links), [query.data?.links]);

  useEffect(() => {
    // Scroll to top on new slug
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (query.isLoading) {
    return (
      <div className="surface-grid">
        <Seo title="Project — Ethan Hamilton" description="Project details." />
        <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <LoadingState data-testid="loading-project-detail" lines={10} />
        </main>
      </div>
    );
  }

  if (query.error) {
    return (
      <div className="surface-grid">
        <Seo title="Project — Ethan Hamilton" description="Project details." />
        <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <ErrorState
            data-testid="error-project-detail"
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
        <Seo title="Project not found — Ethan Hamilton" description="This project could not be found." />
        <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <EmptyState
            data-testid="empty-project-detail"
            title="Project not found"
            description="The slug may be missing or the item is not available."
            icon={<FolderKanban className="h-5 w-5 text-muted-foreground" />}
            actionLabel="Back to projects"
            onAction={() => (window.location.href = "/projects")}
          />
        </main>
      </div>
    );
  }

  const p = query.data;

  return (
    <div className="surface-grid">
      <Seo title={`${p.title} — Projects — Ethan Hamilton`} description={p.oneLiner} />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/projects" className="inline-flex" data-testid="link-back-projects">
            <Button variant="outline" onClick={() => {}} /* wouter handles */>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Projects
            </Button>
          </Link>
        </div>

        <SectionHeader
          eyebrow={`Project • /projects/${p.slug}`}
          title={p.title}
          description={p.oneLiner}
          data-testid="project-detail-header"
          right={
            links.length ? (
              <Button
                variant="outline"
                onClick={() => window.open(links[0].url, "_blank", "noopener,noreferrer")}
                data-testid="button-project-primary-link"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open link
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => window.navigator.clipboard?.writeText?.(window.location.href)}
                data-testid="button-copy-project-url"
              >
                <Link2 className="mr-2 h-4 w-4" />
                Copy URL
              </Button>
            )
          }
        />

        <div className="mt-6 grid gap-4">
          <DocSection
            title="Overview"
            eyebrow="01"
            data-testid="project-overview"
            collapsible
            defaultOpen
          >
            <Prose content={p.overview} />
          </DocSection>

          {p.architecture ? (
            <DocSection
              title="Architecture"
              eyebrow="02"
              data-testid="project-architecture"
              collapsible
              defaultOpen={false}
            >
              <Prose content={p.architecture} />
            </DocSection>
          ) : null}

          {p.technicalDecisions ? (
            <DocSection
              title="Technical decisions"
              eyebrow="03"
              data-testid="project-decisions"
              collapsible
              defaultOpen={false}
            >
              <Prose content={p.technicalDecisions} />
            </DocSection>
          ) : null}

          {p.techStack ? (
            <DocSection title="Tech stack" eyebrow="04" data-testid="project-tech" collapsible defaultOpen={false}>
              <div className="rounded-md border bg-muted/40 p-4">
                <div className="mono-chip w-fit">stack</div>
                <div className="mt-2 font-mono text-sm text-foreground">{p.techStack}</div>
              </div>
            </DocSection>
          ) : null}

          {links.length ? (
            <DocSection title="Links" eyebrow="05" data-testid="project-links" collapsible defaultOpen={false}>
              <div className="grid gap-2">
                {links.map((l, idx) => (
                  <button
                    key={`${l.url}-${idx}`}
                    onClick={() => window.open(l.url, "_blank", "noopener,noreferrer")}
                    className="flex w-full items-center justify-between gap-3 rounded-md border bg-card px-4 py-3 text-left shadow-sm hover-elevate active-elevate-2"
                    data-testid={`button-project-link-${idx}`}
                    type="button"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{l.label}</div>
                      <div className="mt-1 truncate font-mono text-xs text-muted-foreground">{l.url}</div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </DocSection>
          ) : null}

          {p.lessonsLearned ? (
            <DocSection
              title="Lessons learned"
              eyebrow="06"
              data-testid="project-lessons"
              collapsible
              defaultOpen={false}
            >
              <Prose content={p.lessonsLearned} />
            </DocSection>
          ) : null}

          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-4 sm:p-5">
              <div className="mono-chip w-fit">Metadata</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border bg-muted/40 p-3">
                  <div className="text-xs font-medium text-muted-foreground">Slug</div>
                  <div className="mt-1 font-mono text-xs text-foreground">{p.slug}</div>
                </div>
                <div className="rounded-md border bg-muted/40 p-3">
                  <div className="text-xs font-medium text-muted-foreground">Updated</div>
                  <div className="mt-1 font-mono text-xs text-foreground">
                    {p.updatedAt ? p.updatedAt.toISOString() : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/projects" className="inline-flex" data-testid="link-project-detail-back-bottom">
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
