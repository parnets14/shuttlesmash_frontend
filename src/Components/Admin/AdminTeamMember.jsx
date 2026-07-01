import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import "../Admin/Admin.css";
import axios from "axios";

const AdminTeamMember = () => {
  // ── Modal states ─────────────────────────────
  const [show, setShow]   = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const handleClose  = () => setShow(false);
  const handleShow   = () => setShow(true);
  const handleClose3 = () => setShow3(false);
  const handleClose4 = () => setShow4(false);

  // ── Form state ───────────────────────────────
  const [MemberImage, setMemberImage] = useState("");
  const [MemberName,  setMemberName]  = useState("");
  const [MemberRole,  setMemberRole]  = useState("");
  const [MemberDesc,  setMemberDesc]  = useState("");
  const [MemberInsta, setMemberInsta] = useState("");

  // ── Add ──────────────────────────────────────
  const AddTeamMember = async () => {
    if (!MemberName) return alert("Please enter member name");

    const formdata = new FormData();
    formdata.append("MemberImage", MemberImage);
    formdata.append("MemberName",  MemberName);
    formdata.append("MemberRole",  "");
    formdata.append("MemberDesc",  MemberDesc);
    formdata.append("MemberInsta", MemberInsta || "");

    try {
      const res = await axios({
        url: "admin/addteammember",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: { "content-type": "multipart/form-data" },
        data: formdata,
      });
      if (res.status === 200) {
        alert(res.data.success);
        getTeamMembers();
        handleClose();
        setMemberImage(""); setMemberName(""); setMemberRole(""); setMemberDesc(""); setMemberInsta("");
      }
    } catch (error) {
      alert(error.response?.data?.msg || "Error adding member");
    }
  };

  // ── Get ──────────────────────────────────────
  const [TeamMembers,   setTeamMembers]   = useState([]);
  const [nochangedata,  setNoChangeData]  = useState([]);

  const getTeamMembers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getteammembers`);
      if (res.status === 200) {
        setTeamMembers(res.data.getteammembers);
        setNoChangeData(res.data.getteammembers);
      }
    } catch (error) { console.log(error); }
  };

  // ── Delete ───────────────────────────────────
  const [deleteId, setDeleteId] = useState("");
  const DeleteTeamMember = async () => {
    try {
      const res = await axios({
        url: `admin/deleteteammember/${deleteId}`,
        method: "delete",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
      });
      if (res.status === 200) {
        alert("Deleted Successfully");
        getTeamMembers();
        setShow4(false);
      }
    } catch (error) { alert("Cannot delete"); }
  };

  // ── Edit ─────────────────────────────────────
  const [editItem, setEditItem] = useState(null);
  const handleShowEdit = (item) => {
    setEditItem(item);
    setMemberName(item.MemberName);
    setMemberRole(item.MemberRole);
    setMemberDesc(item.MemberDesc);
    setMemberInsta(item.MemberInsta || "");
    setMemberImage("");
    setShow3(true);
  };

  const EditTeamMember = async () => {
    const formdata = new FormData();
    formdata.append("id",          editItem._id);
    formdata.append("MemberImage", MemberImage);
    formdata.append("MemberName",  MemberName);
    formdata.append("MemberRole",  "");
    formdata.append("MemberDesc",  MemberDesc);
    formdata.append("MemberInsta", MemberInsta || "");

    try {
      const res = await axios({
        url: "admin/editteammember",
        method: "put",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: { "content-type": "multipart/form-data" },
        data: formdata,
      });
      if (res.status === 200) {
        alert("Updated Successfully");
        getTeamMembers();
        handleClose3();
      }
    } catch (error) { alert("Cannot update"); }
  };

  useEffect(() => { getTeamMembers(); }, []);

  // ── Pagination ───────────────────────────────
  const [currenpage, setCurrentpage] = useState(1);
  const recordsperpage = 5;
  const lastIndex  = currenpage * recordsperpage;
  const firstIndex = lastIndex - recordsperpage;
  const records    = TeamMembers.slice(firstIndex, lastIndex);
  const npages     = Math.ceil(TeamMembers.length / recordsperpage);
  const numbers    = [...Array(npages + 1).keys()].slice(1);

  // ── Search ───────────────────────────────────
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    if (term) {
      setTeamMembers(nochangedata.filter((m) =>
        Object.values(m).some((v) => String(v).toLowerCase().includes(term))
      ));
    } else {
      setTeamMembers(nochangedata);
    }
  };

  return (
    <div className="customerhead p-2">

      {/* Search */}
      <div className="col-lg-4 d-flex justify-content-center mt-3">
        <div className="input-group">
          <span className="input-group-text"><BsSearch /></span>
          <input type="text" className="form-control" placeholder="Search..." onChange={handleSearch} />
        </div>
      </div>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mt-2">
        <h2 className="header-c">Team ADGP Members</h2>
        <button className="admin-add-btn" onClick={handleShow}>Add Member</button>
      </div>

      {/* Table */}
      <div className="mb-3">
        <Table responsive bordered style={{ width: "-webkit-fill-available" }}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Description</th>
              <th>Instagram</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records?.map((item, i) => (
              <tr key={i}>
                <td>{i + 1 + firstIndex}</td>
                <td>
                  {item.MemberImage ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/TeamMembers/${item.MemberImage}`}
                      alt={item.MemberName}
                      style={{ width: "65px", height: "65px", objectFit: "cover", borderRadius: "50%" }}
                    />
                  ) : (
                    <div style={{
                      width: "65px", height: "65px", borderRadius: "50%",
                      background: "#e8eeff", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "22px", fontWeight: "700", color: "#031B77"
                    }}>
                      {item.MemberName?.charAt(0)}
                    </div>
                  )}
                </td>
                <td style={{ fontWeight: "700" }}>{item.MemberName}</td>
                <td style={{ maxWidth: "220px", fontSize: "13px" }}>{item.MemberDesc}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {item.MemberInsta ? (
                    <a href={item.MemberInsta} target="_blank" rel="noopener noreferrer" style={{ color: "#E1306C" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#E1306C">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  ) : <span style={{ color: "#aaa", fontSize: "12px" }}>—</span>}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                    <BiSolidEdit
                      className="text-success"
                      style={{ cursor: "pointer", fontSize: "20px" }}
                      onClick={() => handleShowEdit(item)}
                    />
                    <AiFillDelete
                      className="text-danger"
                      style={{ cursor: "pointer", fontSize: "20px" }}
                      onClick={() => { setDeleteId(item._id); setShow4(true); }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Pagination */}
        <nav>
          <ul className="pagination">
            <li className="not-allow">
              <span>
                <li className="next-prev">
                  <a onClick={() => currenpage > 1 && setCurrentpage(currenpage - 1)}>&lt;</a>
                </li>
              </span>
            </li>
            {numbers.map((n, i) => (
              <li className="active-next" key={i}>
                <a href="#" className={currenpage === n ? "active" : "inactive"} onClick={() => setCurrentpage(n)}>{n}</a>
              </li>
            ))}
            <li className="not-allow">
              <span>
                <li className="next-prev" onClick={() => currenpage < npages && setCurrentpage(currenpage + 1)}>&gt;</li>
              </span>
            </li>
          </ul>
        </nav>
      </div>

      {/* ── Add Modal ── */}
      <Modal show={show} onHide={handleClose} style={{ zIndex: "99999" }}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Add Team Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2">
            <label>Member Photo</label>
            <input type="file" accept="image/*" className="vi_0" onChange={(e) => setMemberImage(e.target.files[0])} />
          </div>
          <div className="do-sear mt-2">
            <label>Name *</label>
            <input type="text" className="vi_0" placeholder="e.g. ASEEM" value={MemberName} onChange={(e) => setMemberName(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>Description</label>
            <textarea className="vi_0" rows={3} placeholder="Short bio..." value={MemberDesc} onChange={(e) => setMemberDesc(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>Instagram Profile Link</label>
            <input type="url" className="vi_0" placeholder="https://www.instagram.com/username" value={MemberInsta} onChange={(e) => setMemberInsta(e.target.value)} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={handleClose}>Close</Button>
          <Button className="modal-add-btn"   variant="" onClick={AddTeamMember}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal show={show3} onHide={handleClose3} style={{ zIndex: "99999" }}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Edit Team Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2">
            <label>Member Photo (leave blank to keep current)</label>
            <input type="file" accept="image/*" className="vi_0" onChange={(e) => setMemberImage(e.target.files[0])} />
          </div>
          <div className="do-sear mt-2">
            <label>Name *</label>
            <input type="text" className="vi_0" value={MemberName} onChange={(e) => setMemberName(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>Description</label>
            <textarea className="vi_0" rows={3} value={MemberDesc} onChange={(e) => setMemberDesc(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>Instagram Profile Link</label>
            <input type="url" className="vi_0" placeholder="https://www.instagram.com/username" value={MemberInsta} onChange={(e) => setMemberInsta(e.target.value)} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={handleClose3}>Close</Button>
          <Button className="modal-add-btn"   variant="" onClick={EditTeamMember}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* ── Delete Modal ── */}
      <Modal show={show4} onHide={() => setShow4(false)} style={{ zIndex: "99999" }}>
        <Modal.Header closeButton><Modal.Title>Warning</Modal.Title></Modal.Header>
        <Modal.Body>
          <p className="fs-4" style={{ color: "red" }}>Are you sure?<br />You want to delete this member?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-close-btn" variant="" onClick={() => setShow4(false)}>Close</Button>
          <Button className="modal-add-btn"   variant="" onClick={DeleteTeamMember}>Delete</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default AdminTeamMember;
