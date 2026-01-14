import { useState, useEffect } from 'react';
import connectionService, { type Connection, type ConnectionRequest, type ConnectionStats } from '../services/connectionService';
import ConnectionCard from '../components/connections/ConnectionCard';
import PendingRequestCard from '../components/connections/PendingRequestCard';
import Breadcrumb from '../components/common/Breadcrumb';
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

    const handleRemove = async (id: string) => {
        if (!confirm('Are you sure you want to remove this connection?')) return;

        try {
            await connectionService.removeConnection(id);
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.error?.message || 'Failed to remove connection');
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTab === 'connections') {
            fetchData();
        }
    };

    return (
        <div className="network-container">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: 'Connections' }]} />

            {/* Header */}
            <div className="network-header">
                <h1>My Network</h1>
                <div className="network-stats">
                    <span className="stat">
                        <strong>{stats.total}</strong> connections
                    </span>
                    {stats.pendingReceived > 0 && (
                        <span className="stat badge-pending">
                            {stats.pendingReceived} pending
                        </span>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="network-tabs">
                <button
                    className={`tab ${activeTab === 'connections' ? 'active' : ''}`}
                    onClick={() => setActiveTab('connections')}
                >
                    Connections ({stats.total})
                </button>
                <button
                    className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending ({stats.pendingReceived})
                    {stats.pendingReceived > 0 && <span className="tab-badge">{stats.pendingReceived}</span>}
                </button>
                <button
                    className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sent')}
                >
                    Sent ({stats.pendingSent})
                </button>
            </div>

            {/* Search */}
            {activeTab === 'connections' && (
                <form onSubmit={handleSearch} className="network-search">
                    <input
                        type="text"
                        placeholder="Search connections..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">
                        🔍 Search
                    </button>
                </form>
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
                            {(connections?.length ?? 0) === 0 && (
                                <div className="empty-state">
                                    <h3>No connections yet</h3>
                                    <p>Start connecting with other members!</p>
                                </div>
                            )}
                            <div className="connections-grid">
                                {connections?.map((conn) => (
                                    <ConnectionCard
                                        key={conn.id}
                                        connection={conn}
                                        onRemove={() => handleRemove(conn.id)}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Pending Requests Tab */}
                    {activeTab === 'pending' && (
                        <>
                            {pendingRequests.length === 0 && (
                                <div className="empty-state">
                                    <h3>No pending requests</h3>
                                    <p>You have no pending connection requests</p>
                                </div>
                            )}
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
                        </>
                    )}

                    {/* Sent Requests Tab */}
                    {activeTab === 'sent' && (
                        <>
                            {sentRequests.length === 0 && (
                                <div className="empty-state">
                                    <h3>No sent requests</h3>
                                    <p>You haven't sent any connection requests</p>
                                </div>
                            )}
                            <div className="requests-list">
                                {sentRequests.map((req) => (
                                    <div key={req.id} className="sent-request-card">
                                        <div className="request-user">
                                            <div className="user-avatar">
                                                {req.addressee?.profilePhoto ? (
                                                    <img src={req.addressee.profilePhoto} alt="" />
                                                ) : (
                                                    <div className="avatar-placeholder">
                                                        {req.addressee?.firstName[0]}{req.addressee?.lastName[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="user-info">
                                                <h4>{req.addressee?.firstName} {req.addressee?.lastName}</h4>
                                                <p>{req.addressee?.company}</p>
                                                <span className="request-date">
                                                    Sent {new Date(req.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="status-badge">Pending</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
