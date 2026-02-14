import { Seo } from "@/components/Seo";
import { SectionHeader } from "@/components/SectionHeader";
import { ResumeCard } from "@/components/ResumeCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Download, FileText } from "lucide-react";

export default function Resume() {
  const onDownload = () => {
    window.open("/resume.pdf", "_blank", "noopener,noreferrer");
  };

  const onPrint = () => {
    window.print();
  };

  return (
    <div className="surface-grid">
      <Seo title="Resume — Ethan Hamilton" description="Resume, downloadable PDF and readable in-page summary." />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Resume"
          title="Readable, printable, exportable"
          description="A tight summary. PDF download if available; otherwise this page stands on its own."
          data-testid="resume-header"
          right={
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={onDownload} data-testid="button-resume-download">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={onPrint} data-testid="button-resume-print">
                <FileText className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          }
        />

        <div className="mt-6 grid gap-4">
          <ResumeCard />

          <Card className="shadow-sm" data-testid="resume-inpage">
            <CardContent className="p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border bg-muted/40 p-4">
                  <div className="mono-chip w-fit">Core strengths</div>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li>Interface design (types, contracts, systems)</li>
                    <li>Product engineering (polish, UX, iteration)</li>
                    <li>Documentation (decisions, tradeoffs, runbooks)</li>
                  </ul>
                </div>
                <div className="rounded-md border bg-muted/40 p-4">
                  <div className="mono-chip w-fit">Signals</div>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li>Small, composable building blocks</li>
                    <li>Explicit error handling</li>
                    <li>Measured motion; predictable UI</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 rounded-md border bg-card p-4 shadow-sm">
                <div className="text-sm font-semibold">Want to see work?</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Projects are written in a documentation style—easy to scan, easy to trust.
                </div>
                <div className="mt-4">
                  <Link href="/projects" className="inline-flex">
                    <Button variant="outline" data-testid="button-resume-projects">
                      Browse projects
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
