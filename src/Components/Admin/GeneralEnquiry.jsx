import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import "../Admin/Admin.css";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import parse from "html-react-parser";

const GeneralEnquiry = () => {
  const [show4, setShow4] = useState();
  const [Data, setData] = useState("");
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);
  const [show, setShow] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e, editor) => {
    if (!editor) return; const data = editor.getData();
    setGUMessage(data);
  };

  // post method form
  const formdata = new FormData();
  const [GUName, setGUName] = useState("");
  const [GUPhone, setGUPhone] = useState("");
  const [GUEmail, setGUEmail] = useState("");
  const [GUMessage, setGUMessage] = useState("");

  const Addgeneralquery = async () => {
    try {
      if (!GUName) {
        return alert("Please add name");
      }
      if (!GUEmail) {
        return alert("Please add email ");
      }
      if (!GUPhone) {
        return alert("Please add phone number");
      }
      if (!GUMessage) {
        return alert("Please add phone number");
      }

      const config = {
        url: "user/general",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "multipart/form-data" },
        data: {
          GUName: GUName,
          GUPhone: GUPhone,
          GUEmail: GUEmail,
          GUMessage: GUMessage,
        },
      };
      let res = await axios(config);
      if (res.status === 200) {
        alert(res.data.success);
        getgeneral();
        handleClose();
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  //integrating get  method
  const [Addgeneral, setAddgeneral] = useState([]);
  const getgeneral = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getgeneral`);
      if (res.status === 200) {
        setAddgeneral(res.data.getgeneral);
        setNoChangeData(res.data.getgeneral);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Delete
  const DeleteGeneral = async () => {
    try {
      const config = {
        url: "user/DeleteGeneral/" + Data,
        method: "delete",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "application/json" },
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("Successfully Delete");
          getgeneral();
          handleClose4();
        }
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  useEffect(() => {
    getgeneral();
  }, []);
  console.log(Addgeneral);

  const [currenpage, setCurrentpage] = useState(1);
  const recordsperpage = 5;
  const lastIndex = currenpage * recordsperpage;
  const firstIndex = lastIndex - recordsperpage;
  const records = Addgeneral.slice(firstIndex, lastIndex);
  const npages = Math.ceil(Addgeneral.length / recordsperpage);
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
      setAddgeneral(filteredData);
    } else {
      setAddgeneral(nochangedata);
    }
  };

  return (
    <div>
      <div className="col-lg-4 d-flex justify-content-center">
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
      <div className="customerhead p-2">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="header-c ">General Enquiry</h2>
          <button className="admin-add-btn" onClick={handleShow}>
            Add General Enquiry
          </button>
        </div>

        <div className="mb-3">
          <Table
            responsive
            bordered
            style={{ width: "-webkit-fill-available" }}
          >
            <thead>
              <tr>
                <th>SL.NO</th>
                <th>Name</th>
                <th>Email ID</th>
                <th>Phone Number</th>
                <th>Message</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {records?.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1 + firstIndex}</td>
                    <td style={{ paddingTop: "20px" }}>{item.GUName}</td>
                    <td style={{ paddingTop: "20px" }}>{item.GUEmail}</td>
                    <td style={{ paddingTop: "20px" }}>{item.GUPhone}</td>
                    <td style={{ paddingTop: "20px" }}>
                      {parse(`<div>${item.GUMessage}</div>`)}
                    </td>

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
                          <AiFillDelete
                            className="text-danger"
                            style={{ cursor: "pointer", fontSize: "20px" }}
                            onClick={() => {
                              handleShow4();
                              setData(item?._id);
                            }}
                          />{" "}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

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
            <Button
              variant=""
              className="modal-close-btn"
              onClick={handleClose4}
            >
              Close
            </Button>
            <Button
              variant=""
              className="modal-add-btn"
              onClick={DeleteGeneral}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      {/* Add Package modal */}
      <Modal show={show} onHide={handleClose} style={{ zIndex: "99999" }}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>
            Add General Query
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="do-sear mt-2">
              <label>Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter Your Name"
                className="vi_0"
                onChange={(e) => setGUName(e.target.value)}
              />
            </div>
            <div className="do-sear mt-2">
              <label>Email</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter Your Email"
                className="vi_0"
                onChange={(e) => setGUEmail(e.target.value)}
              />
            </div>
            <div className="do-sear mt-2">
              <label>Phone number</label>
              <input
                type="number"
                placeholder="Enter Your phone number"
                className="vi_0"
                onChange={(e) => setGUPhone(e.target.value)}
              />
            </div>

            <div className="do-sear mt-2">
              <label>Add Message</label>
              <CKEditor editor={ClassicEditor} onChange={handleChange} />
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
              onClick={Addgeneralquery}
            >
              Add
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

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
  );
};

export default GeneralEnquiry;
