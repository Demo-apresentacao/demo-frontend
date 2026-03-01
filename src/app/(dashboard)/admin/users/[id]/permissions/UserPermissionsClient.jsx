
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Shield, ArrowLeft, Save } from "lucide-react";

import { useUserPermissions } from "@/hooks/useUserPermissions";

import { useAuthContext } from "@/contexts/AuthContext";

import AccessDenied from "@/components/ui/accessDenied";
import { Can } from "@/components/ui/can";

import Swal from "sweetalert2";

import styles from "./page.module.css";

export default function UserPermissionsClient({ userId }) {
    const router = useRouter();
    const {
        allPermissions,
        selectedPerms,
        loading,
        fetchPermissionsData,
        handleToggle,
        handleSave,
        hasUnsavedChanges,
        accessDenied
    } = useUserPermissions(userId);

    // 2. EXTRAIR A FUNÇÃO HASPERMISSION DO SEU CONTEXTO
    const { hasPermission, user: currentUser, refreshSession } = useAuthContext();

    useEffect(() => {
        if (userId) fetchPermissionsData();
    }, [userId, fetchPermissionsData]);

    const onSaveClick = async () => {
        const success = await handleSave();
        
        // 2. Só executa a lógica se salvou com sucesso no banco
        if (success) {
            // VERIFICAÇÃO DE SEGURANÇA: Ele editou a si mesmo?
            if (currentUser && String(currentUser.id) === String(userId)) {
                // Força o contexto a atualizar ANTES de mudar de página
                await refreshSession();
            }
            
            // 3. Só agora, com a memória atualizada, mudamos de tela!
            router.push("/admin/users");
        }
    };

    // 3. A NOVA FUNÇÃO DE VOLTAR VALIDADORA
    const handleGoBack = async () => {
        if (hasUnsavedChanges) {
            
            // VERIFICA SE ELE TEM A PERMISSÃO DE EDITAR
            if (hasPermission("permissoes.editar")) {
                const result = await Swal.fire({
                    title: 'Alterações não salvas!',
                    text: 'Você modificou as permissões. Se sair agora, perderá essas alterações. Deseja realmente sair?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#fa0106', 
                    cancelButtonColor: '#6b7280',
                    confirmButtonText: 'Sim, sair sem salvar',
                    cancelButtonText: 'Ficar e Salvar'
                });

                // Se confirmou, vai para a lista de usuários
                if (result.isConfirmed) {
                    router.push("/admin/users");
                }
            } else {
                // SE ELE NÃO TEM A PERMISSÃO DE EDITAR
                const result = await Swal.fire({
                    title: 'Ação não permitida',
                    text: 'Você modificou os acessos na tela, mas não possui permissão de alterar as permissões no sistema. Todas as alterações serão descartadas ao sair.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#fa0106',
                    cancelButtonColor: '#6b7280',
                    confirmButtonText: 'Entendi, sair da tela',
                    cancelButtonText: 'Cancelar'
                });

                // Se confirmou, vai para a lista de usuários
                if (result.isConfirmed) {
                    router.push("/admin/users");
                }
            }
            
        } else {
            // Se não tem alterações, vai para a lista de usuários direto
            router.push("/admin/users");
        }
    };

    if (accessDenied) {
        return <AccessDenied />;
    }

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Carregando permissões...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <Shield size={28} className={styles.headerIcon} />
                    <div>
                        <h1>Gerenciar Permissões</h1>
                        <p>Ative ou desative os acessos deste usuário no sistema.</p>
                    </div>
                </div>
                <button className={styles.btnBack} onClick={handleGoBack}>
                    <ArrowLeft size={16} /> Voltar
                </button>
            </header>

            <div className={styles.modulesGrid}>
                {Object.entries(allPermissions).map(([modulo, permissoesDoModulo]) => (
                    <div key={modulo} className={styles.moduleCard}>
                        <h2 className={styles.moduleTitle}>{modulo.toUpperCase()}</h2>

                        <div className={styles.togglesList}>
                            {permissoesDoModulo.map((perm) => (
                                <label key={perm.per_chave} className={styles.toggleRow}>
                                    <div className={styles.toggleInfo}>
                                        <span className={styles.chave}>{perm.per_descricao}</span>
                                        <span className={styles.descricao}>{perm.per_chave}</span>
                                    </div>

                                    {/* Toggle Switch Customizado */}
                                    <div className={styles.switchWrapper}>
                                        <input
                                            type="checkbox"
                                            className={styles.switchInput}
                                            checked={selectedPerms.has(perm.per_chave)}
                                            onChange={() => handleToggle(perm.per_chave)}
                                        />
                                        <div className={styles.switchSlider}></div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.actionsBar}>
                <button className={styles.btnCancel} onClick={handleGoBack}>
                    Cancelar
                </button>
                <Can perform="permissoes.editar">
                    <button className={styles.btnSave} onClick={onSaveClick}>
                        <Save size={18} />
                        Salvar Permissões
                    </button>
                </Can>
            </div>
        </div>
    );
}