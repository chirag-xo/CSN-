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
            icon: <img src="/referrals-given.png" alt="Referrals Given" className="kpi-img-icon kpi-referral-given-icon" />,
            action: 'Submit New',
            actionLink: '/dashboard/home/referrals',
            color: '#6D28D9', // Purple
            accentClass: 'accent-purple'
        },
        {
            id: 'referrals-received',
            title: 'Referrals Received',
            value: stats.referralsReceived,
            icon: <img src="/referrals-received.png" alt="Referrals Received" className="kpi-img-icon" />,
            action: 'View All',
            actionLink: '/dashboard/home/referrals',
            color: '#0891B2', // Cyan
            accentClass: 'accent-cyan'
        },
        {
            id: 'meetings-attended',
            title: 'Meetings Attended',
            value: stats.meetingsAttended,
            icon: <img src="/meetings-attended-icon.png" alt="Meetings Attended" className="kpi-img-icon" />,
            action: 'View History',
            actionLink: '/dashboard/home/events',
            color: '#DC2626', // Red
            accentClass: 'accent-red'
        },
        {
            id: 'connections',
            title: 'Connections',
            value: stats.connections,
            icon: <img src="/connections-icon.png" alt="Connections" className="kpi-img-icon" />,
            action: 'View Network',
            actionLink: '/dashboard/home/connections',
            color: '#10B981', // Green
            accentClass: 'accent-green'
        }
    ];

    return (
        <div className="kpi-section">
            <h2 className="section-title">Your Business Metrics</h2>
            <div className="kpi-grid">
                {kpis.map(kpi => (
                    <div
                        key={kpi.id}
                        className={`kpi-card ${kpi.accentClass}`}
                        onClick={() => navigate(kpi.actionLink)}
                    >
                        <div className="kpi-top">
                            <div className="kpi-icon-wrapper" style={{ color: kpi.color }}>
                                {typeof kpi.icon === 'string' ? <span className="kpi-emoji">{kpi.icon}</span> : kpi.icon}
                            </div>
                            <h3 className="kpi-title">{kpi.title}</h3>
                        </div>

                        <div className="kpi-metric">{kpi.value}</div>

                        <div className="kpi-footer">
                            <button className="kpi-action-btn" style={{ color: kpi.color }}>
                                {kpi.action} →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
