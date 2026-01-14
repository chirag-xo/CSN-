import { useNavigate } from 'react-router-dom';

interface KPICardsProps {
    stats: {
        referralsGiven: number;
        referralsReceived: number;
        meetingsAttended: number;
        connections: number;
    };
}

export default function KPICards({ stats }: KPICardsProps) {
    const navigate = useNavigate();

    const kpis = [
        {
            id: 'referrals-given',
            title: 'Referrals Given',
            value: stats.referralsGiven,
            icon: '📤',
            action: 'Submit New',
            actionLink: '/dashboard/home/referrals',
            color: '#6D28D9'
        },
        {
            id: 'referrals-received',
            title: 'Referrals Received',
            value: stats.referralsReceived,
            icon: '📥',
            action: 'View All',
            actionLink: '/dashboard/home/referrals',
            color: '#0891B2'
        },
        {
            id: 'meetings-attended',
            title: 'Meetings Attended',
            value: stats.meetingsAttended,
            icon: '🎯',
            action: 'View History',
            actionLink: '/dashboard/home/events',
            color: '#DC2626'
        },
        {
            id: 'connections',
            title: 'Connections',
            value: stats.connections,
            icon: '🤝',
            action: 'View Network',
            actionLink: '/dashboard/home/connections',
            color: '#059669'
        }
    ];

    return (
        <div className="kpi-section">
            <h2 className="section-title">Your Business Metrics</h2>
            <div className="kpi-grid">
                {kpis.map(kpi => (
                    <div key={kpi.id} className="kpi-card" style={{ borderLeftColor: kpi.color }}>
                        <div className="kpi-header">
                            <span className="kpi-icon">{kpi.icon}</span>
                            <h3 className="kpi-title">{kpi.title}</h3>
                        </div>
                        <div className="kpi-value">{kpi.value}</div>
                        <button
                            className="kpi-action"
                            style={{ color: kpi.color }}
                            onClick={() => navigate(kpi.actionLink)}
                        >
                            {kpi.action} →
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
