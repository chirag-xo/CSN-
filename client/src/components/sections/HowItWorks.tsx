import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

export default function HowItWorks() {
    const [signupAnimation, setSignupAnimation] = useState(null);
    const [networkingAnimation, setNetworkingAnimation] = useState(null);
    const [partnershipAnimation, setPartnershipAnimation] = useState(null);
    const [teamAnimation, setTeamAnimation] = useState(null);

    useEffect(() => {
        // Fetch the animations from public folder
        fetch('/Login or Register.json')
            .then(response => response.json())
            .then(data => setSignupAnimation(data))
            .catch(error => console.error('Error loading Sign Up animation:', error));

        fetch('/Networking For All.json')
            .then(response => response.json())
            .then(data => setNetworkingAnimation(data))
            .catch(error => console.error('Error loading Networking animation:', error));

        fetch('/Partnership.json')
            .then(response => response.json())
            .then(data => setPartnershipAnimation(data))
            .catch(error => console.error('Error loading Partnership animation:', error));

        fetch('/team.json')
            .then(response => response.json())
            .then(data => setTeamAnimation(data))
            .catch(error => console.error('Error loading Team animation:', error));
    }, []);

    const steps = [
        {
            number: "1",
            title: "1. Sign Up",
            description: "Join with your verified work email and create your profile.",
            animation: signupAnimation,
            imageLeft: false // Animation on right
        },
        {
            number: "2",
            title: "2. Explore & Connect",
            description: "Discover professionals, interests and events that resonate with you.",
            animation: networkingAnimation,
            fallbackIcon: "🔍",
            imageLeft: true // Animation on left
        },
        {
            number: "3",
            title: "3. Meet & Engage",
            description: "Attend events, join conversations and build real relationships.",
            animation: partnershipAnimation,
            fallbackIcon: "🤝",
            imageLeft: false // Animation on right
        },
        {
            number: "4",
            title: "4. Grow Together",
            description: "Share, learn, support and grow through trusted connections.",
            animation: teamAnimation,
            fallbackIcon: "🌱",
            imageLeft: true // Animation on left
        }
    ];

    return (
        <section className="how-it-works-section">
            <div className="how-it-works-container">
                {/* Section Title */}
                <h3 className="how-it-works-title">How it Works</h3>

                {/* Headline */}
                <h2 className="how-it-works-headline">
                    Connecting beyond work is simple.
                </h2>

                {/* Steps List */}
                <div className="steps-list">
                    {steps.map((step) => (
                        <div key={step.number} className={`step-row ${step.imageLeft ? 'image-left' : 'image-right'}`}>
                            {/* Visual Content (Icon/Animation) */}
                            <div className="step-visual">
                                {step.animation ? (
                                    <Lottie
                                        animationData={step.animation}
                                        loop={true}
                                        style={{ width: '100%', height: '100%', maxWidth: 500 }}
                                    />
                                ) : step.icon || step.fallbackIcon ? (
                                    <div className="step-icon-large">{step.icon || step.fallbackIcon}</div>
                                ) : (
                                    <div className="step-icon-large">✨</div>
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="step-text">
                                <div className="step-header">
                                    <h3 className="step-title-large">{step.title}</h3>
                                </div>
                                <p className="step-description-large">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
