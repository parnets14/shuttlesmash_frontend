import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Image } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import "../Admin/Admin.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import parse from "html-react-parser";

const API_URL = process.env.REACT_APP_API_URL || "https://shuttlesmash.in";

const AdminOverview = () => {
  const [show4, setShow4] = useState();
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);

  const [show1, setShow1] = useState();
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  // Tab state
  const [OverviewTab,   setOverviewTab]   = useState(true);
  const [HeroBannerTab, setHeroBannerTab] = useState(false);

  // ==============OVERVIEW HERO BANNER==============================//
  const [HeroImage,       setHeroImage]       = useState("");
  const [HeroTitle,       setHeroTitle]       = useState("");
  const [HeroDescription, setHeroDescription] = useState("");
  const [AddHeroBanner,   setAddHeroBanner]   = useState([]);
  const [editHeroItem,    setEditHeroItem]    = useState(null);
  const [deleteHeroId,    setDeleteHeroId]    = useState("");
  const [showHeroAdd,     setShowHeroAdd]     = useState(false);
  const [showHeroEdit,    setShowHeroEdit]    = useState(false);
  const [showHeroDel,     setShowHeroDel]     = useState(false);

  const getHeroBanner = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/getoverviewheroBanner`);
      if (res.status === 200) setAddHeroBanner(res.data.getheroBanner || []);
    } catch (e) { if (e.response?.status !== 404) console.log(e); }
  };

  const addHeroBanner = async () => {
    if (!HeroImage)              return alert("Please upload an image");
    if (!HeroTitle.trim())       return alert("Please enter a title");
    if (!HeroDescription.trim()) return alert("Please enter a description");
    const fd = new FormData();
    fd.append("HeroImage", HeroImage);
    fd.append("HeroTitle", HeroTitle);
    fd.append("HeroDescription", HeroDescription);
    try {
      const res = await axios.post(`${API_URL}/api/admin/addoverviewheroBanner`, fd, {
        headers: { "content-type": "multipart/form-data" },
      });
      if (res.status === 200) {
        alert(res.data.success);
        getHeroBanner();
        setShowHeroAdd(false);
        setHeroImage(""); setHeroTitle(""); setHeroDescription("");
      }
    } catch (e) { console.log(e); alert(e?.response?.data?.error || "Error"); }
  };

  const editHeroBanner = async () => {
    const fd = new FormData();
    fd.append("id", editHeroItem._id);
    fd.append("HeroTitle", HeroTitle);
    fd.append("HeroDescription", HeroDescription);
    if (HeroImage) fd.append("HeroImage", HeroImage);
    try {
      const res = await axios.put(`${API_URL}/api/admin/editoverviewheroBanner`, fd, {
        headers: { "content-type": "multipart/form-data" },
      });
      if (res.status === 200) { alert(res.data.success); getHeroBanner(); setShowHeroEdit(false); }
    } catch (e) { console.log(e); alert(e?.response?.data?.error || "Update failed"); }
  };

  const deleteHeroBanner = async () => {
    try {
      const res = await axios.delete(`${API_URL}/api/admin/deleteoverviewheroBanner/${deleteHeroId}`);
      if (res.status === 200) { alert(res.data.success); getHeroBanner(); setShowHeroDel(false); }
    } catch (e) { console.log(e); alert(e?.response?.data?.error || "Delete failed"); }
  };

  useEffect(() => { getHeroBanner(); }, []);

  const handleChange = (e, editor) => {
    if (!editor) return; const data = editor.getData();
    setOverviewDesc(data);
  };

  // integrating post method
  const formdata = new FormData();
  const [OverviewImage, setOverviewImage] = useState("");
  const [OverviewTitle, setOverviewTitle] = useState("");
  const [OverviewDesc, setOverviewDesc] = useState("");

  const AddOverviewdetails = async () => {
    formdata.append("OverviewImage", OverviewImage);
    formdata.append("OverviewTitle", OverviewTitle);
    formdata.append("OverviewDesc", OverviewDesc);

    try {
      if (!OverviewImage) return alert("Please add Image");
      if (!OverviewTitle) return alert("Please add Title");
      if (!OverviewDesc) return alert("Please add Overview Description");

      const config = {
        url: "admin/overview",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "multipart/form-data" },
        data: formdata,
      };
      let res = await axios(config);
      if (res.status === 200) {
        alert(res.data.success);
        getAddOverview();
        handleClose1();
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  //integrating get  method
  const [AddOverview, setAddOverview] = useState([]);
  const getAddOverview = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getoverview`);
      if (res.status === 200) {
        setAddOverview(res.data.getoverview);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //delete method
  const [Data, setData] = useState("");
  const DeleteOverview = async () => {
    try {
      const config = {
        url: "admin/Deleteoverview/" + Data,
        method: "delete",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "application/json" },
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("Successfully Delete");
          getAddOverview();
          handleClose4();
        }
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  //update method
  const [Data1, setData1] = useState("");
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = (item) => {
    setShow3(true);
    setData1(item);
    setOverviewTitle(item?.OverviewTitle);
    setOverviewDesc(item?.OverviewDesc);
  };

  const EditOverview = async (e) => {
    e.preventDefault();
    formdata.append("OverviewImage", OverviewImage);
    formdata.append("OverviewTitle", OverviewTitle);
    formdata.append("OverviewDesc", OverviewDesc);
    formdata.append("id", Data1?._id);
    try {
      const config = {
        url: "admin/editoverview",
        method: "put",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "multipart/form-data" },
        data: formdata,
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("successfully Update");
          handleClose3();
          getAddOverview();
        }
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.error);
    }
  };

  useEffect(() => {
    getAddOverview();
  }, []);

  // pagination
  const [currenpage, setCurrentpage] = useState(1);
  const recordsperpage = 5;
  const lastIndex = currenpage * recordsperpage;
  const firstIndex = lastIndex - recordsperpage;
  const records = AddOverview.slice(firstIndex, lastIndex);
  const npages = Math.ceil(AddOverview.length / recordsperpage);
  const numbers = [...Array(npages + 1).keys()].slice(1);

  function changePage(id) {
    setCurrentpage(id);
  }

  function prevpage() {
    if (currenpage !== firstIndex) {
      setCurrentpage(currenpage - 1);
    }
  }

  function nextpage() {
    if (currenpage !== lastIndex) {
      setCurrentpage(currenpage + 1);
    }
  }

  return (
    <div>
      {/* Tab Buttons */}
      <div className="d-flex gap-3 mb-3">
        <Button onClick={() => { setOverviewTab(true);  setHeroBannerTab(false); }}>Overview</Button>
        <Button onClick={() => { setOverviewTab(false); setHeroBannerTab(true);  }}>Hero Banner</Button>
      </div>

      {/* ==============OVERVIEW TAB==================== */}
      {OverviewTab && (<>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="header-c ">Overview</h2>
        <div>
          <button className="admin-add-btn" onClick={handleShow1}>
            Add Overview
          </button>
        </div>
      </div>

      <div className="mb-3">
        <Table responsive bordered style={{ width: "-webkit-fill-available" }}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Image</th>
              <th>Title</th>
              <th>Overview</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records?.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1 + firstIndex}</td>
                  <td style={{ paddingTop: "20px" }}>
                    <Image src={`${process.env.REACT_APP_API_URL}/WebManagement/${item?.OverviewImage}`} alt="overview" style={{ width: "100px", height: "50px" }} />
                  </td>
                  <td style={{ paddingTop: "20px", fontWeight: 600 }}>{item.OverviewTitle}</td>
                  <td style={{ paddingTop: "20px" }}>
                    {parse(`<div>${item.OverviewDesc}</div>`)}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                      <BiSolidEdit className="text-success" style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => handleShow3(item)} />
                      <AiFillDelete className="text-danger" style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => { handleShow4(); setData(item?._id); }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {npages > 1 && (
          <nav>
            <ul className="pagination">
              <li className="not-allow"><span><li className="next-prev"><a onClick={prevpage}>&lt;</a></li></span></li>
              {numbers?.map((n, i) => (
                <li className="active-next" key={i}><a href="#" className="inactive" onClick={() => changePage(n)}>{n}</a></li>
              ))}
              <li className="not-allow"><span><li className="next-prev" onClick={nextpage}>&gt;</li></span></li>
            </ul>
          </nav>
        )}
      </div>

      {/* Add Package modal */}
      <Modal show={show1} onHide={handleClose1} style={{ zIndex: "99999" }}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Add Overview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2">
            <label>Add Image</label>
            <input type="file" className="vi_0" onChange={(e) => setOverviewImage(e.target.files[0])} />
          </div>
          <div className="do-sear mt-2">
            <label>Add Title</label>
            <input type="text" className="vi_0" placeholder="Enter title" onChange={(e) => setOverviewTitle(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>Add Overview Description</label>
            <CKEditor editor={ClassicEditor} onChange={handleChange} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex">
            <Button className="mx-2 modal-close-btn" variant="" onClick={handleClose1}>Close</Button>
            <Button className="mx-2 modal-add-btn" variant="" onClick={AddOverviewdetails}>Add</Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Edit modal */}
      <Modal show={show3} onHide={handleClose3} backdrop="static" keyboard={false} style={{ zIndex: "99999" }}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Edit Overview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="do-sear mt-2">
            <label>Edit Image</label>
            <input type="file" className="vi_0" onChange={(e) => setOverviewImage(e.target.files[0])} />
          </div>
          <div className="do-sear mt-2">
            <label>Edit Title</label>
            <input type="text" className="vi_0" placeholder="Enter title" value={OverviewTitle} onChange={(e) => setOverviewTitle(e.target.value)} />
          </div>
          <div className="do-sear mt-2">
            <label>Edit Description</label>
            <CKEditor editor={ClassicEditor} data={OverviewDesc} onChange={handleChange} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" className="modal-close-btn" onClick={handleClose3}>Close</Button>
          <Button variant="" className="modal-add-btn" onClick={EditOverview}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* Delet modal  */}
      <Modal
        show={show4}
        onHide={handleClose4}
        backdrop="static"
        keyboard={false}
        style={{ zIndex: "99999" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <p className="fs-4" style={{ color: "red" }}>
                Are you sure?
                <br /> you want to delete this data?
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" className="modal-close-btn" onClick={handleClose4}>
            Close
          </Button>
          <Button variant="" className="modal-add-btn" onClick={DeleteOverview}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      </>)}

      {/* ==============OVERVIEW HERO BANNER TAB==================== */}
      {HeroBannerTab && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="header-c">Overview Hero Banner</h2>
            {(!AddHeroBanner || AddHeroBanner.length === 0) && (
              <button className="admin-add-btn" onClick={() => setShowHeroAdd(true)}>
                Add Hero Banner
              </button>
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
              {(AddHeroBanner || []).map((item, i) => (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td>
                    <Image src={`${API_URL}/OverviewHeroBanner/${item.HeroImage}`} alt="hero"
                      style={{ width: "140px", height: "70px", objectFit: "cover", borderRadius: "6px" }} />
                  </td>
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

          {/* Add Modal */}
          <Modal show={showHeroAdd} onHide={() => setShowHeroAdd(false)} style={{ zIndex: 99999 }}>
            <Modal.Header closeButton><Modal.Title>Add Overview Hero Banner</Modal.Title></Modal.Header>
            <Modal.Body>
              <div className="do-sear mt-2">
                <label>Banner Image <span style={{ color: "red" }}>*</span></label>
                <input type="file" accept="image/*" className="vi_0" onChange={(e) => setHeroImage(e.target.files[0])} />
              </div>
              <div className="do-sear mt-2">
                <label>Title <span style={{ color: "red" }}>*</span></label>
                <input type="text" className="vi_0" placeholder="e.g. WHO WE ARE"
                  value={HeroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
              </div>
              <div className="do-sear mt-2">
                <label>Description <span style={{ color: "red" }}>*</span></label>
                <input type="text" className="vi_0" placeholder="e.g. Our story, mission and vision"
                  value={HeroDescription} onChange={(e) => setHeroDescription(e.target.value)} />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-close-btn" variant="" onClick={() => setShowHeroAdd(false)}>Close</Button>
              <Button className="modal-add-btn"   variant="" onClick={addHeroBanner}>Add</Button>
            </Modal.Footer>
          </Modal>

          {/* Edit Modal */}
          <Modal show={showHeroEdit} onHide={() => setShowHeroEdit(false)} style={{ zIndex: 99999 }}>
            <Modal.Header closeButton><Modal.Title>Edit Overview Hero Banner</Modal.Title></Modal.Header>
            <Modal.Body>
              <div className="do-sear mt-2">
                <label>Banner Image <small className="text-muted">(leave empty to keep current)</small></label>
                <input type="file" accept="image/*" className="vi_0" onChange={(e) => setHeroImage(e.target.files[0])} />
                {editHeroItem?.HeroImage && !HeroImage && (
                  <Image src={`${API_URL}/OverviewHeroBanner/${editHeroItem.HeroImage}`}
                    alt="current" style={{ marginTop: "8px", height: "60px", borderRadius: "4px" }} />
                )}
              </div>
              <div className="do-sear mt-2">
                <label>Title <span style={{ color: "red" }}>*</span></label>
                <input type="text" className="vi_0" value={HeroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
              </div>
              <div className="do-sear mt-2">
                <label>Description <span style={{ color: "red" }}>*</span></label>
                <input type="text" className="vi_0" value={HeroDescription} onChange={(e) => setHeroDescription(e.target.value)} />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-close-btn" variant="" onClick={() => setShowHeroEdit(false)}>Close</Button>
              <Button className="modal-add-btn"   variant="" onClick={editHeroBanner}>Update</Button>
            </Modal.Footer>
          </Modal>

          {/* Delete Modal */}
          <Modal show={showHeroDel} onHide={() => setShowHeroDel(false)} style={{ zIndex: 99999 }}>
            <Modal.Header closeButton><Modal.Title>Warning</Modal.Title></Modal.Header>
            <Modal.Body>
              <p className="fs-5" style={{ color: "red" }}>Are you sure you want to delete this banner?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-close-btn" variant="" onClick={() => setShowHeroDel(false)}>Cancel</Button>
              <Button className="modal-add-btn"   variant="" onClick={deleteHeroBanner}>Delete</Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
