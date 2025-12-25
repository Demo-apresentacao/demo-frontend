import { IMaskInput } from "react-imask";
import styles from "./inputMaskRegister.module.css"; // Reusa o mesmo CSS

export function InputMaskRegister({ label, className, ...props }) {
  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label} htmlFor={props.id || props.name}>
          {label}
        </label>
      )}
      <IMaskInput
        className={`${styles.input} ${className || ''}`}
        {...props} // Aqui entra o mask="000.000..." e o onAccept
      />
    </div>
  );
}