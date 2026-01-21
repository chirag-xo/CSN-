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
                {/* Events Section - Inside Dark Container */}
                {/* Events Section - Inside Dark Container */}
                {/* Events Section - Inside Dark Container */}
                {/* Events Section - Inside Dark Container */}
                {/* 
                <section className="py-16 w-full">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-center text-white text-4xl font-semibold mb-10">
                            Types of Events
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                            {eventTypes.map((e, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl bg-white/95 p-6 shadow-lg border border-white/20 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group flex flex-col"
                                >
                                    <div className="text-violet-600 font-semibold text-sm mb-2">
                                        {String(i + 1).padStart(2, "0")}
                                    </div>

                                    <h3 className="text-gray-900 font-semibold text-lg mb-2">
                                        {e.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                                        {e.description}
                                    </p>

                                    <div className="mt-4 h-[3px] w-0 bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full transition-all duration-300 group-hover:w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                */}
            </div>
        </section>
    );
}
