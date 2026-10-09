import React, { useState, useEffect, useCallback } from "react";
import "../Styles/registration.css";
import { Container, Modal } from "react-bootstrap";
import axios from "axios";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa6";
import { FaCheckCircle, FaRupeeSign, FaMapMarkerAlt } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import Toast from "./Toast";

const API_URL = process.env.REACT_APP_API_URL || "https://shuttlesmash.in";

// Empty player object
const emptyPlayer = () => ({ name: "", email: "", phone: "", errors: {} });
// Empty entry = array of players based on TotalPlayers
const emptyEntry  = (n) => Array.from({ length: n }, emptyPlayer);

const Registration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const itemParam = queryParams.get("item");
  const idParam = queryParams.get("id");
  const [item, setItem] = useState(itemParam ? JSON.parse(decodeURIComponent(itemParam)) : null);
  const eventId = item?._id || idParam;

  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, type = "info") => setToast({ msg, type }), []);

  const [step, setStep] = useState("select");
  const [allCategories, setAllCategories] = useState([]);
  const [tournamentTerms, setTournamentTerms] = useState([]);
  const [eventInfo, setEventInfo] = useState(null);

  useEffect(() => {
    // Fetch fresh event data from API to get latest EventInfo
    axios.get(`${API_URL}/api/admin/getevents`)
      .then(r => {
        const events = r.data.getevents || [];
        const freshEvent = events.find(e => e._id === eventId);
        // If we arrived via ?id= (payment failure redirect), populate item from API
        if (freshEvent && !item) {
          setItem(freshEvent);
        }
        if (freshEvent?.EventInfo) {
          setEventInfo(freshEvent.EventInfo);
        }
        // Also update categories from fresh data
        if (freshEvent?.Categories?.length > 0) {
          setAllCategories(freshEvent.Categories);
        } else if (item?.Categories?.length > 0) {
          setAllCategories(item.Categories);
        } else {
          axios.get(`${API_URL}/api/admin/getcategory`)
            .then(r => setAllCategories(r.data.getcategory || []))
            .catch(e => console.log(e));
        }
      })
      .catch(e => {
        console.log(e);
        // Fallback to URL item data if API fails
        if (item?.EventInfo) setEventInfo(item.EventInfo);
        if (item?.Categories?.length > 0) setAllCategories(item.Categories);
      });

    axios.get(`${API_URL}/api/admin/getterms`)
      .then(r => setTournamentTerms(r.data.getterms || []))
      .catch(e => console.log(e));
  }, []);

  // catForms: [{ cat, entries: [[player, player, ...], ...] }]
  const [catForms, setCatForms] = useState([]);
  const [showOtherPanel, setShowOtherPanel] = useState(false);
  const [otherSelected,  setOtherSelected]  = useState([]);

  const validateEmail = v => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(v);
  const validatePhone = v => {
    if (!/^\d{10}$/.test(v)) return false;
    if (/^(\d)\1{9}$/.test(v)) return false; // all same digits e.g. 0000000000
    if (/^[01]/.test(v)) return false;        // starts with 0 or 1
    return true;
  };
  const validateName = v => /^[a-zA-Z\s]{2,}$/.test(v.trim());

  // ── Book Now ─────────────────────────────
  const handleBook = (cat) => {
    setCatForms([{ cat, entries: [emptyEntry(cat.TotalPlayers)] }]);
    setOtherSelected([]);
    setShowOtherPanel(false);
    setStep("form");
    window.scrollTo(0, 0);
  };

  // ── Update a single player field ──────────
  const updatePlayer = (catIdx, entryIdx, playerIdx, field, val) => {
    setCatForms(prev => {
      const f = JSON.parse(JSON.stringify(prev));
      f[catIdx].entries[entryIdx][playerIdx][field] = val;
      if (val.trim()) delete f[catIdx].entries[entryIdx][playerIdx].errors[field];
      return f;
    });
  };

  // ── Add / remove entry ────────────────────
  const addEntry = (catIdx) => {
    setCatForms(prev => {
      const f = JSON.parse(JSON.stringify(prev));
      f[catIdx].entries.push(emptyEntry(f[catIdx].cat.TotalPlayers));
      return f;
    });
  };

  const removeEntry = (catIdx, entryIdx) => {
    setCatForms(prev => {
      const f = JSON.parse(JSON.stringify(prev));
      f[catIdx].entries.splice(entryIdx, 1);
      return f;
    });
  };

  // ── Add / remove whole category ───────────
  const removeCatForm = (catIdx) => setCatForms(prev => prev.filter((_, i) => i !== catIdx));

  // Delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteCatIdx, setDeleteCatIdx] = useState(null);

  const toggleOtherCat = (cat) => {
    if (catForms.some(f => f.cat._id === cat._id)) return;
    setOtherSelected(prev =>
      prev.some(c => c._id === cat._id) ? prev.filter(c => c._id !== cat._id) : [...prev, cat]
    );
  };

  const addOtherCategories = () => {
    if (!otherSelected.length) return;
    setCatForms(prev => [
      ...prev,
      ...otherSelected.map(cat => ({ cat, entries: [emptyEntry(cat.TotalPlayers)] }))
    ]);
    setOtherSelected([]);
    setShowOtherPanel(false);
  };

  // ── Total ────────────────────────────────
  const totalAmount = catForms.reduce((s, f) => s + f.cat.CategoryPrice * f.entries.length, 0);

  // ── Proceed / validate ────────────────────
  const [showSummary, setShowSummary] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleProceed = () => {
    let valid = true;
    const f = JSON.parse(JSON.stringify(catForms));

    f.forEach(form => {
      form.entries.forEach(entry => {
        entry.forEach(player => {
          player.errors = {};
          if (!player.name.trim())               { player.errors.name  = "Required"; valid = false; }
          else if (!validateName(player.name))   { player.errors.name  = "Letters only"; valid = false; }
          if (!player.email)                     { player.errors.email = "Required"; valid = false; }
          else if (!validateEmail(player.email)) { player.errors.email = "Invalid email"; valid = false; }
          if (!player.phone)                     { player.errors.phone = "Required"; valid = false; }
          else if (!validatePhone(player.phone)) { player.errors.phone = "Valid 10-digit number required"; valid = false; }
        });
      });
    });

    setCatForms(f);
    if (!valid) { showToast("Please fill all required fields correctly", "warning"); return; }

    const payload = {
      catForms: f.map(form => ({
        catName:  form.cat.CategoryName,
        catPrice: form.cat.CategoryPrice,
        catId:    form.cat._id,
        entries:  form.entries.map(entry => entry.map(p => ({ name: p.name, email: p.email, phone: p.phone }))),
      })),
      totalAmount,
    };
    sessionStorage.setItem("regData", JSON.stringify(payload));
    setShowSummary(true);
  };

  const regData = JSON.parse(sessionStorage.getItem("regData") || "null");

  const [paymentLoading, setPaymentLoading] = useState(false);

  const AddRegisterquery = async () => {
    try {
      setPaymentLoading(true);

      // Step 1: Save registration
      const regRes = await axios.post(`${API_URL}/api/user/registration`, {
        eventsId:    item?._id,
        catForms:    regData?.catForms,
        PlayerEmail: regData?.catForms?.[0]?.entries?.[0]?.[0]?.email,
        PlayerPhoneNo: regData?.catForms?.[0]?.entries?.[0]?.[0]?.phone,
        TotalAmount: regData?.totalAmount,
        Category:    regData?.catForms?.map(f => ({ categoryId: f.catId })),
        EventNames:  item?.EventName,
        EventsDate:  item?.EventStartdate,
        RegisteredDate: new Date().toLocaleDateString("en-IN"),
        RegisteredTime: new Date().toLocaleTimeString("en-IN"),
        playerNames: regData?.catForms?.flatMap(f => f.entries.flat().map(p => p.name)),
      });

      if (regRes.status !== 200) {
        showToast("Registration failed. Try again.", "error");
        setPaymentLoading(false);
        return;
      }

      // Step 2: Initiate PhonePe payment
      const firstPlayer = regData?.catForms?.[0]?.entries?.[0]?.[0];
      const paymentPayload = {
        userId: regRes.data?.registrationId || regRes.data?.getregistration?._id || Date.now().toString(),
        username: firstPlayer?.name || "Player",
        Mobile: firstPlayer?.phone || "",
        amount: regData?.totalAmount,
        successUrl: `${window.location.origin}/Paymentsuccess`,
        failedUrl: `${window.location.origin}/registration?id=${eventId}`,
      };

      const payRes = await axios.post(`${API_URL}/api/phonepe/addpaymentphonepay`, paymentPayload);

      if (payRes.data?.url) {
        // Redirect user to PhonePe payment page
        window.location.href = payRes.data.url;
      } else {
        showToast("Payment initialization failed. Please try again.", "error");
        setPaymentLoading(false);
      }
    } catch (e) {
      console.error("Payment error:", e);
      showToast(e.response?.data?.error || "Payment failed. Please try again.", "error");
      setPaymentLoading(false);
    }
  };

  const availableOtherCats = allCategories.filter(c => !catForms.some(f => f.cat._id === c._id));

  // Player label helper
  const playerLabel = (totalPlayers, playerIdx) => {
    if (totalPlayers === 1) return "Player Details";
    if (totalPlayers === 2) return playerIdx === 0 ? "Player Details" : "Partner Details";
    return `Player ${playerIdx + 1} Details`;
  };

  return (
    <div className="reg-page">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Floating WhatsApp */}
      <div className="fixed-icon">
        <a href="https://wa.link/5s5pya" target="_blank" rel="noopener noreferrer"
          style={{ color: "unset", textDecoration: "none" }}>
          <span className="fixed-icon-rings" />
          <IoLogoWhatsapp style={{ color: "white", fontSize: "34px", display: "block", position: "relative", zIndex: 4 }} />
        </a>
      </div>

      {/* ── Back Button (outside header) ───── */}
      <Container>
        <div className="reg-back-wrapper">
          <button className="reg-back-btn"
            onClick={() => step === "form" ? setStep("select") : navigate("/events")}>
            <FaArrowLeft /> Back
          </button>
        </div>
      </Container>

      {/* ── Header ─────────────────────────── */}
      <Container>
        <div className="reg-header">
          <div className="reg-header-info">
            <h1 className="reg-event-name">{item?.EventName}</h1>
          </div>
        </div>
      </Container>

      <Container>

        {/* ══ STEP 1 ══ */}
        {step === "select" && (
          <div className="reg-step">

            {/* ── Category grid ─────────────────── */}
            <div className="reg-step-title">Choose Your Category</div>
            <div className="reg-cat-grid">
              {allCategories.map(cat => {
                const isFull = cat.Limit > 0 && (cat.RegisteredCount || 0) >= cat.Limit;
                return (
                <div key={cat._id} className={`reg-cat-card ${isFull ? "reg-cat-card--disabled" : ""}`}>
                  {isFull && (
                    <div className="reg-cat-full-badge">Category Full</div>
                  )}
                  <div className="reg-cat-name">{cat.CategoryName}</div>
                  {(cat.CategoryType || cat.TotalPlayers) && (
                    <div className="reg-cat-type-badge">
                      {cat.CategoryType
                        ? cat.CategoryType
                        : cat.TotalPlayers === 1 ? "Singles" : cat.TotalPlayers === 2 ? "Doubles" : `${cat.TotalPlayers} Players`}
                    </div>
                  )}
                  <div className="reg-cat-fee-label">ENTRY FEE</div>
                  <div className="reg-cat-fee">
                    <FaRupeeSign className="reg-cat-rupee" />{cat.CategoryPrice}
                  </div>
                  {isFull ? (
                    <button className="reg-cat-book-btn reg-cat-book-btn--full" disabled>
                      Slots Full
                    </button>
                  ) : (
                    <button className="reg-cat-book-btn" onClick={() => handleBook(cat)}>
                      Book Now
                    </button>
                  )}
                </div>
                );
              })}
            </div>

            {/* ══ SHARE BAR ══ */}
            <div className="reg-share-bar">
              <div className="reg-share-line" />
              <div className="reg-share-btns">
                <button className="reg-share-main-btn" onClick={() => {
                  if (navigator.share) { navigator.share({ title: item?.EventName, url: window.location.href }); }
                  else { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }
                }}>SHARE</button>
                <a className="reg-share-icon-btn reg-share-icon-btn--instagram" href="https://www.instagram.com/shuttle_smash_championship?igsh=MWc5anJxemhobTdwdw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" title="Instagram">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" width="22" height="22" style={{display:"block", borderRadius:"6px"}} />
                </a>
                <a className="reg-share-icon-btn reg-share-icon-btn--youtube" href="https://youtube.com/@shuttlesmashchampionship?si=KJqu6NVz1frc2E1V" target="_blank" rel="noopener noreferrer" title="YouTube">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="YouTube" width="24" height="17" style={{display:"block"}} />
                </a>
                {/* <a className="reg-share-icon-btn reg-share-icon-btn--whatsapp" href={`https://wa.me/?text=${encodeURIComponent((item?.EventName||"Tournament")+" "+window.location.href)}`} target="_blank" rel="noopener noreferrer" title="WhatsApp">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                </a> */}
                <a className="reg-share-icon-btn reg-share-icon-btn--gmail" href={/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? `mailto:geetha@shuttlesmash.in?subject=${encodeURIComponent(item?.EventName||"Tournament Inquiry")}` : `https://mail.google.com/mail/?view=cm&to=geetha@shuttlesmash.in&su=${encodeURIComponent(item?.EventName||"Tournament Inquiry")}`} target="_blank" rel="noopener noreferrer" title="Email us">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" width="22" height="22" style={{display:"block"}} />
                </a>
              </div>
              <div className="reg-share-line" />
            </div>

            {/* ══ VENUE CARD ══ */}
            {eventInfo?.Venue && (
            <div className="sep-card sep-card--venue">
              <div className="sep-card-label">
                <span className="sep-dot" />
                <span className="sep-label-text">Venue:</span>
              </div>
              <div className="sep-venue-inner">
                <span className="sep-venue-text">
                  {eventInfo.Venue}
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventInfo.Venue)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="sep-pin-btn" title="Open in Google Maps"
                >
                  <FaMapMarkerAlt />
                </a>
              </div>
            </div>
            )}

            {/* ══ TOURNAMENT OVERVIEW CARD ══ */}
            {eventInfo?.OvInitiative && (
            <div className="sep-card sep-card--overview">
              <div className="sep-card-label">
                <span className="sep-dot" />
                <span className="sep-label-text">Tournament Overview</span>
              </div>
              <div className="sep-overview-inner">
                <div className="ov-card">
                  <div className="ov-description-list">
                    {eventInfo.OvInitiative.split("\n").filter(line => line.trim()).map((line, idx) => (
                      <div key={idx} className="ov-desc-point">
                        <span className="ov-desc-text">{line.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* ══ ORGANIZER CARD ══
            <div className="sep-card sep-card--organizer">
              <div className="sep-card-label">
                <span className="sep-dot" />
                <span className="sep-label-text">Organizer</span>
              </div>
              <div className="sep-organizer-inner">
                <div className="sep-org-name">
                  {eventInfo?.OrganizerName || item?.EventExhibits || "ORGANIZER"}
                </div>
                <div className="sep-org-email">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}>
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  {eventInfo?.OrganizerEmail || "contact@shuttlesmash.in"}
                </div>
              </div>
            </div> */}

          </div>
        )}
        {step === "form" && (
          <div className="reg-step">

            {catForms.map((form, catIdx) => (
              <div key={catIdx} className="reg-cat-block">

                {/* Block header */}
                <div className="reg-cat-block-header">
                  <div>
                    <div className="reg-cat-block-title">{form.cat.CategoryName}</div>
                    <div className="reg-cat-block-sub">
                      {form.cat.CategoryType
                        ? form.cat.CategoryType
                        : form.cat.TotalPlayers === 1 ? "Singles" : form.cat.TotalPlayers === 2 ? "Doubles" : `${form.cat.TotalPlayers} Players`}
                    </div>
                  </div>
                  <div className="reg-cat-block-right">
                    <span className="reg-cat-block-fee">
                      <FaRupeeSign style={{ fontSize: "14px" }} />{form.cat.CategoryPrice}
                      {form.entries.length > 1 && ` × ${form.entries.length}`}
                    </span>
                    {catIdx > 0 && (
                      <button className="reg-remove-cat-btn" onClick={() => {
                        setDeleteCatIdx(catIdx);
                        setShowDeleteConfirm(true);
                      }}>
                        <FaTrash style={{ fontSize: "13px" }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Entries */}
                {form.entries.map((entry, entryIdx) => (
                  <div key={entryIdx} className="reg-entry-card">

                    {/* Entry header — only if multiple entries */}
                    {form.entries.length > 1 && (
                      <div className="reg-entry-header">
                        <span className="reg-entry-label">Entry {entryIdx + 1}</span>
                        <button className="reg-remove-entry-btn" onClick={() => removeEntry(catIdx, entryIdx)}>
                          <FaTrash /> Remove
                        </button>
                      </div>
                    )}

                    {/* Player fields — one card per player */}
                    {entry.map((player, pi) => (
                      <div key={pi} className="reg-player-card" style={{ marginBottom: pi < entry.length - 1 ? "16px" : "0" }}>
                        <div className="reg-player-card-title">{playerLabel(form.cat.TotalPlayers, pi)}</div>
                        <div className="reg-player-fields">
                          {/* Row 1: Name + Email */}
                          <div className="reg-form-grid reg-form-grid-2">
                            <div className="reg-field">
                              <label>Name <span className="reg-req">*</span></label>
                              <input type="text" className={`reg-input ${player.errors?.name ? "reg-input-error" : ""}`}
                                placeholder="Enter full name" value={player.name}
                                onKeyPress={(e) => { if (/[0-9]/.test(e.key)) e.preventDefault(); }}
                                onChange={e => updatePlayer(catIdx, entryIdx, pi, "name", e.target.value)} />
                              {player.errors?.name && <span className="reg-error">{player.errors.name}</span>}
                            </div>
                            <div className="reg-field">
                              <label>Email <span className="reg-req">*</span></label>
                              <input type="email" className={`reg-input ${player.errors?.email ? "reg-input-error" : ""}`}
                                placeholder="Enter Email address" value={player.email}
                                onChange={e => updatePlayer(catIdx, entryIdx, pi, "email", e.target.value)} />
                              {player.errors?.email && <span className="reg-error">{player.errors.email}</span>}
                            </div>
                          </div>
                          {/* Row 2: Phone */}
                          <div className="reg-form-grid" style={{ marginTop: "14px" }}>
                            <div className="reg-field" style={{ maxWidth: "320px" }}>
                              <label>Phone <span className="reg-req">*</span> <span className="reg-hint">(10 digit number)</span></label>
                              <input type="number" className={`reg-input ${player.errors?.phone ? "reg-input-error" : ""}`}
                                placeholder="Enter phone number" value={player.phone}
                                onChange={e => updatePlayer(catIdx, entryIdx, pi, "phone", e.target.value)} />
                              {player.errors?.phone && <span className="reg-error">{player.errors.phone}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}


              </div>
            ))}

            {/* Register in other categories */}
            <div className="reg-other-section">
              <button className="reg-other-toggle" onClick={() => setShowOtherPanel(!showOtherPanel)}>
                Register me in other categories
              </button>
              {showOtherPanel && availableOtherCats.length > 0 && (
                <div className="reg-other-panel">
                  <p className="reg-other-panel-label" style={{ fontSize: "18px", fontWeight: 700, color: "#000" }}>Select categories to add:</p>
                  <div className="reg-other-chips">
                    {availableOtherCats.map(cat => (
                      <button key={cat._id}
                        className={`reg-other-chip ${otherSelected.some(c => c._id === cat._id) ? "chip-active" : ""}`}
                        onClick={() => toggleOtherCat(cat)}>
                        {cat.CategoryName}
                      </button>
                    ))}
                  </div>
                  <button className="reg-add-selected-btn" onClick={addOtherCategories} disabled={!otherSelected.length}>
                    Add to Selected Categories
                  </button>
                </div>
              )}
              {showOtherPanel && availableOtherCats.length === 0 && (
                <p className="reg-other-empty" style={{ fontSize: "16px", fontWeight: 700, color: "#000" }}>All categories have been added.</p>
              )}
            </div>

            {/* Actions */}
            <div className="reg-actions">
              <div className="reg-total-bar">
                <span>Total Amount</span>
                <span className="reg-total-amount">
                  <FaRupeeSign style={{ fontSize: "15px" }} />{totalAmount}
                </span>
              </div>
              <div className="reg-actions-btns">
                <button className="reg-cancel-btn" onClick={() => setStep("select")}>
                  Cancel
                </button>
                <button className="reg-proceed-btn" onClick={handleProceed}>
                  Proceed to Payment →
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>

      {/* ══ SUMMARY MODAL ══ */}
      <Modal show={showSummary} onHide={() => setShowSummary(false)} size="md" style={{ zIndex: 99999 }} centered dialogClassName="reg-summary-modal">
        <Modal.Header closeButton style={{ background: "#031B77", borderBottom: "1px solid rgba(255,255,255,0.1)" }} className="reg-modal-header">
          <div className="reg-modal-title-row">
            <button className="reg-modal-arrow-btn" onClick={() => setShowSummary(false)}>
              <FaArrowLeft />
            </button>
            <Modal.Title style={{ color: "#fff", fontWeight: 700 }}>Registration Summary</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body style={{ background: "#ffffff", color: "#1a1a2e", padding: "28px" }}>
          {regData?.catForms?.map((f, i) => (
            <div key={i} style={{ marginBottom: "20px" }}>
              {/* Category header */}
              <div style={{
                color: "#3a6fd8", fontWeight: 700, fontSize: "15px",
                textTransform: "uppercase", letterSpacing: "0.8px",
                marginBottom: "14px", paddingBottom: "10px",
                borderBottom: "1px solid #e4e8f8"
              }}>
                {f.catName} — ₹{f.catPrice * f.entries.length}
              </div>

              {f.entries.map((entry, ei) => (
                <div key={ei}>
                  {f.entries.length > 1 && (
                    <div style={{ color: "rgba(0,0,0,0.35)", fontSize: "11px",
                      textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                      Entry {ei + 1}
                    </div>
                  )}
                  {entry.map((p, pi) => (
                    <div key={pi} style={{
                      background: "#f8f9fc",
                      border: "1px solid #e4e8f8",
                      borderRadius: "10px",
                      padding: "14px 18px",
                      marginBottom: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px"
                    }}>
                      <div style={{
                        fontSize: "11px", fontWeight: 700, color: "#3a6fd8",
                        textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px"
                      }}>
                        {entry.length > 1 ? (pi === 0 ? "Player" : "Partner") : "Player Details"}
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "#031B77" }}>
                        {p.name}
                      </div>
                      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "13px", color: "#000", fontWeight: 700 }}>✉ {p.email}</span>
                        <span style={{ fontSize: "13px", color: "#000", fontWeight: 700 }}>📞 {p.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          {/* Total */}
          <div style={{
            display: "flex", justifyContent: "flex-end", alignItems: "baseline",
            gap: "8px", padding: "16px 0 4px", borderTop: "2px solid #e4e8f8", marginTop: "8px"
          }}>
            <span style={{ color: "#000", fontSize: "16px",
              fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Total:
            </span>
            <span style={{ color: "#031B77", fontSize: "24px", fontWeight: 900 }}>
              ₹{regData?.totalAmount}
            </span>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ background: "#f8f9fc", borderTop: "1px solid #e4e8f8" }}>
          <button className="reg-modal-pay-btn" onClick={() => { setShowSummary(false); AddRegisterquery(); }}
            disabled={paymentLoading}
            style={{ opacity: paymentLoading ? 0.7 : 1, cursor: paymentLoading ? "not-allowed" : "pointer" }}>
            {paymentLoading ? "Processing..." : "Proceed to Pay →"}
          </button>
        </Modal.Footer>
      </Modal>

      {/* ══ PAYMENT MODAL ══ */}
      <Modal show={showPayment} onHide={() => !paymentLoading && setShowPayment(false)} size="md" style={{ zIndex: 99999 }} centered>
        <Modal.Header closeButton={!paymentLoading} style={{ background: "#031B77", borderBottom: "1px solid rgba(255,255,255,0.1)" }} className="reg-modal-header">
          <div className="reg-modal-title-row">
            <button className="reg-modal-arrow-btn" onClick={() => !paymentLoading && setShowPayment(false)} disabled={paymentLoading}>
              <FaArrowLeft />
            </button>
            <Modal.Title style={{ color: "#fff", fontWeight: 700 }}>
              Complete Payment — ₹{regData?.totalAmount}
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body style={{ background: "#ffffff", padding: "28px" }}>
          <div style={{
            background: "#f4f6fb", border: "1px solid #e4e8f8",
            borderRadius: "12px", padding: "16px 20px", marginBottom: "20px"
          }}>
            <div style={{ fontWeight: 700, color: "#031B77", fontSize: "15px", marginBottom: "10px" }}>📌 Payment Information</div>
            <p style={{ color: "#444", fontSize: "13.5px", lineHeight: 1.6, marginBottom: "8px" }}>
              You will be redirected to PhonePe to complete your payment of <strong>₹{regData?.totalAmount}</strong>.
            </p>
            <p style={{ color: "#444", fontSize: "13.5px", lineHeight: 1.6, marginBottom: "8px" }}>
              After successful payment, your registration will be confirmed automatically.
            </p>
            <p style={{ color: "#444", fontSize: "13.5px", lineHeight: 1.6, marginBottom: 0 }}>
              If you face any payment issues, contact us at{" "}
              <a href="tel:+918861711005" style={{ color: "#3a6fd8", fontWeight: 600, textDecoration: "none" }}>+91 88617 11005</a>
            </p>
          </div>

          {/* Payment summary */}
          <div style={{
            background: "#f8f9fc", border: "1px solid #e4e8f8",
            borderRadius: "12px", padding: "16px 20px"
          }}>
            <div style={{ fontWeight: 700, color: "#031B77", fontSize: "14px", marginBottom: "12px" }}>Order Summary</div>
            {regData?.catForms?.map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13.5px" }}>
                <span style={{ color: "#555" }}>{f.catName} × {f.entries.length}</span>
                <span style={{ fontWeight: 600, color: "#031B77" }}>₹{f.catPrice * f.entries.length}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #e4e8f8", marginTop: "12px", paddingTop: "12px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, color: "#031B77" }}>Total</span>
              <span style={{ fontWeight: 800, color: "#031B77", fontSize: "18px" }}>₹{regData?.totalAmount}</span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ background: "#f8f9fc", borderTop: "1px solid #e4e8f8" }}>
          <button className="reg-modal-cancel-btn"
            onClick={() => setShowPayment(false)} disabled={paymentLoading}>✕ Cancel</button>
          <button className="reg-modal-pay-btn" onClick={AddRegisterquery} disabled={paymentLoading}
            style={{ opacity: paymentLoading ? 0.7 : 1, cursor: paymentLoading ? "not-allowed" : "pointer" }}>
            {paymentLoading ? "Processing..." : "Pay with PhonePe →"}
          </button>
        </Modal.Footer>
      </Modal>

      {/* ── Delete Category Confirmation Modal ── */}
      {showDeleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={() => setShowDeleteConfirm(false)}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", maxWidth: "400px", width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#EBF3FF", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaTrash style={{ fontSize: "24px", color: "#031B77" }} />
            </div>
            <h4 style={{ color: "#031B77", fontWeight: 800, marginBottom: "8px" }}>Remove Category?</h4>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "24px" }}>
              Are you sure you want to remove this category? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => setShowDeleteConfirm(false)}
                style={{ padding: "10px 28px", borderRadius: "8px", border: "2px solid #031B77", background: "#fff", color: "#031B77", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={() => { removeCatForm(deleteCatIdx); setShowDeleteConfirm(false); }}
                style={{ padding: "10px 28px", borderRadius: "8px", border: "none", background: "#031B77", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Registration;
