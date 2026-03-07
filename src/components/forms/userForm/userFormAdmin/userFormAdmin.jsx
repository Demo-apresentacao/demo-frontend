"use client";
import { useState, useEffect } from "react";
import { Edit, Check, X, EyeOff, Eye, Car, Plus, List, Trash2, Save, Truck, Bike, Calendar, Unlink } from "lucide-react";

import Swal from "sweetalert2";
import { InputRegisterForm } from "@/components/ui/inputRegisterForm/inputRegisterForm";
import { InputMaskRegister } from "@/components/ui/inputMaskRegister/inputMaskRegister";
import { SelectRegister } from "@/components/ui/selectRegister/selectRegister";
import { Can } from "@/components/ui/can";

import { validateCPF, validateEmail, getBirthDateError } from "@/utils/validators";

import ModalVehicleLink from "../../../modals/modalVehicleLink/modalVehicleLink";

import { useVehicleUsers } from "@/hooks/useVehicleUsers";
import { getUserVehicles } from "@/services/users.service"; // ou .services se for o caso

import styles from "../userForm.module.css";

export default function UserFormAdmin({ onSuccess, onCancel, saveFunction, initialData, mode = 'edit' }) {
    const [loading, setLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(mode === 'edit' || mode === 'create');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const [showLinkModal, setShowLinkModal] = useState(false);
    
    // Pegamos apenas o linkUser e o finalizeLink agora
    const { linkUser, finalizeLink } = useVehicleUsers();

    const [showVehiclesModal, setShowVehiclesModal] = useState(false);
    const [userVehiclesList, setUserVehiclesList] = useState([]);
    const [loadingVehicles, setLoadingVehicles] = useState(false);

    // Estados para o painel expansível
    const [editingLinkId, setEditingLinkId] = useState(null);
    const [savingLink, setSavingLink] = useState(false);

    const getInitialState = () => {
        const defaults = {
            usu_nome: "", usu_cpf: "", usu_data_nasc: "", usu_sexo: "0",
            usu_email: "", usu_senha: "", usu_acesso: "false", usu_observ: "", usu_telefone: ""
        };
        if (!initialData) return defaults;
        return {
            usu_nome: initialData.usu_nome || "",
            usu_cpf: initialData.usu_cpf || "",
            usu_data_nasc: initialData.usu_data_nasc ? initialData.usu_data_nasc.split('T')[0] : "",
            usu_sexo: String(initialData.usu_sexo ?? "0"),
            usu_email: initialData.usu_email || "",
            usu_senha: "",
            usu_acesso: String(initialData.usu_acesso ?? "false"),
            usu_observ: initialData.usu_observ || "",
            usu_telefone: initialData.usu_telefone || ""
        };
    };

    const [formData, setFormData] = useState(getInitialState());

    const passwordRules = {
        length: formData.usu_senha.length >= 12,
        capital: /[A-Z]/.test(formData.usu_senha),
        lower: /[a-z]/.test(formData.usu_senha),
        number: /\d/.test(formData.usu_senha),
        special: /[\W_]/.test(formData.usu_senha),
    };

    const isPasswordValid = Object.values(passwordRules).every(Boolean);

    useEffect(() => {
        setIsEditable(mode === 'edit' || mode === 'create');
        setErrors({});
    }, [mode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleMaskChange = (value, name) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!initialData && !validateCPF(formData.usu_cpf)) newErrors.usu_cpf = "CPF inválido.";
        if (!validateEmail(formData.usu_email)) newErrors.usu_email = "E-mail inválido.";

        const isTypingPassword = formData.usu_senha.length > 0;
        const isNewUser = !initialData;

        if (isNewUser || isTypingPassword) {
            if (!isPasswordValid) newErrors.usu_senha = "A senha não atende aos requisitos.";
        }

        if (formData.usu_data_nasc) {
            const dateError = getBirthDateError(formData.usu_data_nasc);
            if (dateError) newErrors.usu_data_nasc = dateError;
        }

        const phoneVal = formData.usu_telefone ? formData.usu_telefone.trim() : "";
        if (phoneVal.length === 0 || phoneVal === "() -" || phoneVal === "(") {
            newErrors.usu_telefone = "O telefone é obrigatório.";
        } else if (phoneVal.length > 0 && phoneVal.length < 14) {
            newErrors.usu_telefone = "Telefone incompleto.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // FUNÇÕES DE VEÍCULOS
    const getVehicleIcon = (categoryName) => {
        const name = (categoryName || "").toLowerCase();
        if (name.includes('caminhao') || name.includes('caminhão') || name.includes('caminhonete')) {
            return <Truck size={24} color="#eb2525" />;
        }
        if (name.includes('moto')) {
            return <Bike size={24} color="#eb2525" />;
        }
        return <Car size={24} color="#eb2525" />;
    };

    // Formata a data (YYYY-MM-DD para DD/MM/YYYY) de forma segura
    const formatDateBr = (dateString) => {
        if (!dateString) return '-';
        return dateString.split('T')[0].split('-').reverse().join('/');
    };

    const handleOpenVehiclesModal = async () => {
        if (!initialData?.usu_id) return;
        setShowVehiclesModal(true);
        setLoadingVehicles(true);
        setEditingLinkId(null);

        try {
            const response = await getUserVehicles(initialData.usu_id);
            setUserVehiclesList(response.data || response || []);
        } catch (error) {
            console.error("Erro ao buscar veículos:", error);
            setUserVehiclesList([]);
        } finally {
            setLoadingVehicles(false);
        }
    };

    const handleLinkVehicleSave = async (modalData) => {
        const payload = {
            usu_id: initialData.usu_id,
            veic_id: modalData.veic_id,
            ehproprietario: modalData.is_owner,
            data_inicial: modalData.start_date
        };
        const success = await linkUser(payload);
        if (success) {
            setShowLinkModal(false);
            if (showVehiclesModal) handleOpenVehiclesModal();
        }
    };

    // Expande o card
    const handleTogglePanel = (veic_usu_id) => {
        if (editingLinkId === veic_usu_id) {
            setEditingLinkId(null);
        } else {
            setEditingLinkId(veic_usu_id);
        }
    };

    // ENCERRAR VÍNCULO COM SWEETALERT
    const handleFinalizeLink = async (veic_usu_id, placa) => {
        // 1. Pede a confirmação do usuário
        const confirm = await Swal.fire({
            title: 'Encerrar Vínculo?',
            text: `Tem certeza que deseja desvincular o veículo ${placa} deste usuário?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#eb2525', // Vermelho do sistema
            cancelButtonColor: '#6b7280',  // Cinza
            confirmButtonText: 'Sim, encerrar!',
            cancelButtonText: 'Cancelar'
        });

        // 2. Se o usuário clicar em "Sim"
        if (confirm.isConfirmed) {
            setSavingLink(true);
            const today = new Date().toISOString().split('T')[0]; // Pega a data atual
            
            const success = await finalizeLink(veic_usu_id, today);
            setSavingLink(false);

            // 3. Se a API retornou sucesso, mostra o aviso final
            if (success) {
                Swal.fire({
                    title: 'Encerrado!',
                    text: 'O veículo foi desvinculado com sucesso.',
                    icon: 'success',
                    confirmButtonColor: '#16a34a' // Verde
                });
                
                setEditingLinkId(null);
                handleOpenVehiclesModal(); // Recarrega a lista
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        const phoneVal = formData.usu_telefone ? formData.usu_telefone.trim() : "";
        const isPhoneValid = phoneVal.length >= 14;

        const payload = {
            ...formData,
            usu_sexo: Number(formData.usu_sexo),
            usu_acesso: formData.usu_acesso === "true",
            usu_telefone: isPhoneValid ? formData.usu_telefone : null
        };
        if (initialData && !payload.usu_senha) delete payload.usu_senha;

        try {
            const result = await saveFunction(payload);
            if (result && result.success) onSuccess();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = () => {
        if (mode === 'view' && isEditable) {
            setIsEditable(false);
            setFormData(getInitialState());
            setErrors({});
        } else {
            onCancel();
        }
    };

    const ErrorMessage = ({ message }) => {
        if (!message) return null;
        return <span className={styles.errorText}>{message}</span>;
    };

    const PasswordReqItem = ({ label, met }) => (
        <div className={`${styles.reqItem} ${met ? styles.success : styles.pending}`}>
            {met ? <Check size={12} /> : <X size={12} />}
            <span>{label}</span>
        </div>
    );

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.form}>

                {initialData && (
                    <div className={styles.inputGroup}>
                        <InputRegisterForm label="ID" value={initialData.usu_id} disabled={true} />
                    </div>
                )}

                <div className={styles.inputGroup}>
                    <InputRegisterForm name="usu_nome" label="Nome Completo" value={formData.usu_nome} onChange={handleChange} required disabled={!isEditable} />
                    <ErrorMessage message={errors.usu_nome} />
                </div>

                <div className={styles.inputGroup}>
                    <InputMaskRegister name="usu_cpf" label="CPF" mask="000.000.000-00" value={formData.usu_cpf} onAccept={(value) => handleMaskChange(value, "usu_cpf")} required disabled={!isEditable || !!initialData} />
                    <ErrorMessage message={errors.usu_cpf} />
                </div>

                <div className={styles.inputGroup}>
                    <InputRegisterForm name="usu_data_nasc" label="Data Nascimento" type="date" value={formData.usu_data_nasc} onChange={handleChange} required disabled={!isEditable} />
                    <ErrorMessage message={errors.usu_data_nasc} />
                </div>

                <div className={styles.inputGroup}>
                    <SelectRegister name="usu_sexo" label="Sexo" value={formData.usu_sexo} onChange={handleChange} disabled={!isEditable} options={[{ value: "0", label: "Masculino" }, { value: "1", label: "Feminino" }, { value: "2", label: "Outro" }]} />
                    <ErrorMessage message={errors.usu_sexo} />
                </div>

                <div className={styles.inputGroup}>
                    <InputRegisterForm name="usu_email" label="E-mail" type="email" value={formData.usu_email} onChange={handleChange} required disabled={!isEditable} />
                    <ErrorMessage message={errors.usu_email} />
                </div>

                <div className={styles.inputGroup}>
                    <InputMaskRegister name="usu_telefone" label="Telefone" mask="(00) 00000-0000" value={formData.usu_telefone} onAccept={(value) => handleMaskChange(value, "usu_telefone")} required disabled={!isEditable} />
                    <ErrorMessage message={errors.usu_telefone} />
                </div>

                <div className={styles.inputGroup}>
                    <div style={{ position: 'relative' }}>
                        <InputRegisterForm name="usu_senha" label={initialData ? "Nova Senha (deixe em branco para manter)" : "Senha"} type={showPassword ? "text" : "password"} value={formData.usu_senha} onChange={handleChange} required={!initialData} disabled={!isEditable} />
                        {isEditable && (
                            <button type="button" className={styles.eyeButton} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        )}
                    </div>
                    <ErrorMessage message={errors.usu_senha} />

                    {isEditable && formData.usu_senha.length > 0 && !isPasswordValid && (
                        <div className={styles.passwordRequirements}>
                            <PasswordReqItem label="Mínimo de 12 caracteres" met={passwordRules.length} />
                            <PasswordReqItem label="Letra Maiúscula" met={passwordRules.capital} />
                            <PasswordReqItem label="Letra Minúscula" met={passwordRules.lower} />
                            <PasswordReqItem label="Número" met={passwordRules.number} />
                            <PasswordReqItem label="Caractere Especial" met={passwordRules.special} />
                        </div>
                    )}
                </div>

                <div className={styles.inputGroup}>
                    <SelectRegister name="usu_acesso" label="Tipo de Acesso" value={formData.usu_acesso} onChange={handleChange} disabled={!isEditable} options={[{ value: "false", label: "Usuário Comum" }, { value: "true", label: "Administrador" }]} />
                    <ErrorMessage message={errors.usu_acesso} />
                </div>

                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <InputRegisterForm name="usu_observ" label="Observações" value={formData.usu_observ} onChange={handleChange} disabled={!isEditable} />
                </div>

                <div className={styles.actions}>

                    {!!initialData && (
                        <div className={styles.vehicleActionsGroup}>
                            <Can perform="veiculos_usuario.listar">
                                <button type="button" className={styles.btnViewVehicles} onClick={handleOpenVehiclesModal}>
                                    <List size={16} style={{ marginRight: 5 }} />
                                    Ver Veículos
                                </button>
                            </Can>

                            <Can perform="veiculos_usuario.criar">
                                <button type="button" className={styles.btnAddVehicle} onClick={() => setShowLinkModal(true)}>
                                    <Plus size={16} style={{ marginRight: 5 }} />
                                    Adicionar Veículo
                                </button>
                            </Can>
                        </div>
                    )}

                    {!isEditable ? (
                        <Can perform="usuarios.editar">
                            <button type="button" className={styles.btnSave} onClick={() => setIsEditable(true)}>
                                <Edit size={16} style={{ marginRight: 5 }} /> Editar Dados
                            </button>
                        </Can>
                    ) : (
                        <>
                            <button type="button" onClick={handleCancelClick} className={styles.btnCancel} disabled={loading}>
                                Cancelar
                            </button>

                            {mode === 'create' ? (
                                <Can perform="usuarios.criar">
                                    <button type="submit" className={styles.btnSave} disabled={loading}>
                                        {loading ? "Salvando..." : "Cadastrar Usuário"}
                                    </button>
                                </Can>
                            ) : (
                                <Can perform="usuarios.editar">
                                    <button type="submit" className={styles.btnSave} disabled={loading}>
                                        {loading ? "Salvando..." : "Salvar Alterações"}
                                    </button>
                                </Can>
                            )}
                        </>
                    )}
                </div>
            </form>

            <ModalVehicleLink
                isOpen={showLinkModal}
                onClose={() => setShowLinkModal(false)}
                onSave={handleLinkVehicleSave}
            />

            {/* MODAL: MEUS VEÍCULOS */}
            {showVehiclesModal && (
                <div className={styles.modalOverlay} onClick={() => setShowVehiclesModal(false)}>
                    <div className={styles.modalContent} style={{ maxWidth: '550px' }} onClick={e => e.stopPropagation()}>

                        <div className={styles.modalHeader}>
                            <h3>Veículos de {initialData?.usu_nome}</h3>
                            <button className={styles.closeBtn} onClick={() => setShowVehiclesModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            {loadingVehicles ? (
                                <p className={styles.emptyText}>Buscando veículos...</p>
                            ) : userVehiclesList.length > 0 ? (
                                <div className={styles.vehicleList}>
                                    
                                    {userVehiclesList.map(v => {
                                        const isExpanded = editingLinkId === v.veic_usu_id;

                                        return (
                                            <div key={v.veic_usu_id} className={styles.vehicleCardContainer}>
                                                
                                                {/* CABEÇALHO DO CARD */}
                                                <div className={styles.vehicleCardHeader} onClick={() => handleTogglePanel(v.veic_usu_id)} style={{ cursor: 'pointer' }}>
                                                    <div className={styles.vehicleIconWrapper}>
                                                        {getVehicleIcon(v.cat_nome)}
                                                    </div>
                                                    <div className={styles.vehicleInfo}>
                                                        <span className={styles.vehiclePlate}>{v.veic_placa}</span>
                                                        <span className={styles.vehicleModel}>{v.mod_nome} {v.veic_ano && `- ${v.veic_ano}`}</span>
                                                    </div>
                                                    
                                                    {/* Ícone virou uma setinha/lápis indicando ação */}
                                                    <button type="button" className={`${styles.btnManageVehicle} ${isExpanded ? styles.active : ''}`}>
                                                        {isExpanded ? <X size={18} color="#ef4444" /> : <Edit size={18} />}
                                                    </button>
                                                </div>

                                                {/* PAINEL EXPANSÍVEL: INFORMAÇÃO DIRETA */}
                                                {isExpanded && (
                                                    <div className={styles.editLinkPanel}>
                                                        <div className={styles.infoGrid}>
                                                            <div className={styles.infoCol}>
                                                                <span className={styles.infoLabel}>Início do Vínculo:</span>
                                                                <span className={styles.infoValue}>{formatDateBr(v.data_inicial)}</span>
                                                            </div>
                                                            <div className={styles.infoCol}>
                                                                <span className={styles.infoLabel}>Proprietário Responsável:</span>
                                                                <span className={styles.infoValue}>{v.ehproprietario ? "Sim" : "Não"}</span>
                                                            </div>
                                                        </div>

                                                        <div className={styles.editPanelActions} style={{ justifyContent: 'flex-end', borderTop: 'none', paddingTop: 0 }}>
                                                            <button 
                                                                type="button" 
                                                                className={styles.btnEndLink}
                                                                onClick={() => handleFinalizeLink(v.veic_usu_id, v.veic_placa)}
                                                                disabled={savingLink}
                                                            >
                                                                {savingLink ? "Aguarde..." : <><Unlink size={16} /> Encerrar Vínculo</>}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className={styles.emptyText}>Este usuário não possui veículos vinculados.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}