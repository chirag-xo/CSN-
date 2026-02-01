
export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Top Row: Logo and Social Icons */}
                <div className="footer-top">
                    {/* CSN Logo */}
                    <div className="footer-logo">
                        <img src="/csn.png" alt="CSN Logo" className="footer-logo-image" />
                    </div>

                    {/* Social Media Icons */}
                    <div className="social-icons">
                        <a href="https://www.facebook.com/share/1GahkosUV9/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                            <img src="/facebook.png" alt="Facebook" className="social-icon-img" />
                        </a>
                        <a href="https://www.instagram.com/csnworld2026?utm_source=qr" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                            <img src="/ig.png" alt="Instagram" className="social-icon-img" style={{ width: '70px', height: '70px' }} />
                        </a>
                        <a href="#" className="social-icon" aria-label="LinkedIn">
                            <img src="/in.png" alt="LinkedIn" className="social-icon-img" />
                        </a>
                    </div>
                </div>

                {/* Bottom Row: Copyright */}
                <div className="footer-bottom">
                    <p className="copyright" style={{ fontSize: '24px' }}>© 2026 CSN. All rights reserved.</p>
                    <p className="powered-by" style={{ fontSize: '16px', marginTop: '8px', color: '#ffffff' }}>
                        Powered by <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 'bold' }}>Royals Services</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
