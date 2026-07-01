import { useEffect } from "react";
import { Container } from "react-bootstrap";
import "../Styles/policy.css";

const ShippingPolicy = () => {
  useEffect(() => { window.scroll(0, 0); }, []);

  return (
    <div className="policy-page">
      <div className="policy-hero">
        <a href="javascript:history.back()" className="policy-back-btn">← Back</a>
        <h1>Shipping Policy</h1>
        <p>Last updated: June 2025</p>
      </div>

      <Container>
        <div className="policy-content">

          <section className="policy-section">
            <h2>1. Overview</h2>
            <p>
              Shuttle Smash Championship is primarily a sports tournament organizer. This
              Shipping Policy applies to any physical items — such as medals, trophies,
              certificates, or event merchandise — that may be dispatched to participants
              or partners in connection with our events.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. Shipping Coverage</h2>
            <ul>
              <li>Shipping is available within <strong>India only</strong>.</li>
              <li>We do not currently offer international shipping.</li>
              <li>
                Please ensure your registered address is accurate at the time of
                registration, as we ship to the address provided.
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Delivery Timeframe</h2>
            <p>
              Physical items will be dispatched within <strong>3–5 business days</strong> after
              the event concludes. Estimated delivery is <strong>7–14 business days</strong> from
              dispatch, depending on your location.
            </p>
            <p>
              Delivery timelines may vary during peak seasons or due to unforeseen
              circumstances such as weather disruptions or courier delays. Shuttle Smash
              Championship is not responsible for delays caused by courier partners.
            </p>
          </section>

          <section className="policy-section">
            <h2>4. Shipping Charges</h2>
            <p>
              Shipping charges, if applicable, will be communicated to participants prior
              to dispatch. In most cases, standard event rewards (medals, certificates) are
              shipped free of charge.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. Order Tracking</h2>
            <p>
              Once your item has been dispatched, a tracking number will be shared via
              WhatsApp or email to your registered contact. Use this to track your shipment
              on the courier's website.
            </p>
          </section>

          <section className="policy-section">
            <h2>6. Damaged or Missing Shipments</h2>
            <p>
              If your shipment has not arrived within the expected timeframe, or if you
              receive a damaged item, please contact us within{" "}
              <strong>5 business days</strong> of the expected delivery date with:
            </p>
            <ul>
              <li>Your full name and registered contact number</li>
              <li>Registration or order details</li>
              <li>Photo of the damaged item (if applicable)</li>
            </ul>
            <p>
              We will investigate promptly and arrange a replacement at no additional cost.
            </p>
          </section>

          <section className="policy-section">
            <h2>7. Address Errors</h2>
            <p>
              Shuttle Smash Championship is not responsible for non-delivery due to an
              incorrect or incomplete address provided by the participant. Please double-check
              your address during registration.
            </p>
          </section>

          <section className="policy-section">
            <h2>8. Contact Us</h2>
            <p>For all shipping queries, reach out to:</p>
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

export default ShippingPolicy;
