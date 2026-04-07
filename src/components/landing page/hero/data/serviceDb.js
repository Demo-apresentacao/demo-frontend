import { Car, Droplets, Sparkles, Shield, Scan, Armchair, Wrench, Bike } from 'lucide-react';

// 1. Mapeamento de Categorias Reais
export const categories = {
  1: { name: "Lavagem & Descontaminação", icon: Droplets },
  2: { name: "Polimento & Proteção", icon: Sparkles },
  3: { name: "Vidros & Faróis", icon: Scan },
  4: { name: "Estética Interna", icon: Armchair },
  5: { name: "Motor & Chassi", icon: Shield },
  6: { name: "Estética de Motos", icon: Bike },
  7: { name: "Serviços Especiais", icon: Wrench }
};

// 2. Lista de Serviços Reais do Cliente
export const servicesList = [
  // --- LAVAGEM & DESCONTAMINAÇÃO ---
  { id: 1, catId: 1, title: "Lavagem Padrão - Carro", desc: "Lavagem externa detalhada e segura.", price: "R$ 90,00" },
  { id: 2, catId: 1, title: "Lavagem Padrão - Camionete", desc: "Lavagem externa detalhada para veículos de grande porte.", price: "R$ 130,00" },
  { id: 3, catId: 1, title: "Lavagem Padrão - Caminhão", desc: "Lavagem externa especializada para caminhões.", price: "R$ 170,00" },
  { id: 4, catId: 1, title: "Descontaminação de Pintura e Vidros", desc: "Remoção de impurezas, névoa de tinta e contaminações encrustadas.", price: "Sob Avaliação" },

  // --- POLIMENTO & PROTEÇÃO ---
  { id: 5, catId: 2, title: "Enceramento Padrão", desc: "Aplicação de cera para brilho e proteção básica.", price: "R$ 50,00" },
  { id: 6, catId: 2, title: "Enceramento Técnico", desc: "Enceramento de alta performance para maior durabilidade e hidro-repelência.", price: "R$ 80,00" },
  { id: 7, catId: 2, title: "Polimento Comercial", desc: "Correção leve de pintura para devolução de brilho e remoção de marcas superficiais.", price: "Sob Avaliação" },
  { id: 8, catId: 2, title: "Polimento Técnico", desc: "Correção avançada de verniz, nivelamento e remoção de riscos profundos.", price: "Sob Avaliação" },

  // --- VIDROS & FARÓIS ---
  { id: 9, catId: 3, title: "Restauração de Farol com Polímero", desc: "Recuperação definitiva de faróis amarelados ou oxidados.", price: "A partir de R$ 250 (par)" },
  { id: 10, catId: 3, title: "Remoção de Chuva Ácida", desc: "Remoção de marcas d'água calcificadas nos vidros.", price: "Sob Avaliação" },
  { id: 11, catId: 3, title: "Polimento de Vidros", desc: "Remoção de riscos leves, palhetadas e manchas nos vidros.", price: "Sob Avaliação" },
  { id: 12, catId: 3, title: "Remoção de Insulfilm", desc: "Retirada segura de película e limpeza de cola dos vidros.", price: "A combinar" },

  // --- ESTÉTICA INTERNA ---
  { id: 13, catId: 4, title: "Hidratação de Banco de Couro", desc: "Limpeza profunda e condicionamento para evitar trincas e ressecamento.", price: "R$ 100,00" },
  { id: 14, catId: 4, title: "Lavagem de Estofados", desc: "Limpeza interna profunda (banco do motorista, passageiro e traseiro).", price: "R$ 250,00" },
  { id: 15, catId: 4, title: "Higienização Completa Interna", desc: "Limpeza extrema detalhada: bancos + portas + forro de teto.", price: "Sob Avaliação" },

  // --- MOTOR & CHASSI ---
  { id: 16, catId: 5, title: "Lavagem de Chassi", desc: "Limpeza profunda e desengraxante da parte inferior do veículo.", price: "R$ 100,00" },
  { id: 17, catId: 5, title: "Lavagem de Motor + Verniz", desc: "Limpeza técnica do cofre do motor com aplicação de verniz protetor para plásticos e borrachas.", price: "R$ 100,00" },

  // --- ESTÉTICA DE MOTOS ---
  { id: 18, catId: 6, title: "Lavagem Padrão Moto", desc: "Limpeza técnica e segura para motocicletas.", price: "A consultar" },
  { id: 19, catId: 6, title: "Lavagem Detalhada Moto", desc: "Cera líquida, restauração de plásticos, limpeza da transmissão, verniz e clareamento do motor e bacalhau.", price: "R$ 90,00" },
  { id: 20, catId: 6, title: "Combo: Cera Líquida + Plásticos + Transmissão", desc: "Acabamento com cera líquida, revitalização de plásticos e limpeza do kit transmissão.", price: "R$ 70,00" },
  { id: 21, catId: 6, title: "Aplicação de Cera em Pasta", desc: "Proteção e brilho intenso para a pintura e carenagens da moto.", price: "R$ 30,00" },
  { id: 22, catId: 6, title: "Polimento de Tanque", desc: "Remoção de riscos e restauração do brilho do tanque.", price: "R$ 100,00" },

  // --- SERVIÇOS ESPECIAIS ---
  { id: 23, catId: 7, title: "Polimento de Escapamento", desc: "Restauração do brilho e remoção de oxidação severa do escape.", price: "A combinar" },
  { id: 24, catId: 7, title: "Remoção de Adesivos", desc: "Retirada segura de adesivos e colas para qualquer tipo de veículo.", price: "A combinar" }
];