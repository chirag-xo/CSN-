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
        <div className="w-full">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Profile Optimization</h3>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                {/* Progress Circle */}
                <div className="relative w-[120px] h-[120px] mx-auto mb-6">
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
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <span className="block text-3xl font-bold text-purple-600">{percentage}%</span>
                        <span className="text-xs text-gray-600">Complete</span>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="mb-5">
                    {percentage === 100 ? (
                        <div className="text-center py-5">
                            <h4 className="text-lg font-semibold text-green-600 mb-2">🎉 Profile Complete!</h4>
                            <p className="text-sm text-gray-600">Your profile looks amazing</p>
                        </div>
                    ) : (
                        <>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Complete your profile to:</h4>
                            <ul className="space-y-2 mb-4">
                                <li className="text-sm text-gray-700">🔍 Appear in more searches</li>
                                <li className="text-sm text-gray-700">🤝 Get better referrals</li>
                                <li className="text-sm text-gray-700">⭐ Build trust faster</li>
                            </ul>

                            {/* Top Missing Items with Fix Now buttons */}
                            {topMissing.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    <p className="text-sm font-medium text-gray-600 mb-2">Missing:</p>
                                    {topMissing.map((item) => (
                                        <div key={item.key} className="flex items-center justify-between gap-2">
                                            <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-xs text-gray-700">
                                                {item.label} ({item.points} pts)
                                            </span>
                                            <button
                                                className="px-3 py-2 border border-purple-600 text-purple-600 rounded-lg text-xs font-medium hover:bg-purple-50 transition-colors whitespace-nowrap"
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
                                <div className="pt-4 border-t border-gray-200 space-y-2">
                                    {suggestions.slice(0, 2).map((suggestion, idx) => (
                                        <p key={idx} className="text-xs text-gray-600 leading-relaxed">
                                            💡 {suggestion}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* CTA Button */}
                <button
                    className="w-full py-3 text-white rounded-lg text-sm font-semibold transition-colors"
                    style={{
                        backgroundColor: '#6D28D8',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5B21B6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6D28D8')}
                    onClick={handleCTA}
                >
                    {percentage === 100 ? 'View Profile →' : 'Complete Profile →'}
                </button>
            </div>
        </div>
    );
}
