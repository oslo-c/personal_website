import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects } from "@/hooks/use-projects";
import { useLabNotes } from "@/hooks/use-lab-notes";
import { Seo } from "@/components/Seo";
import { SectionHeader } from "@/components/SectionHeader";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ArrowRight, FlaskConical } from "lucide-react";

export default function Home() {
  const projects = useProjects();
  const notes = useLabNotes();

  const selectedProjects = (projects.data ?? []).slice(0, 6);
  const latestNotes = (notes.data ?? [])
    .slice()
    .sort((a, b) => (b.date?.getTime?.() ?? 0) - (a.date?.getTime?.() ?? 0))
    .slice(0, 5);

  return (
    <div className="surface-grid">
      <Seo
        title="Ethan P Hamilton"
        description="Personal website of Ethan Hamilton: projects, portfolio, and notes."
      />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="rise-in" data-testid="home-hero">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="min-w-0">
              <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Building systems{" "}
              </h1>
              <h2 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl lg:text-xl">
                to automate operations and to extend human capability.
              </h2>
              <p className="mt-4 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
                Computer science student at the Paul Allen School of CSE. 
                I build AI-native systems that coordinate models, infrastructure, and people to accomplish
                complex work. My focus is on practical implementation and system design that scales with real
                world constraints and business goals.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Link href="/projects" className="inline-flex">
                  <Button data-testid="button-hero-projects">
                    Explore projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/lab-notes" className="inline-flex">
                  <Button variant="outline" data-testid="button-hero-lab-notes">
                    Read lab notes
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
                <CardTitle className="text-base">Fast navigation</CardTitle>
                <div className="mono-chip">
                  <span className="font-mono">/ or ⌘K</span>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Use the command palette to jump between pages, projects, and
                notes.
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="mt-10 hairline" />

        {/* CURRENT WORK */}
        <section className="mt-10" data-testid="home-current-work">
          <SectionHeader
            eyebrow="Active Work"
            title="Systems, organizations, and engagements I’m actively building."
            description=""
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card className="shadow-sm" data-testid="card-current-lilybrook">
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                <div>
                  <CardTitle className="text-base">Founder & President</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">Lilybrook Consulting</p>
                </div>
                <div className="mono-chip shrink-0">UW</div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p data-testid="text-current-lilybrook-desc">
                  Building a University of Washington student consulting organization focused on expanding access to
                  hands-on consulting experience through structured project teams and professional development.
                </p>
                <p className="mt-3" data-testid="text-current-lilybrook-systems">
                  Designed and implemented the club’s operational infrastructure, including the website,
                  membership systems, and internal coordination tools.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm" data-testid="card-current-independent">
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                <div>
                  <CardTitle className="text-base">Independent Consultant</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">Mountain Leisure Living</p>
                </div>
                <div className="mono-chip shrink-0">Active</div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p data-testid="text-current-independent-desc">
                  Designing operational systems and automation pipelines connecting CRM, scheduling,
                  and service-delivery workflows.
                </p>
                <p className="mt-3" data-testid="text-current-independent-impact">
                  Built the automation bridge from Zoho CRM to RouteManager, supporting 800+ service jobs per month
                  and improving reliability across the service pipeline.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="mt-10 hairline" />

        {/* SELECTED PROJECTS */}
        <section className="mt-10" data-testid="home-selected-projects">
          <SectionHeader
            eyebrow="Selected"
            title="Projects"
            description="Engineering documentation style: overview, architecture, decisions, and links."
          />

          <div className="mt-6">
            {projects.isLoading ? (
              <LoadingState data-testid="loading-selected-projects" />
            ) : projects.error ? (
              <ErrorState
                data-testid="error-selected-projects"
                message={(projects.error as Error).message}
                onRetry={() => projects.refetch()}
              />
            ) : selectedProjects.length === 0 ? (
              <EmptyState
                data-testid="empty-selected-projects"
                title="No projects loaded"
                description="Check the API response for /api/projects."
              />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {selectedProjects.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="block rounded-lg border bg-card shadow-sm hover-elevate active-elevate-2"
                    data-testid={`card-project-${p.slug}`}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-base font-semibold tracking-tight">
                            {p.title}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {p.oneLiner}
                          </div>
                        </div>
                        <div className="mono-chip">
                          <span className="font-mono">/projects/{p.slug}</span>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <div className="rounded-md border bg-muted/40 p-3">
                          <div className="text-xs font-medium text-muted-foreground">
                            Updated
                          </div>
                          <div className="mt-1 font-mono text-xs text-foreground">
                            {p.updatedAt
                              ? p.updatedAt.toISOString().slice(0, 10)
                              : "—"}
                          </div>
                        </div>
                        <div className="rounded-md border bg-muted/40 p-3">
                          <div className="text-xs font-medium text-muted-foreground">
                            Tech
                          </div>
                          <div className="mt-1 line-clamp-1 font-mono text-xs text-foreground">
                            {p.techStack || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
                        <span>Open documentation</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="mt-10 hairline" />

        {/* LAB NOTES */}
        <section className="mt-10" data-testid="home-lab-notes">
          <SectionHeader
            eyebrow="Chronological"
            title="Lab notes"
            description="Short entries: experiments, findings, and implementation details."
            right={
              <Link href="/lab-notes" className="inline-flex">
                <Button variant="outline" data-testid="button-home-all-notes">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            }
          />

          <div className="mt-6">
            {notes.isLoading ? (
              <LoadingState data-testid="loading-home-notes" />
            ) : notes.error ? (
              <ErrorState
                data-testid="error-home-notes"
                message={(notes.error as Error).message}
                onRetry={() => notes.refetch()}
              />
            ) : latestNotes.length === 0 ? (
              <EmptyState
                data-testid="empty-home-notes"
                title="No lab notes yet"
                description="Once /api/lab-notes returns items, they'll show up here."
                icon={
                  <FlaskConical className="h-5 w-5 text-muted-foreground" />
                }
              />
            ) : (
              <div className="grid gap-3">
                {latestNotes.map((n) => (
                  <Link
                    key={n.slug}
                    href={`/lab-notes/${n.slug}`}
                    className="block rounded-lg border bg-card shadow-sm hover-elevate active-elevate-2"
                    data-testid={`row-home-note-${n.slug}`}
                  >
                    <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">
                          {n.title}
                        </div>
                        <div className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {n.content}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                        <span className="mono-chip">
                          {n.date ? n.date.toISOString().slice(0, 10) : "—"}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="mt-10 hairline" />

        {/* RESUME TEASER */}
        <section className="mt-10" data-testid="home-resume">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
              <CardTitle className="text-base">Resume</CardTitle>
              <Link href="/resume" className="inline-flex">
                <Button variant="outline" data-testid="button-home-resume">
                  Open
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              A compact view of experience and strengths. Downloadable PDF (if
              present) and a readable in-page version.
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
