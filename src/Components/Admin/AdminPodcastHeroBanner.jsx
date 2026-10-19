import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Nav } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { FaMicrophone } from "react-icons/fa";
import "../Admin/Admin.css";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://shuttlesmash.in";

/* ─────────────────────────────────────────────────────────────
   HERO BANNER SECTION
   ───────────────────────────────────────────────────────────── */
const HeroBannerSection = () => {
  const [showAdd,    setShowAdd]    = useState(false);
  const [showEdit,   setShowEdit]   = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [HeroImage,       setHeroImage]       = useState("");
  const [HeroTitle,       setHeroTitle]       = useState("");
  const [HeroDescription, setHeroDescription] = useState("");
  const [editItem,        setEditItem]        = useState(null);
  const [deleteId,        setDeleteId]        = useState("");
  const [bannerList,      setBannerList]      = useState([]);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/getpodcastheroBanner`);
      if (res.status === 200) setBannerList(res.data.getheroBanner || []);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchBanners(); }, []);

  // ADD
  const handleAdd = async () => {
    if (!HeroImage)             return alert("Please upload an image");
    if (!HeroTitle.trim())      return alert("Please enter a title");
    if (!HeroDescription.trim()) return alert("Please enter a description");

    const fd = new FormData();
    fd.append("HeroImage",       HeroImage);
    fd.append("HeroTitle",       HeroTitle);
    fd.append("HeroDescription", HeroDescription);

    try {
      const res = await axios.post(`${API_URL}/api/admin/addpodcastheroBanner`, fd, {
        headers: { "content-type": "multipart/form-data" },
      });
      if (res.status === 200) {
        alert(res.data.success);
        fetchBanners();
        setShowAdd(false);
        setHeroImage(""); setHeroTitle(""); setHeroDescription("");
      }
    } catch (e) { alert(e?.response?.data?.error || "Error adding banner"); }
  };

  // EDIT
  const openEdit = (item) => {
    setEditItem(item);
    setHeroTitle(item.HeroTitle);
    setHeroDescription(item.HeroDescription);
    setHeroImage("");
    setShowEdit(true);
  };

  const handleEdit = async () => {
    const fd = new FormData();
    fd.append("id",              editItem._id);
    fd.append("HeroTitle",       HeroTitle);
    fd.append("HeroDescription", HeroDescription);
    if (HeroImage) fd.append("HeroImage", HeroImage);

    try {
      const res = await axios.put(`${API_URL}/api/admin/editpodcastheroBanner`, fd, {
        headers: { "content-type": "multipart/form-data" },
      });
      if (res.status === 200) { alert(res.data.success); fetchBanners(); setShowEdit(false); }
    } catch (e) { alert(e?.response?.data?.error || "Update failed"); }
  };

  // DELETE
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${API_URL}/api/admin/deletepodcastheroBanner/${deleteId}`);
      if (res.status === 200) { alert(res.data.success); fetchBanners(); setShowDelete(false); }
    } catch (e) { console.log(e); }
  };

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="header-c mb-0">Hero Banner</h4>
        {bannerList.length === 0 && (
          <button className="admin-add-btn" onClick={() => setShowAdd(true)}>Add Banner</button>
        )}
      </div>

      <Table responsive bordered style={{ width: "-webkit-fill-available" }}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Image</th>
            <th>Title</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bannerList.map((item, i) => (
            <tr key={item._id}>
              <td>{i + 1}</td>
              <td>
                <img
                  src={`${API_URL}/PodcastHeroBanner/${item.HeroImage}`}
                  alt="hero"
                  style={{ width: "160px", height: "80px", objectFit: "cover", borderRadius: "6px" }}
                />
              </td>
              <td style={{ paddingTop: "20px" }}>{item.HeroTitle}</td>
              <td style={{ paddingTop: "20px", maxWidth: "260px" }}>{item.HeroDescription}</td>
              <td>
                <div className="d-flex gap-3 justify-content-center" style={{ paddingTop: "16px" }}>
                  <BiSolidEdit
                    className="text-success"
                    style={{ cursor: "pointer", fontSize: "20px" }}
                    onClick={() => openEdit(item)}
                  />
                  <AiFillDelete
                    className="text-danger"
                    style={{ cursor: "pointer", fontSize: "20px" }}
                    onClick={() => { setDeleteId(item._id); setShowDelete(true); }}
                  />
                </div>
              </td>
            </tr>
          ))}
          {bannerList.length === 0 && (
            <tr><td colSpan={5} className="text-center text-muted py-4">No banner added yet.</td></tr>
          )}
        </tbody>
      </Table>

      {/* ADD Modal */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)} style={{ zIndex: 99999 }}>
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
          <Button className="modal-close-btn" variant="" onClick={() => setShowAdd(false)}>Close</Button>
          <Button className="modal-add-btn"   variant="" onClick={handleAdd}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* EDIT Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton><Modal.Title>Edit Podcast Hero Banner</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2">
            <label>Banner Image <small className="text-muted">(leave empty to keep current)</small></label>
            <input type="file" accept="image/*" className="vi_0"
              onChange={e => setHeroImage(e.target.files[0])} />
            {editItem?.HeroImage && !HeroImage && (
              <img src={`${API_URL}/PodcastHeroBanner/${editItem.HeroImage}`}
                alt="current" style={{ marginTop: "8px", height: "60px", borderRadius: "4px" }} />
            )}
          </div>
          <div className="do-sear mt-2">
            <label>Title <span style={{ color: "red" }}>*</span></label>
            <input type="text" className="vi_0" value={HeroTitle}
              onChange={e => setHeroTitle(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>Description <span style={{ color: "red" }}>*</span></label>
            <input type="text" className="vi_0" value={HeroDescription}
              onChange={e => setHeroDescription(e.target.value)} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShowEdit(false)}>Close</Button>
          <Button className="modal-add-btn"   variant="" onClick={handleEdit}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* DELETE Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton><Modal.Title>Delete Hero Banner</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this hero banner?</Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button className="modal-add-btn"   variant="" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   ABOUT SECTION
   ───────────────────────────────────────────────────────────── */
const AboutSection = () => {
  const [showAdd,    setShowAdd]    = useState(false);
  const [showEdit,   setShowEdit]   = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [AboutImage,       setAboutImage]       = useState("");
  const [AboutTitle,       setAboutTitle]       = useState("");
  const [AboutDescription, setAboutDescription] = useState("");
  const [editItem,         setEditItem]         = useState(null);
  const [deleteId,         setDeleteId]         = useState("");
  const [aboutList,        setAboutList]        = useState([]);

  const fetchAbout = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/getpodcastabout`);
      if (res.status === 200) setAboutList(res.data.getAbout || []);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchAbout(); }, []);

  // ADD
  const handleAdd = async () => {
    if (!AboutImage)             return alert("Please upload an image");
    if (!AboutTitle.trim())      return alert("Please enter a title");
    if (!AboutDescription.trim()) return alert("Please enter a description");

    const fd = new FormData();
    fd.append("AboutImage",       AboutImage);
    fd.append("AboutTitle",       AboutTitle);
    fd.append("AboutDescription", AboutDescription);

    try {
      const res = await axios.post(`${API_URL}/api/admin/addpodcastabout`, fd, {
        headers: { "content-type": "multipart/form-data" },
      });
      if (res.status === 200) {
        alert(res.data.success);
        fetchAbout();
        setShowAdd(false);
        setAboutImage(""); setAboutTitle(""); setAboutDescription("");
      }
    } catch (e) { alert(e?.response?.data?.error || "Error adding about section"); }
  };

  // EDIT
  const openEdit = (item) => {
    setEditItem(item);
    setAboutTitle(item.AboutTitle);
    setAboutDescription(item.AboutDescription);
    setAboutImage("");
    setShowEdit(true);
  };

  const handleEdit = async () => {
    const fd = new FormData();
    fd.append("id",               editItem._id);
    fd.append("AboutTitle",       AboutTitle);
    fd.append("AboutDescription", AboutDescription);
    if (AboutImage) fd.append("AboutImage", AboutImage);

    try {
      const res = await axios.put(`${API_URL}/api/admin/editpodcastabout`, fd, {
        headers: { "content-type": "multipart/form-data" },
      });
      if (res.status === 200) { alert(res.data.success); fetchAbout(); setShowEdit(false); }
    } catch (e) { alert(e?.response?.data?.error || "Update failed"); }
  };

  // DELETE
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${API_URL}/api/admin/deletepodcastabout/${deleteId}`);
      if (res.status === 200) { alert(res.data.success); fetchAbout(); setShowDelete(false); }
    } catch (e) { console.log(e); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="header-c mb-0">About the Podcast</h4>
        {aboutList.length === 0 && (
          <button className="admin-add-btn" onClick={() => setShowAdd(true)}>Add About Section</button>
        )}
      </div>

      <Table responsive bordered style={{ width: "-webkit-fill-available" }}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Image</th>
            <th>Title</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {aboutList.map((item, i) => (
            <tr key={item._id}>
              <td>{i + 1}</td>
              <td>
                <img
                  src={`${API_URL}/PodcastAbout/${item.AboutImage}`}
                  alt="about"
                  style={{ width: "160px", height: "80px", objectFit: "cover", borderRadius: "6px" }}
                />
              </td>
              <td style={{ paddingTop: "20px" }}>{item.AboutTitle}</td>
              <td style={{ paddingTop: "20px", maxWidth: "300px" }}>{item.AboutDescription}</td>
              <td>
                <div className="d-flex gap-3 justify-content-center" style={{ paddingTop: "16px" }}>
                  <BiSolidEdit
                    className="text-success"
                    style={{ cursor: "pointer", fontSize: "20px" }}
                    onClick={() => openEdit(item)}
                  />
                  <AiFillDelete
                    className="text-danger"
                    style={{ cursor: "pointer", fontSize: "20px" }}
                    onClick={() => { setDeleteId(item._id); setShowDelete(true); }}
                  />
                </div>
              </td>
            </tr>
          ))}
          {aboutList.length === 0 && (
            <tr><td colSpan={5} className="text-center text-muted py-4">No about section added yet.</td></tr>
          )}
        </tbody>
      </Table>

      {/* ADD Modal */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton><Modal.Title>Add Podcast About Section</Modal.Title></Modal.Header>
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
            <textarea
              className="vi_0"
              rows={4}
              placeholder="Describe the podcast..."
              value={AboutDescription}
              onChange={e => setAboutDescription(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShowAdd(false)}>Close</Button>
          <Button className="modal-add-btn"   variant="" onClick={handleAdd}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* EDIT Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton><Modal.Title>Edit Podcast About Section</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2">
            <label>Image <small className="text-muted">(leave empty to keep current)</small></label>
            <input type="file" accept="image/*" className="vi_0"
              onChange={e => setAboutImage(e.target.files[0])} />
            {editItem?.AboutImage && !AboutImage && (
              <img src={`${API_URL}/PodcastAbout/${editItem.AboutImage}`}
                alt="current" style={{ marginTop: "8px", height: "60px", borderRadius: "4px" }} />
            )}
          </div>
          <div className="do-sear mt-2">
            <label>Title <span style={{ color: "red" }}>*</span></label>
            <input type="text" className="vi_0" value={AboutTitle}
              onChange={e => setAboutTitle(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>Description <span style={{ color: "red" }}>*</span></label>
            <textarea
              className="vi_0"
              rows={4}
              value={AboutDescription}
              onChange={e => setAboutDescription(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShowEdit(false)}>Close</Button>
          <Button className="modal-add-btn"   variant="" onClick={handleEdit}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* DELETE Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton><Modal.Title>Delete About Section</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this about section?</Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button className="modal-add-btn"   variant="" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT — Tabbed view: Hero Banner + About Section
   ───────────────────────────────────────────────────────────── */
const AdminPodcastHeroBanner = () => {
  const [activeTab, setActiveTab] = useState("hero");

  return (
    <div className="customerhead p-2">
      <div className="d-flex align-items-center gap-2 mb-4">
        <FaMicrophone style={{ fontSize: "22px", color: "#1e5fa8" }} />
        <h2 className="header-c mb-0">Podcast — Hero Banner &amp; About Section</h2>
      </div>

      {/* Tabs */}
      <Nav variant="tabs" className="mb-4" activeKey={activeTab} onSelect={k => setActiveTab(k)}>
        <Nav.Item>
          <Nav.Link eventKey="hero" style={{ cursor: "pointer" }}>Hero Banner</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="about" style={{ cursor: "pointer" }}>About Section</Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "hero"  && <HeroBannerSection />}
      {activeTab === "about" && <AboutSection />}
    </div>
  );
};

export default AdminPodcastHeroBanner;
