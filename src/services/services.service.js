import api from "./api";

export const getAllServices = async (search = "", page = 1, status = "all", orderBy = "serv_id", orderDirection = "DESC", vehicleType = "all") => {
    try {
        const response = await api.get('/services', {
            params: { 
                search,
                page,
                limit: 10,
                status,
                orderBy,
                orderDirection,
                vehicleType
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

// --- NOVA FUNÇÃO ADICIONADA AQUI ---
export async function getServicesByVehicleId(veicUsuId) {
    // Busca os serviços com preços ajustados para a categoria deste veículo
    const { data } = await api.get(`/services/vehicle/${veicUsuId}`);
    
    // O controller retorna { status: 'success', data: [...] }
    // Retornamos data.data para pegar direto o array de serviços
    return data.data;
}
// -----------------------------------

export async function getServiceById(id) {
    const { data } = await api.get(`/services/${id}`);
    return data.data;
}
// ------------------------------------

export async function createService(payload) {
    const { data } = await api.post("/services", payload);
    return data;
}

export async function updateService(id, payload) {
    const { data } = await api.patch(`/services/${id}`, payload);
    return data;
}

export async function toggleServiceStatus(id, status) {
    const { data } = await api.patch(`/services/${id}/status`, { serv_situacao: status });
    return data;
}

export async function deleteService(id) {
    const { data } = await api.delete(`/services/${id}`);
    return data;
}