// src/app/admin/users/[id]/permissoes/UserPermissionsClient.jsx
"use client";

import { useRouter } from "next/navigation";

import { useEffect } from "react";
import { Shield, ArrowLeft, Save } from "lucide-react";

import { useUserPermissions } from "@/hooks/useUserPermissions";

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
    hasUnsavedChanges
  } = useUserPermissions(userId);

  useEffect(() => {
    if (userId) fetchPermissionsData();
  }, [userId, fetchPermissionsData]);

  const onSaveClick = async () => {
    await handleSave();
    // Opcional: Voltar para a lista após salvar
    // router.push("/admin/users"); 
  };

  // NOVA FUNÇÃO: Valida antes de voltar
  const handleGoBack = async () => {
    if (hasUnsavedChanges) {
      const result = await Swal.fire({
        title: 'Alterações não salvas!',
        text: 'Você modificou as permissões. Se sair agora, perderá essas alterações. Deseja realmente sair?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#fa0106', // Sua cor vermelha principal
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sim, sair sem salvar',
        cancelButtonText: 'Cancelar'
      });

      // Se o usuário confirmou que quer sair perdendo os dados
      if (result.isConfirmed) {
        router.back();
      }
    } else {
      // Se não tem alterações, volta direto sem encher o saco
      router.back();
    }
  };

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
                    {/* <span className={styles.descricao}>{perm.per_chave}</span> */}
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
        <button className={styles.btnSave} onClick={onSaveClick}>
          <Save size={18} />
          Salvar Permissões
        </button>
      </div>
    </div>
  );
}