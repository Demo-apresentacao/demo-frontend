'use client'

import { Mail, CheckCircle, AlertCircle } from 'lucide-react'
import styles from './page.module.css' // Reutilize o mesmo CSS do cadastro ou crie um novo
import InputRegister from '@/components/ui/inputRegister/inputRegister'
import Image from 'next/image'
import { useState } from "react";
import { usePasswordRecovery } from "@/hooks/usePasswordRecovery";
import Swal from "sweetalert2";
import { validateEmail } from "@/utils/validators";
import Link from 'next/link';

export default function Forgot() {
  const { requestRecovery, loading, error, successMessage } = usePasswordRecovery();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validação de Email (Mesma do cadastro)
    if (!validateEmail(email)) {
      Swal.fire({
        title: "E-mail Inválido",
        text: "Por favor, insira um endereço de e-mail válido.",
        icon: "warning",
        confirmButtonColor: "#f59e0b"
      });
      return;
    }

    await requestRecovery(email);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container} style={{ maxWidth: '500px' }}> {/* Card um pouco menor */}
        <div className={styles.brand}>
          <Image
            src="/images/logo_autolimp.jpeg"
            alt="Logo AutoLimp"
            width={60}
            height={60}
            priority
            className={styles.logoImage}
          />
          <h1>Recuperar Senha</h1>
          <p>Informe seu e-mail para receber o link de redefinição</p>
        </div>

        {successMessage ? (
          <div className={styles.feedbackContainer}>
            <CheckCircle size={48} color="#16a34a" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: '#271411', marginBottom: '8px' }}>E-mail Enviado!</h3>
            <p style={{ color: '#806b6b', textAlign: 'center', fontSize: '14px' }}>
              {successMessage}
            </p>
            <Link href="/auth/login" className={styles.button} style={{ marginTop: '24px', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              Voltar para Login
            </Link>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} style={{ gridTemplateColumns: '1fr' }}>
            
            <div className={styles.fullWidth}>
              <InputRegister
                label="Seu E-mail cadastrado"
                icon={Mail}
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
               <div style={{ color: '#dc2626', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <AlertCircle size={14} />
                 {error}
               </div>
            )}

            <button className={styles.button} disabled={loading}>
              {loading ? "Enviando..." : "Enviar Link de Recuperação"}
            </button>

            <button
              type="button"
              className={styles.backButton}
              onClick={() => window.history.back()}
            >
              Voltar
            </button>
          </form>
        )}

        <footer className={styles.footer}>
          <span>© 2026 • Sistema AutoLimp</span>
        </footer>
      </div>
    </div>
  )
}