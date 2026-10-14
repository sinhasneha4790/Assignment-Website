import { useId, type ComponentProps, type ReactNode } from "react";
import { cx } from "@/lib/cx";

const control = "w-full min-h-12 px-3.5 border border-field bg-white rounded-[2px] text-[15px] text-ink placeholder:text-muted/80";

type FieldProps = { label: ReactNode; hint?: ReactNode; error?: string; hideLabel?: boolean };

function Field({ id, label, hint, error, hideLabel, children }: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className={cx("block text-[13px] font-semibold mb-1.5", hideLabel && "sr-only")}>
        {label}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="text-[13px] text-muted mt-1">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="text-[13px] text-clay mt-1">{error}</p>}
    </div>
  );
}

function describedBy(id: string, hint?: ReactNode, error?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function Input({ label, hint, error, hideLabel, id, className, ...props }: FieldProps & ComponentProps<"input">) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Field id={fid} label={label} hint={hint} error={error} hideLabel={hideLabel}>
      <input id={fid} aria-invalid={!!error} aria-describedby={describedBy(fid, hint, error)} className={cx(control, className)} {...props} />
    </Field>
  );
}

export function Select({ label, hint, error, hideLabel, id, className, children, ...props }: FieldProps & ComponentProps<"select">) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Field id={fid} label={label} hint={hint} error={error} hideLabel={hideLabel}>
      <select id={fid} aria-invalid={!!error} aria-describedby={describedBy(fid, hint, error)} className={cx(control, className)} {...props}>
        {children}
      </select>
    </Field>
  );
}

export function Textarea({ label, hint, error, hideLabel, id, className, ...props }: FieldProps & ComponentProps<"textarea">) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Field id={fid} label={label} hint={hint} error={error} hideLabel={hideLabel}>
      <textarea id={fid} aria-invalid={!!error} aria-describedby={describedBy(fid, hint, error)} className={cx(control, "py-3 min-h-24", className)} {...props} />
    </Field>
  );
}
