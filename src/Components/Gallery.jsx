import { useState, useEffect } from "react";
import "../Styles/gallery.css";
import "aos/dist/aos.css";
import { Container } from "react-bootstrap";
import axios from "axios";
import Aos from "aos";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaImages, FaVideo, FaSearchPlus, FaDownload } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const Gallery = () => {
  useEffect(() => {
    Aos.init({ once: true, duration: 600 });
    window.scroll(0, 0);
  }, []);

  const [activeTab, setActiveTab] = useState("images");

  // Gallery Images
  const [AddGallery, setAddGallery] = useState([]);
  const getAddGallery = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getgallery`);
      if (res.status === 200) setAddGallery(res.data.getgallery);
    } catch (error) { console.log(error); }
  };

  // Gallery Videos
  const [AddGalleryvideo, setAddGalleryvideo] = useState([]);
  const getAddGalleryvideo = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getgalleryvedio`);
      if (res.status === 200) setAddGalleryvideo(res.data.getgalleryvedio);
    } catch (error) { console.log(error); }
  };

  useEffect(() => {
    getAddGallery();
    getAddGalleryvideo();
  }, []);

  // Lightbox with navigation
  const [lightbox, setLightbox] = useState(null);

  const openLightbox = (album, imgIndex) => {
    setLightbox({
      images: album.PlaceImages,
      currentIndex: imgIndex,
      title: album.GalleryTitle
    });
  };

  const lightboxPrev = () => {
    if (!lightbox) return;
    setLightbox(prev => ({
      ...prev,
      currentIndex: prev.currentIndex > 0 ? prev.currentIndex - 1 : prev.images.length - 1
    }));
  };

  const lightboxNext = () => {
    if (!lightbox) return;
    setLightbox(prev => ({
      ...prev,
      currentIndex: prev.currentIndex < prev.images.length - 1 ? prev.currentIndex + 1 : 0
    }));
  };

  return (
    <div className="gallery-page">

      {/* ── Hero Banner ─────────────────────────── */}
      <div className="gallery-hero">
        <img src="../Assets/gallery.png" alt="Gallery" className="gallery-hero-img" />
        <div className="gallery-hero-overlay">
          <h1>GALLERY</h1>
          <p>Relive the moments — every match, every memory</p>
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

        {/* ── Tab Switcher ──────────────────────── */}
        <div className="gallery-tabs" data-aos="fade-up" data-aos-delay="100">
          <button
            className={`gallery-tab ${activeTab === "images" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("images")}
          >
            <FaImages style={{ marginRight: "8px" }} /> Photos
          </button>
          <button
            className={`gallery-tab ${activeTab === "videos" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("videos")}
          >
            <FaVideo style={{ marginRight: "8px" }} /> Videos
          </button>
        </div>

        {/* ── Images Tab ────────────────────────── */}
        {activeTab === "images" && (
          <div className="gallery-content">
            {AddGallery.length === 0 ? (
              <p className="gallery-empty">No photos available yet.</p>
            ) : (
              AddGallery.map((album, i) => (
                <div key={i} className="gallery-album" data-aos="fade-up" data-aos-delay={`${i * 80}`}>
                  <div className="album-title-row">
                    <span className="album-accent" />
                    <h3 className="album-title">{album.GalleryTitle}</h3>
                    <button className="album-download-all-btn"
                      onClick={async () => {
                        for (let idx = 0; idx < album.PlaceImages.length; idx++) {
                          const img = album.PlaceImages[idx];
                          try {
                            const res = await fetch(`${process.env.REACT_APP_API_URL}/Gallery/${img?.placepicture}`);
                            const blob = await res.blob();
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = img?.placepicture || `image-${idx + 1}.jpg`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            URL.revokeObjectURL(url);
                            // Small delay so browser doesn't block multiple downloads
                            await new Promise(r => setTimeout(r, 500));
                          } catch (err) { console.log(err); }
                        }
                      }}>
                      <FaDownload style={{ marginRight: "6px" }} /> Download All
                    </button>
                  </div>
                  <div className="gallery-grid">
                    {album.PlaceImages?.map((img, j) => (
                      <div
                        key={j}
                        className="gallery-item"
                        data-aos="zoom-in"
                        data-aos-duration="500"
                        data-aos-delay={`${j * 60}`}
                        onClick={() => openLightbox(album, j)}
                      >
                        <img
                          src={`${process.env.REACT_APP_API_URL}/Gallery/${img?.placepicture}`}
                          alt={album.GalleryTitle}
                          className="gallery-img"
                        />
                        <div className="gallery-item-overlay">
                        </div>
                        {/* Download button */}
                        <button
                          className="gallery-download-btn"
                          title="Download"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              const res = await fetch(`${process.env.REACT_APP_API_URL}/Gallery/${img?.placepicture}`);
                              const blob = await res.blob();
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = img?.placepicture || "gallery-image.jpg";
                              document.body.appendChild(a);
                              a.click();
                              a.remove();
                              URL.revokeObjectURL(url);
                            } catch (err) {
                              window.open(`${process.env.REACT_APP_API_URL}/Gallery/${img?.placepicture}`, "_blank");
                            }
                          }}
                        >
                          <FaDownload />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Videos Tab ────────────────────────── */}
        {activeTab === "videos" && (
          <div className="gallery-content">
            {AddGalleryvideo.length === 0 ? (
              <p className="gallery-empty">No videos available yet.</p>
            ) : (
              <div className="video-grid">
                {AddGalleryvideo.map((item, i) => (
                  <div
                    key={i}
                    className="video-card"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay={`${(i % 3) * 100}`}
                  >
                    <video
                      controls
                      className="video-player"
                      preload="metadata"
                    >
                      <source
                        src={`${process.env.REACT_APP_API_URL}/Gallery/${item?.GalleryVedio}`}
                        type="video/mp4"
                      />
                    </video>
                    {item.GalleryVedioTitle && (
                      <div className="video-title">{item.GalleryVedioTitle}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </Container>

      {/* ── Lightbox ─────────────────────────────── */}
      {lightbox && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
          <div className="gallery-lightbox-box" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-lightbox-close" onClick={() => setLightbox(null)}>
              <MdClose />
            </button>

            {/* Left arrow */}
            {lightbox.images.length > 1 && (
              <button className="gallery-lightbox-arrow gallery-arrow-left" onClick={lightboxPrev}>
                ‹
              </button>
            )}

            <img
              src={`${process.env.REACT_APP_API_URL}/Gallery/${lightbox.images[lightbox.currentIndex]?.placepicture}`}
              alt={lightbox.title}
              className="gallery-lightbox-img"
            />

            {/* Right arrow */}
            {lightbox.images.length > 1 && (
              <button className="gallery-lightbox-arrow gallery-arrow-right" onClick={lightboxNext}>
                ›
              </button>
            )}

            {lightbox.title && (
              <div className="gallery-lightbox-caption">
                {lightbox.title} ({lightbox.currentIndex + 1}/{lightbox.images.length})
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Gallery;
