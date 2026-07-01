import { useState, useEffect } from "react";
import "../Styles/overview.css";
import { Container } from "react-bootstrap";
import parse, { domToReact } from "html-react-parser";
import axios from "axios";
import Aos from "aos";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";

const parseOptions = {
  replace: (domNode) => {
    if (domNode.name === "li") {
      return (
        <li>
          <img src="../Assets/shuttlecock.png" alt="" className="bullet-cock-icon" />
          {domToReact(domNode.children, parseOptions)}
        </li>
      );
    }
  },
};

const Overview = () => {
  useEffect(() => {
    Aos.init();
    window.scroll(0, 0);
  });

  // Overview data
  const [AddOverview, setAddOverview] = useState([]);
  const getAddOverview = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getoverview`);
      if (res.status === 200) setAddOverview(res.data.getoverview);
    } catch (error) { console.log(error); }
  };

  // Team members
  const [TeamMembers, setTeamMembers] = useState([]);
  const getTeamMembers = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getteammembers`);
      if (res.status === 200) setTeamMembers(res.data.getteammembers);
    } catch (error) { console.log(error); }
  };

  useEffect(() => {
    getAddOverview();
    getTeamMembers();
  }, []);

  return (
    <div>
      {/* ── Hero Banner ─────────────────────── */}
      <div className="wwa-hero">
        <img src="../Assets/overviews.jpg" alt="Overview" className="wwa-hero-img" />
        <div className="wwa-hero-overlay">
          <h1 data-aos="fade-down" data-aos-duration="700">OVERVIEW</h1>
          <p data-aos="fade-up" data-aos-duration="700" data-aos-delay="100">
            Discover who we are and what we stand for
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

      {/* ── Dynamic Overview Content (from DB) ─────────────────────── */}
      <Container>
        {/* First card — "ABOUT US" */}
        {AddOverview?.length > 0 && (() => {
          const val = AddOverview[0];
          return (
            <div>
              <div className="wwa-block align-items-center">
                <div className="wwa-img-wrap" data-aos="zoom-in-right" data-aos-duration="900" data-aos-delay="50" style={{ order: 1 }}>
                  <img src={`${process.env.REACT_APP_API_URL}/WebManagement/${val?.OverviewImage}`} alt={val.OverviewTitle} className="wwa-img" />
                </div>
                <div className="wwa-content" data-aos="fade-up" data-aos-duration="900" data-aos-delay="150" style={{ order: 2 }}>
                  <h3 className="wwa-title">ABOUT US</h3>
                  <div className="overview-content">{parse(`<div>${val.OverviewDesc}</div>`, parseOptions)}</div>
                </div>
              </div>
            </div>
          );
        })()}
      </Container>

      {/* ── Team ADGP Section — right after About Us ── */}
      {TeamMembers.length > 0 && (
        <div className="team-section">
          <Container>
            <div className="team-header" data-aos="fade-up" data-aos-duration="700">
              <h2 className="team-title">TEAM <span>ADGP</span></h2>
              <p className="team-tagline">Uniting Passion. Driving Excellence.</p>
              <p className="team-subtitle">PASSIONATE BADMINTON ORGANISER</p>
            </div>
            <div className="team-grid">
              {TeamMembers.map((member, i) => (
                <div
                  className="team-card"
                  key={i}
                  data-aos="fade-up"
                  data-aos-duration="700"
                  data-aos-delay={`${i * 100}`}
                  onClick={() => member.MemberInsta && window.open(member.MemberInsta, "_blank", "noopener,noreferrer")}
                  style={{ cursor: member.MemberInsta ? "pointer" : "default", position: "relative" }}
                >
                  {/* Instagram badge — shows on hover */}
                  {member.MemberInsta && (
                    <div className="team-card-insta-badge">
                      <FaInstagram />
                    </div>
                  )}
                  <div className="team-avatar">
                    {member.MemberImage ? (
                      <img src={`${process.env.REACT_APP_API_URL}/TeamMembers/${member.MemberImage}`} alt={member.MemberName}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                    ) : (
                      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="40" cy="28" r="18" fill="#031B77" />
                        <ellipse cx="40" cy="72" rx="28" ry="20" fill="#031B77" />
                      </svg>
                    )}
                  </div>
                  <h4 className="team-member-name">{member.MemberName}</h4>
                  <p className="team-member-desc">{member.MemberDesc}</p>
                </div>
              ))}
            </div>
          </Container>
        </div>
      )}

      {/* ── Remaining overview cards (2nd onwards) ── */}
      <Container>
        {AddOverview?.slice(1).map((val, i) => {
          const isEven = i % 2 === 0;
          return (
            <div key={i}>
              {i === 0 && <div className="wwa-divider" />}
              <div className="wwa-block align-items-center">
                <div className="wwa-img-wrap"
                  data-aos={isEven ? "zoom-in-left" : "zoom-in-right"} data-aos-duration="900" data-aos-delay="50"
                  style={{ order: isEven ? 2 : 1 }}>
                  <img src={`${process.env.REACT_APP_API_URL}/WebManagement/${val?.OverviewImage}`} alt={val.OverviewTitle} className="wwa-img" />
                </div>
                <div className="wwa-content"
                  data-aos="fade-up" data-aos-duration="900" data-aos-delay="150"
                  style={{ order: isEven ? 1 : 2 }}>
                  {val.OverviewTitle && <h3 className="wwa-title">{val.OverviewTitle}</h3>}
                  <div className="overview-content">{parse(`<div>${val.OverviewDesc}</div>`, parseOptions)}</div>
                </div>
              </div>
              {i < AddOverview.slice(1).length - 1 && <div className="wwa-divider" />}
            </div>
          );
        })}
      </Container>
    </div>
  );
};

export default Overview;
