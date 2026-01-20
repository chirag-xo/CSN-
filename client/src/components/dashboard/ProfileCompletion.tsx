import React from 'react';
import { useNavigate } from 'react-router-dom';
import profileService from '../../services/profileService';

interface MissingItem {
    key: string;
    label: string;
    points: number;
    route?: string;
}

interface ProfileCompletionData {
    completionPercentage: number;
    totalPoints: number;
    earnedPoints: number;
    completed: string[];
    missing: MissingItem[];
    suggestions: string[];
}

interface ProfileCompletionProps {
    completion?: number; // Legacy prop for backward compatibility
}

export default function ProfileCompletion({ completion: legacyCompletion }: ProfileCompletionProps) {
    const navigate = useNavigate();
    const [completionData, setCompletionData] = React.useState<ProfileCompletionData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchCompletion = async () => {
            try {
                setError(null);
                const res = await profileService.getCompletion();
                const payload = res?.data || res;
                const percentage =
                    payload?.completionPercentage ??
                    payload?.completion ??
                    res?.completionPercentage ??
                    res?.completion ??
                    0;

                setCompletionData({
                    ...payload,
                    completionPercentage: Number(percentage),
                });
            } catch (err: any) {
                console.error("❌ Error fetching profile completion:", err);
                const errorMsg = err.response?.data?.message || "Failed to load profile completion";
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchCompletion();
        const handleProfileUpdate = () => {
            setLoading(true);
            fetchCompletion();
        };
        window.addEventListener("profile-updated", handleProfileUpdate);
        return () => window.removeEventListener("profile-updated", handleProfileUpdate);
    }, []);

    if (loading) {
        return (
            <div className="profile-completion-section">
                <h3 className="section-title">Profile Optimization</h3>
                <div className="profile-completion-card">
                    <div className="loading-skeleton">Loading...</div>
                </div>
            </div>
        );
    }

    const percentage = completionData?.completionPercentage || legacyCompletion || 0;
    const missing = completionData?.missing || [];
    // Prioritize missing items for display
    const topMissing = missing.slice(0, 3); // Show max 3 items

    // Determine color based on completion percentage for ring stroke
    const getProgressColor = (pct: number) => {
        if (pct >= 80) return '#10B981'; // Green
        if (pct >= 50) return '#6D28D9'; // Purple
        return '#F59E0B'; // Orange
    };

    const progressColor = getProgressColor(percentage);

    const handleCTA = () => {
        if (percentage === 100) {
            navigate('/profile');
            return;
        }
        if (topMissing.length > 0 && topMissing[0].route) {
            navigate(topMissing[0].route);
        } else {
            navigate('/dashboard/profile');
        }
    };

    const handleFixNow = (route?: string) => {
        if (route) {
            navigate(route);
        }
    };

    return (
        <div className="profile-completion-section">
            {/* Matching KPI section styling */}
            <h3 className="section-title" style={{ fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '16px' }}>
                Profile Optimization
            </h3>

            <div className="profile-completion-card">
                {/* Header Grid: Info + Ring */}
                <div className="pc-grid-layout">
                    {/* Left Side: Info */}
                    <div className="pc-content">
                        <div className="pc-title-group">
                            <h4>Complete your profile</h4>
                            <p className="pc-subtitle">
                                A complete profile increases visibility and trust by <strong>3x</strong>.
                            </p>
                        </div>

                        {percentage === 100 ? (
                            <div className="text-green-600 font-medium text-sm">
                                🎉 Your profile is fully optimized!
                            </div>
                        ) : (
                            <ul className="pc-benefits-list">
                                <li className="pc-benefit-item">
                                    <span className="pc-benefit-icon">🔍</span> Appear in more searches
                                </li>
                                <li className="pc-benefit-item">
                                    <span className="pc-benefit-icon">🤝</span> Get quality referrals
                                </li>
                                <li className="pc-benefit-item">
                                    <span className="pc-benefit-icon">⭐</span> Build immediate trust
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Right Side: Circular Progress */}
                    <div className="pc-progress-wrapper">
                        <svg width="120" height="120">
                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                stroke="#F3F4F6"
                                strokeWidth="8"
                            />
                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                stroke={progressColor}
                                strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 50}`}
                                strokeDashoffset={`${2 * Math.PI * 50 * (1 - percentage / 100)}`}
                                transform="rotate(-90 60 60)"
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                            />
                        </svg>
                        <div className="pc-progress-text">
                            <span className="pc-percent" style={{ color: progressColor }}>{percentage}%</span>
                            <span className="pc-label">Complete</span>
                        </div>
                    </div>
                </div>

                {/* Missing Items List - Only if not 100% */}
                {percentage < 100 && topMissing.length > 0 && (
                    <div className="pc-missing-list">
                        <div className="pc-missing-header">Action Required</div>
                        {topMissing.map((item) => (
                            <div key={item.key} className="pc-missing-row">
                                <div className="pc-item-info">
                                    <span className="pc-item-label">{item.label}</span>
                                    <span className="pc-item-points">+{item.points} Points Weight</span>
                                </div>
                                <button
                                    className="pc-fix-btn"
                                    onClick={() => handleFixNow(item.route)}
                                >
                                    Fix Now →
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Sticky Footer CTA */}
                <div className="pc-footer">
                    <button className="pc-cta-btn" onClick={handleCTA}>
                        {percentage === 100 ? 'View Public Profile' : 'Complete Profile →'}
                    </button>
                </div>
            </div>
        </div>
    );
}
