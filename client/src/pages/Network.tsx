import { useState, useEffect } from 'react';
import connectionService, { type Connection, type ConnectionRequest, type ConnectionStats } from '../services/connectionService';
import ConnectionCard from '../components/connections/ConnectionCard';
import PendingRequestCard from '../components/connections/PendingRequestCard';
import SentRequestCard from '../components/connections/SentRequestCard';
import Breadcrumb from '../components/common/Breadcrumb';
import { Search, UserPlus, ArrowRight } from 'lucide-react';
import '../styles/network.css';

type TabType = 'connections' | 'pending' | 'sent';

export default function Network() {
    const [activeTab, setActiveTab] = useState<TabType>('connections');
    const [connections, setConnections] = useState<Connection[]>([]);
    const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([]);
    const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
    const [stats, setStats] = useState<ConnectionStats>({ total: 0, pendingReceived: 0, pendingSent: 0 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');

            const statsData = await connectionService.getStats();
            setStats(statsData);

            if (activeTab === 'connections') {
                const data = await connectionService.getConnections('ACCEPTED', search);
                setConnections(data.data || []);
            } else if (activeTab === 'pending') {
                const data = await connectionService.getPendingRequests();
                setPendingRequests(data.requests);
            } else if (activeTab === 'sent') {
                const data = await connectionService.getSentRequests();
                setSentRequests(data.requests);
            }
        } catch (err: any) {
            console.error('Error fetching connections:', err);
            setError(err.response?.data?.error?.message || 'Failed to load connections');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id: string) => {
        try {
            await connectionService.acceptRequest(id);
            fetchData(); // Refresh all data
        } catch (err: any) {
            alert(err.response?.data?.error?.message || 'Failed to accept request');
        }
    };

    const handleDecline = async (id: string) => {
        try {
            await connectionService.declineRequest(id);
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.error?.message || 'Failed to decline request');
        }
    };

    const handleCancel = async (id: string) => {
        try {
            await connectionService.declineRequest(id);
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.error?.message || 'Failed to cancel request');
        }
    };

    const handleRemove = async (id: string) => {
        if (!confirm('Are you sure you want to remove this connection?')) return;

        try {
            await connectionService.removeConnection(id);
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.error?.message || 'Failed to remove connection');
        }
    };

    const handleSearch = () => {
        if (activeTab === 'connections') {
            fetchData();
        }
    };

    return (
        <div className="network-container">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: 'My Network' }]} />

            {/* Header - Premium Layout */}
            <div className="network-header">
                <div className="network-header-content">
                    <h1>My Network</h1>
                    <p className="network-header-subtitle">
                        Manage your connections and requests
                    </p>
                </div>
                <div className="network-header-right">
                    <div className="network-stats-badge">
                        <span className="stat-number">{stats.total}</span>
                        <span className="stat-label">connections</span>
                    </div>
                    <button className="find-people-btn">
                        <UserPlus size={18} />
                        Find People
                    </button>
                </div>
            </div>

            {/* Tabs - Modern Segmented Control */}
            <div className="network-tabs">
                <button
                    className={`tab ${activeTab === 'connections' ? 'active' : ''}`}
                    onClick={() => setActiveTab('connections')}
                >
                    Connections <span className="tab-count">({stats.total})</span>
                </button>
                <button
                    className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending <span className="tab-count">({stats.pendingReceived})</span>
                </button>
                <button
                    className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sent')}
                >
                    Sent <span className="tab-count">({stats.pendingSent})</span>
                </button>
            </div>

            {/* Search + Filter Row */}
            {activeTab === 'connections' && (
                <div className="network-search-row">
                    <div className="network-search">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, company, role..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="search-input"
                        />
                    </div>
                    <div className="network-filters">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name A-Z</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Content */}
            {loading && (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading...</p>
                </div>
            )}

            {error && (
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={fetchData} className="retry-btn">
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="network-content">
                    {/* Connections Tab */}
                    {activeTab === 'connections' && (
                        <>
                            {(connections?.length ?? 0) === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">
                                        <UserPlus size={32} />
                                    </div>
                                    <h3>No connections yet</h3>
                                    <p>Start building your professional network by connecting with other members</p>
                                    <button className="empty-state-cta">
                                        Find People <ArrowRight size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="connections-list">
                                    {connections?.map((conn) => (
                                        <ConnectionCard
                                            key={conn.id}
                                            connection={conn}
                                            onRemove={() => handleRemove(conn.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* Pending Requests Tab */}
                    {activeTab === 'pending' && (
                        <>
                            {pendingRequests.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">
                                        <UserPlus size={32} />
                                    </div>
                                    <h3>No pending requests</h3>
                                    <p>You have no pending connection requests at the moment</p>
                                </div>
                            ) : (
                                <div className="requests-list">
                                    {pendingRequests.map((req) => (
                                        <PendingRequestCard
                                            key={req.id}
                                            request={req}
                                            onAccept={() => handleAccept(req.id)}
                                            onDecline={() => handleDecline(req.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* Sent Requests Tab */}
                    {activeTab === 'sent' && (
                        <>
                            {sentRequests.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">
                                        <UserPlus size={32} />
                                    </div>
                                    <h3>No sent requests</h3>
                                    <p>You haven't sent any connection requests yet</p>
                                    <button className="empty-state-cta">
                                        Find People <ArrowRight size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="requests-list">
                                    {sentRequests.map((req) => (
                                        <SentRequestCard
                                            key={req.id}
                                            request={req}
                                            onCancel={() => handleCancel(req.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
