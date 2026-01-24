import styles from "./page.module.css";
import CalculatorClient from "./CalculatorClient";

export default function CalculatorPage() {
    return (
        <div className={styles.container}>
            {/* <h1 className={styles.title}>Calculadora de Diluição</h1> */}
            <CalculatorClient />
        </div>
    );
}