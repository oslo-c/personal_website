import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

export function ResumeCard() {
  const onDownload = () => {
    // If no file exists, this will 404 (acceptable per spec).
    window.open("/resume.pdf", "_blank", "noopener,noreferrer");
  };

  const onOpenLinkedIn = () => {
    window.open("https://www.linkedin.com/", "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="shadow-sm" data-testid="resume-card">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="text-base">Resume</CardTitle>
          <div className="mt-1 text-sm text-muted-foreground">
            A concise, engineering-forward snapshot.
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={onOpenLinkedIn} data-testid="button-open-linkedin">
            <ExternalLink className="mr-2 h-4 w-4" />
            LinkedIn
          </Button>
          <Button onClick={onDownload} data-testid="button-download-resume">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border bg-muted/40 p-4">
            <div className="mono-chip w-fit">Focus</div>
            <div className="mt-2 text-foreground">
              Systems thinking, product engineering, and pragmatic research prototypes.
            </div>
          </div>
          <div className="rounded-md border bg-muted/40 p-4">
            <div className="mono-chip w-fit">Working style</div>
            <div className="mt-2 text-foreground">
              Clear interfaces, tight feedback loops, minimal surprise.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
