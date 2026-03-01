import AppointmentsClient from "./AppointmentsClient";
import styles from "./page.module.css";

import { Can } from "@/components/ui/can";
import AccessDenied from "@/components/ui/accessDenied";

export default function AppointmentsPage() {
    return (
        <Can perform="agendamentos.listar" fallback={<AccessDenied />}>
            <div className={styles.container}>
                <h1 className={styles.title}>Agendamentos</h1>
                <AppointmentsClient />
            </div>
        </Can>
    );
}