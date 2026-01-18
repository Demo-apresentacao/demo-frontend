"use client";

import React, { useState, useEffect } from 'react';
import { FlaskConical, Droplets, Info } from 'lucide-react'; // Ícones da mesma lib que você usa
import styles from './dilutionCalculator.module.css';

export default function DilutionCalculator() {
  const [containerSize, setContainerSize] = useState(500); // Padrão 500ml
  const [ratio, setRatio] = useState(10); // Padrão 1:10 (apenas o numero da agua)
  const [result, setResult] = useState({ product: 0, water: 0 });

  // Lista de diluições comuns na estética automotiva
  const commonRatios = [
    { label: "1:5 (Limpeza Pesada)", value: 5 },
    { label: "1:10 (Interiores/Couro)", value: 10 },
    { label: "1:20 (Multiuso)", value: 20 },
    { label: "1:50 (Shampoo)", value: 50 },
    { label: "1:100 (Lavagem Leve)", value: 100 },
    { label: "1:200 (Snow Foam)", value: 200 },
  ];

  // A mágica acontece aqui
  useEffect(() => {
    // Fórmula: Volume Total / (Partes de Água + 1 Parte de Produto)
    const totalParts = Number(ratio) + 1;
    const productAmount = Number(containerSize) / totalParts;
    const waterAmount = Number(containerSize) - productAmount;

    setResult({
      product: Math.round(productAmount),
      water: Math.round(waterAmount)
    });
  }, [containerSize, ratio]);

  return (
    <section className={styles.dilutionSection}>
      <div className={styles.container}>
        
        {/* Cabeçalho da Seção */}
        <div className={styles.headerContent}>
          <h4 className={styles.tagline}>Ferramenta Gratuita</h4>
          <h2 className={styles.sectionTitle}>Calculadora de Diluição</h2>
          <p className={styles.text}>
            Não desperdice produtos. 
            <br />Calcule a mistura exata para o seu borrifador ou snow foam em segundos.
          </p>
        </div>

        {/* Card da Calculadora */}
        <div className={styles.calculatorCard}>
          
          {/* Inputs */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Tamanho do Recipiente (ml)
            </label>
            <input 
              type="number" 
              value={containerSize}
              onChange={(e) => setContainerSize(e.target.value)}
              className={styles.input}
              placeholder="Ex: 500"
            />
            <span className={styles.helperText}>Ex: 500ml, 1000ml (1L)</span>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Diluição Desejada (Produto : Água)
            </label>
            <select 
              className={styles.select}
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
            >
              {commonRatios.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Divisor Visual */}
          <div className={styles.divider}></div>

          {/* Resultados */}
          <div className={styles.resultsContainer}>
            
            {/* Box Produto */}
            <div className={`${styles.resultBox} ${styles.productBox}`}>
              <div className={styles.iconCircleRed}>
                <FlaskConical size={24} color="#fa0106" />
              </div>
              <div>
                <span className={styles.resultLabel}>Coloque de Produto</span>
                <span className={styles.resultValue}>{result.product} ml</span>
              </div>
            </div>

            {/* Box Água */}
            <div className={`${styles.resultBox} ${styles.waterBox}`}>
              <div className={styles.iconCircleBlue}>
                <Droplets size={24} color="#3b82f6" />
              </div>
              <div>
                <span className={styles.resultLabel}>Complete com Água</span>
                <span className={styles.resultValue}>{result.water} ml</span>
              </div>
            </div>

          </div>
          
          <div className={styles.proTip}>
            <Info size={16} className={styles.infoIcon} />
            <p>Dica: Coloque a água antes do produto para evitar muita espuma.</p>
          </div>

        </div>
      </div>
    </section>
  );
}