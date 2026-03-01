import styles from "./page.module.css";

import ScheduleClient from "./ScheduleClient";

import { Can } from "@/components/ui/can";
import AccessDenied from "@/components/ui/accessDenied";

export default function SchedulePage() {
    return (
        <Can perform="calendario.visualizar" fallback={<AccessDenied />}>
            <div className={styles.container}>
                {/* <h1 className={styles.title}>Agendamentos</h1> */}
                <ScheduleClient />
            </div>
        </Can>
    );
}