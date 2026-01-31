"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './hero.module.css';
import ServicesModal from './modalServices/servicesModal'; 
import ServicesCarousel from './servicesCarousel/servicesCarousel'; 

export default function Hero() {
  const [showServices, setShowServices] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const whatsappNumber = "5518996223545";

  const openWhatsApp = () => {
    const mensagem = "Olá! Gostaria de mais informações sobre os serviços!";
    const mensagemCodificada = encodeURIComponent(mensagem);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const linkZap = isMobile
      ? `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${mensagemCodificada}`
      : `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${mensagemCodificada}`;

    window.open(linkZap, "_blank");
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setShowServices(true);
  };

  const handleShowAll = () => {
    setSelectedCategory(null);
    setShowServices(true);
  };

  return (
    <>
      <section id="home" className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>  
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Estética automotiva de <span className={styles.highlight}>alto padrão</span> para quem ama seu carro.
              </h1>

              <p className={styles.heroText}>
                Não é apenas lavagem. É um tratamento completo de rejuvenescimento e proteção para o seu veículo, utilizando as melhores técnicas do mercado.
              </p>
              
              <div className={styles.heroActions}>
                <button 
                  type="button"
                  className={styles.btnPrimary}
                  onClick={openWhatsApp}
                >
                  Agendar Serviço
                </button>

                <button 
                  className={styles.btnSecondary} 
                  onClick={handleShowAll}
                >
                  Conhecer Serviços
                </button>
              </div>
            </div>

            <div className={styles.heroImageWrapper}>
              <Image 
                src="/images/imagem_byd.jpg"
                alt="Carro esteticamente tratado"
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          <ServicesCarousel onCategorySelect={handleCategoryClick} />
        </div>
      </section>

      <ServicesModal 
        isOpen={showServices} 
        onClose={() => setShowServices(false)} 
        selectedCategoryId={selectedCategory}
      />
    </>
  );
}
