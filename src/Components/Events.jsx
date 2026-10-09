import { useState, useEffect, useCallback } from "react";
import "../Styles/events.css";
import "aos/dist/aos.css";
import { Container, Button, Modal } from "react-bootstrap";
import axios from "axios";
import parse from "html-react-parser";
import Aos from "aos";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaExpand, FaCalendarAlt, FaDownload } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Toast from "./Toast";

const Events = () => {
  useEffect(() => {
    Aos.init({ once: true });
    window.scroll(0, 0);
  }, []);

  // Hidden events set by admin (stored in localStorage)
  const [hiddenEvents, setHiddenEvents] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem("hiddenEvents");
    if (stored) setHiddenEvents(JSON.parse(stored));
  }, []);

  // ── Download handler (blob fetch to bypass cross-origin) ──
  const handleDownload = async (e, url, filename) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename || "event.jpg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.log(err);
      window.open(url, "_blank");
    }
  };

  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, type = "info") => setToast({ msg, type }), []);

  // ── Validation ───────────────────────────────────
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [playerNameErrors, setPlayerNameErrors] = useState({});

  const validateEmail = (v) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(v);
  const validatePhoneNumber = (n) => /^\d{10}$/.test(n);

  const handleEmailChange = (e) => {
    setPlayerEmail(e.target.value);
    setIsEmailValid(validateEmail(e.target.value));
  };
  const handlePhoneChange = (e) => {
    setPlayerPhoneNo(e.target.value);
    setIsPhoneValid(validatePhoneNumber(e.target.value));
  };

  function convertTo12HourFormat(timeString) {
    if (!timeString) return "";
    let [hours, minutes] = timeString.split(":");
    hours = parseInt(hours);
    const suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${suffix}`;
  }

  // Check if event end date has passed
  const isExpired = (endDateStr) => {
    if (!endDateStr) return false;
    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999); // end of that day
    return end < new Date();
  };

  // Hide event from UI if it ended more than 5 days ago
  const isExpiredOver5Days = (endDateStr) => {
    if (!endDateStr) return false;
    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999);
    const fiveDaysAfterEnd = new Date(end.getTime() + 5 * 24 * 60 * 60 * 1000);
    return new Date() > fiveDaysAfterEnd;
  };

  const getStatusBadge = (item) => {
    if (isExpired(item.EventEnddate)) return { label: "Completed", color: "#ffffff", bg: "#e31e24" };
    const start = new Date(item.EventStartdate);
    const today = new Date();
    if (start > today) return { label: "Upcoming", color: "#ffffff", bg: "#16a34a" };
    return { label: "Ongoing", color: "#ffffff", bg: "#16a34a" };
  };

  // ── Modals ───────────────────────────────────────
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleClose = () => { setShow(false); setPlayerNameErrors({}); };
  const handleClose1 = () => setShow1(false);

  // ── State ────────────────────────────────────────
  const [imgLightbox, setImgLightbox] = useState(null);
  const [itemeb, setitemeb] = useState();
  const [playerType] = useState("default");
  const [Category] = useState("");
  const [SubCategory] = useState("");
  const [FirstPlayerName] = useState("");
  const [FirstPlayerEmail] = useState("");
  const [FirstPlayerPhone] = useState("");
  const [SecondPlayerName] = useState("");
  const [SecondPlayerEmail] = useState("");
  const [SecondPlayerPhone] = useState("");
  const [PlayerEmail, setPlayerEmail] = useState("");
  const [PlayerPhoneNo, setPlayerPhoneNo] = useState("");
  const [playerNames, setPlayerNames] = useState({});

  const [selectedCategories, setSelectedCategories] = useState({ sum: 0, items: [] });
  const handleCheckboxChange = (value, checked, item) => {
    setSelectedCategories((prev) => ({
      sum: (prev.sum || 0) + (checked ? Number(value) : -Number(value)),
      items: checked ? [...prev.items, item] : prev.items.filter((i) => i !== item),
    }));
  };
  const TextfieldArray = Array(selectedCategories.sum).fill(0);
  const handlePlayerNameChange = (index, name) => setPlayerNames((prev) => ({ ...prev, [index]: name }));

  // ── API ──────────────────────────────────────────
  const [AddEvents, setAddEvents] = useState([]);
  const [AddEventbanner, setAddEventbanner] = useState([]);
  const [AddBrochure, setAddBrochure] = useState([]);
  const [AddTerms, setAddTerms] = useState([]);
  const [AddCategory, setAddCategory] = useState([]);
  const [Addregister, setAddregister] = useState([]);
  const [HeroBanner, setHeroBanner] = useState(null);

  const getAddEvents = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getevents`);
      if (res.status === 200) setAddEvents(res.data.getevents);
    } catch (e) { console.log(e); }
  };
  const getAddEventbanner = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/geteventbanner`);
      if (res.status === 200) setAddEventbanner(res.data.geteventbanner);
    } catch (e) { console.log(e); }
  };
  const getAddBrochure = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getbrochures`);
      if (res.status === 200) setAddBrochure(res.data.getbrochures);
    } catch (e) { console.log(e); }
  };
  const getAddTerms = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getterms`);
      if (res.status === 200) setAddTerms(res.data.getterms);
    } catch (e) { console.log(e); }
  };
  const getAddCategory = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getcategory`);
      if (res.status === 200) setAddCategory(res.data.getcategory);
    } catch (e) { console.log(e); }
  };
  const getAddregister = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getregistration`);
      if (res.status === 200) setAddregister(res.data.getregistration);
    } catch (e) { console.log(e); }
  };

  const getHeroBanner = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/geteventheroBanner`);
      if (res.status === 200 && res.data.getheroBanner?.length > 0) {
        setHeroBanner(res.data.getheroBanner[0]);
      }
    } catch (e) { console.log(e); }
  };

  useEffect(() => {
    getAddEvents();
    getAddEventbanner();
    getAddBrochure();
    getAddTerms();
    getAddCategory();
    getAddregister();
    getHeroBanner();
  }, []);

  const registerpalyer = async () => {
    // Validate all player names are filled
    const errors = {};
    TextfieldArray.forEach((_, i) => {
      if (!playerNames[i] || !playerNames[i].trim()) {
        errors[i] = true;
      }
    });
    if (Object.keys(errors).length > 0) {
      setPlayerNameErrors(errors);
      return;
    }
    if (!validateEmail(PlayerEmail)) {
      setIsEmailValid(false);
      return;
    }
    if (!validatePhoneNumber(PlayerPhoneNo)) {
      setIsPhoneValid(false);
      return;
    }
    try {
      const config = {
        url: "user/registration",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "application/json" },
        data: { playerNames, PlayerEmail, PlayerPhoneNo },
      };
      let res = await axios(config);
      if (res.status === 200) {
        showToast("Registration successful!", "success");
        handleClose();
      }
    } catch (e) { console.log(e); }
  };

  const AddRegisterquery = async () => {
    try {
      const config = {
        url: "user/registration",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "application/json" },
        data: {
          EventName: itemeb?.EventName,
          EventDate: itemeb?.EventStartdate,
          TotalAmount: itemeb?.Price,
          Category: itemeb?.EventCategory,
          SubCategory: itemeb?.EventSubCategory,
          FirstPlayerName, FirstPlayerEmail, FirstPlayerPhone,
          SecondPlayerName, SecondPlayerEmail, SecondPlayerPhone,
        },
      };
      let res = await axios(config);
      if (res.status === 200) {
        showToast(res.data.success || "Registered successfully!", "success");
        getAddregister();
        handleClose();
        handleClose1();
      }
    } catch (e) { console.log(e); }
  };

  return (
    <div className="events-page">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ── Hero Banner ──────────────────────── */}
      <div className="events-hero">
        <img
          src={HeroBanner ? `${process.env.REACT_APP_API_URL}/EventHeroBanner/${HeroBanner.HeroImage}` : "../Assets/event.jpeg"}
          alt="Events"
          className="events-hero-img"
        />
        <div className="events-hero-overlay">
          <h1>{HeroBanner?.HeroTitle || "TOURNAMENTS"}</h1>
          <p>{HeroBanner?.HeroDescription || "Register now and be part of the championship"}</p>
        </div>
      </div>

      {/* ── Floating WhatsApp ────────────────── */}
      <div className="fixed-icon">
        <a href="https://wa.link/5s5pya" target="_blank" rel="noopener noreferrer"
          style={{ color: "unset", textDecoration: "none" }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: "48px", height: "48px", display: "block", position: "relative", zIndex: 4 }} />
        </a>
      </div>

      {/* ── Event Sub-banner ─────────────────── */}
      {AddEventbanner?.map((val, i) => (
        <div key={i} className="event-subbanner" data-aos="fade-up" data-aos-duration="600">
          <h2 className="event-subbanner-title">{val.EventbannerTitle}</h2>
          <div className="event-subbanner-inner">
            <img
              src={`${process.env.REACT_APP_API_URL}/Events/${val?.EventbannerImage}`}
              alt={val.EventbannerTitle}
              className="event-subbanner-img"
            />
          </div>
        </div>
      ))}

      {/* ── Event Cards ──────────────────────── */}
      <div className="event-content-section mt-2">
        <Container>
          <h2 className="headdings mb-4">UPCOMING TOURNAMENTS</h2>
          <div className="event-grid">
            {AddEvents?.filter(item => !hiddenEvents.includes(item._id)).map((item, i) => (
              <div
                className="event-grid-card"
                key={i}
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={`${(i % 2) * 120}`}
              >
                {/* Image */}
                <div
                  className="event-grid-img-wrap"
                  onClick={() => setImgLightbox({
                    src: `${process.env.REACT_APP_API_URL}/Events/${item?.EventImage}`,
                    name: item.EventName
                  })}
                >
                  <img
                    src={`${process.env.REACT_APP_API_URL}/Events/${item?.EventImage}`}
                    alt={item.EventName}
                    className="event-grid-img"
                  />
                  <div className="event-grid-img-overlay">
                    <FaExpand style={{ color: "white", fontSize: "22px" }} />
                  </div>
                  {/* Download button */}
                  <button
                    onClick={(e) => handleDownload(
                      e,
                      `${process.env.REACT_APP_API_URL}/Events/${item?.EventImage}`,
                      `${item.EventName || "event"}.jpg`
                    )}
                    className="event-grid-download-btn"
                    title="Download Flyer"
                  >
                    <FaDownload />
                  </button>
                </div>

                {/* Body */}
                <div className="event-grid-body">
                  <div className="event-grid-title-row">
                    <h3 className="event-grid-title">{item.EventName}</h3>
                    {(() => {
                      const badge = getStatusBadge(item);
                      return (
                        <span className="event-status-badge" style={{ background: badge.bg, color: badge.color }}>
                          {badge.label}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="event-grid-info">
                    <div className="event-grid-info-row">
                      <span className="egrid-label">Venue</span>
                      <span>{item.EventLocation}</span>
                    </div>
                    <div className="event-grid-info-row">
                      <span className="egrid-label">Start</span>
                      <span>{item.EventStartdate}</span>
                    </div>
                    <div className="event-grid-info-row">
                      <span className="egrid-label">End</span>
                      <span>{item.EventEnddate}</span>
                    </div>
                    <div className="event-grid-info-row">
                      <span className="egrid-label">Time</span>
                      <span>{convertTo12HourFormat(item.Time)}</span>
                    </div>
                    {/* <div className="event-grid-info-row">
                      <span className="egrid-label">Organizer</span>
                      <span>{item.EventExhibits}</span>
                    </div> */}
                  </div>
                  <div className="event-grid-btns">
                    {isExpired(item.EventEnddate) ? (
                      <Button variant="" className="registr-btn registr-btn--disabled" disabled>
                        Registration Closed
                      </Button>
                    ) : (
                      <a href={`/registration?id=${item._id}`}>
                        <Button variant="" className="registr-btn">Register</Button>
                      </a>
                    )}
                    <a href="https://chat.whatsapp.com/JSgotD6mlBZ6XXbMdBWxDW"
                      style={{ color: "unset", textDecoration: "none", flex: "1.4" }}>
                      <Button variant="" className="join-whatsp">
                        <IoLogoWhatsapp style={{ fontSize: "17px" }} />
                       Join Official WhatsApp
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Image Lightbox ───────────────────── */}
      {imgLightbox && (
        <div className="ev-lightbox" onClick={() => setImgLightbox(null)}>
          <div className="ev-lightbox-box" onClick={e => e.stopPropagation()}>
            <button className="ev-lightbox-close" onClick={() => setImgLightbox(null)}>
              <MdClose />
            </button>
            <img src={imgLightbox.src} alt={imgLightbox.name} className="ev-lightbox-img" />
            {imgLightbox.name && <div className="ev-lightbox-caption">{imgLightbox.name}</div>}
          </div>
        </div>
      )}

      {/* ── Terms & Conditions ───────────────── */}
      {AddTerms?.length > 0 && (
        <Container>
          <div className="terms-section" data-aos="fade-up" data-aos-duration="600">
            <div className="terms-title">
              <h3>Terms & Conditions</h3>
            </div>
            <hr className="terms-divider" />
            {AddTerms.map((val, i) => (
              <div key={i}>{parse(`<div>${val.Eligibility}</div>`)}</div>
            ))}
          </div>
        </Container>
      )}

      {/* ── Registration Modal ───────────────── */}
      <Modal show={show} onHide={handleClose} size="md" style={{ zIndex: "99999" }}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#031B77", fontWeight: 800 }}>
            Shuttle Smash Championship Registration
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2">
            <label>Select Category</label>
            <div className="form-control" style={{ padding: "8px", borderRadius: "5px" }}>
              {AddCategory?.map((item, i) => (
                <div key={i}>
                  <input
                    type="checkbox"
                    id={`Category-${i}`}
                    value={item.TotalPlayers}
                    onChange={(e) => handleCheckboxChange(e.target.value, e.target.checked, item)}
                  />{" "}
                  <span>{item.CategoryName}</span>
                </div>
              ))}
            </div>
          </div>
          {TextfieldArray.map((_, i) => (
            <div key={i} className="do-sear mt-2">
              <label>
                Player Name {i + 1} <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Your Name"
                className="vi_0"
                style={{ borderColor: playerNameErrors[i] ? "red" : "" }}
                onChange={(e) => {
                  handlePlayerNameChange(i, e.target.value);
                  if (e.target.value.trim()) {
                    setPlayerNameErrors((prev) => { const n = { ...prev }; delete n[i]; return n; });
                  }
                }}
              />
              {playerNameErrors[i] && (
                <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                  Player Name {i + 1} is required.
                </p>
              )}
            </div>
          ))}
          <div className="do-sear mt-2">
            <label>Player Email ID</label>
            <input type="email" placeholder="Enter Your Email" className="vi_0"
              style={{ borderColor: isEmailValid ? "" : "red" }}
              onChange={handleEmailChange} />
            {!isEmailValid && <p style={{ color: "red", fontSize: "12px" }}>Please enter a valid email address.</p>}
          </div>
          <div className="do-sear mt-2">
            <label>Contact Number</label>
            <input type="number" placeholder="+91 Enter Contact Number" className="vi_0"
              style={{ borderColor: isPhoneValid ? "" : "red" }}
              onChange={handlePhoneChange} />
            {!isPhoneValid && <p style={{ color: "red", fontSize: "12px" }}>Please enter a valid 10-digit phone number.</p>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={handleClose}>Cancel</Button>
          <Button className="modal-add-btn" variant="" onClick={registerpalyer}>Proceed Next</Button>
        </Modal.Footer>
      </Modal>

      {/* ── Payment Modal ────────────────────── */}
      <Modal show={show1} onHide={handleClose1} size="md" style={{ zIndex: "99999" }}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>
            {AddEvents?.map((val, i) => <span key={i}>Pay Rs {val?.Price}</span>)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex gap-2 mb-3">
            <b style={{ color: "green" }}>Note:</b>
            <span style={{ fontSize: "14px" }}>
              After successful payment, share the screenshot on{" "}
              <a href="https://chat.whatsapp.com/JSgotD6mlBZ6XXbMdBWxDW">WhatsApp</a>.
            </span>
          </div>
          <div className="col-md-6 m-auto">
            <img src="../Assets/payment.jpg" alt="" style={{ width: "100%" }} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={handleClose1}>Cancel</Button>
          <Button className="modal-add-btn" variant="" onClick={AddRegisterquery}>Submit</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Events;
