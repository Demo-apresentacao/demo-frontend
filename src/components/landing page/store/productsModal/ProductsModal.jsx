"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { X, ShoppingBag, Search } from 'lucide-react';
import Image from 'next/image';
import styles from './ProductsModal.module.css';
import { products } from '../data/productsDb';

// Ícone do WhatsApp
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
  </svg>
);

const ProductCard = ({ product }) => {
  const whatsappNumber = "5518996223545"; 

  const displayVariants = product.variants && product.variants.length > 0 
    ? product.variants 
    : [{ size: product.size || "500ml", price: product.price }];

  // Inicia selecionando a primeira opção
  const [selectedVariant, setSelectedVariant] = useState(displayVariants[0]);

  const handleBuy = () => {
    // Monta mensagem segura
    const message = `Olá! Tenho interesse no produto *${product.name}* (Tamanho: ${selectedVariant.size} - ${selectedVariant.price}). Ainda tem disponível?`;
    const linkZap = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    window.open(linkZap, "_blank");
  };

  return (
    <div className={styles.card}>
      {product.tag && <span className={styles.tag}>{product.tag}</span>}
      
      <div className={styles.imageWrapper}>
        <div className={styles.placeholderBg}>
            <ShoppingBag size={24} color="#e5e7eb" />
        </div>
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          style={{objectFit: 'contain'}}
          sizes="(max-width: 768px) 100vw, 200px"
        />
      </div>

      <div className={styles.cardContent}>
        <h4 className={styles.productName}>{product.name}</h4>
        
        {/* Descrição sempre presente para manter alinhamento */}
        <p className={styles.description}>
            {product.description || "Descrição do produto."}
        </p>

        {/* Seção de Tamanhos Padronizada */}
        <div className={styles.variantsContainer}>
            <span className={styles.variantLabel}>TAMANHO:</span>
            <div className={styles.sizesGrid}>
              {displayVariants.map((v, index) => (
                <button
                  key={index}
                  // Uso do ?.size para segurança total
                  className={`${styles.sizeBtn} ${selectedVariant?.size === v.size ? styles.sizeBtnActive : ''}`}
                  onClick={() => setSelectedVariant(v)}
                >
                  {v.size}
                </button>
              ))}
            </div>
        </div>

        {/* Rodapé Alinhado */}
        <div className={styles.priceActionRow}>
            <span className={styles.price}>{selectedVariant.price}</span>
            <button className={styles.buyBtn} onClick={handleBuy}>
            Comprar
            </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL: MODAL ---
export default function ProductsModal({ isOpen, onClose }) {
  const whatsappNumber = "5518996223545"; 
  const [searchTerm, setSearchTerm] = useState("");

  // Limpa a busca sempre que o modal abre/fecha
  useEffect(() => {
    if (!isOpen) setSearchTerm("");
  }, [isOpen]);

  // Bloqueia Scroll e Fecha com ESC
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Filtro + Agrupamento
  const groupedProducts = useMemo(() => {
    const groups = {};
    
    // 1. Filtra
    const filteredList = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Agrupa
    filteredList.forEach(product => {
      const cat = product.category || "Outros";
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(product);
    });
    
    return groups;
  }, [searchTerm]);

  const openWhatsAppGeneral = () => {
    const message = "Olá! Gostaria de receber o catálogo completo em PDF ou tirar dúvidas sobre os produtos.";
    const linkZap = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    window.open(linkZap, "_blank");
  };

  if (!isOpen) return null;

  const hasProducts = Object.keys(groupedProducts).length > 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h3 className={styles.title}>Catálogo Completo</h3>
              <p className={styles.subtitle}>Produtos profissionais para o seu veículo</p>
            </div>
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          {/* PESQUISA */}
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={20} />
            <input 
              type="text" 
              className={styles.searchInput}
              placeholder="Pesquisar produto (ex: shampoo, cera...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus 
            />
          </div>
        </div>

        {/* CORPO DO MODAL */}
        <div className={styles.body}>
          {hasProducts ? (
            Object.entries(groupedProducts).map(([categoryName, items]) => (
              <div key={categoryName} className={styles.categorySection}>
                <h4 className={styles.categoryTitle}>{categoryName}</h4>
                
                <div className={styles.grid}>
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Not Found
            <div className={styles.notFound}>
              <Search size={48} color="#d1d5db" />
              <p>Nenhum produto encontrado para "{searchTerm}".</p>
              <button className={styles.clearSearch} onClick={() => setSearchTerm("")}>
                Limpar pesquisa
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <button className={styles.ctaButton} onClick={openWhatsAppGeneral}>
            <WhatsAppIcon />
            Falar com Vendedor
          </button>
        </div>
      </div>
    </div>
  );
}