import '../../styles/dashboard.css';

export default function SuggestedConnections() {
    const suggestions = [
        { name: 'Alex Martinez', role: 'Frontend Developer' },
        { name: 'Jessica Lee', role: 'Product Designer' },
        { name: 'David Kim', role: 'CEO at StartupCo' },
        { name: 'Rachel Green', role: 'Marketing Manager' },
    ];

    return (
        <div className="dashboard-card">
            <div className="card-title">Suggested Connections</div>
            {suggestions.map((person, index) => (
                <div key={index} className="connection-item">
                    <div className="connection-avatar"></div>
                    <div className="connection-info">
                        <div className="connection-name">{person.name}</div>
                        <div className="connection-role">{person.role}</div>
                    </div>
                    <button className="connect-btn">Connect</button>
                </div>
            ))}
        </div>
    );
}
