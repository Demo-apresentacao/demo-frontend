// // import styles from "./page.module.css"

// // export default function Admin() {
// //     return (
// //         <div>
// //             <h1 className={styles.h1}>Admin Dashboard</h1>
// //         </div>
// //     )
// // }

// "use client";
// import { Users, CalendarCheck, Clock, DollarSign, Activity, CalendarDays } from "lucide-react";
// import styles from "./page.module.css";

// export default function AdminDashboard() {
    
//     // --- MOCK DATA (Contexto: Estética Automotiva) ---
//     const stats = {
//         totalUsers: 850, // Clientes cadastrados
//         totalAppointments: 12, // Agendamentos do dia
//         revenue: "R$ 4.250,00", // Ticket médio automotivo costuma ser maior
//         activeNow: 1
//     };

//     const currentService = {
//         inProgress: true,
//         serviceName: "Polimento Técnico + Vitrificação",
//         clientName: "Roberto Almeida (BMW 320i)", // Adicionei o carro para contexto
//         timeStart: "08:00", // Serviços automotivos são longos
//         timeEnd: "17:00",
//         professional: "Marcos Silva"
//     };

//     const nextAppointments = [
//         { id: 1, time: "14:30", client: "Ana Paula (Jeep Compass)", service: "Lavagem Detalhada de Motor" },
//         { id: 2, time: "15:00", client: "Felipe Costa (Honda Civic)", service: "Higienização Interna" },
//         { id: 3, time: "16:30", client: "Juliana Martins (HB20)", service: "Oxi-Sanitização" },
//     ];
//     // ------------------------------------------------

//     return (
//         <div className={styles.container}>
//             <h1 className={styles.title}>Dashboard</h1>

//             {/* 1. GRID DE ESTATÍSTICAS */}
//             <div className={styles.statsGrid}>
//                 <StatCard 
//                     title="Clientes Totais" 
//                     value={stats.totalUsers} 
//                     icon={<Users size={24} />} 
//                 />
//                 <StatCard 
//                     title="Veículos Hoje" 
//                     value={stats.totalAppointments} 
//                     icon={<CalendarDays size={24} />} 
//                 />
//                  <StatCard 
//                     title="Faturamento" 
//                     value={stats.revenue} 
//                     icon={<DollarSign size={24} />} 
//                 />
//                  <StatCard 
//                     title="Ocupação Box" 
//                     value="100%" 
//                     icon={<Activity size={24} />} 
//                 />
//             </div>

//             {/* 2. GRID DE CONTEÚDO */}
//             <div className={styles.contentGrid}>
                
//                 {/* COLUNA 1: EM ANDAMENTO */}
//                 <div className={styles.sectionCard}>
//                     <div className={styles.cardHeader}>
//                         <Clock size={20} color="#2563eb" />
//                         <span className={styles.cardTitle}>No Box Principal</span>
//                     </div>
                    
//                     {currentService.inProgress ? (
//                         <div className={styles.activeService}>
//                             <div className={styles.pulseContainer}>
//                                 <div className={styles.pulseDot}></div>
//                                 <div className={styles.pulseRing}></div>
//                             </div>
                            
//                             <h3 className={styles.serviceName}>{currentService.serviceName}</h3>
//                             <p className={styles.clientName}>{currentService.clientName}</p>
                            
//                             <div style={{marginTop: '1rem', color: '#6b7280', fontSize: '0.9rem'}}>
//                                 <span>Previsão: {currentService.timeEnd}</span>
//                                 <span style={{margin: '0 8px'}}>•</span>
//                                 <span>Detailer: {currentService.professional}</span>
//                             </div>
//                         </div>
//                     ) : (
//                         <div style={{textAlign: 'center', padding: '2rem', color: '#9ca3af'}}>
//                             Nenhum veículo no box.
//                         </div>
//                     )}
//                 </div>

//                 {/* COLUNA 2: PRÓXIMOS AGENDAMENTOS */}
//                 <div className={styles.sectionCard}>
//                     <div className={styles.cardHeader}>
//                         <CalendarCheck size={20} color="#2563eb" />
//                         <span className={styles.cardTitle}>Próximas Entradas</span>
//                     </div>
                    
//                     <div className={styles.appointmentList}>
//                         {nextAppointments.map(app => (
//                             <div key={app.id} className={styles.appointmentItem}>
//                                 <div style={{display:'flex', flexDirection:'column'}}>
//                                     <span style={{fontWeight: 600, color: '#374151'}}>{app.service}</span>
//                                     <span style={{fontSize: '0.875rem', color: '#6b7280'}}>{app.client}</span>
//                                 </div>
//                                 <div className={styles.timeBadge}>
//                                     {app.time}
//                                 </div>
//                             </div>
//                         ))}
                        
//                         {nextAppointments.length === 0 && (
//                             <p style={{color: '#6b7280', textAlign: 'center'}}>Agenda livre!</p>
//                         )}
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// }

// // Componente simples para os Cards do Topo
// function StatCard({ title, value, icon }) {
//     return (
//         <div className={styles.statCard}>
//             <div className={styles.iconWrapper}>
//                 {icon}
//             </div>
//             <div className={styles.statInfo}>
//                 <span className={styles.statLabel}>{title}</span>
//                 <span className={styles.statValue}>{value}</span>
//             </div>
//         </div>
//     );
// }

"use client";
import { Users, CalendarCheck, Clock, DollarSign, Activity, CalendarDays, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from "./page.module.css";

export default function AdminDashboard() {
    
    // --- MOCK DATA ---
    const stats = {
        totalUsers: 850,
        totalAppointments: 12,
        revenue: "R$ 4.250,00",
        activeNow: 1
    };

    const currentService = {
        inProgress: true,
        serviceName: "Polimento Técnico + Vitrificação",
        clientName: "Roberto Almeida (BMW 320i)",
        timeStart: "08:00",
        timeEnd: "17:00",
        professional: "Marcos Silva"
    };

    const nextAppointments = [
        { id: 1, time: "14:30", client: "Ana Paula (Jeep Compass)", service: "Lavagem Detalhada de Motor" },
        { id: 2, time: "15:00", client: "Felipe Costa (Honda Civic)", service: "Higienização Interna" },
        { id: 3, time: "16:30", client: "Juliana Martins (HB20)", service: "Oxi-Sanitização" },
    ];

    // MOCK DATA PARA O GRÁFICO (Top 5 Serviços)
    const topServicesData = [
        { name: 'Lavagem Detalhada', total: 120 },
        { name: 'Polimento Técnico', total: 85 },
        { name: 'Higienização Interna', total: 60 },
        { name: 'Vitrificação', total: 45 },
        { name: 'Lavagem Simples', total: 30 },
    ];
    // ------------------------------------------------

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Dashboard Administrativo</h1>
                <span className={styles.dateBadge}>25 Dez, 2025</span>
            </header>

            {/* 1. GRID DE ESTATÍSTICAS */}
            <div className={styles.statsGrid}>
                <StatCard title="Clientes Totais" value={stats.totalUsers} icon={<Users size={24} />} />
                <StatCard title="Veículos Hoje" value={stats.totalAppointments} icon={<CalendarDays size={24} />} />
                <StatCard title="Faturamento" value={stats.revenue} icon={<DollarSign size={24} />} />
                <StatCard title="Ocupação Box" value="100%" icon={<Activity size={24} />} />
            </div>

            {/* 2. GRID OPERACIONAL (Meio) */}
            <div className={styles.contentGrid}>
                
                {/* COLUNA 1: EM ANDAMENTO */}
                <div className={styles.sectionCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.headerIconTitle}>
                            <Clock size={20} className={styles.iconBlue} />
                            <span className={styles.cardTitle}>Em Andamento (Box Principal)</span>
                        </div>
                    </div>
                    
                    {currentService.inProgress ? (
                        <div className={styles.activeService}>
                            <div className={styles.pulseContainer}>
                                <div className={styles.pulseDot}></div>
                                <div className={styles.pulseRing}></div>
                            </div>
                            
                            <h3 className={styles.serviceName}>{currentService.serviceName}</h3>
                            <p className={styles.clientName}>{currentService.clientName}</p>
                            
                            <div className={styles.metaData}>
                                <span>Previsão: {currentService.timeEnd}</span>
                                <span className={styles.divider}>•</span>
                                <span>Detailer: {currentService.professional}</span>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>Nenhum veículo no box.</div>
                    )}
                </div>

                {/* COLUNA 2: PRÓXIMOS AGENDAMENTOS */}
                <div className={styles.sectionCard}>
                    <div className={styles.cardHeader}>
                         <div className={styles.headerIconTitle}>
                            <CalendarCheck size={20} className={styles.iconBlue} />
                            <span className={styles.cardTitle}>Próximas Entradas</span>
                        </div>
                    </div>
                    
                    <div className={styles.appointmentList}>
                        {nextAppointments.map(app => (
                            <div key={app.id} className={styles.appointmentItem}>
                                <div className={styles.apptInfo}>
                                    <span className={styles.apptService}>{app.service}</span>
                                    <span className={styles.apptClient}>{app.client}</span>
                                </div>
                                <div className={styles.timeBadge}>{app.time}</div>
                            </div>
                        ))}
                        {nextAppointments.length === 0 && <p className={styles.emptyState}>Agenda livre!</p>}
                    </div>
                </div>
            </div>

            {/* 3. GRID ANALÍTICO (Fundo - NOVO) */}
            <div className={styles.analyticsSection}>
                <div className={styles.sectionCard}>
                    <div className={styles.cardHeader}>
                         <div className={styles.headerIconTitle}>
                            <TrendingUp size={20} className={styles.iconBlue} />
                            <span className={styles.cardTitle}>Serviços Mais Procurados (Mês)</span>
                        </div>
                    </div>
                    
                    {/* Componente do Gráfico */}
                    <div style={{ width: '100%', height: "300px", marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={topServicesData}
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    width={150} 
                                    tick={{fontSize: 12, fill: '#4b5563'}} 
                                />
                                <Tooltip 
                                    cursor={{fill: '#f3f4f6'}}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={30}>
                                    {topServicesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#2563eb" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
}

// Sub-componente Card
function StatCard({ title, value, icon }) {
    return (
        <div className={styles.statCard}>
            <div className={styles.iconWrapper}>{icon}</div>
            <div className={styles.statInfo}>
                <span className={styles.statLabel}>{title}</span>
                <span className={styles.statValue}>{value}</span>
            </div>
        </div>
    );
}