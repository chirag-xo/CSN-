import '../../styles/dashboard.css';

export default function EventsCard() {
    const upcomingEvents = [
        { date: 'Jan 15', title: 'Tech Networking Mixer' },
        { date: 'Jan 20', title: 'Product Launch Event' },
        { date: 'Jan 25', title: 'Industry Conference 2026' },
    ];

    return (
        <div className="dashboard-card">
            <div className="card-title">Events</div>
            {upcomingEvents.map((event, index) => (
                <div key={index} className="event-item">
                    <div className="event-date">{event.date}</div>
                    <div className="event-title">{event.title}</div>
                </div>
            ))}
            <a href="#" className="discover-link">+ Discover more events</a>
        </div>
    );
}
