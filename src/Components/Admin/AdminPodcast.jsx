import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Nav } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { FaMicrophone, FaYoutube } from "react-icons/fa";
import "../Admin/Admin.css";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://shuttlesmash.in";

// Convert any YouTube link to embed URL
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

const AdminPodcast = () => {

  /* ══════════════════════════════════════════
     HERO BANNER state
  ══════════════════════════════════════════ */
  const [heroBannerList,    setHeroBannerList]    = useState([]);
  const [showHeroAdd,       setShowHeroAdd]       = useState(false);
  const [showHeroEdit,      setShowHeroEdit]      = useState(false);
  const [showHeroDelete,    setShowHeroDelete]    = useState(false);
  const [heroEditItem,      setHeroEditItem]      = useState(null);
  const [heroDeleteId,      setHeroDeleteId]      = useState("");
  const [HeroImage,         setHeroImage]         = useState("");
  const [HeroTitle,         setHeroTitle]         = useState("");
  const [HeroDescription,   setHeroDescription]   = useState("");

  const fetchHeroBanner = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/getpodcastheroBanner`);
      if (res.status === 200) setHeroBannerList(res.data.getheroBanner || []);
    } catch (e) { console.log(e); }
  };

  const handleHeroAdd = async () => {
    if (!HeroImage)              return alert("Please upload an image");
    if (!HeroTitle.trim())       return alert("Please enter a title");
    if (!HeroDescription.trim()) return alert("Please enter a description");
    const fd = new FormData();
    fd.append("HeroImage", HeroImage);
    fd.append("HeroTitle", HeroTitle);
    fd.append("HeroDescription", HeroDescription);
    try {
      const res = await axios.post(`${API_URL}/api/admin/addpodcastheroBanner`, fd, {
        headers: { "content-type": "multipart/form-data" },
      });
      if (res.status === 200) {
        alert(res.data.success);
        fetchHeroBanner();
        setShowHeroAdd(false);
        setHeroImage(""); setHeroTitle(""); setHeroDescription("");
      }
    } catch (e) { alert(e?.response?.data?.error || "Error adding banner"); }
  };

  const openHeroEdit = (item) => {
    setHeroEditItem(item);
    setHeroTitle(item.HeroTitle);
    setHeroDescription(item.HeroDescription);
    setHeroImage("");
    setShowHeroEdit(true);
  };

  const handleHeroEdit = async () => {
    const fd = new FormData();
    fd.append("id", heroEditItem._id);
    fd.append("HeroTitle", HeroTitle);
    fd.append("HeroDescription", HeroDescription);
    if (HeroImage) fd.append("HeroImage", HeroImage);
    try {
      const res = await axios.put(`${API_URL}/api/admin/editpodcastheroBanner`, fd, {
        headers: { "content-type": "multipart/form-data" },
      });
      if (res.status === 200) { alert(res.data.success); fetchHeroBanner(); setShowHeroEdit(false); }
    } catch (e) { alert(e?.response?.data?.error || "Update failed"); }
  };

  const handleHeroDelete = async () => {
    try {
      const res = await axios.delete(`${API_URL}/api/admin/deletepodcastheroBanner/${heroDeleteId}`);
      if (res.status === 200) { alert(res.data.success); fetchHeroBanner(); setShowHeroDelete(false); }
    } catch (e) { console.log(e); }
  };

  /* ══════════════════════════════════════════
     ABOUT SECTION state
  ══════════════════════════════════════════ */
  const [aboutList,         setAboutList]         = useState([]);
  const [showAboutAdd,      setShowAboutAdd]      = useState(false);
  const [showAboutEdit,     setShowAboutEdit]     = useState(false);
  const [showAboutDelete,   setShowAboutDelete]   = useState(false);
  const [aboutEditItem,     setAboutEditItem]     = useState(null);
  const [aboutDeleteId,     setAboutDeleteId]     = useState("");
  const [AboutImage,        setAboutImage]        = useState("");
  const [AboutTitle,        setAboutTitle]        = useState("");
  const [AboutDescription,  setAboutDescription]  = useState("");

  const fetchAbout = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/getpodcastabout`);
      if (res.status === 200) setAboutList(res.data.getAbout || []);
    } catch (e) { console.log(e); }
  };

  const handleAboutAdd = async () => {
    if (!AboutImage)              return alert("Please upload an image");
    if (!AboutTitle.trim())       return alert("Please enter a title");
    if (!AboutDescription.trim()) return alert("Please enter a description");
    const fd = new FormData();
    fd.append("AboutImage", AboutImage);
    fd.append("AboutTitle", AboutTitle);
    fd.append("AboutDescription", AboutDescription);
    try {
      const res = await axios.post(`${API_URL}/api/admin/addpodcastabout`, fd, {
        headers: { "content-type": "multipart/form-data" },
      });
      if (res.status === 200) {
        alert(res.data.success);
        fetchAbout();
        setShowAboutAdd(false);
        setAboutImage(""); setAboutTitle(""); setAboutDescription("");
      }
    } catch (e) { alert(e?.response?.data?.error || "Error adding about section"); }
  };

  const openAboutEdit = (item) => {
    setAboutEditItem(item);
    setAboutTitle(item.AboutTitle);
    setAboutDescription(item.AboutDescription);
    setAboutImage("");
    setShowAboutEdit(true);
  };

  const handleAboutEdit = async () => {
    const fd = new FormData();
    fd.append("id", aboutEditItem._id);
    fd.append("AboutTitle", AboutTitle);
    fd.append("AboutDescription", AboutDescription);
    if (AboutImage) fd.append("AboutImage", AboutImage);
    try {
      const res = await axios.put(`${API_URL}/api/admin/editpodcastabout`, fd, {
        headers: { "content-type": "multipart/form-data" },
      });
      if (res.status === 200) { alert(res.data.success); fetchAbout(); setShowAboutEdit(false); }
    } catch (e) { alert(e?.response?.data?.error || "Update failed"); }
  };

  const handleAboutDelete = async () => {
    try {
      const res = await axios.delete(`${API_URL}/api/admin/deletepodcastabout/${aboutDeleteId}`);
      if (res.status === 200) { alert(res.data.success); fetchAbout(); setShowAboutDelete(false); }
    } catch (e) { console.log(e); }
  };

  /* ══════════════════════════════════════════
     EPISODES state
  ══════════════════════════════════════════ */
  const [showAdd, setShowAdd] = useState(false);
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => { resetForm(); setShowAdd(true); };

  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const [editItem, setEditItem] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const [deleteId, setDeleteId] = useState("");

  const [PodcastTitle,       setPodcastTitle]       = useState("");
  const [PodcastDescription, setPodcastDescription] = useState("");
  const [PodcastLink,        setPodcastLink]        = useState("");

  const resetForm = () => {
    setPodcastTitle("");
    setPodcastDescription(""); setPodcastLink(""); setEditItem(null);
  };

  const [AddPodcast,   setAddPodcast]   = useState([]);
  const [noChangeData, setNoChangeData] = useState([]);

  const getAddPodcast = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/getpodcast`);
      if (res.status === 200) {
        setAddPodcast(res.data.getpodcast || []);
        setNoChangeData(res.data.getpodcast || []);
      }
    } catch (e) { console.log(e); }
  };

  useEffect(() => {
    fetchHeroBanner();
    fetchAbout();
    getAddPodcast();
  }, []);

  const [search, setSearch] = useState("");
  const handleFilter = (e) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);
    if (term !== "") {
      setAddPodcast(noChangeData.filter((u) =>
        Object.values(u).some((v) => String(v).toLowerCase().includes(term))
      ));
    } else {
      setAddPodcast(noChangeData);
    }
  };

  const [currenpage, setCurrentpage] = useState(1);
  const recordsperpage = 5;
  const lastIndex  = currenpage * recordsperpage;
  const firstIndex = lastIndex - recordsperpage;
  const records    = AddPodcast.slice(firstIndex, lastIndex);
  const npages     = Math.ceil(AddPodcast.length / recordsperpage);
  const numbers    = [...Array(npages + 1).keys()].slice(1);
  const prevpage   = () => currenpage > 1 && setCurrentpage(currenpage - 1);
  const nextpage   = () => currenpage < npages && setCurrentpage(currenpage + 1);

  const AddPodcastDetails = async () => {
    if (!PodcastTitle.trim()) return alert("Please enter a title");
    try {
      const embed = PodcastLink.trim() ? getYouTubeEmbed(PodcastLink.trim()) : "";
      const res = await axios.post(`${API_URL}/api/admin/podcast`, {
        PodcastTitle, PodcastDescription, PodcastLink: embed,
      });
      if (res.status === 200) { alert(res.data.success); getAddPodcast(); handleCloseAdd(); }
    } catch (e) { alert(e.response?.data?.msg || "Failed to add podcast"); }
  };

  const handleShowEdit = (item) => {
    setEditItem(item);
    setPodcastTitle(item.PodcastTitle || "");
    setPodcastDescription(item.PodcastDescription || "");
    setPodcastLink(item.PodcastLink || "");
    setShowEdit(true);
  };

  const EditPodcast = async () => {
    if (!PodcastTitle.trim()) return alert("Please enter a title");
    try {
      const embed = PodcastLink.trim() ? getYouTubeEmbed(PodcastLink.trim()) : "";
      const res = await axios.put(`${API_URL}/api/admin/editpodcast`, {
        id: editItem?._id, PodcastTitle, PodcastDescription, PodcastLink: embed,
      });
      if (res.status === 200) { alert(res.data.success); getAddPodcast(); handleCloseEdit(); }
    } catch (e) { alert(e.response?.data?.error || "Update failed"); }
  };

  const DeletePodcast = async () => {
    try {
      const res = await axios.delete(`${API_URL}/api/admin/Deletepodcast/${deleteId}`);
      if (res.status === 200) { alert("Successfully Deleted"); getAddPodcast(); handleCloseDelete(); }
    } catch (e) { alert(e.response?.data?.msg || "Delete failed"); }
  };

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  const [activeTab, setActiveTab] = useState("hero");

  return (
    <div className="customerhead p-2">

      {/* ── Page heading ── */}
      <h2 className="header-c mb-3">
        <FaMicrophone style={{ marginRight: "8px" }} />
        Sports Soul Podcast
      </h2>

      {/* ── Tabs ── */}
      <Nav variant="tabs" className="mb-4" activeKey={activeTab} onSelect={k => setActiveTab(k)}>
        <Nav.Item>
          <Nav.Link eventKey="hero" style={{ cursor: "pointer", fontWeight: 600 }}>Hero Banner</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="about" style={{ cursor: "pointer", fontWeight: 600 }}>About Section</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="episodes" style={{ cursor: "pointer", fontWeight: 600 }}>Podcast</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* ════════════════════════════════════════
          TAB 1 — Hero Banner
      ════════════════════════════════════════ */}
      {activeTab === "hero" && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0" style={{ color: "#1e5fa8", fontWeight: 700 }}>Hero Banner</h5>
            {heroBannerList.length === 0 && (
              <button className="admin-add-btn" onClick={() => setShowHeroAdd(true)}>Add Banner</button>
            )}
          </div>
          <Table responsive bordered style={{ width: "-webkit-fill-available" }}>
            <thead>
              <tr><th>S.No</th><th>Image</th><th>Title</th><th>Description</th><th>Action</th></tr>
            </thead>
            <tbody>
              {heroBannerList.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted py-3">No hero banner added yet.</td></tr>
              ) : heroBannerList.map((item, i) => (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td>
                    <img src={`${API_URL}/PodcastHeroBanner/${item.HeroImage}`} alt="hero"
                      style={{ width: 140, height: 70, objectFit: "cover", borderRadius: 6 }} />
                  </td>
                  <td style={{ paddingTop: 18 }}>{item.HeroTitle}</td>
                  <td style={{ paddingTop: 18, maxWidth: 260 }}>{item.HeroDescription}</td>
                  <td>
                    <div className="d-flex gap-3 justify-content-center" style={{ paddingTop: 14 }}>
                      <BiSolidEdit className="text-success" style={{ cursor: "pointer", fontSize: 20 }}
                        onClick={() => openHeroEdit(item)} />
                      <AiFillDelete className="text-danger" style={{ cursor: "pointer", fontSize: 20 }}
                        onClick={() => { setHeroDeleteId(item._id); setShowHeroDelete(true); }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* ════════════════════════════════════════
          TAB 2 — About Section
      ════════════════════════════════════════ */}
      {activeTab === "about" && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0" style={{ color: "#1e5fa8", fontWeight: 700 }}>About Section</h5>
            {aboutList.length === 0 && (
              <button className="admin-add-btn" onClick={() => setShowAboutAdd(true)}>Add About</button>
            )}
          </div>
          <Table responsive bordered style={{ width: "-webkit-fill-available" }}>
            <thead>
              <tr><th>S.No</th><th>Image</th><th>Title</th><th>Description</th><th>Action</th></tr>
            </thead>
            <tbody>
              {aboutList.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted py-3">No about section added yet.</td></tr>
              ) : aboutList.map((item, i) => (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td>
                    <img src={`${API_URL}/PodcastAbout/${item.AboutImage}`} alt="about"
                      style={{ width: 140, height: 70, objectFit: "cover", borderRadius: 6 }} />
                  </td>
                  <td style={{ paddingTop: 18 }}>{item.AboutTitle}</td>
                  <td style={{ paddingTop: 18, maxWidth: 280 }}>{item.AboutDescription}</td>
                  <td>
                    <div className="d-flex gap-3 justify-content-center" style={{ paddingTop: 14 }}>
                      <BiSolidEdit className="text-success" style={{ cursor: "pointer", fontSize: 20 }}
                        onClick={() => openAboutEdit(item)} />
                      <AiFillDelete className="text-danger" style={{ cursor: "pointer", fontSize: 20 }}
                        onClick={() => { setAboutDeleteId(item._id); setShowAboutDelete(true); }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* ════════════════════════════════════════
          TAB 3 — Episodes
      ════════════════════════════════════════ */}
      {activeTab === "episodes" && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0" style={{ color: "#1e5fa8", fontWeight: 700 }}>Podcast</h5>
            <div className="d-flex align-items-center gap-2">
              <div className="input-group" style={{ width: 220 }}>
                <span className="input-group-text"><BsSearch /></span>
                <input type="text" className="form-control" placeholder="Search..."
                  value={search} onChange={handleFilter} />
              </div>
              <button className="admin-add-btn" onClick={handleShowAdd}>Add Podcast</button>
            </div>
          </div>
          <div className="mb-3">
            <Table responsive bordered style={{ width: "-webkit-fill-available" }}>
              <thead>
                <tr><th>S.No</th><th>Title</th><th>Description</th><th>Link</th><th>Action</th></tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-muted py-3">No podcast added yet.</td></tr>
                ) : records.map((item, i) => (
                  <tr key={item._id || i}>
                    <td>{i + 1 + firstIndex}</td>
                    <td style={{ paddingTop: 18, fontWeight: 600 }}>{item.PodcastTitle}</td>
                    <td style={{ paddingTop: 18, maxWidth: 260 }}>
                      {item.PodcastDescription
                        ? item.PodcastDescription.length > 80
                          ? item.PodcastDescription.slice(0, 80) + "…"
                          : item.PodcastDescription
                        : "—"}
                    </td>
                    <td style={{ paddingTop: 18 }}>
                      {item.PodcastLink ? (
                        <a href={item.PodcastLink} target="_blank" rel="noopener noreferrer"
                          style={{ color: "#1e5fa8", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <FaYoutube style={{ color: "#ff0000" }} /> Watch
                        </a>
                      ) : "—"}
                    </td>
                    <td>
                      <div className="d-flex gap-3 justify-content-center" style={{ paddingTop: 14 }}>
                        <BiSolidEdit className="text-success" style={{ cursor: "pointer", fontSize: 20 }}
                          onClick={() => handleShowEdit(item)} />
                        <AiFillDelete className="text-danger" style={{ cursor: "pointer", fontSize: 20 }}
                          onClick={() => { setDeleteId(item._id); setShowDelete(true); }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {npages > 1 && (
              <nav><ul className="pagination">
                <li className="not-allow"><span className="next-prev"><a onClick={prevpage}>&lt;</a></span></li>
                {numbers.map((n, i) => (
                  <li className="active-next" key={i}>
                    <a href="#" className="inactive" onClick={() => setCurrentpage(n)}>{n}</a>
                  </li>
                ))}
                <li className="not-allow"><span className="next-prev" onClick={nextpage}>&gt;</span></li>
              </ul></nav>
            )}
          </div>
        </>
      )}

      {/* ════════════ HERO BANNER MODALS ════════════ */}
      {/* Add */}
      <Modal show={showHeroAdd} onHide={() => setShowHeroAdd(false)} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton><Modal.Title>Add Podcast Hero Banner</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2">
            <label>Banner Image <span style={{ color: "red" }}>*</span></label>
            <input type="file" accept="image/*" className="vi_0"
              onChange={e => setHeroImage(e.target.files[0])} />
          </div>
          <div className="do-sear mt-2">
            <label>Title <span style={{ color: "red" }}>*</span></label>
            <input type="text" className="vi_0" placeholder="e.g. SPORTS SOUL PODCAST"
              value={HeroTitle} onChange={e => setHeroTitle(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>Description <span style={{ color: "red" }}>*</span></label>
            <input type="text" className="vi_0" placeholder="e.g. Conversations that move the game forward"
              value={HeroDescription} onChange={e => setHeroDescription(e.target.value)} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShowHeroAdd(false)}>Close</Button>
          <Button className="modal-add-btn"   variant="" onClick={handleHeroAdd}>Add</Button>
        </Modal.Footer>
      </Modal>
      {/* Edit */}
      <Modal show={showHeroEdit} onHide={() => setShowHeroEdit(false)} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton><Modal.Title>Edit Podcast Hero Banner</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2">
            <label>Banner Image <small className="text-muted">(leave empty to keep current)</small></label>
            <input type="file" accept="image/*" className="vi_0"
              onChange={e => setHeroImage(e.target.files[0])} />
            {heroEditItem?.HeroImage && !HeroImage && (
              <img src={`${API_URL}/PodcastHeroBanner/${heroEditItem.HeroImage}`}
                alt="current" style={{ marginTop: 8, height: 60, borderRadius: 4 }} />
            )}
          </div>
          <div className="do-sear mt-2">
            <label>Title <span style={{ color: "red" }}>*</span></label>
            <input type="text" className="vi_0" value={HeroTitle} onChange={e => setHeroTitle(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>Description <span style={{ color: "red" }}>*</span></label>
            <input type="text" className="vi_0" value={HeroDescription} onChange={e => setHeroDescription(e.target.value)} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShowHeroEdit(false)}>Close</Button>
          <Button className="modal-add-btn"   variant="" onClick={handleHeroEdit}>Update</Button>
        </Modal.Footer>
      </Modal>
      {/* Delete */}
      <Modal show={showHeroDelete} onHide={() => setShowHeroDelete(false)} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton><Modal.Title>Delete Hero Banner</Modal.Title></Modal.Header>
        <Modal.Body><p className="fs-5" style={{ color: "red" }}>Are you sure you want to delete this hero banner?</p></Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShowHeroDelete(false)}>Cancel</Button>
          <Button className="modal-add-btn"   variant="" onClick={handleHeroDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* ════════════ ABOUT SECTION MODALS ════════════ */}
      {/* Add */}
      <Modal show={showAboutAdd} onHide={() => setShowAboutAdd(false)} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton><Modal.Title>Add About Section</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2">
            <label>Image <span style={{ color: "red" }}>*</span></label>
            <input type="file" accept="image/*" className="vi_0"
              onChange={e => setAboutImage(e.target.files[0])} />
          </div>
          <div className="do-sear mt-2">
            <label>Title <span style={{ color: "red" }}>*</span></label>
            <input type="text" className="vi_0" placeholder="e.g. About the Podcast"
              value={AboutTitle} onChange={e => setAboutTitle(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>Description <span style={{ color: "red" }}>*</span></label>
            <textarea className="vi_0" rows={4} placeholder="Describe the podcast..."
              value={AboutDescription} onChange={e => setAboutDescription(e.target.value)}
              style={{ resize: "vertical" }} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShowAboutAdd(false)}>Close</Button>
          <Button className="modal-add-btn"   variant="" onClick={handleAboutAdd}>Add</Button>
        </Modal.Footer>
      </Modal>
      {/* Edit */}
      <Modal show={showAboutEdit} onHide={() => setShowAboutEdit(false)} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton><Modal.Title>Edit About Section</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2">
            <label>Image <small className="text-muted">(leave empty to keep current)</small></label>
            <input type="file" accept="image/*" className="vi_0"
              onChange={e => setAboutImage(e.target.files[0])} />
            {aboutEditItem?.AboutImage && !AboutImage && (
              <img src={`${API_URL}/PodcastAbout/${aboutEditItem.AboutImage}`}
                alt="current" style={{ marginTop: 8, height: 60, borderRadius: 4 }} />
            )}
          </div>
          <div className="do-sear mt-2">
            <label>Title <span style={{ color: "red" }}>*</span></label>
            <input type="text" className="vi_0" value={AboutTitle} onChange={e => setAboutTitle(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>Description <span style={{ color: "red" }}>*</span></label>
            <textarea className="vi_0" rows={4} value={AboutDescription}
              onChange={e => setAboutDescription(e.target.value)} style={{ resize: "vertical" }} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShowAboutEdit(false)}>Close</Button>
          <Button className="modal-add-btn"   variant="" onClick={handleAboutEdit}>Update</Button>
        </Modal.Footer>
      </Modal>
      {/* Delete */}
      <Modal show={showAboutDelete} onHide={() => setShowAboutDelete(false)} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton><Modal.Title>Delete About Section</Modal.Title></Modal.Header>
        <Modal.Body><p className="fs-5" style={{ color: "red" }}>Are you sure you want to delete this about section?</p></Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShowAboutDelete(false)}>Cancel</Button>
          <Button className="modal-add-btn"   variant="" onClick={handleAboutDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* ════════════ EPISODE MODALS ════════════ */}
      {/* Add */}
      <Modal show={showAdd} onHide={handleCloseAdd} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton>
          <Modal.Title><FaMicrophone style={{ marginRight: 8 }} />Add Podcast</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2">
            <label>Title <span style={{ color: "red" }}>*</span></label>
            <input type="text" className="vi_0" placeholder="e.g. Rising Through the Ranks"
              value={PodcastTitle} onChange={e => setPodcastTitle(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>Description</label>
            <textarea className="vi_0" rows={3} placeholder="A short summary"
              value={PodcastDescription} onChange={e => setPodcastDescription(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>YouTube Link</label>
            <input type="text" className="vi_0" placeholder="https://www.youtube.com/watch?v=..."
              value={PodcastLink} onChange={e => setPodcastLink(e.target.value)} />
            <small className="text-muted">Paste any YouTube link — it will be embedded automatically.</small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={handleCloseAdd}>Close</Button>
          <Button className="modal-add-btn"   variant="" onClick={AddPodcastDetails}>Add</Button>
        </Modal.Footer>
      </Modal>
      {/* Edit */}
      <Modal show={showEdit} onHide={handleCloseEdit} backdrop="static" style={{ zIndex: 99999 }}>
        <Modal.Header closeButton>
          <Modal.Title><FaMicrophone style={{ marginRight: 8 }} />Edit Podcast</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2">
            <label>Title <span style={{ color: "red" }}>*</span></label>
            <input type="text" className="vi_0" value={PodcastTitle} onChange={e => setPodcastTitle(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>Description</label>
            <textarea className="vi_0" rows={3} value={PodcastDescription} onChange={e => setPodcastDescription(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>YouTube Link</label>
            <input type="text" className="vi_0" value={PodcastLink} onChange={e => setPodcastLink(e.target.value)} />
            <small className="text-muted">Paste any YouTube link — it will be embedded automatically.</small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={handleCloseEdit}>Close</Button>
          <Button className="modal-add-btn"   variant="" onClick={EditPodcast}>Update</Button>
        </Modal.Footer>
      </Modal>
      {/* Delete */}
      <Modal show={showDelete} onHide={handleCloseDelete} backdrop="static" style={{ zIndex: 99999 }}>
        <Modal.Header closeButton><Modal.Title>Warning</Modal.Title></Modal.Header>
        <Modal.Body>
          <p className="fs-4" style={{ color: "red" }}>Are you sure you want to delete this podcast?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={handleCloseDelete}>Close</Button>
          <Button className="modal-add-btn"   variant="" onClick={DeletePodcast}>Delete</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default AdminPodcast;
