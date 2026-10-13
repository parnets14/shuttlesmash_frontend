import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Table, Image } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import {
  FaPlus, FaTrophy, FaChevronDown, FaChevronUp,
  FaSave, FaUserPlus, FaMedal,
} from "react-icons/fa";
import { MdAutoAwesome } from "react-icons/md";
import axios from "axios";
import "../Admin/Admin.css";
import "./AdminRanking.css";

const API = process.env.REACT_APP_API_URL;

/* ── constants ──────────────────────────────── */
const thisYear = new Date().getFullYear();
const safe     = (v) => (Array.isArray(v) ? v : []);

/* the tournaments offered in the Tournament Name dropdown */
const TOURNAMENT_TYPES = ["Junior Ranking", "Senior Ranking", "Master Ranking"];

const round2 = (v) => Math.round(v * 100) / 100;

/* the bonus scoring columns used when a ranking has none configured yet.
   The label IS the full column header shown on the leaderboard. */
const DEFAULT_BONUS = [
  { key: "semi",   label: "5 for Semi Finalists" },
  { key: "runner", label: "10 for RunnersUp" },
  { key: "winner", label: "20 for Winner" },
];

const bonusColsOf = (group) =>
  safe(group?.BonusColumns).length ? safe(group.BonusColumns) : DEFAULT_BONUS;

/* player rows shown per page in the admin grid */
const GRID_PAGE_SIZE = 20;

/* page numbers to render — first, last and current ±1, gaps collapsed to "…" */
const pageItems = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set([1, total, current - 1, current, current + 1]);
  const nums = [...keep].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  nums.forEach((n) => {
    if (prev && n - prev > 1) out.push("…");
    out.push(n);
    prev = n;
  });
  return out;
};

/** Total Score (stored as TotalSpree) = (Total Points Scored + sum of every bonus value) / 10 */
const spreeOf = (r) => {
  const bonusSum = Object.values(r.bonus || {})
    .reduce((s, v) => s + (Number(v) || 0), 0);
  return round2(((Number(r.TotalPointsScored) || 0) + bonusSum) / 10);
};

/** "2025 - CORPORATE TOURNAMENT" -> "CORPORATE" (drives the leaderboard heading) */
const deriveSeries = (title) => {
  if (!title) return "Shuttle Smash";
  const s = String(title)
    .toUpperCase()
    .replace(/^\s*\d{4}\s*[-–—:.]?\s*/, "")                      // drop a leading year
    .replace(/\b(RANKINGS?|CIRCUIT|LEADERBOARD|TROPHY|SERIES|TOURNAMENTS?|CHAMPIONSHIPS?)\b/g, "") // drop trailing nouns
    .replace(/[^A-Z0-9'&\s]/g, " ")                              // keep letters / digits only
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s-]+|[\s-]+$/g, "")
    .trim();
  return s || "Shuttle Smash";
};

/** what the ranking card shows: "<Year> - <name>" (year comes from the Year field) */
const cardTitle = (group) => {
  const name = String(group?.Title || "")
    .replace(/^\s*\d{4}\s*[-–—:.]?\s*/, "")
    .trim();
  if (!name) return group?.Year ? String(group.Year) : "";
  return group?.Year ? `${group.Year} - ${name}` : name;
};

/* blank player row */
const blankRow = (id, event, bonusCols) => ({
  _tmpId:            id,
  PlayerName:        "",
  Event:             event || "",
  TotalPointsScored: 0,
  bonus:             Object.fromEntries((bonusCols || []).map((c) => [c.key, 0])),
  TotalSpree:        0,
  Rank:              0,
  Status:            "Active",
  _saved:            false,
  _dbId:             null,
});

let tmpCounter = 1;

/* ════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════ */
const AdminRanking = () => {

  /* ── groups ─────────────────────────────────── */
  const [groups,     setGroups]     = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  /* ── group form ──────────────────────────────── */
  const [showGroupAdd,  setShowGroupAdd]  = useState(false);
  const [showGroupEdit, setShowGroupEdit] = useState(false);
  const [showGroupDel,  setShowGroupDel]  = useState(false);
  const [gTitle,      setGTitle]      = useState("");
  /* the year is no longer asked for — it is always the current year for new
     rankings, and an existing ranking keeps whatever year it was created with */
  const [gYear,       setGYear]       = useState(thisYear);
  const [gCategories, setGCategories] = useState([]);
  const [newCat,      setNewCat]      = useState("");
  const [gStatus,     setGStatus]     = useState("Active");
  const [gEditItem,   setGEditItem]   = useState(null);
  const [gDelId,      setGDelId]      = useState("");

  /* ── grid state (per group) ──────────────────── */
  // gridData[groupId] = { rows: [...] }
  const [gridData,    setGridData]    = useState({});
  const [gridLoading, setGridLoading] = useState({});
  const [saving,      setSaving]      = useState(false);
  const [showDelRow,  setShowDelRow]  = useState(false);
  const [delRowInfo,  setDelRowInfo]  = useState(null);
  /* current page per group id — the grid shows 20 rows at a time */
  const [gridPage,    setGridPage]    = useState({});

  /* ── hero banner for the public Ranking Circuit page ── */
  const [heroBannerTab,   setHeroBannerTab]   = useState(false);
  const [AddHeroBanner,   setAddHeroBanner]   = useState([]);
  const [HeroImage,       setHeroImage]       = useState("");
  const [HeroTitle,       setHeroTitle]       = useState("");
  const [HeroDescription, setHeroDescription] = useState("");
  const [showHeroAdd,     setShowHeroAdd]     = useState(false);
  const [showHeroEdit,    setShowHeroEdit]    = useState(false);
  const [showHeroDel,     setShowHeroDel]     = useState(false);
  const [editHeroItem,    setEditHeroItem]    = useState(null);
  const [deleteHeroId,    setDeleteHeroId]    = useState("");

  /* ════ helpers ══════════════════════════════ */
  const recalculate = (rows) => {
    const withSpree = rows.map((r) => ({ ...r, TotalSpree: spreeOf(r) }));

    /* rank inside each event (highest spree = 1) */
    const buckets = {};
    withSpree.forEach((r) => {
      const k = r.Event || "__none__";
      if (!buckets[k]) buckets[k] = [];
      buckets[k].push(r);
    });

    const ranks = {};
    Object.values(buckets).forEach((list) => {
      list
        .slice()
        .sort((a, b) => b.TotalSpree - a.TotalSpree ||
          (a.PlayerName || "").localeCompare(b.PlayerName || ""))
        .forEach((r, i) => { ranks[r._tmpId] = i + 1; });
    });

    return withSpree.map((r) => ({
      ...r,
      Rank: (r.PlayerName || "").trim() ? (ranks[r._tmpId] || 0) : 0,
    }));
  };

  const getGrid  = (id) => gridData[id] || { rows: [], bonusCols: DEFAULT_BONUS };
  const setGrid  = (id, updater) => {
    setGridData((prev) => {
      const cur  = prev[id] || { rows: [] };
      const next = typeof updater === "function" ? updater(cur) : updater;
      return { ...prev, [id]: next };
    });
  };

  /* the grid dropdown shows ONLY the categories you created for this ranking —
     there are no built-in defaults */
  const eventOptions = (group) => safe(group?.Categories);

  const defaultEvent = (group) => eventOptions(group)[0] || "";

  /* ════ fetch groups ══════════════════════════ */
  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/getrankinggroups`);
      setGroups(safe(res?.data?.groups));
    } catch { setGroups([]); }
  };
  useEffect(() => { fetchGroups(); }, []);

  /* ════ load existing players into grid ══════ */
  const loadPlayersIntoGrid = async (group) => {
    setGridLoading((prev) => ({ ...prev, [group._id]: true }));
    try {
      const res  = await axios.get(`${API}/api/admin/getrankings/group/${group._id}?all=1`);
      const flat = [];
      Object.values(res?.data?.rankings || {}).forEach((list) => {
        safe(list).forEach((p) => flat.push(p));
      });

      const ev   = defaultEvent(group);
      const cols = bonusColsOf(group);

      if (flat.length === 0) {
        setGrid(group._id, {
          bonusCols: cols,
          rows: [
            blankRow(tmpCounter++, ev, cols),
            blankRow(tmpCounter++, ev, cols),
            blankRow(tmpCounter++, ev, cols),
          ],
        });
        return;
      }

      const rows = flat.map((p) => {
        /* prefer the new Bonus array, fall back to the legacy 3 fields */
        const bonusMap = {};
        if (Array.isArray(p.Bonus) && p.Bonus.length) {
          p.Bonus.forEach((b) => { if (b && b.key) bonusMap[b.key] = Number(b.value) || 0; });
        } else {
          bonusMap.semi   = Number(p.SemiFinalistPoints) || 0;
          bonusMap.runner = Number(p.RunnersUpPoints)    || 0;
          bonusMap.winner = Number(p.WinnerPoints)       || 0;
        }
        cols.forEach((c) => { if (bonusMap[c.key] === undefined) bonusMap[c.key] = 0; });

        return {
          _tmpId:            tmpCounter++,
          PlayerName:        p.PlayerName || "",
          Event:             p.Category   || ev,
          TotalPointsScored: p.TotalPointsScored || 0,
          bonus:             bonusMap,
          TotalSpree:        p.TotalSpree || 0,
          Rank:              Number(p.Rank) || 0,
          Status:            p.Status || "Active",
          _saved:            true,
          _dbId:             p._id,
        };
      });

      setGrid(group._id, { rows: recalculate(rows), bonusCols: cols });
    } catch {
      setGrid(group._id, {
        bonusCols: bonusColsOf(group),
        rows: [blankRow(tmpCounter++, defaultEvent(group), bonusColsOf(group))],
      });
    } finally {
      setGridLoading((prev) => ({ ...prev, [group._id]: false }));
    }
  };

  /* ════ toggle accordion ══════════════════════ */
  const toggleExpand = (group) => {
    if (expandedId === group._id) { setExpandedId(null); return; }
    setExpandedId(group._id);
    loadPlayersIntoGrid(group);
  };

  /* ════ grid cell edit ════════════════════════ */
  const updateCell = (groupId, tmpId, field, value) => {
    setGrid(groupId, (cur) => ({
      ...cur,
      rows: recalculate(cur.rows.map((r) =>
        r._tmpId === tmpId ? { ...r, [field]: value, _saved: false } : r
      )),
    }));
  };

  /* edit one dynamic bonus column cell */
  const updateBonus = (groupId, tmpId, key, value) => {
    setGrid(groupId, (cur) => ({
      ...cur,
      rows: recalculate(cur.rows.map((r) =>
        r._tmpId === tmpId
          ? { ...r, bonus: { ...(r.bonus || {}), [key]: Number(value) || 0 }, _saved: false }
          : r
      )),
    }));
  };

  /* ════ add / delete player row ═══════════════ */
  const addPlayerRow = (groupId, group) => {
    /* the new blank row lands at the end — jump to the page that holds it */
    const nextCount = safe(getGrid(groupId).rows).length + 1;
    setGrid(groupId, (cur) => ({
      ...cur,
      rows: [...cur.rows, blankRow(tmpCounter++, defaultEvent(group), cur.bonusCols || DEFAULT_BONUS)],
    }));
    setGridPage((prev) => ({ ...prev, [groupId]: Math.ceil(nextCount / GRID_PAGE_SIZE) }));
  };

  /* ════ bonus columns — add / edit / remove from the grid toolbar ════ */
  const addBonusColDef = (groupId) =>
    setGrid(groupId, (cur) => ({
      ...cur,
      bonusCols: [
        ...(cur.bonusCols || DEFAULT_BONUS),
        { key: `col${Date.now().toString(36)}`, label: "" },
      ],
    }));

  const removeBonusColDef = (groupId, i) =>
    setGrid(groupId, (cur) => ({
      ...cur,
      bonusCols: (cur.bonusCols || DEFAULT_BONUS).filter((_, idx) => idx !== i),
    }));

  const setBonusColDef = (groupId, i, label) =>
    setGrid(groupId, (cur) => ({
      ...cur,
      bonusCols: (cur.bonusCols || DEFAULT_BONUS).map((c, idx) =>
        idx === i ? { ...c, label } : c
      ),
    }));

  const confirmDeleteRow = (groupId, row) => {
    setDelRowInfo({ groupId, tmpId: row._tmpId, dbId: row._dbId });
    setShowDelRow(true);
  };

  const handleDeleteRow = async () => {
    const { groupId, tmpId, dbId } = delRowInfo;
    if (dbId) {
      try {
        await axios.delete(`${API}/api/admin/deleteranking/${dbId}`);
      } catch { return alert("Failed to delete"); }
    }
    setGrid(groupId, (cur) => ({
      ...cur,
      rows: recalculate(cur.rows.filter((r) => r._tmpId !== tmpId)),
    }));
    setShowDelRow(false);
  };

  /* ════ SAVE ALL ══════════════════════════════ */
  const saveAll = async (group) => {
    const grid      = getGrid(group._id);
    const validRows = grid.rows.filter((r) => (r.PlayerName || "").trim());
    if (validRows.length === 0) return alert("Please add at least one player name.");

    setSaving(true);
    try {
      const cols = getGrid(group._id).bonusCols || bonusColsOf(group);
      const players = validRows.map((r) => ({
        PlayerName:        r.PlayerName.trim(),
        Category:          r.Event || defaultEvent(group),
        TotalPointsScored: Number(r.TotalPointsScored) || 0,
        Bonus:             cols.map((c) => ({
          key:   c.key,
          value: Number(r.bonus?.[c.key]) || 0,
        })),
        Status:            r.Status || "Active",
      }));

      /* keep the group's tab list + bonus columns in sync */
      const usedEvents = [...new Set(players.map((p) => p.Category))];
      const mergedCats = [...new Set([...safe(group.Categories), ...usedEvents])];
      const fd = new FormData();
      fd.append("id", group._id);
      fd.append("Categories", JSON.stringify(mergedCats));
      fd.append("BonusColumns", JSON.stringify(cols));
      await axios.put(`${API}/api/admin/editrankinggroup`, fd,
        { headers: { "content-type": "multipart/form-data" } });

      const res = await axios.post(
        `${API}/api/admin/ranking/bulk`,
        { players, Year: group.Year, GroupId: group._id },
        { headers: { "content-type": "application/json" } }
      );

      if (res.status === 200) {
        alert(`✅ ${validRows.length} players saved!`);
        await fetchGroups();
        loadPlayersIntoGrid({ ...group, Categories: mergedCats });
      }
    } catch (err) {
      alert(err?.response?.data?.msg || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ════ GROUP CRUD ════════════════════════════ */
  const resetGroup = () => {
    setGTitle("");
    setGYear(thisYear); setGCategories([]); setNewCat("");
    setGStatus("Active"); setGEditItem(null);
  };

  /* save just the category list of an EXISTING ranking, so adding / removing a
     category sticks immediately — even if the modal is closed without pressing Update */
  const persistCategories = async (groupId, list) => {
    try {
      const fd = new FormData();
      fd.append("id", groupId);
      fd.append("Categories", JSON.stringify(list));
      await axios.put(`${API}/api/admin/editrankinggroup`, fd,
        { headers: { "content-type": "multipart/form-data" } });
      await fetchGroups();
    } catch (err) {
      console.log(err);
      alert("Could not save the category. Please try again.");
    }
  };

  /* create a brand-new category — it becomes a chip, a tab and a dropdown option */
  const addCategory = () => {
    const name = newCat.trim();
    if (!name) return;
    setNewCat("");
    if (gCategories.includes(name)) return;
    const next = [...gCategories, name];
    setGCategories(next);
    if (gEditItem?._id) persistCategories(gEditItem._id, next);
  };

  const removeCategory = (c) => {
    const next = gCategories.filter((x) => x !== c);
    setGCategories(next);
    if (gEditItem?._id) persistCategories(gEditItem._id, next);
  };

  const handleGroupAdd = async () => {
    if (!gTitle) return alert("Tournament Name is required.");
    try {
      const fd = new FormData();
      fd.append("Title", gTitle);
      fd.append("Year", gYear);
      fd.append("Category", deriveSeries(gTitle));
      fd.append("Categories", JSON.stringify(gCategories));
      fd.append("Status", gStatus);
      const res = await axios.post(`${API}/api/admin/rankinggroup`, fd,
        { headers: { "content-type": "multipart/form-data" } });
      if (res.status === 200) {
        alert(res.data.success); fetchGroups(); setShowGroupAdd(false); resetGroup();
      }
    } catch (err) { alert(err?.response?.data?.msg || "Failed"); }
  };

  const openGroupEdit = (g) => {
    setGEditItem(g);
    setGTitle(g.Title ?? "");
    setGYear(g.Year ?? thisYear);
    setGCategories(safe(g.Categories));
    setGStatus(g.Status ?? "Active");
    setShowGroupEdit(true);
  };

  const handleGroupEdit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("id", gEditItem._id);
      fd.append("Title", gTitle);
      fd.append("Year", gYear);
      fd.append("Category", deriveSeries(gTitle));
      fd.append("Categories", JSON.stringify(gCategories));
      fd.append("Status", gStatus);
      const res = await axios.put(`${API}/api/admin/editrankinggroup`, fd,
        { headers: { "content-type": "multipart/form-data" } });
      if (res.status === 200) {
        alert("Updated"); fetchGroups(); setShowGroupEdit(false); resetGroup();
      }
    } catch (err) { alert(err?.response?.data?.msg || "Failed"); }
  };

  const handleGroupDel = async () => {
    try {
      await axios.delete(`${API}/api/admin/deleterankinggroup/${gDelId}`);
      alert("Deleted"); fetchGroups(); setShowGroupDel(false); setExpandedId(null);
    } catch (err) { alert(err?.response?.data?.msg || "Failed"); }
  };

  /* ════ hero banner (public Ranking Circuit page) ══════════ */
  const getHeroBanner = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/getrankingheroBanner`);
      if (res.status === 200) setAddHeroBanner(res.data.getheroBanner || []);
    } catch (e) { console.log(e); }
  };

  const addHeroBanner = async () => {
    if (!HeroImage) return alert("Please upload an image");
    if (!HeroTitle.trim()) return alert("Please enter a title");
    if (!HeroDescription.trim()) return alert("Please enter a description");
    try {
      const fd = new FormData();
      fd.append("HeroImage", HeroImage);
      fd.append("HeroTitle", HeroTitle);
      fd.append("HeroDescription", HeroDescription);
      const res = await axios.post(`${API}/api/admin/addrankingheroBanner`, fd,
        { headers: { "content-type": "multipart/form-data" } });
      if (res.status === 200) {
        alert(res.data.success);
        getHeroBanner();
        setShowHeroAdd(false);
        setHeroImage(""); setHeroTitle(""); setHeroDescription("");
      }
    } catch (err) { alert(err?.response?.data?.error || "Failed"); }
  };

  const editHeroBanner = async () => {
    if (!HeroTitle.trim()) return alert("Please enter a title");
    if (!HeroDescription.trim()) return alert("Please enter a description");
    try {
      const fd = new FormData();
      fd.append("id", editHeroItem._id);
      fd.append("HeroTitle", HeroTitle);
      fd.append("HeroDescription", HeroDescription);
      if (HeroImage) fd.append("HeroImage", HeroImage);
      const res = await axios.put(`${API}/api/admin/editrankingheroBanner`, fd,
        { headers: { "content-type": "multipart/form-data" } });
      if (res.status === 200) {
        alert(res.data.success);
        getHeroBanner();
        setShowHeroEdit(false);
        setHeroImage(""); setHeroTitle(""); setHeroDescription(""); setEditHeroItem(null);
      }
    } catch (err) { alert(err?.response?.data?.error || "Failed"); }
  };

  const deleteHeroBanner = async () => {
    try {
      const res = await axios.delete(`${API}/api/admin/deleterankingheroBanner/${deleteHeroId}`);
      if (res.status === 200) { alert(res.data.success); getHeroBanner(); setShowHeroDel(false); }
    } catch (err) { alert(err?.response?.data?.error || "Failed"); }
  };

  useEffect(() => { getHeroBanner(); }, []);

  /* ── group form (shared by add + edit) ── */
  const GroupForm = (
    <div className="row g-3">
      <div className="col-md-12">
        <div className="do-sear">
          <label>Tournament Name <span style={{ color: "red" }}>*</span></label>
          <Form.Select className="vi_0" value={gTitle}
            onChange={(e) => setGTitle(e.target.value)}>
            {/* keeps any older custom name visible + selected instead of silently resetting it */}
            {!TOURNAMENT_TYPES.includes(gTitle) && (
              <option value={gTitle}>{gTitle || "Select tournament…"}</option>
            )}
            {TOURNAMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Form.Select>
        </div>
      </div>
      <div className="col-md-12">
        <div className="do-sear">
          <label>Status</label>
          <Form.Select className="vi_0" value={gStatus} onChange={(e) => setGStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Form.Select>
        </div>
      </div>
      <div className="col-md-12">
        <div className="do-sear">
          <label>Categories <span style={{ color: "#888", fontWeight: 400 }}>(tabs on the leaderboard)</span></label>
          <div className="rk-cat-chips">
            {gCategories.length === 0 && (
              <span style={{ fontSize: 12.5, color: "#94a3b8" }}>
                No categories yet — create your first one below.
              </span>
            )}
            {gCategories.map((c) => (
              <span className="rk-cat-chip on" key={c}>
                {c}
                <button type="button" className="rk-cat-x"
                  title="Remove this category"
                  onClick={() => removeCategory(c)}>✕</button>
              </span>
            ))}
          </div>

          {/* create a new category */}
          <div className="rk-cat-add">
            <input
              type="text"
              className="vi_0"
              value={newCat}
              placeholder="Create a new category…"
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addCategory(); }
              }}
            />
            <button type="button" className="rk-grid-btn rk-grid-btn-ghost"
              onClick={addCategory}>
              <FaPlus style={{ marginRight: 4 }} /> Create Category
            </button>
          </div>

          <small style={{ color: "#888" }}>
            These become the tabs on the leaderboard and the options in the grid's
            <strong> Category</strong> dropdown.{" "}
            {gEditItem
              ? "Changes are saved instantly."
              : "They are saved when you click Create."}
          </small>
        </div>
      </div>
    </div>
  );

  /* ════════════════ RENDER ════════════════════ */
  return (
    <div>
      <div className="customerhead p-2">

        {/* ── tabs ── */}
        <div className="d-flex gap-3 mb-3">
          <Button onClick={() => setHeroBannerTab(false)}>Rankings</Button>
          <Button onClick={() => setHeroBannerTab(true)}>Hero Banner</Button>
        </div>

        {!heroBannerTab && (<>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h2 className="header-c" style={{ display: "flex", alignItems: "center", gap: 10, margin: 0 }}>
            <FaTrophy style={{ color: "#e31e24" }} /> Ranking Circuit
          </h2>
          <button className="admin-add-btn"
            onClick={() => { resetGroup(); setShowGroupAdd(true); }}>
            <FaPlus style={{ marginRight: 6 }} /> New Ranking
          </button>
        </div>

        <div className="rk-admin-banner">
          <MdAutoAwesome style={{ fontSize: 20, color: "#0b2fae", flexShrink: 0 }} />
          <span>
            Enter each player's points — <strong>Total Score and Final Rank are calculated automatically</strong>.
            Total Score = (Total Points + Semi + Runner-Up + Winner) ÷ 10. Click <strong>Save Rankings</strong> when done.
          </span>
        </div>

        {groups.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#aaa" }}>
            <FaTrophy style={{ fontSize: 44, display: "block", margin: "0 auto 12px", color: "#e0e4f0" }} />
            <p>No rankings yet. Click <strong>New Ranking</strong> to create one.</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {groups.map((group) => {
            const isOpen  = expandedId === group._id;
            const grid    = getGrid(group._id);
            const rows    = grid.rows;
            const unsaved = rows.some((r) => !r._saved && (r.PlayerName || "").trim());
            const opts      = eventOptions(group);
            const bonusCols = grid.bonusCols || bonusColsOf(group);

            /* ── pagination — 20 rows per page ── */
            const totalPages = Math.max(1, Math.ceil(rows.length / GRID_PAGE_SIZE));
            const page       = Math.min(gridPage[group._id] || 1, totalPages);
            const pageRows   = rows.slice((page - 1) * GRID_PAGE_SIZE, page * GRID_PAGE_SIZE);
            const goPage     = (p) => setGridPage((prev) => ({ ...prev, [group._id]: p }));

            return (
              <div key={group._id} className={`rk-admin-card${isOpen ? " open" : ""}`}>

                {/* header row */}
                <div className="rk-admin-card-header" onClick={() => toggleExpand(group)}>
                  <div style={{ width: 60, height: 46, borderRadius: 7, overflow: "hidden",
                    flexShrink: 0, background: "#eef2ff", display: "flex",
                    alignItems: "center", justifyContent: "center" }}>
                    {group.GroupImage ? (
                      <img src={`${API}/Rankings/${group.GroupImage}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                    ) : <FaTrophy style={{ color: "#c5d0f5", fontSize: 18 }} />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 900, fontSize: 15, color: "#031b77",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {cardTitle(group)}
                      {unsaved && <span style={{ background: "#fef3c7", color: "#92400e",
                        fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "2px 8px",
                        marginLeft: 8 }}>Unsaved changes</span>}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap" }}>
                    {[
                      { v: group.Year, bg: "#eef2ff", c: "#031b77" },
                      { v: group.Category, bg: "#f0f4ff", c: "#031b77" },
                      { v: group.Status,
                        bg: group.Status === "Active" ? "#dcfce7" : "#fee2e2",
                        c: group.Status === "Active" ? "#16a34a" : "#dc2626" },
                      { v: `${isOpen ? rows.filter(r => (r.PlayerName||"").trim()).length : "…"} players`,
                        bg: "#f5f5f5", c: "#666" },
                    ].map((b, i) => (
                      <span key={i} style={{ background: b.bg, color: b.c, borderRadius: 20,
                        padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{b.v}</span>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}
                    onClick={(e) => e.stopPropagation()}>
                    <BiSolidEdit className="text-success" style={{ fontSize: 18, cursor: "pointer" }}
                      onClick={() => openGroupEdit(group)} />
                    <AiFillDelete className="text-danger" style={{ fontSize: 18, cursor: "pointer" }}
                      onClick={() => { setGDelId(group._id); setShowGroupDel(true); }} />
                  </div>

                  <div style={{ color: "#031b77", fontSize: 16, flexShrink: 0 }}>
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>

                {/* ── expanded grid ────────────── */}
                {isOpen && (
                  <div style={{ padding: "18px 16px" }}>

                    <div className="rk-grid-toolbar">
                      <div className="rk-cols-bar">
                        <span className="rk-cols-bar-label">Column Name:</span>

                        {bonusCols.length === 0 && (
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>
                            none — only Total Points Scored is shown
                          </span>
                        )}

                        {bonusCols.map((c, ci) => (
                          <span className="rk-col-chip" key={c.key}>
                            <input
                              type="text"
                              className="rk-col-label"
                              value={c.label}
                              placeholder="e.g. 5 for Semi Finalists"
                              title="Full column name"
                              style={{ width: Math.max(170, (c.label || "").length * 8 + 36) }}
                              onChange={(e) => setBonusColDef(group._id, ci, e.target.value)}
                            />
                            <button type="button" className="rk-col-del"
                              title="Remove this column"
                              onClick={() => removeBonusColDef(group._id, ci)}>
                              ✕
                            </button>
                          </span>
                        ))}

                        <button className="rk-grid-btn rk-grid-btn-outline"
                          onClick={() => addBonusColDef(group._id)}>
                          <FaPlus style={{ marginRight: 4 }} /> Add Column
                        </button>
                      </div>

                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="rk-grid-btn rk-grid-btn-ghost"
                          onClick={() => addPlayerRow(group._id, group)}>
                          <FaUserPlus style={{ marginRight: 4 }} /> Add Row
                        </button>
                        <button className="rk-grid-btn rk-grid-btn-save"
                          onClick={() => saveAll(group)}
                          disabled={saving}>
                          <FaSave style={{ marginRight: 5 }} />
                          {saving ? "Saving…" : "Save Rankings"}
                        </button>
                      </div>
                    </div>

                    {gridLoading[group._id] ? (
                      <div style={{ textAlign: "center", padding: "32px", color: "#888" }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
                        <p style={{ margin: 0, fontSize: 14 }}>Loading players…</p>
                      </div>
                    ) : (
                      <>
                        <div className="rk-grid-wrap">
                          <table className="rk-grid-table">
                            <thead>
                              <tr>
                                <th className="rk-th-rank">Final Rank</th>
                                <th className="rk-th-name">Name <span style={{ color: "#f87171" }}>*</span></th>
                                <th className="rk-th-event">Category</th>
                                <th className="rk-th-pts">Total Points Scored</th>
                                {bonusCols.map((c) => (
                                  <th key={c.key} className="rk-th-pts" title={c.label}>
                                    {c.label || "—"}
                                  </th>
                                ))}
                                <th className="rk-th-spree">Total Score</th>
                                <th className="rk-th-status">Status</th>
                                <th className="rk-th-del"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {pageRows.map((row) => {
                                const rankColor =
                                  row.Rank === 1 ? "#B7860B" :
                                  row.Rank === 2 ? "#607080" :
                                  row.Rank === 3 ? "#8B5A2B" : "#031b77";

                                return (
                                  <tr key={row._tmpId}
                                    className={`rk-grid-row${row.Rank <= 3 && (row.PlayerName||"").trim() ? " rk-top3" : ""}`}>

                                    <td className="rk-td-rank">
                                      {(row.PlayerName || "").trim() ? (
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                                          {row.Rank <= 3 && <FaMedal style={{ color: rankColor, fontSize: 13 }} />}
                                          <span style={{ fontWeight: 900, color: rankColor, fontSize: 16 }}>
                                            {row.Rank}
                                          </span>
                                        </div>
                                      ) : <span style={{ color: "#ccc", display: "block", textAlign: "center" }}>—</span>}
                                    </td>

                                    <td className="rk-td-name">
                                      <input className="rk-cell-input rk-input-name"
                                        value={row.PlayerName}
                                        placeholder="Player name…"
                                        onChange={(e) => updateCell(group._id, row._tmpId, "PlayerName", e.target.value)} />
                                    </td>

                                    <td>
                                      <select className="rk-cell-input rk-select-event"
                                        value={row.Event}
                                        disabled={opts.length === 0}
                                        onChange={(e) => updateCell(group._id, row._tmpId, "Event", e.target.value)}>
                                        {opts.length === 0
                                          ? <option value="">No categories yet</option>
                                          : opts.map((c) => <option key={c} value={c}>{c}</option>)}
                                      </select>
                                    </td>

                                    <td className="rk-td-pts">
                                      <input className="rk-cell-input rk-input-pts" type="number" min="0"
                                        value={row.TotalPointsScored || ""}
                                        placeholder="0"
                                        onChange={(e) => updateCell(group._id, row._tmpId, "TotalPointsScored", Number(e.target.value) || 0)} />
                                    </td>

                                    {bonusCols.map((c) => (
                                      <td key={c.key} className="rk-td-pts">
                                        <input className="rk-cell-input rk-input-pts" type="number" min="0"
                                          value={row.bonus?.[c.key] || ""}
                                          placeholder="0"
                                          onChange={(e) => updateBonus(group._id, row._tmpId, c.key, e.target.value)} />
                                      </td>
                                    ))}

                                    <td className="rk-td-total">
                                      <span className="rk-spree-chip">
                                        {Number.isInteger(row.TotalSpree) ? row.TotalSpree : row.TotalSpree.toFixed(1)}
                                      </span>
                                    </td>

                                    <td>
                                      <select className="rk-cell-input rk-select-status"
                                        value={row.Status}
                                        onChange={(e) => updateCell(group._id, row._tmpId, "Status", e.target.value)}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                      </select>
                                    </td>

                                    <td className="rk-td-del">
                                      <AiFillDelete className="text-danger"
                                        style={{ cursor: "pointer", fontSize: 16 }}
                                        onClick={() => confirmDeleteRow(group._id, row)} />
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* ── pagination (only when there is more than one page) ── */}
                        {totalPages > 1 && (
                          <div className="rk-pager">
                            <span className="rk-pager-info">
                              Showing {(page - 1) * GRID_PAGE_SIZE + 1}–{Math.min(page * GRID_PAGE_SIZE, rows.length)} of {rows.length}
                            </span>
                            <div className="rk-pager-btns">
                              <button className="rk-page-btn" disabled={page === 1}
                                onClick={() => goPage(page - 1)}>‹ Prev</button>

                              {pageItems(page, totalPages).map((it, i) =>
                                it === "…" ? (
                                  <span className="rk-page-dots" key={`dots-${i}`}>…</span>
                                ) : (
                                  <button key={it}
                                    className={`rk-page-btn${it === page ? " active" : ""}`}
                                    onClick={() => goPage(it)}>{it}</button>
                                )
                              )}

                              <button className="rk-page-btn" disabled={page === totalPages}
                                onClick={() => goPage(page + 1)}>Next ›</button>
                            </div>
                          </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                          <span style={{ fontSize: 12.5, color: "#888" }}>
                            💡 Rank and Total Score update live as you type. Click <strong>Save Rankings</strong> to publish.
                          </span>
                          <button className="rk-grid-btn rk-grid-btn-save"
                            onClick={() => saveAll(group)}
                            disabled={saving}>
                            <FaSave style={{ marginRight: 5 }} />
                            {saving ? "Saving…" : `Save Rankings (${rows.filter(r => (r.PlayerName||"").trim()).length} players)`}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </>)}

        {/* ═══ RANKING HERO BANNER ════════════════ */}
        {heroBannerTab && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="header-c">Ranking Circuit Hero Banner</h2>
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
                        src={`${API}/RankingHeroBanner/${item.HeroImage}`}
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
                <Modal.Title>Add Ranking Hero Banner</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="do-sear mt-2">
                  <label>Banner Image <span style={{ color: "red" }}>*</span></label>
                  <input type="file" accept="image/*" className="vi_0"
                    onChange={(e) => setHeroImage(e.target.files[0])} />
                </div>
                <div className="do-sear mt-2">
                  <label>Title <span style={{ color: "red" }}>*</span></label>
                  <input type="text" className="vi_0" placeholder="e.g. RANKING CIRCUIT"
                    value={HeroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
                </div>
                <div className="do-sear mt-2">
                  <label>Description <span style={{ color: "red" }}>*</span></label>
                  <input type="text" className="vi_0" placeholder="e.g. Official Shuttle Smash Player Rankings"
                    value={HeroDescription} onChange={(e) => setHeroDescription(e.target.value)} />
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
                <Modal.Title>Edit Ranking Hero Banner</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="do-sear mt-2">
                  <label>Banner Image <small className="text-muted">(leave empty to keep current)</small></label>
                  <input type="file" accept="image/*" className="vi_0"
                    onChange={(e) => setHeroImage(e.target.files[0])} />
                  {editHeroItem?.HeroImage && !HeroImage && (
                    <Image
                      src={`${API}/RankingHeroBanner/${editHeroItem.HeroImage}`}
                      alt="current"
                      style={{ marginTop: "8px", height: "60px", borderRadius: "4px" }}
                    />
                  )}
                </div>
                <div className="do-sear mt-2">
                  <label>Title <span style={{ color: "red" }}>*</span></label>
                  <input type="text" className="vi_0"
                    value={HeroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
                </div>
                <div className="do-sear mt-2">
                  <label>Description <span style={{ color: "red" }}>*</span></label>
                  <input type="text" className="vi_0"
                    value={HeroDescription} onChange={(e) => setHeroDescription(e.target.value)} />
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

        {/* ═══ GROUP MODALS ═══════════════════════ */}
        <Modal show={showGroupAdd} onHide={() => { setShowGroupAdd(false); resetGroup(); }}
          size="lg" style={{ zIndex: 99999 }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "#031b77", fontWeight: 800 }}>
              <FaPlus style={{ marginRight: 8, color: "#e31e24" }} /> New Ranking
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{GroupForm}</Modal.Body>
          <Modal.Footer>
            <Button variant="" className="modal-close-btn"
              onClick={() => { setShowGroupAdd(false); resetGroup(); }}>Close</Button>
            <Button variant="" className="modal-add-btn" onClick={handleGroupAdd}>Create</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showGroupEdit} onHide={() => { setShowGroupEdit(false); resetGroup(); }}
          size="lg" style={{ zIndex: 99999 }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "#031b77", fontWeight: 800 }}>
              <BiSolidEdit style={{ marginRight: 8, color: "#22c55e" }} /> Edit Ranking
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {GroupForm}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="" className="modal-close-btn"
              onClick={() => { setShowGroupEdit(false); resetGroup(); }}>Close</Button>
            <Button variant="" className="modal-add-btn" onClick={handleGroupEdit}>Update</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showGroupDel} onHide={() => setShowGroupDel(false)} style={{ zIndex: 99999 }}>
          <Modal.Header closeButton><Modal.Title>Warning</Modal.Title></Modal.Header>
          <Modal.Body>
            <p className="fs-5" style={{ color: "red" }}>
              Delete this ranking card?<br />
              <small>The players inside it will be kept but will no longer appear.</small>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="" className="modal-close-btn" onClick={() => setShowGroupDel(false)}>Close</Button>
            <Button variant="" className="modal-add-btn" onClick={handleGroupDel}>Delete</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDelRow} onHide={() => setShowDelRow(false)} style={{ zIndex: 99999 }}>
          <Modal.Header closeButton><Modal.Title>Remove player?</Modal.Title></Modal.Header>
          <Modal.Body>
            <p style={{ color: "red" }}>Remove this player row from the ranking?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="" className="modal-close-btn" onClick={() => setShowDelRow(false)}>Cancel</Button>
            <Button variant="" className="modal-add-btn" onClick={handleDeleteRow}>Remove</Button>
          </Modal.Footer>
        </Modal>

      </div>
    </div>
  );
};

export default AdminRanking;
