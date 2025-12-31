"use client";

import { useState, useEffect, useRef } from "react"; // Adicionado useCallback
import { useVehicles } from "@/hooks/useVehicles";
import { Table } from "@/components/ui/table/table";
import Link from "next/link";
import { Edit, Search, Plus, Eye, ChevronDown, Filter, Trash2, RotateCcw } from "lucide-react";
import { Pagination } from "@/components/ui/pagination/pagination";
import { toggleVehicleStatus } from "@/services/vehicles.service";
import Swal from "sweetalert2";

import styles from "./VehiclesClient.module.css";

export default function VehiclesClient() {
    const { vehicles, loading, fetchVehicles, page, totalPages } = useVehicles();
    const [inputValue, setInputValue] = useState("");

    const [statusFilter, setStatusFilter] = useState("all"); // all, active, 

    // Ref para impedir que a busca da digitação rode na montagem inicial   
    const isMounted = useRef(false);

    // --- EFEITO 1: Roda APENAS UMA VEZ ao abrir a tela (Mount) ---
    useEffect(() => {
        fetchVehicles("", 1, statusFilter);
    }, []);

    // --- EFEITO 2: Roda APENAS quando o input muda (Update) ---
    useEffect(() => {
        // Se o componente ainda não montou completamente, não faz nada
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        // Debounce: Espera o usuário parar de digitar
        const delayDebounceFn = setTimeout(() => {
            fetchVehicles(inputValue, 1, statusFilter);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [inputValue, statusFilter, fetchVehicles]);

    const handlePageChange = (newPage) => {
        fetchVehicles(inputValue, newPage, statusFilter);
    };


    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };


    console.log("statusFilter:", statusFilter);

    // --- FUNÇÕES DE STATUS (Mantidas iguais) ---
    const handleArchiveVehicle = async (id, nome) => {
        const result = await Swal.fire({
            title: 'Ocultar Veículo?',
            text: `O veículo "${nome}" ficará inativo.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sim, ocultar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await toggleVehicleStatus(id, false);
                await Swal.fire('Ocultado!', 'Veículo desativado.', 'success');
                fetchVehicles(inputValue, page, statusFilter);
            } catch (error) {
                console.error(error);
                Swal.fire('Erro', 'Erro ao ocultar.', 'error');
            }
        }
    };

    const handleReactivateVehicle = async (id, nome) => {
        const result = await Swal.fire({
            title: 'Reativar Veículo?',
            text: `O veículo "${nome}" voltará a ficar visível.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sim, reativar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await toggleVehicleStatus(id, true);
                await Swal.fire('Ativado!', 'Veículo reativado.', 'success');
                fetchVehicles(inputValue, page, statusFilter);
            } catch (error) {
                console.error(error);
                Swal.fire('Erro', 'Erro ao reativar.', 'error');
            }
        }
    };

    const columns = [
        { header: "ID", accessor: "veic_id" },
        { header: "Modelo", accessor: "modelo" },
        { header: "Marca", accessor: "marca" },
        { header: "Placa", accessor: "veic_placa" },
        {
            header: "Proprietários",
            accessor: "proprietarios",
            render: (vehicle) => {
                // Caso 1: Sem proprietário
                if (!vehicle.proprietarios) {
                    return <span className={styles.emptyText}>-</span>;
                }

                const ownersList = vehicle.proprietarios.split(',').map(name => name.trim());

                // Caso 2: Apenas 1 proprietário
                if (ownersList.length === 1) {
                    // Dica: Adicionei um estilo simples aqui para manter o padrão
                    return <span style={{ fontSize: '0.875rem', color: '#374151' }}>{ownersList[0]}</span>;
                }

                // Caso 3: Múltiplos (Dropdown Estilizado)
                return (
                    <div className={styles.selectContainer}>
                        <select className={styles.selectNative} defaultValue="">
                            {/* O valor disabled vazio serve como placeholder */}
                            <option value="" disabled style={{ color: '#9ca3af' }}>
                                {ownersList.length} Proprietários
                            </option>

                            {ownersList.map((owner, index) => (
                                <option key={index} value={owner}>
                                    {owner}
                                </option>
                            ))}
                        </select>

                        {/* O ícone fica flutuando por cima do select via CSS absolute */}
                        <ChevronDown size={14} className={styles.selectIcon} />
                    </div>
                );
            },
        },
        {
            header: "Status",
            accessor: "veic_situacao",
            render: (vehicle) => (
                <span style={{
                    backgroundColor: vehicle.veic_situacao ? '#dcfce7' : '#fee2e2',
                    color: vehicle.veic_situacao ? '#166534' : '#991b1b',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    border: vehicle.veic_situacao ? '1px solid #bbf7d0' : '1px solid #fecaca'
                }}>
                    {vehicle.veic_situacao ? "Ativo" : "Inativo"}
                </span>
            ),
        },
        {
            header: "Ações",
            accessor: "actions",
            render: (vehicle) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link
                        href={`/admin/vehicles/${vehicle.veic_id}?mode=view`}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', textDecoration: 'none' }}
                    >
                        <Eye size={16} />
                    </Link>
                    <Link
                        href={`/admin/vehicles/${vehicle.veic_id}?mode=edit`}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', textDecoration: 'none' }}
                    >
                        <Edit size={16} />
                    </Link>
                    {vehicle.veic_situacao ? (
                        <button
                            onClick={() => handleArchiveVehicle(vehicle.veic_id, vehicle.veic_placa)}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                            title="Ocultar (Inativar)"
                        >
                            <Trash2 size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={() => handleReactivateVehicle(vehicle.veic_id, vehicle.veic_placa)}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer' }}
                            title="Reativar Veículo"
                        >
                            <RotateCcw size={16} />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className={styles.wrapper}>

            <div className={styles.actionsBar}>
                <div className={styles.filtersGroup}>
                    <div className={styles.searchWrapper}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Pesquisar veículo..."
                            className={styles.searchInput}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>

                    <div className={styles.selectWrapper}>
                        <Filter size={16} className={styles.filterIcon} />
                        <select
                            className={styles.statusSelect}
                            value={statusFilter}
                            onChange={handleStatusChange}
                        >
                            <option value="all">Todos</option>
                            <option value="active">Ativos</option>
                            <option value="inactive">Inativos</option>
                        </select>
                    </div>
                </div>

                <Link href="/admin/vehicles/register" className={styles.newButton}>
                    <Plus size={20} />
                    <span>Novo Veículo</span>
                </Link>
            </div>


            <div className={styles.tableContainer}>
                <Table
                    columns={columns}
                    data={vehicles}
                    isLoading={loading}
                />
            </div>

            {!loading && vehicles.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

        </div>
    )
}