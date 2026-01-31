export const products = [
  {
    id: 1,
    name: "Spell 2.0 Vonixx",
    price: "R$ 29,90",
    image: "/images/products/spell2.0vonix.png",
    category: "Selantes & Ceras",
    tag: "Mais Vendido",
    description: "Selante de pintura à base de sílica com tecnologia de última geração. Proporciona proteção por até 6 meses e um brilho espelhado incrível.",
    variants: [
      { size: "500ml", price: "R$ 24,90" },
    ],
  },
  {
    id: 2,
    name: "Vintex Limpa Vidros 200ml",
    price: "R$ 59,90",
    image: "/images/products/vintexlimpavidros.png",
    category: "Vidros & Espelhos",
    tag: "Brilho Intenso",
    description: "Produto desenvolvido para limpeza de vidros, espelhos e faróis. Remove manchas de gordura e insetos com facilidade, sem deixar rastros.",
    variants: [
      { size: "500ml", price: "R$ 24,90" },
      { size: "1.5L", price: "R$ 54,90" },
      { size: "3L", price: "R$ 89,90" }
    ],
  },
  {
    id: 3,
    name: "Makker Maquiador Automotivo 500ml",
    price: "R$ 24,90",
    image: "/images/products/makker500ml.jpeg",
    category: "Acabamento",
    tag: null,
    description: "Maquiador automotivo que preenche microrriscos e devolve o brilho da pintura instantaneamente. Ideal para preparação rápida de veículos para venda.",
    variants: [
      { size: "500ml", price: "R$ 24,90" },
      { size: "1.5L", price: "R$ 54,90" },
      { size: "3L", price: "R$ 89,90" }
    ],
  },
  {
    id: 4,
    name: "Blend Cera Spray 500ml",
    price: "R$ 52,90",
    image: "/images/products/blendvonixx.jpeg",
    category: "Selantes & Ceras",
    tag: "Essencial",
    description: "A união da Carnaúba tipo 1 com a sílica (SiO2). Promove hidrorrepelência (água escorre fácil) e um brilho quente característico da carnaúba.",
    variants: [
      { size: "500ml", price: "R$ 24,90" },
      { size: "1.5L", price: "R$ 54,90" },
      { size: "3L", price: "R$ 89,90" }
    ],
  },
  {
    id: 5,
    name: "Izer Vonixx 500ml",
    price: "R$ 35,00",
    image: "/images/products/izervonixx.jpeg",
    category: "Descontaminação",
    tag: "Ferroso",
    description: "Descontaminante ferroso de pH neutro. Remove fuligem de freio oxidada nas rodas e pintura.",
    variants: [
      { size: "500ml", price: "R$ 24,90" },
      { size: "1.5L", price: "R$ 54,90" },
      { size: "3L", price: "R$ 89,90" }
    ],
  },
  {
    id: 6,
    name: "Prizm Vonixx",
    price: "R$ 15,00",
    image: "/images/products/prizmvonixx.jpeg",
    category: "Vidros & Espelhos",
    tag: "Restaurador",
    description: "Restaurador de vidros que remove marcas de chuva ácida incrustadas.",
    variants: [
      { size: "500ml", price: "R$ 24,90" },
      { size: "1.5L", price: "R$ 54,90" },
      { size: "3L", price: "R$ 89,90" }
    ],
  },
  {
    id: 7,
    name: "Shiny Revitalizador de Pneus 500ml",
    price: "R$ 40,00",
    image: "/images/products/shinyvonix.jpeg",
    category: "Pneus & Rodas",
    tag: "Brilho Molhado",
    description: "Produto exclusivo para pneus que renova, protege e dá brilho intenso e duradouro.",
    variants: [
      { size: "500ml", price: "R$ 24,90" },
      { size: "1.5L", price: "R$ 54,90" },
      { size: "3L", price: "R$ 89,90" }
    ],
  },
  {
    id: 8,
    name: "Carnaúba Tok Final Vonixx 500ml",
    image: "/images/products/tokfinal.jpeg",
    category: "Acabamento",
    tag: "Profissional",
    description: "Cera líquida para manutenção rápida. Ideal para ser aplicada após cada lavagem para reforçar a proteção e o brilho da cera principal.",
    variants: [
      { size: "500ml", price: "R$ 24,90" },
      { size: "1.5L", price: "R$ 54,90" },
      { size: "3L", price: "R$ 89,90" }
    ],
  },

  // --- NOVOS PRODUTOS (COM VARIANTES DE TAMANHO) ---
  {
    id: 9,
    name: "V-Floc Lava Autos",
    image: "/images/products/vfloc.png", 
    category: "Lavagem Automotiva",
    tag: "Alto Rendimento",
    description: "Shampoo neutro de alta performance e lubrificação extrema. Evita microrriscos na pintura durante a lavagem e tem rendimento fantástico.",
    variants: [
      { size: "500ml", price: "R$ 24,90" },
      { size: "1.5L", price: "R$ 54,90" },
      { size: "3L", price: "R$ 89,90" }
    ]
  },
  {
    id: 10,
    name: "Sintra Fast",
    image: "/images/products/sintra.png",
    category: "Higienização Interna",
    tag: "Bactericida",
    description: "Limpador flotador bactericida de pH neutro. Mata germes e bactérias no interior do veículo. Ideal para painéis, portas e bancos de tecido.",
    variants: [
      { size: "500ml", price: "R$ 39,90" },
      { size: "5L", price: "R$ 149,90" }
    ]
  },
  {
    id: 11,
    name: "Restaurax",
    image: "/images/products/restaurax.png",
    category: "Plásticos & Borrachas",
    tag: "Renovador",
    description: "Restaura superfícies plásticas (para-choques, painéis, laterais de porta) renovando e dando brilho. Protege contra degradação solar.",
    price: "R$ 34,90" // Preço único
  },
  {
    id: 12,
    name: "Delet Limpador de Pneus",
    image: "/images/products/delet.png",
    category: "Pneus & Rodas",
    tag: "Ação Rápida",
    description: "Limpador de alta performance formulado exclusivamente para remover sujeira severa de pneus e borrachas, deixando-os com aspecto de novo.",
    variants: [
        { size: "500ml", price: "R$ 32,90" },
        { size: "5L", price: "R$ 119,90" }
    ]
  },

  // --- MAIS PRODUTOS PARA ENCHER O CATÁLOGO ---
  {
    id: 13,
    name: "Pano Microfibra 40x40",
    image: "/images/products/microfibra.png",
    category: "Acessórios",
    price: "R$ 12,00",
    description: "Pano de microfibra de alta gramatura, ideal para remoção de ceras e secagem sem riscar a pintura."
  },
  {
    id: 14,
    name: "Luva de Microfibra",
    image: "/images/products/luva.png",
    category: "Acessórios",
    price: "R$ 29,90",
    description: "Luva macia para lavagem automotiva. Retém a sujeira nas fibras evitando atrito direto com a pintura."
  },
  {
    id: 15,
    name: "Aplicador de Espuma",
    image: "/images/products/aplicador.png",
    category: "Acessórios",
    price: "R$ 5,00",
    description: "Aplicador macio desenvolvido para aplicação de ceras, hidratantes de couro e limpadores de plástico."
  },
  {
    id: 16,
    name: "V-Bar (Clay Bar)",
    image: "/images/products/claybar.png",
    category: "Descontaminação",
    price: "R$ 45,90",
    description: "Barra descontaminante que remove a aspereza da pintura, deixando-a lisa como vidro. Essencial antes do polimento."
  },
  {
    id: 17,
    name: "Native Cera de Carnaúba",
    image: "/images/products/native.png",
    category: "Selantes & Ceras",
    tag: "Premium",
    description: "Cera de carnaúba pura de alta pureza. Focada 100% em profundidade de brilho e toque aveludado para carros de exposição.",
    variants: [
        { size: "100ml", price: "R$ 69,90" },
        { size: "Paste Wax", price: "R$ 189,90" }
    ]
  },
  {
    id: 18,
    name: "Higicouro",
    image: "/images/products/higicouro.png",
    category: "Couro",
    price: "R$ 28,90",
    description: "Limpa bancos de couro com segurança removendo impurezas sem agredir o material ou remover a cor."
  },
  {
    id: 19,
    name: "Hidracouro",
    image: "/images/products/hidracouro.png",
    category: "Couro",
    price: "R$ 32,90",
    description: "Hidrata e protege bancos de couro, evitando o ressecamento e rachaduras precoces. Deixa acabamento fosco original."
  },
  {
    id: 20,
    name: "Revelax",
    image: "/images/products/revelax.png",
    category: "Polimento",
    price: "R$ 22,90",
    description: "Revelador de hologramas. Limpa a peça após o polimento removendo óleos da massa de polir para inspecionar o resultado real."
  }
];