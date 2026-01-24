"use client";

import { useServices } from "@/hooks/useServices";
import { Table } from "@/components/ui/table/table";
import Link from "next/link";
import { Edit, Plus, Eye, Search, Trash2, RotateCcw, Filter, Car } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Pagination } from "@/components/ui/pagination/pagination";
import Swal from "sweetalert2";
import { toggleServiceStatus } from "@/services/services.service";
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

  // Estados Locais
  const [inputValue, setInputValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // 1. NOVO ESTADO: Filtro de Veículo
  const [vehicleFilter, setVehicleFilter] = useState("all");

  const isMounted = useRef(false);

  // 2. Busca Inicial (Carregamento da página)
  useEffect(() => {
    // Passamos "all" como último parâmetro (vehicleType)
    fetchServices("", 1, "all", "serv_id", "DESC", "all");
  }, [fetchServices]);

  // 3. Monitoramento de Mudanças (Debounce)
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      // Passamos o vehicleFilter atual para a busca
      fetchServices(inputValue, 1, statusFilter, sortColumn, sortDirection, vehicleFilter);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, statusFilter, vehicleFilter, sortColumn, sortDirection, fetchServices]); 
  // ^ ATENÇÃO: Adicionei vehicleFilter nas dependências do array acima

  // --- HANDLERS ---

  const handlePageChange = (newPage) => {
    fetchServices(inputValue, newPage, statusFilter, sortColumn, sortDirection, vehicleFilter);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // 4. NOVO HANDLER: Mudança de Veículo
  const handleVehicleChange = (e) => {
    setVehicleFilter(e.target.value);
  };

  // --- AÇÕES DE STATUS (Mantive igual ao seu original) ---
  const handleArchiveService = async (id, nome) => {
    const result = await Swal.fire({
      title: 'Ocultar Serviço?',
      text: `O serviço "${nome}" ficará inativo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, ocultar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await toggleServiceStatus(id, false);
        await Swal.fire('Ocultado!', 'Serviço desativado.', 'success');
        fetchServices(inputValue, page, statusFilter, sortColumn, sortDirection, vehicleFilter);
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível ocultar.', 'error');
      }
    }
  };

  const handleReactivateService = async (id, nome) => {
    const result = await Swal.fire({
      title: 'Reativar Serviço?',
      text: `O serviço "${nome}" voltará a ficar visível.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, reativar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await toggleServiceStatus(id, true);
        await Swal.fire('Ativado!', 'Serviço reativado.', 'success');
        fetchServices(inputValue, page, statusFilter, sortColumn, sortDirection, vehicleFilter);
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível reativar.', 'error');
      }
    }
  };

  // --- COLUNAS ---
  const columns = [
    { header: "ID", accessor: "serv_id" },
    { header: "Nome", accessor: "serv_nome" },
    { header: "Descrição", accessor: "serv_descricao" },
    { header: "Categoria", accessor: "tps_nome", render: (item) => item.tps_nome || '-' },
    { header: "Preço", accessor: "stv_preco", render: (item) => item.stv_preco ? `R$ ${Number(item.stv_preco).toFixed(2)}` : 'R$ 0.00' },
    {
      header: "Status",
      accessor: "serv_situacao",
      render: (item) => (
        <span style={{
          backgroundColor: item.serv_situacao ? '#dcfce7' : '#fee2e2',
          color: item.serv_situacao ? '#166534' : '#991b1b',
          padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold',
          border: item.serv_situacao ? '1px solid #bbf7d0' : '1px solid #fecaca'
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
          <Link href={`/admin/services2/${service.serv_id}?mode=view`} style={{ color: '#2563eb' }}><Eye size={16} /></Link>
          <Link href={`/admin/services2/${service.serv_id}?mode=edit`} style={{ color: '#2563eb' }}><Edit size={16} /></Link>
          {service.serv_situacao ? (
            <button onClick={() => handleArchiveService(service.serv_id, service.serv_nome)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
          ) : (
            <button onClick={() => handleReactivateService(service.serv_id, service.serv_nome)} style={{ color: '#16a34a', border: 'none', background: 'none', cursor: 'pointer' }}><RotateCcw size={16} /></button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.actionsBar}>

        <div className={styles.filtersGroup}>
          {/* BUSCA */}
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

          {/* FILTRO DE STATUS */}
          <div className={styles.selectWrapper}>
            <Filter size={16} className={styles.filterIcon} />
            <select className={styles.statusSelect} value={statusFilter} onChange={handleStatusChange}>
              <option value="all">Status: Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>

          {/* 5. NOVO: FILTRO DE VEÍCULO NA TELA */}
          <div className={styles.selectWrapper}>
            <Car size={16} className={styles.filterIcon} />
            <select 
              className={styles.statusSelect} 
              value={vehicleFilter} 
              onChange={handleVehicleChange}
            >
              <option value="all">Veículo: Todos</option>
              {/* IMPORTANTE: Os values (1, 2, 3...) devem ser os IDs reais da tabela 'tipo_veiculo' no seu banco */}
              <option value="1">Caminhão</option>
              <option value="2">Caminhonete</option>
              <option value="3">Carro</option>
              <option value="4">Moto</option>
            </select>
          </div>
        </div>

        <Link href="/admin/services2/register" className={styles.newButton}>
          <Plus size={20} />
          <span>Novo Serviço</span>
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          data={services}
          isLoading={loading}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
      </div>

      {!loading && services.length > 0 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
}