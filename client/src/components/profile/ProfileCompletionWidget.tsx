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
            const data = await profileService.getCompletion();
            setCompletion(data.completion);
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
                <svg width="80" height="80">
                    <circle
                        cx="40"
                        cy="40"
                        r="35"
                        fill="none"
                        stroke="var(--gray-200)"
                        strokeWidth="6"
                    />
                    <circle
                        cx="40"
                        cy="40"
                        r="35"
                        fill="none"
                        stroke={getCompletionColor()}
                        strokeWidth="6"
                        strokeDasharray={`${2 * Math.PI * 35 * completion / 100} ${2 * Math.PI * 35}`}
                        strokeLinecap="round"
                        transform="rotate(-90 40 40)"
                    />
                </svg>
                <div className="completion-text">
                    <span className="completion-value">{completion}%</span>
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
