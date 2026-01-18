import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import referralService, { type Referral } from '../services/referralService';
import Breadcrumb from '../components/common/Breadcrumb';
import ReferralCard from '../components/referrals/ReferralCard';
import SendReferralModal from '../components/referrals/SendReferralModal';
import '../styles/referrals.css';

export default function Referrals() {
    const [activeTab, setActiveTab] = useState<'given' | 'received'>('given');
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONVERTED' | 'CLOSED'>('ALL');

    // Pagination
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 10;

    useEffect(() => {
        fetchReferrals(true); // true = reset
    }, [activeTab]);

    const fetchReferrals = async (reset: boolean = false) => {
        try {
            setLoading(true);
            setError('');
            const currentOffset = reset ? 0 : offset;

            const response = activeTab === 'given'
                ? await referralService.getReferralsGiven(LIMIT, currentOffset)
                : await referralService.getReferralsReceived(LIMIT, currentOffset);

            if (reset) {
                setReferrals(response.data);
                setOffset(0);
            } else {
                setReferrals([...referrals, ...response.data]);
            }

            setHasMore(response.data.length === LIMIT);
        } catch (err: any) {
            console.error('Failed to fetch referrals:', err);
            setError(err.response?.data?.error?.message || 'Failed to load referrals');
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        const newOffset = offset + LIMIT;
        setOffset(newOffset);
        fetchReferrals(false);
    };

    const handleStatusUpdate = async (referralId: string, status: 'CONVERTED' | 'CLOSED') => {
        try {
            await referralService.updateStatus(referralId, { status });
            // Refresh the list
            fetchReferrals(true);
        } catch (err: any) {
            console.error('Failed to update status:', err);
            alert('Failed to update status. Please try again.');
        }
    };

    const handleModalSuccess = () => {
        setShowModal(false);
        // Refresh given referrals
        if (activeTab === 'given') {
            fetchReferrals(true);
        } else {
            setActiveTab('given');
        }
    };

    // Stats calculation
    const stats = {
        total: referrals.length,
        converted: referrals.filter(r => r.status === 'CONVERTED').length,
        totalValue: referrals
            .filter(r => r.businessValue && r.status === 'CONVERTED')
            .reduce((sum, r) => sum + (r.businessValue || 0), 0),
    };

    // Filter referrals
    const filteredReferrals = statusFilter === 'ALL'
        ? referrals
        : referrals.filter(r => r.status === statusFilter);

    const breadcrumbItems = [
        { label: 'Dashboard', path: '/dashboard/home' },
        { label: 'Referrals', path: '/dashboard/home/referrals' },
    ];

    return (
        <div className="referrals-page">
            <Breadcrumb items={breadcrumbItems} />

            <div className="page-header">
                <h1>
                    <img src="/repeat (1).png" alt="Referrals" style={{ width: '32px', height: '32px', marginRight: '10px', verticalAlign: 'middle' }} />
                    Referrals
                </h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    ➕ Send Referral
                </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-icon">
                        <img src="/totalReferral.png" alt="Total Referrals" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Total Referrals</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <img src="/check-mark.png" alt="Converted" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.converted}</div>
                        <div className="stat-label">Converted</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <img src="/profit.png" alt="Total Value" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">₹{stats.totalValue.toLocaleString()}</div>
                        <div className="stat-label">Total Value</div>
                    </div>
                </div>
            </div>

            {/* Tabs and Filter */}
            <div className="tabs-container">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'given' ? 'active' : ''}`}
                        onClick={() => setActiveTab('given')}
                    >
                        Given
                    </button>
                    <button
                        className={`tab ${activeTab === 'received' ? 'active' : ''}`}
                        onClick={() => setActiveTab('received')}
                    >
                        Received
                    </button>
                </div>
                <div className="filter-container">
                    <label>Filter:</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                        <option value="ALL">All</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONVERTED">Converted</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="error-state">
                    <div className="error-icon">⚠️</div>
                    <p>{error}</p>
                    <button onClick={() => fetchReferrals(true)}>Retry</button>
                </div>
            )}

            {/* Loading State */}
            {loading && offset === 0 && (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading referrals...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredReferrals.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No referrals yet</h3>
                    <p>
                        {activeTab === 'given'
                            ? 'Start by sending your first referral to a connection'
                            : 'You haven\'t received any referrals yet'}
                    </p>
                    {activeTab === 'given' && (
                        <button className="btn-primary" onClick={() => setShowModal(true)}>
                            ➕ Send Referral
                        </button>
                    )}
                </div>
            )}

            {/* Referrals List */}
            {!loading && !error && filteredReferrals.length > 0 && (
                <div className="referrals-list">
                    {filteredReferrals.map((referral) => (
                        <ReferralCard
                            key={referral.id}
                            referral={referral}
                            isReceived={activeTab === 'received'}
                            onStatusUpdate={handleStatusUpdate}
                        />
                    ))}

                    {/* Load More Button */}
                    {hasMore && !loading && (
                        <button className="load-more-btn" onClick={loadMore}>
                            Load More
                        </button>
                    )}

                    {loading && offset > 0 && (
                        <div className="loading-more">
                            <div className="spinner-small"></div>
                            <p>Loading more...</p>
                        </div>
                    )}
                </div>
            )}

            {/* Send Referral Modal */}
            <SendReferralModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={handleModalSuccess}
            />
        </div>
    );
}
