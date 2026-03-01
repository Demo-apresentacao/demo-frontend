"use client";

import Link from "next/link";

import { Edit, Plus, Eye, Search, Trash2, RotateCcw, Filter, Shield } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { useUsers } from "@/hooks/useUsers";

import { Table } from "@/components/ui/table/table";
import { ActionMenu } from "@/components/ui/actionMenu/ActionMenu";
import { Pagination } from "@/components/ui/pagination/pagination";
import { Can } from "@/components/ui/can";

import Swal from "sweetalert2";

import { toggleUserStatus } from "@/services/users.service";

import styles from "./UsersClient.module.css";

export default function UsersClient() {
    const {
        users, loading, fetchUsers, page, totalPages,
        sortColumn, sortDirection, handleSort
    } = useUsers();

    const [inputValue, setInputValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const isMounted = useRef(false);

    // 1. BUSCA INICIAL (Roda apenas na montagem)
    useEffect(() => {
        // Passa os valores padrão, ex: ordenando por ID decrescente
        fetchUsers("", 1, "all", "usu_id", "DESC"); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2. EFEITO INSTANTÂNEO (Filtro de Status e Ordenação)
    // Atualiza na hora, sem esperar 500ms
    useEffect(() => {
        if (!isMounted.current) return;
        fetchUsers(inputValue, 1, statusFilter, sortColumn, sortDirection);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, sortColumn, sortDirection]);

    // 3. EFEITO DEBOUNCE (Apenas para Digitação no Input)
    // Espera 500ms para não sobrecarregar o banco de dados
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            fetchUsers(inputValue, 1, statusFilter, sortColumn, sortDirection);
        }, 500); // <-- O tempo correto aqui!

        return () => clearTimeout(delayDebounceFn);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue]);

    const handlePageChange = (newPage) => {
        fetchUsers(inputValue, newPage, statusFilter, sortColumn, sortDirection);
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleArchiveUser = async (id, nome) => {
        const result = await Swal.fire({
            title: 'Inativar Usuário?',
            text: `O usuário "${nome}" perderá o acesso ao sistema.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sim, inativar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await toggleUserStatus(id, false);
                await Swal.fire({ title: 'Inativado!', text: 'Usuário bloqueado.', icon: 'success', confirmButtonColor: '#16a34a' });
                fetchUsers(inputValue, page, statusFilter, sortColumn, sortDirection);
            } catch (error) {
                console.error(error);
                Swal.fire('Erro', 'Erro ao inativar.', 'error');
            }
        }
    };

    const handleReactivateUser = async (id, nome) => {
        const result = await Swal.fire({
            title: 'Reativar Usuário?',
            text: `O usuário "${nome}" poderá logar novamente.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sim, reativar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await toggleUserStatus(id, true);
                await Swal.fire({ title: 'Ativado!', text: 'Acesso restaurado.', icon: 'success', confirmButtonColor: '#16a34a' });
                fetchUsers(inputValue, page, statusFilter, sortColumn, sortDirection);
            } catch (error) {
                console.error(error);
                Swal.fire('Erro', 'Erro ao reativar.', 'error');
            }
        }
    };

    // --- DEFINIÇÃO DAS COLUNAS ---
    const columns = [
        { header: "ID", accessor: "usu_id" },
        { header: "Nome", accessor: "usu_nome" },
        { header: "Email", accessor: "usu_email" },
        { header: "Telefone", accessor: "usu_telefone" },
        {
            header: "Acesso",
            accessor: "usu_acesso",
            render: (item) => (
                <span style={{
                    backgroundColor: item.usu_acesso ? '#dcfce7' : '#dbeafe',
                    color: item.usu_acesso ? '#166534' : '#1e40af',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                }}>
                    {item.usu_acesso ? "Admin" : "Usuário"}
                </span>
            ),
        },
        {
            header: "Status",
            accessor: "usu_situacao",
            render: (item) => (
                <span style={{
                    backgroundColor: item.usu_situacao ? '#dcfce7' : '#fee2e2',
                    color: item.usu_situacao ? '#166534' : '#991b1b',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    border: item.usu_situacao ? '1px solid #e5e7eb' : '1px solid #fecaca'
                }}>
                    {item.usu_situacao ? "Ativo" : "Inativo"}
                </span>
            ),
        },
        {
            header: "Ações",
            accessor: "actions",
            render: (user) => (
                <>
                    {/* AÇÕES DE DESKTOP */}
                    <div className={styles.desktopActions}>

                        <Can perform="usuarios.visualizar">
                            <Link
                                href={`/admin/users/${user.usu_id}?mode=view`}
                                style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', textDecoration: 'none' }}
                                title="Visualizar"
                            >
                                <Eye size={16} />
                            </Link>
                        </Can>

                        <Can perform="usuarios.editar">
                            <Link
                                href={`/admin/users/${user.usu_id}?mode=edit`}
                                style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', textDecoration: 'none' }}
                                title="Editar"
                            >
                                <Edit size={16} />
                            </Link>
                        </Can>

                        {user.usu_situacao ? (
                            <Can perform="usuarios.inativar">
                                <button
                                    onClick={() => handleArchiveUser(user.usu_id, user.usu_nome)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                    title="Inativar Usuário"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </Can>
                        ) : (
                            <Can perform="usuarios.reativar">
                                <button
                                    onClick={() => handleReactivateUser(user.usu_id, user.usu_nome)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer' }}
                                    title="Reativar Acesso"
                                >
                                    <RotateCcw size={16} />
                                </button>
                            </Can>
                        )}

                        {/* O Escudo para a tela de Permissões */}
                        <Can perform="permissoes.visualizar">
                            <Link
                                href={`/admin/users/${user.usu_id}/permissions`}
                                title="Gerenciar Permissões"
                                style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', textDecoration: 'none' }}
                            >
                                <Shield size={16} />
                            </Link>
                        </Can>
                    </div>

                    {/* AÇÕES DE MOBILE */}
                    <div className={styles.mobileActions}>
                        <ActionMenu
                            user={user}
                            onArchive={handleArchiveUser}
                            onReactivate={handleReactivateUser}
                        />
                    </div>
                </>
            ),
        }
    ];

    return (
        <div className={styles.wrapper}>
            <div className={styles.actionsBar}>
                <div className={styles.filtersGroup}>
                    <div className={styles.searchWrapper}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Pesquisar usuários..."
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
                            <option value="active">Apenas Ativos</option>
                            <option value="inactive">Apenas Inativos</option>
                        </select>
                    </div>
                </div>

                <Can perform="usuarios.visualizar">
                    <Link href="/admin/users/register" className={styles.newButton}>
                        <Plus size={20} />
                        <span>Novo Usuário</span>
                    </Link>
                </Can>
            </div>

            <div className={styles.tableContainer}>
                <Table
                    columns={columns}
                    data={users}
                    isLoading={loading}
                    onSort={handleSort}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                />
            </div>

            {!loading && users.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}