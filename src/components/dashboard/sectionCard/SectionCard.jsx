import styles from "@/components/dashboard/DashboardComponents.module.css"

export default function SectionCard({ title, icon, children }) {
    return (
        <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
                <div className={styles.headerIconTitle}>
                    <div className={styles.iconBlue}>{icon}</div>
                    <span className={styles.cardTitle}>{title}</span>
                </div>
            </div>
            <div className={styles.cardContent}>
                {children}
            </div>
        </div>
    );
}