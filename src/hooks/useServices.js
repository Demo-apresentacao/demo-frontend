import { useState, useCallback } from "react";
import { getAllServices } from "@/services/services.service";
import Swal from "sweetalert2";

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Ordenação
  const [sortColumn, setSortColumn] = useState("serv_id");
  const [sortDirection, setSortDirection] = useState("DESC");

  /**
   * Busca de serviços
   */
  const fetchServices = useCallback(async (
    termo = "",
    paginaDesejada = 1,
    status = "all",
    col = sortColumn,
    dir = sortDirection,
    vehicleType = "all",
    category = "all"
  ) => {
    try {
      setLoading(true);

      const response = await getAllServices(
        termo,
        paginaDesejada,
        status,
        col,
        dir,
        vehicleType,
        category
      );

      setServices(response.data || []);
      setTotalPages(response.meta?.totalPages || 1);
      setPage(Number(paginaDesejada));

    } catch (error) {
      console.error(error);
      Swal.fire("Erro", "Não foi possível carregar os serviços", "error");
    } finally {
      setLoading(false);
    }
  }, [sortColumn, sortDirection]);

  /**
   * Ordenação da tabela
   */
  const handleSort = (columnAccessor) => {
    if (!columnAccessor || columnAccessor === "actions") return;

    const isAsc =
      sortColumn === columnAccessor && sortDirection === "ASC";

    setSortColumn(columnAccessor);
    setSortDirection(isAsc ? "DESC" : "ASC");
  };

  return {
    services,
    loading,
    page,
    totalPages,
    fetchServices,
    sortColumn,
    sortDirection,
    handleSort
  };
}
