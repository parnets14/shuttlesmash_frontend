import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Image } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import "../Admin/Admin.css";
import axios from "axios";

const AdminBanner = () => {
  const [show, setShow] = useState();
  const [show4, setShow4] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);

  // integrating post method
  const formdata = new FormData();
  const [BannerImage, setBannerImage] = useState([]);
  const [BannerText, setBannerText] = useState("");
  const [BannerText2, setBannerText2] = useState("");
  const [BannerTagline, setBannerTagline] = useState("");
  const [editExistingImages, setEditExistingImages] = useState([]);

  const AddBannerdetails = async () => {
    try {
      if (!BannerImage || BannerImage.length === 0) {
        return alert("Please add Image/Video");
      }

      const fd = new FormData();
      // Append all files
      for (let i = 0; i < BannerImage.length; i++) {
        fd.append("BannerImage", BannerImage[i]);
      }
      fd.append("BannerText", BannerText);
      fd.append("BannerText2", BannerText2);
      fd.append("BannerTagline", BannerTagline);

      const config = {
        url: "admin/banner",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: { "content-type": "multipart/form-data" },
        data: fd,
      };
      let res = await axios(config);
      if (res.status === 200) {
        alert(res.data.success);
        getAddBanner();
        handleClose();
        setBannerImage([]);
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.msg || "Error adding banner");
    }
  };

  //integrating get  method
  const [AddBanner, setAddBanner] = useState([]);
  const getAddBanner = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getbanner`);
      if (res.status === 200) {
        setAddBanner(res.data.getbanner);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //delete method
  const [Data, setData] = useState("");
  const DeleteBanner = async () => {
    try {
      const config = {
        url: "admin/Deletebanner/" + Data,
        method: "delete",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "application/json" },
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("Successfully Delete");
          getAddBanner();
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
    setBannerText(item?.BannerText || "");
    setBannerText2(item?.BannerText2 || "");
    setBannerTagline(item?.BannerTagline || "");
    setBannerImage([]);
    // Set existing images for display
    const imgs = item?.BannerImages?.length > 0 ? [...item.BannerImages] : (item?.BannerImage ? [item.BannerImage] : []);
    setEditExistingImages(imgs);
  };

  const EditBanner = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    // Add new files if selected
    if (BannerImage && BannerImage.length > 0) {
      BannerImage.forEach(file => fd.append("BannerImage", file));
    }
    fd.append("BannerText", BannerText);
    fd.append("BannerTagline", BannerTagline);
    fd.append("BannerText2", BannerText2);
    fd.append("id", Data1?._id);
    // Send remaining existing images (after user deleted some)
    fd.append("existingImages", JSON.stringify(editExistingImages));
    try {
      const config = {
        url: "admin/editbanner",
        method: "put",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: { "content-type": "multipart/form-data" },
        data: fd,
      };
      const res = await axios(config);
      if (res.status === 200) {
        alert("Successfully Updated");
        handleClose3();
        getAddBanner();
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "Update failed");
    }
  };

  useEffect(() => {
    getAddBanner();
  }, []);

  // pagination
  const [currenpage, setCurrentpage] = useState(1);
  const recordsperpage = 5;
  const lastIndex = currenpage * recordsperpage;
  const firstIndex = lastIndex - recordsperpage;
  const records = AddBanner.slice(firstIndex, lastIndex);
  const npages = Math.ceil(AddBanner.length / recordsperpage);
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
    <div className="customerhead p-2">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="header-c ">Home Banner</h2>
        <div>
          <button className="admin-add-btn" onClick={handleShow}>
            Add Banner
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
              <th>Sub Title</th>
              <th>Tagline</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {records?.map((item, i) => {
              const images = item?.BannerImages?.length > 0 ? item.BannerImages : (item?.BannerImage ? [item.BannerImage] : []);
              return (
                <tr key={i}>
                  <td>{i + 1 + firstIndex}</td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap" style={{ maxWidth: "300px" }}>
                      {images.slice(0, 3).map((img, idx) => {
                        const isVid = /\.(mp4|webm|ogg)$/i.test(img);
                        return isVid ? (
                          <video key={idx} width="60" height="60" autoPlay loop muted style={{ borderRadius: "6px", objectFit: "cover" }}>
                            <source src={`${process.env.REACT_APP_API_URL}/Homebanner/${img}`} type="video/mp4" />
                          </video>
                        ) : (
                          <Image key={idx} src={`${process.env.REACT_APP_API_URL}/Homebanner/${img}`} alt="banner"
                            style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }} />
                        );
                      })}
                      {images.length > 3 && <span style={{ fontSize: "12px", color: "#666", alignSelf: "center" }}>+{images.length - 3} more</span>}
                    </div>
                  </td>

                  <td style={{ paddingTop: "20px" }}>{item.BannerText}</td>
                  <td style={{ paddingTop: "20px" }}>{item.BannerText2}</td>
                  <td style={{ paddingTop: "20px" }}>{item.BannerTagline}</td>

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
      </div>

      {/* Add Package modal */}
      <Modal show={show} onHide={handleClose} style={{ zIndex: "99999" }}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Add Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="do-sear mt-2">
              <label>Add Banner Image / Video</label>
              <input
                type="file"
                multiple
                accept=".mp4,.webm,.ogg,.jpg,.jpeg,.png,.webp"
                className="vi_0"
                onChange={(e) => setBannerImage(Array.from(e.target.files))}
              />
              <small style={{ color: "#888", fontSize: "12px" }}>
                Accepted: images (jpg, png, webp) or videos (mp4, webm). Select multiple files at once.
              </small>
              {BannerImage.length > 0 && (
                <div style={{ marginTop: "8px", fontSize: "13px", color: "#031B77", fontWeight: 600 }}>
                  {BannerImage.length} file(s) selected
                </div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="do-sear mt-2">
              <label>Add Banner Title</label>
              <input
                type="text"
                className="vi_0"
                placeholder="Enter Banner Title"
                onChange={(e) => setBannerText(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="do-sear mt-2">
              <label>Add Banner Sub Title</label>
              <input
                type="text"
                className="vi_0"
                placeholder="Enter Banner Title"
                onChange={(e) => setBannerText2(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="do-sear mt-2">
              <label>Add Banner Tagline</label>
              <input
                type="text"
                className="vi_0"
                placeholder="Enter Banner Title"
                onChange={(e) => setBannerTagline(e.target.value)}
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
              onClick={AddBannerdetails}
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
          <Modal.Title style={{ color: "black" }}>Edit Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="do-sear mt-2">
              <label>Add More Images / Videos</label>
              <input
                type="file"
                multiple
                accept=".mp4,.webm,.ogg,.jpg,.jpeg,.png,.webp"
                className="vi_0"
                onChange={(e) => setBannerImage(Array.from(e.target.files))}
              />
              <small style={{ color: "#888", fontSize: "12px" }}>Select new files to add. Existing images shown below.</small>
            </div>
          </div>

          {/* Existing images/videos with delete */}
          {editExistingImages.length > 0 && (
            <div className="mt-3">
              <label style={{ fontWeight: 600 }}>Existing Images / Videos</label>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {editExistingImages.map((img, idx) => {
                  const isVideo = /\.(mp4|webm|ogg)$/i.test(img);
                  return (
                    <div key={idx} style={{ position: "relative", display: "inline-block" }}>
                      {isVideo ? (
                        <video
                          src={`${process.env.REACT_APP_API_URL}/Homebanner/${img}`}
                          style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "6px" }}
                          autoPlay loop muted playsInline
                        />
                      ) : (
                        <img src={`${process.env.REACT_APP_API_URL}/Homebanner/${img}`} alt="banner"
                          style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "6px" }} />
                      )}
                      <button onClick={() => setEditExistingImages(editExistingImages.filter((_, i) => i !== idx))}
                        style={{ position: "absolute", top: "-6px", right: "-6px", background: "#e53e3e", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="row">
            <div className="do-sear mt-2">
              <label>Edit Banner Title</label>
              <input
                type="text"
                className="vi_0"
                value={BannerText}
                placeholder="Enter Banner Title"
                onChange={(e) => setBannerText(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="do-sear mt-2">
              <label>Add Banner Sub Title</label>
              <input
                type="text"
                className="vi_0"
                value={BannerText2}
                placeholder="Enter Banner Title"
                onChange={(e) => setBannerText2(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="do-sear mt-2">
              <label>Add Banner Tagline</label>
              <input
                type="text"
                className="vi_0"
                value={BannerTagline}
                placeholder="Enter Banner Title"
                onChange={(e) => setBannerTagline(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" className="modal-close-btn" onClick={handleClose3}>
            Close
          </Button>
          <Button variant="" className="modal-add-btn" onClick={EditBanner}>
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
          <Button variant="" className="modal-add-btn" onClick={DeleteBanner}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminBanner;
