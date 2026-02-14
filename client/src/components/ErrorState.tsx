import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

export function ErrorState(props: { title?: string; message: string; onRetry: () => void; "data-testid"?: string }) {
  return (
    <Alert className="shadow-sm" data-testid={props["data-testid"]}>
      <Terminal className="h-4 w-4" />
      <AlertTitle>{props.title ?? "Request failed"}</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-3">
        <div className="text-sm text-muted-foreground">{props.message}</div>
        <div>
          <Button variant="outline" onClick={props.onRetry} data-testid="button-retry">
            Retry
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
