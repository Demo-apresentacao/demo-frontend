import api from './api'; // Importe sua instância do Axios configurada

export const getDashboardStats = async () => {
    try {
        const response = await api.get('api/dashboard/stats');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados da dashboard:", error);
        throw error;
    }
};