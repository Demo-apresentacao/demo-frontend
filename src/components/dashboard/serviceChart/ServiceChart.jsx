import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ServiceChart({ data }) {
    if (!data || data.length === 0) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Sem dados suficientes para o gráfico.</div>;
    }

    return (
        <div style={{ width: '100%', height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                    <XAxis type="number" hide />
                    <YAxis 
                        dataKey="serv_nome" 
                        type="category" 
                        width={150} 
                        tick={{fontSize: 12, fill: '#4b5563'}} 
                    />
                    <Tooltip 
                        cursor={{fill: '#f3f4f6'}}
                        contentStyle={{
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#ffffff'
                        }}
                        labelStyle={{
                            color: '#111827',
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            marginBottom: '0.5rem',
                            borderBottom: '1px solid #f3f4f6',
                            paddingBottom: '0.25rem'
                        }}
                        itemStyle={{
                            color: '#374151',
                            fontSize: '0.9rem'
                        }}
                    />
                    <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={30}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#2563eb" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}