import { useState, useEffect } from 'react';
import '../styles/dashboardHome.css';
import '../styles/dashboardHeader.css';
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';
import KPICards from '../components/dashboard/KPICards';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';
import ProfileCompletion from '../components/dashboard/ProfileCompletion';
import dashboardService from '../services/dashboardService';
import type { DashboardSummary } from '../services/dashboardService';

export default function DashboardHome() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    // Skeleton Component
    const DashboardSkeleton = () => (
        <div className="animate-pulse space-y-8">
            {/* Header Skeleton */}
            <div className="space-y-4">
                <div className="h-10 w-96 bg-gray-200 rounded"></div>
                <div className="flex gap-4">
                    <div className="h-8 w-32 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-32 bg-gray-200 rounded-full"></div>
                </div>
            </div>

            {/* KPI Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>
                ))}
            </div>

            {/* Content Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                <div className="h-96 bg-gray-200 rounded-2xl"></div>
                <div className="h-96 bg-gray-200 rounded-2xl"></div>
            </div>
        </div>
    );

    return (
        <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
            <TopBar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

            {/* Mobile backdrop overlay */}
            {mobileMenuOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                    mobileOpen={mobileMenuOpen}
                    onMobileClose={() => setMobileMenuOpen(false)}
                />

                <main className="flex-1 overflow-y-auto p-6 w-full">
                    {loading ? (
                        <DashboardSkeleton />
                    ) : error || !dashboardData ? (
                        <div className="dashboard-home">
                            <div className="error-container">
                                <p className="error-message">{error || 'Failed to load dashboard'}</p>
                                <button onClick={() => window.location.reload()}>Retry</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Greeting Section (Premium Redesign) */}
                            <div className="dashboard-header">
                                <h1 className="header-greeting">
                                    <span className="greeting-highlight">Hello</span> {dashboardData.user.name}
                                </h1>
                                <div className="header-badges">
                                    <span className="header-badge">
                                        <span className="badge-label">Chapter:</span>
                                        {dashboardData.user.chapter}
                                    </span>
                                    <span className="header-badge">
                                        <span className="badge-label">City:</span>
                                        {dashboardData.user.city}
                                    </span>
                                </div>
                            </div>

                            {/* KPI Cards */}
                            <KPICards stats={dashboardData.stats} />

                            {/* Two Column Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-6">
                                <div className="space-y-6">
                                    <ProfileCompletion completion={dashboardData.profileCompletion} />
                                </div>

                                <div>
                                    <UpcomingEvents events={dashboardData.upcomingEvents} />
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
