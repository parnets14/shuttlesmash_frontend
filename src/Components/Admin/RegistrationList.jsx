import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BsSearch, BsEyeFill, BsArrowLeft, BsFunnel, BsDownload } from "react-icons/bs";
import "../Admin/Admin.css";
import axios from "axios";
import * as XLSX from "xlsx";

const RegistrationList = () => {
  const [view, setView] = useState("events"); // "events" or "students"
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchH, setSearchH] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Delete modal
  const [show4, setShow4] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  // Status change modal
  const [show10, setShow10] = useState(false);
  const [editid, seteditid] = useState("");
  const [status, setstatus] = useState("");

  // Fetch registrations
  const getAddregister = async () => {
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/user/getregistration`
      );
      if (res.status === 200) {
        const data = res.data.getregistration || [];
        setAllRegistrations(data);
        // Extract unique events
        const eventMap = {};
        data.forEach((reg) => {
          const eventId = reg?.eventsId?._id;
          if (eventId && !eventMap[eventId]) {
            eventMap[eventId] = {
              _id: eventId,
              EventName: reg?.eventsId?.EventName || reg?.EventNames,
              EventStartdate: reg?.eventsId?.EventStartdate,
              EventEnddate: reg?.eventsId?.EventEnddate,
              Categories: reg?.eventsId?.Categories || [],
              EventType: reg?.eventsId?.EventType || "individual",
              registrationCount: 0,
              paidCount: 0,
            };
          }
          if (eventId) {
            eventMap[eventId].registrationCount++;
            if (reg.status === "Received" || reg.status === "Success") {
              eventMap[eventId].paidCount++;
            }
          }
        });
        setEvents(Object.values(eventMap));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAddregister();
  }, []);

  // Date format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get category names from a registration
  const getCategoryNames = (item) => {
    // First try catForms (new format with catName)
    if (item.catForms && item.catForms.length > 0) {
      const names = item.catForms.map((f) => f.catName).filter(Boolean);
      if (names.length > 0) return names;
    }
    // Match category IDs with event's embedded categories
    if (item.Category && item.Category.length > 0 && item.eventsId?.Categories) {
      const eventCats = item.eventsId.Categories;
      const names = item.Category
        .map((c) => {
          const catId = c?.categoryId?._id || c?.categoryId;
          if (!catId) return null;
          const found = eventCats.find((ec) => String(ec._id) === String(catId));
          return found?.CategoryName;
        })
        .filter(Boolean);
      if (names.length > 0) return names;
    }
    // Fallback: if categoryId was populated from separate Category collection
    if (item.Category && item.Category.length > 0) {
      const names = item.Category
        .map((c) => {
          if (c?.categoryId && typeof c.categoryId === "object" && c.categoryId.CategoryName) {
            return c.categoryId.CategoryName;
          }
          return null;
        })
        .filter(Boolean);
      if (names.length > 0) return names;
    }
    return [];
  };

  // Every registration for the selected event (paid + pending)
  const getEventRegistrations = () => {
    if (!selectedEvent) return [];
    return allRegistrations.filter(
      (reg) => reg?.eventsId?._id === selectedEvent._id
    );
  };

  // Get paid students for selected event
  const getPaidStudents = () => {
    if (!selectedEvent) return [];
    return allRegistrations.filter(
      (reg) =>
        reg?.eventsId?._id === selectedEvent._id &&
        (reg.status === "Received" || reg.status === "Success")
    );
  };

  // Get unique categories for the selected event (from registrations)
  const getEventCategories = () => {
    const students = getEventRegistrations();
    const catSet = new Set();
    students.forEach((reg) => {
      getCategoryNames(reg).forEach((name) => catSet.add(name));
    });
    return Array.from(catSet).sort();
  };

  // Filter students by category
  const getFilteredStudents = () => {
    let students = getEventRegistrations();
    // Category filter
    if (categoryFilter !== "all") {
      students = students.filter((reg) =>
        getCategoryNames(reg).includes(categoryFilter)
      );
    }
    // Search filter
    if (studentSearch) {
      const term = studentSearch.toLowerCase();
      students = students.filter((reg) => {
        return (
          (reg.playerNames && Object.values(reg.playerNames).join(" ").toLowerCase().includes(term)) ||
          (reg.OrganisationName && reg.OrganisationName.toLowerCase().includes(term)) ||
          reg.PlayerEmail?.toLowerCase().includes(term) ||
          reg.PlayerPhoneNo?.toLowerCase().includes(term) ||
          getCategoryNames(reg).join(" ").toLowerCase().includes(term)
        );
      });
    }
    return students;
  };

  // Status change
  const makeStatusChangeContactUs = async () => {
    try {
      const config = {
        url: "user/makeStatusChangebookings",
        method: "put",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: { "Content-Type": "application/json" },
        data: { id: editid, status: status },
      };
      let res = await axios(config);
      if (res.status === 200) {
        alert(`${res?.data?.success}`);
        setShow10(false);
        getAddregister();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Error updating status");
      console.log(error);
    }
  };

  // Delete
  const Deleteregister = async () => {
    try {
      const config = {
        url: "user/Deleteregistration/" + deleteId,
        method: "delete",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        header: { "content-type": "application/json" },
      };
      let res = await axios(config);
      if (res.status === 200) {
        alert("Successfully Deleted");
        getAddregister();
        setShow4(false);
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.msg || "Error deleting");
    }
  };

  // Search filter for events
  const filteredEvents = events.filter((ev) =>
    ev.EventName?.toLowerCase().includes(searchH.toLowerCase())
  );

  // Student search
  const [studentSearch, setStudentSearch] = useState("");
  const filteredStudents = getFilteredStudents();

  // Pagination for students
  const [currenpage, setCurrentpage] = useState(1);
  const recordsperpage = 10;
  const lastIndex = currenpage * recordsperpage;
  const firstIndex = lastIndex - recordsperpage;
  const records = filteredStudents.slice(firstIndex, lastIndex);
  const npages = Math.ceil(filteredStudents.length / recordsperpage);
  const numbers = [...Array(npages + 1).keys()].slice(1);

  // Export to Excel
  const exportToExcel = () => {
    const dataToExport = [];

    filteredStudents.forEach((item) => {
      let categoryGroups = [];
      if (item.catForms && item.catForms.length > 0) {
        item.catForms.forEach((form) => {
          form.entries?.forEach((entry) => {
            categoryGroups.push({
              catName: form.catName,
              players: entry,
            });
          });
        });
      }

      // If category filter is active, only export that category
      if (categoryFilter !== "all" && categoryGroups.length > 0) {
        categoryGroups = categoryGroups.filter((g) => g.catName === categoryFilter);
      }

      if (categoryGroups.length > 0) {
        categoryGroups.forEach((group) => {
          group.players.forEach((p, pIdx) => {
            dataToExport.push({
              "Event Name": selectedEvent?.EventName || "",
              "Event Date": formatDate(selectedEvent?.EventStartdate) + (selectedEvent?.EventEnddate ? ` – ${formatDate(selectedEvent?.EventEnddate)}` : ""),
              "Event Type": selectedEvent?.EventType === "team" ? "Team" : "Individual",
              "Organisation": item.OrganisationName || "",
              "Category": group.catName,
              "Player Name": p.name,
              "Phone Number": p.phone,
              "Email ID": p.email,
              "Amount": pIdx === 0 ? `₹${item.TotalAmount}` : "",
              "Payment Status": pIdx === 0 ? item.status : "",
              "Payment Date": pIdx === 0 ? (item.PaymentDate || "") : "",
            });
          });
        });
      } else {
        // Fallback for old data
        const names = item.playerNames ? Object.values(item.playerNames) : ["—"];
        names.forEach((name, idx) => {
          dataToExport.push({
            "Event Name": selectedEvent?.EventName || "",
            "Event Date": formatDate(selectedEvent?.EventStartdate) + (selectedEvent?.EventEnddate ? ` – ${formatDate(selectedEvent?.EventEnddate)}` : ""),
            "Event Type": selectedEvent?.EventType === "team" ? "Team" : "Individual",
            "Organisation": item.OrganisationName || "",
            "Category": getCategoryNames(item).join(", "),
            "Player Name": name,
            "Phone Number": idx === 0 ? (item.PlayerPhoneNo || "") : "",
            "Email ID": idx === 0 ? (item.PlayerEmail || "") : "",
            "Amount": idx === 0 ? `₹${item.TotalAmount}` : "",
            "Payment Status": idx === 0 ? item.status : "",
            "Payment Date": idx === 0 ? (item.PaymentDate || "") : "",
          });
        });
      }
    });

    if (dataToExport.length === 0) {
      alert("No data to export");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // Auto-size columns
    const keys = Object.keys(dataToExport[0]);
    const colWidths = keys.map((key) => {
      const maxLen = Math.max(
        key.length,
        ...dataToExport.map((row) => String(row[key] || "").length)
      );
      return { wch: Math.min(maxLen + 2, 40) };
    });
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");

    // File name with event name and filter
    const eventName = (selectedEvent?.EventName || "Registrations").replace(/[^a-zA-Z0-9 ]/g, "");
    const filterLabel = categoryFilter !== "all" ? `_${categoryFilter.replace(/[^a-zA-Z0-9 ]/g, "")}` : "";
    const fileName = `${eventName}${filterLabel}_${new Date().toLocaleDateString("en-IN").replace(/\//g, "-")}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  return (
    <div>
      {/* ══ EVENTS VIEW ══ */}
      {view === "events" && (
        <div className="customerhead p-2">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="header-c">Registration List</h2>
          </div>

          {/* Search */}
          <div className="col-lg-4 mb-3">
            <div className="input-group">
              <span className="input-group-text"><BsSearch /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search events..."
                value={searchH}
                onChange={(e) => setSearchH(e.target.value)}
              />
            </div>
          </div>

          <Table responsive bordered style={{ width: "-webkit-fill-available" }}>
            <thead>
              <tr>
                <th style={{ width: "60px" }}>SL.NO</th>
                <th>Event Name</th>
                <th>Event Date</th>
                <th style={{ width: "110px", textAlign: "center" }}>Type</th>
                <th style={{ width: "130px", textAlign: "center" }}>Registrations</th>
                <th style={{ width: "120px", textAlign: "center" }}>Total Paid</th>
                <th style={{ width: "100px", textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((ev, i) => (
                  <tr key={ev._id}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{ev.EventName}</td>
                    <td>
                      {formatDate(ev.EventStartdate)}
                      {ev.EventEnddate && (
                        <>
                          <span style={{ margin: "0 6px", color: "#999" }}>–</span>
                          {formatDate(ev.EventEnddate)}
                        </>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        className={`event-type-badge event-type-badge--${ev.EventType === "team" ? "team" : "individual"}`}
                        style={{ marginLeft: 0 }}
                      >
                        {ev.EventType === "team" ? "Team" : "Individual"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center", fontWeight: 700, color: "#031B77" }}>
                      {ev.registrationCount}
                    </td>
                    <td style={{ textAlign: "center", fontWeight: 700, color: "#28a745" }}>
                      {ev.paidCount}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                        onClick={() => {
                          setSelectedEvent(ev);
                          setView("students");
                          setCurrentpage(1);
                          setStudentSearch("");
                          setCategoryFilter("all");
                        }}
                      >
                        <BsEyeFill /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      {/* ══ STUDENTS VIEW ══ */}
      {view === "students" && (
        <div className="customerhead p-2">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setView("events")}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <BsArrowLeft /> Back
              </button>
              <div>
                <h2 className="header-c mb-0">
                  {selectedEvent?.EventName}
                  <span
                    className={`event-type-badge event-type-badge--${selectedEvent?.EventType === "team" ? "team" : "individual"}`}
                    style={{ marginLeft: "10px", verticalAlign: "middle" }}
                  >
                    {selectedEvent?.EventType === "team" ? "Team" : "Individual"}
                  </span>
                </h2>
                <small style={{ color: "#666" }}>
                  {formatDate(selectedEvent?.EventStartdate)}
                  {selectedEvent?.EventEnddate && ` – ${formatDate(selectedEvent?.EventEnddate)}`}
                  {" • "}<strong>{filteredStudents.length}</strong> registration{filteredStudents.length !== 1 ? "s" : ""}
                  {" • "}<span style={{ color: "#28a745", fontWeight: 700 }}>{getPaidStudents().length} paid</span>
                </small>
              </div>
            </div>
          </div>

          {/* Search + Category Filter + Export */}
          <div className="d-flex gap-3 mb-3 flex-wrap align-items-center">
            <div className="input-group" style={{ maxWidth: "300px" }}>
              <span className="input-group-text"><BsSearch /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search players..."
                value={studentSearch}
                onChange={(e) => { setStudentSearch(e.target.value); setCurrentpage(1); }}
              />
            </div>

            {/* Category Filter */}
            <div className="input-group" style={{ maxWidth: "280px" }}>
              <span className="input-group-text"><BsFunnel /></span>
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentpage(1); }}
              >
                <option value="all">All Categories</option>
                {getEventCategories().map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Export to Excel */}
            <button
              className="btn btn-success btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", fontWeight: 600 }}
              onClick={exportToExcel}
            >
              <BsDownload /> Export Excel
            </button>
          </div>

          <Table responsive bordered style={{ width: "-webkit-fill-available" }}>
            <thead>
              <tr>
                <th style={{ width: "60px" }}>SL.NO</th>
                {selectedEvent?.EventType === "team" && (
                  <th style={{ minWidth: "150px" }}>Organisation</th>
                )}
                <th>Players Name</th>
                <th>Phone Number</th>
                <th>Email ID</th>
                <th>Category</th>
                <th style={{ width: "90px", textAlign: "center" }}>Amount</th>
                <th style={{ width: "120px", textAlign: "center" }}>Payment Status</th>
                <th style={{ width: "120px", textAlign: "center" }}>Payment Date</th>
                <th style={{ width: "70px", textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((item, i) => {
                  const isTeam = selectedEvent?.EventType === "team";

                  // Flatten this registration into one line per player
                  let playerRows = [];
                  if (item.catForms && item.catForms.length > 0) {
                    item.catForms.forEach((form) => {
                      (form.entries || []).forEach((entry) => {
                        (entry || []).forEach((p) => {
                          playerRows.push({
                            name: p.name || "—",
                            phone: p.phone || "",
                            email: p.email || "",
                            catName: form.catName || "—",
                          });
                        });
                      });
                    });
                  }
                  if (playerRows.length === 0) {
                    const names = item.playerNames ? Object.values(item.playerNames) : [];
                    const cats = getCategoryNames(item).join(", ");
                    playerRows = names.length
                      ? names.map((n, idx) => ({
                          name: n || "—",
                          phone: idx === 0 ? item.PlayerPhoneNo || "" : "",
                          email: idx === 0 ? item.PlayerEmail || "" : "",
                          catName: cats || "—",
                        }))
                      : [{
                          name: "—",
                          phone: item.PlayerPhoneNo || "",
                          email: item.PlayerEmail || "",
                          catName: cats || "—",
                        }];
                  }
                  if (categoryFilter !== "all") {
                    playerRows = playerRows.filter((r) => r.catName === categoryFilter);
                  }
                  if (playerRows.length === 0) return null;

                  const rowSpan = playerRows.length;
                  const statusText = String(item.status || "").toLowerCase();
                  const isPaid = statusText === "received" || statusText === "success";
                  const isPending = statusText === "pending";
                  const spanCell = {
                    verticalAlign: "middle",
                    textAlign: "center",
                    borderLeft: "1px solid #dee2e6",
                  };

                  return playerRows.map((row, idx) => (
                    <tr
                      key={`${item._id}-${idx}`}
                      style={{ borderTop: idx === 0 ? "2px solid #cbd5f0" : "1px solid #f0f2f8" }}
                    >
                      {idx === 0 && (
                        <td rowSpan={rowSpan} style={{ ...spanCell }}>{i + 1 + firstIndex}</td>
                      )}

                      {isTeam && idx === 0 && (
                        <td rowSpan={rowSpan} style={{ verticalAlign: "middle", padding: "10px 12px", borderLeft: "1px solid #dee2e6" }}>
                          {item.OrganisationName ? (
                            <span style={{ fontWeight: 700, fontSize: "13px", color: "#031B77" }}>
                              {item.OrganisationName}
                            </span>
                          ) : (
                            <span style={{ color: "#aaa" }}>—</span>
                          )}
                        </td>
                      )}

                      <td style={{ padding: "8px 12px", fontSize: "13px", fontWeight: 600 }}>{row.name}</td>
                      <td style={{ padding: "8px 12px", fontSize: "13px", whiteSpace: "nowrap" }}>{row.phone || "—"}</td>
                      <td style={{ padding: "8px 12px", fontSize: "13px", whiteSpace: "nowrap" }}>{row.email || "—"}</td>
                      <td style={{ padding: "8px 12px" }}>
                        <span style={{
                          background: "#e8f0fe",
                          color: "#1a73e8",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}>
                          {row.catName}
                        </span>
                      </td>

                      {idx === 0 && (
                        <td rowSpan={rowSpan} style={{ ...spanCell, fontWeight: 700 }}>₹{item.TotalAmount}</td>
                      )}
                      {idx === 0 && (
                        <td rowSpan={rowSpan} style={{ ...spanCell }}>
                          <span style={{
                            background: isPaid ? "#d4edda" : isPending ? "#fff3cd" : "#e2e3e5",
                            color: isPaid ? "#155724" : isPending ? "#856404" : "#41464b",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}>
                            {item.status || "—"}
                          </span>
                        </td>
                      )}
                      {idx === 0 && (
                        <td rowSpan={rowSpan} style={{ ...spanCell, fontSize: "13px", color: "#333" }}>
                          {item.PaymentDate || "—"}
                        </td>
                      )}
                      {idx === 0 && (
                        <td rowSpan={rowSpan} style={{ ...spanCell }}>
                          <AiFillDelete
                            className="text-danger"
                            style={{ cursor: "pointer", fontSize: "20px" }}
                            onClick={() => {
                              setShow4(true);
                              setDeleteId(item?._id);
                            }}
                          />
                        </td>
                      )}
                    </tr>
                  ));
                })
              ) : (
                <tr>
                  <td colSpan={selectedEvent?.EventType === "team" ? 10 : 9} style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                    No registrations found
                    {categoryFilter !== "all" && ` for "${categoryFilter}"`}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          {npages > 1 && (
            <div>
              <nav>
                <ul className="pagination">
                  <li className="not-allow">
                    <span>
                      <span className="next-prev">
                        <a onClick={() => { if (currenpage > 1) setCurrentpage(currenpage - 1); }}>
                          &lt;
                        </a>
                      </span>
                    </span>
                  </li>
                  {numbers.map((n, i) => (
                    <li className="active-next" key={i}>
                      <a
                        href="#"
                        className={n === currenpage ? "active" : "inactive"}
                        onClick={() => setCurrentpage(n)}
                      >
                        {n}
                      </a>
                    </li>
                  ))}
                  <li className="not-allow">
                    <span>
                      <span className="next-prev" onClick={() => { if (currenpage < npages) setCurrentpage(currenpage + 1); }}>
                        &gt;
                      </span>
                    </span>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      )}

      {/* Delete modal */}
      <Modal
        show={show4}
        onHide={() => setShow4(false)}
        backdrop="static"
        keyboard={false}
        style={{ zIndex: "99999" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="fs-4" style={{ color: "red" }}>
            Are you sure?<br />You want to delete this data?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" className="modal-close-btn" onClick={() => setShow4(false)}>
            Close
          </Button>
          <Button variant="" className="modal-add-btn" onClick={Deleteregister}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Status change modal */}
      <Modal show={show10} onHide={() => setShow10(false)} style={{ zIndex: "99999" }}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: "navy", fontSize: "20px" }}>
            Are You Sure Want to {status} This Payment Status?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ backgroundColor: "#52f310", color: "#fff" }} onClick={() => setShow10(false)}>
            Cancel
          </Button>
          <Button style={{ backgroundColor: "green", color: "#fff" }} onClick={makeStatusChangeContactUs}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RegistrationList;
