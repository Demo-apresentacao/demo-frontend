"use client";

import { useState, useEffect, useCallback } from "react"; // Adicionado useCallback
import Swal from "sweetalert2";
import { getAllVehicles } from "@/services/vehicles.service";

export function useVehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estados da paginação
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 👇 IMPORTANTE: Envolvemos em useCallback para a função não ser recriada a cada render
const fetchVehicles = useCallback(
    async (termo = "", paginaDesejada = 1, status) => {
      try {
        setLoading(true);

        console.log("🔎 BUSCA REAL:", { termo, paginaDesejada, status });

        const response = await getAllVehicles(
          termo,
          paginaDesejada,
          status
        );

        setVehicles(response.data || []);
        setTotalPages(response.meta?.totalPages || 1);
        setPage(Number(paginaDesejada));
      } catch (error) {
        console.error(error);
        Swal.fire("Erro", "Não foi possível carregar os veículos.", "error");
      } finally {
        setLoading(false);
      }
    },
    [] // 🚨 agora é seguro
  );
// Dependências vazias

    // Carrega a primeira vez
    // useEffect(() => {
    //     fetchVehicles(); 
    // }, [fetchVehicles]);     

    // Retorna tudo que o componente precisa
    return { vehicles, loading, fetchVehicles, page, totalPages };
}