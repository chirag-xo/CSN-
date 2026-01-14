interface ProfileAboutProps {
    tagline: string | null;
    bio: string | null;
    memberSince: string;
}

export default function ProfileAbout({
    tagline,
    bio,
    memberSince,
}: ProfileAboutProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="profile-card">
            <h3>About</h3>

            {tagline && (
                <p className="profile-tagline">{tagline}</p>
            )}

            {bio && (
                <p className="profile-bio">{bio}</p>
            )}

            {!tagline && !bio && (
                <p className="empty-state">No bio added yet</p>
            )}

            <p className="member-since">
                Member since {formatDate(memberSince)}
            </p>
        </div>
    );
}
