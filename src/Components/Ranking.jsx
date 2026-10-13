import { useEffect, useState, useMemo } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaTrophy, FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import { GiShuttlecock } from "react-icons/gi";
import "../Styles/ranking.css";

/* the tournament buttons offered on the ranking card */
const TOURNAMENT_TYPES = ["Junior Ranking", "Senior Ranking", "Master Ranking"];

/* the ranking group behind a tournament type — newest year wins */
const groupForType = (groups, type) =>
  groups
    .filter((g) => String(g.Title || "").trim().toLowerCase() === String(type).trim().toLowerCase())
    .sort((a, b) => (Number(b.Year) || 0) - (Number(a.Year) || 0))[0] || null;

const Ranking = () => {
  const navigate = useNavigate();
  const [groups,       setGroups]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [selectedType, setSelectedType] = useState(null);
  const [notice,       setNotice]       = useState("");
  const [HeroBanner,   setHeroBanner]   = useState(null);

  useEffect(() => {
    Aos.init({ once: true });
    window.scroll(0, 0);
    fetchGroups();

    /* hero banner — uploaded from the admin panel (Ranking Circuit → Hero Banner) */
    axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getrankingheroBanner`)
      .then((r) => {
        if (r.status === 200 && r.data.getheroBanner?.length > 0) setHeroBanner(r.data.getheroBanner[0]);
      })
      .catch((e) => console.log(e));
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/activerankinggroups`
      );
      setGroups(Array.isArray(res?.data?.groups) ? res.data.groups : []);
    } catch {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const goToDetail = (group) => {
    navigate(`/ranking/${group._id}`);
  };

  /* the buttons = the three tournament types, plus any active ranking whose title
     isn't one of them (so older custom rankings stay reachable) */
  const typeList = useMemo(() => {
    const extra = groups
      .map((g) => String(g.Title || "").trim())
      .filter((t) => t && !TOURNAMENT_TYPES.some((x) => x.toLowerCase() === t.toLowerCase()));
    return [...TOURNAMENT_TYPES, ...Array.from(new Set(extra))];
  }, [groups]);

  /* nothing is pre-selected — the visitor picks an age group first */
  const selectedGroup = selectedType ? groupForType(groups, selectedType) : null;

  /* every tournament button stays clickable — when a ranking isn't published yet
     we say so politely instead of silently doing nothing */
  const notPublished = (type) =>
    `Rankings for ${type} aren't published yet — please check back soon.`;

  const pickType = (type) => {
    setSelectedType(type);
    setNotice(groupForType(groups, type) ? "" : notPublished(type));
  };

  const checkMyRank = () => {
    if (!selectedType) {
      setNotice("Please choose your age group category first.");
      return;
    }
    if (selectedGroup) { setNotice(""); goToDetail(selectedGroup); return; }
    setNotice(notPublished(selectedType));
  };

  return (
    <div className="ranking-page">

      {/* Floating WhatsApp */}
      <div className="fixed-icon">
        <a href="https://wa.link/5s5pya" target="_blank" rel="noopener noreferrer"
          style={{ color: "unset", textDecoration: "none" }}>
          <span className="fixed-icon-rings" />
          <IoLogoWhatsapp style={{ color:"white", fontSize:"34px",
            display:"block", position:"relative", zIndex:4 }} />
        </a>
      </div>

      {/* ── Hero banner (managed from the admin panel) ── */}
      <div className="rk-hero-header">
        <img
          src={HeroBanner
            ? `${process.env.REACT_APP_API_URL}/RankingHeroBanner/${HeroBanner.HeroImage}`
            : `${process.env.PUBLIC_URL}/Assets/eventbg1.jpg`}
          alt="Ranking Circuit"
          className="rk-hero-bg"
        />
        <div className="rk-hero-overlay">
          <div className="rk-hero-inner" data-aos="fade-down" data-aos-duration="700">
            <GiShuttlecock className="rk-hero-shuttle" />
            <div>
              <h1 className="rk-hero-title">{HeroBanner?.HeroTitle || "RANKING CIRCUIT"}</h1>
              <p className="rk-hero-sub">
                {HeroBanner?.HeroDescription || "Official Shuttle Smash Player Rankings"}
              </p>
            </div>
            <GiShuttlecock className="rk-hero-shuttle rk-flip" />
          </div>
        </div>
      </div>

      <Container>

        {/* loading */}
        {loading && (
          <div className="rk-center-msg">
            <GiShuttlecock className="rk-spin" />
            <p>Loading rankings…</p>
          </div>
        )}

        {/* no groups → coming soon */}
        {!loading && groups.length === 0 && (
          <div className="rk-coming" data-aos="fade-up" data-aos-duration="700">
            <div className="rk-cs-badge">
              <span className="rk-cs-ring" />
              <FaTrophy className="rk-cs-trophy" />
            </div>
            <span className="rk-cs-pill">RANKING CIRCUIT</span>
            <h1 className="rk-cs-title" aria-label="COMING SOON">
              {"COMING SOON".split("").map((ch, i) => (
                <span key={i}
                  className={`rk-letter${ch===" "?" rk-space":""}`}
                  style={{ animationDelay:`${i*0.07}s` }}>
                  {ch===" " ? "\u00A0" : ch}
                </span>
              ))}
            </h1>
            <p className="rk-cs-text">
              We're building the Shuttle Smash Ranking Circuit. Live player rankings,
              leaderboards and point tables are on the way. Stay tuned!
            </p>
            <div className="rk-cs-bar"><span className="rk-cs-fill" /></div>
            <button className="rk-cs-btn" onClick={() => navigate("/")}>
              <FaArrowLeft /> Back to Home
            </button>
          </div>
        )}

        {/* ranking card — pick a tournament, then check your rank */}
        {!loading && groups.length > 0 && (
          <div className="rk-groups">
            <div className="rk-pick">
              <p className="rk-pick-kicker">Choose your age group category</p>

              <div className="rk-type-btns">
                {typeList.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`rk-type-btn${selectedType === t ? " active" : ""}`}
                    title={`View the ${t} leaderboard`}
                    onClick={() => pickType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button className="rk-check-btn" onClick={checkMyRank}>
                CHECK MY RANK <span className="rk-btn-arrow">→</span>
              </button>

              {notice && (
                <p className="rk-pick-note" key={notice}>
                  <FaInfoCircle className="rk-pick-note-icon" />
                  <span>{notice}</span>
                </p>
              )}
            </div>
          </div>
        )}

      </Container>
    </div>
  );
};

export default Ranking;
