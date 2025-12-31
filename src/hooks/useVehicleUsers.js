import { useState, useCallback } from "react";
import { 
  createVehicleUserLink, 
  updateVehicleUserLink, 
  deleteVehicleUserLink 
} from "@/services/vehicleUsers.service";
import Swal from "sweetalert2"; // Opcional: para feedback visual

export const useVehicleUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // 3. Remover Vínculo
  const removeLink = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      // Confirmação antes de deletar
      const confirm = await Swal.fire({
        title: 'Tem certeza?',
        text: "Essa ação removerá o vínculo deste usuário com o veículo.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, remover!'
      });

      if (confirm.isConfirmed) {
        await deleteVehicleUserLink(id);
        Swal.fire('Removido!', 'O vínculo foi desfeito.', 'success');
        return true; // Retorna true para indicar sucesso
      }
      return false; // Cancelado pelo usuário
    } catch (err) {
      const msg = err.message || "Erro ao remover vínculo.";
      setError(msg);
      Swal.fire("Erro", msg, "error");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    linkUser,
    editLink,
    removeLink,
    loading,
    error
  };
};