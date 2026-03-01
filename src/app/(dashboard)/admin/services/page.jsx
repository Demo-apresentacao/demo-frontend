import styles from "./page.module.css";

import ServiceClient from "./ServicesClient";

import { Can } from "@/components/ui/can";
import AccessDenied from "@/components/ui/accessDenied";

export default function ServicesPage() {
    return (

        <Can perform="servicos.listar" fallback={<AccessDenied />}>
            <div className={styles.container}>
                <h1 className={styles.title}>Painel de Serviços</h1>
                <ServiceClient />
            </div>
        </Can>
    );
}