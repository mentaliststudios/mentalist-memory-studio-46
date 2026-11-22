import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useId, useState, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const inputClass =
  "h-12 w-full rounded-xl border-2 border-border bg-card px-4 text-base text-foreground transition-colors placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 aria-[invalid=true]:border-destructive disabled:opacity-60";

interface AuthFieldProps extends Omit<ComponentProps<"input">, "id"> {
  label: string;
  error?: string | undefined;
  hint?: ReactNode;
  labelAside?: ReactNode;
}

/** Labelled input with an accessible error message. type="password" adds a show/hide toggle. */
export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(function AuthField(
  { label, error, hint, labelAside, type = "text", className, ...props },
  ref,
) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-bold text-foreground">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={isPassword && visible ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={cn(inputClass, isPassword && "pr-12")}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="absolute inset-y-0 right-1 my-auto grid size-10 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            {visible ? (
              <EyeOff className="size-5" aria-hidden="true" />
            ) : (
              <Eye className="size-5" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-[13px] text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] font-semibold text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
});
