import { useEffect } from "react";
import { Container } from "react-bootstrap";
import "../Styles/policy.css";

const RefundPolicy = () => {
  useEffect(() => { window.scroll(0, 0); }, []);

  return (
    <div className="policy-page">
      <div className="policy-hero">
        <a href="javascript:history.back()" className="policy-back-btn">← Back</a>
        <h1>Refund Policy</h1>
        <p>Last updated: June 2025</p>
      </div>

      <Container>
        <div className="policy-content">

          <section className="policy-section">
            <h2>1. Registration Fee</h2>
            <p>
              All registration fees paid for Shuttle Smash Championship tournaments are
              collected to cover event organization, venue, equipment, prizes, and administrative
              costs. Please read this policy carefully before completing your registration.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. No Refund Policy</h2>
            <p>
              <strong>Registration fees are non-refundable</strong> once payment has been
              confirmed. This applies in all circumstances including but not limited to:
            </p>
            <ul>
              <li>Personal reasons such as illness, travel conflicts, or schedule changes</li>
              <li>Failure to attend the tournament on the scheduled date</li>
              <li>Withdrawal from the event after registration</li>
              <li>Disqualification due to rule violations</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Event Cancellation or Postponement</h2>
            <p>
              In the rare event that a tournament is cancelled or postponed by Shuttle Smash
              Championship due to unforeseen circumstances (such as natural calamities, venue
              unavailability, or government restrictions), the following applies:
            </p>
            <ul>
              <li>
                <strong>Cancellation:</strong> Registered players will receive a full refund or
                credit towards a future tournament, at the organizer's discretion.
              </li>
              <li>
                <strong>Postponement:</strong> Registrations will be automatically transferred
                to the rescheduled date. Players who cannot attend the new date may request a
                refund by contacting us within 7 days of the postponement announcement.
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Duplicate or Erroneous Payments</h2>
            <p>
              If you have made a duplicate payment or an erroneous transaction, please contact
              us immediately at{" "}
              <a href="mailto:geetha@shuttlesmash.in">
                geetha@shuttlesmash.in
              </a>{" "}
              or WhatsApp us at{" "}
              <a href="https://wa.link/5s5pya" target="_blank" rel="noopener noreferrer">
                +91 88617 11005
              </a>
              . Duplicate payments will be refunded within 7–10 business days after verification.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. Refund Process</h2>
            <ul>
              <li>
                Approved refunds (where applicable) will be processed via the original payment
                method.
              </li>
              <li>
                For approved refunds, we will credit the refundable amount into the source
                account within 5-7 business days.
              </li>
              <li>
                Shuttle Smash Championship is not responsible for delays caused by your bank or
                payment provider.
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>6. How to Request a Refund</h2>
            <p>
              To raise a refund request (for eligible cases only), please contact us with the
              following details:
            </p>
            <ul>
              <li>Full name and registered email address</li>
              <li>Tournament name and registration date</li>
              <li>Payment screenshot or transaction ID</li>
              <li>Reason for the refund request</li>
            </ul>
            <p>
              Contact us at:{" "}
              <a href="mailto:geetha@shuttlesmash.in">
                geetha@shuttlesmash.in
              </a>{" "}
              or WhatsApp:{" "}
              <a href="https://wa.link/5s5pya" target="_blank" rel="noopener noreferrer">
                +91 88617 11005
              </a>
            </p>
          </section>

          <section className="policy-section">
            <h2>7. Contact Us</h2>
            <p>
              For any queries regarding this Refund Policy, please reach out to:
            </p>
            <p>
              <strong>Shuttle Smash Championship</strong><br />
              Email:{" "}
              <a href="mailto:geetha@shuttlesmash.in">
                geetha@shuttlesmash.in
              </a>
              <br />
              WhatsApp:{" "}
              <a href="https://wa.link/5s5pya" target="_blank" rel="noopener noreferrer">
                Chat with us
              </a>
            </p>
          </section>

        </div>
      </Container>
    </div>
  );
};

export default RefundPolicy;
