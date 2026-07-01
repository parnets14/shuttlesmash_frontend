import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Image } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import "../Admin/Admin.css";
import axios from "axios";
import { stepButtonClasses } from "@mui/material";
import { BsSearch } from "react-icons/bs";

const AdminPartners = () => {
  const [show, setShow] = useState();
  const [show4, setShow4] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);

  // integrating post method
  const formdata = new FormData();
  const [PartnerImage, setPartnerImage] = useState("");
  const [PartnerLink, setPartnerLink] = useState("")

  const AddPartnerdetails = async () => {
    formdata.append("PartnerImage", PartnerImage);
    formdata.append("PartnerLink", PartnerLink);

    try {
      if (!PartnerImage) {
        return alert("Please add Sponsor Image");
      }

      if(!PartnerLink) {
        return alert("Please Add Sponsor Navigating Links")
      }

      const config = {
        url: "admin/partner",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "multipart/form-data" },
        data: formdata,
      };
      let res = await axios(config);
      if (res.status === 200) {
        alert(res.data.success);
        getAddPartner();
        handleClose();
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  //integrating get  method
  const [AddPartner, setAddPartner] = useState([]);
  const getAddPartner = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getpartner`);
      if (res.status === 200) {
        setAddPartner(res.data.getpartner);
        setNoChangeData(res.data.getpartner);  
      }
    } catch (error) {
      console.log(error);
    }
  };

  //delete method
  const [Data, setData] = useState("");
  const DeletePartner = async () => {
    try {
      const config = {
        url: "admin/Deletepartner/" + Data,
        method: "delete",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "application/json" },
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("Successfully Delete");
          getAddPartner();
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
    setPartnerLink(item?.PartnerLink);

  };

  const EditPartner = async (e) => {
    e.preventDefault();
    formdata.append("PartnerImage", PartnerImage);
    formdata.append("PartnerLink", PartnerLink);
    formdata.append("id", Data1?._id);
    try {
      const config = {
        url: "admin/editpartner",
        method: "put",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "multipart/form-data" },
        data: formdata,
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("successfully Update");
          handleClose3();
          getAddPartner();
        }
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.error);
    }
  };

  useEffect(() => {
    getAddPartner();
  }, []);

  // pagination
  const [currenpage, setCurrentpage] = useState(1);
  const recordsperpage = 5;
  const lastIndex = currenpage * recordsperpage;
  const firstIndex = lastIndex - recordsperpage;
  const records = AddPartner.slice(firstIndex, lastIndex);
  const npages = Math.ceil(AddPartner.length / recordsperpage);
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

  // Search filter
  const [nochangedata, setNoChangeData] = useState([]);
  const [searchH, setSearchH] = useState("");

  const handleFilterH = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchH(searchTerm);
    if (searchTerm !== "") {
      const filteredData = nochangedata.filter((user) =>
        Object.values(user).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
      setAddPartner(filteredData);
    } else {
      setAddPartner(nochangedata);
    }
  };

  return (
    <div className="customerhead p-2">
       <div className="col-lg-4 d-flex justify-content-center mt-3">
              <div class="input-group ">
                <span class="input-group-text" id="basic-addon1">
                  <BsSearch />
                </span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search..."
                  aria-describedby="basic-addon1"
                  onChange={handleFilterH}
                />
              </div>
            </div>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="header-c ">Partners</h2>
        <button className="admin-add-btn" onClick={handleShow}>
          Add Partners
        </button>
      </div>

      <div className="mb-3">
        <Table responsive bordered style={{ width: "-webkit-fill-available" }}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Image</th>
              <th>Links</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {records?.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1 + firstIndex}</td>
                  <td>
                    <img
                      src={`${process.env.REACT_APP_API_URL}/Partners/${item?.PartnerImage}`}
                      alt="partner"
                      style={{ width: "75px", height: "75px", objectFit: "contain" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/75x75?text=No+Image";
                      }}
                    />
                  </td>
                  <td style={{padding:"20px"}}>{item.PartnerLink}</td>
                  <td>
                    {" "}
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        justifyContent: "center",
                      }}
                    >
                      <div>
                        <BiSolidEdit
                          className="text-success"
                          style={{ cursor: "pointer", fontSize: "20px" }}
                          onClick={() => handleShow3(item)}
                        />{" "}
                      </div>
                      <div>
                        <AiFillDelete
                          className="text-danger"
                          style={{ cursor: "pointer", fontSize: "20px" }}
                          onClick={() => {
                            handleShow4();
                            setData(item?._id);
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <div>
            <nav>
              <ul className="pagination">
                <li className="not-allow">
                  <span>
                    <li className="next-prev">
                      <a
                        onClick={() => {
                          prevpage();
                        }}
                      >
                        &lt;
                      </a>{" "}
                    </li>
                  </span>
                </li>
                {numbers?.map((n, i) => {
                  return (
                    <li className="active-next" key={i}>
                      <a
                        href="#"
                        className="inactive"
                        onClick={() => changePage(n)}
                      >
                        {n}
                      </a>
                    </li>
                  );
                })}

                <li className="not-allow">
                  <span>
                    <li
                      className="next-prev"
                      onClick={() => {
                        nextpage();
                      }}
                    >
                      &gt;{" "}
                    </li>
                  </span>
                </li>
              </ul>
            </nav>
          </div>
      </div>

      {/* Add Package modal */}
      <Modal show={show} onHide={handleClose} style={{ zIndex: "99999" }}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Add Sponsor Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="do-sear mt-2">
              <label>Add Sponsor Image</label>
              <input
                type="file"
                name=""
                id=""
                className="vi_0"
                onChange={(e) => setPartnerImage(e.target.files[0])}
              />
            </div>

            <div className="do-sear mt-2">
              <label>Add Sponsor Link</label>
              <input
                type="text"
                name=""
                className="vi_0"
                placeholder="Enter Sponsor Link"
                onChange={(e) => setPartnerLink(e.target.value)}
              />
            </div>
        
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex">
            <Button
              className="mx-2 modal-close-btn"
              variant=""
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              className="mx-2 modal-add-btn"
              variant=""
              onClick={AddPartnerdetails}
            >
              Add
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Edit Package modal */}
      <Modal
        show={show3}
        onHide={handleClose3}
        backdrop="static"
        keyboard={false}
        style={{ zIndex: "99999" }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>
            Edit Sponsor Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="do-sear mt-2">
              <label>Edit Sponsor Image</label>
              <input
                type="file"
                name=""
                accept="image/*"
                className="vi_0"
                onChange={(e) => setPartnerImage(e.target.files[0])}
              />
              {Data1?.PartnerImage && !PartnerImage && (
                <img
                  src={`${process.env.REACT_APP_API_URL}/Partners/${Data1?.PartnerImage}`}
                  alt="current"
                  style={{ marginTop: "8px", height: "60px", borderRadius: "4px", objectFit: "contain" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
              <small className="text-muted">Leave empty to keep current image</small>
            </div>

            <div className="do-sear mt-2">
              <label>Add Sponsor Link</label>
              <input
                type="text"
                name=""
                className="vi_0"
                placeholder="Enter Sponsor Link"
                value={PartnerLink}
                onChange={(e) => setPartnerLink(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" className="modal-close-btn" onClick={handleClose3}>
            Close
          </Button>
          <Button variant="" className="modal-add-btn" onClick={EditPartner}>
            Update
          </Button>
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
          <Button variant="" className="modal-add-btn" onClick={DeletePartner}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPartners;
