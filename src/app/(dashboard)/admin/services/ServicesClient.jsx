"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

import {
  Edit,
  Plus,
  Eye,
  Search,
  Trash2,
  RotateCcw,
  Filter,
  ChevronDown
} from "lucide-react";
import Swal from "sweetalert2";
import { Table } from "@/components/ui/table/table";
import { Pagination } from "@/components/ui/pagination/pagination";

import { toggleServiceStatus } from "@/services/services.service";
import { useServices } from "@/hooks/useServices";

import styles from "./ServicesClient.module.css";

export default function ServicesClient() {
  const {
    services,
    loading,
    fetchServices,
    page,
    totalPages,
    sortColumn,
    sortDirection,
    handleSort
  } = useServices();

  const [inputValue, setInputValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // categoria selecionada POR LINHA
  const [selectedCategory, setSelectedCategory] = useState({});

  const isMounted = useRef(false);

  useEffect(() => {
    fetchServices("", 1, "all", "serv_id", "DESC");
  }, [fetchServices]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const timeout = setTimeout(() => {
      fetchServices(
        inputValue,
        1,
        statusFilter,
        sortColumn,
        sortDirection
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [
    inputValue,
    statusFilter,
    sortColumn,
    sortDirection,
    fetchServices
  ]);

  const getSelectedCategory = useCallback(
    (service) =>
      selectedCategory[service.serv_id] ??
      service.categorias?.[0]?.tps_id ??
      "",
    [selectedCategory]
  );

  const handlePageChange = (newPage) => {
    fetchServices(
      inputValue,
      newPage,
      statusFilter,
      sortColumn,
      sortDirection
    );
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleCategoryChange = (servId, value) => {
    setSelectedCategory((prev) => ({
      ...prev,
      [servId]: value
    }));
  };

  const handleArchiveService = async (id, nome) => {
    const result = await Swal.fire({
      title: "Ocultar Serviço?",
      text: `O serviço "${nome}" ficará inativo.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sim, ocultar!",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      await toggleServiceStatus(id, false);
      fetchServices(
        inputValue,
        page,
        statusFilter,
        sortColumn,
        sortDirection
      );
    }
  };

  const handleReactivateService = async (id, nome) => {
    const result = await Swal.fire({
      title: "Reativar Serviço?",
      text: `O serviço "${nome}" voltará a ficar visível.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sim, reativar!",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      await toggleServiceStatus(id, true);
      fetchServices(
        inputValue,
        page,
        statusFilter,
        sortColumn,
        sortDirection
      );
    }
  };

  const columns = [
    { header: "ID", accessor: "serv_id" },
    { header: "Nome", accessor: "serv_nome" },
    { header: "Descrição", accessor: "serv_descricao" },

    {
      header: "Categoria",
      accessor: "categoria",
      render: (item) => {
        // Se não houver categorias, exibe texto simples
        if (!item.categorias || item.categorias.length === 0) {
          return <span style={{ color: '#9ca3af', fontSize: '12px' }}>Sem categorias</span>;
        }

        return (
          <div
            className={styles.selectContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <select
              className={styles.selectNative}
              value={getSelectedCategory(item)}
              onChange={(e) => {
                handleCategoryChange(item.serv_id, e.target.value);
              }}
            >
              {item.categorias.map((cat) => (
                <option key={cat.tps_id} value={cat.tps_id}>
                  {cat.tps_nome}
                </option>
              ))}
            </select>

            <ChevronDown size={14} className={styles.selectIcon} />
          </div>
        );
      }
    },

    {
      header: "Preço",
      accessor: "preco",
      render: (item) => {

        const activeCatId = getSelectedCategory(item);

        const categoriaAtiva = item.categorias?.find(
          (c) => String(c.tps_id) === String(activeCatId)
        );

        if (categoriaAtiva) {
          return (
            <span className="font-medium">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(categoriaAtiva.preco)}
            </span>
          );
        }

        return <span style={{ color: '#9ca3af' }}>R$ --</span>;
      }
    },
    {
      header: "Status",
      accessor: "serv_situacao",
      render: (item) => (
        <span
          style={{
            backgroundColor: item.serv_situacao ? "#dcfce7" : "#fee2e2",
            color: item.serv_situacao ? "#166534" : "#991b1b",
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: "bold"
          }}
        >
          {item.serv_situacao ? "Ativo" : "Inativo"}
        </span>
      )
    },
    {
      header: "Ações",
      accessor: "actions",
      render: (service) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Link href={`/admin/services/${service.serv_id}?mode=view`}
            style={{ display: 'flex', alignItems: 'center', color: '#2563eb' }}
            title="Visualizar">
            <Eye size={16} />
          </Link>
          <Link href={`/admin/services/${service.serv_id}?mode=edit`}
            style={{ display: 'flex', alignItems: 'center', color: '#2563eb' }}
            title="Editar">
            <Edit size={16} />
          </Link>
          {service.serv_situacao ? (
            <button
              onClick={() =>
                handleArchiveService(service.serv_id, service.serv_nome)
              }
              style={{ display: 'flex', alignItems: 'center', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
              title="Ocultar"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <button
              onClick={() =>
                handleReactivateService(service.serv_id, service.serv_nome)
              }
              style={{ display: 'flex', alignItems: 'center', color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer' }}
              title="Reativar"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      )
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
              placeholder="Pesquisar..."
              className={styles.searchInput}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <div className={styles.selectWrapper}>
            <Filter size={16} className={styles.filterIcon} />
            <select
              value={statusFilter}
              className={styles.statusSelect}
              onChange={handleStatusChange}>

              <option value="all">Status: Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>

        <Link href="/admin/services/register" className={styles.newButton}>
          <Plus size={20} />
          <span>Novo Serviço</span>
        </Link>
      </div>

      <Table
        columns={columns}
        data={services}
        isLoading={loading}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />

      {!loading && services.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
