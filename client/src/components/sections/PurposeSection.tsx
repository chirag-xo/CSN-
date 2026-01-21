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
        <section id="purpose-section" className="purpose-section">
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
                            CSN brings people together beyond screens through thoughtfully curated events and meetups. From casual social gatherings to meaningful discussions and learning sessions, our events are designed to help professionals relax, connect and grow together.
                        </p>
                        <p>
                            Whether you want to unwind after work, share experiences, learn something new or simply meet like minded people nearby, CSN events create space for real conversations and genuine human connection.
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {eventTypes.map((event) => (
                            <div key={event.number} className="rounded-2xl bg-white/95 p-6 shadow-lg border border-white/20 hover:shadow-xl transition hover:-translate-y-1 h-full flex flex-col">
                                <p className="text-sm font-semibold text-violet-600">{event.number.padStart(2, '0')}</p>
                                <h4 className="mt-2 text-lg font-semibold text-slate-900">{event.title}</h4>
                                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{event.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
