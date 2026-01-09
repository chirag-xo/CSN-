import Navbar from '../components/navbar/Navbar';
import Hero from '../components/hero/Hero';
import WhyCNS from '../components/sections/WhyCNS';
import PlatformSection from '../components/sections/PlatformSection';
import Features from '../components/features/Features';
import HowItWorks from '../components/sections/HowItWorks';
import PurposeSection from '../components/sections/PurposeSection';
import OurMission from '../components/sections/OurMission';
import CTA from '../components/sections/CTA';
import Footer from '../components/footer/Footer';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <WhyCNS />
            <PlatformSection />
            <Features />
            <HowItWorks />
            <PurposeSection />
            <OurMission />
            <CTA />
            <Footer />
        </div>
    );
}
