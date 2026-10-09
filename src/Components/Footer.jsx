import React, { useState, useEffect } from "react";
import "../Styles/footer.css";
import { Container } from "react-bootstrap";
import axios from "axios";
import { FaHome, FaCalendarAlt, FaImages, FaTrophy, FaInfoCircle, FaHeart } from "react-icons/fa";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";

const Footer = () => {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const getEmailLink = (email, subject) => {
    if (isMobile) return `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
    return `https://mail.google.com/mail/?view=cm&to=${email}${subject ? `&su=${encodeURIComponent(subject)}` : ""}`;
  };

  const [Addcontactus, setAddcontactus] = useState([]);
  const getAddcontactus = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getcontactus`);
      if (res.status === 200) setAddcontactus(res.data.getcontactus || []);
    } catch (error) { console.log(error); }
  };

  const [Addsocial, setAddsocial] = useState([]);
  const getAddsocial = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getsocial`);
      if (res.status === 200) setAddsocial(res.data.getsocial || []);
    } catch (error) { console.log(error); }
  };

  useEffect(() => {
    getAddcontactus();
    getAddsocial();
  }, []);

  return (
    <div className="footer-section">
      <Container>
        <div className="footer-inner">

          {/* Col 1 — Logo + tagline + description */}
          <div className="footer-col footer-brand">
            <img src="../Assets/logo111.png" alt="Shuttle Smash" className="footer-logo" />
            <p className="footer-tagline">One Platform Endless Possibilities</p>
            {/* <p className="footer-desc">
              Your premier badminton championship platform — connecting players, celebrating champions, and growing the sport.
            </p> */}
          </div>

          {/* Col 2 — Quick Links */}
          <div className="footer-col">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              {[
                { href: "/",              icon: <FaHome />,        label: "Home" },
                { href: "/overview",      icon: <FaInfoCircle />,  label: "Overview" },
                { href: "/keyhighlights", icon: <FaInfoCircle />,  label: "Key Highlights" },
                { href: "/events",        icon: <FaCalendarAlt />, label: "Tournaments" },
                // { href: "/results",       icon: <FaTrophy />,      label: "Results" },
                { href: "/gallery",       icon: <FaImages />,      label: "Gallery" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href}>
                    <span className="footer-link-icon">{link.icon}</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact Us */}
          <div className="footer-col">
            <h4 className="footer-title">Contact Us</h4>
            {Addcontactus.length > 0 ? (
              Addcontactus.map((val, i) => (
                <ul className="footer-links footer-contact-list" key={i}>
                  {val.CAddress && (
                    <li>
                      <span className="footer-contact-icon"><MdLocationOn /></span>
                      <span>{val.CAddress}</span>
                    </li>
                  )}
                  {val.CPhone && (
                    <li>
                      <span className="footer-contact-icon"><MdPhone /></span>
                      <a href={`tel:${val.CPhone}`}>{val.CPhone}</a>
                    </li>
                  )}
                  {val.CEmail && (
                    <li>
                      <span className="footer-contact-icon"><MdEmail /></span>
                      <a
                        href={getEmailLink(val.CEmail)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {val.CEmail}
                      </a>
                    </li>
                  )}
                </ul>
              ))
            ) : (
              <ul className="footer-links footer-contact-list">
                <li>
                  <span className="footer-contact-icon"><MdLocationOn /></span>
                  <span>Bengaluru, Karnataka</span>
                </li>
                <li>
                  <span className="footer-contact-icon"><MdPhone /></span>
                  <a href="tel:+918861711005">+91 88617 11005</a>
                </li>
              </ul>
            )}
          </div>

          {/* Col 4 — Stay Connected */}
          <div className="footer-col">
            <h4 className="footer-title">Stay Connected</h4>
            <p className="footer-social-caption">
              <FaHeart className="footer-heart-icon" /> Follow our journey of badminton excellence.
            </p>
            <div className="footer-social">
              {Addsocial.map((s, j) => {
                const link = (s.CLink || "").toLowerCase();
                let brandClass = "";
                if (link.includes("instagram")) brandClass = "footer-social-insta";
                else if (link.includes("youtube"))  brandClass = "footer-social-yt";
                else if (link.includes("facebook")) brandClass = "footer-social-fb";
                else if (link.includes("twitter") || link.includes("x.com")) brandClass = "footer-social-tw";
                else if (link.includes("whatsapp")) brandClass = "footer-social-wa";
                return (
                  <a
                    href={s.CLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={j}
                    className={`footer-social-link ${brandClass}`}
                    title={s.CLink}
                  >
                    <img
                      src={`${process.env.REACT_APP_API_URL}/SocialMedia/${s?.CIcon}`}
                      alt="social"
                    />
                  </a>
                );
              })}
              {/* Gmail icon — opens Gmail compose directly */}
              {Addcontactus.length > 0 && Addcontactus[0]?.CEmail && (
                <a
                  href={getEmailLink(Addcontactus[0].CEmail)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link footer-email-icon"
                  title={`Email: ${Addcontactus[0].CEmail}`}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" width="26" height="26" />
                </a>
              )}
            </div>

            {/* Payment Methods */}
            <div className="footer-payment-section">
              <p className="footer-payment-label">
                Payment Options
              </p>
              <div className="footer-payment-icons">
                <div className="footer-pay-badge" title="UPI">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style={{ height: "20px" }} />
                </div>
                <div className="footer-pay-badge" title="Google Pay">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" style={{ height: "20px" }} />
                </div>
                <div className="footer-pay-badge" title="PhonePe">
                  <img 
                    src="https://cdn.worldvectorlogo.com/logos/phonepe-1.svg" 
                    alt="PhonePe" 
                    style={{ height: "20px" }} 
                    onError={(e) => { e.target.src = "../Assets/phonepe.svg"; }}
                  />
                </div>
                <div className="footer-pay-badge" title="Visa">
                  <img src="../Assets/visa.jpeg" alt="Visa" style={{ height: "20px" }} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Shuttle Smash Championship. All rights reserved.</p>
          <div className="footer-policy-links">
            <a href="/privacy-policy">Privacy Policy</a>
            <span className="footer-policy-divider">|</span>
            <a href="/terms-and-conditions">Terms &amp; Conditions</a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
