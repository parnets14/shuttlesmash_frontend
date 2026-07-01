import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Image } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import "../Admin/Admin.css";
import axios from "axios";
import { IoMdEye } from "react-icons/io";

const API_URL = process.env.REACT_APP_API_URL || "https://shuttlesmash.in";

const AdminGallery = () => {
  // image add
  const [show, setShow] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // image delt
  const [show4, setShow4] = useState();
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);

  // vedio add
  const [show2, setShow2] = useState();
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  // vedio delt
  const [show5, setShow5] = useState();
  const handleClose5 = () => setShow5(false);
  const handleShow5 = () => setShow5(true);

  // Conditions
  const [showImages, setShowImages] = useState(true);
  const [Video, setVideo] = useState(false);
  const [HeroBannerTab, setHeroBannerTab] = useState(false);

  // =======================HERO BANNER STATE==================//
  const [HeroImage, setHeroImage] = useState("");
  const [HeroTitle, setHeroTitle] = useState("");
  const [HeroDescription, setHeroDescription] = useState("");
  const [AddHeroBanner, setAddHeroBanner] = useState([]);
  const [editHeroItem, setEditHeroItem] = useState(null);
  const [deleteHeroId, setDeleteHeroId] = useState("");

  // Hero Banner modals
  const [showHeroAdd, setShowHeroAdd] = useState(false);
  const [showHeroEdit, setShowHeroEdit] = useState(false);
  const [showHeroDel, setShowHeroDel] = useState(false);

  // GET hero banners
  const getHeroBanner = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/getgalleryheroBanner`);
      if (res.status === 200) setAddHeroBanner(res.data.getheroBanner || []);
    } catch (e) {
      if (e.response?.status !== 404) console.log(e);
    }
  };

  // ADD hero banner
  const addHeroBanner = async () => {
    if (!HeroImage) return alert("Please upload an image");
    if (!HeroTitle.trim()) return alert("Please enter a title");
    if (!HeroDescription.trim()) return alert("Please enter a description");
    const fd = new FormData();
    fd.append("HeroImage", HeroImage);
    fd.append("HeroTitle", HeroTitle);
    fd.append("HeroDescription", HeroDescription);
    try {
      const res = await axios.post(`${API_URL}/api/admin/addgalleryheroBanner`, fd, {
        headers: { "content-type": "multipart/form-data" },
      });
      if (res.status === 200) {
        alert(res.data.success);
        getHeroBanner();
        setShowHeroAdd(false);
        setHeroImage("");
        setHeroTitle("");
        setHeroDescription("");
      }
    } catch (e) {
      console.log(e);
      alert(e?.response?.data?.error || "Error adding hero banner");
    }
  };

  // EDIT hero banner
  const editHeroBanner = async () => {
    const fd = new FormData();
    fd.append("id", editHeroItem._id);
    fd.append("HeroTitle", HeroTitle);
    fd.append("HeroDescription", HeroDescription);
    if (HeroImage) fd.append("HeroImage", HeroImage);
    try {
      const res = await axios.put(`${API_URL}/api/admin/editgalleryheroBanner`, fd, {
        headers: { "content-type": "multipart/form-data" },
      });
      if (res.status === 200) {
        alert(res.data.success);
        getHeroBanner();
        setShowHeroEdit(false);
      }
    } catch (e) {
      console.log(e);
      alert(e?.response?.data?.error || "Update failed");
    }
  };

  // DELETE hero banner
  const deleteHeroBanner = async () => {
    try {
      const res = await axios.delete(`${API_URL}/api/admin/deletegalleryheroBanner/${deleteHeroId}`);
      if (res.status === 200) {
        alert(res.data.success);
        getHeroBanner();
        setShowHeroDel(false);
      }
    } catch (e) {
      console.log(e);
      alert(e?.response?.data?.error || "Delete failed");
    }
  };

  useEffect(() => { getHeroBanner(); }, []);

  // =======================IMAGES==================//
  const [View, setView] = useState({});
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const [Image5, setImage5] = useState([]);
  const [imageURL2, setimageURL2] = useState([]);

  const onImageChange2 = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      setImage5(files);
      setimageURL2(files.map((f) => URL.createObjectURL(f)));
    }
  };

  const [galleryImages, setGalleryImages] = useState([]);
  const removeItem2 = (val) => {
    setGalleryImages((prev) => prev.filter((_, index) => index !== val));
  };

  // integrating post method
  const formdata = new FormData();
  const [GalleryImage, setGalleryImage] = useState("");
  const [GalleryTitle, setGalleryTitle] = useState("");

  const AddGallerydetails = async () => {
    if (!GalleryTitle) return alert("Please enter a title");
    if (Image5.length === 0) return alert("Please select at least one image");

    try {
      const formdatasss = new FormData();
      formdatasss.append("GalleryTitle", GalleryTitle);
      Image5.forEach((file) => {
        formdatasss.append("PlaceImages", file);
      });

      const config = {
        url: "admin/Addgallery",
        method: "post",
        baseURL: `${API_URL}/api/`,
        headers: { "content-type": "multipart/form-data" },
        data: formdatasss,
      };

      let response = await axios(config);
      if (response.status === 200) {
        alert("Data added successfully");
        getAddGallery();
        handleClose();
        setImage5([]);
        setimageURL2([]);
        setGalleryTitle("");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.msg || "Error occurred while adding gallery images");
    }
  };



  //integrating get  method
  const [AddGallery, setAddGallery] = useState([]);
  const getAddGallery = async () => {
    try {
      let res = await axios.get(
        `${API_URL}/api/admin/getgallery`
      );
      if (res.status === 200) {
        setAddGallery(res.data.getgallery);
        setNoChangeData1(res.data.getgallery);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log("AddGallery", AddGallery);

  //delete method
  const [Data, setData] = useState("");
  const DeleteGallery = async () => {
    try {
      const config = {
        url: "admin/Deletegallery/" + Data,
        method: "delete",
        baseURL: `${API_URL}/api/`,
        header: { "content-type": "application/json" },
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("Successfully Delete");
          getAddGallery();
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
  const [editImages, setEditImages] = useState([]);
  const [editImageURLs, setEditImageURLs] = useState([]);
  const handleClose3 = () => {
    setShow3(false);
    setEditImages([]);
    setEditImageURLs([]);
  };
  const handleShow3 = (item) => {
    setShow3(true);
    setData1(item);
    setGalleryTitle(item?.GalleryTitle);
  };

  const EditGallery = async () => {
    try {
      const formEdit = new FormData();
      formEdit.append("galleryId", Data1?._id);
      formEdit.append("GalleryTitle", GalleryTitle);
      editImages.forEach((file) => {
        formEdit.append("PlaceImages", file);
      });

      const config = {
        url: "admin/Editglry",
        method: "put",
        baseURL: `${API_URL}/api/`,
        headers: { "content-type": "multipart/form-data" },
        data: formEdit,
      };
      const res = await axios(config);
      if (res.status === 200) {
        alert("Successfully Updated");
        handleClose3();
        getAddGallery();
      }
    } catch (error) {
      console.log("EditGallery error:", error);
      console.log("Response:", error.response?.data);
      alert(error.response?.data?.error || error.response?.data?.details || "Update failed");
    }
  };

  useEffect(() => {
    getAddGallery();
  }, []);

  // pagination
  const [currenpage, setCurrentpage] = useState(1);
  const recordsperpage = 5;
  const lastIndex = currenpage * recordsperpage;
  const firstIndex = lastIndex - recordsperpage;
  const records = AddGallery.slice(firstIndex, lastIndex);
  const npages = Math.ceil(AddGallery.length / recordsperpage);
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
      setAddGallery(filteredData1);
    } else {
      setAddGallery(nochangedata1);
    }
  };

  // ======================GALLERY VIDEO=================//

  // integrating post method
  const [GalleryVedio, setGalleryVedio] = useState("");
  const [GalleryVedioTitle, setGalleryVedioTitle] = useState("");

  const AddGalleryVideodetails = async () => {
    try {
      if (!GalleryVedioTitle) return alert("Please add title");
      if (!GalleryVedio) return alert("Please add video");

      const fd = new FormData();
      fd.append("GalleryVedio", GalleryVedio);
      fd.append("GalleryVedioTitle", GalleryVedioTitle);

      const config = {
        url: "admin/galleryvedio",
        method: "post",
        baseURL: `${API_URL}/api/`,
        headers: { "content-type": "multipart/form-data" },
        data: fd,
      };
      let res = await axios(config);
      if (res.status === 200) {
        alert(res.data.success);
        getAddGalleryvideo();
        handleClose2();
        setGalleryVedio("");
        setGalleryVedioTitle("");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.msg || "Failed to add video");
    }
  };

  //integrating get  method
  const [AddGalleryvideo, setAddGalleryvideo] = useState([]);
  const getAddGalleryvideo = async () => {
    try {
      let res = await axios.get(
        `${API_URL}/api/admin/getgalleryvedio`
      );
      if (res.status === 200) {
        setAddGalleryvideo(res.data.getgalleryvedio);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //delete method
  const [Datav, setDatav] = useState("");
  const DeleteVedio = async () => {
    try {
      const config = {
        url: "admin/Deletegalleryvedio/" + Datav,
        method: "delete",
        baseURL: `${API_URL}/api/`,
        header: { "content-type": "application/json" },
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("Successfully Delete");
          getAddGalleryvideo();
          handleClose5();
        }
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  //update method
  const [Datavd, setDatavd] = useState("");
  const [show6, setShow6] = useState(false);
  const handleClose6 = () => setShow6(false);
  const handleShow6 = (item) => {
    setShow6(true);
    setDatavd(item);
    setGalleryVedioTitle(item?.GalleryVedioTitle);
  };

  const EditVedio = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      if (GalleryVedio) fd.append("GalleryVedio", GalleryVedio);
      fd.append("GalleryVedioTitle", GalleryVedioTitle);
      fd.append("id", Datavd?._id);
      const config = {
        url: "admin/editgalleryvedio",
        method: "put",
        baseURL: `${API_URL}/api/`,
        headers: { "content-type": "multipart/form-data" },
        data: fd,
      };
      const res = await axios(config);
      if (res.status === 200) {
        alert("Successfully Updated");
        getAddGalleryvideo();
        handleClose6();
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "Update failed");
    }
  };

  useEffect(() => {
    getAddGalleryvideo();
  }, []);

  // pagination
  const [currenpage1, setCurrentpage1] = useState(1);
  const recordsperpage1 = 5;
  const lastIndex1 = currenpage1 * recordsperpage1;
  const firstIndex1 = lastIndex1 - recordsperpage1;
  const records1 = AddGalleryvideo.slice(firstIndex1, lastIndex1);
  const npages1 = Math.ceil(AddGalleryvideo.length / recordsperpage1);
  const numbers1 = [...Array(npages1 + 1).keys()].slice(1);

  function changePage1(id) {
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

  return (
    <div className="customerhead p-2">
      <div className="d-flex gap-3 mb-3">
        <div onClick={() => { setShowImages(true); setVideo(false); setHeroBannerTab(false); }}>
          <Button>Images</Button>
        </div>
        <div onClick={() => { setShowImages(false); setVideo(true); setHeroBannerTab(false); }}>
          <Button>Videos</Button>
        </div>
        <div onClick={() => { setShowImages(false); setVideo(false); setHeroBannerTab(true); }}>
          <Button>Hero Banner</Button>
        </div>
      </div>

      {showImages ? (
        <>
          <div>
            <div className="col-lg-4 d-flex justify-content-center">
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
              <h2 className="header-c ">Gallery Images</h2>
              <button className="admin-add-btn" onClick={handleShow}>
                Add Gallery Image
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
                    <th>S.No</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {records?.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1 + firstIndex}</td>
                        <td style={{ paddingTop: "20px" }}>
                          <IoMdEye
                            style={{ fontSize: "22" }}
                            onClick={() => {
                              handleShow1();
                              setView(item);
                            }}
                          />
                        </td>

                        <td style={{ paddingTop: "20px" }}>
                          {item.GalleryTitle}
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

            {/* Add Package modal */}
            <Modal show={show} onHide={handleClose} style={{ zIndex: "99999" }}>
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>
                  Add Gallery
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="do-sear mt-2">
                    <label>Add Gallery Title</label>
                    <input
                      type="text"
                      className="vi_0"
                      placeholder="Enter Gallery text"
                      onChange={(e) => setGalleryTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="do-sear mt-2">
                    <label>Add Place Images (select multiple)</label>
                    <input
                      type="file"
                      multiple
                      className="vi_0"
                      onChange={onImageChange2}
                    />
                  </div>

                  {/* Preview selected images */}
                  {imageURL2.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {imageURL2.map((url, i) => (
                        <div key={i} style={{ position: "relative", display: "inline-block" }}>
                          <img
                            src={url}
                            alt="preview"
                            style={{ width: "75px", height: "75px", objectFit: "cover", borderRadius: "4px" }}
                          />
                          <button
                            onClick={() => {
                              const newFiles = Image5.filter((_, idx) => idx !== i);
                              const newURLs = imageURL2.filter((_, idx) => idx !== i);
                              setImage5(newFiles);
                              setimageURL2(newURLs);
                            }}
                            style={{
                              position: "absolute", top: "-6px", right: "-6px",
                              background: "#e53e3e", color: "#fff", border: "none",
                              borderRadius: "50%", width: "20px", height: "20px",
                              fontSize: "11px", cursor: "pointer", display: "flex",
                              alignItems: "center", justifyContent: "center",
                              lineHeight: 1, padding: 0
                            }}
                          >✕</button>
                        </div>
                      ))}
                    </div>
                  )}
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
                    onClick={AddGallerydetails}
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
                  Edit Gallery
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="do-sear mt-2">
                    <label>Gallery Title</label>
                    <input
                      type="text"
                      className="vi_0"
                      placeholder="Enter Gallery text"
                      value={GalleryTitle}
                      onChange={(e) => setGalleryTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="do-sear mt-2">
                    <label>Add More Images (optional)</label>
                    <input
                      type="file"
                      multiple
                      className="vi_0"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setEditImages(files);
                        setEditImageURLs(files.map((f) => URL.createObjectURL(f)));
                      }}
                    />
                  </div>

                  {/* Existing images */}
                  {Data1?.PlaceImages?.length > 0 && (
                    <div className="mt-2">
                      <label>Existing Images</label>
                      <div className="d-flex flex-wrap gap-2 mt-1">
                        {Data1?.PlaceImages?.map((img, i) => (
                          <div key={i} style={{ position: "relative", display: "inline-block" }}>
                            <img
                              src={`${API_URL}/Gallery/${img?.placepicture}`}
                              alt="existing"
                              style={{ width: "75px", height: "75px", objectFit: "cover", borderRadius: "4px" }}
                            />
                            <button
                              title="Delete image"
                              onClick={async () => {
                                if (!window.confirm("Delete this image?")) return;
                                try {
                                  const res = await axios.delete(`${API_URL}/api/admin/deletegalleryimage`, {
                                    data: { id: Data1._id, galleryid: img._id }
                                  });
                                  if (res.status === 200) {
                                    setData1(prev => ({
                                      ...prev,
                                      PlaceImages: prev.PlaceImages.filter((_, idx) => idx !== i)
                                    }));
                                  }
                                } catch (e) { alert("Failed to delete image"); }
                              }}
                              style={{
                                position: "absolute", top: "-7px", right: "-7px",
                                background: "#e53e3e", color: "#fff",
                                border: "none", borderRadius: "50%",
                                width: "22px", height: "22px",
                                fontSize: "13px", fontWeight: "bold",
                                cursor: "pointer", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                lineHeight: 1, padding: 0,
                                boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
                              }}
                            >✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New image previews */}
                  {editImageURLs.length > 0 && (
                    <div className="mt-2">
                      <label>New Images to Add</label>
                      <div className="d-flex flex-wrap gap-2 mt-1">
                        {editImageURLs.map((url, i) => (
                          <div key={i} style={{ position: "relative", display: "inline-block" }}>
                            <img
                              src={url}
                              alt="new"
                              style={{ width: "75px", height: "75px", objectFit: "cover", borderRadius: "4px" }}
                            />
                            <button
                              onClick={() => {
                                const newFiles = editImages.filter((_, idx) => idx !== i);
                                const newURLs = editImageURLs.filter((_, idx) => idx !== i);
                                setEditImages(newFiles);
                                setEditImageURLs(newURLs);
                              }}
                              style={{
                                position: "absolute", top: "-6px", right: "-6px",
                                background: "#e53e3e", color: "#fff", border: "none",
                                borderRadius: "50%", width: "20px", height: "20px",
                                fontSize: "11px", cursor: "pointer", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                lineHeight: 1, padding: 0
                              }}
                            >✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                <Button
                  variant=""
                  className="modal-add-btn"
                  onClick={EditGallery}
                >
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
                  onClick={DeleteGallery}
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>

            {/* View Imag modal  */}

            <Modal
              show={show1}
              onHide={handleClose1}
              backdrop="static"
              keyboard={false}
              style={{ zIndex: "99999" }}
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>
                  Gallery Images
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <Table bordered className="sdfsd-table-head mt-2">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Image</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {View?.PlaceImages?.map((items, i) => {
                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>
                              <Image
                                src={`${API_URL}/Gallery/${items?.placepicture}`}
                                alt="pic"
                                style={{ width: "75px", height: "75px" }}
                              />
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                                <div>
                                  <AiFillDelete
                                    className="text-danger"
                                    style={{ cursor: "pointer", fontSize: "20px" }}
                                    onClick={async () => {
                                      if (!window.confirm("Are you sure you want to delete this image?")) return;
                                      try {
                                        const res = await axios.delete(`${API_URL}/api/admin/deletegalleryimage`, {
                                          data: { id: View._id, galleryid: items._id }
                                        });
                                        if (res.status === 200) {
                                          setView(prev => ({
                                            ...prev,
                                            PlaceImages: prev.PlaceImages.filter((_, idx) => idx !== i)
                                          }));
                                          getAddGallery();
                                        }
                                      } catch (e) {
                                        console.log(e);
                                        alert("Failed to delete image");
                                      }
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
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant=""
                  className="modal-close-btn"
                  onClick={handleClose1}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </>
      ) : (
        <></>
      )}

      {Video ? (
        <>
          <div>
            <div className="col-lg-4 d-flex justify-content-center">
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
              <h2 className="header-c ">Gallery Videos</h2>
              <button className="admin-add-btn" onClick={handleShow2}>
                Add Gallery Video
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
                    <th>S.No</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {records1?.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1 + firstIndex1}</td>
                        <td style={{ paddingTop: "20px" }}>
                          <video width="auto" height="150" autoPlay loop muted>
                            <source
                              src={`${API_URL}/Gallery/${item?.GalleryVedio}`}
                              type="video/mp4"
                              style={{width:"100px", height:"80px"}}
                            />
                          </video>
                        </td>

                        <td style={{ paddingTop: "20px" }}>
                          {item.GalleryVedioTitle}
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
                                onClick={() => handleShow6(item)}
                              />{" "}
                            </div>
                            <div>
                              <AiFillDelete
                                className="text-danger"
                                style={{ cursor: "pointer", fontSize: "20px" }}
                                onClick={() => {
                                  handleShow5();
                                  setDatav(item?._id);
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

            {/* Add vedio modal */}
            <Modal
              show={show2}
              onHide={handleClose2}
              style={{ zIndex: "99999" }}
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>
                  Add Gallery Videos
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="do-sear mt-2">
                    <label>Add Video Title</label>
                    <input
                      type="text"
                      className="vi_0"
                      placeholder="Enter Video Title"
                      onChange={(e) => setGalleryVedioTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="do-sear mt-2">
                    <label>Add Gallery Video</label>
                    <input
                      type="file"
                      name=""
                      id=""
                      accept=".mp4,.webm"
                      className="vi_0"
                      onChange={(e) => setGalleryVedio(e.target.files[0])}
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="d-flex">
                  <Button
                    className="mx-2 modal-close-btn"
                    variant=""
                    onClick={handleClose2}
                  >
                    Close
                  </Button>
                  <Button
                    className="mx-2 modal-add-btn"
                    variant=""
                    onClick={AddGalleryVideodetails}
                  >
                    Add
                  </Button>
                </div>
              </Modal.Footer>
            </Modal>

            {/* Edit Package modal */}
            <Modal
              show={show6}
              onHide={handleClose6}
              backdrop="static"
              keyboard={false}
              style={{ zIndex: "99999" }}
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>
                  Edit Gallery Videos
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="do-sear mt-2">
                    <label>Add Video Title</label>
                    <input
                      type="text"
                      className="vi_0"
                      placeholder="Enter Video Title"
                      value={GalleryVedioTitle}
                      onChange={(e) => setGalleryVedioTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="do-sear mt-2">
                    <label>Add Gallery Video</label>
                    <input
                      type="file"
                      name=""
                      id=""
                      accept=".mp4,.webm,.mov,.avi"
                      className="vi_0"
                      onChange={(e) => setGalleryVedio(e.target.files[0])}
                    />
                    <small className="text-muted">Leave empty to keep current video</small>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant=""
                  className="modal-close-btn"
                  onClick={handleClose6}
                >
                  Close
                </Button>
                <Button
                  variant=""
                  className="modal-add-btn"
                  onClick={EditVedio}
                >
                  Update
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Delet modal  */}
            <Modal
              show={show5}
              onHide={handleClose5}
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
                  onClick={handleClose5}
                >
                  Close
                </Button>
                <Button
                  variant=""
                  className="modal-add-btn"
                  onClick={DeleteVedio}
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </>
      ) : (
        <></>
      )}

      {/* ==============GALLERY HERO BANNER TAB==================== */}
      {HeroBannerTab && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="header-c">Gallery Hero Banner</h2>
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
                    <Image
                      src={`${API_URL}/GalleryHeroBanner/${item.HeroImage}`}
                      alt="hero"
                      style={{ width: "140px", height: "70px", objectFit: "cover", borderRadius: "6px" }}
                    />
                  </td>
                  <td style={{ paddingTop: "20px" }}>{item.HeroTitle}</td>
                  <td style={{ paddingTop: "20px", maxWidth: "260px" }}>{item.HeroDescription}</td>
                  <td>
                    <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                      <BiSolidEdit
                        className="text-success"
                        style={{ cursor: "pointer", fontSize: "20px" }}
                        onClick={() => {
                          setEditHeroItem(item);
                          setHeroTitle(item.HeroTitle);
                          setHeroDescription(item.HeroDescription);
                          setHeroImage("");
                          setShowHeroEdit(true);
                        }}
                      />
                      <AiFillDelete
                        className="text-danger"
                        style={{ cursor: "pointer", fontSize: "20px" }}
                        onClick={() => { setDeleteHeroId(item._id); setShowHeroDel(true); }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {(!AddHeroBanner || AddHeroBanner.length === 0) && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-3">
                    No hero banner added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Add Hero Banner Modal */}
          <Modal show={showHeroAdd} onHide={() => setShowHeroAdd(false)} style={{ zIndex: 99999 }}>
            <Modal.Header closeButton>
              <Modal.Title>Add Gallery Hero Banner</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="do-sear mt-2">
                <label>Banner Image <span style={{ color: "red" }}>*</span></label>
                <input
                  type="file"
                  accept="image/*"
                  className="vi_0"
                  onChange={(e) => setHeroImage(e.target.files[0])}
                />
              </div>
              <div className="do-sear mt-2">
                <label>Title <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  className="vi_0"
                  placeholder="e.g. GALLERY"
                  value={HeroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                />
              </div>
              <div className="do-sear mt-2">
                <label>Description <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  className="vi_0"
                  placeholder="e.g. Relive the moments — every match, every memory"
                  value={HeroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-close-btn" variant="" onClick={() => setShowHeroAdd(false)}>Close</Button>
              <Button className="modal-add-btn" variant="" onClick={addHeroBanner}>Add</Button>
            </Modal.Footer>
          </Modal>

          {/* Edit Hero Banner Modal */}
          <Modal show={showHeroEdit} onHide={() => setShowHeroEdit(false)} style={{ zIndex: 99999 }}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Gallery Hero Banner</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="do-sear mt-2">
                <label>Banner Image <small className="text-muted">(leave empty to keep current)</small></label>
                <input
                  type="file"
                  accept="image/*"
                  className="vi_0"
                  onChange={(e) => setHeroImage(e.target.files[0])}
                />
                {editHeroItem?.HeroImage && !HeroImage && (
                  <Image
                    src={`${API_URL}/GalleryHeroBanner/${editHeroItem.HeroImage}`}
                    alt="current"
                    style={{ marginTop: "8px", height: "60px", borderRadius: "4px" }}
                  />
                )}
              </div>
              <div className="do-sear mt-2">
                <label>Title <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  className="vi_0"
                  value={HeroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                />
              </div>
              <div className="do-sear mt-2">
                <label>Description <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  className="vi_0"
                  value={HeroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-close-btn" variant="" onClick={() => setShowHeroEdit(false)}>Close</Button>
              <Button className="modal-add-btn" variant="" onClick={editHeroBanner}>Update</Button>
            </Modal.Footer>
          </Modal>

          {/* Delete Hero Banner Modal */}
          <Modal show={showHeroDel} onHide={() => setShowHeroDel(false)} style={{ zIndex: 99999 }}>
            <Modal.Header closeButton>
              <Modal.Title>Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="fs-5" style={{ color: "red" }}>Are you sure you want to delete this banner?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-close-btn" variant="" onClick={() => setShowHeroDel(false)}>Cancel</Button>
              <Button className="modal-add-btn" variant="" onClick={deleteHeroBanner}>Delete</Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
