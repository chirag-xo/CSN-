import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

export default function Hero() {
    const [heroAnimation, setHeroAnimation] = useState(null);

    useEffect(() => {
        // Fetch the animation from public folder
        fetch('/Networkfriends.json')
            .then(response => response.json())
            .then(data => setHeroAnimation(data))
            .catch(error => console.error('Error loading hero animation:', error));
    }, []);

    return (
        <div className="landing-page">
            {/* Removed the background image grid */}

            {/* Orange CSN */}
            <div className="orange-cns-container">
                <div className="orange-cns-text">CSN</div>
            </div>

            {/* Main Content - Left Side */}
            <main className="main-content">
                <h1 className="main-heading">
                    Connects people through <br /> real shared lifestyle and <br /> professional experiences.
                </h1>

                <p className="subheading">
                    Build real connections with professionals who share your interests and experiences.
                </p>

                <Link to="/signup" className="get-started-button">Get Started</Link>
            </main>

            {/* Animation - Right Side */}
            <div className="hero-animation-container">
                {heroAnimation && (
                    <Lottie
                        animationData={heroAnimation}
                        loop={true}
                        style={{ width: '100%', height: '100%', maxWidth: 900 }}
                    />
                )}
            </div>
        </div>
    );
}
