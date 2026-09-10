"use client";

import * as React from "react";
import { Check, ArrowRight, Keyboard, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AnswerInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export function AnswerInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  isLoading = false,
  placeholder = "Type the word or phrase here...",
  autoFocus = true,
}: AnswerInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoFocus && !disabled) {
      inputRef.current?.focus();
    }
  }, [autoFocus, disabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() && !disabled) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <label
          htmlFor="exercise-answer-input"
          className="text-sm font-semibold text-slate-800 dark:text-slate-200"
        >
          Type what you hear:
        </label>
        <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            Enter
          </kbd>
          <span>to submit</span>
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <Input
            id="exercise-answer-input"
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            className="h-14 text-lg font-medium px-5 rounded-2xl border-slate-300 dark:border-slate-700 focus-visible:border-indigo-600 focus-visible:ring-4 focus-visible:ring-indigo-600/15"
          />
        </div>

        <Button
          type="button"
          onClick={onSubmit}
          disabled={!value.trim() || disabled || isLoading}
          variant="brand"
          size="lg"
          className="h-14 px-8 rounded-2xl gap-2 font-semibold shadow-md shadow-indigo-200 dark:shadow-none"
          id="check-answer-btn"
        >
          <Check className="w-5 h-5" />
          <span>Check Answer</span>
        </Button>
      </div>
    </div>
  );
}
