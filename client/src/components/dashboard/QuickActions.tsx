import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
    const navigate = useNavigate();
    const actions = [
        {
            title: 'Submit Referral',
            description: 'Send a referral to a member',
            icon: '🔗',
            link: '/dashboard/home/referrals',
            color: '#6D28D9',
            borderColor: 'border-l-purple-600'
        },
        {
            title: 'View Referral Report',
            description: 'Track your referral activity',
            icon: '📊',
            link: '/dashboard/home/referrals',
            color: '#0891B2',
            borderColor: 'border-l-cyan-600'
        },
        {
            title: 'Participation Report',
            description: 'See your engagement metrics',
            icon: '📈',
            link: '/dashboard/home/events',
            color: '#059669',
            borderColor: 'border-l-green-600'
        },
        {
            title: 'Update Profile',
            description: 'Complete your business profile',
            icon: '✏️',
            link: '/dashboard/profile',
            color: '#DC2626',
            borderColor: 'border-l-red-600'
        }
    ];

    return (
        <div className="w-full">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        className={`flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-left border-l-4 ${action.borderColor}`}
                        onClick={() => navigate(action.link)}
                    >
                        <span className="text-2xl">{action.icon}</span>
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">{action.title}</h4>
                            <p className="text-xs text-gray-600">{action.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
