"use client";
import { useState, useEffect } from "react";
import styles from "./CategoryModal.module.css";
import { X, CheckCircle, XCircle } from "lucide-react";
import { updateServiceCategory } from "@/services/servicesCategories.service";
import Swal from "sweetalert2";

export default function ManageCategoriesModal({ isOpen, onClose, categories, onUpdate }) {
    // Estado para controlar qual ID está carregando (para não clicar 2x)
    const [updatingId, setUpdatingId] = useState(null);

    const [localStatus, setLocalStatus] = useState({});
    useEffect(() => {
        const initial = {};
        categories.forEach(cat => {
            initial[cat.value] = cat.active;
        });
        setLocalStatus(initial);
    }, [categories]);


    if (!isOpen) return null;


    const handleToggleStatus = async (category) => {
        const newStatus = !localStatus[category.value];

        // muda IMEDIATAMENTE (anima rápido)
        setLocalStatus(prev => ({
            ...prev,
            [category.value]: newStatus
        }));

        setUpdatingId(category.value);

        try {
            await updateServiceCategory(category.value, {
                cat_serv_nome: category.label,
                cat_serv_situacao: newStatus
            });

            // recarrega lista oficial
            onUpdate();

        } catch (error) {
            console.error(error);

            setLocalStatus(prev => ({
                ...prev,
                [category.value]: !newStatus
            }));

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Erro ao alterar status da categoria',
                showConfirmButton: false,
                timer: 2000
            });

        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} style={{ maxWidth: '500px' }}>
                <div className={styles.header}>
                    <h3>Gerenciar Categorias</h3>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <div className={styles.body} style={{ maxHeight: '60vh', overflowY: 'auto', padding: '0' }}>
                    {categories.length === 0 ? (
                        <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Nenhuma categoria cadastrada.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                            {categories.map((cat) => (
                                <li key={cat.value} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '12px 24px', borderBottom: '1px solid #f3f4f6'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{
                                            fontSize: '0.9rem',
                                            color: cat.active ? '#111827' : '#9ca3af',
                                            textDecoration: cat.active ? 'none' : 'line-through'
                                        }}>
                                            {cat.label}
                                        </span>
                                    </div>

                                    {/* Toggle Switch Pequeno */}
                                    <label className={styles.switch} style={{ transform: 'scale(0.8)' }}>

                                        <input
                                            type="checkbox"
                                            checked={localStatus[cat.value] ?? false}
                                            disabled={updatingId === cat.value}
                                            onChange={() => handleToggleStatus(cat)}
                                        />

                                        <span className={`${styles.slider} ${updatingId === cat.value ? styles.loading : ''}`}></span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className={styles.footer}>
                    <button type="button" onClick={onClose} className={styles.cancelBtn}>Fechar</button>
                </div>
            </div>
        </div>
    );
}