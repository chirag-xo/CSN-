export default function WhyCNS() {
    return (
        <section className="why-cns-section">
            <div className="why-cns-dark-container">
                {/* Left side - Text Content */}
                <div className="why-cns-left">
                    {/* Main Headline */}
                    <h2 className="why-cns-headline">
                        Corporate life connects roles, not people.


                    </h2>

                    {/* Supporting Content */}
                    <div className="why-cns-content">
                        <p>
                            Corporate life is intense but conversations remain limited.
                        </p>
                        <p>
                            Workplaces aren't built for sharing emotions and existing platforms prioritize jobs over people.
                            Real connection is missing where it's needed the most.
                        </p>
                        <p style={{ marginTop: '20px', fontSize: '24px' }}>
                            CNS exists to change that.
                        </p>

                    </div>
                </div>

                {/* Right side - Image */}
                <div className="why-cns-right">
                    <img src="/why.jpg" alt="Why CNS" className="why-cns-image" />
                </div>
            </div>
        </section>
    );
}
