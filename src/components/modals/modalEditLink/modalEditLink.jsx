"use client";
import { useState, useEffect } from "react";
import { X, Calendar, Save, SquareX, CheckCircle, AlertCircle } from "lucide-react";
import styles from "./modalEditLink.module.css";

export default function ModalEditLink({ 
    isOpen, 
    onClose, 
    onSave, 
    type = 'edit', // 'edit' ou 'finalize'
    initialData,   // { date, isOwner, userName }
}) {
    const [dateValue, setDateValue] = useState("");
    const [isOwner, setIsOwner] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            // Se for edição, carrega data inicial. Se for finalizar, carrega data de hoje.
            if (type === 'edit') {
                setDateValue(initialData.date ? initialData.date.split('T')[0] : "");
                setIsOwner(!!initialData.isOwner);
            } else {
                // Finalizar: Padrão é hoje
                setDateValue(new Date().toISOString().split('T')[0]);
            }
        }
    }, [isOpen, initialData, type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Retorna os dados para o pai
            await onSave({
                date: dateValue,
                isOwner: type === 'edit' ? isOwner : undefined // Só manda owner se for edição
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    const isEdit = type === 'edit';
    const title = isEdit ? "Corrigir Dados Iniciais" : "Encerrar Vínculo";
    const icon = isEdit ? <Save size={18} /> : <SquareX size={18} />;
    
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                
                <div className={styles.header}>
                    <h3>{icon} {title}</h3>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.body}>
                    
                    <div className={styles.description}>
                        {isEdit 
                            ? `Editando vínculo de: ${initialData?.userName}`
                            : `Defina a data de término para: ${initialData?.userName}`
                        }
                    </div>

                    {/* CAMPO DE DATA (Serve para Início ou Fim dependendo do modo) */}
                    <div className={styles.inputGroup}>
                        <label>{isEdit ? "Data de Início" : "Data de Encerramento"}</label>
                        <div className={styles.inputIconWrapper}>
                            <Calendar size={18} className={styles.inputIcon} />
                            <input 
                                type="date" 
                                value={dateValue} 
                                onChange={(e) => setDateValue(e.target.value)} 
                                className={styles.input}
                                required 
                            />
                        </div>
                    </div>

                    {/* CHECKBOX DE PROPRIETÁRIO (Apenas no modo Edição) */}
                    {isEdit && (
                        <label 
                            className={styles.checkboxContainer}
                            style={{ 
                                borderColor: isOwner ? '#2563eb' : '#d1d5db', 
                                backgroundColor: isOwner ? '#eff6ff' : '#fff' 
                            }}
                        >
                            <div className={styles.checkboxContent}>
                                <span className={styles.checkboxTitle}>É o Proprietário?</span>
                                <span className={styles.checkboxDesc}>Responsável legal pelo veículo.</span>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={isOwner} 
                                onChange={(e) => setIsOwner(e.target.checked)}
                                className={styles.realCheckbox}
                            />
                            <div className={styles.checkIndicator}>
                                {isOwner ? <CheckCircle size={20} color="#2563eb" /> : <div className={styles.circleEmpty} />}
                            </div>
                        </label>
                    )}

                    {/* Footer Actions */}
                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.btnCancel}>
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className={`${styles.btnSave} ${isEdit ? styles.edit : styles.finalize}`} 
                            disabled={saving}
                        >
                            {saving ? "Salvando..." : (
                                <>
                                    {isEdit ? <Save size={18} /> : <SquareX size={18} />}
                                    {isEdit ? "Salvar Alterações" : "Encerrar Vínculo"}
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}