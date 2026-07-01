import { useEffect } from "react";
import { Container } from "react-bootstrap";
import "../Styles/policy.css";

const PrivacyPolicy = () => {
  useEffect(() => { window.scroll(0, 0); }, []);

  return (
    <div className="policy-page">
      <div className="policy-hero">
        <a href="javascript:history.back()" className="policy-back-btn">← Back</a>
        <h1>Privacy Policy</h1>
        <p>Last updated: June 2025</p>
      </div>

      <Container>
        <div className="policy-content">

          <section className="policy-section">
            <h2>1. Information We Collect</h2>
            <p>
              When you register for a tournament or use our website, we may collect the following
              personal information:
            </p>
            <ul>
              <li>Full name and contact details (email address, phone number)</li>
              <li>Player category and tournament preferences</li>
              <li>Payment-related information (transaction reference only — we do not store card details)</li>
              <li>Usage data such as pages visited and device information</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information collected to:</p>
            <ul>
              <li>Process tournament registrations and confirm participation</li>
              <li>Communicate event updates, schedules, and results</li>
              <li>Send notifications via WhatsApp or email regarding upcoming tournaments</li>
              <li>Improve our website and user experience</li>
              <li>Maintain records for prize distribution and rankings</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Data Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. Your data
              may be shared only with:
            </p>
            <ul>
              <li>Tournament organizers and venue management for event coordination</li>
              <li>Sponsors for sponsorship-related communication (only with your consent)</li>
              <li>Legal authorities if required by law</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal
              data against unauthorized access, alteration, disclosure, or destruction. However, no
              internet transmission is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. Cookies</h2>
            <p>
              Our website may use cookies to enhance your browsing experience. You can choose to
              disable cookies through your browser settings, though some features of the site may
              not function properly as a result.
            </p>
          </section>

          <section className="policy-section">
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal obligations)</li>
              <li>Opt out of marketing communications at any time</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how your data is handled,
              please contact us at:
            </p>
            <p>
              <strong>Shuttle Smash Championship</strong><br />
              Email: <a href="mailto:geetha@shuttlesmash.in">geetha@shuttlesmash.in</a><br />
              WhatsApp: <a href="https://wa.link/5s5pya" target="_blank" rel="noopener noreferrer">Chat with us</a>
            </p>
          </section>

        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
