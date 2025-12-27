import { useState, useEffect } from "react";
import { getServiceCategories } from "@/services/servicesCategories.service";
import Swal from "sweetalert2";

export function useServiceCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            try {
                // 'response' aqui é o objeto { status: 'success', data: [...] }
                const response = await getServiceCategories();
                
                // 👇 CORREÇÃO AQUI:
                // Verificamos se a lista está dentro de .data ou se já veio pura
                const listaReal = response.data || response;

                // Verificação de segurança (Opcional, mas ajuda a debuggar)
                if (!Array.isArray(listaReal)) {
                    console.error("O retorno da API não é um array:", response);
                    throw new Error("Formato de dados inválido");
                }
                
                // Agora fazemos o map na listaReal
                const formattedOptions = listaReal.map(cat => ({
                    value: String(cat.cat_serv_id), 
                    label: cat.cat_serv_nome      
                }));

                setCategories(formattedOptions);
            } catch (error) {
                console.error("Erro ao buscar categorias de serviço:", error);
                // Swal.fire("Erro", "Falha ao carregar lista de categorias.", "error"); 
                // Dica: Comentei o Swal para não ficar pipocando alerta na cara se falhar
            } finally {
                setLoading(false);
            }
        }

        fetch();
    }, []);

    return { categories, loading };
}