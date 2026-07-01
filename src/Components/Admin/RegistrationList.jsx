import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import "../Admin/Admin.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";

const RegistrationList = () => {
  const [show4, setShow4] = useState();
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);
  const [show, setShow] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // post method form
  const formdata = new FormData();
  const [Data, setData] = useState("");

  // DATE & MONTH FORMATE
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { day: "numeric", month: "long" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Payment Status Condition
  const [editid, seteditid] = useState("");
  const [status, setstatus] = useState("");

  const [show10, setShow10] = useState();
  const handleClose10 = () => setShow10(false);
  const handleShow10 = () => setShow10(true);
  const makeStatusChangeContactUs = async () => {
    try {
      const config = {
        url: "user/makeStatusChangebookings",
        method: "put",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: {
          "Content-Type": "application/json",
        },

        data: {
          id: editid,
          status: status,
        },
      };
      let res = await axios(config);
      if (res.status == 200) {
        alert(`${res?.data?.success}`);
        handleClose10();
        getAddregister();
      }
    } catch (error) {
      alert(error.response.data.error);
      console.log(error);
    }
  };

  const [EventName, setEventName] = useState("");
  const [EventDate, setEventDate] = useState("");
  const [Category, setCategory] = useState("");

  const [FirstPlayerName, setFirstPlayerName] = useState("");
  const [FirstPlayerEmail, setFirstPlayerEmail] = useState("");
  const [FirstPlayerPhone, setFirstPlayerPhone] = useState("");

  const [SecondPlayerName, setSecondPlayerName] = useState("");
  const [SecondPlayerEmail, setSecondPlayerEmail] = useState("");
  const [SecondPlayerPhone, setSecondPlayerPhone] = useState("");
  const [TotalAmount, setTotalAmount] = useState("");

  const AddRegisterquery = async () => {
    try {
      // if (!GUName) {
      //   return alert("Please add name");
      // }
      // if (!GUEmail) {
      //   return alert("Please add email ");
      // }
      // if (!GUPhone) {
      //   return alert("Please add phone number");
      // }
      // if (!GUMessage) {
      //   return alert("Please add phone number");
      // }

      const config = {
        url: "user/registration",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "multipart/form-data" },
        data: {
          EventName: EventName,
          EventDate: EventDate,
          Category: Category,
          FirstPlayerName: FirstPlayerName,
          FirstPlayerEmail: FirstPlayerEmail,
          FirstPlayerPhone: FirstPlayerPhone,
          SecondPlayerName: SecondPlayerName,
          SecondPlayerEmail: SecondPlayerEmail,
          SecondPlayerPhone: SecondPlayerPhone,
          TotalAmount: TotalAmount,
        },
      };
      let res = await axios(config);
      if (res.status === 200) {
        alert(res.data.success);
        Addregister();
        handleClose();
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  //integrating get  method
  const [Addregister, setAddregister] = useState([]);
  const getAddregister = async () => {
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/user/getregistration`
      );
      if (res.status === 200) {
        setAddregister(res.data.getregistration);
        setNoChangeData(res.data.getregistration);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Delete
  const Deleteregister = async () => {
    try {
      const config = {
        url: "user/Deleteregistration/" + Data,
        method: "delete",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "application/json" },
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("Successfully Delete");
          getAddregister();
          handleClose4();
        }
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  useEffect(() => {
    getAddregister();
  }, []);
  console.log(Addregister);

  const [currenpage, setCurrentpage] = useState(1);
  const recordsperpage = 5;
  const lastIndex = currenpage * recordsperpage;
  const firstIndex = lastIndex - recordsperpage;
  const records = Addregister.slice(firstIndex, lastIndex);
  const npages = Math.ceil(Addregister.length / recordsperpage);
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
      setAddregister(filteredData);
    } else {
      setAddregister(nochangedata);
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
          />
        </div>
      </div>
      <div className="customerhead p-2">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="header-c ">Registration List</h2>
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
                <th>Event Name</th>
                <th>Event Date</th>
                <th>Category</th>
                <th>Player's Name</th>
                <th>Player Email</th>
                <th>Player Contact</th>
                <th>Total Amount</th>
                <th>Mention Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {records?.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1 + firstIndex}</td>
                    <td style={{ paddingTop: "20px" }}>
                      {item?.eventsId?.EventName}
                    </td>
                    <td style={{ paddingTop: "20px" }}>
                      {formatDate(item?.eventsId?.EventStartdate)}
                      <hr/>
                      {formatDate(item?.eventsId?.EventEnddate)}
                    </td>
                    <td style={{ paddingTop: "20px" }}>
                      {item.Category?.map((item1) => {
                        return <p>{item1?.categoryId?.CategoryName}</p>;
                      })}
                    </td>
                    <td style={{ paddingTop: "20px" }}>
                      {item.playerNames
                        ? Object.values(item.playerNames).map((name, index) => (
                            <div key={index}>{name}</div>
                          ))
                        : []}
                    </td>
                    <td style={{ paddingTop: "20px" }}>
                      {item.PlayerEmail}
                    </td>
                    <td style={{ paddingTop: "20px" }}>
                      {item.PlayerPhoneNo}
                    </td>
                    <td style={{ paddingTop: "20px" }}>
                      {item.TotalAmount}
                    </td>
                    <td style={{ paddingTop: "20px" }}>
                    <td>
                      {item?.status == "Pending" ? (
                        <span style={{ color: "blue" }}>{item?.status}</span>
                      ) : (
                        <span style={{ color: "green" }}>
                          {item.status == "Not Received" ? (
                            <span style={{ color: "red" }}>{item?.status}</span>
                          ) : (
                            <span>{item?.status}</span>
                          )}
                        </span>
                      )}
                      <div>
                        {item?.status !== "Received" ? (
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button
                              type="button"
                              class="btn btn-success"
                              onClick={() => {
                                seteditid(item?._id);
                                setstatus("Received");
                                handleShow10();
                              }}
                            >
                              Received
                            </button>
                            <button
                              type="button"
                              class="btn btn-danger"
                              onClick={() => {
                                seteditid(item?._id);
                                setstatus("Not Received");
                                handleShow10();
                              }}
                            >
                              Not Received
                            </button>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </td>
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
                    {/* 
                   
                    {/* <td>
                      {item?.status == "Pending" ? (
                        <span style={{ color: "blue" }}>{item?.status}</span>
                      ) : (
                        <span style={{ color: "green" }}>
                          {item.status == "Not Received" ? (
                            <span style={{ color: "red" }}>{item?.status}</span>
                          ) : (
                            <span>{item?.status}</span>
                          )}
                        </span>
                      )}
                      <div>
                        {item?.status !== "Received" ? (
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button
                              type="button"
                              class="btn btn-success"
                              onClick={() => {
                                seteditid(item?._id);
                                setstatus("Received");
                                handleShow10();
                              }}
                            >
                              Received
                            </button>
                            <button
                              type="button"
                              class="btn btn-danger"
                              onClick={() => {
                                seteditid(item?._id);
                                setstatus("Not Received");
                                handleShow10();
                              }}
                            >
                              Not Received
                            </button>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
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
                    </td> */}
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
              onClick={Deleteregister}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      {/* {modal} */}
      <Modal show={show10} onHide={handleClose10}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <p style={{ color: "navy", fontSize: "20px" }}>
                Are You Sure Want to {status} This Payment Status?
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ backgroundColor: "#52f310", color: "#ffff" }}
            onClick={handleClose10}
          >
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "Success", color: "#ffff" }}
            onClick={makeStatusChangeContactUs}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RegistrationList;
