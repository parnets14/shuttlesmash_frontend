import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Image } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import "../Admin/Admin.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import parse from "html-react-parser";

const AdminSingleResult = () => {
  const [show4, setShow4] = useState();
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);

  const [show, setShow] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // integrating post method
  const [SResultCategory, setSResultCategory] = useState("");
  const [SResultSubCategory, setSResultSubCategory] = useState("");
  const [SPlayername, setSPlayername] = useState("");
  const [SPosition, setSPosition] = useState("");
  const [SCompany, setSCompany] = useState("");

  const AddSingleResultdetails = async () => {
    try {
      if (!SResultCategory) {
        return alert("Please add Event Category");
      }
  
      if (!SResultSubCategory) {
        return alert("Please add Event Sub Category");
      }
  
      if (!SPlayername) {
        return alert("Please add First Player Name");
      }
  
      if (!SPosition) {
        return alert("Please add Winning Position");
      }
  
      if (!SCompany) {
        return alert("Please add Company Name");
      }
  
      const config = {
        url: "admin/add/singleresults",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: { "content-type": "application/json" },
        data: {
          SResultCategory: SResultCategory,
          SResultSubCategory: SResultSubCategory,
          SPlayername: SPlayername,
          SPosition: SPosition,
          SCompany: SCompany,
        },
      };
    
      let res = await axios(config);
      if (res.status === 200) {
        alert(res.data.success);
        getAddSingleResult();
        handleClose();
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };
  

  //integrating get  method
  const [AddSingleResult, setAddSingleResult] = useState([]);
  const getAddSingleResult = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getsingleresults`);
      if (res.status === 200) {
        setAddSingleResult(res.data.getsingleresults);
        setNoChangeData1(res.data.getsingleresults);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //delete method
  const [Data, setData] = useState("");
  const DeleteSingleResults = async () => {
    try {
      const config = {
        url: "admin/Deletesresults/" + Data,
        method: "delete",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "application/json" },
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("Successfully Delete");
          getAddSingleResult();
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
    setSResultCategory(item?.SResultCategory);
    setSResultSubCategory(item?.SResultSubCategory);
    setSPlayername(item?.SPlayername);
    setSPosition(item?.SPosition);
    setSCompany(item?.SCompany);
  };

  const EditSingleResult = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("SResultCategory", SResultCategory);
    formdata.append("SResultSubCategory", SResultSubCategory);
    formdata.append("SPlayername", SPlayername);
    formdata.append("SPosition", SPosition);
    formdata.append("SCompany", SCompany);
    formdata.append("id", Data1?._id);
    try {
      const config = {
        url: "admin/editsresults",
        method: "put",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "multipart/form-data" },
        data: {
          SResultCategory: SResultCategory,
          SResultSubCategory: SResultSubCategory,
          SPlayername: SPlayername,
          SPosition: SPosition,
          SCompany: SCompany,
        },
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("successfully Update");
          handleClose3();
          getAddSingleResult();
        }
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.error);
    }
  };

  useEffect(() => {
    getAddSingleResult();
  }, []);

  // pagination
  const [currenpage, setCurrentpage] = useState(1);
  const recordsperpage = 5;
  const lastIndex = currenpage * recordsperpage;
  const firstIndex = lastIndex - recordsperpage;
  const records = AddSingleResult.slice(firstIndex, lastIndex);
  const npages = Math.ceil(AddSingleResult.length / recordsperpage);
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
  const [nochangedata1, setNoChangeData1] = useState([]);
  const [searchH1, setSearchH1] = useState("");

  const handleFilterH = (e) => {
    const searchTerm1 = e.target.value.toLowerCase();
    setSearchH1(searchTerm1);
    if (searchTerm1 !== "") {
      const filteredData1 = nochangedata1.filter((user) =>
        Object.values(user).some((value) =>
          String(value).toLowerCase().includes(searchTerm1)
        )
      );
      setAddSingleResult(filteredData1);
    } else {
      setAddSingleResult(nochangedata1);
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

      <div className="d-flex justify-content-between align-items-center">
        <h2 className="header-c ">Single Results</h2>
        <button className="admin-add-btn" onClick={handleShow}>
          Add Single Results
        </button>
      </div>

      <div className="mb-3">
        <Table responsive bordered style={{ width: "-webkit-fill-available" }}>
          <thead>
            <tr>
              <th>SL.NO</th>
              <th>Event Category</th>
              <th>Event Sub Category</th>
              <th>Player Name</th>
              <th>Position</th>
              <th>Company</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {records?.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1 + firstIndex}</td>
                  <td style={{ paddingTop: "20px" }}>{item.SResultCategory}</td>
                  <td style={{ paddingTop: "20px" }}>
                    {item.SResultSubCategory}
                  </td>
                  <td style={{ paddingTop: "20px" }}>{item.SPlayername}</td>
                  <td style={{ paddingTop: "20px" }}>{item.SPosition}</td>
                  <td style={{ paddingTop: "20px" }}>{item.SCompany}</td>

                  <td>
                    {" "}
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        justifyContent: "center",
                      }}
                    >
                      {/* <div>
            <BiSolidEdit
              className="text-success"
              style={{ cursor: "pointer", fontSize: "20px" }}
              onClick={() => handleShow3(item)}
            />{" "}
          </div> */}
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
      </div>

      {/* Add Double Result modal */}
      <Modal show={show} onHide={handleClose} style={{ zIndex: "99999" }}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>
            Add Single Result Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="do-sear mt-2">
              <label>Add Category</label>
              <input
                type="text"
                className="vi_0"
                placeholder="Enter Event Category"
                onChange={(e) => setSResultCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="do-sear mt-2">
              <label>Add Sub Category</label>
              <input
                type="text"
                className="vi_0"
                placeholder="Enter Event Sub Category"
                onChange={(e) => setSResultSubCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="do-sear mt-2">
              <label>Add Player Name </label>
              <input
                type="text"
                className="vi_0"
                placeholder="Enter First Player Name"
                onChange={(e) => setSPlayername(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="do-sear mt-2">
              <label>Add Position</label>
              <input
                type="text"
                className="vi_0"
                placeholder="Enter Winning Position"
                onChange={(e) => setSPosition(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="do-sear mt-2">
              <label>Add company</label>
              <input
                type="text"
                className="vi_0"
                placeholder="Enter company name"
                onChange={(e) => setSCompany(e.target.value)}
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
              onClick={AddSingleResultdetails}
            >
              Add
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Delet signle  */}
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
          <Button
            variant=""
            className="modal-add-btn"
            onClick={DeleteSingleResults}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminSingleResult;
