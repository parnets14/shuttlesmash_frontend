import { useState, useEffect } from "react";
import "../Styles/keyhighlight.css";
import "../Styles/overview.css";
import { Container } from "react-bootstrap";
import axios from "axios";
import parse, { domToReact } from "html-react-parser";
import Aos from "aos";
import { IoLogoWhatsapp } from "react-icons/io";

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

const KeyHighlights = () => {
  useEffect(() => {
    Aos.init();
    window.scroll(0, 0);
  });

  const [AddKeyhighlight, setAddKeyhighlight] = useState([]);

  const getAddKeyhighlight = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getkeyhighlight`);
      if (res.status === 200) setAddKeyhighlight(res.data.getkeyhighlight);
    } catch (error) { console.log(error); }
  };

  useEffect(() => { getAddKeyhighlight(); }, []);

  return (
    <div>
      {/* ── Hero Banner ─────────────────────── */}
      <div className="wwa-hero">
        <img src="../Assets/keyhightlights.jpg" alt="Key Highlights" className="wwa-hero-img" />
        <div className="wwa-hero-overlay">
          <h1 data-aos="fade-down" data-aos-duration="700">KEY HIGHLIGHTS</h1>
          <p data-aos="fade-up" data-aos-duration="700" data-aos-delay="100">
            Our mission, achievements and what makes us stand out
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

      <Container>
        {AddKeyhighlight?.map((val, i) => {
          const isEven = i % 2 === 0;
          return (
            <div key={i}>
              <div className="wwa-block align-items-center">

                {/* Image */}
                <div
                  className="wwa-img-wrap"
                  data-aos={isEven ? "zoom-in-right" : "zoom-in-left"}
                  data-aos-duration="900"
                  data-aos-delay="50"
                  style={{ order: isEven ? 1 : 2 }}
                >
                  <img
                    src={`${process.env.REACT_APP_API_URL}/WebManagement/${val?.KeyhighlightImage}`}
                    alt={val.KeyhighlightTitle}
                    className="wwa-img"
                  />
                </div>

                {/* Content */}
                <div
                  className="wwa-content"
                  data-aos="fade-up"
                  data-aos-duration="900"
                  data-aos-delay="150"
                  style={{ order: isEven ? 2 : 1 }}
                >
                  {val.KeyhighlightTitle && (
                    <h3 className="wwa-title">{val.KeyhighlightTitle}</h3>
                  )}
                  <div className="overview-content">
                    {parse(`<div>${val.KeyhighlightDesc}</div>`, parseOptions)}
                  </div>
                </div>

              </div>
              {i < AddKeyhighlight.length - 1 && <div className="wwa-divider" />}
            </div>
          );
        })}
      </Container>
    </div>
  );
};

export default KeyHighlights;
