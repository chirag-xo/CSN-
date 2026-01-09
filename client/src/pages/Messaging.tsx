import DashboardNav from '../components/dashboard/DashboardNav';
import '../styles/dashboard.css';

export default function Messaging() {
    return (
        <div className="dashboard-container">
            <DashboardNav />

            <div className="dashboard-layout">
                <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: 'var(--text-secondary)'
                }}>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '12px'
                    }}>
                        Messaging
                    </h1>
                    <p>Coming soon...</p>
                </div>
            </div>
        </div>
    );
}
