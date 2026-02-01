import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Gradient removed for white theme, but constant kept if needed for reference or reverting
// const DASHBOARD_GRADIENT = "linear-gradient(135deg, #040008 0%, #270f4a 30%, #260c52 60%, #000000 100%)";

export default function Franchise() {
    return (
        <div className="min-h-screen bg-gray-100 font-dm-sans">

            {/* 1. HERO BANNER */}
            <div className="w-full h-40 lg:h-56 flex items-center justify-center bg-white">
                <h1 className="text-[#270f4a] text-2xl lg:text-4xl font-light tracking-[0.2em] uppercase">
                    FRANCHISE
                </h1>
            </div>

            {/* 2. SINGLE CONTENT CONTAINER */}
            <div className="w-full px-4 lg:px-8 pb-36">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-5xl mx-auto rounded-none overflow-hidden shadow-2xl px-12 pb-12 pt-7 lg:px-24 lg:pb-24 lg:pt-20 text-center text-black bg-white"
                >
                    {/* SECTION 1: Intro */}
                    <div className="mb-32">
                        <h2 className="text-2xl lg:text-4xl font-bold mb-12 leading-tight">
                            A Network Built to Create <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-black">
                                Real Business Opportunities
                            </span>
                        </h2>
                        <div className="max-w-2xl mx-auto space-y-6 text-base lg:text-lg text-gray-600 font-light leading-relaxed">
                            <p>
                                CSN (Connect • Support • Network) is a modern business networking platform designed to help entrepreneurs, professionals, and local businesses grow through structured connections, collaboration, and trust-driven referrals.
                            </p>
                            <p className="font-medium text-gray-900">
                                CSN empowers its franchise partners to build strong local business communities while creating a sustainable, scalable business model of their own.
                            </p>
                        </div>
                    </div>

                    <div className="h-36 w-full"></div>

                    {/* SECTION 2: Impact */}
                    <div className="mb-32">
                        <div className="h-px w-24 bg-gray-200 mx-auto mb-24"></div>
                        <h3 className="text-xl lg:text-3xl font-bold mb-14">
                            A Business That Creates Impact
                        </h3>
                        <div className="max-w-2xl mx-auto text-base lg:text-lg text-gray-600 font-light leading-relaxed space-y-10">
                            <p>
                                CSN was created to solve a problem faced by almost every professional today:
                            </p>
                            <div className="inline-block border-l-2 border-[#a78bfa] pl-8 py-1 text-left max-w-lg mx-auto">
                                <p className="text-gray-900 text-xl lg:text-2xl italic font-serif">
                                    “How do I consistently generate quality business opportunities through genuine connections?”
                                </p>
                            </div>
                            <p>
                                By combining technology, structured networking, and community leadership, CSN enables members to form meaningful professional relationships that translate into measurable business growth.
                            </p>
                            <p className="text-gray-900 font-medium">
                                As a CSN Franchise Partner, you don’t just manage a network—you lead a business ecosystem.
                            </p>
                        </div>
                    </div>

                    <div className="h-36 w-full"></div>

                    {/* SECTION 3: Why Choose */}
                    <div>
                        <div className="h-px w-20 bg-gray-200 mx-auto mb-20"></div>
                        <h3 className="text-xl lg:text-3xl font-bold mb-24">
                            Why Choose a CSN Franchise?
                        </h3>

                        <div className="flex flex-wrap justify-center gap-8 text-center">

                            {/* Card 1 */}
                            <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-200 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center w-64 h-64">
                                <h4 className="text-base font-bold text-gray-900 mb-2 leading-tight">Proven Community-Driven Model</h4>
                                <p className="text-xs text-gray-500 leading-relaxed max-w-[90%]">
                                    CSN chapters are built around curated members, structured interactions, and accountability.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-200 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center w-64 h-64">
                                <h4 className="text-base font-bold text-gray-900 mb-2 leading-tight">Low Operational Overhead</h4>
                                <p className="text-xs text-gray-500 mb-3 max-w-[90%]">
                                    No heavy infrastructure. Powered by:
                                </p>
                                <ul className="text-xs text-gray-600 space-y-1 flex flex-col items-center">
                                    <li className="flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-purple-600"></span>
                                        <span>Digital tools</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-purple-600"></span>
                                        <span>Local leadership</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-purple-600"></span>
                                        <span>Structured processes</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-200 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center w-64 h-64">
                                <h4 className="text-base font-bold text-gray-900 mb-2 leading-tight">Scalable Growth</h4>
                                <p className="text-xs text-gray-500 leading-relaxed max-w-[90%]">
                                    As your chapter grows, so does your reach, revenue, and influence. Expand across multiple locations.
                                </p>
                            </div>

                            {/* Card 4 */}
                            <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-200 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center w-64 h-64">
                                <h4 className="text-base font-bold text-gray-900 mb-2 leading-tight">Technology-Backed Platform</h4>
                                <p className="text-xs text-gray-500 mb-3 max-w-[90%]">
                                    CSN provides:
                                </p>
                                <ul className="text-xs text-gray-600 space-y-1 flex flex-col items-center">
                                    <li className="flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-purple-600"></span>
                                        <span>Lead tracking</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-purple-600"></span>
                                        <span>Meeting workflows</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-purple-600"></span>
                                        <span>Engagement tools</span>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>

                </motion.div>
            </div>

            {/* 3. CTA SECTION */}
            <div className="w-full py-28 text-center bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-14 tracking-tight">
                        Ready to Lead Your Ecosystem?
                    </h2>
                    <Link
                        to="/franchise/apply"
                        className="inline-flex items-center justify-center px-24 py-8 bg-gradient-to-r from-[#1a0536] to-[#450a6b] text-white font-bold text-2xl rounded-none hover:opacity-90 transition-all shadow-xl transform hover:-translate-y-1"
                    >
                        Apply For Franchise
                    </Link>
                </div>
            </div>

        </div>
    );
}
