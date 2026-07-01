import { useState, useEffect } from "react";
import "../Styles/home.css";
import "aos/dist/aos.css";
import { IoLogoWhatsapp } from "react-icons/io";
import { Container } from "react-bootstrap";
import {
  FaArrowRight, FaQuoteLeft, FaDownload,
  FaCalendarAlt, FaMapMarkerAlt,
  FaTrophy, FaUsers, FaMedal, FaHandshake,
  FaChevronLeft, FaChevronRight,
} from "react-icons/fa";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import parse from "html-react-parser";
import axios from "axios";
import Aos from "aos";
import { TypeAnimation } from "react-type-animation";

const Home = () => {
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

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "long" });
  };

  // Hide event from UI if it ended more than 5 days ago
  const isExpiredOver5Days = (endDateStr) => {
    if (!endDateStr) return false;
    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999);
    const fiveDaysAfterEnd = new Date(end.getTime() + 5 * 24 * 60 * 60 * 1000);
    return new Date() > fiveDaysAfterEnd;
  };

  const [AddBanner, setAddBanner] = useState([]);
  const [AddEvents, setAddEvents] = useState([]);
  const [AddPartner, setAddPartner] = useState([]);
  const [AddTestimonial, setAddTestimonial] = useState([]);
  const [AddBrochure, setAddBrochure] = useState([]);

  useEffect(() => {
    const load = async (url, setter, key) => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/${url}`);
        if (res.status === 200) setter(res.data[key]);
      } catch (e) { console.log(e); }
    };
    load("getbanner", setAddBanner, "getbanner");
    load("getevents", setAddEvents, "getevents");
    load("getpartner", setAddPartner, "getpartner");
    load("gettestimonial", setAddTestimonial, "gettestimonial");
    load("getbrochures", setAddBrochure, "getbrochures");
  }, []);

  const r1 = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 2, slidesToSlide: 1 },
    tablet:  { breakpoint: { max: 1024, min: 464 },  items: 1, slidesToSlide: 1 },
    mobile:  { breakpoint: { max: 464,  min: 0 },    items: 1, slidesToSlide: 1 },
  };
  const r2 = { desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5, slidesToSlide: 2 }, tablet: { breakpoint: { max: 1024, min: 464 }, items: 3, slidesToSlide: 2 }, mobile: { breakpoint: { max: 464, min: 0 }, items: 2, slidesToSlide: 1 } };
  const r3 = { desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 }, tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 }, mobile: { breakpoint: { max: 464, min: 0 }, items: 1 } };

  return (
    <div className="home-page">

      {/* ── 1. HERO BANNER (Carousel if multiple) ─────────────── */}
      {AddBanner?.length > 0 && (() => {
        // Collect all images from all banner entries
        const allSlides = [];
        AddBanner.forEach(val => {
          const images = val?.BannerImages?.length > 0 ? val.BannerImages : (val?.BannerImage ? [val.BannerImage] : []);
          images.forEach(img => allSlides.push({ img, text: val.BannerText, text2: val.BannerText2, tagline: val.BannerTagline }));
        });

        if (allSlides.length === 0) return null;

        const renderSlide = (slide, i) => {
          const isVideo = /\.(mp4|webm|ogg)$/i.test(slide.img);
          const hasText = slide.text || slide.text2 || slide.tagline;
          return (
            <div key={i} className="home-hero">
              {isVideo ? (
                <video src={`${process.env.REACT_APP_API_URL}/Homebanner/${slide.img}`}
                  autoPlay loop muted playsInline className="home-hero-video" />
              ) : (
                <img src={`${process.env.REACT_APP_API_URL}/Homebanner/${slide.img}`}
                  alt="banner" className="home-hero-video"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              )}
              <div className="home-hero-overlay" />
              <div className="home-hero-content">
                {hasText && (
                  <TypeAnimation className="home-hero-text"
                    sequence={[
                      ...(slide.text ? [slide.text, 2000] : []),
                      ...(slide.text2 ? [slide.text2, 2000] : []),
                      ...(slide.tagline ? [slide.tagline, 2000] : []),
                    ]}
                    speed={180} cursor={false} deletionSpeed={false}
                    repeat={Infinity} omitDeletionAnimation={true}
                  />
                )}
                <a href="/events" className="hero-cta-btn">
                Book Your Spot  <FaArrowRight style={{ marginLeft: "8px" }} />
                </a>
              </div>
            </div>
          );
        };

        if (allSlides.length === 1) return renderSlide(allSlides[0], 0);

        return (
          <Carousel responsive={r3} infinite autoPlay autoPlaySpeed={2000}
            customTransition="all 0.5s ease" transitionDuration={500} showDots={true} arrows={true}>
            {allSlides.map((slide, i) => renderSlide(slide, i))}
          </Carousel>
        );
      })()}

      {/* Floating WhatsApp */}
      <div className="fixed-icon">
        <a href="https://wa.link/5s5pya" target="_blank" rel="noopener noreferrer" style={{ color: "unset", textDecoration: "none" }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: "48px", height: "48px", display: "block", position: "relative", zIndex: 4 }} />
        </a>
      </div>

      {/* ── 2. ABOUT SECTION ─────────────────── */}
      <section className="home-about-section">
        <Container>
          <div className="home-about-wrapper">

            {/* Left — text content */}
            <div className="home-about-content" data-aos="fade-right" data-aos-duration="800">
              <p className="home-about-tag">WHO WE ARE</p>
              <h2 className="home-about-title">Shuttle Smash Championship</h2>
              <div className="home-about-redline" />
              <p className="home-about-desc">
                Shuttle Smash Championship is a premier badminton tournament platform dedicated to
                nurturing talent, building community, and celebrating the spirit of the sport across Karnataka.
              </p>
              <p className="home-about-desc">
                We organize high-quality tournaments for players of all levels — from grassroots beginners
                to seasoned professionals — providing a stage to compete, grow, and be recognized.
              </p>
              <div className="home-about-stats">
                <div className="home-about-stat-item">
                  <span className="stat-number">1000+</span>
                  <span className="stat-label">Players</span>
                </div>
                <div className="home-about-stat-divider" />
                <div className="home-about-stat-item">
                  <span className="stat-number">120+</span>
                  <span className="stat-label">Tournaments</span>
                </div>
                <div className="home-about-stat-divider" />
                <div className="home-about-stat-item">
                  <span className="stat-number">4,000+</span>
                  <span className="stat-label">Community</span>
                </div>
              </div>
              <div className="home-about-actions">
                <a href="/overview" className="about-btn-primary">Know More</a>
                <a href="/events" className="about-btn-secondary">View Tournaments</a>
              </div>
            </div>

            {/* Right — image */}
            <div className="home-about-img-wrap" data-aos="fade-left" data-aos-duration="800" data-aos-delay="100">
              <img src="../Assets/homepage.jpeg" alt="About Shuttle Smash" className="home-about-img" />
              <div className="home-about-img-badge">
                <span className="badge-num">Dream.</span>
                <span className="badge-text">Believe. Achieve.</span>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ── 3. FEATURE HIGHLIGHTS ────────────── */}
      <section className="home-section" data-aos="fade-up" data-aos-duration="600">
        <Container>
          <h2 className="headdings mb-5">WHAT SETS US APART</h2>
          <div className="home-features-grid">
            {[
              { icon: <FaTrophy />, label: "Premium\nTournaments" },
              { icon: <FaUsers />, label: "Leagues &\nCommunity" },
              { icon: <FaMedal />, label: "Rewards &\nRecognition" },
              { icon: <FaHandshake />, label: "Partnerships &\nGrowth" },
            ].map((f, i) => (
              <div key={i} className="home-feature-item" data-aos="zoom-in" data-aos-delay={`${i * 100}`}>
                <div className="home-feature-icon">{f.icon}</div>
                <div className="home-feature-label">{f.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3. UPCOMING EVENTS ───────────────── */}
      <section className="home-section home-events-section">
        <Container>
          <h2 className="headdings mb-5" data-aos="fade-up">UPCOMING TOURNAMENTS</h2>
          {(() => {
            const visibleEvents = AddEvents?.filter(item => !hiddenEvents.includes(item._id)) || [];
            if (visibleEvents.length === 0) return null;
            if (visibleEvents.length === 1) return (
            <div style={{ maxWidth: "520px", margin: "0 auto" }}>
              <div className="home-event-card-wrap">
                <a href="/events" style={{ textDecoration: "none" }}>
                  <div className="home-event-card">
                    <div className="home-event-img-wrap">
                      <img src={`${process.env.REACT_APP_API_URL}/Events/${visibleEvents[0]?.EventImage}`}
                        alt={visibleEvents[0].EventName} className="home-event-img" />
                      <div className="home-event-date-badge">
                        <FaCalendarAlt style={{ marginRight: "6px" }} />{formatDate(visibleEvents[0].EventStartdate)}
                      </div>
                      <button className="home-event-download-btn" title="Download"
                        onClick={async (e) => {
                          e.preventDefault(); e.stopPropagation();
                          try {
                            const res = await fetch(`${process.env.REACT_APP_API_URL}/Events/${visibleEvents[0]?.EventImage}`);
                            const blob = await res.blob();
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url; a.download = `${visibleEvents[0]?.EventName || "event"}.jpg`;
                            document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
                          } catch (err) { window.open(`${process.env.REACT_APP_API_URL}/Events/${visibleEvents[0]?.EventImage}`, "_blank"); }
                        }}>
                        <FaDownload />
                      </button>
                    </div>
                    <div className="home-event-body">
                      <h3 className="home-event-title">{visibleEvents[0].EventName}</h3>
                      <div className="home-event-meta">
                        <FaMapMarkerAlt style={{ color: "#031B77", marginRight: "6px" }} />{visibleEvents[0].EventLocation}
                      </div>
                      <span className="home-event-btn">View More <FaArrowRight style={{ marginLeft: "6px" }} /></span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            );
            return (
            <Carousel responsive={r1} infinite autoPlay autoPlaySpeed={5000}
              customTransition="all 0.5s ease" transitionDuration={500} showDots arrows={true}>
              {visibleEvents.map((val, i) => (
                <div key={i} className="home-event-card-wrap">
                  <a href="/events" style={{ textDecoration: "none" }}>
                    <div className="home-event-card">
                      <div className="home-event-img-wrap">
                        <img src={`${process.env.REACT_APP_API_URL}/Events/${val?.EventImage}`}
                          alt={val.EventName} className="home-event-img" />
                        <div className="home-event-date-badge">
                          <FaCalendarAlt style={{ marginRight: "6px" }} />{formatDate(val.EventStartdate)}
                        </div>
                        <button className="home-event-download-btn" title="Download"
                          onClick={async (e) => {
                            e.preventDefault(); e.stopPropagation();
                            try {
                              const res = await fetch(`${process.env.REACT_APP_API_URL}/Events/${val?.EventImage}`);
                              const blob = await res.blob();
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url; a.download = `${val?.EventName || "event"}.jpg`;
                              document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
                            } catch (err) { window.open(`${process.env.REACT_APP_API_URL}/Events/${val?.EventImage}`, "_blank"); }
                          }}>
                          <FaDownload />
                        </button>
                      </div>
                      <div className="home-event-body">
                        <h3 className="home-event-title">{val.EventName}</h3>
                        <div className="home-event-meta">
                          <FaMapMarkerAlt style={{ color: "#031B77", marginRight: "6px" }} />{val.EventLocation}
                        </div>
                        <span className="home-event-btn">View More <FaArrowRight style={{ marginLeft: "6px" }} /></span>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </Carousel>
            );
          })()}
        </Container>
      </section>

      {/* ── 4. OUR CLIENTELE ─────────────────── */}
      {AddPartner?.length > 0 && (
        <section className="home-section home-sponsors-section" data-aos="fade-up">
          <Container>
            <h2 className="headdings mb-5">OUR PARTNERS</h2>
            <div className="partners-slider-wrapper">
              <button className="partner-arrow partner-arrow-left" onClick={() => {
                const track = document.querySelector('.sponsors-marquee-track');
                if (track) track.style.animationPlayState = 'paused';
                const container = document.querySelector('.sponsors-marquee');
                if (container) container.scrollBy({ left: -220, behavior: 'smooth' });
                setTimeout(() => { if (track) track.style.animationPlayState = 'running'; }, 1000);
              }}><FaChevronLeft /></button>

              <div className="sponsors-marquee">
                <div className="sponsors-marquee-track">
                  {[...AddPartner, ...AddPartner].map((val, i) => (
                    <a key={i} href={val.PartnerLink} target="_blank" rel="noopener noreferrer" className="sponsor-item">
                      <div className="sponsor-card">
                        <img src={`${process.env.REACT_APP_API_URL}/Partners/${val?.PartnerImage}`}
                          alt="sponsor" className="sponsor-img" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <button className="partner-arrow partner-arrow-right" onClick={() => {
                const track = document.querySelector('.sponsors-marquee-track');
                if (track) track.style.animationPlayState = 'paused';
                const container = document.querySelector('.sponsors-marquee');
                if (container) container.scrollBy({ left: 220, behavior: 'smooth' });
                setTimeout(() => { if (track) track.style.animationPlayState = 'running'; }, 1000);
              }}><FaChevronRight /></button>
            </div>
          </Container>
        </section>
      )}

      {/* ── 5. DIGITAL MEDIA REACH ───────────── */}
      <section className="home-section home-media-section" data-aos="fade-up">
        <Container>
          <h2 className="headdings mb-5">DIGITAL MEDIA REACH</h2>
          <div className="home-media-outer">
            <div className="home-media-card" data-aos="fade-right" data-aos-duration="700">
              <div className="home-media-list">
                {[
                  { stat: "4,000+", label: "WhatsApp Community Members" },
                  { stat: "3,000+", label: "Instagram Audience" },
                  { stat: null,     label: "Strong Facebook Presence" },
                  { stat: null,     label: "High Digital Engagement & Reach" },
                  { stat: null,     label: "Regular Updates, Tournament Highlights, Player Stories & Online Promotions" },
                ].map((item, i) => (
                  <div key={i} className="home-media-row" data-aos="fade-right" data-aos-delay={`${i * 70}`}>
                    <div className="home-media-dot" />
                    <div className="home-media-text">
                      {item.stat && <span className="home-media-stat">{item.stat}</span>}
                      <span className="home-media-desc">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="home-media-img-standalone" data-aos="fade-left" data-aos-duration="800">
              <img src="../Assets/home.jpeg" alt="Digital Media" className="home-media-img" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── 6. TESTIMONIALS ──────────────────── */}
      <section className="home-testimonial-section">
        <Container>
          <h2 className="headdings mb-5" data-aos="fade-up">TESTIMONIALS</h2>
          {AddTestimonial?.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888" }}>No testimonials yet.</p>
          ) : (
            <Carousel responsive={r3} autoPlay infinite autoPlaySpeed={5000}
              transitionDuration={500} arrows={false} showDots>
              {AddTestimonial.map((val, i) => (
                <div key={i} className="testimonial-wrap">
                  <div className="testimonial-card">
                    <span className="testimonial-quote-bg">"</span>
                    <div className="testimonial-inner">
                      <div className="testimonial-stars">
                        {"★★★★★".split("").map((s, idx) => (
                          <span key={idx} className="testimonial-star">{s}</span>
                        ))}
                      </div>
                      <FaQuoteLeft className="testimonial-quote-icon" />
                      <div className="testimonial-text">{parse(`<div>${val.Description}</div>`)}</div>
                      <div className="testimonial-footer">
                        <div className="testimonial-avatar">
                          {val.Name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="testimonial-author">
                          <strong>{val.Name}</strong>
                          {val.Designation && <span>{val.Designation}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          )}
        </Container>
      </section>

      {/* ── 7. BROCHURE DOWNLOAD ─────────────── */}
      {AddBrochure?.map((val, i) => (
        <section key={i} className="home-brochure" data-aos="fade-up">
          <div className="home-brochure-inner">
            <img src="../Assets/badmintonleftsmall.png" alt="" className="brochure-deco-left" />
            <div className="home-brochure-content">
              <h3>Download the Official Brochure</h3>
              <p>Categories, schedule, rules & registration details</p>
              <a href={`${process.env.REACT_APP_API_URL}/Events/${val?.Brochure}`}
                download className="home-brochure-btn">
                <FaDownload style={{ marginRight: "8px" }} /> Download
              </a>
            </div>
            <img src="../Assets/badmintonrightsmall.png" alt="" className="brochure-deco-right" />
          </div>
        </section>
      ))}

    </div>
  );
};

export default Home;
