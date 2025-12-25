"use client"; // Necessário pois agora temos useState

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Importe os ícones
import styles from "./inputRegister.module.css";

export function InputRegister({ label, type = "text", className, ...props }) {
  // Estado para controlar a visibilidade
  const [showPassword, setShowPassword] = useState(false);

  // Verifica se o input é originalmente do tipo password
  const isPassword = type === "password";

  // Define o tipo atual baseado no estado (se for password) ou mantém o original
  const currentType = isPassword 
    ? (showPassword ? "text" : "password") 
    : type;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label} htmlFor={props.id || props.name}>
          {label}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        <input 
          type={currentType}
          className={`${styles.input} ${className || ''}`} 
          {...props} 
        />

        {/* Renderiza o botão apenas se for campo de senha */}
        {isPassword && (
          <button 
            type="button" // Importante: type="button" para não submeter o form
            className={styles.toggleButton}
            onClick={togglePasswordVisibility}
            tabIndex={-1} // Opcional: para pular o tab no ícone
          >
            {showPassword ? (
              <EyeOff size={20} /> // Olho cortado (esconder)
            ) : (
              <Eye size={20} />    // Olho aberto (mostrar)
            )}
          </button>
        )}
      </div>
    </div>
  );
}