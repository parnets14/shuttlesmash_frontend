import { useState, useEffect, useCallback } from "react";
import "../Styles/contact.css";
import { IoMdMail, IoLogoWhatsapp } from "react-icons/io";
import { BiSolidPhoneCall } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import axios from "axios";
import Aos from "aos";
import Toast from "./Toast";

const Contactus = () => {
  useEffect(() => {
    Aos.init({ once: true });
    window.scroll(0, 0);
  }, []);

  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, type = "info") => setToast({ msg, type }), []);

  // Name validation — letters and spaces only
  const [isNameValid, setIsNameValid] = useState(true);
  const validateName = (v) => /^[a-zA-Z\s]{2,}$/.test(v.trim());
  const handleNameChange = (e) => {
    setGUName(e.target.value);
    setIsNameValid(validateName(e.target.value));
  };

  // Email validation
  const [isEmailValid, setIsEmailValid] = useState(true);
  const validateEmail = (value) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
  const handleEmailChange = (e) => {
    setGUEmail(e.target.value);
    setIsEmailValid(validateEmail(e.target.value));
  };

  // Phone validation — 10 digits, not all same digit, not starting with 0 or 1
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const validatePhoneNumber = (n) => {
    if (!/^\d{10}$/.test(n)) return false;
    if (/^(\d)\1{9}$/.test(n)) return false; // all same digits e.g. 0000000000
    if (/^[01]/.test(n)) return false;        // starts with 0 or 1
    return true;
  };
  const handlePhoneChange = (e) => {
    setGUPhone(e.target.value);
    setIsPhoneValid(validatePhoneNumber(e.target.value));
  };

  // Contact info
  const [Addcontactus, setAddcontactus] = useState([]);
  const getAddcontactus = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getcontactus`);
      if (res.status === 200) setAddcontactus(res.data.getcontactus);
    } catch (error) {
      console.log(error);
    }
  };

  // Form state
  const [GUName, setGUName] = useState("");
  const [GUPhone, setGUPhone] = useState("");
  const [GUEmail, setGUEmail] = useState("");
  const [GUMessage, setGUMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const Addgeneralquery = async (e) => {
    e.preventDefault();
    if (!GUName) return showToast("Please add name", "warning");
    if (!validateName(GUName)) return showToast("Name should contain letters only", "warning");
    if (!GUEmail) return showToast("Please add email", "warning");
    if (!validateEmail(GUEmail)) return showToast("Please enter a valid email", "warning");
    if (!GUPhone) return showToast("Please add phone number", "warning");
    if (!validatePhoneNumber(GUPhone)) return showToast("Please enter a valid 10-digit phone number", "warning");
    if (!GUMessage) return showToast("Please add message", "warning");
    try {
      const config = {
        url: "user/general",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: { "content-type": "application/json" },
        data: { GUName, GUPhone, GUEmail, GUMessage },
      };
      let res = await axios(config);
      if (res.status === 200) {
        setSubmitted(true);
        setGUName(""); setGUPhone(""); setGUEmail(""); setGUMessage("");
        setTimeout(() => setSubmitted(false), 4000);
      }
    } catch (error) {
      showToast(error.response?.data?.msg || "Failed to send enquiry", "error");
    }
  };

  // Social media
  const [Addsocial, setAddsocial] = useState([]);
  const getAddsocial = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getsocial`);
      if (res.status === 200) setAddsocial(res.data.getsocial);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAddcontactus();
    getAddsocial();
  }, []);

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="contact-page">

      {/* Hero Banner */}
      <div className="contact-hero">
        <img src="../Assets/contact.png" alt="Contact" className="contact-hero-img" />
        <div className="contact-hero-overlay">
          <h1 data-aos="fade-down" data-aos-duration="800">CONTACT US</h1>
          <p data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
            We'd love to hear from you. Reach out anytime.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="contact-main">
        <div className="contact-grid">

          {/* Left — Form */}
          <div className="contact-form-card" data-aos="fade-right" data-aos-duration="700">
            <div className="contact-form-header">
              <h2>Send us a Message</h2>
              <p>Fill in the form below and we'll get back to you shortly.</p>
            </div>

            {submitted && (
              <div className="contact-success">
                ✅ Message sent successfully! We'll be in touch soon.
              </div>
            )}

            <form onSubmit={Addgeneralquery} className="contact-form">
              <div className="form-group">
                <label>Full Name <span style={{color:"#e31e24"}}>*</span></label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={GUName}
                  onChange={handleNameChange}
                  onKeyPress={(e) => { if (/[0-9]/.test(e.key)) e.preventDefault(); }}
                  style={{ borderColor: isNameValid ? "" : "#e53e3e" }}
                  required
                />
                {!isNameValid && GUName && <span className="form-error">Name should contain letters only.</span>}
              </div>

              <div className="form-group">
                <label>Email Address <span style={{color:"#e31e24"}}>*</span></label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={GUEmail}
                  onChange={handleEmailChange}
                  style={{ borderColor: isEmailValid ? "" : "#e53e3e" }}
                  required
                />
                {!isEmailValid && <span className="form-error">Please enter a valid email address.</span>}
              </div>

              <div className="form-group">
                <label>Phone Number <span style={{color:"#e31e24"}}>*</span></label>
                <input
                  type="number"
                  placeholder="+91 Enter your phone number"
                  value={GUPhone}
                  onChange={handlePhoneChange}
                  style={{ borderColor: isPhoneValid ? "" : "#e53e3e" }}
                  required
                />
                {!isPhoneValid && <span className="form-error">Please enter a valid 10-digit phone number.</span>}
              </div>

              <div className="form-group">
                <label>Message <span style={{color:"#e31e24"}}>*</span></label>
                <textarea
                  placeholder="Write your message here..."
                  value={GUMessage}
                  onChange={(e) => setGUMessage(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                Send Message 
              </button>
            </form>
          </div>

          {/* Right — Info */}
          {Addcontactus?.map((val, i) => (
            <div key={i} className="contact-info-card" data-aos="fade-left" data-aos-duration="700">

              <div className="contact-info-header">
                <h2>Get in Touch</h2>
                <p>Here's how you can reach us directly.</p>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <FaLocationDot />
                </div>
                <div>
                  <h4>Our Location</h4>
                  <p>{val.CAddress}</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <IoMdMail />
                </div>
                <div>
                  <h4>Email Us</h4>
                  <p><a href={/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? `mailto:${val.CEmail}` : `https://mail.google.com/mail/?view=cm&to=${val.CEmail}`} target="_blank" rel="noopener noreferrer">{val.CEmail}</a></p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <BiSolidPhoneCall />
                </div>
                <div>
                  <h4>Call Us</h4>
                  <p><a href={`tel:${val.CPhone}`} style={{ whiteSpace: "nowrap", unicodeBidi: "plaintext" }}>{val.CPhone}</a></p>
                </div>
              </div>

              {/* Social Links */}
              <div className="contact-social-section">
                <h4>Follow Us</h4>
                <div className="contact-social-icons">
                  <a
                    href="https://chat.whatsapp.com/JSgotD6mlBZ6XXbMdBWxDW"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-whatsapp-join"
                  >
                    <IoLogoWhatsapp style={{ fontSize: "18px", marginRight: "6px", color: "#25d366" }} />
                  Join Official WhatsApp
                  </a>
                  {Addsocial?.map((s, idx) => (
                    <a key={idx} href={s.CLink} target="_blank" rel="noopener noreferrer" className="csocial-btn">
                      <img src={`${process.env.REACT_APP_API_URL}/SocialMedia/${s?.CIcon}`} alt="social" style={{ width: "22px", height: "22px" }} />
                    </a>
                  ))}
                  {/* Gmail icon */}
                  <a
                    href={/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? `mailto:${Addcontactus?.[0]?.CEmail || "geetha@shuttlesmash.in"}` : `https://mail.google.com/mail/?view=cm&to=${Addcontactus?.[0]?.CEmail || "geetha@shuttlesmash.in"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="csocial-btn"
                    title="Email us"
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" style={{ width: "22px", height: "22px" }} />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Floating WhatsApp bubble */}
      {/* <div className="fixed-icon">
        <a href="https://wa.link/5s5pya" target="_blank" rel="noopener noreferrer" style={{ color: "unset", textDecoration: "none" }}>
          <span className="fixed-icon-rings" />
          <IoLogoWhatsapp style={{ color: "white", fontSize: "34px", display: "block", position: "relative", zIndex: 4 }} />
        </a>
      </div> */}

    </div>
    </>
  );
};

export default Contactus;
