interface Invitation {
    id: string;
    name: string;
    title: string;
    mutualConnections: string;
    avatar: string;
    verified?: boolean;
}

interface InvitationCardProps {
    invitation: Invitation;
    onAccept: (id: string) => void;
    onIgnore: (id: string) => void;
}

export default function InvitationCard({ invitation, onAccept, onIgnore }: InvitationCardProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="invitation-card">
            <div className="invitation-header">
                <div className="invitation-avatar">
                    {invitation.avatar ? (
                        <img src={invitation.avatar} alt={invitation.name} />
                    ) : (
                        <div className="avatar-placeholder">
                            {getInitials(invitation.name)}
                        </div>
                    )}
                </div>

                <div className="invitation-info">
                    <div className="invitation-name">
                        {invitation.name}
                        {invitation.verified && (
                            <svg className="verified-badge" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        )}
                    </div>
                    <div className="invitation-title">{invitation.title}</div>
                    <div className="invitation-mutual">
                        <svg className="mutual-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 1c-2 0-6 1-6 3v1h12v-1c0-2-4-3-6-3z" />
                        </svg>
                        {invitation.mutualConnections}
                    </div>
                </div>
            </div>

            <div className="invitation-actions">
                <button
                    className="btn-ignore"
                    onClick={() => onIgnore(invitation.id)}
                >
                    Ignore
                </button>
                <button
                    className="btn-accept"
                    onClick={() => onAccept(invitation.id)}
                >
                    Accept
                </button>
            </div>
        </div>
    );
}
