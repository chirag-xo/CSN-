import { useRef } from 'react';
import { jsPDF } from 'jspdf';
import { Download, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/terms.css';

export default function TermsOfService() {
    const navigate = useNavigate();
    const contentRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        if (!contentRef.current) return;

        // Create a temporary container for the PDF content
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed'; // Changed from absolute to fixed to ensure it's in viewport
        tempContainer.style.left = '0'; // Changed from -9999px
        tempContainer.style.top = '0';
        tempContainer.style.zIndex = '-9999'; // Hide behind everything
        tempContainer.style.width = '800px'; // Standard A4-ish width for good resolution
        tempContainer.style.padding = '40px';
        tempContainer.style.backgroundColor = '#ffffff';
        tempContainer.style.color = '#000000';
        tempContainer.style.fontFamily = 'Helvetica, Arial, sans-serif';
        tempContainer.style.fontSize = '12px';
        tempContainer.style.lineHeight = '1.6';

        // Add Header
        const headerHtml = `
            <div style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
                <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #000;">Terms of Service</h1>
                <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Last updated: ${new Date().toLocaleDateString()}</p>
            </div>
        `;

        // Clone content and strip/clean classes
        const contentClone = contentRef.current.cloneNode(true) as HTMLElement;

        // Helper to recursively clean styles
        const cleanElements = (element: HTMLElement) => {
            element.removeAttribute('class');
            element.style.color = '#000000';
            element.style.fontFamily = 'Helvetica, sans-serif';

            // Handle lists
            if (element.tagName === 'UL') {
                element.style.paddingLeft = '20px';
                element.style.marginBottom = '10px';
            }
            if (element.tagName === 'LI') {
                element.style.marginBottom = '5px';
            }
            // Handle headings
            if (['H1', 'H2', 'H3', 'H4'].includes(element.tagName)) {
                element.style.marginTop = '20px';
                element.style.marginBottom = '10px';
                element.style.fontWeight = 'bold';
                element.style.color = '#000000';
            }
            // Handle HR
            if (element.tagName === 'HR') {
                element.style.border = 'none';
                element.style.borderTop = '1px solid #ccc';
                element.style.margin = '20px 0';
            }

            // Recursively clean children
            Array.from(element.children).forEach(child => cleanElements(child as HTMLElement));
        };

        cleanElements(contentClone);

        tempContainer.innerHTML = headerHtml;
        tempContainer.appendChild(contentClone);
        document.body.appendChild(tempContainer);

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4'
        });

        try {
            await doc.html(tempContainer, {
                callback: function (doc) {
                    doc.save('CSN-Terms-of-Service.pdf');
                    document.body.removeChild(tempContainer);
                },
                x: 40,
                y: 40,
                width: 515, // A4 text width
                windowWidth: 800 // Matches our temp container width
            });
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
            if (document.body.contains(tempContainer)) {
                document.body.removeChild(tempContainer);
            }
        }
    };

    return (
        <div className="terms-page">
            <div className="terms-container">

                {/* Header Actions */}
                <div className="terms-nav-header">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn-back"
                    >
                        <ChevronLeft size={20} />
                        Back
                    </button>

                    <button
                        onClick={handleDownloadPDF}
                        className="btn-download-primary"
                    >
                        <Download size={18} />
                        Download PDF
                    </button>
                </div>

                {/* Terms Content Card */}
                <div className="terms-card">
                    {/* Header */}
                    <div className="terms-hero">
                        <h1>Terms of Service</h1>
                        <p>Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    {/* Content Body */}
                    <div ref={contentRef} className="terms-content">
                        <div>

                            <h2>CSN (Connect & Share Network) — TERMS OF SERVICE</h2>

                            <p><strong>Effective Date: {new Date().toLocaleDateString()}</strong></p>

                            <p>
                                These Terms of Service ("ToS") govern your access to and use of CSN's services, including our website, mobile app (if applicable), and related services (collectively, the "CSN Sites"). CSN ("CSN," "we," "our," or "us") provides a platform designed to help users connect with people through real shared lifestyle and professional experiences, including networking, events, and community interactions.
                            </p>

                            <p>
                                The CSN Sites include CSN's related websites, SMS, APIs, email notifications, applications (web and/or mobile), buttons, widgets, and any other related services that can be accessed via our CSN Sites or that link to these ToS (collectively, the "Services"), and any information, text, links, graphics, photos, videos, or other materials uploaded, downloaded, or appearing on the Services (collectively referred to as "Content").
                            </p>

                            <p>
                                By using CSN Sites and Services, you agree to be bound by these ToS. These ToS may be updated from time to time. If you do not agree with these ToS, you must not use the Services.
                            </p>

                            <hr />

                            <h3>1. Who May Use the Services</h3>
                            <p><strong>Eligibility for Using the Services</strong></p>
                            <p>You are eligible to use the CSN Sites and Services if you meet the following conditions:</p>
                            <ul>
                                <li>(i) You are capable of entering into binding agreements under the laws of your jurisdiction.</li>
                                <li>(ii) You comply with these ToS.</li>
                                <li>(iii) You have created a CSN account and maintain it in good standing (if required for specific features).</li>
                            </ul>

                            <p>You may not use the CSN Sites and Services if:</p>
                            <ul>
                                <li>(a) You are legally incapacitated due to mental disability, intoxication, being under the age of 18, or any other reason affecting your ability to enter into contracts; or</li>
                                <li>(b) You are suspended or banned from CSN for violations of these ToS.</li>
                            </ul>

                            <h3>2. Privacy</h3>
                            <p>
                                Our Privacy Policy describes how we collect, use, store, and share information when you use our Services. By using CSN, you acknowledge that your personal data may be collected, used, and managed as described in our Privacy Policy.
                            </p>

                            <h3>3. Content on the Services</h3>
                            <p>
                                You are responsible for your use of the CSN Sites and Services and for any Content you provide, including compliance with all applicable laws, rules, and regulations. Do not submit or send Content unless you are prepared to assume responsibility for it.
                            </p>
                            <p>
                                <strong>Examples of Prohibited Activities:</strong><br />
                                You agree NOT to use the CSN Sites or Services to:
                            </p>
                            <ul>
                                <li>Upload, post, email, transmit, or otherwise make available Content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, hateful, or otherwise objectionable.</li>
                                <li>Impersonate any person or entity or misrepresent your affiliation.</li>
                                <li>Upload or distribute Content you do not have the right to share.</li>
                                <li>Upload malware, viruses, worms, ransomware, spyware, or other harmful code.</li>
                            </ul>

                            <h3>4. Your Rights and Ownership</h3>
                            <p>
                                As a user of CSN, you retain ownership of the Content you create and submit ("User Content"), subject to any third-party rights. By posting or submitting User Content, you grant CSN a worldwide, non-exclusive, royalty-free, transferable, and sublicensable license to host, store, reproduce, modify (for formatting/display purposes), distribute, display, and perform such Content.
                            </p>

                            <h3>5. Using the Services</h3>
                            <p>
                                Your use of the Services must comply with these ToS and all applicable laws. CSN's Services are continually evolving. We may modify, suspend, or discontinue the Services (in whole or in part), temporarily or permanently, at any time, with or without notice.
                            </p>

                            <h3>6. Your Account</h3>
                            <p>
                                To use certain features of CSN, you may need to create an account. You are responsible for safeguarding your account credentials and for all activity occurring under your account. You agree to provide accurate and complete information and keep it updated.
                            </p>

                            <h3>7. Termination</h3>
                            <p>
                                You may stop using CSN at any time by deactivating your account (if available) and discontinuing use of the Services. CSN may suspend or terminate your account at any time for any reason, including violation of these ToS.
                            </p>

                            <h3>8. Third-Party Beneficiaries</h3>
                            <p>
                                These ToS are between you and CSN, not between you and any third-party platform provider (including Apple or Google).
                            </p>

                            <h3>9. Third-Party Services and Integrations</h3>
                            <p>
                                CSN may integrate or link to third-party services. Your use of such third-party services is at your own risk and may be governed by their terms and privacy policies.
                            </p>

                            <h3>10. Additional Terms</h3>
                            <div>
                                <div>
                                    <h4>A. Fees and Payments</h4>
                                    <p>Some CSN features may require payment. You agree to pay all fees and applicable taxes. Prices and availability may change at any time.</p>
                                </div>
                                <div>
                                    <h4>B. No Automated Querying / Scraping</h4>
                                    <p>You may not send automated queries, scrape data, crawl the Services, or use bots without express written permission from CSN.</p>
                                </div>
                                <div>
                                    <h4>D. Intellectual Property</h4>
                                    <p>All CSN branding, trademarks, logos, designs, UI elements, software, and platform functionality are owned by CSN or its licensors.</p>
                                </div>
                                <div>
                                    <h4>F. Indemnity</h4>
                                    <p>You agree to defend, indemnify, and hold harmless CSN from any claims arising out of your use of the Services or violation of these ToS.</p>
                                </div>
                                <div>
                                    <h4>G. Limitation of Liability</h4>
                                    <p>To the maximum extent permitted by law, CSN will not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages.</p>
                                </div>
                            </div>

                            <h3>11. Changes to These Terms</h3>
                            <p>
                                We may update these ToS from time to time. If we make material changes, we will provide reasonable notice by updating the "Effective Date".
                            </p>

                            <h3>12. Contact Information</h3>
                            <p>
                                If you have questions about these Terms of Service, contact us at:<br />
                                <strong>Email:</strong> support@csnworld.com / legal@csnworld.com<br />
                                <strong>Website:</strong> csnworld.com
                            </p>

                            <hr />

                            <div style={{ textAlign: 'center', color: '#6B7280', fontSize: '14px', marginTop: '32px' }}>
                                <p>© 2026 CSN. All rights reserved.</p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Bottom Action */}
                <div className="terms-footer-action">
                    <button
                        onClick={handleDownloadPDF}
                        className="btn-download-secondary"
                    >
                        <Download size={18} />
                        Download PDF Version
                    </button>
                    <p className="terms-footer-note">
                        The downloaded PDF contains the exact same content as displayed on this page.
                    </p>
                </div>

            </div>
        </div>
    );
}
