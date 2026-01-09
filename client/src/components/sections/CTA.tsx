import { Link } from 'react-router-dom';

export default function CTA() {
    return (
        <section className="cta-section">
            <div className="cta-container">
                <h2 className="cta-headline">Start connecting beyond work.</h2>
                <p className="cta-text">
                    Join a growing community of professionals who believe in real conversations,
                    shared experiences and meaningful connections beyond jobs and titles.
                </p>
                <Link to="/signup" className="cta-button">Join CSN</Link>
            </div>
        </section>
    );
}
