import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { BsPlusCircle, BsTrash } from "react-icons/bs";
import axios from "axios";
import "../Admin/Admin.css";

const API_URL = process.env.REACT_APP_API_URL || "https://shuttlesmash.in";

/* ─── helpers ─────────────────────────────────────────── */
const emptySection = () => ({ sectionTitle: "", points: [""] });

const emptyForm = () => ({
  venue: "",
  orgName: "",
  orgEmail: "",
  ovTitle: "",
  ovSubtitle: "",
  ovInitiative: "",
  ovStatus: "",
  ovSections: [emptySection()],
  ovEntryFee: "",
  ovEntryFeeNote: "",
  ovYouTubeLink: "",
});

/* ─── sub-component: section builder ─────────────────── */
const SectionBuilder = ({ sections, onChange }) => {
  const updateTitle = (si, val) => {
    const s = sections.map((sec, i) => i === si ? { ...sec, sectionTitle: val } : sec);
    onChange(s);
  };
  const updatePoint = (si, pi, val) => {
    const s = sections.map((sec, i) => {
      if (i !== si) return sec;
      const pts = sec.points.map((p, j) => j === pi ? val : p);
      return { ...sec, points: pts };
    });
    onChange(s);
  };
  const addPoint = (si) => {
    const s = sections.map((sec, i) => i === si ? { ...sec, points: [...sec.points, ""] } : sec);
    onChange(s);
  };
  const removePoint = (si, pi) => {
    const s = sections.map((sec, i) => {
      if (i !== si) return sec;
      const pts = sec.points.filter((_, j) => j !== pi);
      return { ...sec, points: pts.length ? pts : [""] };
    });
    onChange(s);
  };
  const addSection = () => onChange([...sections, emptySection()]);
  const removeSection = (si) => {
    const s = sections.filter((_, i) => i !== si);
    onChange(s.length ? s : [emptySection()]);
  };

  return (
    <div>
      {sections.map((sec, si) => (
        <div key={si} style={{ background: "#f8f9fc", border: "1px solid #e4e8f8", borderRadius: "10px", padding: "14px 16px", marginBottom: "12px" }}>
          {/* Section title row */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <input
              type="text"
              className="vi_0"
              placeholder="Section title (e.g. PERKS, SCHEDULE: Boys — leave blank for no title)"
              value={sec.sectionTitle}
              onChange={(e) => updateTitle(si, e.target.value)}
              style={{ fontWeight: 600 }}
            />
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeSection(si)} title="Remove section">
              <BsTrash />
            </button>
          </div>

          {/* Points */}
          {sec.points.map((pt, pi) => (
            <div key={pi} className="d-flex align-items-center gap-2 mb-1">
              <span style={{ color: "#031B77", fontWeight: 700, minWidth: "14px" }}>•</span>
              <input
                type="text"
                className="vi_0"
                placeholder={`Point ${pi + 1}`}
                value={pt}
                onChange={(e) => updatePoint(si, pi, e.target.value)}
              />
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removePoint(si, pi)} title="Remove point">
                <BsTrash style={{ fontSize: "12px" }} />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-sm mt-1" style={{ color: "#031B77", border: "1px dashed #031B77", borderRadius: "6px", fontSize: "12px" }} onClick={() => addPoint(si)}>
            + Add Point
          </button>
        </div>
      ))}
      <button type="button" className="admin-add-btn mt-1" style={{ fontSize: "13px" }} onClick={addSection}>
        + Add Section
      </button>
    </div>
  );
};

/* ─── main component ──────────────────────────────────── */
const AdminEventInfo = () => {
  const [list, setList]         = useState([]);
  const [showAdd, setShowAdd]   = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDel, setShowDel]   = useState(false);
  const [delId, setDelId]       = useState("");
  const [editId, setEditId]     = useState("");
  const [form, setForm]         = useState(emptyForm());
  const [editForm, setEditForm] = useState(emptyForm());

  // active tab
  const [tab, setTab] = useState("venue");   // "venue" | "overview" | "organizer"

  /* fetch */
  const fetchAll = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/geteventinfo`);
      if (res.status === 200) setList(res.data.geteventinfo || []);
    } catch (e) { console.log(e); }
  };
  useEffect(() => { fetchAll(); }, []);

  /* save payload builder */
  const buildPayload = (f) => ({
    Venue: f.venue,
    OrganizerName: f.orgName,
    OrganizerEmail: f.orgEmail,
    OvTitle: f.ovTitle,
    OvSubtitle: f.ovSubtitle,
    OvInitiative: f.ovInitiative,
    OvStatus: f.ovStatus,
    OvSections: JSON.stringify(f.ovSections),
    OvEntryFee: f.ovEntryFee,
    OvEntryFeeNote: f.ovEntryFeeNote,
    OvYouTubeLink: f.ovYouTubeLink,
  });

  /* ADD */
  const handleAdd = async () => {
    if (!form.venue) return alert("Please enter Venue");
    if (!form.orgName) return alert("Please enter Organizer Name");
    try {
      const res = await axios.post(`${API_URL}/api/admin/addeventinfo`, buildPayload(form));
      if (res.status === 200) {
        alert(res.data.success);
        setForm(emptyForm());
        setShowAdd(false);
        fetchAll();
      }
    } catch (e) { alert(e.response?.data?.error || "Failed to add"); }
  };

  /* open EDIT */
  const openEdit = (item) => {
    setEditId(item._id);
    setEditForm({
      venue: item.Venue || "",
      orgName: item.OrganizerName || "",
      orgEmail: item.OrganizerEmail || "",
      ovTitle: item.OvTitle || "",
      ovSubtitle: item.OvSubtitle || "",
      ovInitiative: item.OvInitiative || "",
      ovStatus: item.OvStatus || "",
      ovSections: item.OvSections?.length ? item.OvSections.map(s => ({
        sectionTitle: s.sectionTitle || "",
        points: s.points?.length ? s.points : [""],
      })) : [emptySection()],
      ovEntryFee: item.OvEntryFee || "",
      ovEntryFeeNote: item.OvEntryFeeNote || "",
      ovYouTubeLink: item.OvYouTubeLink || "",
    });
    setShowEdit(true);
  };

  /* SAVE EDIT */
  const handleEdit = async () => {
    try {
      const res = await axios.put(`${API_URL}/api/admin/editeventinfo`, { id: editId, ...buildPayload(editForm) });
      if (res.status === 200) {
        alert(res.data.success);
        setShowEdit(false);
        fetchAll();
      }
    } catch (e) { alert(e.response?.data?.error || "Update failed"); }
  };

  /* DELETE */
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${API_URL}/api/admin/deleteeventinfo/${delId}`);
      if (res.status === 200) {
        alert(res.data.success);
        setShowDel(false);
        fetchAll();
      }
    } catch (e) { alert("Delete failed"); }
  };

  /* ── form field renderer (shared for add & edit) ── */
  const renderForm = (f, setF) => (
    <div>
      {/* Tabs */}
      <div className="d-flex gap-2 mb-4">
        {["venue", "overview", "organizer"].map((t) => (
          <button key={t} type="button"
            className={tab === t ? "modal-add-btn" : "modal-close-btn"}
            style={{ borderRadius: "6px", fontSize: "13px", padding: "6px 18px" }}
            onClick={() => setTab(t)}>
            {t === "venue" ? "📍 Venue" : t === "overview" ? "🏸 Tournament Overview" : "🏢 Organizer"}
          </button>
        ))}
      </div>

      {/* VENUE TAB */}
      {tab === "venue" && (
        <div className="do-sear mt-2">
          <label style={{ fontWeight: 600 }}>Venue Address <span style={{ color: "red" }}>*</span></label>
          <input className="vi_0" type="text"
            placeholder="e.g. Game Theory HSR Layout Sector 7, Bengaluru, Karnataka"
            value={f.venue} onChange={(e) => setF({ ...f, venue: e.target.value })} />
        </div>
      )}

      {/* OVERVIEW TAB */}
      {tab === "overview" && (
        <div>
          <div className="do-sear mt-2">
            <label style={{ fontWeight: 600 }}>Venue</label>
            <input className="vi_0" type="text"
              placeholder="e.g. KBA, Bangalore"
              value={f.venue} onChange={(e) => setF({ ...f, venue: e.target.value })} />
          </div>

          <div className="do-sear mt-2">
            <label style={{ fontWeight: 600 }}>Tournament Description</label>
            <textarea className="vi_0" rows="8"
              style={{ resize: "both", minHeight: "200px" }}
              placeholder="e.g. Initiative by GOPICHAND BADMINTON GRASSROOT ACADEMY..."
              value={f.ovInitiative} onChange={(e) => setF({ ...f, ovInitiative: e.target.value })} />
          </div>
        </div>
      )}

      {/* ORGANIZER TAB */}
      {tab === "organizer" && (
        <div className="row">
          <div className="col-md-6 do-sear mt-2">
            <label style={{ fontWeight: 600 }}>Organizer Name <span style={{ color: "red" }}>*</span></label>
            <input className="vi_0" type="text" placeholder="e.g. SPREETIME / CENTURY"
              value={f.orgName} onChange={(e) => setF({ ...f, orgName: e.target.value })} />
          </div>
          <div className="col-md-6 do-sear mt-2">
            <label style={{ fontWeight: 600 }}>Organizer Email</label>
            <input className="vi_0" type="email" placeholder="e.g. contact@shuttlesmash.in"
              value={f.orgEmail} onChange={(e) => setF({ ...f, orgEmail: e.target.value })} />
          </div>
        </div>
      )}
    </div>
  );

  /* ── render ── */
  return (
    <div>
      {/* Page header */}
      <div className="d-flex justify-content-between align-items-center mb-3 px-3 pt-3">
        <h2 className="header-c mb-0">Event Info</h2>
        {list.length === 0 && (
          <button className="admin-add-btn" onClick={() => { setTab("venue"); setShowAdd(true); }}>
            + Add Event Info
          </button>
        )}
      </div>

      {/* Empty state */}
      {list.length === 0 && (
        <div style={{ margin: "0 12px", background: "#f8f9fc", border: "1px dashed #d0d7e8", borderRadius: "12px", padding: "50px", textAlign: "center", color: "#aaa" }}>
          No event info added yet. Click <strong>+ Add Event Info</strong> to get started.
        </div>
      )}

      {/* Table */}
      {list.length > 0 && (
        <div className="px-3">
          <Table responsive bordered style={{ width: "-webkit-fill-available" }}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Venue</th>
                <th>Tournament Title</th>
                <th>Status</th>
                <th>Organizer</th>
                <th>YouTube</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, i) => (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td style={{ maxWidth: "200px", fontSize: "13px" }}>{item.Venue || "—"}</td>
                  <td style={{ fontSize: "13px" }}>
                    <div style={{ fontWeight: 700 }}>{item.OvTitle || "—"}</div>
                    {item.OvSubtitle && <div style={{ fontSize: "12px", color: "#888" }}>{item.OvSubtitle}</div>}
                  </td>
                  <td>
                    {item.OvStatus ? (
                      <span style={{
                        background: item.OvStatus.toLowerCase().includes("upcoming") ? "#fff3cd" :
                                    item.OvStatus.toLowerCase().includes("present") || item.OvStatus.toLowerCase().includes("ongoing") ? "#d1fae5" :
                                    item.OvStatus.toLowerCase().includes("complet") ? "#e0e7ff" : "#f1f5f9",
                        color: item.OvStatus.toLowerCase().includes("upcoming") ? "#92400e" :
                               item.OvStatus.toLowerCase().includes("present") || item.OvStatus.toLowerCase().includes("ongoing") ? "#065f46" :
                               item.OvStatus.toLowerCase().includes("complet") ? "#3730a3" : "#334155",
                        padding: "3px 10px",
                        borderRadius: "50px",
                        fontSize: "12px",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}>
                        {item.OvStatus}
                      </span>
                    ) : "—"}
                  </td>
                  <td style={{ fontSize: "13px" }}>
                    <div style={{ fontWeight: 600 }}>{item.OrganizerName || "—"}</div>
                    {item.OrganizerEmail && <div style={{ fontSize: "12px", color: "#888" }}>{item.OrganizerEmail}</div>}
                  </td>
                  <td style={{ fontSize: "12px" }}>
                    {item.OvYouTubeLink ? (
                      <a href={item.OvYouTubeLink} target="_blank" rel="noopener noreferrer"
                        style={{ color: "#e00" }}>▶ Watch</a>
                    ) : "—"}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
                      <BiSolidEdit className="text-success" style={{ cursor: "pointer", fontSize: "20px" }}
                        onClick={() => { setTab("venue"); openEdit(item); }} />
                      <AiFillDelete className="text-danger" style={{ cursor: "pointer", fontSize: "20px" }}
                        onClick={() => { setDelId(item._id); setShowDel(true); }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* ── ADD MODAL ── */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)} size="xl" centered>
        <Modal.Header closeButton style={{ background: "#031B77" }}>
          <Modal.Title style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
            Add Event Info
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "28px", maxHeight: "75vh", overflowY: "auto" }}>
          {renderForm(form, setForm)}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" className="modal-close-btn" onClick={() => setShowAdd(false)}>Cancel</Button>
          <Button variant="" className="modal-add-btn" onClick={handleAdd}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* ── EDIT MODAL ── */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} size="xl" centered>
        <Modal.Header closeButton style={{ background: "#031B77" }}>
          <Modal.Title style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
            Edit Event Info
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "28px", maxHeight: "75vh", overflowY: "auto" }}>
          {renderForm(editForm, setEditForm)}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" className="modal-close-btn" onClick={() => setShowEdit(false)}>Cancel</Button>
          <Button variant="" className="modal-add-btn" onClick={handleEdit}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* ── DELETE CONFIRM MODAL ── */}
      <Modal show={showDel} onHide={() => setShowDel(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "15px", fontWeight: 700 }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "14px" }}>
          Are you sure you want to delete this event info?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" className="modal-close-btn" onClick={() => setShowDel(false)}>Cancel</Button>
          <Button variant="" style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", padding: "5px 14px" }} onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminEventInfo;
