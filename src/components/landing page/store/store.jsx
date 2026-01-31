"use client";

import React, { useState } from 'react';
import { ShoppingBag, MapPin, Navigation, ArrowRight } from 'lucide-react';
import styles from './store.module.css';
import { products } from './data/productsDb';
import Image from 'next/image';
import ProductsModal from './productsModal/ProductsModal'; 

// --- COMPONENTE DO CARD (SMART CARD) ---
const ProductCard = ({ product }) => {
  const whatsappNumber = "5518996223545"; 

  // --- LÓGICA DE PADRONIZAÇÃO ---
  // Aqui garantimos que TODO produto tenha uma lista de variantes.
  // Se o produto no DB só tem preço e não tem variantes, criamos uma na hora (ex: 500ml).
  const displayVariants = product.variants && product.variants.length > 0 
    ? product.variants 
    : [{ size: product.size || "500ml", price: product.price }];

  // Inicia selecionando a primeira opção disponível
  const [selectedVariant, setSelectedVariant] = useState(displayVariants[0]);

  const handleBuy = () => {
    // Monta a mensagem pro WhatsApp
    const message = `Olá! Tenho interesse no produto *${product.name}* (Tamanho: ${selectedVariant.size} - ${selectedVariant.price}). Ainda tem disponível?`;
    const linkZap = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    window.open(linkZap, "_blank");
  };

  return (
    <div className={styles.card}>
      {product.tag && <span className={styles.tag}>{product.tag}</span>}

      <div className={styles.imageWrapper}>
        <div className={styles.placeholderBg}>
          <ShoppingBag size={32} color="#9ca3af" />
        </div>
        <Image
          src={product.image}
          alt={product.name}
          fill
          style={{ objectFit: 'contain' }}
          sizes="(max-width: 768px) 100vw, 250px"
        />
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.productName}>{product.name}</h3>
        
        {/* Descrição com altura fixa via CSS para alinhar */}
        <p className={styles.description}>
            {product.description || "Descrição do produto."}
        </p>

        {/* Seção de Tamanhos (Sempre aparece agora, padronizada) */}
        <div className={styles.variantsContainer}>
          <span className={styles.variantLabel}>TAMANHO:</span>
          <div className={styles.sizesGrid}>
            {displayVariants.map((v, index) => (
              <button
                key={index}
                // Uso o ?.size para segurança, mas a lógica acima já garante que existe
                className={`${styles.sizeBtn} ${selectedVariant?.size === v.size ? styles.sizeBtnActive : ''}`}
                onClick={() => setSelectedVariant(v)}
              >
                {v.size}
              </button>
            ))}
          </div>
        </div>

        {/* Rodapé sempre alinhado */}
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

// --- COMPONENTE PRINCIPAL ---
export default function StoreSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define quantos produtos aparecem na Landing Page (apenas os 8 primeiros como vitrine)
  const featuredProducts = products.slice(0, 8);

  return (
    <>
      <section id="loja" className={styles.storeSection}>
        <div className={styles.container}>

          {/* CABEÇALHO DA SEÇÃO */}
          <div className={styles.header}>
            <span className={styles.preTitle}>Nossa Loja Física</span>
            <h2 className={styles.title}>Produtos <span className={styles.highlight}>Profissionais</span></h2>
            <p className={styles.subtitle}>
              Venha nos visitar e leve para casa os mesmos produtos que utilizamos para deixar os carros impecáveis.
            </p>
          </div>

          {/* GRID DE PRODUTOS */}
          <div className={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className={styles.footer} style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <button
              className={styles.viewAllBtn}
              onClick={() => setIsModalOpen(true)}
            >
              Ver todos os produtos (+{products.length - 8}) <ArrowRight size={20} />
            </button>
          </div>

          <div className={styles.locationContainer}>
            <div className={styles.locationContent}>
              <div className={styles.locationText}>
                <span className={styles.locationLabel}>Onde Estamos</span>
                <h3 className={styles.locationTitle}>Venha comprar seu produto ou agendar um serviço!</h3>

                <p className={styles.addressText}>
                  <MapPin className={styles.icon} size={20} />
                  Residencial Primavera, Rua 4 n° 119 <br />
                  Herculândia - SP
                </p>

                <p className={styles.timeText}>
                  Segunda a Sexta: 09h às 17h<br />
                </p>

                <a
                  href="https://maps.app.goo.gl/m2AZstx9jWeLaULB8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.routeBtn}
                >
                  <Navigation size={18} /> Traçar Rota
                </a>
              </div>

              <div className={styles.mapWrapper}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d893.4329881893995!2d-50.37851445359458!3d-22.012956157315017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9495bd000d47181d%3A0xbc8e7fff1430e75a!2sAutolimp%20produtos%20e%20estetica%20automotiva!5e1!3m2!1spt-BR!2sbr!4v1769873748435!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

        </div>
      </section>

      <ProductsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}