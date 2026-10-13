import { useEffect, useState, useMemo, useCallback } from "react";
import { Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaArrowLeft, FaTrophy, FaMedal, FaSearch } from "react-icons/fa";
import { GiShuttlecock } from "react-icons/gi";
import "../Styles/ranking.css";

const API = process.env.REACT_APP_API_URL;

/* 81.4 -> "81.4"   |   70 -> "70" */
const fmtSpree = (v) => {
  const n = Number(v) || 0;
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
};
const fmtInt = (v) => {
  const n = Number(v) || 0;
  return n === 0 ? "" : n.toLocaleString();
};

/* bonus columns shown when a ranking has none configured yet.
   The label IS the full column header. */
const DEFAULT_BONUS = [
  { key: "semi",   label: "5 for Semi Finalists" },
  { key: "runner", label: "10 for RunnersUp" },
  { key: "winner", label: "20 for Winner" },
];
const bonusColsOf = (group) =>
  (Array.isArray(group?.BonusColumns) && group.BonusColumns.length)
    ? group.BonusColumns
    : DEFAULT_BONUS;
const bonusValueOf = (player, key) => {
  const b = (player.Bonus || []).find((x) => x && x.key === key);
  return b ? Number(b.value) || 0 : 0;
};

/* rows shown per page on the leaderboard */
const PAGE_SIZE = 20;

/* page numbers to render — always keeps first, last and the current page,
   collapsing the gaps into "…" (e.g. 1 … 4 5 6 … 20) */
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

const RankingDetail = () => {
  const { groupId: groupIdParam, year, category } = useParams();
  const navigate = useNavigate();

  const [groupId,    setGroupId]    = useState(groupIdParam || null);
  const [group,      setGroup]      = useState(null);
  const [byCategory, setByCategory] = useState({});
  const [loading,    setLoading]    = useState(true);
  const [activeCat,  setActiveCat]  = useState(null);
  const [search,     setSearch]     = useState("");
  const [page,       setPage]       = useState(1);

  useEffect(() => {
    Aos.init({ once: true });
    window.scroll(0, 0);
  }, []);

  /* ── resolve the group id (supports the legacy /ranking/:year/:category) ── */
  useEffect(() => {
    if (groupIdParam) { setGroupId(groupIdParam); return; }
    let cancelled = false;
    (async () => {
      try {
        const res    = await axios.get(`${API}/api/admin/activerankinggroups`);
        const groups = Array.isArray(res?.data?.groups) ? res.data.groups : [];
        const cat    = category ? decodeURIComponent(category) : "";
        const match  = groups.find(
          (g) =>
            String(g.Year) === String(year) &&
            (g.Category === cat || (g.Categories || []).includes(cat))
        );
        if (!cancelled) setGroupId(match ? match._id : null);
      } catch {
        if (!cancelled) setGroupId(null);
      }
    })();
    return () => { cancelled = true; };
  }, [groupIdParam, year, category]);

  /* ── fetch the leaderboard ── */
  const fetchData = useCallback(async () => {
    if (!groupId) { setLoading(false); return; }
    setLoading(true);
    try {
      const res  = await axios.get(`${API}/api/admin/getrankings/group/${groupId}`);
      const data = res?.data?.rankings || {};
      setGroup(res?.data?.group || null);
      setByCategory(data);
      const cats = Object.keys(data);
      setActiveCat(cats.length ? cats[0] : null);
    } catch {
      setGroup(null);
      setByCategory({});
      setActiveCat(null);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const categories = useMemo(() => Object.keys(byCategory), [byCategory]);
  const bonusCols  = useMemo(() => bonusColsOf(group), [group]);

  /* one category's players, ranked — SL NO + rank attached before search filtering */
  const catRows = useCallback((cat) =>
    (byCategory[cat] || [])
      .slice()
      .sort((a, b) => (Number(a.Rank) || 0) - (Number(b.Rank) || 0))
      .map((p, i) => ({ ...p, _rank: Number(p.Rank) || i + 1, _sl: i + 1 })),
    [byCategory]);

  /* the selected category's players; SL NO is attached BEFORE search filtering */
  const baseRows = useMemo(
    () => catRows(activeCat).map((p, i) => ({ ...p, _sl: i + 1 })),
    [catRows, activeCat]
  );

  const rows = useMemo(() => {
    const n = search.trim().toLowerCase();
    return n
      ? baseRows.filter((p) => (p.PlayerName || "").toLowerCase().includes(n))
      : baseRows;
  }, [baseRows, search]);

  const rowCount = rows.length;

  /* ── pagination ── */
  const totalPages = Math.max(1, Math.ceil(rowCount / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageRows   = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  /* back to page 1 whenever the category or the search term changes */
  useEffect(() => { setPage(1); }, [activeCat, search]);

  /* keep the view on a real page if the list shrinks */
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  /* rank cell — medal badge for the top 3, plain number for the rest */
  const rankCell = (rank) => {
    const n = Number(rank);
    if (!n) return <span className="sp-rank-plain">—</span>;
    if (n > 3) return <span className="sp-rank-plain">{n}</span>;
    const Icon = n === 1 ? FaTrophy : FaMedal;
    return (
      <span className={`sp-rank-badge sp-rb-${n}`}>
        <span className="sp-rb-icon"><Icon /></span>
        <span className="sp-rb-num">{n}</span>
      </span>
    );
  };

  const playerRows = (list, detailed) =>
    list.map((p, i) => {
      const rank = Number(p._rank);
      return (
        <tr key={p._id || i}
          className={`sp-row${rank <= 3 ? " sp-top3" : ""}${i % 2 === 1 ? " sp-alt" : ""}`}>
          <td className="sp-td-sl">{p._sl}</td>
          <td className="sp-td-name"><span className="sp-name" title={p.PlayerName}>{p.PlayerName}</span></td>
          <td className="sp-td-num">{fmtInt(p.TotalPointsScored)}</td>
          {detailed && bonusCols.map((c) => (
            <td key={c.key} className="sp-td-num">{fmtInt(bonusValueOf(p, c.key))}</td>
          ))}
          <td className="sp-td-spree">{fmtSpree(p.TotalSpree)}</td>
          <td className="sp-td-rank">{rankCell(p._rank)}</td>
        </tr>
      );
    });

  return (
    <div className="sp-page">

      {/* Floating WhatsApp */}
      <div className="fixed-icon">
        <a href="https://wa.link/5s5pya" target="_blank" rel="noopener noreferrer"
          style={{ color: "unset", textDecoration: "none" }}>
          <span className="fixed-icon-rings" />
          <IoLogoWhatsapp style={{ color: "white", fontSize: "34px",
            display: "block", position: "relative", zIndex: 4 }} />
        </a>
      </div>

      {/* top bar */}
      <div className="sp-topbar">
        <button className="sp-back-btn" onClick={() => navigate("/ranking")}>
          <FaArrowLeft /> Back to Rankings
        </button>
      </div>

      <Container fluid style={{ paddingLeft: 20, paddingRight: 20, maxWidth: 1180, margin: "0 auto" }}>

        {loading && (
          <div className="rk-center-state">
            <GiShuttlecock className="rk-spin-icon" />
            <p>Loading leaderboard…</p>
          </div>
        )}

        {!loading && !groupId && (
          <div className="rk-center-state">
            <FaTrophy style={{ fontSize: 52, color: "#e0e4f0", display: "block", margin: "0 auto 16px" }} />
            <p>This leaderboard could not be found.</p>
            <button className="rk-back-pill" onClick={() => navigate("/ranking")}>
              <FaArrowLeft /> Back to Rankings
            </button>
          </div>
        )}

        {!loading && groupId && (
          <div className="sp-card" data-aos="fade-up" data-aos-duration="600">

            {/* ── card header ─────────────────────── */}
            <div className="sp-card-head">
              <img src={`${process.env.PUBLIC_URL}/Assets/logo.png`} alt="Shuttle Smash" className="sp-logo" />
              <h1 className="sp-head-cat">CATEGORY-WISE RANKING</h1>
              <h2 className="sp-head-series">
                {(group?.Category || "Shuttle Smash").toUpperCase()} BADMINTON LEADERBOARD
              </h2>
              <p className="sp-head-note">
                SCORES WILL BE UPDATED TO PLAYERS AFTER EVERY TOURNAMENT
              </p>
            </div>

            {/* ── toolbar ─────────────────────────── */}
            <div className="sp-toolbar">
              <span className="sp-count">
                {rowCount} {rowCount === 1 ? "player" : "players"}
              </span>
              <div className="sp-search-wrap">
                <FaSearch className="sp-search-icon" />
                <input
                  type="text"
                  className="sp-search"
                  placeholder="Search player…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* ══ the selected category's detailed table ══ */}
            <div className="sp-table-wrap">
              <table className="sp-table">
                <thead>
                  <tr>
                    <th className="sp-th-sl">SL NO</th>
                    <th className="sp-th-name">NAME</th>
                    <th>Total Points Scored</th>
                    {bonusCols.map((c) => (
                      <th key={c.key} title={c.label}>
                        {c.label || "—"}
                      </th>
                    ))}
                    <th>Total Score</th>
                    <th>FINAL RANK</th>
                  </tr>
                </thead>
                <tbody>
                  {rowCount === 0 ? (
                    <tr><td colSpan={5 + bonusCols.length} className="sp-empty">
                      {search ? `No players match "${search}"` : "No players added yet."}
                    </td></tr>
                  ) : playerRows(pageRows, true)}
                </tbody>
              </table>
            </div>

            {/* ── pagination (only when there is more than one page) ── */}
            {totalPages > 1 && (
              <div className="sp-pager">
                <span className="sp-pager-info">
                  Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, rowCount)} of {rowCount}
                </span>

                <div className="sp-pager-btns">
                  <button
                    className="sp-page-btn"
                    disabled={safePage === 1}
                    onClick={() => setPage(safePage - 1)}
                  >
                    ‹ Prev
                  </button>

                  {pageItems(safePage, totalPages).map((it, i) =>
                    it === "…" ? (
                      <span className="sp-page-dots" key={`dots-${i}`}>…</span>
                    ) : (
                      <button
                        key={it}
                        className={`sp-page-btn${it === safePage ? " active" : ""}`}
                        onClick={() => setPage(it)}
                      >
                        {it}
                      </button>
                    )
                  )}

                  <button
                    className="sp-page-btn"
                    disabled={safePage === totalPages}
                    onClick={() => setPage(safePage + 1)}
                  >
                    Next ›
                  </button>
                </div>
              </div>
            )}

            {/* ── bottom tabs: one per category ── */}
            <div className="sp-tabs">
              {categories.length === 0 ? (
                <span className="sp-tabs-empty">No categories added yet</span>
              ) : categories.map((c) => (
                <button
                  key={c}
                  className={`sp-tab${activeCat === c ? " active" : ""}`}
                  onClick={() => { setActiveCat(c); setSearch(""); }}
                >
                  {c.toUpperCase()}
                </button>
              ))}
            </div>

          </div>
        )}
      </Container>
    </div>
  );
};

export default RankingDetail;
