import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import featureHighFive from '../../assets/images/features/feature-people-highfive.png';
import featureLightbulb from '../../assets/images/features/feature-lightbulb-ideas.png';

const features = [
    {
        id: 1,
        title: "Relax & Unwind",
        text: "Corporate life can be overwhelming. CNS enables social events and casual meetups across cities where professionals can step away from routine, socialize and recharge with like minded people.",
        image: "/card-1.png",
        gradient: 'linear-gradient(135deg,#040008 0%, #2B1156 35%, #3A1A6E 60%, #000000 100%)',
    },
    {
        id: 2,
        title: "Connect in Real Life",
        text: "Move beyond screens. CNS helps professionals share experiences, feelings and ideas and turn online interactions into meaningful real world connections.",
        image: "/card3.png",
        gradient: 'linear-gradient(135deg, #050002 0%, #3A0F1F 35%, #5C1C2F 60%, #000000 100%)',
    },
    {
        id: 3,
        title: "Build Trust & Support",
        text: "CNS helps you form strong, reliable relationships that matter across all stages of life—whether it’s guidance, collaboration, referrals or personal support beyond just jobs.",
        image: featureLightbulb,
        gradient: 'linear-gradient(135deg, #02060F 0%, #0F2F5A 35%, #3A7BD5 60%, #000000 100%)',
    },
    {
        id: 4,
        title: "Grow Through Connections",
        text: "Knowledge sparks growth, but relationships make it real. CNS brings you closer to people across industries and lives—where professional and personal growth truly begins.",
        image: featureHighFive,
        gradient: 'linear-gradient(135deg, #040008 0%, #3A0F3F 35%, #6E1F5C 60%, #000000 100%)',
    },
    {
        id: 5,
        title: "Learn Together",
        text: "Through curated events, training sessions and discussions. CNS enables shared learning with like minded professionals making education practical, social and continuous.",
        image: "/card5.png",
        gradient: 'linear-gradient(135deg, #020808 0%, #0F3F45 35%, #1C6E73 60%, #000000 100%)',
    },
];

export default function Features() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % features.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const getCardStyle = (position: number) => {
        // position: -2, -1, 0 (center), 1, 2
        if (position === 0) {
            // Center card - fully visible
            return {
                rotateY: 0,
                scale: 1,
                x: 0,
                z: 0,
                opacity: 1,
                zIndex: 50,
            };
        } else if (position === -1) {
            // Left card
            return {
                rotateY: 25,
                scale: 0.85,
                x: -280,
                z: -200,
                opacity: 0.6,
                zIndex: 40,
            };
        } else if (position === 1) {
            // Right card
            return {
                rotateY: -25,
                scale: 0.85,
                x: 280,
                z: -200,
                opacity: 0.6,
                zIndex: 40,
            };
        } else if (position === -2) {
            // Far left
            return {
                rotateY: 35,
                scale: 0.7,
                x: -450,
                z: -400,
                opacity: 0.3,
                zIndex: 30,
            };
        } else {
            // Far right
            return {
                rotateY: -35,
                scale: 0.7,
                x: 450,
                z: -400,
                opacity: 0.3,
                zIndex: 30,
            };
        }
    };

    return (
        <section id="features" className="features-3d-section">
            {/* Section Title */}
            <h2 className="features-title">Built around how professionals really live, connect, and grow.</h2>

            {/* Main Headline */}
            <h3 className="features-headline">
                CNS is designed to support professionals beyond work by creating spaces to relax, connect meaningfully, learn continuously and grow through trusted relationships.
            </h3>

            {/* 3D Card Stack */}
            <div className="card-stack-container">
                <div className="card-stack-scene">
                    {[-2, -1, 0, 1, 2].map((offset) => {
                        const index = (currentIndex + offset + features.length) % features.length;
                        const feature = features[index];
                        const style = getCardStyle(offset);
                        const isCenter = offset === 0;

                        return (
                            <motion.div
                                key={`card-${index}`}
                                className={`stack-card ${isCenter ? 'center' : ''}`}
                                style={{
                                    background: feature.gradient,
                                }}
                                animate={{
                                    rotateY: style.rotateY,
                                    scale: style.scale,
                                    x: style.x,
                                    z: style.z,
                                    opacity: style.opacity,
                                }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.4, 0, 0.2, 1],
                                }}
                            >
                                <div className="card-overlay" />
                                <div className="card-inner">
                                    <motion.div
                                        className="card-image-wrapper"
                                        animate={{
                                            scale: isCenter ? 1 : 0.9,
                                        }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <img src={feature.image} alt={feature.title} />
                                    </motion.div>
                                    <motion.div
                                        className="card-text-content"
                                        animate={{
                                            opacity: isCenter ? 1 : 0.5,
                                        }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <h4>{feature.title}</h4>
                                        <p>{feature.text}</p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Navigation Dots */}
                <div className="carousel-dots">
                    {features.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
