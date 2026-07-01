import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import "../Admin/Admin.css";
import axios from "axios";

const AdminEventHeroBanner = () => {
  // ── Modal states ──────────────────────────
  const [showAdd,    setShowAdd]    = useState(false);
  const [showEdit,   setShowEdit]   = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // ── Form fields ───────────────────────────
  const [HeroImage,       setHeroImage]       = useState("");
  const [HeroTitle,       setHeroTitle]       = useState("");
  const [HeroDescription, setHeroDescription] = useState("");

  // ── Edit/Delete targets ───────────────────
  const [editItem,   setEditItem]   = useState(null);
  const [deleteId,   setDeleteId]   = useState("");

  // ── Data ─────────────────────────────────
  const [bannerList, setBannerList] = useState([]);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/geteventbanner`);
      if (res.status === 200) setBannerList(res.data.getheroBanner);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchBanners(); }, []);

  // ── ADD ───────────────────────────────────
  const handleAdd = async () => {
    if (!HeroImage)       return alert("Please upload an image");
    if (!HeroTitle.trim()) return alert("Please enter a title");
    if (!HeroDescription.trim()) return alert("Please enter a description");

    const formdata = new FormData();
    formdata.append("HeroImage",       HeroImage);
    formdata.append("HeroTitle",       HeroTitle);
    formdata.append("HeroDescription", HeroDescription);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/addeventbanner`,
        formdata,
        { headers: { "content-type": "multipart/form-data" } }
      );
      if (res.status === 200) {
        alert(res.data.success);
        fetchBanners();
        setShowAdd(false);
        setHeroImage(""); setHeroTitle(""); setHeroDescription("");
      }
    } catch (e) { console.log(e); alert(e?.response?.data?.error || "Error adding banner"); }
  };

  // ── EDIT ──────────────────────────────────
  const openEdit = (item) => {
    setEditItem(item);
    setHeroTitle(item.HeroTitle);
    setHeroDescription(item.HeroDescription);
    setHeroImage("");
    setShowEdit(true);
  };

  const handleEdit = async () => {
    const formdata = new FormData();
    formdata.append("id",              editItem._id);
    formdata.append("HeroTitle",       HeroTitle);
    formdata.append("HeroDescription", HeroDescription);
    if (HeroImage) formdata.append("HeroImage", HeroImage);

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/editeventbanner`,
        formdata,
        { headers: { "content-type": "multipart/form-data" } }
      );
      if (res.status === 200) {
        alert(res.data.success);
        fetchBanners();
        setShowEdit(false);
      }
    } catch (e) { console.log(e); alert(e?.response?.data?.error || "Update failed"); }
  };

  // ── DELETE ────────────────────────────────
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/admin/deleteeventbanner/${deleteId}`
      );
      if (res.status === 200) {
        alert(res.data.success);
        fetchBanners();
        setShowDelete(false);
      }
    } catch (e) { console.log(e); }
  };

  // ── Pagination ────────────────────────────
  const [page, setPage]   = useState(1);
  const perPage            = 5;
  const lastIdx            = page * perPage;
  const firstIdx           = lastIdx - perPage;
  const records            = bannerList.slice(firstIdx, lastIdx);
  const totalPages         = Math.ceil(bannerList.length / perPage);

  return (
    <div className="customerhead p-2">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="header-c">Events Hero Banner</h2>
        {bannerList.length === 0 && (
          <button className="admin-add-btn" onClick={() => setShowAdd(true)}>
            Add Banner
          </button>
        )}
      </div>

      {/* Table */}
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
          {records.map((item, i) => (
            <tr key={item._id}>
              <td>{i + 1 + firstIdx}</td>
              <td>
                <img
                  src={`${process.env.REACT_APP_API_URL}/EventHeroBanner/${item.HeroImage}`}
                  alt="hero"
                  style={{ width: "160px", height: "80px", objectFit: "cover", borderRadius: "6px" }}
                />
              </td>
              <td style={{ paddingTop: "20px" }}>{item.HeroTitle}</td>
              <td style={{ paddingTop: "20px", maxWidth: "260px" }}>{item.HeroDescription}</td>
              <td>
                <div className="d-flex gap-3 justify-content-center">
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
          {records.length === 0 && (
            <tr><td colSpan={5} className="text-center text-muted py-4">No banner added yet.</td></tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-end gap-2 mt-2">
          <button className="admin-add-btn" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>Prev</button>
          <span className="align-self-center">Page {page} / {totalPages}</span>
          <button className="admin-add-btn" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Next</button>
        </div>
      )}

      {/* ── ADD Modal ── */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton>
          <Modal.Title>Add Events Hero Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2">
            <label>Banner Image <span style={{ color: "red" }}>*</span></label>
            <input type="file" accept="image/*" className="vi_0"
              onChange={e => setHeroImage(e.target.files[0])} />
          </div>
          <div className="do-sear mt-2">
            <label>Title <span style={{ color: "red" }}>*</span></label>
            <input type="text" className="vi_0" placeholder="e.g. TOURNAMENTS"
              value={HeroTitle} onChange={e => setHeroTitle(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>Description <span style={{ color: "red" }}>*</span></label>
            <input type="text" className="vi_0" placeholder="e.g. Register now and be part of the championship"
              value={HeroDescription} onChange={e => setHeroDescription(e.target.value)} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShowAdd(false)}>Close</Button>
          <Button className="modal-add-btn"   variant="" onClick={handleAdd}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* ── EDIT Modal ── */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Events Hero Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2">
            <label>Banner Image <small className="text-muted">(leave empty to keep current)</small></label>
            <input type="file" accept="image/*" className="vi_0"
              onChange={e => setHeroImage(e.target.files[0])} />
            {editItem?.HeroImage && !HeroImage && (
              <img
                src={`${process.env.REACT_APP_API_URL}/EventHeroBanner/${editItem.HeroImage}`}
                alt="current"
                style={{ marginTop: "8px", height: "60px", borderRadius: "4px" }}
              />
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

      {/* ── DELETE Modal ── */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton><Modal.Title>Warning</Modal.Title></Modal.Header>
        <Modal.Body>
          <p className="fs-5" style={{ color: "red" }}>Are you sure you want to delete this banner?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button className="modal-add-btn"   variant="" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminEventHeroBanner;
