import { useEffect } from "react";
import { Container } from "react-bootstrap";
import "../Styles/policy.css";

const TermsAndConditions = () => {
  useEffect(() => { window.scroll(0, 0); }, []);

  return (
    <div className="policy-page">
      <div className="policy-hero">
        <a href="javascript:history.back()" className="policy-back-btn">← Back</a>
        <h1>Terms &amp; Conditions</h1>
        <p>Last updated: June 2025</p>
      </div>

      <Container>
        <div className="policy-content">

          <section className="policy-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Shuttle Smash Championship website and registering for any
              tournament, you agree to be bound by these Terms &amp; Conditions. If you do not agree,
              please do not use our services.
            </p>
            <p>
              This website is owned by Pavan Kumar B Ganiger.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. Registration &amp; Eligibility</h2>
            <ul>
              <li>Participants must register through the official website or authorized channels.</li>
              <li>Players must meet the age and category criteria specified for each tournament.</li>
              <li>Registration is confirmed only upon successful payment of the registration fee.</li>
              <li>False information provided during registration may result in disqualification.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Payment Policy</h2>
            <ul>
              <li>All registration fees are non-refundable once payment is confirmed.</li>
              <li>Payments must be made through the official payment methods provided.</li>
              <li>After payment, a screenshot or confirmation must be shared via WhatsApp for verification.</li>
              <li>Shuttle Smash Championship is not responsible for failed transactions due to banking issues.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Tournament Rules</h2>
            <ul>
              <li>All players must adhere to the rules set by the Badminton Association of India (BAI).</li>
              <li>Participants must report to the venue at least 30 minutes before their scheduled match.</li>
              <li>Failure to report on time may result in a walkover.</li>
              <li>Any form of misconduct, unsportsmanlike behavior, or cheating will lead to immediate disqualification.</li>
              <li>The decision of the tournament referee/organizer is final and binding.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>5. Cancellation &amp; Postponement</h2>
            <p>
              Shuttle Smash Championship reserves the right to cancel, postpone, or modify any
              tournament due to unforeseen circumstances including but not limited to weather
              conditions, venue issues, or insufficient participation. In such cases, participants
              will be notified and alternative arrangements will be made where possible.
            </p>
          </section>

          <section className="policy-section">
            <h2>6. Photography &amp; Media</h2>
            <p>
              By participating in our tournaments, you grant Shuttle Smash Championship the right
              to use photographs, videos, and other media captured during events for promotional
              purposes on our website and social media channels.
            </p>
          </section>

          <section className="policy-section">
            <h2>7. Liability</h2>
            <p>
              Shuttle Smash Championship is not liable for any personal injury, loss, or damage
              to property during or in connection with our events. Participants are encouraged to
              have their own insurance coverage. Participation is at the player's own risk.
            </p>
          </section>

          <section className="policy-section">
            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms &amp; Conditions at any time. Continued use
              of our website or participation in tournaments after changes are posted constitutes
              acceptance of the revised terms.
            </p>
          </section>

          <section className="policy-section">
            <h2>9. Contact Us</h2>
            <p>
              For any queries regarding these terms, please reach out to:
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

export default TermsAndConditions;
