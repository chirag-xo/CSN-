import { useState, useEffect } from 'react';
import '../styles/dashboardHome.css';
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';
import KPICards from '../components/dashboard/KPICards';
import QuickActions from '../components/dashboard/QuickActions';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';
import ProfileCompletion from '../components/dashboard/ProfileCompletion';
import dashboardService from '../services/dashboardService';
import type { DashboardSummary } from '../services/dashboardService';

export default function DashboardHome() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const data = await dashboardService.getSummary();
                setDashboardData(data);
            } catch (err: any) {
                console.error('Error fetching dashboard data:', err);
                setError(err.response?.data?.error || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-home">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error || !dashboardData) {
        return (
            <div className="dashboard-home">
                <div className="error-container">
                    <p className="error-message">{error || 'Failed to load dashboard'}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-home">
            <TopBar />

            <div className="dashboard-layout">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />

                <main className="dashboard-main">
                    {/* Greeting Section */}
                    <div className="greeting-section">
                        <h1>Hello, {dashboardData.user.name}</h1>
                        <div className="context-info">
                            <span className="chapter-badge">{dashboardData.user.chapter}</span>
                            <span className="city-badge">{dashboardData.user.city}</span>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <KPICards stats={{ ...dashboardData.stats, connections: 0 }} />

                    {/* Two Column Layout */}
                    <div className="content-grid">
                        <div className="left-column">
                            <QuickActions />
                            <ProfileCompletion completion={dashboardData.profileCompletion} />
                        </div>

                        <div className="right-column">
                            <UpcomingEvents events={dashboardData.upcomingEvents} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
