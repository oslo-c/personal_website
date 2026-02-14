import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";

export function EmptyState(props: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  "data-testid"?: string;
}) {
  return (
    <Card className="shadow-sm" data-testid={props["data-testid"]}>
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <div className="grid h-11 w-11 place-items-center rounded-md border bg-card shadow-sm">
          {props.icon ?? <FileX className="h-5 w-5 text-muted-foreground" />}
        </div>
        <div className="mt-4 text-sm font-semibold">{props.title}</div>
        {props.description ? <div className="mt-1 text-sm text-muted-foreground">{props.description}</div> : null}
        {props.actionLabel && props.onAction ? (
          <div className="mt-5">
            <Button onClick={props.onAction} data-testid="button-empty-action">
              {props.actionLabel}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
