"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
// Adicionamos o Shield aqui nos imports
import { MoreVertical, Eye, Edit, Trash2, RotateCcw, Shield } from "lucide-react";
import styles from "./ActionMenu.module.css";
// Importando o nosso componente de proteção
import { Can } from "../can";

export const ActionMenu = ({ user, onArchive, onReactivate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button 
        className={styles.menuButton} 
        onClick={() => setIsOpen(!isOpen)}
        title="Ações"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          
          <Can perform="usuarios.visualizar">
            <Link
              href={`/admin/users/${user.usu_id}?mode=view`}
              className={styles.item}
              onClick={() => setIsOpen(false)}
            >
              <Eye size={16} />
              <span>Visualizar</span>
            </Link>
          </Can>
          
          <Can perform="usuarios.editar">
            <Link
              href={`/admin/users/${user.usu_id}?mode=edit`}
              className={styles.item}
              onClick={() => setIsOpen(false)}
            >
              <Edit size={16} />
              <span>Editar</span>
            </Link>
          </Can>

          {user.usu_situacao ? (
            <Can perform="usuarios.inativar">
              <button
                className={`${styles.item} ${styles.danger}`}
                onClick={() => {
                  onArchive(user.usu_id, user.usu_nome);
                  setIsOpen(false);
                }}
              >
                <Trash2 size={16} />
                <span>Inativar</span>
              </button>
            </Can>
          ) : (
            <Can perform="usuarios.reativar">
              <button
                className={`${styles.item} ${styles.success}`}
                onClick={() => {
                  onReactivate(user.usu_id, user.usu_nome);
                  setIsOpen(false);
                }}
              >
                <RotateCcw size={16} />
                <span>Reativar</span>
              </button>
            </Can>
          )}

          {/* NOVA OPÇÃO: Permissões para Mobile */}
          <Can perform="permissoes.visualizar">
            <Link
              href={`/admin/users/${user.usu_id}/permissoes`}
              className={styles.item}
              style={{ color: '#8b5cf6' }} // Roxinho para dar um destaque visual
              onClick={() => setIsOpen(false)}
            >
              <Shield size={16} />
              <span>Permissões</span>
            </Link>
          </Can>

        </div>
      )}
    </div>
  );
};