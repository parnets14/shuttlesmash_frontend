import { useState, useEffect } from "react";
import "../Styles/podcast.css";
import "aos/dist/aos.css";
import { Container } from "react-bootstrap";
import axios from "axios";
import Aos from "aos";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaMicrophone as FaMic, FaPlay as FaPlayIcon } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const API = process.env.REACT_APP_API_URL || "https://shuttlesmash.in";

// Convert any YouTube link (watch / youtu.be / embed / shorts) to an embed URL
const getYouTubeEmbed = (url) => {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1).split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }
      if (u.pathname.startsWith("/embed/")) return url;
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }
    }
  } catch (e) {
    const m = url.match(/(?:v=|\/embed\/|\/shorts\/|\.be\/)([A-Za-z0-9_-]{11})/);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  return "";
};

// Best-effort thumbnail for the grid poster
const getYouTubeThumb = (url) => {
  const embed = getYouTubeEmbed(url);
  if (!embed) return "";
  const id = embed.split("/embed/")[1];
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
};

const Podcast = () => {
  useEffect(() => {
    Aos.init({ once: true, duration: 600 });
    window.scroll(0, 0);
  }, []);

  const [episodes,    setEpisodes]    = useState([]);
  const [heroBanner,  setHeroBanner]  = useState(null);
  const [aboutData,   setAboutData]   = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [lightbox,    setLightbox]    = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [epRes, heroRes, aboutRes] = await Promise.all([
          axios.get(`${API}/api/admin/getpodcast`),
          axios.get(`${API}/api/admin/getpodcastheroBanner`),
          axios.get(`${API}/api/admin/getpodcastabout`),
        ]);
        if (epRes.status === 200)    setEpisodes(epRes.data.getpodcast || []);
        if (heroRes.status === 200)  setHeroBanner((heroRes.data.getheroBanner || [])[0] || null);
        if (aboutRes.status === 200) setAboutData((aboutRes.data.getAbout || [])[0] || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="podcast-page">

      {/* ── Hero Banner ─────────────────────────── */}
      <div
        className="podcast-hero"
        style={
          heroBanner?.HeroImage
            ? {
                backgroundImage: `url(${API}/PodcastHeroBanner/${heroBanner.HeroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        <div className="podcast-hero-overlay">
          <h1>{heroBanner?.HeroTitle || "SPORTS SOUL PODCAST"}</h1>
          <p>{heroBanner?.HeroDescription || "Conversations that move the game forward"}</p>
        </div>
      </div>

      {/* ── Floating WhatsApp ───────────────────── */}
      <div className="fixed-icon">
        <a
          href="https://wa.link/5s5pya"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "unset", textDecoration: "none" }}
        >
          <span className="fixed-icon-rings" />
          <IoLogoWhatsapp
            style={{
              color: "white",
              fontSize: "34px",
              display: "block",
              position: "relative",
              zIndex: 4,
            }}
          />
        </a>
      </div>

      <Container>

        {/* ── About the Podcast ───────────────────── */}
        {aboutData ? (
          <div className="podcast-about" data-aos="fade-up">
            {/* Card 1 — Image */}
            <div className="podcast-about-image-card">
              <img
                src={`${API}/PodcastAbout/${aboutData.AboutImage}`}
                alt={aboutData.AboutTitle || "About the Podcast"}
                className="podcast-about-img"
              />
            </div>
            {/* Card 2 — Text */}
            <div className="podcast-about-text-card">
              <span className="podcast-intro-accent" />
              <h2>{aboutData.AboutTitle || "About the Podcast"}</h2>
              <p>{aboutData.AboutDescription}</p>
            </div>
          </div>
        ) : (
          /* Fallback static about block if nothing is in DB yet */
          <div className="podcast-intro" data-aos="fade-up">
            <span className="podcast-intro-accent" />
            <h2>About the Podcast</h2>
            <p>
              The idea behind Sports Soul's podcast is to connect with the
              badminton community, share valuable insights, and bring inspiring
              stories, experiences, and journeys to a wider audience. We aim to
              inform, motivate, and inspire aspiring players and sports
              enthusiasts through conversations with leaders and achievers in the
              sport.
            </p>
          </div>
        )}

        {/* ── Episode Grid ───────────────────────── */}
        <div className="podcast-content">
          {loading ? (
            <p className="podcast-empty">Loading…</p>
          ) : episodes.length === 0 ? (
            <p className="podcast-empty">Coming soon — great conversations on their way. Stay connected!</p>
          ) : (
            <div className="podcast-grid">
              {episodes.map((item, i) => {
                const embed = getYouTubeEmbed(item.PodcastLink);
                const thumb = getYouTubeThumb(item.PodcastLink);
                return (
                  <div
                    key={i}
                    className="podcast-card"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay={`${(i % 3) * 100}`}
                  >
                    <div
                      className="podcast-thumb"
                      onClick={() => embed && setLightbox(embed)}
                    >
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={item.PodcastTitle}
                          className="podcast-thumb-img"
                        />
                      ) : (
                        <div className="podcast-thumb-fallback">
                          <FaMic />
                        </div>
                      )}
                      <div className="podcast-play-btn">
                        <FaPlayIcon />
                      </div>
                    </div>

                    <div className="podcast-card-body">
                      <h3 className="podcast-card-title">
                        {item.PodcastTitle || "Untitled Episode"}
                      </h3>
                      {item.PodcastDescription && (
                        <p className="podcast-card-desc">
                          {item.PodcastDescription}
                        </p>
                      )}
                      {embed && (
                        <button
                          className="podcast-watch-btn"
                          onClick={() => setLightbox(embed)}
                        >
                          <FaPlayIcon style={{ marginRight: "6px" }} /> Watch on YouTube
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Container>

      {/* ── Video Lightbox ───────────────────────── */}
      {lightbox && (
        <div className="podcast-lightbox" onClick={() => setLightbox(null)}>
          <div
            className="podcast-lightbox-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="podcast-lightbox-close"
              onClick={() => setLightbox(null)}
            >
              <MdClose />
            </button>
            <div className="podcast-lightbox-frame">
              <iframe
                src={lightbox}
                title="Podcast Episode"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Podcast;
