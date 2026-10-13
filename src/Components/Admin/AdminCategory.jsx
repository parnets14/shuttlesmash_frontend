import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Image, Form } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import "../Admin/Admin.css";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import parse from "html-react-parser";

const AdminCategory = () => {
  const [show, setShow] = useState();
  const [show4, setShow4] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);

  // category
  const [show1, setShow1] = useState();
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => {
    setCategoryName("");
    setCategoryPrice("");
    setTotalPlayers("");
    setCategoryType("");
    setShow1(true);
  };

  const [show2, setShow2] = useState();
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  // integrating post method package
  const [CategoryName, setCategoryName] = useState("");
  const [CategoryPrice, setCategoryPrice] = useState("");
  const [TotalPlayers, setTotalPlayers] = useState("");
  const [CategoryType, setCategoryType] = useState("");
  const AddCatDetais = async () => {
    try {
      const config = {
        url: "admin/category",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: { "content-type": "application/json" },
        data: {
          CategoryName: CategoryName,
          CategoryPrice: CategoryPrice,
          TotalPlayers: TotalPlayers,
          CategoryType: CategoryType,
        },
      };
      let res = await axios(config);
      if (res.status === 200) {
        alert(res.data.success);
        getAddCategory();
        handleClose1();
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  //integrating get  method
  const [newData, setNewdata] = useState({});
  const [AddCategory, setAddCategory] = useState([]);
  const getAddCategory = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getcategory`);
      if (res.status === 200) {
        setAddCategory(res.data.getcategory);  
        setNoChangeData(res.data.getcategory);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //delete method
  const [Datass, setDatass] = useState("");
  const DeleteCat = async () => {
    try {
      const config = {
        url: "admin/Deletecategory/" + Datass,
        method: "delete",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "application/json" },
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("Successfully Delete");
          getAddCategory();
          handleClose2();
        }
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  //update method
  const [Data3, setData3] = useState("");
  const [show5, setShow5] = useState(false);
  const handleClose5 = () => setShow5(false);
  const handleShow5 = (item) => {
    setShow5(true);
    setData3(item);
    setCategoryName(item?.CategoryName);
    setCategoryPrice(item?.CategoryPrice);
    setTotalPlayers(item?.TotalPlayers);
    setCategoryType(item?.CategoryType || "");
  };

  const EditCate = async (e) => {
    e.preventDefault();
    try {
      const config = {
        url: "admin/editcategory/",
        method: "put",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: { "Content-Type": "application/json" },
        data: {
          id: Data3?._id,
          CategoryName: CategoryName,
          CategoryPrice: CategoryPrice ? Number(CategoryPrice) : undefined,
          TotalPlayers: TotalPlayers ? Number(TotalPlayers) : undefined,
          CategoryType: CategoryType,
        },
      };
      const res = await axios(config);
      if (res.status === 200) {
        alert("Successfully Updated");
        handleClose5();
        getAddCategory();
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "Update failed");
    }
  };

  useEffect(() => {
    getAddCategory();
  }, []);

  // pagination
  const [currenpage1, setCurrentpage1] = useState(1);
  const recordsperpage1 = 5;
  const lastIndex1 = currenpage1 * recordsperpage1;
  const firstIndex1 = lastIndex1 - recordsperpage1;
  const records1 = AddCategory;
  const npages1 = Math.ceil(AddCategory.length / recordsperpage1);
  const numbers1 = [...Array(npages1 + 1).keys()].slice(1);

  function changePage(id) {
    setCurrentpage1(id);
  }

  function prevpage() {
    if (currenpage1 !== firstIndex1) {
      setCurrentpage1(currenpage1 - 1);
    }
  }

  function nextpage() {
    if (currenpage1 !== lastIndex1) {
      setCurrentpage1(currenpage1 + 1);
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
       setAddCategory(filteredData);
     } else {
      setAddCategory(nochangedata);
     }
   };
 

  // Category end

  // ==================QR_CODE===================//
  // integrating post method QRCODE
  const [QrcodeImage, setQrcodeImage] = useState("");

  const AddsubacatDetais = async () => {
    try {
      if (!QrcodeImage) return alert("Please add QR code image");
      const fd = new FormData();
      fd.append("QrcodeImage", QrcodeImage);
      const config = {
        url: "admin/qrcode",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: { "content-type": "multipart/form-data" },
        data: fd,
      };
      let res = await axios(config);
      if (res.status === 200) {
        alert(res.data.success);
        getAddQrcode();
        handleClose();
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.msg || "Failed to add QR code");
    }
  };
  //integrating get  method
  const [Dat, setDat] = useState("");
  const [AddQrcode, setAddQrcode] = useState([]);
  const getAddQrcode = async () => {
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/getqrcode`
      );
      if (res.status === 200) {
        setAddQrcode(res.data.getqrcode);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //delete method
  const [Data, setData] = useState("");
  const Deletesubcat = async () => {
    try {
      const config = {
        url: "admin/Deleteqrcode/" + Data,
        method: "delete",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "application/json" },
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("Successfully Delete");
          getAddQrcode();
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
  };

  const EditsubCate = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("QrcodeImage", QrcodeImage ? QrcodeImage : Data1?.QrcodeImage);
    formdata.append("id", Data1?._id);

    try {
      const config = {
        url: "admin/editqrcode/",
        method: "put",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: { "Content-Type": "application/json" },
        data: formdata,
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("Successfully Updated");
          getAddQrcode();
          handleClose3();
        }
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.error);
    }
  };

  useEffect(() => {
    getAddQrcode();
  }, []);

  // pagination
  const [currenpage, setCurrentpage] = useState(1);
  const recordsperpage = 5;
  const lastIndex = currenpage * recordsperpage;
  const firstIndex = lastIndex - recordsperpage;
  const records = AddQrcode.slice(firstIndex, lastIndex);
  const npages = Math.ceil(AddQrcode.length / recordsperpage);
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


  // condition variable
  const [Category, setCategory] = useState(true);
  const [Subcategory, setSubcategory] = useState(false);

  return (
    <div>
      <div className="customerhead p-2">
        <div className="d-flex gap-3 mb-3">
          <button
            className="admin-add-btn"
            onClick={() => {
              setCategory(true);
              setSubcategory(false);
            }}
          >
            Category
          </button>
          <button
            className="admin-add-btn"
            onClick={() => {
              setCategory(false);
              setSubcategory(true);
            }}
          >
            QR Code
          </button>
        </div>

        {Category ? (
          <>
            <div className="col-lg-4 d-flex justify-content-center mt-3">
              <div className="input-group ">
                <span className="input-group-text" id="basic-addon1">
                  <BsSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  aria-describedby="basic-addon1"
                  onChange={handleFilterH}
                />
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <h2 className="header-c ">Category</h2>
              <div className="d-flex gap-3">
                <button className="admin-add-btn" onClick={handleShow1}>
                  Add Category
                </button>
              </div>
            </div>

            <div className="mb-3">
              <Table
                responsive
                bordered
                style={{ width: "-webkit-fill-available" }}
              >
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Category Name</th>
                    <th>Category Type</th>
                    <th>Price</th>
                    <th>Total Players</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {records1?.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1 + firstIndex}</td>
                        <td style={{ paddingTop: "20px" }}>
                          {item.CategoryName}
                        </td>
                        <td style={{ paddingTop: "20px" }}>
                          {item.CategoryType || "—"}
                        </td>
                        <td style={{ paddingTop: "20px" }}>
                          {item.CategoryPrice}
                        </td>
                        <td style={{ paddingTop: "20px" }}>
                          {item.TotalPlayers}
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
                              <BiSolidEdit
                                className="text-success"
                                style={{ cursor: "pointer", fontSize: "20px" }}
                                onClick={() => {
                                  handleShow5(item);
                                  setNewdata(item);
                                }}
                              />{" "}
                            </div>
                            <div>
                              <AiFillDelete
                                className="text-danger"
                                style={{ cursor: "pointer", fontSize: "20px" }}
                                onClick={() => {
                                  setDatass(item?._id);
                                  handleShow2();
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
                    <span className="next-prev">
                      <a
                        onClick={() => {
                          prevpage();
                        }}
                      >
                        &lt;
                      </a>{" "}
                    </span>
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
                    <span
                      className="next-prev"
                      onClick={() => {
                        nextpage();
                      }}
                    >
                      &gt;{" "}
                    </span>
                  </span>
                </li>
              </ul>
            </nav>
          </div>
            </div>

            {/* Add  Category modal */}
            <Modal
              show={show1}
              onHide={handleClose1}
              style={{ zIndex: "99999" }}
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>
                  Add Category
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="do-sear mt-2">
                    <label>Add Category Name</label>
                    <input
                      type="text"
                      className="vi_0"
                      value={CategoryName}
                      placeholder="Enter Category Name"
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                  </div>
                  <div className="do-sear mt-2">
                    <label>Category Type</label>
                    <input
                      type="text"
                      className="vi_0"
                      value={CategoryType}
                      placeholder="e.g. Knockout Round Robin + Knockout"
                      onChange={(e) => setCategoryType(e.target.value)}
                    />
                  </div>
                  <div className="do-sear mt-2">
                    <label>Add Price</label>
                    <input
                      type="number"
                      className="vi_0"
                      value={CategoryPrice}
                      placeholder="Enter Price"
                      onChange={(e) => setCategoryPrice(e.target.value)}
                    />
                  </div>
                  <div className="do-sear mt-2">
                    <label>Add Total Players</label>
                    <input
                      type="number"
                      className="vi_0"
                      value={TotalPlayers}
                      placeholder="Enter no of Players"
                      onChange={(e) => setTotalPlayers(e.target.value)}
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="d-flex">
                  <Button
                    className="mx-2 modal-close-btn"
                    variant=""
                    onClick={handleClose1}
                  >
                    Close
                  </Button>
                  <Button
                    className="mx-2 modal-add-btn"
                    variant=""
                    onClick={AddCatDetais}
                  >
                    Add
                  </Button>
                </div>
              </Modal.Footer>
            </Modal>

            {/* Edit Category modal */}
            <Modal
              show={show5}
              onHide={handleClose5}
              backdrop="static"
              keyboard={false}
              style={{ zIndex: "99999" }}
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>
                  Edit Category
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="do-sear mt-2">
                    <label>Edit Category Name</label>
                    <input
                      type="text"
                      className="vi_0"
                      value={CategoryName}
                      placeholder={newData?.CategoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                  </div>
                  <div className="do-sear mt-2">
                    <label>Category Type</label>
                    <input
                      type="text"
                      className="vi_0"
                      value={CategoryType}
                      placeholder={newData?.CategoryType || "e.g. Knockout Round Robin + Knockout"}
                      onChange={(e) => setCategoryType(e.target.value)}
                    />
                  </div>
                  <div className="do-sear mt-2">
                    <label>Add Price</label>
                    <input
                      type="number"
                      className="vi_0"
                      value={CategoryPrice}
                      placeholder={newData?.CategoryPrice}
                      onChange={(e) => setCategoryPrice(e.target.value)}
                    />
                  </div>

                  <div className="do-sear mt-2">
                    <label>Add Total Players</label>
                    <input
                      type="number"
                      className="vi_0"
                      value={TotalPlayers}
                      placeholder={newData?.TotalPlayers}
                      onChange={(e) => setTotalPlayers(e.target.value)}
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant=""
                  className="modal-close-btn"
                  onClick={handleClose5}
                >
                  Close
                </Button>
                <Button variant="" className="modal-add-btn" onClick={EditCate}>
                  Update
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Delet Category modal  */}
            <Modal
              show={show2}
              onHide={handleClose2}
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
                  onClick={handleClose2}
                >
                  Close
                </Button>
                <Button
                  variant=""
                  className="modal-add-btn"
                  onClick={DeleteCat}
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        ) : (
          <></>
        )}

        {Subcategory ? (
          <>
            {" "}
          
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="header-c ">QR Code</h2>
                <div className="d-flex gap-3">
                

                  <div>
                {AddQrcode?.length !== 0 ? (
                  ""
                ) : (
                  <>
                <button className="admin-add-btn" onClick={handleShow}>
                    Add QR Code Image
                  </button>
                </>
                )}
              </div>
                </div>
              </div>

              <Table
                responsive
                bordered
                style={{ width: "-webkit-fill-available" }}
              >
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>QR Code Image</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {records?.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1 + firstIndex}</td>

                        <Image
                            src={`${process.env.REACT_APP_API_URL}/Events/${item?.QrcodeImage}`}
                            alt="pic"
                            style={{ width: "75px", height: "75px" }}
                          />
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
                                onClick={() => {
                                  handleShow3();
                                  setData1(item);
                                  setDat(item);
                                }}
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
          </>
        ) : (
          <></>
        )}

        {/* Add qrcode  modal */}
        <Modal show={show} onHide={handleClose} style={{ zIndex: "99999" }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "black" }}>
              Add QR Code
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="do-sear mt-2">
                <label>Add QR Code Image</label>
                <input
                  type="file"
                  name=""
                  id=""
                  className="vi_0"
                  onChange={(e) => setQrcodeImage(e.target.files[0])}
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
                onClick={AddsubacatDetais}
              >
                Add
              </Button>
            </div>
          </Modal.Footer>
        </Modal>

        {/* Edit qr code modal */}
        <Modal
          show={show3}
          onHide={handleClose3}
          backdrop="static"
          keyboard={false}
          style={{ zIndex: "99999" }}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "black" }}>
              Edit Sub Category
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
            <div className="do-sear mt-2">
                <label>Add QR Code Image</label>
                <input
                  type="file"
                  name=""
                  id=""
                  className="vi_0"
                  onChange={(e) => setQrcodeImage(e.target.files[0])}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant=""
              className="modal-close-btn"
              onClick={handleClose3}
            >
              Close
            </Button>
            <Button variant="" className="modal-add-btn" onClick={EditsubCate}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delet Sub Category  modal  */}
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
            <Button variant="" className="modal-add-btn" onClick={Deletesubcat}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AdminCategory;
