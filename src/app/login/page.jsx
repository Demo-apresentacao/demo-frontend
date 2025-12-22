'use client'

import { Mail, Lock } from 'lucide-react'
import styles from './page.module.css'

import { useState } from "react";

import { useLogin } from "./useLogin";


import api from '../../services/api'; // Serviço para chamadas à API.
export default function Login() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const { handleLogin } = useLogin();


    const listarUsuarios = async () => {
        try {
            const response = await api.get('/users');

            // Se quiser só ver o retorno bruto
            console.log("Resposta completa:", response.data);

            // Se a API seguir o padrão { dados: [...] }
            const usuarios = response.data.dados;

    

        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
    };


    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <span className={styles.logo}>ADM</span>
                    <h1>Acesso ao Sistema</h1>
                    <p>Entre com suas credenciais</p>
                </div>

                <form
                    className={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin(email, senha);
                    }}>
                    <div className={styles.field}>
                        <Mail size={18} className={styles.icon} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label>Email</label>
                    </div>

                    <div className={styles.field}>
                        <Lock size={18} className={styles.icon} />
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />

                        <label>Senha</label>
                    </div>

                    <button className={styles.button}>
                        Entrar
                    </button>

                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={() => window.history.back()}
                    >
                        Voltar
                    </button>
                </form>

                <footer className={styles.footer}>
                    <span>© 2025 • Sistema Administrativo</span>
                </footer>

                <button
                    type="button"
                    onClick={listarUsuarios}
                >
                    Testar /usuarios
                </button>   
            </div>
        </div>
    )
}
