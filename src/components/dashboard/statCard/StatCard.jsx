import styles from "@/components/dashboard/DashboardComponents.module.css"

export default function StatCard({ title, value, icon, action }) {
    return (
        <div className={styles.statCard}>
            <div className={styles.iconWrapper}>{icon}</div>
            <div className={styles.statInfo}>
                <span className={styles.statLabel}>{title}</span>
                <div className={styles.valueRow}>
                    <span className={styles.statValue}>{value}</span>
                    {action && <div className={styles.actionWrapper}>{action}</div>}
                </div>
            </div>
        </div>
    );
}