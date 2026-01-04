'use client';

import React, { useEffect } from 'react';
import styles from './page.module.css';
import VehicleUserCard from '@/components/vehicleUserCard/vehicleUserCard';
import { useVehicleUsers } from '@/hooks/useVehicleUsers';

export default function UserVehiclesPage() {
  const { vehicles, fetchUserVehicles, loading, error } = useVehicleUsers();

  // Exemplo de ID (substitua pela lógica real do AuthContext/LocalStorage)
  const loggedUserId = 112; 

  useEffect(() => {
    if (loggedUserId) {
      fetchUserVehicles(loggedUserId);
    }
  }, [fetchUserVehicles, loggedUserId]);

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>Meus Veículos</h1>
        <p className={styles.description}>
          Gerencie os veículos vinculados à sua conta
        </p>
      </header>

      {/* Tratamento de Erro */}
      {error && (
        <div className={styles.errorBox}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingState}>
          Carregando seus veículos...
        </div>
      ) : (
        <div className={styles.grid}>
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <VehicleUserCard 
                key={vehicle.veic_usu_id} 
                vehicle={vehicle} 
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>
                Nenhum veículo vinculado encontrado.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}