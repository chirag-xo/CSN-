import aboutIllustration from '../../assets/images/about/about-us-illustration.png';

export default function About() {
    return (
        <section id="about" className="about-section">
            {/* About Us Title */}
            <div className="about-header">
                <h2 className="about-title">
                    About <span className="orange-text">Us</span>
                </h2>
            </div>

            {/* Main Content */}
            <div className="about-content">
                <p className="about-description">
                    CNS (Corporate Network System) is a people-centric connecting platform built for professionals navigating the realities of modern corporate life.

                    Behind deadlines, targets, and roles, every professional carries pressure, stress, and ideas that often go unshared. Traditional networks focus on jobs and titles—but real growth and well-being come from genuine human connections. CNS exists to bridge that gap.

                    We bring professionals together based on shared interests, life stages, and experiences—creating opportunities to talk openly, collaborate meaningfully, and step away from routine. Through real-world meetups, social events, and knowledge-driven sessions, CNS encourages people to connect beyond screens and reconnect with themselves.

                    CNS is not just about networking—it’s about building trust, finding support, and creating communities that help professionals relax, grow, and enjoy quality time while progressing in every aspect of life.
                </p>
            </div>

            {/* Our Mission Section */}
            <div className="our-mission">
                <h3 className="mission-subtitle">Our Mission</h3>
                <div className="mission-content">
                    <div className="mission-illustration">
                        <img src={aboutIllustration} alt="Person pointing to mission statement" />
                    </div>
                    <div className="mission-text">
                        <p>
                            Our mission is to humanize corporate life by enabling real connections, shared experiences, and community-driven growth—beyond jobs, beyond titles, and beyond screens.

                            We aim to create a space where professionals can connect honestly, learn together, support one another, and grow faster through meaningful relationships—both personally and professionally.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
