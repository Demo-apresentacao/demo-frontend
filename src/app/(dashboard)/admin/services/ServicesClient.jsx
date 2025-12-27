"use client";

import { useServices } from "@/hooks/useServices";
import { Table } from "@/components/ui/table/table";
import Link from "next/link";
// 1. ADICIONEI O RotateCcw AQUI (Ícone de restaurar)
import { Edit, Plus, Eye, Search, Trash2, RotateCcw } from "lucide-react"; 
import { useState, useEffect, useRef } from "react";
import { Pagination } from "@/components/ui/pagination/pagination";
import Swal from "sweetalert2";
import { toggleServiceStatus } from "@/services/services.service"; 
import styles from "./ServicesClient.module.css";

export default function ServicesClient() {
  const { services, loading, fetchServices, page, totalPages } = useServices();
  const [inputValue, setInputValue] = useState("");
  const isMounted = useRef(false);

  useEffect(() => {
    fetchServices("", 1);
  }, [fetchServices]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      fetchServices(inputValue, 1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, fetchServices]);

  const handlePageChange = (newPage) => {
    fetchServices(inputValue, newPage);
  };

  // --- FUNÇÃO 1: OCULTAR (Desativar) ---
  const handleArchiveService = async (id, nome) => {
    const result = await Swal.fire({
      title: 'Ocultar Serviço?',
      text: `O serviço "${nome}" ficará inativo e não aparecerá para novos agendamentos.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Vermelho
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, ocultar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await toggleServiceStatus(id, false); // Manda FALSE
        await Swal.fire('Ocultado!', 'Serviço desativado.', 'success');
        fetchServices(inputValue, page);
      } catch (error) {
        console.error(error);
        Swal.fire('Erro', 'Não foi possível ocultar.', 'error');
      }
    }
  };

  // --- FUNÇÃO 2: REATIVAR (Ativar) ---
  const handleReactivateService = async (id, nome) => {
    const result = await Swal.fire({
      title: 'Reativar Serviço?',
      text: `O serviço "${nome}" voltará a ficar visível no sistema.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, reativar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await toggleServiceStatus(id, true); // Manda TRUE
        await Swal.fire('Ativado!', 'Serviço reativado com sucesso.', 'success');
        fetchServices(inputValue, page);
      } catch (error) {
        console.error(error);
        Swal.fire('Erro', 'Não foi possível reativar.', 'error');
      }
    }
  };

  const columns = [
    { header: "ID", accessor: "serv_id" },
    { header: "Nome", accessor: "serv_nome" },
    { header: "Descrição", accessor: "serv_descricao" },
    {
      header: "Preço",
      accessor: "serv_preco",
      render: (item) => item.serv_preco ? `R$ ${Number(item.serv_preco).toFixed(2)}` : 'R$ 0.00'
    },
    {
      header: "Status",
      accessor: "serv_situacao",
      render: (item) => (
        <span style={{
          backgroundColor: item.serv_situacao ? '#dcfce7' : '#fee2e2',
          color: item.serv_situacao ? '#166534' : '#991b1b',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          {item.serv_situacao ? "Ativo" : "Inativo"}
        </span>
      ),
    },
    {
      header: "Ações",
      accessor: "actions",
      render: (service) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            href={`/admin/services/${service.serv_id}?mode=view`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', textDecoration: 'none' }}
            title="Visualizar"
          >
            <Eye size={16} />
          </Link>
          <Link
            href={`/admin/services/${service.serv_id}?mode=edit`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', textDecoration: 'none' }}
            title="Editar"
          >
            <Edit size={16} />
          </Link>
          
          {/* LÓGICA DO BOTÃO DE STATUS */}
          {service.serv_situacao ? (
            // SE ESTIVER ATIVO: Mostra botão de Lixeira (Vermelho)
            <button
              onClick={() => handleArchiveService(service.serv_id, service.serv_nome)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                color: '#ef4444', // Vermelho
                background: 'none', border: 'none', cursor: 'pointer'
              }}
              title="Ocultar (Inativar)"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            // SE ESTIVER INATIVO: Mostra botão de Restaurar (Verde)
            <button
              onClick={() => handleReactivateService(service.serv_id, service.serv_nome)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                color: '#16a34a', // Verde
                background: 'none', border: 'none', cursor: 'pointer'
              }}
              title="Reativar Serviço"
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
        <div className={styles.searchWrapper}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Pesquisar serviços..."
            className={styles.searchInput}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <Link href="/admin/services/register" className={styles.newButton}>
          <Plus size={20} />
          <span>Novo Serviço</span>
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <Table columns={columns} data={services} isLoading={loading} />
      </div>

      {!loading && services.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages} onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}