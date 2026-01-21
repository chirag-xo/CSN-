import { useRef } from 'react';
import { jsPDF } from 'jspdf';
import { Download, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/terms.css';

export default function PrivacyPolicy() {
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
                <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #000;">Privacy Policy</h1>
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
                    doc.save('CSN-Privacy-Policy.pdf');
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

                {/* Content Card */}
                <div className="terms-card">
                    {/* Header */}
                    <div className="terms-hero">
                        <h1>Data Protection & Privacy Policy</h1>
                        <p>Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    {/* Content Body */}
                    <div ref={contentRef} className="terms-content">
                        <div>
                            <h2>CSN Data Protection & Privacy Policy</h2>
                            <p><strong>Effective / Last Updated: {new Date().toLocaleDateString()}</strong></p>

                            <p>
                                This Data Protection & Privacy Policy ("Policy") explains how CSN ("CSN", "we", "our", "us") collects, uses, shares, and protects your personal information when you use our website, services, and applications (collectively, the "Services").
                            </p>
                            <p>
                                This Policy also explains your privacy rights and how you can contact us if you have questions or concerns.
                            </p>

                            <hr />

                            <h3>1. Who We Are (Data Controller)</h3>
                            <p>
                                CSN is the controller of your personal data for the purposes described in this Policy. In some cases, our affiliated entities, contractors, or service providers may process data on our behalf as processors, or in limited cases as independent controllers (for example, payment providers or third-party authentication providers). Where required, we will identify the relevant controller at the point of collection.
                            </p>

                            <h3>2. Scope of This Policy</h3>
                            <p>This Policy applies when you:</p>
                            <ul>
                                <li>Visit our website</li>
                                <li>Create or manage a CSN account</li>
                                <li>Use community features (events, networking, profiles, connections, referrals, messaging, etc.)</li>
                                <li>Interact with our AI-powered features (if enabled)</li>
                                <li>Subscribe, purchase, or make payments (if applicable)</li>
                                <li>Contact our support team</li>
                            </ul>
                            <p>
                                This Policy does not apply to third-party websites or services you may access through links or integrations within CSN.
                            </p>

                            <h3>3. What Personal Data We Collect</h3>
                            <p>We collect the following categories of personal data depending on how you interact with CSN:</p>

                            <h4>A) Identification & Contact Data</h4>
                            <p>Such as:</p>
                            <ul>
                                <li>Full name</li>
                                <li>Username</li>
                                <li>Email address</li>
                                <li>Phone number (optional)</li>
                                <li>Profile photo</li>
                                <li>Account credentials or authentication identifiers</li>
                            </ul>

                            <h4>B) Account & Profile Data</h4>
                            <p>Such as:</p>
                            <ul>
                                <li>City, chapter, profession, business category</li>
                                <li>Bio, interests, skills, social/professional preferences</li>
                                <li>Settings and personalization preferences</li>
                            </ul>

                            <h4>C) Community & Interaction Data</h4>
                            <p>Such as:</p>
                            <ul>
                                <li>Connections, network requests, referrals</li>
                                <li>Event participation ("Going", "Maybe", etc.)</li>
                                <li>Posts, comments, uploaded content (if enabled)</li>
                                <li>Messages sent through CSN (if messaging exists)</li>
                            </ul>

                            <h4>D) Transaction & Subscription Data (If Applicable)</h4>
                            <p>Such as:</p>
                            <ul>
                                <li>Purchase/subscription records</li>
                                <li>Billing confirmations from our payment processor</li>
                                <li>Payment status (we do not store full card details)</li>
                            </ul>

                            <h4>E) Usage & Technical Data</h4>
                            <p>Such as:</p>
                            <ul>
                                <li>IP address (approximate location)</li>
                                <li>Browser/device identifiers</li>
                                <li>Pages viewed, clicks, session duration</li>
                                <li>Crash logs and performance diagnostics</li>
                                <li>Referrer/source tracking (basic attribution)</li>
                            </ul>

                            <h4>F) Communications Data</h4>
                            <p>Such as:</p>
                            <ul>
                                <li>Support messages</li>
                                <li>Feedback forms</li>
                                <li>Surveys and responses</li>
                            </ul>

                            <h4>G) Special Category / Sensitive Data</h4>
                            <p>
                                We do not require sensitive personal data for core use of CSN. However, in limited cases you may choose to provide data that could be considered sensitive depending on your region. If we process such data, we will do so only with an appropriate legal basis and only for the specific purpose disclosed at the time of collection.
                            </p>

                            <h3>4. How We Collect Your Personal Data</h3>

                            <h4>A) Directly From You</h4>
                            <p>When you register, complete your profile, join events, upload content, contact support, or make payments.</p>

                            <h4>B) Automatically From Your Device</h4>
                            <p>When you use CSN, we may collect device type, operating system, IP address, and usage analytics.</p>

                            <h4>C) Cookies and Similar Technologies</h4>
                            <p>We use cookies to keep you signed in, remember preferences, improve security, and understand feature performance.</p>

                            <h4>D) From Other People and Trusted Partners</h4>
                            <p>From user invitations, payment processors, authentication providers, and analytics vendors.</p>

                            <h3>5. Why We Use Your Data</h3>
                            <ul>
                                <li><strong>A) To Provide and Operate CSN:</strong> Managing accounts, authentication, and enabling community features.</li>
                                <li><strong>B) To Communicate With You:</strong> Sending security alerts, updates, and support responses.</li>
                                <li><strong>C) To Improve CSN:</strong> Debugging, enhancing UI/UX, and understanding trends.</li>
                                <li><strong>D) To Keep CSN Safe and Secure:</strong> Fraud detection, abuse prevention, and checking suspicious activity.</li>
                                <li><strong>E) To Process Payments:</strong> Handling transactions securely via third-party processors.</li>
                                <li><strong>F) AI-Powered Features:</strong> Generating outputs from your inputs (if enabled), without training models on your data unless disclosed.</li>
                            </ul>

                            <h3>6. Legal Bases for Processing</h3>
                            <p>Depending on your location, we rely on Consent, Contract Necessity, Legitimate Interests, or Legal Obligations.</p>

                            <h3>7. How Long We Keep Your Data</h3>
                            <p>We retain data only as long as necessary for services, security, legal compliance, and dispute resolution. When no longer needed, we delete or anonymize it.</p>

                            <h3>8. How We Protect Your Data</h3>
                            <p>We use safeguards like encryption (HTTPS/TLS), access controls, secure authentication, and regular security reviews.</p>

                            <h3>9. How We Share Your Data</h3>
                            <p>We do not sell your personal data. We share it only with:</p>
                            <ul>
                                <li><strong>Service Providers:</strong> For hosting, analytics, email, security, and payments.</li>
                                <li><strong>Other Users:</strong> Based on your visibility settings (profile, events).</li>
                                <li><strong>Legal & Compliance:</strong> To comply with laws, enforce terms, or prevent harm.</li>
                                <li><strong>Corporate Transactions:</strong> In case of merger or acquisition.</li>
                            </ul>

                            <h3>10. Cross-Border Transfers</h3>
                            <p>Your data may be processed internationally with appropriate safeguards like standard contractual clauses.</p>

                            <h3>11. Your Rights</h3>
                            <p>Depending on your region, rights may include access, correction, deletion, restriction, objection, data portability, and withdrawal of consent.</p>

                            <h3>12. Third-Party Websites</h3>
                            <p>Links to third-party sites are governed by their own privacy policies, not ours.</p>

                            <h3>13. Community Content</h3>
                            <p>Information shared publicly or in groups may be visible to others. Please use discretion.</p>

                            <h3>14. Children’s Privacy</h3>
                            <p>CSN is not intended for children under the applicable age of consent. We do not knowingly collect such data.</p>

                            <h3>15. Changes to This Policy</h3>
                            <p>We may update this policy periodically. The "Last Updated" date will reflect the latest version.</p>

                            <h3>16. How to Contact Us</h3>
                            <p>
                                If you have questions regarding this Privacy Policy, contact us at:<br />
                                <strong>Email:</strong> privacy@csnworld.com
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
