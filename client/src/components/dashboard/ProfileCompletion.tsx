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
                console.log("✅ Profile completion API response:", res);

                const payload = res?.data || res;

                const percentage =
                    payload?.completionPercentage ??
                    payload?.completion ??
                    res?.completionPercentage ??
                    res?.completion ??
                    0;

                console.log("📊 Parsed percentage:", percentage);

                setCompletionData({
                    ...payload,
                    completionPercentage: Number(percentage),
                });
            } catch (err: any) {
                console.error("❌ Error fetching profile completion:", err);

                const errorMsg =
                    err.response?.data?.error?.message ||
                    err.response?.data?.message ||
                    "Failed to load profile completion";

                setError(errorMsg);

                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        // Fetch on mount
        fetchCompletion();

        // Listen for profile updates to refresh dynamically
        const handleProfileUpdate = () => {
            setLoading(true);
            fetchCompletion();
        };

        window.addEventListener("profile-updated", handleProfileUpdate);
        return () => window.removeEventListener("profile-updated", handleProfileUpdate);
    }, []);

    if (loading) {
        return (
            <div className="profile-completion">
                <h3 className="section-subtitle">Profile Optimization</h3>
                <div className="completion-card">
                    <div className="loading-skeleton">Loading...</div>
                </div>
            </div>
        );
    }

    const percentage = completionData?.completionPercentage || legacyCompletion || 0;
    const missing = completionData?.missing || [];
    const suggestions = completionData?.suggestions || [];

    // Determine color based on completion percentage
    const getProgressColor = (pct: number) => {
        if (pct >= 70) return '#6D28D9'; // Purple
        if (pct >= 40) return '#F59E0B'; // Orange
        return '#DC2626'; // Red
    };

    const progressColor = getProgressColor(percentage);

    // Get top priority items (max 3)
    const topMissing = missing.slice(0, 3);

    // Smart CTA routing
    const handleCTA = () => {
        if (percentage === 100) {
            navigate('/profile');
            return;
        }

        // Route to highest priority missing item
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
        <div className="profile-completion">
            <h3 className="section-subtitle">Profile Optimization</h3>

            <div className="completion-card">
                {/* Progress Circle */}
                <div className="progress-circle">
                    <svg width="120" height="120">
                        <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="10"
                        />
                        <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke={progressColor}
                            strokeWidth="10"
                            strokeDasharray={`${2 * Math.PI * 50}`}
                            strokeDashoffset={`${2 * Math.PI * 50 * (1 - percentage / 100)}`}
                            transform="rotate(-90 60 60)"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="progress-text">
                        <span className="progress-value">{percentage}%</span>
                        <span className="progress-label">Complete</span>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="missing-fields">
                    {percentage === 100 ? (
                        <div className="completion-celebration">
                            <h4 className="celebration-title">🎉 Profile Complete!</h4>
                            <p className="celebration-text">Your profile looks amazing</p>
                        </div>
                    ) : (
                        <>
                            <h4 className="missing-title">Complete your profile to:</h4>
                            <ul className="missing-list">
                                <li>🔍 Appear in more searches</li>
                                <li>🤝 Get better referrals</li>
                                <li>⭐ Build trust faster</li>
                            </ul>

                            {/* Top Missing Items with Fix Now buttons */}
                            {topMissing.length > 0 && (
                                <div className="missing-items-list">
                                    <p className="missing-label">Missing:</p>
                                    {topMissing.map((item) => (
                                        <div key={item.key} className="missing-item-row">
                                            <span className="missing-badge">
                                                {item.label} ({item.points} pts)
                                            </span>
                                            <button
                                                className="fix-now-btn"
                                                onClick={() => handleFixNow(item.route)}
                                            >
                                                Fix Now →
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Suggestions */}
                            {suggestions.length > 0 && (
                                <div className="suggestions">
                                    {suggestions.slice(0, 2).map((suggestion, idx) => (
                                        <p key={idx} className="suggestion-text">
                                            💡 {suggestion}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* CTA Button */}
                <button className="complete-profile-btn" onClick={handleCTA}>
                    {percentage === 100 ? 'View Profile →' : 'Complete Profile →'}
                </button>
            </div>
        </div>
    );
}
