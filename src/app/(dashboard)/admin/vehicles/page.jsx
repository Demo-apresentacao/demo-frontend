import styles from './page.module.css'

import VehiclesClient from './VehiclesClient';
import { Can } from "@/components/ui/can";
import AccessDenied from "@/components/ui/accessDenied";

export default function Vehicles() {
    return (
        <Can perform="veiculos.listar" fallback={<AccessDenied />}>
            <div className={styles.container}>
                <h1 className={styles.title}>Painel de Veículos</h1>
                <VehiclesClient />
            </div>
        </Can>
    );
}