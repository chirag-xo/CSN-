interface ProfileHeaderProps {
    firstName: string;
    lastName: string;
    photoUrl: string | null;
    company: string | null;
    position: string | null;
    location: string | null;
    emailVerified: boolean;
    communityVerified: boolean;
    vouchCount: number;
    chapterName?: string;
}

export default function PublicProfileHeader({
    firstName,
    lastName,
    photoUrl,
    company,
    position,
    location,
    emailVerified,
    communityVerified,
    vouchCount,
    chapterName,
}: ProfileHeaderProps) {
    const fullName = `${firstName} ${lastName}`;
    const initials = `${firstName[0]}${lastName[0]}`;

    const getFullPhotoUrl = (url: string | null): string | null => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${url}`;
    };

    return (
        <div className="profile-header-card">
            {/* Profile Photo */}
            <div className="profile-photo-large">
                <img
                    src={
                        photoUrl
                            ? photoUrl.startsWith('http')
                                ? photoUrl
                                : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${photoUrl}`
                            : `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=6D28D9&color=fff`
                    }
                    alt={fullName}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=6D28D9&color=fff`;
                    }}
                />
            </div>

            {/* Basic Info */}
            <div className="profile-basic-info">
                <h1 className="profile-name">{fullName}</h1>

                {(position || company) && (
                    <p className="profile-position">
                        {position}
                        {position && company && ' @ '}
                        {company}
                    </p>
                )}

                {location && (
                    <p className="profile-location">
                        📍 {location}
                    </p>
                )}

                {chapterName && (
                    <p className="profile-chapter">
                        🏢 {chapterName}
                    </p>
                )}

                {/* Verification Badges */}
                <div className="verification-badges">
                    {emailVerified && (
                        <span className="badge verified">✓ Email Verified</span>
                    )}
                    {communityVerified && (
                        <span className="badge community-verified">
                            ⭐ Community Verified
                        </span>
                    )}
                    {vouchCount > 0 && (
                        <span className="badge vouch-count">
                            {vouchCount} {vouchCount === 1 ? 'Vouch' : 'Vouches'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
