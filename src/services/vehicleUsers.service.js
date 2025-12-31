import api from "./api"; // Sua instância do axios configurada


/**
 * Cria o vínculo entre veículo e usuário
 * Payload: { veic_id, usu_id, ehproprietario, data_inicial }
 */
export const createVehicleUserLink = async (payload) => {
  try {
    const response = await api.post("/vehicle-users", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Atualiza o vínculo (Ex: mudar data final ou propriedade)
 * Payload: { data_inicial, data_final, ehproprietario }
 */
export const updateVehicleUserLink = async (id, payload) => {
  try {
    const response = await api.patch(`/vehicle-users/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Remove o vínculo (Delete físico)
 */
export const deleteVehicleUserLink = async (id) => {
  try {
    const response = await api.delete(`/vehicle-users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};