import api from "./api";

export const getAllServices = async (
  search = "",
  page = 1,
  status = "all",
  orderBy = "serv_id",
  orderDirection = "DESC",
  vehicleType = "all",
  category = "all"
) => {
  try {
    const response = await api.get("/services", {
      params: {
        search,
        page,
        limit: 10,
        status,
        orderBy,
        orderDirection,
        vehicleType,
        category
      }
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    throw error;
  }
};

export async function getServicesList() {
  const { data } = await api.get("/services", {
    params: { limit: 100 }
  });
  return data.data;
}

export async function getServicesByVehicleId(veicUsuId) {
  const { data } = await api.get(`/services/vehicle/${veicUsuId}`);
  return data.data;
}

export async function getServiceById(id) {
  const { data } = await api.get(`/services/${id}`);
  return data.data;
}

export async function createService(payload) {
  const { data } = await api.post("/services", payload);
  return data;
}

export async function updateService(id, payload) {
  const { data } = await api.patch(`/services/${id}`, payload);
  return data;
}

export async function toggleServiceStatus(id, status) {
  const { data } = await api.patch(`/services/${id}/status`, {
    serv_situacao: status
  });
  return data;
}

export async function deleteService(id) {
  const { data } = await api.delete(`/services/${id}`);
  return data;
}
