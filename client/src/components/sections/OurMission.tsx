
export default function OurMission() {
    return (
        <section className="our-mission-section">
            <div className="our-mission-container">
                {/* Left Column - Text Content */}
                <div className="mission-text-column">
                    {/* Section Title */}
                    <h3 className="mission-section-title">Our Focus is Simple</h3>

                    {/* Main Headline */}
                    <h2 className="mission-headline">
                        Connecting people, not just careers.
                    </h2>

                    {/* Supporting Text Box */}
                    <div className="mission-text-box">
                        <p>
                            Our mission is to create a safe, people first platform where professionals can connect honestly, share experiences, and grow together both online and in real life.
                        </p>
                        <p>
                            We believe that growth is stronger through relationships, that well-being matters as much as success, and that meaningful connections can transform careers, communities, and everyday life.
                        </p>
                        <p>
                            CSN exists to help professionals relax, learn, connect, and thrive at every stage of life.
                        </p>
                    </div>
                </div>

                {/* Right Column - Image */}
                <div className="mission-image-column">
                    <img src="/focus.jpg" alt="Main Illustration" className="mission-main-image" />
                </div>
            </div>
        </section>
    );
}
