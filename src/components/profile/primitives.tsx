"use client";

import {
  Children,
  isValidElement,
  type ChangeEvent,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseListInput } from "./helpers";

export function SectionCard({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(14,16,27,0.96),rgba(9,10,16,0.9))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/35">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-white">{title}</h2>
          {description ? <p className="mt-1 text-[13px] leading-5 text-white/46">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Tag({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "emerald" | "rose" | "violet" | "amber";
}) {
  const tones = {
    default: "border-white/10 bg-white/[0.04] text-white/72",
    emerald: "border-[#4fffb0]/22 bg-[#4fffb0]/10 text-[#72ffc2]",
    rose: "border-[#d4688a]/24 bg-[#d4688a]/10 text-[#ef8cab]",
    violet: "border-[#b48cff]/24 bg-[#b48cff]/10 text-[#c7a8ff]",
    amber: "border-[#f5c842]/24 bg-[#f5c842]/10 text-[#f4d26a]",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function DetailTile({
  icon,
  label,
  value,
  hidden,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hidden?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="mb-2 flex items-center gap-2 text-white/36">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className={`text-sm leading-6 ${hidden ? "text-white/38" : "text-white/78"}`}>{value}</p>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
  as: Tag = "label",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  as?: "label" | "div";
}) {
  return (
    <Tag className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-white/78">{label}</span>
        {hint ? <span className="text-xs text-white/35">{hint}</span> : null}
      </div>
      {children}
    </Tag>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-white/22 focus:border-[#b48cff]/40 focus:bg-white/[0.06] ${
        props.className || ""
      }`}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-[112px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/22 focus:border-[#b48cff]/40 focus:bg-white/[0.06] ${
        props.className || ""
      }`}
    />
  );
}

export function SelectInput({
  children,
  className,
  onChange,
  placeholder,
  value,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { placeholder?: string }) {
  const EMPTY_OPTION_VALUE = "__empty__";
  const options = Children.toArray(children)
    .filter((child): child is ReactElement<{ value?: string; disabled?: boolean; children?: ReactNode }> =>
      isValidElement(child),
    )
    .map((child) => ({
      value: typeof child.props.value === "string" ? child.props.value : "",
      label: child.props.children,
      disabled: Boolean(child.props.disabled),
    }));

  const currentValue = typeof value === "string" ? value : value == null ? "" : String(value);
  const placeholderLabel =
    options.find((option) => option.value === "")?.label || placeholder || "Select";
  const selectValue = currentValue === "" ? EMPTY_OPTION_VALUE : currentValue;

  return (
    <Select
      disabled={props.disabled}
      value={selectValue}
      onValueChange={(nextValue) => {
        if (!onChange) return;
        onChange({
          target: { value: nextValue === EMPTY_OPTION_VALUE ? "" : nextValue },
        } as ChangeEvent<HTMLSelectElement>);
      }}
    >
      <SelectTrigger className={`h-12 w-full rounded-2xl border-white/10 bg-white/[0.04] px-4 text-sm text-white focus:border-[#b48cff]/40 focus:bg-white/[0.06] ${className || ""}`}>
        <SelectValue>
          {options.find((option) => option.value === currentValue)?.label || placeholderLabel}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        className="z-[80] rounded-2xl border border-white/10 bg-[#121521] p-1 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        align="start"
      >
        {options.map((option) => (
          <SelectItem
            key={`${option.value}-${String(option.label)}`}
            value={option.value === "" ? EMPTY_OPTION_VALUE : option.value}
            disabled={option.disabled}
            className="rounded-xl px-3 py-2 text-sm text-white data-disabled:text-white/30 focus:bg-white/[0.08] focus:text-white"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function listValue(values: string[]) {
  return values.join(", ");
}

export function updateArrayInput(
  event: ChangeEvent<HTMLTextAreaElement>,
  setValue: (next: string[]) => void,
) {
  setValue(parseListInput(event.target.value));
}
