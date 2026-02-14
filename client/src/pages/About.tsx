import { Seo } from "@/components/Seo";
import { SectionHeader } from "@/components/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Prose } from "@/components/Prose";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Mail, MapPin, Terminal } from "lucide-react";

export default function About() {
  const onEmail = () => {
    window.location.href = "mailto:hamil4@uw.edu";
  };

  return (
    <div className="surface-grid">
      <Seo title="About — Ethan Hamilton" description="Systems engineer at UW building AI-augmented software and infrastructure." />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="About"
          title="Automation for Human Potential."
          description="A personal note on my approach to engineering and business automation."
          data-testid="about-header"
          right={
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={onEmail} data-testid="button-about-email">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Link href="/projects" className="inline-flex">
                <Button data-testid="button-about-projects">
                  Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          }
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="shadow-sm lg:col-span-2">
            <CardContent className="p-5">
              <Prose
                data-testid="about-prose"
                content={[
                  "## Mission",
                  "I build AI-driven systems to implement AI-driven systems. My objective is to maximize human creativity, productivity, and potential through strategic automation that maps directly to real-world business goals.",
                  "",
                  "## Systems Strategy",
                  "I treat technology as a substrate for operational excellence. I approach engineering by identifying the constraints and leverage points where automation can shift the ceiling of what a team can produce. For me, computer science is the tool; business outcomes are the measure.",
                  "",
                  "## Team & Rigor",
                  "Working with a team in a rigorous environment is not new for me. Whether it's 12 years of competitive baseball, four years of national-level Policy Debate, or leading Lilybrook Consulting at UW, I invest in the people around me, not just the work in front of me.",
                  "",
                  "## Impact",
                  "I build tools that people actually use in environments with real-world consequences. From automating SLA workflows for field-service businesses to designing multi-model orchestration at Orpheos, my goal is to design workflows where technology meaningfully increases capability.",
                ].join("\n")}
              />
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <div className="mono-chip w-fit">
                  <Terminal className="h-4 w-4" />
                  Primary Domain
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Software Systems, AI-Augmented Development, Technical Problem Decomposition.
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-5">
                <div className="mono-chip w-fit">
                  <MapPin className="h-4 w-4" />
                  Location
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Seattle, Washington. Paul G. Allen School of Computer Science & Engineering.
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-5">
                <div className="mono-chip w-fit">Philosophy</div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Invest in the community. Elevate the professional standard. Translate feedback into execution.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
