import styles from "./selectRegister.module.css" // Reusa o mesmo CSS

export function SelectRegister({ label, options = [], className, placeholder = "Selecione...", ...props }) {
  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label} htmlFor={props.id || props.name}>
          {label}
        </label>
      )}
      
      <select 
        className={`${styles.input} ${className || ''}`} 
        {...props}
      >
        {/* Opção padrão desabilitada servindo como placeholder */}
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}