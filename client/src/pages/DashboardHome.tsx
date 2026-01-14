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
        <div className="min-h-screen bg-gray-50">
            <TopBar />

            <div className="flex">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />

                <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                    {/* Greeting Section */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hello, {dashboardData.user.name}</h1>
                        <div className="flex gap-3">
                            <span className="px-4 py-1.5 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg">
                                {dashboardData.user.chapter}
                            </span>
                            <span className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
                                {dashboardData.user.city}
                            </span>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <KPICards stats={{ ...dashboardData.stats, connections: 0 }} />

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-6">
                        <div className="space-y-6">
                            <QuickActions />
                            <ProfileCompletion completion={dashboardData.profileCompletion} />
                        </div>

                        <div>
                            <UpcomingEvents events={dashboardData.upcomingEvents} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
