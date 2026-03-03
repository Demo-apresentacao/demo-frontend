import styles from "./page.module.css"
import UsersClient from "./UsersClient";
import { Can } from "@/components/ui/can";
import AccessDenied from "@/components/ui/accessDenied";

export default function Users() {
    return (
        // Envolvemos a página inteira com a permissão exigida
        <Can perform="usuarios.listar" fallback={<AccessDenied />}>
            <div className={styles.container}>
                <h1 className={styles.title}>Painel de Usuários</h1>   
                <UsersClient />
            </div>
        </Can>
    );
}