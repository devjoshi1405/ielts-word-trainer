import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, clearable, onClear, value, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          className={cn(
            "flex h-12 w-full rounded-xl border border-input bg-card px-4 py-2 text-base text-foreground placeholder:text-muted-foreground/70 ring-offset-background transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-indigo-600 focus-visible:ring-4 focus-visible:ring-indigo-600/10 disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-11",
            clearable && value && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {clearable && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3.5 text-muted-foreground hover:text-foreground text-xs p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
