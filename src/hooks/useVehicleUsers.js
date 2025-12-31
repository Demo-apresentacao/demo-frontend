import { useState, useCallback } from "react";
import { 
  createVehicleUserLink, 
  updateVehicleUserLink, 
  deleteVehicleUserLink,
  getVehicleUsersHistory // <--- 1. Importe a nova função aqui
} from "@/services/vehicleUsers.service";
import Swal from "sweetalert2";

export const useVehicleUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // --- NOVO: State para guardar a lista de histórico ---
  const [history, setHistory] = useState([]);

  // 1. Vincular
  const linkUser = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createVehicleUserLink(data);
      Swal.fire("Sucesso", "Vínculo criado com sucesso!", "success");
      return result;
    } catch (err) {
      const msg = err.message || "Erro ao vincular usuário.";
      setError(msg);
      Swal.fire("Erro", msg, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Editar Vínculo
  const editLink = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateVehicleUserLink(id, data);
      Swal.fire("Sucesso", "Vínculo atualizado!", "success");
      return result;
    } catch (err) {
      const msg = err.message || "Erro ao atualizar vínculo.";
      setError(msg);
      Swal.fire("Erro", msg, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // --- NOVO: Finalizar Vínculo (Encerrar Data) ---
  // É uma variação do editLink, mas com mensagem específica
  const finalizeLink = useCallback(async (id, dataFinal) => {
    setLoading(true);
    try {
      // Envia apenas a data final para o update
      await updateVehicleUserLink(id, { data_final: dataFinal });
      // Não exibe Swal aqui se quiser controlar no modal, ou exibe msg de sucesso:
      // Swal.fire("Encerrado", "Vínculo finalizado com sucesso.", "success");
      return true;
    } catch (err) {
      const msg = err.message || "Erro ao finalizar vínculo.";
      setError(msg);
      Swal.fire("Erro", msg, "error");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Remover Vínculo
  const removeLink = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const confirm = await Swal.fire({
        title: 'Tem certeza?',
        text: "Essa ação removerá o registro do vínculo (Delete físico). Para apenas encerrar, use a opção de finalizar data.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, remover!'
      });

      if (confirm.isConfirmed) {
        await deleteVehicleUserLink(id);
        Swal.fire('Removido!', 'O vínculo foi desfeito.', 'success');
        return true;
      }
      return false;
    } catch (err) {
      const msg = err.message || "Erro ao remover vínculo.";
      setError(msg);
      Swal.fire("Erro", msg, "error");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // --- NOVO: Buscar Histórico ---
  const fetchHistory = useCallback(async (veicId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVehicleUsersHistory(veicId);
      
      // Proteção para garantir que é um array
      // Às vezes a API retorna { data: [...] } ou direto [...]
      const lista = Array.isArray(data) ? data : (data.data || data.dados || []);
      
      setHistory(lista);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar histórico");
      setHistory([]); // Limpa a lista em caso de erro
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    linkUser,
    editLink,
    removeLink,
    finalizeLink, // <--- Exporte a nova função
    fetchHistory, // <--- Exporte a nova função
    history,      // <--- Exporte o state
    loading,
    error
  };
};