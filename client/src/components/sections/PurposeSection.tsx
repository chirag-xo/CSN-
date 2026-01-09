export default function PurposeSection() {
    const eventTypes = [
        {
            number: "1",
            title: "Social Meetups",
            description: "Relaxed gatherings to unwind, socialize and take a break from everyday corporate stress."
        },
        {
            number: "2",
            title: "Intercity Meetups",
            description: "Connect with professionals from different cities, cultures and perspectives broadening both networks and mindset."
        },
        {
            number: "3",
            title: "Discussions & Conversations",
            description: "Safe spaces to talk about work challenges, life experiences, ideas and opportunities without judgment."
        },
        {
            number: "4",
            title: "Learning & Training Sessions",
            description: "Workshops, talks and skill building sessions led by experienced professionals and community members."
        }
    ];

    return (
        <section className="purpose-section">
            {/* Dark Container with Gradient */}
            <div className="purpose-dark-container">
                <div className="purpose-content-wrapper">
                    {/* Main Headline */}
                    <h2 className="purpose-headline">
                        Where online connections turn into real experiences.
                    </h2>

                    {/* Supporting Text */}
                    <div className="purpose-description">
                        <p>
                            CNS brings people together beyond screens through thoughtfully curated events and meetups. From casual social gatherings to meaningful discussions and learning sessions, our events are designed to help professionals relax, connect and grow together.
                        </p>
                        <p>
                            Whether you want to unwind after work, share experiences, learn something new or simply meet like minded people nearby, CNS events create space for real conversations and genuine human connection.
                        </p>
                    </div>

                    {/* Image */}
                    <div className="purpose-image-container">
                        <img src="/purpose.jpg" alt="Purpose" className="purpose-image" />
                    </div>
                </div>

                {/* Events Section - Inside Dark Container */}
                <div className="events-section">
                    <h3 className="events-title">Types of Events</h3>

                    <div className="events-grid">
                        {eventTypes.map((event) => (
                            <div key={event.number} className="event-card">
                                <div className="event-number">{event.number}.</div>
                                <h4 className="event-title">{event.title}</h4>
                                <p className="event-description">{event.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
