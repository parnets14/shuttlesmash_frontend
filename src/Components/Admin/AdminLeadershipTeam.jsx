import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Image } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import "../Admin/Admin.css";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const AdminLeadershipTeam = () => {
  // ── Tabs ─────────────────────────────────────
  const [activeTab, setActiveTab] = useState("members"); // "members" | "herobanner"

  // ── Member Modal states ───────────────────────
  const [show,  setShow]  = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);

  // ── Member Form state ─────────────────────────
  const [MemberImage, setMemberImage] = useState("");
  const [MemberName,  setMemberName]  = useState("");
  const [MemberRole,  setMemberRole]  = useState("");
  const [MemberDesc,  setMemberDesc]  = useState("");
  const [MemberInsta, setMemberInsta] = useState("");

  // ── Add Member ────────────────────────────────
  const AddMember = async () => {
    if (!MemberName) return alert("Please enter member name");
    if (!MemberRole) return alert("Please enter member role");
    const formdata = new FormData();
    formdata.append("MemberImage", MemberImage);
    formdata.append("MemberName",  MemberName);
    formdata.append("MemberRole",  MemberRole);
    formdata.append("MemberDesc",  MemberDesc);
    formdata.append("MemberInsta", MemberInsta || "");
    try {
      const res = await axios({ url: "admin/addleadershipmember", method: "post",
        baseURL: `${API_URL}/api/`, headers: { "content-type": "multipart/form-data" }, data: formdata });
      if (res.status === 200) {
        alert(res.data.success); getMembers(); setShow(false);
        setMemberImage(""); setMemberName(""); setMemberRole(""); setMemberDesc(""); setMemberInsta("");
      }
    } catch (e) { alert(e.response?.data?.msg || "Error adding member"); }
  };

  // ── Get Members ───────────────────────────────
  const [members, setMembers] = useState([]);
  const [nochangedata, setNoChangeData] = useState([]);
  const getMembers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/getleadershipteam`);
      if (res.status === 200) {
        setMembers(res.data.getleadershipteam || []);
        setNoChangeData(res.data.getleadershipteam || []);
      }
    } catch (e) { console.log(e); }
  };

  // ── Delete Member ─────────────────────────────
  const [deleteId, setDeleteId] = useState("");
  const DeleteMember = async () => {
    try {
      await axios({ url: `admin/deleteleadershipmember/${deleteId}`, method: "delete", baseURL: `${API_URL}/api/` });
      alert("Deleted Successfully"); getMembers(); setShow4(false);
    } catch (e) { alert("Cannot delete"); }
  };

  // ── Edit Member ───────────────────────────────
  const [editItem, setEditItem] = useState(null);
  const handleShowEdit = (item) => {
    setEditItem(item); setMemberName(item.MemberName); setMemberRole(item.MemberRole);
    setMemberDesc(item.MemberDesc || ""); setMemberInsta(item.MemberInsta || "");
    setMemberImage(""); setShow3(true);
  };
  const EditMember = async () => {
    const formdata = new FormData();
    formdata.append("id", editItem._id); formdata.append("MemberImage", MemberImage);
    formdata.append("MemberName", MemberName); formdata.append("MemberRole", MemberRole);
    formdata.append("MemberDesc", MemberDesc); formdata.append("MemberInsta", MemberInsta || "");
    try {
      const res = await axios({ url: "admin/editleadershipmember", method: "put",
        baseURL: `${API_URL}/api/`, headers: { "content-type": "multipart/form-data" }, data: formdata });
      if (res.status === 200) { alert("Updated Successfully"); getMembers(); setShow3(false); }
    } catch (e) { alert("Cannot update"); }
  };

  useEffect(() => { getMembers(); }, []);

  // ── Pagination ────────────────────────────────
  const [currenpage, setCurrentpage] = useState(1);
  const recordsperpage = 5;
  const safeMembers = members || [];
  const lastIndex  = currenpage * recordsperpage;
  const firstIndex = lastIndex - recordsperpage;
  const records    = safeMembers.slice(firstIndex, lastIndex);
  const npages     = Math.ceil(safeMembers.length / recordsperpage);
  const numbers    = [...Array(npages + 1).keys()].slice(1);

  // ── Search ────────────────────────────────────
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setMembers(term ? nochangedata.filter(m => Object.values(m).some(v => String(v).toLowerCase().includes(term))) : nochangedata);
  };

  // ══ HERO BANNER STATE ════════════════════════
  const [HeroImage, setHeroImage] = useState("");
  const [HeroTitle, setHeroTitle] = useState("");
  const [HeroDescription, setHeroDescription] = useState("");
  const [AddHeroBanner, setAddHeroBanner] = useState([]);
  const [editHeroItem, setEditHeroItem] = useState(null);
  const [deleteHeroId, setDeleteHeroId] = useState("");
  const [showHeroAdd, setShowHeroAdd] = useState(false);
  const [showHeroEdit, setShowHeroEdit] = useState(false);
  const [showHeroDel, setShowHeroDel] = useState(false);

  const getHeroBanner = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/getleadershipheroBanner`);
      if (res.status === 200) setAddHeroBanner(res.data.getheroBanner || []);
    } catch (e) { if (e.response?.status !== 404) console.log(e); }
  };

  const addHeroBanner = async () => {
    if (!HeroImage)              return alert("Please upload an image");
    if (!HeroTitle.trim())       return alert("Please enter a title");
    if (!HeroDescription.trim()) return alert("Please enter a description");
    const fd = new FormData();
    fd.append("HeroImage", HeroImage); fd.append("HeroTitle", HeroTitle); fd.append("HeroDescription", HeroDescription);
    try {
      const res = await axios.post(`${API_URL}/api/admin/addleadershipheroBanner`, fd, { headers: { "content-type": "multipart/form-data" } });
      if (res.status === 200) { alert(res.data.success); getHeroBanner(); setShowHeroAdd(false); setHeroImage(""); setHeroTitle(""); setHeroDescription(""); }
    } catch (e) { alert(e?.response?.data?.error || "Error"); }
  };

  const editHeroBanner = async () => {
    const fd = new FormData();
    fd.append("id", editHeroItem._id); fd.append("HeroTitle", HeroTitle); fd.append("HeroDescription", HeroDescription);
    if (HeroImage) fd.append("HeroImage", HeroImage);
    try {
      const res = await axios.put(`${API_URL}/api/admin/editleadershipheroBanner`, fd, { headers: { "content-type": "multipart/form-data" } });
      if (res.status === 200) { alert(res.data.success); getHeroBanner(); setShowHeroEdit(false); }
    } catch (e) { alert(e?.response?.data?.error || "Update failed"); }
  };

  const deleteHeroBanner = async () => {
    try {
      const res = await axios.delete(`${API_URL}/api/admin/deleteleadershipheroBanner/${deleteHeroId}`);
      if (res.status === 200) { alert(res.data.success); getHeroBanner(); setShowHeroDel(false); }
    } catch (e) { alert(e?.response?.data?.error || "Delete failed"); }
  };

  useEffect(() => { getHeroBanner(); }, []);

  return (
    <div className="customerhead p-2">

      {/* Tab Buttons */}
      <div className="d-flex gap-3 mb-3">
        <Button onClick={() => setActiveTab("members")}
          style={{ background: activeTab === "members" ? "#031B77" : "#6c757d", border: "none" }}>
          Leadership Team
        </Button>
        <Button onClick={() => setActiveTab("herobanner")}
          style={{ background: activeTab === "herobanner" ? "#031B77" : "#6c757d", border: "none" }}>
          Hero Banner
        </Button>
      </div>

      {/* ══ MEMBERS TAB ══ */}
      {activeTab === "members" && (<>
        <div className="col-lg-4 d-flex justify-content-center mt-3">
          <div className="input-group">
            <span className="input-group-text"><BsSearch /></span>
            <input type="text" className="form-control" placeholder="Search..." onChange={handleSearch} />
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <h2 className="header-c">Leadership Team</h2>
          <button className="admin-add-btn" onClick={() => setShow(true)}>Add Member</button>
        </div>

        <div className="mb-3">
          <Table responsive bordered style={{ width: "-webkit-fill-available" }}>
            <thead>
              <tr>
                <th style={{ width: "60px" }}>S.No</th>
                <th style={{ width: "100px" }}>Photo</th>
                <th style={{ width: "160px" }}>Name</th>
                <th style={{ width: "220px" }}>Role</th>
                <th>Description</th>
                <th style={{ width: "90px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {records?.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1 + firstIndex}</td>
                  <td>
                    {item.MemberImage ? (
                      <img src={`${API_URL}/LeadershipTeam/${item.MemberImage}`} alt={item.MemberName}
                        style={{ width: "70px", height: "70px", objectFit: "cover", objectPosition: "top", borderRadius: "50%", border: "2px solid #031B77" }} />
                    ) : (
                      <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "#e8eeff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "700", color: "#031B77" }}>
                        {item.MemberName?.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: "700", verticalAlign: "middle" }}>{item.MemberName}</td>
                  <td style={{ verticalAlign: "middle", fontSize: "13px" }}>{item.MemberRole}</td>
                  <td style={{ fontSize: "13px", verticalAlign: "middle", maxWidth: "300px" }}>
                    <div style={{ maxHeight: "80px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
                      {item.MemberDesc}
                    </div>
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                      <BiSolidEdit className="text-success" style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => handleShowEdit(item)} />
                      <AiFillDelete className="text-danger" style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => { setDeleteId(item._id); setShow4(true); }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <nav><ul className="pagination">
            <li className="not-allow"><span className="next-prev"><a onClick={() => currenpage > 1 && setCurrentpage(currenpage - 1)}>&lt;</a></span></li>
            {numbers.map((n, i) => (<li className="active-next" key={i}><a href="#" className={currenpage === n ? "active" : "inactive"} onClick={() => setCurrentpage(n)}>{n}</a></li>))}
            <li className="not-allow"><span className="next-prev" onClick={() => currenpage < npages && setCurrentpage(currenpage + 1)}>&gt;</span></li>
          </ul></nav>
        </div>
      </>)}

      {/* ══ HERO BANNER TAB ══ */}
      {activeTab === "herobanner" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="header-c">Leadership Hero Banner</h2>
            {(!AddHeroBanner || AddHeroBanner.length === 0) && (
              <button className="admin-add-btn" onClick={() => setShowHeroAdd(true)}>Add Hero Banner</button>
            )}
          </div>

          <Table responsive bordered style={{ width: "-webkit-fill-available" }}>
            <thead><tr><th>S.No</th><th>Image</th><th>Title</th><th>Description</th><th>Action</th></tr></thead>
            <tbody>
              {(AddHeroBanner || []).map((item, i) => (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td><Image src={`${API_URL}/LeadershipHeroBanner/${item.HeroImage}`} alt="hero" style={{ width: "140px", height: "70px", objectFit: "cover", borderRadius: "6px" }} /></td>
                  <td style={{ paddingTop: "20px" }}>{item.HeroTitle}</td>
                  <td style={{ paddingTop: "20px", maxWidth: "260px" }}>{item.HeroDescription}</td>
                  <td>
                    <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                      <BiSolidEdit className="text-success" style={{ cursor: "pointer", fontSize: "20px" }}
                        onClick={() => { setEditHeroItem(item); setHeroTitle(item.HeroTitle); setHeroDescription(item.HeroDescription); setHeroImage(""); setShowHeroEdit(true); }} />
                      <AiFillDelete className="text-danger" style={{ cursor: "pointer", fontSize: "20px" }}
                        onClick={() => { setDeleteHeroId(item._id); setShowHeroDel(true); }} />
                    </div>
                  </td>
                </tr>
              ))}
              {(!AddHeroBanner || AddHeroBanner.length === 0) && (
                <tr><td colSpan={5} className="text-center text-muted py-3">No hero banner added yet.</td></tr>
              )}
            </tbody>
          </Table>

          {/* Add Hero Banner Modal */}
          <Modal show={showHeroAdd} onHide={() => setShowHeroAdd(false)} style={{ zIndex: 99999 }}>
            <Modal.Header closeButton><Modal.Title>Add Leadership Hero Banner</Modal.Title></Modal.Header>
            <Modal.Body>
              <div className="do-sear mt-2"><label>Banner Image *</label><input type="file" accept="image/*" className="vi_0" onChange={(e) => setHeroImage(e.target.files[0])} /></div>
              <div className="do-sear mt-2"><label>Title *</label><input type="text" className="vi_0" placeholder="e.g. A LEADERSHIP TEAM" value={HeroTitle} onChange={(e) => setHeroTitle(e.target.value)} /></div>
              <div className="do-sear mt-2"><label>Description *</label><input type="text" className="vi_0" placeholder="e.g. The people behind Shuttle Smash Championship" value={HeroDescription} onChange={(e) => setHeroDescription(e.target.value)} /></div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-close-btn" variant="" onClick={() => setShowHeroAdd(false)}>Close</Button>
              <Button className="modal-add-btn" variant="" onClick={addHeroBanner}>Add</Button>
            </Modal.Footer>
          </Modal>

          {/* Edit Hero Banner Modal */}
          <Modal show={showHeroEdit} onHide={() => setShowHeroEdit(false)} style={{ zIndex: 99999 }}>
            <Modal.Header closeButton><Modal.Title>Edit Leadership Hero Banner</Modal.Title></Modal.Header>
            <Modal.Body>
              <div className="do-sear mt-2">
                <label>Banner Image <small className="text-muted">(leave empty to keep current)</small></label>
                <input type="file" accept="image/*" className="vi_0" onChange={(e) => setHeroImage(e.target.files[0])} />
                {editHeroItem?.HeroImage && !HeroImage && (
                  <Image src={`${API_URL}/LeadershipHeroBanner/${editHeroItem.HeroImage}`} alt="current" style={{ marginTop: "8px", height: "60px", borderRadius: "4px" }} />
                )}
              </div>
              <div className="do-sear mt-2"><label>Title *</label><input type="text" className="vi_0" value={HeroTitle} onChange={(e) => setHeroTitle(e.target.value)} /></div>
              <div className="do-sear mt-2"><label>Description *</label><input type="text" className="vi_0" value={HeroDescription} onChange={(e) => setHeroDescription(e.target.value)} /></div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-close-btn" variant="" onClick={() => setShowHeroEdit(false)}>Close</Button>
              <Button className="modal-add-btn" variant="" onClick={editHeroBanner}>Update</Button>
            </Modal.Footer>
          </Modal>

          {/* Delete Hero Banner Modal */}
          <Modal show={showHeroDel} onHide={() => setShowHeroDel(false)} style={{ zIndex: 99999 }}>
            <Modal.Header closeButton><Modal.Title>Warning</Modal.Title></Modal.Header>
            <Modal.Body><p className="fs-5" style={{ color: "red" }}>Are you sure you want to delete this banner?</p></Modal.Body>
            <Modal.Footer>
              <Button className="modal-close-btn" variant="" onClick={() => setShowHeroDel(false)}>Cancel</Button>
              <Button className="modal-add-btn" variant="" onClick={deleteHeroBanner}>Delete</Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

      {/* ── Add Member Modal ── */}
      <Modal show={show} onHide={() => setShow(false)} style={{ zIndex: "99999" }}>
        <Modal.Header closeButton><Modal.Title style={{ color: "black" }}>Add Leadership Member</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2"><label>Member Photo</label><input type="file" accept="image/*" className="vi_0" onChange={(e) => setMemberImage(e.target.files[0])} /></div>
          <div className="do-sear mt-2"><label>Name *</label><input type="text" className="vi_0" placeholder="e.g. ASEEM" value={MemberName} onChange={(e) => setMemberName(e.target.value)} /></div>
          <div className="do-sear mt-2"><label>Role *</label><input type="text" className="vi_0" placeholder="e.g. Passionate Badminton Organiser" value={MemberRole} onChange={(e) => setMemberRole(e.target.value)} /></div>
          <div className="do-sear mt-2"><label>Description</label><textarea className="vi_0" rows={3} placeholder="Short bio..." value={MemberDesc} onChange={(e) => setMemberDesc(e.target.value)} /></div>
          <div className="do-sear mt-2"><label>Instagram Profile Link</label><input type="url" className="vi_0" placeholder="https://www.instagram.com/username" value={MemberInsta} onChange={(e) => setMemberInsta(e.target.value)} /></div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShow(false)}>Close</Button>
          <Button className="modal-add-btn" variant="" onClick={AddMember}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* ── Edit Member Modal ── */}
      <Modal show={show3} onHide={() => setShow3(false)} style={{ zIndex: "99999" }}>
        <Modal.Header closeButton><Modal.Title style={{ color: "black" }}>Edit Leadership Member</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2">
            <label>Member Photo (leave blank to keep current)</label>
            <input type="file" accept="image/*" className="vi_0" onChange={(e) => setMemberImage(e.target.files[0])} />
            {editItem?.MemberImage && (<img src={`${API_URL}/LeadershipTeam/${editItem.MemberImage}`} alt="current" style={{ width: "60px", height: "60px", borderRadius: "50%", marginTop: "8px", objectFit: "cover" }} />)}
          </div>
          <div className="do-sear mt-2"><label>Name *</label><input type="text" className="vi_0" value={MemberName} onChange={(e) => setMemberName(e.target.value)} /></div>
          <div className="do-sear mt-2"><label>Role *</label><input type="text" className="vi_0" value={MemberRole} onChange={(e) => setMemberRole(e.target.value)} /></div>
          <div className="do-sear mt-2"><label>Description</label><textarea className="vi_0" rows={3} value={MemberDesc} onChange={(e) => setMemberDesc(e.target.value)} /></div>
          <div className="do-sear mt-2"><label>Instagram Profile Link</label><input type="url" className="vi_0" placeholder="https://www.instagram.com/username" value={MemberInsta} onChange={(e) => setMemberInsta(e.target.value)} /></div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShow3(false)}>Close</Button>
          <Button className="modal-add-btn" variant="" onClick={EditMember}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* ── Delete Member Modal ── */}
      <Modal show={show4} onHide={() => setShow4(false)} style={{ zIndex: "99999" }}>
        <Modal.Header closeButton><Modal.Title>Warning</Modal.Title></Modal.Header>
        <Modal.Body><p className="fs-4" style={{ color: "red" }}>Are you sure?<br />You want to delete this member?</p></Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShow4(false)}>Close</Button>
          <Button className="modal-add-btn" variant="" onClick={DeleteMember}>Delete</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default AdminLeadershipTeam;
