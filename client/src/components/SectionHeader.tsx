import { cn } from "@/lib/utils";

export function SectionHeader(props: {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6", props.className)}>
      <div className="min-w-0">
        {props.eyebrow ? (
          <div className="mono-chip w-fit" data-testid={props["data-testid"] ? `${props["data-testid"]}-eyebrow` : undefined}>
            {props.eyebrow}
          </div>
        ) : null}
        <h1
          className="mt-3 text-balance text-2xl font-semibold leading-tight sm:text-3xl"
          data-testid={props["data-testid"]}
        >
          {props.title}
        </h1>
        {props.description ? (
          <p className="mt-2 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
            {props.description}
          </p>
        ) : null}
      </div>
      {props.right ? <div className="flex shrink-0 items-center gap-2">{props.right}</div> : null}
    </div>
  );
}
