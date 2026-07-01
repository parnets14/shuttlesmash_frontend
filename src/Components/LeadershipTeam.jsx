import { useState, useEffect } from "react";
import "../Styles/keyhighlight.css";
import "../Styles/overview.css";
import "../Styles/leadershipteam.css";
import axios from "axios";
import Aos from "aos";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";

// ── Single Card Component ──────────────────────────
const LeadershipCard = ({ member, index, apiUrl }) => {
  const [showModal, setShowModal] = useState(false);
  const hasLongDesc = member.MemberDesc && member.MemberDesc.length > 300;

  const handleCardClick = () => {
    if (member.MemberInsta) {
      window.open(member.MemberInsta, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <div
        className="ldr-card"
        data-aos="fade-up"
        data-aos-duration="700"
        data-aos-delay={`${(index % 3) * 80}`}
        onClick={handleCardClick}
        style={{ cursor: member.MemberInsta ? "pointer" : "default" }}
      >
        {/* Instagram badge on hover */}
        {member.MemberInsta && (
          <div className="ldr-card-insta-badge">
            <FaInstagram />
          </div>
        )}

        {/* Photo */}
        <div className="ldr-card-photo-wrap">
          <div className="ldr-card-photo">
            {member.MemberImage ? (
              <img src={`${apiUrl}/LeadershipTeam/${member.MemberImage}`} alt={member.MemberName} />
            ) : (
              <div className="ldr-card-photo-placeholder">
                {member.MemberName?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="ldr-card-info">
          <h3 className="ldr-card-name">{member.MemberName}</h3>
          <p className="ldr-card-role">{member.MemberRole}</p>

          {member.MemberDesc && (
            <>
              <p className={`ldr-card-desc ${hasLongDesc ? "ldr-desc-clamp" : ""}`}>
                {member.MemberDesc}
              </p>
              {hasLongDesc && (
                <button className="ldr-card-viewmore" onClick={() => setShowModal(true)}>
                  Read More <span>→</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && (
        <div className="ldr-overlay" onClick={() => setShowModal(false)}>
          <div className="ldr-modal" onClick={e => e.stopPropagation()}>
            <button className="ldr-modal-x" onClick={() => setShowModal(false)}>✕</button>

            {/* Top blue banner */}
            <div className="ldr-modal-header">
              <div className="ldr-modal-img">
                {member.MemberImage ? (
                  <img src={`${apiUrl}/LeadershipTeam/${member.MemberImage}`} alt={member.MemberName} />
                ) : (
                  <div className="ldr-card-photo-placeholder ldr-modal-placeholder">
                    {member.MemberName?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="ldr-modal-content">
              <h3 className="ldr-modal-name">{member.MemberName}</h3>
              <p className="ldr-modal-role">{member.MemberRole}</p>
              <div className="ldr-modal-divider" />
              <p className="ldr-modal-desc">{member.MemberDesc}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ── Page Component ─────────────────────────────────
const LeadershipTeam = () => {
  useEffect(() => {
    Aos.init({ once: true });
    window.scroll(0, 0);
  }, []);

  const [TeamMembers, setTeamMembers] = useState([]);
  const [HeroBanner, setHeroBanner] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getleadershipteam`)
      .then(r => { if (r.status === 200) setTeamMembers(r.data.getleadershipteam || []); })
      .catch(e => console.log(e));

    axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getleadershipheroBanner`)
      .then(r => { if (r.status === 200 && r.data.getheroBanner?.length > 0) setHeroBanner(r.data.getheroBanner[0]); })
      .catch(e => console.log(e));
  }, []);

  return (
    <div className="ldr-page">

      {/* ── Hero ── */}
      <div className="wwa-hero">
        <img
          src={HeroBanner
            ? `${process.env.REACT_APP_API_URL}/LeadershipHeroBanner/${HeroBanner.HeroImage}`
            : "../Assets/keyhightlights.jpg"}
          alt="Leadership Team"
          className="wwa-hero-img"
        />
        <div className="wwa-hero-overlay">
          <h1 data-aos="fade-down" data-aos-duration="700">
            {HeroBanner?.HeroTitle || "A LEADERSHIP TEAM"}
          </h1>
          <p data-aos="fade-up" data-aos-duration="700" data-aos-delay="100">
            {HeroBanner?.HeroDescription || "The people behind Shuttle Smash Championship"}
          </p>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <div className="fixed-icon">
        <a href="https://wa.link/5s5pya" target="_blank" rel="noopener noreferrer"
          style={{ color: "unset", textDecoration: "none" }}>
          <span className="fixed-icon-rings" />
          <IoLogoWhatsapp style={{ color: "white", fontSize: "34px", display: "block", position: "relative", zIndex: 4 }} />
        </a>
      </div>

      {/* ── Section Header ── */}
      <div className="ldr-section-header" data-aos="fade-up" data-aos-duration="600">
        <span className="ldr-section-tag">Our People</span>
        <h2 className="ldr-section-title">Meet the <span>Leadership</span></h2>
        <p className="ldr-section-sub">
          Passionate individuals driving the vision and growth of Shuttle Smash Championship.
        </p>
      </div>

      {/* ── Cards ── */}
      {(TeamMembers || []).length > 0 ? (
        <section className="ldr-section">
          <div className="ldr-container">
            <div className="ldr-grid">
              {TeamMembers.map((member, i) => (
                <LeadershipCard
                  key={i}
                  member={member}
                  index={i}
                  apiUrl={process.env.REACT_APP_API_URL}
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <div className="ldr-empty">
          <p>No team members added yet.</p>
        </div>
      )}

    </div>
  );
};

export default LeadershipTeam;
