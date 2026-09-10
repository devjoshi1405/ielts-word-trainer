import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indicatorClassName?: string;
  showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, indicatorClassName, showLabel, ...props }, ref) => {
    const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

    return (
      <div className="w-full space-y-1">
        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn(
            "relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800",
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "h-full w-full flex-1 bg-indigo-600 transition-all duration-500 ease-out rounded-full",
              indicatorClassName
            )}
            style={{ transform: `translateX(-${100 - percentage}%)` }}
          />
        </div>
        {showLabel && (
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>{Math.round(percentage)}% completed</span>
            <span>{value}/{max}</span>
          </div>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
