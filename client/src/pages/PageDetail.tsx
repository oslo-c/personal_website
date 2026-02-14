import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import { Seo } from "@/components/Seo";
import { usePageBySlug } from "@/hooks/use-pages";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { SectionHeader } from "@/components/SectionHeader";
import { DocSection } from "@/components/DocSection";
import { Prose } from "@/components/Prose";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Link2 } from "lucide-react";

export default function PageDetail() {
  const [, params] = useRoute("/p/:slug");
  const slug = params?.slug;

  const query = usePageBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (query.isLoading) {
    return (
      <div className="surface-grid">
        <Seo title="Page — Ethan Hamilton" description="Page content." />
        <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <LoadingState data-testid="loading-page-detail" lines={10} />
        </main>
      </div>
    );
  }

  if (query.error) {
    return (
      <div className="surface-grid">
        <Seo title="Page — Ethan Hamilton" description="Page content." />
        <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <ErrorState
            data-testid="error-page-detail"
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
        <Seo title="Page not found — Ethan Hamilton" description="This page could not be found." />
        <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <EmptyState
            data-testid="empty-page-detail"
            title="Page not found"
            description="The slug may be missing or the item is not available."
            icon={<FileText className="h-5 w-5 text-muted-foreground" />}
            actionLabel="Go home"
            onAction={() => (window.location.href = "/")}
          />
        </main>
      </div>
    );
  }

  const p = query.data;

  return (
    <div className="surface-grid">
      <Seo title={`${p.title} — Ethan Hamilton`} description={(p.summary ?? p.content).slice(0, 160)} />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <Link href="/" className="inline-flex" data-testid="link-back-home">
            <Button variant="outline" onClick={() => {}}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.navigator.clipboard?.writeText?.(window.location.href)}
            data-testid="button-copy-page-url"
          >
            <Link2 className="mr-2 h-4 w-4" />
            Copy URL
          </Button>
        </div>

        <SectionHeader
          eyebrow={`Page • /p/${p.slug}`}
          title={p.title}
          description={p.summary ?? "A site page."}
          data-testid="page-detail-header"
        />

        <div className="mt-6 grid gap-4">
          <DocSection title="Content" eyebrow="01" data-testid="page-content" collapsible defaultOpen>
            <Prose content={p.content} />
          </DocSection>

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
            <Link href="/" className="inline-flex" data-testid="link-page-back-bottom">
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
