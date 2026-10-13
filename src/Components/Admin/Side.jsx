import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import {
  LuActivity,
  LuBookMarked,
  LuFileQuestion,
  LuIndianRupee,
  LuListOrdered,
  LuLogOut,
  LuPackageX,
  LuUserCog,
} from "react-icons/lu";
import { FaQuestion, FaWeightHanging } from "react-icons/fa";
import { IoMdContact } from "react-icons/io";
import { FaShop, FaRegIdCard, FaCircleUser } from "react-icons/fa6";
import { GiFlatPlatform } from "react-icons/gi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { AiOutlineSnippets } from "react-icons/ai";
import { IoPeopleOutline, IoNewspaperOutline } from "react-icons/io5";
import { PiExamFill, PiHandshakeLight } from "react-icons/pi";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineTipsAndUpdates,
  MdOutlineKeyboardArrowUp,
  MdOutlineAddComment,
  MdEventAvailable,
  MdSubject,
  MdOutlineKeyboardArrowLeft,
  MdOutlineReviews,
} from "react-icons/md";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { LuAlignHorizontalJustifyStart } from "react-icons/lu";
import { IoEarth } from "react-icons/io5";
import "../Admin/Admin.css";
import Navbar from "react-bootstrap/Navbar";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { MdLooksOne } from "react-icons/md";
import { PiNumberSquareTwoFill } from "react-icons/pi";
import { PiNumberSquareThreeFill } from "react-icons/pi";
import { PiNumberSquareFourFill } from "react-icons/pi";
import { PiNumberSquareFiveFill } from "react-icons/pi";
import { TiTick } from "react-icons/ti";
import { FaArrowsLeftRightToLine } from "react-icons/fa6";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { AiFillSetting, AiOutlineHome } from "react-icons/ai";
import { BsFillTelephoneFill, BsQuestionLg } from "react-icons/bs";
import { MdDashboardCustomize } from "react-icons/md";
import { BsPersonFill } from "react-icons/bs";

import { BsPersonWorkspace } from "react-icons/bs";
import { GrOverview } from "react-icons/gr";
import { SiTransmission } from "react-icons/si";
import { MdCategory } from "react-icons/md";
import { MdEvent } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { GiPodiumWinner } from "react-icons/gi";
import { MdEmojiEvents } from "react-icons/md";
import { HiTrophy } from "react-icons/hi2";
import { GrGallery } from "react-icons/gr";
import { MdGroups2 } from "react-icons/md";
import { MdContactPhone } from "react-icons/md";
import { FaRegistered } from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";


const Side = () => {
  const [acc, setacc] = useState(true);
  const [acc1, setacc1] = useState(false);
  const [acc2, setacc2] = useState(false);
  const [acc3, setacc3] = useState(false);
  const [acc4, setacc4] = useState(false);
  const [Home, setHome] = useState(false);
  const [Result, setResult] = useState(false);

  // Responsive sidebar
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  return (
    <div>
      <Navbar expand="lg" className=" p-0">
        <button
          className="custom-toggler navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarsExample09"
          aria-controls="navbarsExample09"
          aria-expanded={!isNavCollapsed ? true : false}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
          style={{ margin: "10px" }}
        >
          <span>
            <GiHamburgerMenu style={{ color: "white" }} />
          </span>
        </button>
        <div
          className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}
          id="navbarsExample09"
        >
          <div className="si09">
            <div style={{ width: "100%", justifyContent: "space-between" }}>
              <div
                className="lo-ad"
                style={{ background: "white", borderBottom: "1px solid white" }}
              >
                <div className="">
                  {/* <a href="/" className="tail-text"> */}
                    <img
                      src="../Assets/logo.png"
                      alt="Logo"
                      className="admin-logo-img"
                      style={{ width: "100%", height: "7rem" }}
                    />
                  {/* </a> */}
                </div>
              </div>
              <div className="sidebar-close-icon" onClick={handleNavCollapse}>
                <AiOutlineClose />
              </div>
            </div>
            <ul>
              {/* <Link to="/dashboard" onClick={handleNavCollapse}>
                <li className="a-ele ">
                  <span>
                    <MdDashboardCustomize style={{ fontSize: "20px" }} />
                  </span>
                  <span className="ms-2">Dashboard</span>
                </li>
              </Link> */}

              <Link to="/admin_banner" onClick={handleNavCollapse}>
                <li className="a-ele ">
                  <span>
                    <AiOutlineHome style={{ fontSize: "20px" }} />
                  </span>
                  <span className="ms-2">Home Banner </span>
                </li>
              </Link>

              <Link to="/admin_events" onClick={handleNavCollapse}>
                <li className="a-ele ">
                  <span>
                    <MdEvent
                      style={{ fontSize: "20px" }}
                    />
                  </span>
                  <span className="ms-2">Events </span>
                </li>
              </Link>

              <Link to="/registration-list" onClick={handleNavCollapse}>
                <li className="a-ele ">
                  <span>
                    <FaRegistered style={{ fontSize: "20px" }} />
                  </span>
                  <span className="ms-2">Registered List</span>
                </li>
              </Link>

              <Link to="/general_enquiry" onClick={handleNavCollapse}>
                <li className="a-ele ">
                  <span>
                    <MdOutlineSupportAgent style={{ fontSize: "20px" }} />
                  </span>
                  <span className="ms-2">General Enquiries</span>
                </li>
              </Link>

              
              {/* <li 
                className={`a-ele dropdown-toggle-item ${acc3 ? "active-0" : "null"}`}
                onClick={() => {
                  setResult(!Result);
                }}
              >
                <span>
                  <BsGraphUpArrow style={{ fontSize: "20px" }} />
                </span>{" "}
                <span>Results </span>{" "}
                {Result ? (
                  <>
                    {" "}
                    <span style={{ float: "right" }}>
                      <MdOutlineKeyboardArrowUp />
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ float: "right" }}>
                      <MdOutlineKeyboardArrowDown />
                    </span>
                  </>
                )}
              </li> */}
{/*               
              {Result && (
                <div className="webmanagement">
                  <Link to="/admin_doubleresults">
                    <li
                      className={`a-ele ${acc1 ? "active2" : "null"}`}
                      onClick={() => {
                        setacc(false);
                        setacc1(true);
                        setacc2(false);
                        setacc3(false);
                        setacc4(false);
                      }}
                    >
                      <span>
                        {" "}
                        <MdEmojiEvents
                    style={{ fontSize: "20px" }}
                  />
                      </span>
                      <span className="ms-2">Result</span>{" "}
                    </li>
                  </Link>

                  <Link to="/admin_achivers">
                    <li
                      className={`a-ele ${acc1 ? "active2" : "null"}`}
                      onClick={() => {
                        setacc(false);
                        setacc1(true);
                        setacc2(false);
                        setacc3(false);
                        setacc4(false);
                      }}
                    >
                      <span>
                        {" "}
                        <HiTrophy
                    style={{ fontSize: "20px" }}
                  />
                      </span>
                      <span className="ms-2">Achivers</span>{" "}
                    </li>
                  </Link>
                </div>
              )} */}

              <Link to="/admin_gallery" onClick={handleNavCollapse}>
                <li className="a-ele ">
                  <span>
                    <GrGallery style={{ fontSize: "20px" }} />
                  </span>
                  <span className="ms-2">Gallery</span>
                </li>
              </Link>

              <li
                className={`a-ele dropdown-toggle-item ${acc3 ? "active-0" : "null"}`}
                onClick={() => {
                  setHome(!Home);
                }}
              >
                <span>
                  <BsPersonFill style={{ fontSize: "20px" }} />
                </span>{" "}
                <span>Who We Are </span>{" "}
                {Home ? (
                  <>
                    {" "}
                    <span style={{ float: "right" }}>
                      <MdOutlineKeyboardArrowUp />
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ float: "right" }}>
                      <MdOutlineKeyboardArrowDown />
                    </span>
                  </>
                )}
              </li>
              
              {Home && (
                <div className="webmanagement">
                  <Link to="/admin_overview">
                    <li
                      className={`a-ele ${acc ? "active2" : "null"}`}
                      onClick={() => {
                        setacc(true);
                        setacc1(false);
                        setacc2(false);
                        setacc3(false);
                        setacc4(false);
                      }}
                    >
                      <span>
                      <GrOverview style={{ fontSize: "20px" }} />
                      </span>
                      <span className="ms-2">Overview</span>
                    </li>
                  </Link>
                  <Link to="/admin_keyhighlight">
                    <li
                      className={`a-ele ${acc1 ? "active2" : "null"}`}
                      onClick={() => {
                        setacc(false);
                        setacc1(true);
                        setacc2(false);
                        setacc3(false);
                        setacc4(false);
                      }}
                    >
                      <span>
                        {" "}
                        <SiTransmission  style={{ fontSize: "20px" }} />
                      </span>
                      <span className="ms-2">Key Highlights </span>{" "}
                    </li>
                  </Link>
                  <Link to="/admin_teammember">
                    <li
                      className={`a-ele ${acc2 ? "active2" : "null"}`}
                      onClick={() => {
                        setacc(false);
                        setacc1(false);
                        setacc2(true);
                        setacc3(false);
                        setacc4(false);
                      }}
                    >
                      <span>
                        <IoPeopleOutline style={{ fontSize: "20px" }} />
                      </span>
                      <span className="ms-2">Team ADGP</span>
                    </li>
                  </Link>
                  <Link to="/admin_leadershipteam">
                    <li
                      className={`a-ele ${acc4 ? "active2" : "null"}`}
                      onClick={() => {
                        setacc(false);
                        setacc1(false);
                        setacc2(false);
                        setacc3(false);
                        setacc4(true);
                      }}
                    >
                      <span>
                        <MdGroups2 style={{ fontSize: "20px" }} />
                      </span>
                      <span className="ms-2">Leadership Team</span>
                    </li>
                  </Link>
                </div>
              )}

              <Link to="/admin_partners" onClick={handleNavCollapse}>
                <li className="a-ele ">
                  <span>
                    <MdGroups2
                      style={{ fontSize: "20px" }}
                    />
                  </span>
                  <span className="ms-2">Partners</span>
                </li>
              </Link>

              <Link to="/admin_testimonial" onClick={handleNavCollapse}>
                <li className="a-ele ">
                  <span>
                    <LuAlignHorizontalJustifyStart
                      style={{ fontSize: "20px" }}
                    />
                  </span>
                  <span className="ms-2">Testimonials </span>
                </li>
              </Link>

              <Link to="/admin_contactus" onClick={handleNavCollapse}>
                <li className="a-ele ">
                  <span>
                    <MdContactPhone style={{ fontSize: "20px" }} />
                  </span>
                  <span className="ms-2">Contact Us</span>
                </li>
              </Link>

              <Link to="/admin_ranking" onClick={handleNavCollapse}>
                <li className="a-ele ">
                  <span>
                    <HiTrophy style={{ fontSize: "20px" }} />
                  </span>
                  <span className="ms-2">Ranking Circuit</span>
                </li>
              </Link>

            
            </ul>
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default Side;
