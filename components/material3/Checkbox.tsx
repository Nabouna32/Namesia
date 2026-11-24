import type { ChangeEvent } from "react";
import styles from "./Checkbox.module.css";

type Props = {
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
};

export function Checkbox({ checked, disabled, onChange }: Props) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.currentTarget.checked);
  }

  return (
    <span className={styles.root}>
      <input
        className={styles.input}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
      <span className={styles.indicator} aria-hidden="true" />
    </span>
  );
}
