"use client";

import { useState, useMemo, useEffect } from "react";
import { Edit, Save } from "lucide-react"; 
import { InputRegisterForm } from "../../ui/inputRegisterForm/inputRegisterForm";
import { InputMaskRegister } from "../../ui/inputMaskRegister/inputMaskRegister";
import { SelectRegister } from "../../ui/selectRegister/selectRegister";
import styles from "../servicesForm2/servicesForm.module.css";
import Swal from "sweetalert2";

// --- HOOKS ---
import { useServiceCategories } from "@/hooks/useServicesCategories";
import { useCategoriesVehiclesForServices } from "@/hooks/useCategoriesVehiclesForServices";

// --- FUNÇÕES AUXILIARES DE MOEDA ---
const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") return "";
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const maskCurrency = (value) => {
    const onlyDigits = String(value).replace(/\D/g, "");
    const numberValue = Number(onlyDigits) / 100;
    return formatCurrency(numberValue);
};

const parseCurrency = (value) => {
    if (!value) return 0;
    const cleanString = String(value).replace(/[R$\s.]/g, "").replace(",", ".");
    return parseFloat(cleanString);
};

export default function ServiceForm({ onSuccess, onCancel, saveFunction, initialData, mode = 'create' }) {
    const [loading, setLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(mode !== "view");

    const { categories: serviceOptions, loading: loadingCategories } = useServiceCategories();
    const { vehicleCategories, loading: loadingVehicles } = useCategoriesVehiclesForServices();

    // 1. MAPEAMENTO DE DADOS (Adicionado serv_situacao)
    const mapServiceData = (data) => ({
        category_id: data?.cat_serv_id || "",
        serv_nome: data?.serv_nome || "",
        serv_descricao: data?.serv_descricao || "",
        serv_situacao: String(data?.serv_situacao ?? "true"), // Padrão Ativo
    });

    const [formData, setFormData] = useState(mapServiceData(initialData));

    // 2. CONFIGURAÇÃO DOS VEÍCULOS
    const initialVehicleConfig = useMemo(() => {
        if (!vehicleCategories || vehicleCategories.length === 0) return {};
        const config = {};
        vehicleCategories.forEach((item) => {
            const catVehId = item.tps_id || item.id;
            const savedPrice = initialData?.precos?.find(p => Number(p.tps_id) === Number(catVehId));
            config[catVehId] = savedPrice ? {
                checked: true,
                price: formatCurrency(savedPrice.preco),
                duration: savedPrice.duracao
            } : { checked: false, price: "", duration: "" };
        });
        return config;
    }, [vehicleCategories, initialData]);

    const [vehicleConfig, setVehicleConfig] = useState(initialVehicleConfig);

    useEffect(() => {
        setFormData(mapServiceData(initialData));
        setVehicleConfig(initialVehicleConfig);
    }, [initialData, initialVehicleConfig]);

    // HANDLERS
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckVehicle = (catVehId) => {
        if (!isEditable) return;
        setVehicleConfig(prev => ({
            ...prev,
            [catVehId]: { ...prev[catVehId], checked: !prev[catVehId]?.checked }
        }));
    };

    const handleVehiclePriceChange = (e, catVehId) => {
        if (!isEditable) return;
        setVehicleConfig(prev => ({
            ...prev,
            [catVehId]: { ...prev[catVehId], price: maskCurrency(e.target.value) }
        }));
    };

    const handleVehicleDurationChange = (value, catVehId) => {
        if (!isEditable) return;
        setVehicleConfig(prev => ({
            ...prev,
            [catVehId]: { ...prev[catVehId], duration: value }
        }));
    };

    const handleCancelClick = (e) => {
        e.preventDefault();
        if (mode === 'create') {
            onCancel();
        } else {
            setFormData(mapServiceData(initialData));
            setVehicleConfig(initialVehicleConfig);
            setIsEditable(false);
        }
    };

    const handleEditClick = (e) => {
        e.preventDefault();
        setIsEditable(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isEditable) return false;

        const checkedEntries = Object.entries(vehicleConfig).filter(([_, config]) => config.checked);

        if (checkedEntries.length === 0) {
            Swal.fire({ title: "Atenção", text: "Selecione ao menos um veículo.", icon: "warning" });
            return;
        }

        const invalidEntries = checkedEntries.filter(([_, config]) => {
            const priceValue = parseCurrency(config.price);
            return !config.price || priceValue <= 0 || !config.duration || config.duration.includes("_") || config.duration === "00:00";
        });

        if (invalidEntries.length > 0) {
            Swal.fire({ title: "Campos Incompletos", text: "Verifique preços e durações dos itens marcados.", icon: "warning" });
            return;
        }

        setLoading(true);

        // 3. PAYLOAD COM SITUAÇÃO FORMATADA
        const payload = {
            serv_nome: formData.serv_nome.trim(),
            serv_descricao: formData.serv_descricao?.trim() || "",
            cat_serv_id: Number(formData.category_id),
            serv_situacao: formData.serv_situacao === "true", // Converte string para boolean
            prices: checkedEntries.map(([catVehId, config]) => ({
                tps_id: Number(catVehId),
                preco: parseCurrency(config.price),
                duracao: config.duration
            }))
        };

        try {
            const result = await saveFunction(payload);
            if (result && (result.success || result.status === 'success')) {
                setIsEditable(false);
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            Swal.fire({ title: "Erro", text: "Erro ao salvar serviço.", icon: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.sectionTitle}>
                {mode === 'create' ? "Cadastrar" : isEditable ? "Editar" : "Visualizar"} Serviço
            </div>

            <div className={styles.inputGroup}>
                <SelectRegister
                    name="category_id"
                    label="Categoria"
                    value={formData.category_id}
                    onChange={handleChange}
                    disabled={loadingCategories || !isEditable}
                    options={serviceOptions} 
                    placeholder="Selecione..."
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <InputRegisterForm
                    name="serv_nome"
                    label="Nome do Serviço"
                    value={formData.serv_nome}
                    onChange={handleChange}
                    disabled={!isEditable}
                    required
                />
            </div>

            {/* 4. CAMPO DE SITUAÇÃO ADICIONADO */}
            <div className={styles.inputGroup}>
                <SelectRegister
                    name="serv_situacao"
                    label="Situação"
                    value={formData.serv_situacao}
                    onChange={handleChange}
                    disabled={!isEditable}
                    options={[
                        { value: "true", label: "Ativo" },
                        { value: "false", label: "Inativo" }
                    ]}
                />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <InputRegisterForm
                    name="serv_descricao"
                    label="Descrição"
                    value={formData.serv_descricao}
                    onChange={handleChange}
                    disabled={!isEditable}
                    textarea
                />
            </div>

            <div className={styles.sectionTitle} style={{ marginTop: '20px' }}>
                Configuração por Veículo
            </div>

            {loadingVehicles ? <p>Carregando...</p> : (
                <div className={styles.vehicleList}>
                    {vehicleCategories.map((item) => {
                        const catVehId = item.tps_id || item.id; 
                        const config = vehicleConfig[catVehId] || { checked: false, price: "", duration: "" };
                        return (
                            <div key={catVehId} className={styles.vehicleRow}>
                                <div className={styles.vehicleCheck}>
                                    <input
                                        type="checkbox"
                                        id={`veh-${catVehId}`}
                                        checked={!!config.checked}
                                        onChange={() => handleCheckVehicle(catVehId)}
                                        disabled={!isEditable}
                                    />
                                    <label htmlFor={`veh-${catVehId}`}>{item.tps_nome || item.nome}</label>
                                </div>
                                <div className={styles.vehicleInputs}>
                                    <InputRegisterForm
                                        placeholder="Preço"
                                        value={config.price || ""}
                                        onChange={(e) => handleVehiclePriceChange(e, catVehId)}
                                        disabled={!config.checked || !isEditable}
                                        small
                                    />
                                    <InputMaskRegister
                                        placeholder="Duração"
                                        mask="00:00"
                                        value={config.duration || ""}
                                        onAccept={(val) => handleVehicleDurationChange(val, catVehId)}
                                        disabled={!config.checked || !isEditable}
                                        small
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className={styles.actions} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                {!isEditable ? (
                    <>
                         <button type="button" onClick={onCancel} className={styles.btnCancel}>Voltar</button>
                        <button 
                            type="button" 
                            className={styles.btnSave} 
                            onClick={handleEditClick}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <Edit size={16} style={{ marginRight: 5 }} /> Editar Dados
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            type="button" 
                            onClick={handleCancelClick} 
                            className={styles.btnCancel} 
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className={styles.btnSave} 
                            disabled={loading}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <Save size={16} style={{ marginRight: 5 }} /> 
                            {loading ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </>
                )}
            </div>
        </form>
    );
}