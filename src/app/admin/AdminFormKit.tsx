"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AlertCircle,
  Briefcase,
  Check,
  Clock,
  Eye,
  EyeOff,
  MapPin,
  Plus,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import type { StaffPermissions } from "@/types";

/* ====================================================================
   Admin form kit — shared building blocks for every admin dialog.
   Uses the site's design tokens so light/dark themes just work.
   ==================================================================== */

/* ── Modal ──────────────────────────────────────────────────────── */

type Tone = "brand" | "accent" | "amber";
const TONES: Record<Tone, string> = {
  brand: "bg-brand-soft text-brand-ink",
  accent: "bg-accent-soft text-accent-ink",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
};

export function AdminModal({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  tone = "brand",
  size = "md",
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: Tone;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  // Keep the latest onClose without re-running the open/close effect on every
  // parent render (which would steal focus while the user types).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus the first field for fast data entry
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("input:not([type=hidden]),select,textarea")?.focus();
    }, 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open]);

  if (!open) return null;

  const width = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-6xl" }[size];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close dialog"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-spruce/55 backdrop-blur-sm animate-fade-in"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex max-h-[94dvh] w-full ${width} flex-col overflow-hidden rounded-t-[2rem] border border-line bg-surface shadow-2xl animate-fade-in-up sm:rounded-[2rem]`}
      >
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-line px-6 py-5 sm:px-8">
          {Icon && (
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${TONES[tone]}`}>
              <Icon className="h-5 w-5" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="font-display text-2xl font-medium leading-tight text-ink">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-ink-3">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body + optional sticky footer */}
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-3 border-t border-line bg-surface-2/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Layout helpers ─────────────────────────────────────────────── */

export function FormSection({
  step,
  title,
  description,
  children,
}: {
  step?: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-start gap-3">
        {step !== undefined && (
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-sm font-medium text-brand-ink">
            {step}
          </span>
        )}
        <div>
          <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
          {description && <p className="text-sm text-ink-3">{description}</p>}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {required && (
          <span className="ml-0.5 text-accent-ink" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-200"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span>{message}</span>
    </div>
  );
}

/** Text input with a leading icon. Accepts all native input props. */
export function IconInput({
  icon: Icon,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
      <input {...props} className={`field-input pl-11 ${className}`} />
    </div>
  );
}

/* ── Toggle switch (uncontrolled or controlled) ─────────────────── */

export function Switch({
  name,
  value = "true",
  checked,
  defaultChecked,
  onChange,
  label,
  description,
  icon: Icon,
}: {
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand/30 has-[:checked]:border-brand/40 has-[:checked]:bg-brand-soft/50">
      <span className="flex items-start gap-3">
        {Icon && (
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-ink-2">
            <Icon className="h-[18px] w-[18px]" />
          </span>
        )}
        <span>
          <span className="block text-sm font-semibold text-ink">{label}</span>
          {description && <span className="block text-sm text-ink-3">{description}</span>}
        </span>
      </span>
      <span className="relative inline-flex shrink-0">
        <input
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
          className="peer sr-only"
        />
        <span className="h-6 w-11 rounded-full bg-line-strong transition-colors peer-checked:bg-brand peer-focus-visible:ring-4 peer-focus-visible:ring-brand/25" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

/* ── Segmented radio choice ─────────────────────────────────────── */

export function Segmented({
  name,
  options,
  defaultValue,
}: {
  name: string;
  options: { value: string; label: string; hint?: string }[];
  defaultValue: string;
}) {
  return (
    <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">
      {options.map((o) => (
        <label
          key={o.value}
          className="relative flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand/30 has-[:checked]:border-brand has-[:checked]:bg-brand-soft/50"
        >
          <input type="radio" name={name} value={o.value} defaultChecked={o.value === defaultValue} className="peer sr-only" />
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-line-strong transition-colors peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:ring-4 peer-focus-visible:ring-brand/25">
            <Check className="h-3 w-3 text-brand-on" strokeWidth={3} />
          </span>
          <span>
            <span className="block text-sm font-semibold text-ink">{o.label}</span>
            {o.hint && <span className="block text-sm text-ink-3">{o.hint}</span>}
          </span>
        </label>
      ))}
    </div>
  );
}

/* ── Bullet list editor ─────────────────────────────────────────────
   Renders one row per item; submits the same newline-joined string the
   server already expects via a hidden input named `name`.             */

export function BulletListField({
  name,
  label,
  hint,
  defaultItems,
  placeholder,
  addLabel = "Add item",
  onItemsChange,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultItems: string[];
  placeholder?: string;
  addLabel?: string;
  onItemsChange?: (items: string[]) => void;
}) {
  const [items, setItems] = useState<string[]>(defaultItems.length ? defaultItems : [""]);
  const listRef = useRef<HTMLUListElement>(null);

  const update = (next: string[]) => {
    setItems(next);
    onItemsChange?.(next);
  };

  const add = () => {
    update([...items, ""]);
    requestAnimationFrame(() => {
      const inputs = listRef.current?.querySelectorAll("input");
      inputs?.[inputs.length - 1]?.focus();
    });
  };

  const filled = items.filter((i) => i.trim()).length;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="field-label mb-0">{label}</span>
        <span className="text-xs text-ink-3">
          {filled} {filled === 1 ? "item" : "items"}
        </span>
      </div>
      <ul ref={listRef} className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="group flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-bright" aria-hidden />
            <input
              type="text"
              value={item}
              aria-label={`${label} ${i + 1}`}
              placeholder={placeholder}
              onChange={(e) => update(items.map((v, j) => (j === i ? e.target.value : v)))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  add();
                }
              }}
              className="field-input py-2.5"
            />
            <button
              type="button"
              onClick={() => update(items.length > 1 ? items.filter((_, j) => j !== i) : [""])}
              aria-label={`Remove ${label.toLowerCase()} ${i + 1}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-ink-3 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-400/10 dark:hover:text-rose-300"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-soft"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
      {hint && <p className="field-hint">{hint}</p>}
      <input type="hidden" name={name} value={items.map((i) => i.trim()).filter(Boolean).join("\n")} />
    </div>
  );
}

/* ── Password field with reveal + strength ─────────────────────── */

function strength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length < 8) return { score: Math.min(score, 1), label: "Too short", color: "bg-rose-500" };
  if (score <= 2) return { score: 2, label: "Fair", color: "bg-amber-500" };
  if (score === 3) return { score: 3, label: "Good", color: "bg-brand-bright" };
  return { score: 4, label: "Strong", color: "bg-brand" };
}

export function PasswordField({
  id,
  value,
  onChange,
  placeholder = "At least 8 characters",
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  const s = strength(value);
  return (
    <div>
      <div className="relative">
        <input
          id={id}
          required
          minLength={8}
          type={show ? "text" : "password"}
          autoComplete="new-password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="field-input pr-12"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
        >
          {show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
        </button>
      </div>
      {value && (
        <div className="mt-2 flex items-center gap-3" aria-live="polite">
          <div className="flex flex-1 gap-1">
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= s.score ? s.color : "bg-line"}`} />
            ))}
          </div>
          <span className="w-16 text-right text-xs font-medium text-ink-3">{s.label}</span>
        </div>
      )}
    </div>
  );
}

/* ── Permissions editor (shared by Add + Edit staff) ───────────── */

type ModuleKey = "jobs" | "applications" | "facilities";
const MODULES: { key: ModuleKey; title: string; description: string; actions: { key: string; label: string }[] }[] = [
  {
    key: "jobs",
    title: "Jobs management",
    description: "Job postings shown on the public site",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit status" },
      { key: "delete", label: "Delete" },
    ],
  },
  {
    key: "applications",
    title: "Candidate applications",
    description: "Applicant details and resumes",
    actions: [
      { key: "view", label: "View" },
      { key: "edit", label: "Edit status" },
      { key: "delete", label: "Delete" },
    ],
  },
  {
    key: "facilities",
    title: "Facility orders",
    description: "Hospital staffing requests and leads",
    actions: [
      { key: "view", label: "View" },
      { key: "edit", label: "Edit status" },
      { key: "delete", label: "Delete" },
    ],
  },
];

export function PermissionsEditor({
  value,
  onChange,
}: {
  value: StaffPermissions;
  onChange: (next: StaffPermissions) => void;
}) {
  const setAction = (mod: ModuleKey, action: string, on: boolean) => {
    const current = value[mod] as Record<string, boolean>;
    const next = { ...current, [action]: on };
    // Any write permission implies view; removing view removes everything.
    if (action !== "view" && on) next.view = true;
    if (action === "view" && !on) Object.keys(next).forEach((k) => (next[k] = false));
    onChange({ ...value, [mod]: next });
  };

  return (
    <div className="space-y-3">
      <Switch
        label="Dashboard overview"
        description="See the summary numbers on the Overview tab"
        checked={value.dashboard}
        onChange={(on) => onChange({ ...value, dashboard: on })}
      />
      {MODULES.map((m) => {
        const perms = value[m.key] as Record<string, boolean>;
        const enabled = Object.values(perms).filter(Boolean).length;
        return (
          <fieldset key={m.key} className="rounded-2xl border border-line bg-surface p-4">
            <legend className="sr-only">{m.title}</legend>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink">{m.title}</p>
                <p className="text-sm text-ink-3">{m.description}</p>
              </div>
              <span className="badge-neutral shrink-0">
                {enabled}/{m.actions.length}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {m.actions.map((a) => {
                const on = Boolean(perms[a.key]);
                return (
                  <button
                    key={a.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setAction(m.key, a.key, !on)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                      on
                        ? a.key === "delete"
                          ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200"
                          : "border-brand/40 bg-brand-soft text-brand-ink"
                        : "border-line bg-surface text-ink-3 hover:border-line-strong hover:text-ink"
                    }`}
                  >
                    {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    {a.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

/* ── Live job preview (mirrors the public JobCard) ─────────────── */

export interface JobPreviewData {
  title: string;
  department: string;
  specialty: string;
  city: string;
  state: string;
  employmentType: string;
  shift: string;
  durationWeeks: string;
  payRange: string;
  description: string;
  isUrgent: boolean;
  status: string;
}

export function JobPreview({ data }: { data: JobPreviewData }) {
  return (
    <div className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge-teal">{data.department || "Department"}</span>
        <span className="badge-neutral">{data.specialty || "Specialty"}</span>
        {data.isUrgent && (
          <span className="badge-urgent ml-auto">
            <Zap className="h-3.5 w-3.5" aria-hidden />
            Priority need
          </span>
        )}
      </div>
      <h3 className="mt-4 font-display text-xl font-medium leading-snug text-ink">
        {data.title || <span className="text-ink-3">Job title appears here</span>}
      </h3>
      <ul className="mt-3 space-y-1.5 text-sm text-ink-2">
        <li className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent" aria-hidden />
          <span className="font-medium text-ink">
            {data.city || "City"}, {data.state}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-ink-3" aria-hidden />
          {data.employmentType}
          {data.durationWeeks ? ` · ${data.durationWeeks} weeks` : ""}
        </li>
        <li className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-ink-3" aria-hidden />
          <span className="line-clamp-1">{data.shift || "Shift schedule"}</span>
        </li>
      </ul>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-3">
        {data.description || "Your position description preview will appear here as you type."}
      </p>
      <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-3">Estimated pay</p>
          <p className="mt-0.5 font-display text-lg font-medium text-ink">{data.payRange || "Competitive rate"}</p>
        </div>
        <span className="btn-accent btn-sm pointer-events-none">Apply now</span>
      </div>
    </div>
  );
}
