import { Trash2 } from "lucide-react";
import { Button } from "~/lib/components/ui/button";
import { cn } from "~/lib/utils";
import { ReasonsDBType } from "~/types/db";
import { ReasonOptions } from "~/types/ui";

export function ReasonItem(props: { reason: ReasonsDBType }) {
  const { source, decision, reason } = props.reason;
  const getReasonColor = (type: ReasonOptions) => {
    switch (type) {
      case "positive":
        return "bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800/50";
      case "negative":
        return "bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-800/50";
      case "uncertain":
        return "bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800/50";
      default:
        return "";
    }
  };

  return (
    <div
      className={cn(
        `flex items-center justify-between rounded-md border p-4`,
        getReasonColor(decision),
      )}
    >
      <div>
        <p className="mb-2 dark:text-neutral-200">{reason}</p>
        {source && (
          <div className="text-sm text-gray-600 dark:text-neutral-400">
            <span className="font-medium">Source:</span> {source}
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-10 text-gray-500 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}
