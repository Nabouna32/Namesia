import type { ChangeEvent, HTMLInputTypeAttribute } from "react";
import styles from "./TextField.module.css";

export type TextFieldVariant = "filled" | "outlined";

type TextFieldProps = {
  id: string;
  label: string;
  variant: TextFieldVariant;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: HTMLInputTypeAttribute;
  name?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  multiline?: boolean;
  rows?: number;
  spellCheck?: boolean;
  maxLength?: number;
  supportingText?: string;
  error?: boolean;
  className?: string;
};

export function TextField({
  id,
  label,
  variant,
  value,
  onChange,
  type = "text",
  name,
  autoComplete,
  required = false,
  disabled = false,
  readOnly = false,
  multiline = false,
  rows,
  spellCheck,
  maxLength,
  supportingText,
  error = false,
  className
}: TextFieldProps) {
  const containerClassName = [
    styles.container,
    styles[variant],
    multiline ? styles.multiline : "",
    error ? styles.invalid : "",
    disabled ? styles.disabled : ""
  ].filter(Boolean).join(" ");
  const controlProps = {
    id,
    name,
    value,
    onChange,
    required,
    disabled,
    readOnly,
    spellCheck,
    maxLength,
    "aria-invalid": error || undefined,
    "aria-describedby": supportingText ? `${id}-supporting-text` : undefined,
    placeholder: " "
  };

  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      <div className={containerClassName}>
        {multiline
          ? <textarea {...controlProps} className={styles.control} rows={rows} />
          : <input {...controlProps} className={styles.control} type={type} autoComplete={autoComplete} />}
        <label className={styles.label} htmlFor={id}>{label}</label>
      </div>
      {supportingText && (
        <span
          id={`${id}-supporting-text`}
          className={[styles.supportingText, error ? styles.errorText : ""].filter(Boolean).join(" ")}
          role={error ? "alert" : undefined}
        >
          {supportingText}
        </span>
      )}
    </div>
  );
}
