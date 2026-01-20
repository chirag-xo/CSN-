import { useState, useEffect } from 'react';
import profileService from '../../services/profileService';

export default function ProfileCompletionWidget() {
    const [completion, setCompletion] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompletion();
    }, []);

    const fetchCompletion = async () => {
        try {
            const result = await profileService.getCompletion();
            // detailed completion endpoint returns data.completionPercentage
            if (result.data && typeof result.data.completionPercentage === 'number') {
                setCompletion(result.data.completionPercentage);
            } else if (result.data && typeof result.data.completion === 'number') {
                // fallback for legacy structure
                setCompletion(result.data.completion);
            } else {
                setCompletion(0);
            }
        } catch (err) {
            console.error('Error fetching completion:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;

    const getCompletionColor = () => {
        if (completion >= 80) return 'var(--green)';
        if (completion >= 50) return 'var(--orange)';
        return 'var(--red)';
    };

    return (
        <div className="completion-widget">
            <div className="completion-circle" style={{ '--completion': completion } as any}>
                <svg width="60" height="60">
                    <circle
                        cx="30"
                        cy="30"
                        r="25"
                        fill="none"
                        stroke="var(--gray-200)"
                        strokeWidth="5"
                    />
                    <circle
                        cx="30"
                        cy="30"
                        r="25"
                        fill="none"
                        stroke={getCompletionColor()}
                        strokeWidth="5"
                        strokeDasharray={`${2 * Math.PI * 25 * completion / 100} ${2 * Math.PI * 25}`}
                        strokeLinecap="round"
                        transform="rotate(-90 30 30)"
                    />
                </svg>
                <div className="completion-text">
                    <span className="completion-value" style={{ fontSize: '14px' }}>{completion}%</span>
                </div>
            </div>
            <div className="completion-info">
                <p className="completion-label">Profile Complete</p>
                {completion < 100 && (
                    <p className="completion-hint">
                        Complete your profile to make better connections
                    </p>
                )}
            </div>
        </div>
    );
}
