interface Interest {
    id: string;
    name: string;
    category: string;
    categoryType: string;
    visibility: string;
}

interface ProfileInterestsProps {
    interests: Interest[];
}

export default function ProfileInterests({ interests }: ProfileInterestsProps) {
    if (interests.length === 0) {
        return (
            <div className="profile-card">
                <h3>Interests</h3>
                <p className="empty-state">No public interests</p>
            </div>
        );
    }

    // Group interests by category
    const groupedInterests = interests.reduce((acc, interest) => {
        if (!acc[interest.category]) {
            acc[interest.category] = [];
        }
        acc[interest.category].push(interest);
        return acc;
    }, {} as Record<string, Interest[]>);

    const getVisibilityIcon = (visibility: string) => {
        switch (visibility) {
            case 'PUBLIC':
                return '🌐';
            case 'CONNECTIONS':
                return '👥';
            case 'PRIVATE':
                return '🔒';
            default:
                return '';
        }
    };

    return (
        <div className="profile-card">
            <h3>Interests</h3>

            {Object.entries(groupedInterests).map(([category, categoryInterests]) => (
                <div key={category} className="interest-group">
                    <h4 className="interest-category-title">{category}</h4>
                    <div className="interest-tags">
                        {categoryInterests.map((interest) => (
                            <span key={interest.id} className="interest-tag">
                                {interest.name}
                                <span className="visibility-icon" title={interest.visibility}>
                                    {getVisibilityIcon(interest.visibility)}
                                </span>
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
