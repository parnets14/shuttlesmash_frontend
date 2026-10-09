import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaTrophy, FaArrowLeft } from "react-icons/fa";
import "../Styles/ranking.css";

const Ranking = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Aos.init({ once: true });
    window.scroll(0, 0);
  }, []);

  // "COMING SOON" split into letters for staggered animation
  const title = "COMING SOON";

  return (
    <div className="ranking-page">
      {/* Floating WhatsApp */}
      <div className="fixed-icon">
        <a
          href="https://wa.link/5s5pya"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "unset", textDecoration: "none" }}
        >
          <span className="fixed-icon-rings" />
          <IoLogoWhatsapp
            style={{ color: "white", fontSize: "34px", display: "block", position: "relative", zIndex: 4 }}
          />
        </a>
      </div>

      <div className="rk-coming">
        {/* Trophy badge */}
        <div className="rk-badge" data-aos="zoom-in" data-aos-duration="700">
          <span className="rk-badge-ring" />
          <FaTrophy className="rk-badge-icon" />
        </div>

        <span className="rk-pill" data-aos="fade-up" data-aos-duration="700">
          RANKING CIRCUIT
        </span>

        {/* Big COMING SOON — single line, animated letters */}
        <h1 className="rk-bigtitle" aria-label={title}>
          {title.split("").map((ch, i) => (
            <span
              key={i}
              className={`rk-letter${ch === " " ? " rk-space" : ""}`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </h1>

        <p className="rk-text" data-aos="fade-up" data-aos-duration="700" data-aos-delay="200">
          We're building the Shuttle Smash Ranking Circuit. Live player rankings,
          leaderboards and point tables are on the way. Stay tuned!
        </p>

        {/* Progress bar */}
        <div className="rk-progress" data-aos="fade-up" data-aos-duration="700" data-aos-delay="250">
          <span className="rk-progress-fill" />
        </div>

        <button
          className="rk-back-btn"
          onClick={() => navigate("/")}
          data-aos="fade-up"
          data-aos-duration="700"
          data-aos-delay="300"
        >
          <FaArrowLeft /> Back to Home
        </button>
      </div>
    </div>
  );
};

export default Ranking;
