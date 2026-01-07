'use client'

import { Lock, Eye, EyeOff, Check, X } from 'lucide-react'
import styles from './page.module.css' // Importe o CSS que você me passou
import InputRegister from '@/components/ui/inputRegister/inputRegister'
import Image from 'next/image'
import { useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import { usePasswordRecovery } from "@/hooks/usePasswordRecovery";
import Swal from "sweetalert2";

export default function Reset() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token;
  
  const { performReset, loading } = usePasswordRecovery();

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  // --- LÓGICA DE FORÇA DA SENHA (Idêntica ao Cadastro) ---
  const passwordRules = {
    length: passwords.password.length >= 12, // Nota: Cadastro usava 12, Utils usava 8. Mantive 12 do seu componente.
    capital: /[A-Z]/.test(passwords.password),
    lower: /[a-z]/.test(passwords.password),
    number: /\d/.test(passwords.password),
    special: /[\W_]/.test(passwords.password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validação de regras da senha
    if (!isPasswordValid) {
      Swal.fire({
        title: "Senha Fraca",
        text: "Por favor, atenda a todos os requisitos de senha exibidos.",
        icon: "warning",
        confirmButtonColor: "#f59e0b"
      });
      return;
    }

    // 2. Confirmação de senha
    if (passwords.password !== passwords.confirmPassword) {
        Swal.fire({
          title: "Senhas Divergentes",
          text: "A confirmação de senha não coincide.",
          icon: "error",
          confirmButtonColor: "#ef4444"
        });
        return;
    }

    // 3. Executa a troca
    await performReset(token, passwords.password);
    // O hook já deve tratar o sucesso e redirecionar ou mostrar mensagem
  };

  if (!token) return null; // Ou um loading state

  return (
    <div className={styles.page}>
      <div className={styles.container} style={{ maxWidth: '600px' }}>
        <div className={styles.brand}>
          <Image
            src="/images/logo_autolimp.jpeg"
            alt="Logo AutoLimp"
            width={60}
            height={60}
            priority
            className={styles.logoImage}
          />
          <h1>Nova Senha</h1>
          <p>Crie uma nova senha forte para sua conta</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} style={{ gridTemplateColumns: '1fr' }}>
          
          {/* Campo Nova Senha */}
          <div className={styles.fullWidth}>
            <InputRegister
              label="Nova Senha"
              icon={Lock}
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={passwords.password}
              onChange={handleChange}
              required
            >
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </InputRegister>

            {/* Checklist de Validação */}
            {passwords.password.length > 0 && (
              <div className={styles.passwordRequirements}>
                <PasswordRequirement label="Mínimo de 12 caracteres" met={passwordRules.length} />
                <PasswordRequirement label="Pelo menos uma letra maiúscula" met={passwordRules.capital} />
                <PasswordRequirement label="Pelo menos uma letra minúscula" met={passwordRules.lower} />
                <PasswordRequirement label="Pelo menos um número" met={passwordRules.number} />
                <PasswordRequirement label="Pelo menos um caractere especial" met={passwordRules.special} />
              </div>
            )}
          </div>

          {/* Campo Confirmar Senha */}
          <div className={styles.fullWidth}>
            <InputRegister
              label="Confirmar Nova Senha"
              icon={Lock}
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              required
            >
               <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowConfirm(prev => !prev)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </InputRegister>
          </div>

          <button className={styles.button} disabled={loading}>
            {loading ? "Salvando..." : "Alterar Senha"}
          </button>

        </form>

        <footer className={styles.footer}>
          <span>© 2026 • Sistema AutoLimp</span>
        </footer>
      </div>
    </div>
  )
}

// Sub-componente (igual ao do cadastro)
function PasswordRequirement({ label, met }) {
  return (
    <div className={`${styles.reqItem} ${met ? styles.success : styles.pending}`}>
      {met ? <Check className={styles.reqIcon} /> : <X className={styles.reqIcon} />}
      <span>{label}</span>
    </div>
  );
}