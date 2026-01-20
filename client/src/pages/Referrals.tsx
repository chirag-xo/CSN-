import { useState, useEffect } from 'react';
import referralService, { type Referral } from '../services/referralService';
import Breadcrumb from '../components/common/Breadcrumb';
import ReferralCard from '../components/referrals/ReferralCard';
import SendReferralModal from '../components/referrals/SendReferralModal';
import KpiCard from '../components/referrals/KpiCard';
import { TrendingUp, CheckCircle, DollarSign, Search, Plus, ArrowRight } from 'lucide-react';
import '../styles/referrals.css';

export default function Referrals() {
    const [activeTab, setActiveTab] = useState<'given' | 'received'>('given');
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONVERTED' | 'CLOSED'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');

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

    // Filter and search referrals
    const filteredReferrals = referrals.filter(ref => {
        // Status filter
        if (statusFilter !== 'ALL' && ref.status !== statusFilter) {
            return false;
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const user = activeTab === 'given' ? ref.toUser : ref.fromUser;
            const matchesName = `${user?.firstName} ${user?.lastName}`.toLowerCase().includes(query);
            const matchesCompany = user?.company?.toLowerCase().includes(query);
            const matchesDescription = ref.description?.toLowerCase().includes(query);

            if (!matchesName && !matchesCompany && !matchesDescription) {
                return false;
            }
        }

        return true;
    });

    const breadcrumbItems = [
        { label: 'Dashboard', path: '/dashboard/home' },
        { label: 'Referrals', path: '/dashboard/home/referrals' },
    ];

    return (
        <div className="referrals-page">
            <Breadcrumb items={breadcrumbItems} />

            {/* Header - Premium Layout */}
            <div className="page-header">
                <div className="page-header-content">
                    <h1>Referrals</h1>
                    <p className="page-header-subtitle">
                        Track referrals you've given and received
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    Send Referral
                </button>
            </div>

            {/* KPI Cards Grid */}
            <div className="referrals-kpi-grid">
                <KpiCard
                    icon={<TrendingUp size={20} />}
                    label="Total Referrals"
                    value={stats.total}
                />
                <KpiCard
                    icon={<CheckCircle size={20} />}
                    label="Converted"
                    value={stats.converted}
                    iconBg="rgba(5, 150, 105, 0.1)"
                />
                <KpiCard
                    icon={<DollarSign size={20} />}
                    label="Total Value"
                    value={`₹${stats.totalValue.toLocaleString()}`}
                    iconBg="rgba(109, 40, 217, 0.1)"
                />
            </div>

            {/* Tabs and Search/Filter */}
            <div className="tabs-container">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'given' ? 'active' : ''}`}
                        onClick={() => setActiveTab('given')}
                    >
                        Given <span className="tab-count">({stats.total})</span>
                    </button>
                    <button
                        className={`tab ${activeTab === 'received' ? 'active' : ''}`}
                        onClick={() => setActiveTab('received')}
                    >
                        Received <span className="tab-count">({referrals.length})</span>
                    </button>
                </div>
            </div>

            {/* Search + Filter Row */}
            <div className="search-filter-row">
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search referrals by name, business, status..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filters">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="filter-select"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONVERTED">Converted</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="filter-select"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="value">Highest Value</option>
                    </select>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={() => fetchReferrals(true)} className="btn-primary">
                        Try Again
                    </button>
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
                    <div className="empty-state-icon">
                        <TrendingUp size={32} />
                    </div>
                    <h3>No referrals yet</h3>
                    <p>
                        {activeTab === 'given'
                            ? 'Start by sending your first referral to a connection'
                            : 'You haven\'t received any referrals yet'}
                    </p>
                    <div className="empty-state-actions">
                        {activeTab === 'given' && (
                            <button className="empty-state-cta" onClick={() => setShowModal(true)}>
                                <Plus size={16} />
                                Send Referral
                            </button>
                        )}
                        <a href="#" className="empty-state-link">
                            Learn how referrals work <ArrowRight size={14} />
                        </a>
                    </div>
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
                        <div className="loading-state">
                            <div className="spinner"></div>
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
