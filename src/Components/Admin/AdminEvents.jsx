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
import { IoEye } from "react-icons/io5";
import { MdClose } from "react-icons/md";

// API URL with fallback
const API_URL = process.env.REACT_APP_API_URL || "https://shuttlesmash.in";

const AdminEvents = () => {
  // Verify API URL is loaded
  useEffect(() => {
    if (!process.env.REACT_APP_API_URL) {
      console.error("REACT_APP_API_URL is not defined. Please check your .env file.");
    }
  }, []);

  const [show4, setShow4] = useState();
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);

  const [show, setShow] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setEventImage(""); setEventName(""); setEventStartdate(""); setEventEnddate("");
    setEventLocation(""); setEventExhibits(""); setTime("");
    setAddCategories([{ CategoryName: "", CategoryPrice: "", TotalPlayers: 1, CategoryType: "", Limit: 0 }]);
    setAddEventInfo({ Venue: "", OrganizerName: "", OrganizerEmail: "", OvTitle: "", OvSubtitle: "", OvInitiative: "", OvStatus: "", OvSections: [{ sectionTitle: "", points: [""] }], OvEntryFee: "", OvEntryFeeNote: "", OvYouTubeLink: "" });
    setAddBrochureFile(""); setAddFormTab("event");
    setShow(true);
  };


  // EVENTS BANNER add
  const [show5, setShow5] = useState();
  const handleClose5 = () => setShow5(false);
  const handleShow5 = () => setShow5(true);

  // EVENTS BANNER edit
  const [show6, setShow6] = useState();

  // Condition for tabs
  const [Event, setEvent] = useState(true);
  const [Eventbanner, setEventbanner] = useState(false);
  const [Terms, setTerms] = useState(false);
  const [Brochures, setBrochures] = useState(false);
  const [HeroBannerTab, setHeroBannerTab] = useState(false);
  const [CategoryTab, setCategoryTab] = useState(false);
  const [EventInfoTab, setEventInfoTab] = useState(false);

  // integrating post method
  const formdata = new FormData();
  const [EventImage, setEventImage] = useState("");
  const [EventName, setEventName] = useState("");
  const [EventCategory, setEventCategory] = useState([]);
  const [EventStartdate, setEventStartdate] = useState("");
  const [EventEnddate, setEventEnddate] = useState("");
  const [EventLocation, setEventLocation] = useState("");
  const [EventExhibits, setEventExhibits] = useState("");
  const [Price, setPrice] = useState("");
  const [Time, setTime] = useState("");

  // Categories for the event
  const [addCategories, setAddCategories] = useState([{ CategoryName: "", CategoryPrice: "", TotalPlayers: 1, CategoryType: "" }]);

  // Event Info for the event
  const [addEventInfo, setAddEventInfo] = useState({
    Venue: "", OrganizerName: "", OrganizerEmail: "",
    OvTitle: "", OvSubtitle: "", OvInitiative: "", OvStatus: "",
    OvSections: [{ sectionTitle: "", points: [""] }],
    OvEntryFee: "", OvEntryFeeNote: "", OvYouTubeLink: ""
  });

  // Tab inside Add Event modal
  const [addFormTab, setAddFormTab] = useState("event");

  // Tab inside Edit Event modal
  const [editFormTab, setEditFormTab] = useState("event");

  // Brochure file for the event
  const [addBrochureFile, setAddBrochureFile] = useState("");

  const AddEventDetails = async () => {
    try {
      if (!EventImage) return alert("Please add Image");
      if (!EventName) return alert("Please add Event Name");
      if (!EventStartdate) return alert("Please add Event Start Date");
      if (!EventEnddate) return alert("Please add Event End Date");
      if (!Time) return alert("Please select Time");
      if (!EventLocation) return alert("Please add Event Location");

      // Validate at least one category
      const validCats = addCategories.filter(c => c.CategoryName && c.CategoryPrice);
      if (validCats.length === 0) return alert("Please add at least one category with name and price");

      const fd = new FormData();
      fd.append("EventImage", EventImage);
      fd.append("EventName", EventName);
      fd.append("EventStartdate", EventStartdate);
      fd.append("EventEnddate", EventEnddate);
      fd.append("EventLocation", EventLocation);
      fd.append("EventExhibits", EventExhibits);
      fd.append("Time", Time);
      fd.append("Categories", JSON.stringify(validCats));
      fd.append("EventInfo", JSON.stringify(addEventInfo));
      if (addBrochureFile) fd.append("Brochure", addBrochureFile);

      const config = {
        url: "admin/events",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: { "content-type": "multipart/form-data" },
        data: fd,
      };
      let res = await axios(config);
      if (res.status === 200) {
        alert(res.data.success);
        getAddEvents();
        handleClose();
        setAddCategories([{ CategoryName: "", CategoryPrice: "", TotalPlayers: 1, CategoryType: "" }]);
        setAddEventInfo({ Venue: "", OrganizerName: "", OrganizerEmail: "", OvTitle: "", OvSubtitle: "", OvInitiative: "", OvStatus: "", OvSections: [{ sectionTitle: "", points: [""] }], OvEntryFee: "", OvEntryFeeNote: "", OvYouTubeLink: "" });
        setAddBrochureFile("");
        setAddFormTab("event");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "Failed to add event");
    }
  };
  //integrating get  method
  const [AddEvents, setAddEvents] = useState([]);
  const getAddEvents = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getevents`);
      if (res.status === 200) {
        setAddEvents(res.data.getevents || []);
        setNoChangeData1(res.data.getevents || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //delete method
  const [Data, setData] = useState("");
  const DeleteEvent = async () => {
    try {
      const config = {
        url: "admin/Deleteevents/" + Data,
        method: "delete",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "application/json" },
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("Successfully Delete");
          getAddEvents();
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
    setEventName(item?.EventName);
    setEventCategory(item?.EventCategory);
    setEventStartdate(item?.EventStartdate);
    setEventEnddate(item?.EventEnddate);
    setEventLocation(item?.EventLocation);
    setEventExhibits(item?.EventExhibits);
    setPrice(item?.Price);
    setTime(item?.Time);
    // Load embedded categories and event info
    setAddCategories(item?.Categories?.length > 0 ? item.Categories : [{ CategoryName: "", CategoryPrice: "", TotalPlayers: 1, CategoryType: "", Limit: 0 }]);
    setAddEventInfo(item?.EventInfo || { Venue: "", OrganizerName: "", OrganizerEmail: "", OvTitle: "", OvSubtitle: "", OvInitiative: "", OvStatus: "", OvSections: [{ sectionTitle: "", points: [""] }], OvEntryFee: "", OvEntryFeeNote: "", OvYouTubeLink: "" });
    setAddBrochureFile("");
    setEditFormTab("event");
  };

  const EditEvents = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      if (EventImage) fd.append("EventImage", EventImage);
      fd.append("EventName", EventName);
      fd.append("EventStartdate", EventStartdate);
      fd.append("EventEnddate", EventEnddate);
      fd.append("EventLocation", EventLocation);
      fd.append("EventExhibits", EventExhibits);
      fd.append("Time", Time);
      fd.append("id", Data1?._id);
      fd.append("Categories", JSON.stringify(addCategories.filter(c => c.CategoryName)));
      fd.append("EventInfo", JSON.stringify(addEventInfo));
      if (addBrochureFile) fd.append("Brochure", addBrochureFile);

      const config = {
        url: "admin/editevents",
        method: "put",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: { "content-type": "multipart/form-data" },
        data: fd,
      };
      const res = await axios(config);
      if (res.status === 200) {
        alert("Successfully Updated");
        handleClose3();
        getAddEvents();
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "Update failed");
    }
  };

  useEffect(() => {
    getAddEvents();
  }, []);

  // UI-only hidden events (hidden from user website, still visible in admin)
  const [hiddenEvents, setHiddenEvents] = useState([]);
  const hideEventFromUI = (id) => {
    const updated = [...hiddenEvents, id];
    setHiddenEvents(updated);
    localStorage.setItem("hiddenEvents", JSON.stringify(updated));
  };
  const unhideEventFromUI = (id) => {
    const updated = hiddenEvents.filter(e => e !== id);
    setHiddenEvents(updated);
    localStorage.setItem("hiddenEvents", JSON.stringify(updated));
  };

  // Load hidden events from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("hiddenEvents");
    if (stored) setHiddenEvents(JSON.parse(stored));
  }, []);

  // pagination
  const [currenpage, setCurrentpage] = useState(1);
  const recordsperpage = 5;
  const lastIndex = currenpage * recordsperpage;
  const firstIndex = lastIndex - recordsperpage;
  const records = (AddEvents || []).slice(firstIndex, lastIndex);
  const npages = Math.ceil((AddEvents?.length || 0) / recordsperpage);
  const numbers = [...Array(Math.max(npages, 0) + 1).keys()].slice(1);

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
      setAddEvents(filteredData1);
    } else {
      setAddEvents(nochangedata1);
    }
  };

  // ==============EVENTS BROCHURES==============================//
  const [View, setView] = useState({});
  const [showFile, setShowFile] = useState();
  const handleCloseFile = () => setShowFile(false);
  const handleShowFile = () => setShowFile(true);

  const [showB, setShowB] = useState();
  const handleCloseB = () => setShowB(false);
  const handleShowB = () => setShowB(true);

  const [showD, setShowD] = useState();
  const handleCloseD = () => setShowD(false);
  const handleShowD = () => setShowD(true);

  const [Brochure, setBrochure] = useState("");

  const AddBrochurefile = async () => {
    const formdata = new FormData();
    formdata.append("Brochure", Brochure);
    try {
      if (!Brochure) {
        return alert("please add Brochure Document");
      }
      const config = {
        url: "admin/brochures",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "multipart/form-data" },
        data: formdata,
      };
      let res = await axios(config);
      if (res.status === 200) {
        alert(res.data.success);
        getAddBrochure();
        handleCloseB();
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };
  //integrating get  method EVENTS BANNER
  const [AddBrochure, setAddBrochure] = useState([]);
  const getAddBrochure = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getbrochures`);
      if (res.status === 200) {
        setAddBrochure(res.data.getbrochures || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //delete method EVENTS BANNER
  const [Datad, setDatad] = useState("");
  const DeletBrochure = async () => {
    try {
      const config = {
        url: "admin/Deletebrochures/" + Datad,
        method: "delete",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "application/json" },
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("Successfully Delete");
          getAddBrochure();
          handleCloseD();
        }
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  useEffect(() => {
    getAddBrochure();
  }, []);

  const [currenpage4, setCurrentpage4] = useState(1);
  const recordsperpage4 = 5;
  const lastIndex4 = currenpage4 * recordsperpage4;
  const firstIndex4 = lastIndex4 - recordsperpage4;
  const records4 = (AddBrochure || []).slice(firstIndex4, lastIndex4);
  const npages4 = Math.ceil((AddBrochure?.length || 0) / recordsperpage4);
  const numbers4 = [...Array(Math.max(npages4, 0) + 1).keys()].slice(1);

  function changePage(id) {
    setCurrentpage4(id);
  }

  function prevpage() {
    if (currenpage4 !== firstIndex4) {
      setCurrentpage4(currenpage4 - 1);
    }
  }

  function nextpage() {
    if (currenpage4 !== lastIndex4) {
      setCurrentpage4(currenpage4 + 1);
    }
  }

  // ==============EVENTS HERO BANNER==============================//
  const [HeroImage,       setHeroImage]       = useState("");
  const [HeroTitle,       setHeroTitle]       = useState("");
  const [HeroDescription, setHeroDescription] = useState("");
  const [AddHeroBanner,   setAddHeroBanner]   = useState([]);
  const [editHeroItem,    setEditHeroItem]    = useState(null);
  const [deleteHeroId,    setDeleteHeroId]    = useState("");

  // Hero Banner modals
  const [showHeroAdd,    setShowHeroAdd]    = useState(false);
  const [showHeroEdit,   setShowHeroEdit]   = useState(false);
  const [showHeroDel,    setShowHeroDel]    = useState(false);

  const getHeroBanner = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/geteventheroBanner`);
      if (res.status === 200) setAddHeroBanner(res.data.getheroBanner || []);
    } catch (e) { 
      // Handle 404 - endpoint might not be implemented yet
      if (e.response?.status === 404) {
        setAddHeroBanner([]); // Set empty array for missing endpoint
      } else {
        console.log(e); 
      }
    }
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
      const res = await axios.post(`${API_URL}/api/admin/addeventheroBanner`, fd, { headers: { "content-type": "multipart/form-data" } });
      if (res.status === 200) { alert(res.data.success); getHeroBanner(); setShowHeroAdd(false); setHeroImage(""); setHeroTitle(""); setHeroDescription(""); }
    } catch (e) { 
      if (e.response?.status === 404) {
        alert("Hero banner feature is not available. Please contact administrator.");
      } else {
        console.log(e); 
        alert(e?.response?.data?.error || "Error adding hero banner");
      }
    }
  };

  const editHeroBanner = async () => {
    const fd = new FormData();
    fd.append("id", editHeroItem._id);
    fd.append("HeroTitle", HeroTitle);
    fd.append("HeroDescription", HeroDescription);
    if (HeroImage) fd.append("HeroImage", HeroImage);
    try {
      const res = await axios.put(`${API_URL}/api/admin/editeventheroBanner`, fd, { headers: { "content-type": "multipart/form-data" } });
      if (res.status === 200) { alert(res.data.success); getHeroBanner(); setShowHeroEdit(false); }
    } catch (e) { 
      if (e.response?.status === 404) {
        alert("Hero banner feature is not available. Please contact administrator.");
      } else {
        console.log(e); 
        alert(e?.response?.data?.error || "Update failed");
      }
    }
  };

  const deleteHeroBanner = async () => {
    try {
      const res = await axios.delete(`${API_URL}/api/admin/deleteeventheroBanner/${deleteHeroId}`);
      if (res.status === 200) { alert(res.data.success); getHeroBanner(); setShowHeroDel(false); }
    } catch (e) { 
      if (e.response?.status === 404) {
        alert("Hero banner feature is not available. Please contact administrator.");
      } else {
        console.log(e); 
        alert(e?.response?.data?.error || "Delete failed");
      }
    }
  };

  useEffect(() => { getHeroBanner(); }, []);

  const [EventbannerImage, setEventbannerImage] = useState("");
  const [EventbannerTitle, setEventbannerTitle] = useState("");

  const AddEbannerDetails = async () => {
    const formdata = new FormData();
    formdata.append("EventbannerImage", EventbannerImage);
    formdata.append("EventbannerTitle", EventbannerTitle);
    try {
      if (!EventbannerImage) {
        return alert("please add Image");
      }

      if (!EventbannerTitle) {
        return alert("Please add Title");
      }

      const config = {
        url: "admin/eventbanner",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "multipart/form-data" },
        data: formdata,
      };
      let res = await axios(config);
      if (res.status === 200) {
        alert(res.data.success);
        getAddEventbanner();
        handleClose3();
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };
  //integrating get  method EVENTS BANNER
  const [AddEventbanner, setAddEventbanner] = useState([]);
  const getAddEventbanner = async () => {
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/geteventbanner`
      );
      if (res.status === 200) {
        setAddEventbanner(res.data.geteventbanner || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //delete method EVENTS BANNER
  const [Datas, setDatas] = useState("");
  const DeletEventbannr = async () => {
    try {
      const config = {
        url: "admin/Deleteeventbanner/" + Datas,
        method: "delete",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "application/json" },
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("Successfully Delete");
          getAddEventbanner();
          handleClose5();
        }
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  //update method EVENTS BANNER
  const [Datass, setDatass] = useState("");
  const handleClose6 = () => setShow6(false);
  const handleShow6 = (item) => {
    setShow6(true);
    setDatass(item);
    setEventbannerTitle(item?.EventbannerTitle);
  };

  const EditEvntbanner = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      if (EventbannerImage) fd.append("EventbannerImage", EventbannerImage);
      fd.append("EventbannerTitle", EventbannerTitle);
      fd.append("id", Datass?._id);
      const config = {
        url: "admin/editeventbanner",
        method: "put",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: { "content-type": "multipart/form-data" },
        data: fd,
      };
      const res = await axios(config);
      if (res.status === 200) {
        alert("Successfully Updated");
        handleClose6();
        getAddEventbanner();
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "Update failed");
    }
  };
  // };
  useEffect(() => {
    getAddEventbanner();
  }, []);

  const [currenpage1, setCurrentpage1] = useState(1);
  const recordsperpage1 = 5;
  const lastIndex1 = currenpage * recordsperpage;
  const firstIndex1 = lastIndex - recordsperpage;
  const records1 = (AddEventbanner || []).slice(firstIndex, lastIndex);
  const npages1 = Math.ceil((AddEventbanner?.length || 0) / recordsperpage);
  const numbers1 = [...Array(Math.max(npages1, 0) + 1).keys()].slice(1);

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

  // ==============TERMS & CONDITION==============================//

  const [Eligibility, setEligibility] = useState("");

  const handleChange1 = (e, editor) => {
    if (!editor) return; const data = editor.getData();
    setEligibility(data);
  };

  const [showT, setShowT] = useState();
  const handleCloseT = () => setShowT(false);
  const handleShowT = () => setShowT(true);

  const AddTermsDetails = async () => {
    const formdata = new FormData();
    formdata.append("Eligibility", Eligibility);
    try {
      if (!Eligibility) {
        return alert("Please add Description");
      }

      const config = {
        url: "admin/terms",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "multipart/form-data" },
        data: formdata,
      };
      let res = await axios(config);
      if (res.status === 200) {
        alert(res.data.success);
        getAddTerms();
        handleCloseT();
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };
  //integrating get  method TERMS & CONDITION
  const [AddTerms, setAddTerms] = useState([]);
  const getAddTerms = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getterms`);
      if (res.status === 200) {
        setAddTerms(res.data.getterms || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //delete method TERMS & CONDITION
  const [showtt, setShowtt] = useState();
  const handleClosett = () => setShowtt(false);
  const handleShowtt = () => setShowtt(true);

  const [DataT, setDataT] = useState("");
  const DeletTerms = async () => {
    try {
      const config = {
        url: "admin/Deleteterms/" + DataT,
        method: "delete",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "application/json" },
      };
      await axios(config).then((res) => {
        if (res.status === 200) {
          alert("Successfully Delete");
          getAddTerms();
          handleClosett();
        }
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.msg);
    }
  };

  //update method TERMS & CONDITION
  const [DataTt, setDataTt] = useState("");
  const [Showedit, setShowedit] = useState("");
  const handleCloseedit = () => setShowedit(false);
  const handleShowedit = (item) => {
    setShowedit(true);
    setDataTt(item);
    setEligibility(item?.Eligibility);
  };

  const EditTerms = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("Eligibility", Eligibility);
      fd.append("id", DataTt?._id);
      const config = {
        url: "admin/editterms",
        method: "put",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: { "content-type": "multipart/form-data" },
        data: fd,
      };
      const res = await axios(config);
      if (res.status === 200) {
        alert("Successfully Updated");
        handleCloseedit();
        getAddTerms();
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "Update failed");
    }
  };
  // };
  useEffect(() => {
    getAddTerms();
  }, []);

  const [currenpage2, setCurrentpage2] = useState(1);
  const recordsperpage2 = 5;
  const lastIndex2 = currenpage2 * recordsperpage2;
  const firstIndex2 = lastIndex2 - recordsperpage2;
  const records2 = (AddTerms || []).slice(firstIndex2, lastIndex2);
  const npages2 = Math.ceil((AddTerms?.length || 0) / recordsperpage2);
  const numbers2 = [...Array(Math.max(npages2, 0) + 1).keys()].slice(1);

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

  // ==============EVENTS Category==============================//

  //integrating get  method
  const [newData, setNewdata] = useState({});
  const [AddCategory, setAddCategory] = useState([]);
  const getAddCategory = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getcategory`);
      if (res.status === 200) {
        setAddCategory(res.data.getcategory || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAddCategory();
  }, []);

  // ==============EVENTS Sub Category==============================//

  const [AddSubcategory, setAddSubcategory] = useState([]);
  const getAddSubcategory = async () => {
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/getsubcategory`
      );
      if (res.status === 200) {
        setAddSubcategory(res.data.getsubcategory || []);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAddSubcategory();
  }, []);

  // DATE & MONTH FORMATE
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { day: "numeric", month: "long" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  function convertTo12HourFormat(timeString) {
    if (!timeString) return "";
    let [hours, minutes] = timeString.split(':');
    hours = parseInt(hours);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${suffix}`;
  }

  // Selected Checkboxs
  const handleCheckboxChange = (value, isChecked) => {
    if (isChecked) {
      setEventCategory([...EventCategory, value]);
    } else {
      setEventCategory(
        EventCategory.filter((EventCategory) => EventCategory !== value)
      );
    }
  };

  // Status helper for admin table — auto-updates based on dates
  const getEventStatus = (item) => {
    if (!item.EventEnddate) return { label: "Upcoming", color: "#16a34a", bg: "#dcfce7" };
    const now = new Date();
    const start = new Date(item.EventStartdate);
    const end = new Date(item.EventEnddate);
    end.setHours(23, 59, 59, 999);
    if (now > end) return { label: "Completed", color: "#e31e24", bg: "#fee2e2" };
    if (now >= start && now <= end) return { label: "Ongoing", color: "#d97706", bg: "#fef3c7" };
    return { label: "Upcoming", color: "#16a34a", bg: "#dcfce7" };
  };

  return (
    <div>
      <div className="d-flex gap-3 mb-3 flex-wrap">
        <Button onClick={() => { setEvent(true); setEventbanner(false); setTerms(false); setBrochures(false); setHeroBannerTab(false); setCategoryTab(false); setEventInfoTab(false); }}>Events</Button>
        <Button onClick={() => { setEvent(false); setEventbanner(true); setTerms(false); setBrochures(false); setHeroBannerTab(false); setCategoryTab(false); setEventInfoTab(false); }}>Coming Soon Banner</Button>
        <Button onClick={() => { setEvent(false); setEventbanner(false); setTerms(false); setBrochures(false); setHeroBannerTab(true); setCategoryTab(false); setEventInfoTab(false); }}>Hero Banner</Button>
      </div>

      {/* ======================EVENTS======================== */}
      {Event ? (
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
              <h2 className="header-c ">Events</h2>
              <button className="admin-add-btn" onClick={handleShow}>
                Add Events
              </button>
            </div>

            <div className="mb-3">
              <Table
                responsive
                bordered
                style={{ width: "-webkit-fill-available", borderRadius: "12px", overflow: "hidden" }}
              >
                <thead style={{ background: "#031B77", color: "#fff" }}>
                  <tr>
                    <th style={{ padding: "14px 12px", fontSize: "13px", fontWeight: 700 }}>#</th>
                    <th style={{ padding: "14px 12px", fontSize: "13px", fontWeight: 700 }}>Image</th>
                    <th style={{ padding: "14px 12px", fontSize: "13px", fontWeight: 700 }}>Event Name</th>
                    <th style={{ padding: "14px 12px", fontSize: "13px", fontWeight: 700 }}>Start</th>
                    <th style={{ padding: "14px 12px", fontSize: "13px", fontWeight: 700 }}>End</th>
                    <th style={{ padding: "14px 12px", fontSize: "13px", fontWeight: 700 }}>Time</th>
                    <th style={{ padding: "14px 12px", fontSize: "13px", fontWeight: 700 }}>Location</th>
                    <th style={{ padding: "14px 12px", fontSize: "13px", fontWeight: 700 }}>Categories</th>
                    <th style={{ padding: "14px 12px", fontSize: "13px", fontWeight: 700 }}>Status</th>
                    <th style={{ padding: "14px 12px", fontSize: "13px", fontWeight: 700, textAlign: "center" }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {records?.map((item, i) => {
                    return (
                      <tr key={i} style={{ verticalAlign: "middle", borderBottom: "1px solid #f0f2f8" }}>
                        <td style={{ padding: "12px", fontWeight: 600 }}>{i + 1 + firstIndex}</td>
                        <td style={{ padding: "12px" }}>
                          <Image
                            src={`${process.env.REACT_APP_API_URL}/Events/${item?.EventImage}`}
                            alt="pic"
                            style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                          />
                        </td>
                        <td style={{ padding: "12px", fontWeight: 700, color: "#031B77", maxWidth: "180px" }}>{item.EventName}</td>
                        <td style={{ padding: "12px", fontSize: "13px" }}>{formatDate(item.EventStartdate)}</td>
                        <td style={{ padding: "12px", fontSize: "13px" }}>{formatDate(item.EventEnddate)}</td>
                        <td style={{ padding: "12px", fontSize: "13px" }}>{convertTo12HourFormat(item.Time)}</td>
                        <td style={{ padding: "12px", fontSize: "13px" }}>{item.EventLocation}</td>
                        <td style={{ padding: "12px", fontSize: "12px" }}>
                          {item.Categories?.length > 0
                            ? item.Categories.map((c, ci) => (
                              <div key={ci} style={{ marginBottom: "3px", display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ fontWeight: 600 }}>{c.CategoryName}</span>
                                {c.Limit > 0 && (
                                  <span style={{ color: (c.RegisteredCount || 0) >= c.Limit ? "#e53e3e" : "#031B77", fontWeight: 700 }}>
                                    ({c.RegisteredCount || 0}/{c.Limit})
                                  </span>
                                )}
                                {!c.Limit && c.RegisteredCount > 0 && (
                                  <span style={{ color: "#031B77", fontWeight: 700 }}>
                                    ({c.RegisteredCount})
                                  </span>
                                )}
                              </div>
                            ))
                            : <span style={{ color: "#aaa" }}>—</span>}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          {(() => {
                            const status = getEventStatus(item);
                            return (
                              <span style={{
                                background: status.bg,
                                color: status.color,
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                              }}>
                                {status.label}
                              </span>
                            );
                          })()}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                            <BiSolidEdit
                              className={getEventStatus(item).label === "Completed" ? "text-muted" : "text-success"}
                              style={{ cursor: getEventStatus(item).label === "Completed" ? "not-allowed" : "pointer", fontSize: "20px", opacity: getEventStatus(item).label === "Completed" ? 0.4 : 1 }}
                              onClick={() => { if (getEventStatus(item).label !== "Completed") handleShow3(item); }}
                              title={getEventStatus(item).label === "Completed" ? "Cannot edit completed event" : "Edit"}
                            />
                            <AiFillDelete
                              className={getEventStatus(item).label === "Completed" ? "text-muted" : "text-danger"}
                              style={{ cursor: getEventStatus(item).label === "Completed" ? "not-allowed" : "pointer", fontSize: "20px", opacity: getEventStatus(item).label === "Completed" ? 0.4 : 1 }}
                              onClick={() => { if (getEventStatus(item).label !== "Completed") { handleShow4(); setData(item?._id); } }}
                              title={getEventStatus(item).label === "Completed" ? "Cannot delete completed event" : "Delete"}
                            />
                            {hiddenEvents.includes(item?._id) ? (
                              <MdClose
                                style={{ cursor: "pointer", fontSize: "20px", color: "#e31e24" }}
                                onClick={() => unhideEventFromUI(item?._id)}
                                title="Hidden from website — click to show"
                              />
                            ) : (
                              <IoEye
                                style={{ cursor: "pointer", fontSize: "20px", color: "#16a34a" }}
                                onClick={() => hideEventFromUI(item?._id)}
                                title="Showing on website — click to hide"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>

            {/* Add Event modal */}
            <Modal show={show} onHide={handleClose} style={{ zIndex: "99999" }} size="lg">
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>Add Event</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* ── Tabs ── */}
                <div className="d-flex gap-2 mb-3" style={{ borderBottom: "2px solid #e4e8f8", paddingBottom: "10px" }}>
                  <button onClick={() => setAddFormTab("event")}
                    style={{ padding: "8px 20px", borderRadius: "8px", border: "none", fontWeight: 700, fontSize: "14px", cursor: "pointer",
                      background: addFormTab === "event" ? "#031B77" : "#f0f4ff", color: addFormTab === "event" ? "#fff" : "#031B77" }}>
                    Event Details
                  </button>
                  <button onClick={() => setAddFormTab("category")}
                    style={{ padding: "8px 20px", borderRadius: "8px", border: "none", fontWeight: 700, fontSize: "14px", cursor: "pointer",
                      background: addFormTab === "category" ? "#031B77" : "#f0f4ff", color: addFormTab === "category" ? "#fff" : "#031B77" }}>
                    Categories
                  </button>
                  <button onClick={() => setAddFormTab("overview")}
                    style={{ padding: "8px 20px", borderRadius: "8px", border: "none", fontWeight: 700, fontSize: "14px", cursor: "pointer",
                      background: addFormTab === "overview" ? "#031B77" : "#f0f4ff", color: addFormTab === "overview" ? "#fff" : "#031B77" }}>
                    Tournament Overview
                  </button>
                  <button onClick={() => setAddFormTab("brochure")}
                    style={{ padding: "8px 20px", borderRadius: "8px", border: "none", fontWeight: 700, fontSize: "14px", cursor: "pointer",
                      background: addFormTab === "brochure" ? "#031B77" : "#f0f4ff", color: addFormTab === "brochure" ? "#fff" : "#031B77" }}>
                    Brochure
                  </button>
                </div>

                {/* ── TAB 1: Event Details ── */}
                {addFormTab === "event" && (
                <div className="row">
                  <div className="col-md-12 do-sear mt-2">
                    <label>Event Image *</label>
                    <input type="file" className="vi_0" onChange={(e) => setEventImage(e.target.files[0])} />
                  </div>
                  <div className="col-md-12 do-sear mt-2">
                    <label>Event Name *</label>
                    <input type="text" className="vi_0" placeholder="Enter Event Name" value={EventName} onChange={(e) => setEventName(e.target.value)} />
                  </div>
                  <div className="col-md-6 do-sear mt-2">
                    <label>Start Date *</label>
                    <input type="date" className="vi_0" value={EventStartdate} onChange={(e) => setEventStartdate(e.target.value)} />
                  </div>
                  <div className="col-md-6 do-sear mt-2">
                    <label>End Date *</label>
                    <input type="date" className="vi_0" value={EventEnddate} onChange={(e) => setEventEnddate(e.target.value)} />
                  </div>
                  <div className="col-md-6 do-sear mt-2">
                    <label>Time *</label>
                    <input type="time" className="vi_0" value={Time} onChange={(e) => setTime(e.target.value)} />
                  </div>
                  <div className="col-md-6 do-sear mt-2">
                    <label>Location *</label>
                    <input type="text" className="vi_0" placeholder="Enter Location" value={EventLocation} onChange={(e) => setEventLocation(e.target.value)} />
                  </div>
                </div>
                )}

                {/* ── TAB 2: Categories ── */}
                {addFormTab === "category" && (
                <div>
                {addCategories.map((cat, idx) => (
                  <div key={idx} style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", marginBottom: "16px", border: "2px solid #e4e8f8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: "14px", paddingBottom: "10px", borderBottom: "1px solid #f0f2f8" }}>
                      <span style={{ fontSize: "16px", fontWeight: 800, color: "#031B77" }}>Category {idx + 1}</span>
                      <div className="d-flex gap-2">
                        {addCategories.length > 1 && (
                          <button style={{ background: "#e53e3e", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 14px", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}
                            onClick={() => setAddCategories(addCategories.filter((_, i) => i !== idx))}>Delete</button>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 do-sear mb-3">
                        <label>Category Name <span style={{color:"red"}}>*</span></label>
                        <input type="text" className="vi_0" placeholder="e.g. Men's Singles" value={cat.CategoryName}
                          onChange={(e) => { const c = [...addCategories]; c[idx].CategoryName = e.target.value; setAddCategories(c); }} />
                      </div>
                      <div className="col-md-6 do-sear mb-3">
                        <label>Category Type</label>
                        <input type="text" className="vi_0" placeholder="e.g. Round Robin + Knockout" value={cat.CategoryType}
                          onChange={(e) => { const c = [...addCategories]; c[idx].CategoryType = e.target.value; setAddCategories(c); }} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4 do-sear mb-2">
                        <label>Price (₹) <span style={{color:"red"}}>*</span></label>
                        <input type="number" className="vi_0" placeholder="700" value={cat.CategoryPrice}
                          onChange={(e) => { const c = [...addCategories]; c[idx].CategoryPrice = e.target.value; setAddCategories(c); }} />
                      </div>
                      <div className="col-md-4 do-sear mb-2">
                        <label>Total Players</label>
                        <input type="number" className="vi_0" placeholder="1" value={cat.TotalPlayers}
                          onChange={(e) => { const c = [...addCategories]; c[idx].TotalPlayers = e.target.value; setAddCategories(c); }} />
                      </div>
                      <div className="col-md-4 do-sear mb-2">
                        <label>Registration Limit</label>
                        <input type="number" className="vi_0" placeholder="0" value={cat.Limit || ""}
                          onChange={(e) => { const c = [...addCategories]; c[idx].Limit = parseInt(e.target.value) || 0; setAddCategories(c); }} />
                      </div>
                    </div>
                    {cat.RegisteredCount > 0 && (
                      <div style={{ marginTop: "8px", padding: "8px 12px", background: "#f0f4ff", borderRadius: "6px", fontSize: "13px", color: "#031B77", fontWeight: 600 }}>
                        Registered: {cat.RegisteredCount}{cat.Limit > 0 ? ` / ${cat.Limit}` : " (no limit)"}
                      </div>
                    )}
                  </div>
                ))}
                <button style={{ background: "#031B77", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 28px", fontSize: "14px", fontWeight: 700, cursor: "pointer", marginTop: "4px" }}
                  onClick={() => setAddCategories([...addCategories, { CategoryName: "", CategoryPrice: "", TotalPlayers: 1, CategoryType: "", Limit: 0 }])}>
                  + Add Category
                </button>
                </div>
                )}

                {/* ── TAB 3: Tournament Overview ── */}
                {addFormTab === "overview" && (
                <div>
                <div className="row">
                  <div className="col-md-12 do-sear mt-2">
                    <label>Venue</label>
                    <input type="text" className="vi_0" placeholder="e.g. KBA, Bangalore" value={addEventInfo.Venue}
                      onChange={(e) => setAddEventInfo({...addEventInfo, Venue: e.target.value})} />
                  </div>
                  <div className="col-md-12 do-sear mt-2">
                    <label>Tournament Description</label>
                    <textarea className="vi_0" rows="8" placeholder="e.g. Initiative by GOPICHAND BADMINTON GRASSROOT ACADEMY..." value={addEventInfo.OvInitiative}
                      style={{ resize: "both", minHeight: "200px" }}
                      onChange={(e) => setAddEventInfo({...addEventInfo, OvInitiative: e.target.value})} />
                  </div>
                </div>
                </div>
                )}

                {/* ── TAB 4: Brochure ── */}
                {addFormTab === "brochure" && (
                <div>
                  <div className="do-sear mt-2">
                    <label>Upload Brochure (PDF or Image)</label>
                    <input type="file" className="vi_0" accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => setAddBrochureFile(e.target.files[0])} />
                    <small style={{ color: "#888", fontSize: "12px" }}>Accepted: PDF, JPG, PNG, WEBP</small>
                  </div>
                  {addBrochureFile && (
                    <div style={{ marginTop: "12px", padding: "10px", background: "#f0f4ff", borderRadius: "8px", border: "1px solid #e4e8f8" }}>
                      <span style={{ fontSize: "13px", color: "#031B77", fontWeight: 600 }}>
                        ✅ {addBrochureFile.name}
                      </span>
                    </div>
                  )}
                  <p style={{ marginTop: "12px", fontSize: "13px", color: "#666" }}>
                    This brochure will be shown on the registration page below the tournament overview for download.
                  </p>
                </div>
                )}

              </Modal.Body>
              <Modal.Footer>
                <Button className="mx-2 modal-close-btn" variant="" onClick={handleClose}>Close</Button>
                <Button className="mx-2 modal-add-btn" variant="" onClick={AddEventDetails}>Add</Button>
              </Modal.Footer>
            </Modal>

            {/* Edit Event modal */}
            <Modal show={show3} onHide={handleClose3} backdrop="static" keyboard={false} style={{ zIndex: "99999" }} size="lg">
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>Edit Event</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* Tabs */}
                <div className="d-flex gap-2 mb-3" style={{ borderBottom: "2px solid #e4e8f8", paddingBottom: "10px" }}>
                  <button onClick={() => setEditFormTab("event")} style={{ padding: "8px 20px", borderRadius: "8px", border: "none", fontWeight: 700, fontSize: "14px", cursor: "pointer", background: editFormTab === "event" ? "#031B77" : "#f0f4ff", color: editFormTab === "event" ? "#fff" : "#031B77" }}>Event Details</button>
                  <button onClick={() => setEditFormTab("category")} style={{ padding: "8px 20px", borderRadius: "8px", border: "none", fontWeight: 700, fontSize: "14px", cursor: "pointer", background: editFormTab === "category" ? "#031B77" : "#f0f4ff", color: editFormTab === "category" ? "#fff" : "#031B77" }}>Categories</button>
                  <button onClick={() => setEditFormTab("overview")} style={{ padding: "8px 20px", borderRadius: "8px", border: "none", fontWeight: 700, fontSize: "14px", cursor: "pointer", background: editFormTab === "overview" ? "#031B77" : "#f0f4ff", color: editFormTab === "overview" ? "#fff" : "#031B77" }}>Tournament Overview</button>
                  <button onClick={() => setEditFormTab("brochure")} style={{ padding: "8px 20px", borderRadius: "8px", border: "none", fontWeight: 700, fontSize: "14px", cursor: "pointer", background: editFormTab === "brochure" ? "#031B77" : "#f0f4ff", color: editFormTab === "brochure" ? "#fff" : "#031B77" }}>Brochure</button>
                </div>

                {/* TAB 1: Event Details */}
                {editFormTab === "event" && (
                <div className="row">
                  <div className="col-md-12 do-sear mt-2"><label>Event Image (leave empty to keep current)</label><input type="file" className="vi_0" onChange={(e) => setEventImage(e.target.files[0])} /></div>
                  <div className="col-md-12 do-sear mt-2"><label>Event Name *</label><input type="text" className="vi_0" value={EventName} onChange={(e) => setEventName(e.target.value)} /></div>
                  <div className="col-md-6 do-sear mt-2"><label>Start Date *</label><input type="date" className="vi_0" value={EventStartdate} onChange={(e) => setEventStartdate(e.target.value)} /></div>
                  <div className="col-md-6 do-sear mt-2"><label>End Date *</label><input type="date" className="vi_0" value={EventEnddate} onChange={(e) => setEventEnddate(e.target.value)} /></div>
                  <div className="col-md-6 do-sear mt-2"><label>Time *</label><input type="time" className="vi_0" value={Time} onChange={(e) => setTime(e.target.value)} /></div>
                  <div className="col-md-6 do-sear mt-2"><label>Location *</label><input type="text" className="vi_0" value={EventLocation} onChange={(e) => setEventLocation(e.target.value)} /></div>
                </div>
                )}

                {/* TAB 2: Categories */}
                {editFormTab === "category" && (
                <div>
                {addCategories.map((cat, idx) => (
                  <div key={idx} style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", marginBottom: "16px", border: "2px solid #e4e8f8" }}>
                    <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: "14px", paddingBottom: "10px", borderBottom: "1px solid #f0f2f8" }}>
                      <span style={{ fontSize: "16px", fontWeight: 800, color: "#031B77" }}>Category {idx + 1}</span>
                      {addCategories.length > 1 && (<button style={{ background: "#e53e3e", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 14px", cursor: "pointer", fontSize: "12px", fontWeight: 600 }} onClick={() => setAddCategories(addCategories.filter((_, i) => i !== idx))}>Delete</button>)}
                    </div>
                    <div className="row">
                      <div className="col-md-6 do-sear mb-3"><label>Category Name <span style={{color:"red"}}>*</span></label><input type="text" className="vi_0" value={cat.CategoryName} onChange={(e) => { const c = [...addCategories]; c[idx].CategoryName = e.target.value; setAddCategories(c); }} /></div>
                      <div className="col-md-6 do-sear mb-3"><label>Category Type</label><input type="text" className="vi_0" value={cat.CategoryType} onChange={(e) => { const c = [...addCategories]; c[idx].CategoryType = e.target.value; setAddCategories(c); }} /></div>
                    </div>
                    <div className="row">
                      <div className="col-md-4 do-sear mb-2"><label>Price (₹) <span style={{color:"red"}}>*</span></label><input type="number" className="vi_0" value={cat.CategoryPrice} onChange={(e) => { const c = [...addCategories]; c[idx].CategoryPrice = e.target.value; setAddCategories(c); }} /></div>
                      <div className="col-md-4 do-sear mb-2"><label>Total Players</label><input type="number" className="vi_0" value={cat.TotalPlayers} onChange={(e) => { const c = [...addCategories]; c[idx].TotalPlayers = e.target.value; setAddCategories(c); }} /></div>
                      <div className="col-md-4 do-sear mb-2"><label>Registration Limit</label><input type="number" className="vi_0" placeholder="0" value={cat.Limit || ""} onChange={(e) => { const c = [...addCategories]; c[idx].Limit = parseInt(e.target.value) || 0; setAddCategories(c); }} /></div>
                    </div>
                    {cat.RegisteredCount > 0 && (<div style={{ padding: "8px 12px", background: "#f0f4ff", borderRadius: "6px", fontSize: "13px", color: "#031B77", fontWeight: 600 }}>Registered: {cat.RegisteredCount}{cat.Limit > 0 ? ` / ${cat.Limit}` : ""}</div>)}
                  </div>
                ))}
                <button style={{ background: "#031B77", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 28px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }} onClick={() => setAddCategories([...addCategories, { CategoryName: "", CategoryPrice: "", TotalPlayers: 1, CategoryType: "", Limit: 0 }])}>+ Add Category</button>
                </div>
                )}

                {/* TAB 3: Tournament Overview */}
                {editFormTab === "overview" && (
                <div>
                <div className="row">
                  <div className="col-md-12 do-sear mt-2"><label>Venue</label><input type="text" className="vi_0" value={addEventInfo.Venue || ""} onChange={(e) => setAddEventInfo({...addEventInfo, Venue: e.target.value})} /></div>
                  <div className="col-md-12 do-sear mt-2"><label>Tournament Description</label><textarea className="vi_0" rows="8" style={{ resize: "both", minHeight: "200px" }} value={addEventInfo.OvInitiative || ""} onChange={(e) => setAddEventInfo({...addEventInfo, OvInitiative: e.target.value})} /></div>
                </div>
                </div>
                )}

                {/* TAB 4: Brochure */}
                {editFormTab === "brochure" && (
                <div>
                  <div className="do-sear mt-2"><label>Upload Brochure (PDF or Image)</label><input type="file" className="vi_0" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={(e) => setAddBrochureFile(e.target.files[0])} /></div>
                  {Data1?.Brochure && !addBrochureFile && (
                    <div style={{ marginTop: "12px", padding: "10px", background: "#f0f4ff", borderRadius: "8px" }}>
                      <span style={{ fontSize: "13px", color: "#031B77", fontWeight: 600 }}>Current: {Data1.Brochure}</span>
                    </div>
                  )}
                  {addBrochureFile && (
                    <div style={{ marginTop: "12px", padding: "10px", background: "#f0f4ff", borderRadius: "8px" }}>
                      <span style={{ fontSize: "13px", color: "#031B77", fontWeight: 600 }}>New: {addBrochureFile.name}</span>
                    </div>
                  )}
                </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="" className="modal-close-btn" onClick={handleClose3}>Close</Button>
                <Button variant="" className="modal-add-btn" onClick={EditEvents}>Update</Button>
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
                  onClick={DeleteEvent}
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </div>

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
        </>
      ) : (
        <></>
      )}

      {/* ==============EVENT BROCHURES==================== */}

      {Brochures ? (
        <>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="header-c ">Event Brochures</h2>

              <div>
                {AddBrochure?.length !== 0 ? (
                  ""
                ) : (
                  <>
                    <button className="admin-add-btn" onClick={handleShowB}>
                      Add Brochures
                    </button>
                  </>
                )}
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
                    <th>Documents</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {records4?.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td style={{ paddingTop: "20px" }}>
                          <IoEye
                            style={{ fontSize: "20px", color: "#031B77" }}
                            onClick={() => {
                              handleShowFile();
                              setView(item);
                            }}
                          />
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
                                  handleShowD();
                                  setDatad(item?._id);
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

            {/* Add Brochures modal */}
            <Modal
              show={showB}
              onHide={handleCloseB}
              style={{ zIndex: "99999" }}
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>
                  Add Brochures
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="do-sear mt-2">
                    <label>Add Event Brochures</label>
                    <input
                      type="file"
                      className="vi_0"
                      onChange={(e) => setBrochure(e.target.files[0])}
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="d-flex">
                  <Button
                    className="mx-2 modal-close-btn"
                    variant=""
                    onClick={handleCloseB}
                  >
                    Close
                  </Button>
                  <Button
                    className="mx-2 modal-add-btn"
                    variant=""
                    onClick={AddBrochurefile}
                  >
                    Add
                  </Button>
                </div>
              </Modal.Footer>
            </Modal>

            {/* Delet event banner modal  */}
            <Modal
              show={showD}
              onHide={handleCloseD}
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
                  onClick={handleCloseD}
                >
                  Close
                </Button>
                <Button
                  variant=""
                  className="modal-add-btn"
                  onClick={DeletBrochure}
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>

            {/* View Brochure Documents modal */}
            <Modal
              show={showFile}
              onHide={handleCloseFile}
              backdrop="static"
              keyboard={false}
              style={{ zIndex: "99999" }}
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>
                  Event Brochures
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="col-md-12">
                    <iframe
                      src={`${process.env.REACT_APP_API_URL}/Events/${View?.Brochure}`}
                      style={{ width: "100%", height: "500px" }}
                      title={`Brochure `}
                    ></iframe>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant=""
                  className="modal-close-btn"
                  onClick={handleCloseFile}
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

      {/* ==============TERMS & CONDITION==================== */}

      {Terms ? (
        <>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="header-c ">Terms & Condition</h2>

              <div>
                {AddTerms?.length !== 0 ? (
                  ""
                ) : (
                  <>
                    <button className="admin-add-btn" onClick={handleShowT}>
                      Add Terms & Condition
                    </button>
                  </>
                )}
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
                    <th>SL.NO</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {records2?.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1 + firstIndex}</td>

                        <td style={{ paddingTop: "20px" }}>
                          {parse(`<div>${item.Eligibility}</div>`)}
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
                                onClick={() => handleShowedit(item)}
                              />{" "}
                            </div>
                            <div>
                              <AiFillDelete
                                className="text-danger"
                                style={{ cursor: "pointer", fontSize: "20px" }}
                                onClick={() => {
                                  handleShowtt();
                                  setDataT(item?._id);
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

            {/* Add terms modal */}
            <Modal
              show={showT}
              onHide={handleCloseT}
              style={{ zIndex: "99999" }}
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>
                  Add Terms & Condition
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="do-sear mt-2">
                    <label>Add Terms & Condition</label>
                    <CKEditor editor={ClassicEditor} onChange={handleChange1} />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="d-flex">
                  <Button
                    className="mx-2 modal-close-btn"
                    variant=""
                    onClick={handleCloseT}
                  >
                    Close
                  </Button>
                  <Button
                    className="mx-2 modal-add-btn"
                    variant=""
                    onClick={AddTermsDetails}
                  >
                    Add
                  </Button>
                </div>
              </Modal.Footer>
            </Modal>

            {/* Edit terms modal */}
            <Modal
              show={Showedit}
              onHide={handleCloseedit}
              backdrop="static"
              keyboard={false}
              style={{ zIndex: "99999" }}
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>
                  Edit Terms & Condition
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="do-sear mt-2">
                    <label>Add Terms & Condition</label>
                    <CKEditor
                      editor={ClassicEditor}
                      data={Eligibility}
                      onChange={handleChange1}
                    />
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
                  onClick={EditTerms}
                >
                  Update
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Delet terms modal  */}
            <Modal
              show={showtt}
              onHide={handleClosett}
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
                  onClick={handleClosett}
                >
                  Close
                </Button>
                <Button
                  variant=""
                  className="modal-add-btn"
                  onClick={DeletTerms}
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

      {/* ==============HERO BANNER TAB==================== */}
      {HeroBannerTab && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="header-c">Events Hero Banner</h2>
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
                      src={`${API_URL}/EventHeroBanner/${item.HeroImage}`}
                      alt="hero"
                      style={{ width: "140px", height: "70px", objectFit: "cover", borderRadius: "6px" }}
                    />
                  </td>
                  <td style={{ paddingTop: "20px" }}>{item.HeroTitle}</td>
                  <td style={{ paddingTop: "20px", maxWidth: "260px" }}>{item.HeroDescription}</td>
                  <td>
                    <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                      <BiSolidEdit className="text-success" style={{ cursor: "pointer", fontSize: "20px" }}
                        onClick={() => {
                          setEditHeroItem(item);
                          setHeroTitle(item.HeroTitle);
                          setHeroDescription(item.HeroDescription);
                          setHeroImage("");
                          setShowHeroEdit(true);
                        }} />
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

          {/* Add Hero Banner Modal */}
          <Modal show={showHeroAdd} onHide={() => setShowHeroAdd(false)} style={{ zIndex: 99999 }}>
            <Modal.Header closeButton><Modal.Title>Add Hero Banner</Modal.Title></Modal.Header>
            <Modal.Body>
              <div className="do-sear mt-2">
                <label>Banner Image <span style={{ color: "red" }}>*</span></label>
                <input type="file" accept="image/*" className="vi_0"
                  onChange={e => setHeroImage(e.target.files[0])} />
              </div>
              <div className="do-sear mt-2">
                <label>Title <span style={{ color: "red" }}>*</span></label>
                <input type="text" className="vi_0" placeholder="e.g. TOURNAMENTS"
                  value={HeroTitle} onChange={e => setHeroTitle(e.target.value)} />
              </div>
              <div className="do-sear mt-2">
                <label>Description <span style={{ color: "red" }}>*</span></label>
                <input type="text" className="vi_0" placeholder="e.g. Register now and be part of the championship"
                  value={HeroDescription} onChange={e => setHeroDescription(e.target.value)} />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-close-btn" variant="" onClick={() => setShowHeroAdd(false)}>Close</Button>
              <Button className="modal-add-btn" variant="" onClick={addHeroBanner}>Add</Button>
            </Modal.Footer>
          </Modal>

          {/* Edit Hero Banner Modal */}
          <Modal show={showHeroEdit} onHide={() => setShowHeroEdit(false)} style={{ zIndex: 99999 }}>
            <Modal.Header closeButton><Modal.Title>Edit Hero Banner</Modal.Title></Modal.Header>
            <Modal.Body>
              <div className="do-sear mt-2">
                <label>Banner Image <small className="text-muted">(leave empty to keep current)</small></label>
                <input type="file" accept="image/*" className="vi_0"
                  onChange={e => setHeroImage(e.target.files[0])} />
                {editHeroItem?.HeroImage && !HeroImage && (
                  <Image
                    src={`${API_URL}/EventHeroBanner/${editHeroItem.HeroImage}`}
                    alt="current" style={{ marginTop: "8px", height: "60px", borderRadius: "4px" }} />
                )}
              </div>
              <div className="do-sear mt-2">
                <label>Title <span style={{ color: "red" }}>*</span></label>
                <input type="text" className="vi_0" value={HeroTitle} onChange={e => setHeroTitle(e.target.value)} />
              </div>
              <div className="do-sear mt-2">
                <label>Description <span style={{ color: "red" }}>*</span></label>
                <input type="text" className="vi_0" value={HeroDescription} onChange={e => setHeroDescription(e.target.value)} />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-close-btn" variant="" onClick={() => setShowHeroEdit(false)}>Close</Button>
              <Button className="modal-add-btn" variant="" onClick={editHeroBanner}>Update</Button>
            </Modal.Footer>
          </Modal>

          {/* Delete Hero Banner Modal */}
          <Modal show={showHeroDel} onHide={() => setShowHeroDel(false)} style={{ zIndex: 99999 }}>
            <Modal.Header closeButton><Modal.Title>Warning</Modal.Title></Modal.Header>
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

      {/* ==============EVENT BANNER==================== */}

      {Eventbanner ? (
        <>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="header-c ">Upcoming Banner</h2>

              <div>
                {AddEventbanner?.length !== 0 ? (
                  ""
                ) : (
                  <>
                    <button className="admin-add-btn" onClick={handleShow3}>
                      Add Upcoming Banner
                    </button>
                  </>
                )}
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
                    <th>SL.NO</th>
                    <th>Image</th>
                    <th>Text</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {records1?.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1 + firstIndex}</td>
                        <td>
                          <Image
                            src={`${process.env.REACT_APP_API_URL}/Events/${item?.EventbannerImage}`}
                            alt="pic"
                            style={{ width: "75px", height: "75px" }}
                          />
                        </td>
                        <td style={{ paddingTop: "20px" }}>
                          {item.EventbannerTitle}
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
                                  setDatas(item?._id);
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

            {/* Add Event banner modal */}
            <Modal
              show={show3}
              onHide={handleClose3}
              style={{ zIndex: "99999" }}
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>
                  Add Upcoming Events Banner
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="do-sear mt-2">
                    <label>Add Upcoming Events Banner Image</label>
                    <input
                      type="file"
                      className="vi_0"
                      onChange={(e) => setEventbannerImage(e.target.files[0])}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="do-sear mt-2">
                    <label>Add Upcoming Events Title</label>
                    <input
                      type="text"
                      className="vi_0"
                      placeholder="Enter Upcoming Events Title"
                      onChange={(e) => setEventbannerTitle(e.target.value)}
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="d-flex">
                  <Button
                    className="mx-2 modal-close-btn"
                    variant=""
                    onClick={handleClose3}
                  >
                    Close
                  </Button>
                  <Button
                    className="mx-2 modal-add-btn"
                    variant=""
                    onClick={AddEbannerDetails}
                  >
                    Add
                  </Button>
                </div>
              </Modal.Footer>
            </Modal>

            {/* Edit event banner modal */}
            <Modal
              show={show6}
              onHide={handleClose6}
              backdrop="static"
              keyboard={false}
              style={{ zIndex: "99999" }}
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>
                  Edit Upcoming Events Banner
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="do-sear mt-2">
                    <label>Add Upcoming Events Banner Image</label>
                    <input
                      type="file"
                      className="vi_0"
                      onChange={(e) => setEventbannerImage(e.target.files[0])}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="do-sear mt-2">
                    <label>Add Upcoming Events Title</label>
                    <input
                      type="text"
                      className="vi_0"
                      value={EventbannerTitle}
                      onChange={(e) => setEventbannerTitle(e.target.value)}
                    />
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
                  onClick={EditEvntbanner}
                >
                  Update
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Delet event banner modal  */}
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
                  onClick={DeletEventbannr}
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

    </div>
  );
};

export default AdminEvents;
