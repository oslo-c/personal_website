import { Link } from "wouter";
import { Seo } from "@/components/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="surface-grid">
      <Seo title="404 — Ethan Hamilton" description="Page not found." />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <Card className="shadow-sm" data-testid="not-found-card">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-md border bg-card shadow-sm">
              <FileQuestion className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="mt-4 text-lg font-semibold tracking-tight">Not found</div>
            <div className="mt-2 max-w-md text-sm text-muted-foreground">
              The route doesn’t exist—or the content hasn’t been published yet.
            </div>
            <div className="mt-6">
              <Link href="/" className="inline-flex" data-testid="link-not-found-home">
                <Button onClick={() => {}}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
