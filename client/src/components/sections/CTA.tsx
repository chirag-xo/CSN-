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
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-center w-full mt-4">
                    <Link to="/signup" className="cta-button !mt-0">Join CSN</Link>
                    <Link to="/franchise" className="cta-button !mt-0">Get Franchise</Link>
                </div>
            </div>
        </section>
    );
}
