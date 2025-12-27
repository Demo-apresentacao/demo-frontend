import api from "./api";

// Endpoint sugerido: /service-categories (ou o que estiver no seu back)
export async function getServiceCategories() {
    // Ajuste a rota conforme seu backend define (ex: /categorias_servicos)
    const { data } = await api.get("/service-categories");
    return data;
}