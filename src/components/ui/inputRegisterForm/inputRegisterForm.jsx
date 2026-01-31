"use client";

import styles from "./inputRegisterForm.module.css";

export function InputRegisterForm({
  label,
  type = "text",
  className,
  children,
  textarea,
  ...props
}) {
  return (
    <div className={styles.container}>
      {label && (
        <label
          htmlFor={props.id || props.name}
          className={styles.label}
        >
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {textarea ? (
          <textarea
            className={`${styles.input} ${className || ""}`}
            style={{
              minHeight: "100px",
              paddingTop: "10px",
              resize: "vertical",
              fontFamily: "inherit",
            }}
            {...props}
          />
        ) : (
          <input
            type={type}
            className={`${styles.input} ${className || ""}`}
            {...props}
          />
        )}

        {children && (
          <div className={styles.rightElement}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
