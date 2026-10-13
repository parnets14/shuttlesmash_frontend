import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Form, Image } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { FaPlus, FaLayerGroup } from "react-icons/fa";
import axios from "axios";
import "../Admin/Admin.css";

const CATEGORIES = [
  "Corporate", "Men's Singles", "Women's Singles",
  "Men's Doubles", "Women's Doubles", "Mixed Doubles",
  "Junior", "Boys U15 Singles", "Girls U15 Singles",
  "Boys U19 Singles", "Girls U19 Singles",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - i);

const AdminRankingGroups = () => {
  const [showAdd,    setShowAdd]    = useState(false);
  const [showEdit,   setShowEdit]   = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [Title,      setTitle]      = useState("");
  const [Tagline,    setTagline]    = useState("Turn your childhood dream into reality");
  const [GroupImage, setGroupImage] = useState(null);
  const [Year,       setYear]       = useState(currentYear);
  const [Category,   setCategory]   = useState(CATEGORIES[0]);
  const [SortOrder,  setSortOrder]  = useState(0);
  const [Status,     setStatus]     = useState("Active");

  const [groups,    setGroups]    = useState([]);
  const [editItem,  setEditItem]  = useState(null);
  const [deleteId,  setDeleteId]  = useState("");

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getrankinggroups`);
      setGroups(Array.isArray(res?.data?.groups) ? res.data.groups : []);
    } catch (err) { console.log(err); setGroups([]); }
  };

  useEffect(() => { fetchGroups(); }, []);

  const resetForm = () => {
    setTitle(""); setTagline("Turn your childhood dream into reality");
    setGroupImage(null); setYear(currentYear);
    setCategory(CATEGORIES[0]); setSortOrder(0); setStatus("Active");
    setEditItem(null);
  };

  const handleAdd = async () => {
    if (!Title || !Year || !Category) return alert("Title, Year and Category are required.");
    try {
      const fd = new FormData();
      fd.append("Title", Title); fd.append("Tagline", Tagline);
      fd.append("Year", Year);   fd.append("Category", Category);
      fd.append("SortOrder", SortOrder); fd.append("Status", Status);
      if (GroupImage) fd.append("GroupImage", GroupImage);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/rankinggroup`, fd,
        { headers: { "content-type": "multipart/form-data" } });
      if (res.status === 200) {
        alert(res.data.success); fetchGroups(); setShowAdd(false); resetForm();
      }
    } catch (err) { alert(err?.response?.data?.msg || "Failed"); }
  };

  const openEdit = (item) => {
    setEditItem(item); setTitle(item.Title ?? "");
    setTagline(item.Tagline ?? ""); setYear(item.Year ?? currentYear);
    setCategory(item.Category ?? CATEGORIES[0]);
    setSortOrder(item.SortOrder ?? 0); setStatus(item.Status ?? "Active");
    setGroupImage(null); setShowEdit(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("id", editItem._id); fd.append("Title", Title);
      fd.append("Tagline", Tagline); fd.append("Year", Year);
      fd.append("Category", Category); fd.append("SortOrder", SortOrder);
      fd.append("Status", Status);
      if (GroupImage) fd.append("GroupImage", GroupImage);
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/editrankinggroup`, fd,
        { headers: { "content-type": "multipart/form-data" } });
      if (res.status === 200) {
        alert("Updated successfully"); fetchGroups(); setShowEdit(false); resetForm();
      }
    } catch (err) { alert(err?.response?.data?.msg || "Update failed"); }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/deleterankinggroup/${deleteId}`);
      if (res.status === 200) {
        alert("Deleted"); fetchGroups(); setShowDelete(false);
      }
    } catch (err) { alert(err?.response?.data?.msg || "Delete failed"); }
  };

  const FormBody = (
    <div className="row g-3">
      <div className="col-md-12">
        <div className="do-sear">
          <label>Title <span style={{ color:"red" }}>*</span></label>
          <input type="text" className="vi_0" value={Title}
            placeholder="e.g. 2025 - CORPORATE RANKING"
            onChange={(e) => setTitle(e.target.value)} />
        </div>
      </div>
      <div className="col-md-12">
        <div className="do-sear">
          <label>Tagline</label>
          <input type="text" className="vi_0" value={Tagline}
            placeholder="e.g. Turn your childhood dream into reality"
            onChange={(e) => setTagline(e.target.value)} />
        </div>
      </div>
      <div className="col-md-6">
        <div className="do-sear">
          <label>Year <span style={{ color:"red" }}>*</span></label>
          <Form.Select className="vi_0" value={Year} onChange={(e) => setYear(e.target.value)}>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </Form.Select>
        </div>
      </div>
      <div className="col-md-6">
        <div className="do-sear">
          <label>Category <span style={{ color:"red" }}>*</span></label>
          <Form.Select className="vi_0" value={Category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Form.Select>
        </div>
      </div>
      <div className="col-md-6">
        <div className="do-sear">
          <label>Sort Order</label>
          <input type="number" className="vi_0" value={SortOrder} min="0"
            placeholder="0 = first" onChange={(e) => setSortOrder(e.target.value)} />
        </div>
      </div>
      <div className="col-md-6">
        <div className="do-sear">
          <label>Status</label>
          <Form.Select className="vi_0" value={Status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Form.Select>
        </div>
      </div>
      <div className="col-md-12">
        <div className="do-sear">
          <label>Group Photo</label>
          <input type="file" className="vi_0" accept="image/*"
            onChange={(e) => setGroupImage(e.target.files[0] || null)} />
          <small style={{ color:"#888" }}>
            Upload a tournament/group photo shown on the ranking card
          </small>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="customerhead p-2">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="header-c" style={{ display:"flex", alignItems:"center", gap:10 }}>
            <FaLayerGroup style={{ color:"#031b77" }} /> Ranking Groups
          </h2>
          <button className="admin-add-btn" onClick={() => { resetForm(); setShowAdd(true); }}>
            <FaPlus style={{ marginRight:6 }} /> Add Ranking Group
          </button>
        </div>

        <p style={{ color:"#888", fontSize:13, marginBottom:16 }}>
          Each group appears as a card on the public Ranking Circuit page.
          Add players to a group via <strong>Ranking Circuit</strong> (player entries).
        </p>

        <div className="mb-3">
          <Table responsive bordered style={{ fontSize:"14px" }}>
            <thead>
              <tr style={{ background:"#031b77", color:"#fff" }}>
                <th>S.No</th>
                <th>Photo</th>
                <th>Title</th>
                <th>Tagline</th>
                <th>Year</th>
                <th>Category</th>
                <th>Order</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {groups.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4" style={{ color:"#aaa" }}>
                    No ranking groups yet. Add your first one above.
                  </td>
                </tr>
              ) : groups.map((item, i) => (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td>
                    {item.GroupImage ? (
                      <Image
                        src={`${process.env.REACT_APP_API_URL}/Rankings/${item.GroupImage}`}
                        style={{ width:64, height:50, objectFit:"cover", borderRadius:6 }}
                      />
                    ) : <span style={{ color:"#ccc" }}>—</span>}
                  </td>
                  <td style={{ fontWeight:700 }}>{item.Title}</td>
                  <td style={{ color:"#666", fontSize:13 }}>{item.Tagline}</td>
                  <td style={{ fontWeight:700 }}>{item.Year}</td>
                  <td>
                    <span style={{
                      background:"#eef2ff", color:"#031b77",
                      borderRadius:6, padding:"3px 10px", fontWeight:700, fontSize:12
                    }}>
                      {item.Category}
                    </span>
                  </td>
                  <td style={{ textAlign:"center" }}>{item.SortOrder ?? 0}</td>
                  <td>
                    <span style={{
                      background: item.Status==="Active" ? "#dcfce7":"#fee2e2",
                      color: item.Status==="Active" ? "#16a34a":"#dc2626",
                      borderRadius:20, padding:"3px 12px", fontWeight:700, fontSize:12
                    }}>
                      {item.Status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display:"flex", gap:14, justifyContent:"center" }}>
                      <BiSolidEdit className="text-success"
                        style={{ cursor:"pointer", fontSize:20 }}
                        onClick={() => openEdit(item)} />
                      <AiFillDelete className="text-danger"
                        style={{ cursor:"pointer", fontSize:20 }}
                        onClick={() => { setDeleteId(item._id); setShowDelete(true); }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Add Modal */}
        <Modal show={showAdd} onHide={() => { setShowAdd(false); resetForm(); }}
          size="lg" style={{ zIndex:99999 }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color:"#031b77", fontWeight:800 }}>
              <FaPlus style={{ marginRight:8, color:"#e31e24" }} /> Add Ranking Group
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{FormBody}</Modal.Body>
          <Modal.Footer>
            <Button variant="" className="modal-close-btn"
              onClick={() => { setShowAdd(false); resetForm(); }}>Close</Button>
            <Button variant="" className="modal-add-btn" onClick={handleAdd}>Add</Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showEdit} onHide={() => { setShowEdit(false); resetForm(); }}
          size="lg" style={{ zIndex:99999 }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color:"#031b77", fontWeight:800 }}>
              <BiSolidEdit style={{ marginRight:8, color:"#22c55e" }} /> Edit Ranking Group
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editItem?.GroupImage && (
              <div className="mb-3 text-center">
                <Image src={`${process.env.REACT_APP_API_URL}/Rankings/${editItem.GroupImage}`}
                  style={{ width:160, height:100, objectFit:"cover", borderRadius:8 }} />
                <p style={{ fontSize:12, color:"#888", marginTop:4 }}>Current photo</p>
              </div>
            )}
            {FormBody}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="" className="modal-close-btn"
              onClick={() => { setShowEdit(false); resetForm(); }}>Close</Button>
            <Button variant="" className="modal-add-btn" onClick={handleEdit}>Update</Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Modal */}
        <Modal show={showDelete} onHide={() => setShowDelete(false)} style={{ zIndex:99999 }}>
          <Modal.Header closeButton><Modal.Title>Warning</Modal.Title></Modal.Header>
          <Modal.Body>
            <p className="fs-5" style={{ color:"red" }}>
              Are you sure?<br />This will remove the ranking group card.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="" className="modal-close-btn"
              onClick={() => setShowDelete(false)}>Close</Button>
            <Button variant="" className="modal-add-btn" onClick={handleDelete}>Delete</Button>
          </Modal.Footer>
        </Modal>

      </div>
    </div>
  );
};

export default AdminRankingGroups;
