import { useState, useCallback } from "react";
import {
  createVehicleUserLink,
  updateVehicleUserLink,
  deleteVehicleUserLink,
  getVehicleUsersHistory,
  getUserVehicles
} from "@/services/vehicleUsers.service";
import Swal from "sweetalert2";

export const useVehicleUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State para guardar o histórico
  const [history, setHistory] = useState([]);

  // State para guardar os veículos do usuário
  const [vehicles, setVehicles] = useState([]);

  // ----------------------------------------------------------------
  // 1. BUSCAR VEÍCULOS DE UM USUÁRIO (Para os Cards)
  // ----------------------------------------------------------------
  const fetchUserVehicles = useCallback(async (usuId) => {
    setLoading(true);
    setError(null);
    try {
      // 🔴 ALTERAÇÃO AQUI: Passamos os params para trazer TODOS (ativos e inativos)
      // Certifique-se de que sua função 'getUserVehicles' no service aceita esse segundo argumento
      const response = await getUserVehicles(usuId, {
        params: {
          status: 'all', // Traz ativos e inativos
          orderBy: 'veic_id',
          orderDirection: 'DESC'
        }
      });

      // Tratamento baseado no seu JSON: { status: "success", data: [...] }
      const lista = response.data || [];

      setVehicles(lista);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Erro ao buscar veículos.";
      setError(msg);
      setVehicles([]); // Limpa a lista em caso de erro
      console.error("Erro fetchUserVehicles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------------------------------------------
  // 2. BUSCAR HISTÓRICO DE UM VEÍCULO
  // ----------------------------------------------------------------
  const fetchHistory = useCallback(async (veicId) => {
    if (!veicId) return; // 🔴 TRAVA DE SEGURANÇA: Evita erro de ID null

    setLoading(true);
    setError(null);
    try {
      const response = await getVehicleUsersHistory(veicId);

      // Flexibilidade para diferentes retornos de API
      const lista = Array.isArray(response) ? response : (response.data || []);

      setHistory(lista);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Erro ao buscar histórico.";
      setError(msg);
      setHistory([]);
      // 🔴 LOG MELHORADO: Mostra o erro real em vez de {}
      console.error("Erro fetchHistory:", err.response?.data || err.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------------------------------------------
  // 3. VINCULAR (CRIAR)
  // ----------------------------------------------------------------
  const linkUser = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createVehicleUserLink(data);
      Swal.fire({
        title: 'Sucesso',
        text: `Vínculo criado com sucesso.`,
        icon: 'success',
        confirmButtonColor: '#16a34a',
        confirmButtonText: 'OK',
      });
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Erro ao vincular usuário.";
      setError(msg);
      Swal.fire("Erro", msg, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------------------------------------------
  // 4. EDITAR VÍNCULO
  // ----------------------------------------------------------------
  const editLink = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateVehicleUserLink(id, data);
      Swal.fire({
        title: 'Sucesso',
        text: `Vínculo atualizado.`,
        icon: 'success',
        confirmButtonColor: '#16a34a',
        confirmButtonText: 'OK',
      });
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Erro ao atualizar vínculo.";
      setError(msg);
      Swal.fire("Erro", msg, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------------------------------------------
  // 5. FINALIZAR VÍNCULO (Encerrar Data)
  // ----------------------------------------------------------------
  const finalizeLink = useCallback(async (id, dataFinal) => {
    setLoading(true);
    setError(null);
    try {
      await updateVehicleUserLink(id, { data_final: dataFinal });
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Erro ao finalizar vínculo.";
      setError(msg);
      Swal.fire("Erro", msg, "error");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------------------------------------------
  // 6. REMOVER VÍNCULO (DELETE FÍSICO)
  // ----------------------------------------------------------------
  const removeLink = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const confirm = await Swal.fire({
        title: 'Tem certeza?',
        text: "Essa ação removerá o registro permanentemente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Cancelar'
      });

      if (confirm.isConfirmed) {
        await deleteVehicleUserLink(id);
        Swal.fire('Removido!', 'O vínculo foi excluído.', 'success');
        return true;
      }
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Erro ao remover vínculo.";
      setError(msg);
      Swal.fire("Erro", msg, "error");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchUserVehicles,
    fetchHistory,
    linkUser,
    editLink,
    finalizeLink,
    removeLink,
    vehicles,
    history,
    loading,
    error
  };
};