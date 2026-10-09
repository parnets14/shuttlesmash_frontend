import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../Styles/header.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Header() {
  const navigate = useNavigate();
  const [Addcontactus, setAddcontactus] = useState([]);
  const [showJerseyModal, setShowJerseyModal] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getcontactus`);
        if (res.status === 200) setAddcontactus(res.data.getcontactus);
      } catch (e) { console.log(e); }
    };
    fetch();
  }, []);

  return (
    <div className="headers" style={{ position: "sticky", top: "0px", zIndex: "999" }}>
      {["xl"].map((expand) => (
        <Navbar key={expand} expand={expand} className="navbar">
          <Container fluid style={{ paddingLeft: "0", paddingRight: "16px" }}>

            {/* Logo */}
            <Nav.Link href="/" className="navbar-brand-logo">
              <img src="../Assets/logo.png" alt="logo" className="nav-logo-main" />
            </Nav.Link>

            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} onClick={() => setShowOffcanvas(true)} />

            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
              show={showOffcanvas}
              onHide={() => setShowOffcanvas(false)}
            >
              <Offcanvas.Header closeButton />
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 nav-links-row">
                  <Nav.Link href="/" className="nav-item-link">HOME</Nav.Link>

                  <NavDropdown
                    title="ABOUT US"
                    id="who-we-are-dropdown"
                    className="nav-item-link nav-dropdown"
                  >
                    <NavDropdown.Item href="/overview"><img src="../Assets/shuttlecock.png" alt="" className="dropdown-cock-icon" /> Overview</NavDropdown.Item>
                    <NavDropdown.Item href="/keyhighlights"><img src="../Assets/shuttlecock.png" alt="" className="dropdown-cock-icon" /> Key Highlights & Mission</NavDropdown.Item>
                    <NavDropdown.Item href="/leadershipteam"><img src="../Assets/shuttlecock.png" alt="" className="dropdown-cock-icon" /> A Leadership Team</NavDropdown.Item>
                  </NavDropdown>

                  <Nav.Link href="/events"   className="nav-item-link">TOURNAMENTS</Nav.Link>
                  <Nav.Link href="/gallery"  className="nav-item-link">GALLERY</Nav.Link>
                  <Nav.Link href="/ranking"  className="nav-item-link">RANKING CIRCUIT</Nav.Link>
                  {/* <Nav.Link href="/results"  className="nav-item-link">RESULTS</Nav.Link> */}
                   <Nav.Link onClick={() => { setShowOffcanvas(false); setShowJerseyModal(true); }} className="nav-item-link" style={{ cursor: "pointer" }}>BUY JERSEY</Nav.Link> 
                  <Nav.Link href="/contactus" className="nav-item-link nav-contact-btn">CONTACT US</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>

          </Container>
        </Navbar>
      ))}

      {/* Jersey External Site Modal */}
      {showJerseyModal && (
        <div className="jersey-modal-overlay"
          onClick={() => setShowJerseyModal(false)}>
          <div className="jersey-modal-box"
            onClick={e => e.stopPropagation()}>
            {/* Left content */}
            <div className="jersey-modal-content">
              <h4 className="jersey-modal-title">You're leaving our website</h4>
              <p className="jersey-modal-text">
                You will be redirected to <strong style={{ color: "#000" }}>GetMyGear.in</strong> — our official jersey partner's website to browse and purchase exclusive <strong style={{ color: "#000" }}>Shuttle Smash Jerseys</strong>.
              </p>
              <div className="jersey-modal-buttons">
                <button onClick={() => setShowJerseyModal(false)} className="jersey-modal-cancel-btn">
                  Cancel
                </button>
                <a href="https://getmygear.in/" target="_blank" rel="noopener noreferrer"
                  onClick={() => setShowJerseyModal(false)} className="jersey-modal-continue-btn">
                  Continue
                </a>
              </div>
            </div>
            {/* Right image */}
            <div className="jersey-modal-image-wrap">
              <img src="../Assets/Jerseys.jpeg" alt="Shuttle Smash Jersey" className="jersey-modal-image" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Header;
