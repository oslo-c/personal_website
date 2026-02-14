import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function DocSection(props: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
  className?: string;
  "data-testid"?: string;
}) {
  if (!props.collapsible) {
    return (
      <section className={cn("rounded-lg border bg-card shadow-sm", props.className)} data-testid={props["data-testid"]}>
        <div className="p-4 sm:p-5">
          {props.eyebrow ? <div className="mono-chip w-fit">{props.eyebrow}</div> : null}
          <h2 className="mt-3 text-lg font-semibold tracking-tight sm:text-xl">{props.title}</h2>
          <div className="mt-3">{props.children}</div>
        </div>
      </section>
    );
  }

  return (
    <Collapsible
      defaultOpen={props.defaultOpen ?? true}
      className={cn("rounded-lg border bg-card shadow-sm", props.className)}
      data-testid={props["data-testid"]}
    >
      <div className="p-4 sm:p-5">
        {props.eyebrow ? <div className="mono-chip w-fit">{props.eyebrow}</div> : null}
        <div className="mt-3 flex items-start justify-between gap-2">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{props.title}</h2>
          <CollapsibleTrigger
            className="hover-elevate active-elevate-2 inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground"
            data-testid={props["data-testid"] ? `${props["data-testid"]}-toggle` : "doc-section-toggle"}
          >
            <span>Toggle</span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-3">{props.children}</CollapsibleContent>
      </div>
    </Collapsible>
  );
}
