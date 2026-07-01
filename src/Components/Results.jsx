import { useState, useEffect } from "react";
import "../Styles/results.css";
import { Container } from "react-bootstrap";
import axios from "axios";
import Aos from "aos";
import "aos/dist/aos.css";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaArrowAltCircleRight } from "react-icons/fa";

const Results = () => {
  useEffect(() => {
    Aos.init({ once: true });
    window.scroll(0, 0);
  }, []);

  // ── Double Results ──────────────────────────────
  const [AddDounbleResult, setAddDounbleResult] = useState([]);
  const getAddDounbleResult = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getresults`);
      if (res.status === 200) setAddDounbleResult(res.data.getresults);
    } catch (error) { console.log(error); }
  };

  // ── Achievers ────────────────────────────────────
  const [AddAchivers, setAddAchivers] = useState([]);
  const getAddAchivers = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getachivers`);
      if (res.status === 200) setAddAchivers(res.data.getachivers);
    } catch (error) { console.log(error); }
  };

  useEffect(() => {
    getAddDounbleResult();
    getAddAchivers();
  }, []);

  // ── Pagination ───────────────────────────────────
  const [currenpage, setCurrentpage] = useState(1);
  const recordsperpage = 10;
  const lastIndex = currenpage * recordsperpage;
  const firstIndex = lastIndex - recordsperpage;
  const records = AddDounbleResult.slice(firstIndex, lastIndex);
  const npages = Math.ceil(AddDounbleResult.length / recordsperpage);
  const numbers = [...Array(npages + 1).keys()].slice(1);

  function prevpage() {
    if (currenpage > 1) setCurrentpage(currenpage - 1);
  }
  function nextpage() {
    if (currenpage < npages) setCurrentpage(currenpage + 1);
  }

  // ── Lightbox ─────────────────────────────────────
  const [lightbox, setLightbox] = useState(null);

  const positionBadge = (pos) => {
    const p = pos?.trim();
    if (p === "1st") return <span className="badge-pos gold">🥇 1st Place</span>;
    if (p === "2nd") return <span className="badge-pos silver">🥈 2nd Place</span>;
    if (p === "3rd") return <span className="badge-pos bronze">🥉 3rd Place</span>;
    return <span className="badge-pos default">{pos}</span>;
  };

  return (
    <div className="results-page">

      {/* ── Hero Banner ─────────────────────────── */}
      <div className="result-hero">
        <img src="../Assets/results.jpg" alt="Results" className="result-hero-img" />
        <div className="result-hero-overlay">
          <h1>RESULTS</h1>
          <p>Celebrating every champion on the court</p>
        </div>
      </div>

      {/* ── Floating WhatsApp ───────────────────── */}
      <div className="fixed-icon">
        <a href="https://wa.link/5s5pya" target="_blank" rel="noopener noreferrer"
          style={{ color: "unset", textDecoration: "none" }}>
          <span className="fixed-icon-rings" />
          <IoLogoWhatsapp style={{ color: "white", fontSize: "34px", display: "block", position: "relative", zIndex: 4 }} />
        </a>
      </div>

      <Container>

        {/* ── Results Table ────────────────────── */}
        <div className="result-section" data-aos="fade-up" data-aos-duration="700">
          <h2 className="headdings mb-4">Previous Tournament Results</h2>

          <div className="result-table-card">
            {AddDounbleResult.length === 0 ? (
              <div className="no-data">No results available yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="result-sheet">
                  <colgroup>
                    <col style={{ width: "6%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "28%" }} />
                    <col style={{ width: "28%" }} />
                    <col style={{ width: "18%" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>SL.NO</th>
                      <th style={{ textAlign: "left" }}>Category</th>
                      <th style={{ textAlign: "left" }}>Player 1</th>
                      <th style={{ textAlign: "left" }}>Player 2</th>
                      <th style={{ textAlign: "center" }}>Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((val, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? "row-even" : "row-odd"}
                        data-aos="fade-up"
                        data-aos-duration="400"
                        data-aos-delay={`${i * 40}`}
                      >
                        <td className="sl">{i + 1 + firstIndex}</td>
                        <td style={{ textAlign: "left" }}><span className="cat-tag">{val.ResultCategory}</span></td>
                        <td className="pname" style={{ textAlign: "left" }}>{val.FirstPlayername}</td>
                        <td className="pname" style={{ textAlign: "left" }}>{val.SecondPlayername || "—"}</td>
                        <td style={{ textAlign: "center" }}>{positionBadge(val.Position)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {npages > 1 && (
              <div className="result-pagination">
                <button className="pg-btn" onClick={prevpage} disabled={currenpage === 1}>‹ Prev</button>
                {numbers.map((n) => (
                  <button key={n} className={`pg-btn ${currenpage === n ? "pg-active" : ""}`}
                    onClick={() => setCurrentpage(n)}>{n}</button>
                ))}
                <button className="pg-btn" onClick={nextpage} disabled={currenpage === npages}>Next ›</button>
              </div>
            )}
          </div>
        </div>

        {/* ── Achievers ────────────────────────── */}
        {AddAchivers.length > 0 && (
          <div className="achievers-section">
            <div className="achievers-heading-row">
              <h2 className="headdings">Our Achievers</h2>
              <a href="/gallery" className="view-more-btn">
                View More <FaArrowAltCircleRight style={{ marginLeft: "6px" }} />
              </a>
            </div>

            <div className="achievers-grid">
              {AddAchivers.map((val, i) => (
                <div
                  key={i}
                  className="achiever-card"
                  data-aos="zoom-in-up"
                  data-aos-duration="650"
                  data-aos-delay={`${(i % 3) * 120}`}
                  onClick={() => setLightbox({
                    src: `${process.env.REACT_APP_API_URL}/Achivers/${val?.AchiversImage}`,
                    name: val.AchiversText
                  })}
                >
                  <div className="achiever-img-wrap">
                    <img
                      src={`${process.env.REACT_APP_API_URL}/Achivers/${val?.AchiversImage}`}
                      alt={val.AchiversText}
                      className="achiever-img"
                    />
                    <div className="achiever-overlay">
                      <span className="view-hint">Click to view</span>
                    </div>
                  </div>
                  <div className="achiever-name">{val.AchiversText}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </Container>

      {/* ── Lightbox ─────────────────────────── */}
      {lightbox && (
        <div className="lightbox-backdrop" onClick={() => setLightbox(null)}>
          <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <img src={lightbox.src} alt={lightbox.name} className="lightbox-img" />
            {lightbox.name && <div className="lightbox-caption">{lightbox.name}</div>}
          </div>
        </div>
      )}

    </div>
  );
};

export default Results;
