"use client";

import { useState, useMemo, useEffect } from "react";
import { Edit, Save, Plus, Settings, List } from "lucide-react";
import Swal from "sweetalert2";

import { InputRegisterForm } from "../../ui/inputRegisterForm/inputRegisterForm";
import { InputMaskRegister } from "../../ui/inputMaskRegister/inputMaskRegister";
import { SelectRegister } from "../../ui/selectRegister/selectRegister";

import styles from "../servicesForm/servicesForm.module.css";

import CategoryModal from "../../modals/modalServicesCategories/CategoryModal";
import ManageCategoriesModal from "../../modals/modalServicesCategories/ManageCategories";

import { useServiceCategories } from "@/hooks/useServicesCategories";
import { useCategoriesVehiclesForServices } from "@/hooks/useCategoriesVehiclesForServices";

/* =====================================================
   FUNÇÕES AUXILIARES DE MOEDA
===================================================== */
const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") return "";
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
};

const maskCurrency = (value) => {
    const onlyDigits = String(value).replace(/\D/g, "");
    return formatCurrency(Number(onlyDigits) / 100);
};

const parseCurrency = (value) => {
    if (!value) return 0;
    const clean = String(value)
        .replace(/[R$\s.]/g, "")
        .replace(",", ".");
    return parseFloat(clean);
};

/* =====================================================
   COMPONENTE
===================================================== */
export default function ServiceForm({
    onSuccess,
    onCancel,
    saveFunction,
    initialData,
    mode = "create",
}) {
    /* =====================================================
       HOOKS BÁSICOS
    ===================================================== */
    const [loading, setLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(mode !== "view");

    const {
        categories,
        loading: loadingCategories,
        refetch,
    } = useServiceCategories();

    const {
        vehicleCategories,
        loading: loadingVehicles,
    } = useCategoriesVehiclesForServices();

    /* =====================================================
       MODAIS
    ===================================================== */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);

    /* =====================================================
       FORM DATA
    ===================================================== */
    const mapServiceData = (data) => ({
        category_id: data?.cat_serv_id || "",
        serv_nome: data?.serv_nome || "",
        serv_descricao: data?.serv_descricao || "",
        serv_situacao: String(data?.serv_situacao ?? "true"),
    });

    const [formData, setFormData] = useState(
        mapServiceData(initialData)
    );

    /* =====================================================
       CONFIGURAÇÃO DE VEÍCULOS
    ===================================================== */
    const initialVehicleConfig = useMemo(() => {
        if (!vehicleCategories?.length) return {};

        const config = {};

        vehicleCategories.forEach((item) => {
            const catVehId = item.tps_id || item.id;
            const saved = initialData?.precos?.find(
                (p) => Number(p.tps_id) === Number(catVehId)
            );

            config[catVehId] = saved
                ? {
                    checked: true,
                    price: formatCurrency(saved.preco),
                    duration: saved.duracao,
                }
                : { checked: false, price: "", duration: "" };
        });

        return config;
    }, [vehicleCategories, initialData]);

    const [vehicleConfig, setVehicleConfig] =
        useState(initialVehicleConfig);

    /* =====================================================
       EFFECTS
    ===================================================== */
    useEffect(() => {
        setFormData(mapServiceData(initialData));
        setVehicleConfig(initialVehicleConfig);
    }, [initialData, initialVehicleConfig]);

    /* =====================================================
       DERIVED STATE
    ===================================================== */
    const filteredCategories = useMemo(() => {
        return categories.filter((cat) => {
            if (cat.active === true) return true;
            if (String(cat.value) === String(formData.category_id))
                return true;
            return false;
        });
    }, [categories, formData.category_id]);

    /* =====================================================
       HANDLERS
    ===================================================== */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckVehicle = (catVehId) => {
        if (!isEditable) return;
        setVehicleConfig((prev) => ({
            ...prev,
            [catVehId]: {
                ...prev[catVehId],
                checked: !prev[catVehId]?.checked,
            },
        }));
    };

    const handleVehiclePriceChange = (e, catVehId) => {
        if (!isEditable) return;
        setVehicleConfig((prev) => ({
            ...prev,
            [catVehId]: {
                ...prev[catVehId],
                price: maskCurrency(e.target.value),
            },
        }));
    };

    const handleVehicleDurationChange = (value, catVehId) => {
        if (!isEditable) return;
        setVehicleConfig((prev) => ({
            ...prev,
            [catVehId]: {
                ...prev[catVehId],
                duration: value,
            },
        }));
    };

    const handleNewCategory = () => {
        setCategoryToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditCategory = () => {
        if (!formData.category_id) return;
        const cat = categories.find(
            (c) =>
                String(c.value) === String(formData.category_id)
        );
        if (cat) {
            setCategoryToEdit(cat);
            setIsModalOpen(true);
        }
    };

    const handleCancelClick = (e) => {
        e.preventDefault();
        if (mode === "create") {
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
        if (!isEditable) return;

        const checked = Object.entries(vehicleConfig).filter(
            ([_, cfg]) => cfg.checked
        );

        if (!checked.length) {
            Swal.fire({
                title: "Atenção",
                text: "Selecione ao menos um veículo.",
                icon: "warning",
            });
            return;
        }

        const invalid = checked.filter(([_, cfg]) => {
            const price = parseCurrency(cfg.price);
            return (
                !cfg.price ||
                price <= 0 ||
                !cfg.duration ||
                cfg.duration.includes("_") ||
                cfg.duration === "00:00"
            );
        });

        if (invalid.length) {
            Swal.fire({
                title: "Campos Incompletos",
                text: "Verifique preços e durações.",
                icon: "warning",
            });
            return;
        }

        setLoading(true);

        const payload = {
            serv_nome: formData.serv_nome.trim(),
            serv_descricao: formData.serv_descricao?.trim() || "",
            cat_serv_id: Number(formData.category_id),
            serv_situacao: formData.serv_situacao === "true",
            prices: checked.map(([catVehId, cfg]) => ({
                tps_id: Number(catVehId),
                preco: parseCurrency(cfg.price),
                duracao: cfg.duration,
            })),
        };

        try {
            const result = await saveFunction(payload);
            if (result?.success || result?.status === "success") {
                setIsEditable(false);
                onSuccess?.();
            }
        } catch {
            Swal.fire({
                title: "Erro",
                text: "Erro ao salvar serviço.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };


    const handleModalSuccess = () => {
        setIsModalOpen(false);

        // Recarrega categorias (nova ou editada)
        refetch();

        // Se quiser limpar categoria selecionada após criar
        // setFormData(prev => ({ ...prev, category_id: "" }));
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.sectionTitle}>
                    {mode === 'create' ? "Cadastrar" : isEditable ? "Editar" : "Visualizar"} Serviço
                </div>


                <div className={styles.inputGroup}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <SelectRegister
                                name="category_id"
                                label={loadingCategories ? "Carregando..." : "Categoria do Serviço"}
                                value={formData.category_id}
                                onChange={handleChange}
                                disabled={!isEditable || loadingCategories}
                                options={filteredCategories}
                                required
                            />
                        </div>

                        {isEditable && (
                            <div className={styles.categoryActions}>
                                <button
                                    type="button"
                                    className={`${styles.btnIcon} ${styles.btnAddCat}`}
                                    onClick={handleNewCategory}
                                    title="Nova Categoria"
                                >
                                    <Plus size={20} />
                                </button>

                                <button
                                    type="button"
                                    className={styles.btnIcon}
                                    style={{ backgroundColor: '#8b5cf6', color: 'white' }}
                                    onClick={() => setIsListModalOpen(true)}
                                    title="Gerenciar Categorias"
                                >
                                    <List size={20} />
                                </button>

                                <button
                                    type="button"
                                    className={`${styles.btnIcon} ${styles.btnEditCat}`}
                                    onClick={handleEditCategory}
                                    title="Editar Categoria Selecionada"
                                    disabled={!formData.category_id}
                                >
                                    <Settings size={20} />
                                </button>
                            </div>
                        )}
                    </div>
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

                                        />
                                        <InputMaskRegister
                                            placeholder="Duração"
                                            mask="00:00"
                                            value={config.duration || ""}
                                            onAccept={(val) => handleVehicleDurationChange(val, catVehId)}
                                            disabled={!config.checked || !isEditable}

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

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
                categoryToEdit={categoryToEdit}
            />

            <ManageCategoriesModal
                isOpen={isListModalOpen}
                onClose={() => setIsListModalOpen(false)}
                categories={categories}
                onUpdate={refetch}
            />
        </>
    );
}