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
            color: '#6D28D9',
            borderColor: 'border-l-purple-600'
        },
        {
            id: 'referrals-received',
            title: 'Referrals Received',
            value: stats.referralsReceived,
            icon: '📥',
            action: 'View All',
            actionLink: '/dashboard/home/referrals',
            color: '#0891B2',
            borderColor: 'border-l-cyan-600'
        },
        {
            id: 'meetings-attended',
            title: 'Meetings Attended',
            value: stats.meetingsAttended,
            icon: '🎯',
            action: 'View History',
            actionLink: '/dashboard/home/events',
            color: '#DC2626',
            borderColor: 'border-l-red-600'
        },
        {
            id: 'connections',
            title: 'Connections',
            value: stats.connections,
            icon: <img src="/add-friend.png" alt="Connections" style={{ width: '24px', height: '24px' }} />,
            action: 'View Network',
            actionLink: '/dashboard/home/connections',
            color: '#10B981',
            borderColor: 'border-l-green-600'
        }
    ];

    return (
        <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Your Business Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map(kpi => (
                    <div
                        key={kpi.id}
                        className={`bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between min-h-[160px] border-l-4 ${kpi.borderColor}`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{kpi.icon}</span>
                            <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
                        </div>
                        <div className="text-4xl font-bold text-gray-900 mb-4">{kpi.value}</div>
                        <button
                            className="text-sm font-semibold transition-opacity hover:opacity-75"
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
