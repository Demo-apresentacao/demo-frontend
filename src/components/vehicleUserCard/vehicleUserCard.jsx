'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // Import necessário para navegação
import { 
  Truck, Car, Bike, Calendar, Fuel, Droplet, 
  Edit2, Trash2, Info, CalendarClock 
} from 'lucide-react';
import styles from './vehicleUserCard.module.css';

const VehicleUserCard = ({ vehicle, onDelete }) => {
  const router = useRouter();

  // Desestruturando os dados, incluindo ID, observação e data inicial
  const {
    mar_nome, mod_nome, veic_placa, veic_ano, veic_cor, 
    veic_combustivel, cat_id, ehproprietario, veic_situacao, 
    veic_usu_id, veic_id, veic_observ, data_inicial
  } = vehicle;

  // Lógica de Navegação para a página de edição
  const handleEditClick = () => {
    router.push(`/user/vehicle/${veic_id}`);
  };

  // Lógica de Formatação de Data
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getCategoryIcon = (id) => {
    const iconClass = styles.categoryIcon;
    switch (id) {
      case 1: return <Truck className={iconClass} />;
      case 2: return <Car className={iconClass} />;
      case 3: return <Bike className={iconClass} />;
      default: return <Car className={iconClass} />;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.mainInfo}>
          <div className={styles.iconWrapper}>
            {getCategoryIcon(cat_id)}
          </div>
          <div className={styles.titleGroup}>
            <h3>{mar_nome} {mod_nome}</h3>
            <span className={styles.subtitle}>
              {ehproprietario ? "Proprietário" : "Vinculado"}
            </span>
          </div>
        </div>
        
        {/* LÓGICA ATUALIZADA: Botões de Ação */}
        <div className={styles.actionsHeader}>
          {/* Botão Editar: Navega para a página [id] */}
          <button 
            className={`${styles.iconButton} ${styles.btnEdit}`} 
            onClick={handleEditClick}
            title="Editar Veículo"
          >
            <Edit2 size={18} />
          </button>

          {/* Botão Excluir: Chama a função de deletar passada pelo pai */}
          <button 
            className={`${styles.iconButton} ${styles.btnDelete}`} 
            onClick={() => onDelete(veic_usu_id)}
            title="Encerrar Vínculo"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      {/* Badge da Placa */}
      <div style={{ marginTop: '8px', marginBottom: '8px' }}>
         <span className={styles.plateBadge}>{veic_placa}</span>
      </div>

      <hr className={styles.divider} />

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <Calendar className={styles.detailIcon} />
          <span>Ano: <strong className={styles.detailValue}>{veic_ano}</strong></span>
        </div>
        <div className={styles.detailItem}>
          <Droplet className={styles.detailIcon} />
          <span>Cor: <strong className={styles.detailValue}>{veic_cor}</strong></span>
        </div>
        <div className={`${styles.detailItem} ${styles.fullWidth}`}>
          <Fuel className={styles.detailIcon} />
          <span>Combustível: <strong className={styles.detailValue}>{veic_combustivel}</strong></span>
        </div>
      </div>

      {/* LÓGICA NOVA: Exibe observação apenas se existir */}
      {veic_observ && (
        <div className={styles.obsContainer}>
          <Info size={14} className={styles.obsIcon} />
          <span className={styles.obsText}>{veic_observ}</span>
        </div>
      )}

      {/* Footer com Data e Status */}
      <div className={styles.footer}>
        <div className={styles.dateInfo}>
           <CalendarClock size={14} /> 
           <span>Desde: {formatDate(data_inicial)}</span>
        </div>

        <span className={`${styles.statusBadge} ${veic_situacao ? styles.statusActive : styles.statusInactive}`}>
          {veic_situacao ? 'Ativo' : 'Inativo'}
        </span>
      </div>
    </div>
  );
};

export default VehicleUserCard;