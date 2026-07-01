import { useEffect } from "react";
import { Container } from "react-bootstrap";
import "../Styles/policy.css";

const ReturnPolicy = () => {
  useEffect(() => { window.scroll(0, 0); }, []);

  return (
    <div className="policy-page">
      <div className="policy-hero">
        <a href="javascript:history.back()" className="policy-back-btn">← Back</a>
        <h1>Return Policy</h1>
        <p>Last updated: June 2025</p>
      </div>

      <Container>
        <div className="policy-content">

          <section className="policy-section">
            <h2>1. Overview</h2>
            <p>
              This Return Policy applies to any physical merchandise, trophies, medals,
              certificates, or event kits distributed by Shuttle Smash Championship to
              participants, winners, or partners.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. Eligible Returns</h2>
            <p>Returns are accepted only in the following cases:</p>
            <ul>
              <li>The item received is damaged or defective.</li>
              <li>The wrong item was delivered.</li>
              <li>The item does not match what was described or promised.</li>
            </ul>
            <p>
              Items must be returned in their original condition within{" "}
              <strong>7 days</strong> of receipt.
            </p>
          </section>

          <section className="policy-section">
            <h2>3. Non-Returnable Items</h2>
            <ul>
              <li>Personalised or custom-engraved items (unless damaged)</li>
              <li>Items that have been used, worn, or altered</li>
              <li>Digital items such as e-certificates or digital badges</li>
              <li>Registration fees (governed by our Refund Policy)</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. How to Initiate a Return</h2>
            <p>To request a return, contact us within 7 days of receipt with:</p>
            <ul>
              <li>Your full name and registered email or phone number</li>
              <li>Description of the item and reason for return</li>
              <li>Clear photos showing the issue</li>
            </ul>
            <p>
              Once your return is approved, we will provide instructions for sending the
              item back. Return shipping costs for eligible returns will be covered by
              Shuttle Smash Championship.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. Resolution</h2>
            <p>
              Upon receipt and inspection of the returned item, we will arrange one of
              the following resolutions within <strong>7–10 business days</strong>:
            </p>
            <ul>
              <li>Replacement with the correct or undamaged item</li>
              <li>Store credit towards a future event or merchandise</li>
              <li>Refund to the original payment method (where applicable)</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>6. Contact Us</h2>
            <p>
              For return queries, reach out to:
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

export default ReturnPolicy;
