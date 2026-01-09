import type { Variants } from 'framer-motion';

// Floating animation for images
export const floatVariants: Variants = {
    initial: { y: 0 },
    animate: {
        y: [-20, 0, -20],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Fade in from bottom
export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 60 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

// Fade in from left
export const fadeInLeft: Variants = {
    initial: { opacity: 0, x: -60 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

// Fade in from right
export const fadeInRight: Variants = {
    initial: { opacity: 0, x: 60 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

// Stagger children animation
export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

// Scale on hover
export const hoverScale = {
    whileHover: { scale: 1.05, transition: { duration: 0.2 } }
};

// Glow on hover (for feature boxes)
export const glowOnHover = {
    whileHover: {
        boxShadow: "0 0 30px rgba(255, 106, 0, 0.8), 0 0 60px rgba(255, 106, 0, 0.5)",
        transition: { duration: 0.3 }
    }
};
