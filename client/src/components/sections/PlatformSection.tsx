export default function PlatformSection() {
    return (
        <section className="platform-section">
            <div className="platform-dark-container">
                {/* Left side - Image */}
                <div className="platform-left">
                    <img src="/platform.jpg" alt="Platform" className="platform-image" />
                </div>

                {/* Right side - Text Content */}
                <div className="platform-right">
                    {/* Main Headline */}
                    <h2 className="platform-headline">
                        A platform built for people, not just professionals.
                    </h2>

                    {/* Supporting Content */}
                    <div className="platform-content">

                        <p>
                            We create a space where individuals can connect through shared interests, experiences and life stages not just roles or titles. Whether it's talking openly about everyday challenges, meeting like minded people, or stepping out to unwind at nearby events, CNS encourages connections that feel real and human.
                        </p>
                        <p>
                            By bringing professionals together both online and in real life, CNS helps people relax, share, learn and grow personally, socially and professionally.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
