"use client";

// Importando do caminho original (sem problemas)
import DilutionCalculator from "@/components/landing page/calculator/dilutionCalculator"; 
import styles from "./CalculatorClient.module.css";

export default function CalculatorClient() {
  return (
    <div className={styles.wrapper}>
      {/* Aqui simulamos o visual de "Card Branco" que você tem na tabela de usuários.
         Assim a calculadora não fica solta no fundo cinza da dashboard.
      */}
      <div className={styles.cardContainer}>
        <div className={styles.headerSimples}>
            <h3>Ferramenta Rápida - Calculadora de Diluição</h3>
            <p>Utilize para calcular proporções de produtos concentrados.</p>
        </div>
        
        <div className={styles.calculatorWrapper}>
            {/* O modo simples remove o textão de marketing e o padding gigante */}
            <DilutionCalculator simpleMode={true} />
        </div>
      </div>
    </div>
  );
}