"use client";
import { useEffect, useState } from "react"; // Adicione useState
import { X, User, ShieldCheck, History, SquareX, Edit } from "lucide-react";
import Swal from "sweetalert2"; // Ainda pode ser usado para erros genéricos
import { useVehicleUsers } from "@/hooks/useVehicleUsers";
import ModalEditLink from "../modalEditLink/modalEditLink";

import styles from "./modalVehicleHistory.module.css";

export default function VehicleHistoryModal({ isOpen, onClose, vehicleId }) {
    const { history, fetchHistory, finalizeLink, editLink, loading } = useVehicleUsers();

    // --- ESTADOS PARA O NOVO MODAL ---
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('edit'); // 'edit' ou 'finalize'
    const [selectedItem, setSelectedItem] = useState(null); // Guarda o item clicado

    useEffect(() => {
        if (isOpen && vehicleId) {
            fetchHistory(vehicleId);
        }
    }, [isOpen, vehicleId, fetchHistory]);

    // 1. Ao clicar no lápis (Editar)
    const handleEditClick = (item) => {
        setSelectedItem({
            id: item.veic_usu_id,
            userName: item.usu_nome,
            date: item.data_inicial,
            isOwner: item.ehproprietario
        });
        setModalMode('edit');
        setEditModalOpen(true);
    };

    // 2. Ao clicar no X (Finalizar)
    const handleFinalizeClick = (item) => {
        setSelectedItem({
            id: item.veic_usu_id,
            userName: item.usu_nome,
            // Data não precisa carregar, o modal pega a de hoje
        });
        setModalMode('finalize');
        setEditModalOpen(true);
    };

    // 3. Quando o Modal Salva
    const handleModalSave = async (formData) => {
        if (!selectedItem) return;

        let success = false;

        if (modalMode === 'edit') {
            // Modo Edição: Manda data_inicial e ehproprietario
            success = await editLink(selectedItem.id, {
                data_inicial: formData.date,
                ehproprietario: formData.isOwner
            });
        } else {
            // Modo Finalizar: Manda data_final
            success = await finalizeLink(selectedItem.id, formData.date);
        }

        if (success) {
            fetchHistory(vehicleId); // Recarrega lista
        }
    };

    if (!isOpen) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' }); 
    };

    return (
        <>
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    
                    <div className={styles.header}>
                        <h3><History size={20} style={{marginRight:8}}/> Histórico de Vínculos</h3>
                        <button onClick={onClose} className={styles.closeBtn}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className={styles.body}>
                        {loading ? (
                            <div className={styles.centerText}>Carregando histórico...</div>
                        ) : history.length === 0 ? (
                            <div className={styles.centerText}>Nenhum vínculo encontrado.</div>
                        ) : (
                            <div className={styles.tableContainer}>
                                <table className={styles.historyTable}>
                                    <thead>
                                        <tr>
                                            <th>Usuário</th>
                                            <th>Início</th>
                                            <th>Fim</th>
                                            <th style={{textAlign: 'center'}}>Dono?</th>
                                            <th style={{textAlign: 'center', width: '90px'}}>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((item) => {
                                            const isActive = !item.data_final;
                                            return (
                                                <tr key={item.veic_usu_id} className={!isActive ? styles.inactiveRow : ''}>
                                                    <td>
                                                        <div className={styles.userName}>
                                                            <User size={14} /> {item.usu_nome}
                                                        </div>
                                                    </td>
                                                    <td>{formatDate(item.data_inicial)}</td>
                                                    <td>
                                                        {isActive ? (
                                                            <span className={styles.badgeActive}>Ativo</span>
                                                        ) : (
                                                            formatDate(item.data_final)
                                                        )}
                                                    </td>
                                                    <td style={{textAlign: 'center'}}>
                                                        {item.ehproprietario ? <ShieldCheck size={16} color="#2563eb"/> : "-"}
                                                    </td>
                                                    <td style={{textAlign: 'center'}}>
                                                        <div className={styles.actionsCell}>
                                                            
                                                            <button 
                                                                className={styles.btnEdit} 
                                                                onClick={() => handleEditClick(item)}
                                                                title="Corrigir Dados"
                                                            >
                                                                <Edit size={16} />
                                                            </button>

                                                            {isActive && (
                                                                <button 
                                                                    className={styles.btnFinalize} 
                                                                    onClick={() => handleFinalizeClick(item)}
                                                                    title="Finalizar Vínculo"
                                                                >
                                                                    <SquareX size={18} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    
                    <div className={styles.footer}>
                        <button onClick={onClose} className={styles.btnClose}>Fechar</button>
                    </div>
                </div>
            </div>

            {/* --- NOVO MODAL DE EDIÇÃO/FINALIZAÇÃO --- */}
            {/* Ele fica "por cima" do histórico se o z-index no CSS estiver correto */}
            <ModalEditLink 
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={handleModalSave}
                type={modalMode} // 'edit' ou 'finalize'
                initialData={selectedItem}
            />
        </>
    );
}