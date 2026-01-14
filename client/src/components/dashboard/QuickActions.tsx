import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
    const navigate = useNavigate();
    const actions = [
        {
            title: 'Submit Referral',
            description: 'Send a referral to a member',
            icon: '🔗',
            link: '/dashboard/home/referrals',
            color: '#6D28D9'
        },
        {
            title: 'View Referral Report',
            description: 'Track your referral activity',
            icon: '📊',
            link: '/dashboard/home/referrals',
            color: '#0891B2'
        },
        {
            title: 'Participation Report',
            description: 'See your engagement metrics',
            icon: '📈',
            link: '/dashboard/home/events',
            color: '#059669'
        },
        {
            title: 'Update Profile',
            description: 'Complete your business profile',
            icon: '✏️',
            link: '/dashboard/profile',
            color: '#DC2626'
        }
    ];

    return (
        <div className="quick-actions">
            <h3 className="section-subtitle">Quick Actions</h3>
            <div className="actions-grid">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        className="action-card"
                        style={{ borderLeftColor: action.color }}
                        onClick={() => navigate(action.link)}
                    >
                        <span className="action-icon">{action.icon}</span>
                        <div className="action-content">
                            <h4 className="action-title">{action.title}</h4>
                            <p className="action-description">{action.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
