"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PlayerProfile } from "@/lib/types";

/* ─────────────────────────────────────────────────────────
   Icons
───────────────────────────────────────────────────────── */

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AwardIcon({ icon }: { icon: PlayerProfile["awards"][0]["icon"] }) {
  if (icon === "trophy")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3" />
        <path d="M18 9h3a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-3" />
        <path d="M6 4h12v9a6 6 0 0 1-12 0V4Z" />
        <path d="M12 19v3" /><path d="M8 22h8" />
      </svg>
    );
  if (icon === "star")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  if (icon === "crown")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 19h20" /><path d="M2 5l4 7 6-9 6 9 4-7v14H2z" />
      </svg>
    );
  if (icon === "shield")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

/* Team monogram badge used in transactions */
function TeamBadge({ monogram }: { monogram: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    NYY: { bg: "#003087", text: "#ffffff" },
    HOU: { bg: "#eb6e1f", text: "#ffffff" },
    PIT: { bg: "#fdb827", text: "#27251f" },
    BOS: { bg: "#bd3039", text: "#ffffff" },
    SD:  { bg: "#2f241d", text: "#ffc425" },
    MIN: { bg: "#002b5c", text: "#ffffff" },
    MIA: { bg: "#00a3e0", text: "#ffffff" },
  };
  const c = colors[monogram] ?? { bg: "#6b7280", text: "#ffffff" };
  return (
    <span className="psp-tx-badge" style={{ background: c.bg, color: c.text }}>
      {monogram}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   Bio sidebar
───────────────────────────────────────────────────────── */

function BioPanel({
  player,
  isBasketball,
}: {
  player: PlayerProfile;
  isBasketball: boolean;
}) {
  return (
    <div className="psp-profile-bio">
      <div className="psp-bio-grid">
        <div className="psp-bio-row">
          <span className="psp-bio-label">Full Name</span>
          <span className="psp-bio-value">{player.fullName}</span>
        </div>
        {player.nickname && (
          <div className="psp-bio-row">
            <span className="psp-bio-label">Nickname</span>
            <span className="psp-bio-value">{player.nickname}</span>
          </div>
        )}
        <div className="psp-bio-row">
          <span className="psp-bio-label">Born</span>
          <span className="psp-bio-value">{player.born}</span>
          <span className="psp-bio-value psp-bio-value--sub">{player.hometown}</span>
        </div>
        {player.draft && (
          <div className="psp-bio-row">
            <span className="psp-bio-label">Draft</span>
            <span className="psp-bio-value">{player.draft}</span>
          </div>
        )}
        {player.college && (
          <div className="psp-bio-row">
            <span className="psp-bio-label">College</span>
            <span className="psp-bio-value">{player.college}</span>
          </div>
        )}
        <div className="psp-bio-row">
          <span className="psp-bio-label">{isBasketball ? "NBA Debut" : "MLB Debut"}</span>
          <span className="psp-bio-value">{player.debut}</span>
        </div>
        <div className="psp-bio-row psp-bio-row--last">
          <span className="psp-bio-label">Follow</span>
          <div className="psp-bio-social">
            <a href="#" className="psp-bio-social__link" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" className="psp-bio-social__link" aria-label="X (Twitter)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>
      </div>
      <button type="button" className="psp-bio-more-btn">View More Bio Info</button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Merged profile + summary stats card
───────────────────────────────────────────────────────── */

function ProfileSummaryCard({
  player,
  isBasketball,
  statMode,
  onStatModeChange,
}: {
  player: PlayerProfile;
  isBasketball: boolean;
  statMode: "batting" | "pitching";
  onStatModeChange: (mode: "batting" | "pitching") => void;
}) {
  return (
    <section className="psp-profile-card">
      <div className="psp-profile-card__layout">
        <BioPanel player={player} isBasketball={isBasketball} />

        <div className="psp-profile-card__stats">
          {!isBasketball && (
            <div className="psp-profile-card__toolbar">
              <div className="psp-toggle-wrap">
                <button
                  type="button"
                  className={`psp-toggle${statMode === "batting" ? " psp-toggle--active" : ""}`}
                  onClick={() => onStatModeChange("batting")}
                >
                  Batting
                </button>
                <button
                  type="button"
                  className={`psp-toggle${statMode === "pitching" ? " psp-toggle--active" : ""}`}
                  onClick={() => onStatModeChange("pitching")}
                >
                  Pitching
                </button>
              </div>
            </div>
          )}

          <StatSummaryTable player={player} />

          <div className="psp-status-line">
            <span><strong>Status:</strong> {player.status}</span>
            {player.nextGame && (
              <>
                <span className="psp-status-line__sep">|</span>
                <span><strong>Next Game:</strong> {player.nextGame}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Summary stat table (quick panel)
───────────────────────────────────────────────────────── */

function StatSummaryTable({ player }: { player: PlayerProfile }) {
  return (
    <div className="psp-summary-table-wrap">
      <table className="psp-summary-table">
        <thead>
          <tr>
            <th className="psp-summary-table__th psp-summary-table__th--year">YEAR</th>
            {player.summaryLabels.map((lbl) => (
              <th key={lbl} className="psp-summary-table__th">{lbl}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="psp-summary-table__td psp-summary-table__td--label">Current Season</td>
            {player.summaryCurrentSeason.map((val, i) => (
              <td key={i} className="psp-summary-table__td">{val}</td>
            ))}
          </tr>
          <tr>
            <td className="psp-summary-table__td psp-summary-table__td--label">Career</td>
            {player.summaryCareer.map((val, i) => (
              <td key={i} className="psp-summary-table__td">{val}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Career stat tables
───────────────────────────────────────────────────────── */

function BasketballCareerTable({ player }: { player: PlayerProfile }) {
  const [showAll, setShowAll] = useState(false);
  const rows = player.careerStats ?? [];
  const visible = showAll ? rows : rows.slice(0, 7);

  return (
    <div className="psp-career-section">
      <h3 className="psp-section-title">Career Statistics</h3>
      <div className="psp-table-scroll">
        <table className="psp-table">
          <thead>
            <tr>
              {["SEASON","TEAM","LG","G","GS","MPG","FGM-A","FG%","3PM-A","3P%","FTM-A","FT%","RPG","APG","SPG","BPG","TOV","PPG"].map((h) => (
                <th key={h} className={`psp-table__th${["SEASON","TEAM","LG"].includes(h) ? " psp-table__th--left" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={i} className="psp-table__tr">
                <td className="psp-table__td psp-table__td--season">{row.season}</td>
                <td className="psp-table__td psp-table__td--team">{row.team}</td>
                <td className="psp-table__td psp-table__td--left">{row.league}</td>
                <td className="psp-table__td">{row.g}</td>
                <td className="psp-table__td">{row.gs}</td>
                <td className="psp-table__td">{row.mpg}</td>
                <td className="psp-table__td">{row.fgm}-{row.fga}</td>
                <td className="psp-table__td psp-table__td--accent">{row.fg_pct}</td>
                <td className="psp-table__td">{row.thpm}-{row.thpa}</td>
                <td className="psp-table__td">{row.thp_pct}</td>
                <td className="psp-table__td">{row.ftm}-{row.fta}</td>
                <td className="psp-table__td">{row.ft_pct}</td>
                <td className="psp-table__td">{row.rpg}</td>
                <td className="psp-table__td">{row.apg}</td>
                <td className="psp-table__td">{row.spg}</td>
                <td className="psp-table__td">{row.bpg}</td>
                <td className="psp-table__td">{row.topg}</td>
                <td className="psp-table__td psp-table__td--accent">{row.ppg}</td>
              </tr>
            ))}
            <tr className="psp-table__tr psp-table__tr--career">
              <td className="psp-table__td psp-table__td--season" colSpan={3}>NBA Career</td>
              <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.g, 0)}</td>
              <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.gs, 0)}</td>
              <td className="psp-table__td psp-table__td--accent">{(rows.reduce((s, r) => s + parseFloat(r.mpg), 0) / rows.length).toFixed(1)}</td>
              <td className="psp-table__td" colSpan={12} />
            </tr>
          </tbody>
        </table>
      </div>
      {rows.length > 7 && (
        <div className="psp-showmore-wrap">
          <button className="psp-showmore" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show less" : `Show all ${rows.length} seasons ↓`}
          </button>
        </div>
      )}
    </div>
  );
}

function MlbBattingCareerTable({ player }: { player: PlayerProfile }) {
  const [showAll, setShowAll] = useState(false);
  const rows = player.mlbBattingCareerStats ?? [];
  const visible = showAll ? rows : rows.slice(0, 8);

  return (
    <div className="psp-career-section">
      <h3 className="psp-section-title">Career Statistics</h3>
      <div className="psp-table-scroll">
        <table className="psp-table">
          <thead>
            <tr>
              {["SEASON","TEAM","LG","G","AB","R","H","2B","3B","HR","RBI","SB","BB","SO","AVG","OBP","SLG","OPS","WAR"].map((h) => (
                <th key={h} className={`psp-table__th${["SEASON","TEAM","LG"].includes(h) ? " psp-table__th--left" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={i} className="psp-table__tr">
                <td className="psp-table__td psp-table__td--season">{row.season}</td>
                <td className="psp-table__td psp-table__td--team">{row.team}</td>
                <td className="psp-table__td psp-table__td--left">{row.league}</td>
                <td className="psp-table__td">{row.g}</td>
                <td className="psp-table__td">{row.ab}</td>
                <td className="psp-table__td">{row.r}</td>
                <td className="psp-table__td">{row.h}</td>
                <td className="psp-table__td">{row.doubles}</td>
                <td className="psp-table__td">{row.triples}</td>
                <td className="psp-table__td psp-table__td--accent">{row.hr}</td>
                <td className="psp-table__td">{row.rbi}</td>
                <td className="psp-table__td">{row.sb}</td>
                <td className="psp-table__td">{row.bb}</td>
                <td className="psp-table__td">{row.so}</td>
                <td className="psp-table__td psp-table__td--accent">{row.avg}</td>
                <td className="psp-table__td">{row.obp}</td>
                <td className="psp-table__td">{row.slg}</td>
                <td className="psp-table__td psp-table__td--accent">{row.ops}</td>
                <td className="psp-table__td psp-table__td--accent">{row.war}</td>
              </tr>
            ))}
            <tr className="psp-table__tr psp-table__tr--career">
              <td className="psp-table__td psp-table__td--season" colSpan={3}>MLB Career</td>
              <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.g, 0)}</td>
              <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.ab, 0)}</td>
              <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.r, 0)}</td>
              <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.h, 0)}</td>
              <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.doubles, 0)}</td>
              <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.triples, 0)}</td>
              <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.hr, 0)}</td>
              <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.rbi, 0)}</td>
              <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.sb, 0)}</td>
              <td className="psp-table__td" colSpan={8} />
            </tr>
          </tbody>
        </table>
      </div>
      {rows.length > 8 && (
        <div className="psp-showmore-wrap">
          <button className="psp-showmore" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show less" : `Show all ${rows.length} seasons ↓`}
          </button>
        </div>
      )}

      {/* ── Advanced Career Stats (batting) ── */}
      {(player.mlbAdvancedBatting?.length ?? 0) > 0 && (
        <div className="psp-career-section" style={{ marginTop: "2rem" }}>
          <h3 className="psp-section-title">Advanced Career Stats</h3>
          <div className="psp-table-scroll">
            <table className="psp-table">
              <thead>
                <tr>
                  {["SEASON","PA","OPS+","wOBA","BABIP","BB%","K%","ISO","LD%","GB%","FB%","HR/FB","PULL%","CENT%","OPPO%"].map((h) => (
                    <th key={h} className={`psp-table__th${h === "SEASON" ? " psp-table__th--left" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {player.mlbAdvancedBatting!.map((row, i) => (
                  <tr key={i} className="psp-table__tr">
                    <td className="psp-table__td psp-table__td--season">{row.season}</td>
                    <td className="psp-table__td">{row.pa}</td>
                    <td className="psp-table__td psp-table__td--accent">{row.ops_plus}</td>
                    <td className="psp-table__td psp-table__td--accent">{row.woba}</td>
                    <td className="psp-table__td">{row.babip}</td>
                    <td className="psp-table__td">{row.bb_pct}</td>
                    <td className="psp-table__td">{row.k_pct}</td>
                    <td className="psp-table__td psp-table__td--accent">{row.iso}</td>
                    <td className="psp-table__td">{row.ld_pct}</td>
                    <td className="psp-table__td">{row.gb_pct}</td>
                    <td className="psp-table__td">{row.fb_pct}</td>
                    <td className="psp-table__td psp-table__td--accent">{row.hr_fb}</td>
                    <td className="psp-table__td">{row.pull_pct}</td>
                    <td className="psp-table__td">{row.cent_pct}</td>
                    <td className="psp-table__td">{row.oppo_pct}</td>
                  </tr>
                ))}
                <tr className="psp-table__tr psp-table__tr--career">
                  <td className="psp-table__td psp-table__td--season">MLB Career</td>
                  <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedBatting!.reduce((s, r) => s + r.pa, 0)}</td>
                  <td className="psp-table__td psp-table__td--accent">{Math.round(player.mlbAdvancedBatting!.reduce((s, r) => s + r.ops_plus, 0) / player.mlbAdvancedBatting!.length)}</td>
                  <td className="psp-table__td" colSpan={12} />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function MlbCareerTable({ player }: { player: PlayerProfile }) {
  const [showAll, setShowAll] = useState(false);
  const rows = player.mlbCareerStats ?? [];
  const visible = showAll ? rows : rows.slice(0, 10);

  return (
    <>
      <div className="psp-career-section">
        <h3 className="psp-section-title">Career Statistics</h3>
        <div className="psp-table-scroll">
          <table className="psp-table">
            <thead>
              <tr>
                {["SEASON","TEAM","LG","W","L","ERA","G","GS","CG","SHO","HLD","SV","SVO","IP","H","R","ER","HR","HB","BB","IBB","SO","AVG","WHIP","GO/AO"].map((h) => (
                  <th key={h} className={`psp-table__th${["SEASON","TEAM","LG"].includes(h) ? " psp-table__th--left" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => (
                <tr key={i} className="psp-table__tr">
                  <td className="psp-table__td psp-table__td--season">{row.season}</td>
                  <td className="psp-table__td psp-table__td--team">{row.team}</td>
                  <td className="psp-table__td psp-table__td--left">{row.league}</td>
                  <td className="psp-table__td">{row.w}</td>
                  <td className="psp-table__td">{row.l}</td>
                  <td className="psp-table__td psp-table__td--accent">{row.era}</td>
                  <td className="psp-table__td">{row.g}</td>
                  <td className="psp-table__td">{row.gs}</td>
                  <td className="psp-table__td">{row.cg}</td>
                  <td className="psp-table__td">{row.sho}</td>
                  <td className="psp-table__td">{row.hld}</td>
                  <td className="psp-table__td">{row.sv}</td>
                  <td className="psp-table__td">0</td>
                  <td className="psp-table__td">{row.ip}</td>
                  <td className="psp-table__td">{row.h}</td>
                  <td className="psp-table__td">{row.r}</td>
                  <td className="psp-table__td">{row.er}</td>
                  <td className="psp-table__td">—</td>
                  <td className="psp-table__td">—</td>
                  <td className="psp-table__td">{row.bb}</td>
                  <td className="psp-table__td">{row.ibb}</td>
                  <td className="psp-table__td psp-table__td--accent">{row.so}</td>
                  <td className="psp-table__td">{row.avg}</td>
                  <td className="psp-table__td psp-table__td--accent">{row.whip}</td>
                  <td className="psp-table__td">—</td>
                </tr>
              ))}
              <tr className="psp-table__tr psp-table__tr--career">
                <td className="psp-table__td psp-table__td--season" colSpan={3}>MLB Career</td>
                <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.w, 0)}</td>
                <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.l, 0)}</td>
                <td className="psp-table__td psp-table__td--accent">{(rows.reduce((s, r) => s + parseFloat(r.era), 0) / rows.length).toFixed(2)}</td>
                <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.g, 0)}</td>
                <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.gs, 0)}</td>
                <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.cg, 0)}</td>
                <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.sho, 0)}</td>
                <td className="psp-table__td" colSpan={12} />
                <td className="psp-table__td psp-table__td--accent">{rows.reduce((s, r) => s + r.so, 0)}</td>
                <td className="psp-table__td" colSpan={3} />
              </tr>
            </tbody>
          </table>
        </div>
        {rows.length > 10 && (
          <div className="psp-showmore-wrap">
            <button className="psp-showmore" onClick={() => setShowAll(!showAll)}>
              {showAll ? "Show less" : `Show all ${rows.length} seasons ↓`}
            </button>
          </div>
        )}
      </div>

      {/* ── Advanced Career Stats ── */}
      {(player.mlbAdvancedPitching?.length || player.mlbAdvancedPitching2?.length) ? (
        <div className="psp-career-section">
          <h3 className="psp-section-title">Advanced Career Stats</h3>

          {player.mlbAdvancedPitching?.length ? (
            <div className="psp-table-scroll psp-table-scroll--mb">
              <table className="psp-table">
                <thead>
                  <tr>
                    {["SEASON","QS","GF","2B","3B","GDP","WP","BK","SB","CS","PO","PK","STR%","P/IP","P/PA"].map((h) => (
                      <th key={h} className={`psp-table__th${h === "SEASON" ? " psp-table__th--left" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {player.mlbAdvancedPitching.map((row, i) => (
                    <tr key={i} className="psp-table__tr">
                      <td className="psp-table__td psp-table__td--season">{row.season}</td>
                      <td className="psp-table__td">{row.qs}</td>
                      <td className="psp-table__td">{row.gf}</td>
                      <td className="psp-table__td">{row.doubles}</td>
                      <td className="psp-table__td">{row.triples}</td>
                      <td className="psp-table__td">{row.gdp}</td>
                      <td className="psp-table__td">{row.wp}</td>
                      <td className="psp-table__td">{row.bk}</td>
                      <td className="psp-table__td">{row.sb}</td>
                      <td className="psp-table__td">{row.cs}</td>
                      <td className="psp-table__td">{row.po}</td>
                      <td className="psp-table__td">{row.pk}</td>
                      <td className="psp-table__td">{row.str_pct}</td>
                      <td className="psp-table__td psp-table__td--accent">{row.p_ip}</td>
                      <td className="psp-table__td psp-table__td--accent">{row.p_pa}</td>
                    </tr>
                  ))}
                  <tr className="psp-table__tr psp-table__tr--career">
                    <td className="psp-table__td psp-table__td--season">MLB Career</td>
                    <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedPitching.reduce((s,r)=>s+r.qs,0)}</td>
                    <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedPitching.reduce((s,r)=>s+r.gf,0)}</td>
                    <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedPitching.reduce((s,r)=>s+r.doubles,0)}</td>
                    <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedPitching.reduce((s,r)=>s+r.triples,0)}</td>
                    <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedPitching.reduce((s,r)=>s+r.gdp,0)}</td>
                    <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedPitching.reduce((s,r)=>s+r.wp,0)}</td>
                    <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedPitching.reduce((s,r)=>s+r.bk,0)}</td>
                    <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedPitching.reduce((s,r)=>s+r.sb,0)}</td>
                    <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedPitching.reduce((s,r)=>s+r.cs,0)}</td>
                    <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedPitching.reduce((s,r)=>s+r.po,0)}</td>
                    <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedPitching.reduce((s,r)=>s+r.pk,0)}</td>
                    <td className="psp-table__td">65.0%</td>
                    <td className="psp-table__td psp-table__td--accent">{(player.mlbAdvancedPitching.reduce((s,r)=>s+parseFloat(r.p_ip),0)/player.mlbAdvancedPitching.length).toFixed(2)}</td>
                    <td className="psp-table__td psp-table__td--accent">{(player.mlbAdvancedPitching.reduce((s,r)=>s+parseFloat(r.p_pa),0)/player.mlbAdvancedPitching.length).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}

          {player.mlbAdvancedPitching2?.length ? (
            <div className="psp-table-scroll">
              <table className="psp-table">
                <thead>
                  <tr>
                    {["SEASON","W%","RA/9","TBF","BABIP","OBP","SLG","OPS","K/9","BB/9","HR/9","H/9","K/BB","IR","IRS","BR","BRS"].map((h) => (
                      <th key={h} className={`psp-table__th${h === "SEASON" ? " psp-table__th--left" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {player.mlbAdvancedPitching2.map((row, i) => (
                    <tr key={i} className="psp-table__tr">
                      <td className="psp-table__td psp-table__td--season">{row.season}</td>
                      <td className="psp-table__td">{row.w_pct}</td>
                      <td className="psp-table__td">{row.ra9}</td>
                      <td className="psp-table__td">{row.tbf}</td>
                      <td className="psp-table__td">{row.babip}</td>
                      <td className="psp-table__td">{row.obp}</td>
                      <td className="psp-table__td">{row.slg}</td>
                      <td className="psp-table__td psp-table__td--accent">{row.ops}</td>
                      <td className="psp-table__td psp-table__td--accent">{row.k9}</td>
                      <td className="psp-table__td">{row.bb9}</td>
                      <td className="psp-table__td">{row.hr9}</td>
                      <td className="psp-table__td">{row.h9}</td>
                      <td className="psp-table__td psp-table__td--accent">{row.k_bb}</td>
                      <td className="psp-table__td">{row.ir}</td>
                      <td className="psp-table__td">{row.irs}</td>
                      <td className="psp-table__td">{row.br}</td>
                      <td className="psp-table__td">{row.brs}</td>
                    </tr>
                  ))}
                  <tr className="psp-table__tr psp-table__tr--career">
                    <td className="psp-table__td psp-table__td--season">MLB Career</td>
                    <td className="psp-table__td psp-table__td--accent">{(player.mlbAdvancedPitching2.reduce((s,r)=>s+parseFloat(r.w_pct),0)/player.mlbAdvancedPitching2.length).toFixed(3)}</td>
                    <td className="psp-table__td psp-table__td--accent">{(player.mlbAdvancedPitching2.reduce((s,r)=>s+parseFloat(r.ra9),0)/player.mlbAdvancedPitching2.length).toFixed(2)}</td>
                    <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedPitching2.reduce((s,r)=>s+r.tbf,0)}</td>
                    <td className="psp-table__td">{(player.mlbAdvancedPitching2.reduce((s,r)=>s+parseFloat(r.babip),0)/player.mlbAdvancedPitching2.length).toFixed(3)}</td>
                    <td className="psp-table__td">{(player.mlbAdvancedPitching2.reduce((s,r)=>s+parseFloat(r.obp),0)/player.mlbAdvancedPitching2.length).toFixed(3)}</td>
                    <td className="psp-table__td">{(player.mlbAdvancedPitching2.reduce((s,r)=>s+parseFloat(r.slg),0)/player.mlbAdvancedPitching2.length).toFixed(3)}</td>
                    <td className="psp-table__td psp-table__td--accent">{(player.mlbAdvancedPitching2.reduce((s,r)=>s+parseFloat(r.ops),0)/player.mlbAdvancedPitching2.length).toFixed(3)}</td>
                    <td className="psp-table__td psp-table__td--accent">{(player.mlbAdvancedPitching2.reduce((s,r)=>s+parseFloat(r.k9),0)/player.mlbAdvancedPitching2.length).toFixed(2)}</td>
                    <td className="psp-table__td">{(player.mlbAdvancedPitching2.reduce((s,r)=>s+parseFloat(r.bb9),0)/player.mlbAdvancedPitching2.length).toFixed(2)}</td>
                    <td className="psp-table__td">{(player.mlbAdvancedPitching2.reduce((s,r)=>s+parseFloat(r.hr9),0)/player.mlbAdvancedPitching2.length).toFixed(2)}</td>
                    <td className="psp-table__td">{(player.mlbAdvancedPitching2.reduce((s,r)=>s+parseFloat(r.h9),0)/player.mlbAdvancedPitching2.length).toFixed(2)}</td>
                    <td className="psp-table__td psp-table__td--accent">{(player.mlbAdvancedPitching2.reduce((s,r)=>s+parseFloat(r.k_bb),0)/player.mlbAdvancedPitching2.length).toFixed(2)}</td>
                    <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedPitching2.reduce((s,r)=>s+r.ir,0)}</td>
                    <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedPitching2.reduce((s,r)=>s+r.irs,0)}</td>
                    <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedPitching2.reduce((s,r)=>s+r.br,0)}</td>
                    <td className="psp-table__td psp-table__td--accent">{player.mlbAdvancedPitching2.reduce((s,r)=>s+r.brs,0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Awards — redesigned to match reference
───────────────────────────────────────────────────────── */

function AwardsSection({ player }: { player: PlayerProfile }) {
  if (!player.awards.length) return null;
  return (
    <div className="psp-awards-section">
      <h3 className="psp-section-title psp-section-title--center">Awards</h3>
      <div className="psp-awards-grid">
        {player.awards.map((award, i) => (
          <div key={i} className="psp-award-card">
            <div className="psp-award-card__icon-wrap">
              <AwardIcon icon={award.icon} />
            </div>
            <p className="psp-award-card__name">{award.name}</p>
            <p className="psp-award-card__years">{award.years}</p>
            <p className="psp-award-card__team">{award.team}</p>
            <p className="psp-award-card__league">AL</p>
          </div>
        ))}
      </div>
      <div className="psp-view-more-wrap">
        <button className="psp-view-more">View More Awards &gt;</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Transactions — redesigned to match reference
───────────────────────────────────────────────────────── */

function TransactionsSection({ player }: { player: PlayerProfile }) {
  if (!player.transactions.length) return null;
  return (
    <div className="psp-transactions-section">
      <h3 className="psp-section-title">Latest Transactions</h3>
      <div className="psp-tx-table-wrap">
        <table className="psp-tx-table">
          <thead>
            <tr>
              <th className="psp-tx-table__th psp-tx-table__th--logo" />
              <th className="psp-tx-table__th">DATE</th>
              <th className="psp-tx-table__th psp-tx-table__th--desc">TRANSACTION</th>
            </tr>
          </thead>
          <tbody>
            {player.transactions.map((tx, i) => (
              <tr key={i} className="psp-tx-table__tr">
                <td className="psp-tx-table__td psp-tx-table__td--logo">
                  {tx.teamLogo ? <TeamBadge monogram={tx.teamLogo} /> : <span className="psp-tx-badge psp-tx-badge--generic">⚾</span>}
                </td>
                <td className="psp-tx-table__td psp-tx-table__td--date">{tx.date}</td>
                <td className="psp-tx-table__td psp-tx-table__td--desc">{tx.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="psp-view-more-wrap">
        <button className="psp-view-more">View More Transactions &gt;</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────────── */

const PAGE_TABS = ["Summary", "Stats", "News", "Awards", "Shop"] as const;
type PageTab = (typeof PAGE_TABS)[number];

const STATS_SUBTABS_BASKETBALL = ["Career", "Game Logs", "Splits", "Advanced"] as const;
const STATS_SUBTABS_MLB = ["Career", "Game Logs", "Splits", "Batter vs. Pitcher"] as const;

export function PlayerStatsPage({ player }: { player: PlayerProfile }) {
  const [activeTab, setActiveTab] = useState<PageTab>("Stats");
  const [statsSubTab, setStatsSubTab] = useState(0);
  const [statMode, setStatMode] = useState<"batting" | "pitching">(
    player.position === "P" ? "pitching" : "batting",
  );

  const isBasketball = player.sport === "basketball";
  const subTabs = isBasketball ? STATS_SUBTABS_BASKETBALL : STATS_SUBTABS_MLB;

  const sportPath = isBasketball ? "/basketball" : "/mlb";
  const sportLabel = isBasketball ? "Basketball" : "MLB";

  return (
    <div className="psp-page">
      {/* ── Hero ── */}
      <div className="psp-hero" style={{ "--team-color": player.teamColor } as React.CSSProperties}>
        <div className="psp-hero__photo-wrap">
          <Image
            src={player.heroPhoto ?? player.photo}
            alt=""
            fill
            sizes="100vw"
            priority
            style={{ objectFit: "cover", objectPosition: "center 25%" }}
          />
        </div>
        <div className="psp-hero__overlay" aria-hidden="true" />

        <div className="psp-hero__inner">
          <div className="psp-hero__top">
            <nav className="psp-hero__breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href={sportPath}>{sportLabel}</Link>
              <span>/</span>
              <span>Player Profile</span>
            </nav>

            <div className="psp-hero__filters">
              <span className="psp-hero__filter-label">Search by Roster</span>
              <div className="psp-hero__filter-group">
                <label className="psp-hero__select-wrap">
                  <span className="visually-hidden">Season</span>
                  <select className="psp-hero__select" defaultValue="2025" aria-label="Season">
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                  <ChevronDown />
                </label>
                <label className="psp-hero__select-wrap">
                  <span className="visually-hidden">Team</span>
                  <select className="psp-hero__select" defaultValue={player.team} aria-label="Team">
                    <option value={player.team}>{player.team}</option>
                  </select>
                  <ChevronDown />
                </label>
                <label className="psp-hero__select-wrap">
                  <span className="visually-hidden">Player</span>
                  <select className="psp-hero__select" defaultValue={player.name} aria-label="Player">
                    <option value={player.name}>{player.name}</option>
                  </select>
                  <ChevronDown />
                </label>
              </div>
              <div className="psp-hero__brand">
                <span className="psp-hero__brand-text">{isBasketball ? "NBA" : "MLB"} PLAYERS</span>
                <span className="psp-hero__brand-mark" aria-hidden="true">
                  {isBasketball ? "🏀" : "⚾"}
                </span>
              </div>
            </div>
          </div>

          <div className="psp-hero__player">
            <div className="psp-hero__headshot">
              <Image
                src={player.headshot ?? player.photo}
                alt={player.name}
                width={112}
                height={112}
                priority
                style={{ objectFit: "cover", objectPosition: "center 12%" }}
              />
            </div>
            <div className="psp-hero__identity">
              <h1 className="psp-hero__name">
                {player.name}
                <span className="psp-hero__number">#{player.number}</span>
              </h1>
              <p className="psp-hero__meta">
                {player.position}
                {player.bats && <> &nbsp;|&nbsp; B/T: {player.bats}/{player.throws}</>}
                &nbsp;|&nbsp; {player.height} &nbsp;|&nbsp; {player.weight} &nbsp;|&nbsp; Age {player.age}
              </p>
              <div className="psp-hero__actions">
                <button type="button" className="psp-btn psp-btn--follow">Follow</button>
                <button type="button" className="psp-btn psp-btn--watch">Watch Story</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="psp-body">
        <nav className="psp-page-tabs" aria-label="Player sections">
          {PAGE_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`psp-page-tab${activeTab === tab ? " psp-page-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === "Stats" ? (
          <>
            <ProfileSummaryCard
              player={player}
              isBasketball={isBasketball}
              statMode={statMode}
              onStatModeChange={setStatMode}
            />

            <div className="psp-stats-divider">
              <span>Stats</span>
            </div>

            <section className="psp-stats-full">
                  {/* Sub-tabs */}
                  <div className="psp-pill-tabs">
                    {subTabs.map((tab, i) => (
                      <button
                        key={tab}
                        type="button"
                        className={`psp-pill-tab${statsSubTab === i ? " psp-pill-tab--active" : ""}`}
                        onClick={() => setStatsSubTab(i)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <hr className="psp-stats-rule" />

                  {/* MLB filter row */}
                  {!isBasketball && (
                    <div className="psp-filter-row">
                      <div className="psp-filter-pills">
                        <button type="button" className="psp-filter-pill psp-filter-pill--active">MLB</button>
                        <button type="button" className="psp-filter-pill">Minors</button>
                      </div>
                      <div className="psp-filter-pills">
                        <button
                          type="button"
                          className={`psp-filter-pill${statMode === "pitching" ? " psp-filter-pill--active" : ""}`}
                          onClick={() => setStatMode("pitching")}
                        >
                          Pitching
                        </button>
                        <button
                          type="button"
                          className={`psp-filter-pill${statMode === "batting" ? " psp-filter-pill--active" : ""}`}
                          onClick={() => setStatMode("batting")}
                        >
                          Batting
                        </button>
                        <button type="button" className="psp-filter-pill">Fielding</button>
                      </div>
                      <label className="psp-season-select-wrap">
                        <select className="psp-season-select" defaultValue="regular" aria-label="Season type">
                          <option value="regular">Regular Season</option>
                          <option value="postseason">Postseason</option>
                        </select>
                        <ChevronDown />
                      </label>
                    </div>
                  )}

                  {/* Tables */}
                  {statsSubTab === 0 && isBasketball && <BasketballCareerTable player={player} />}
                  {statsSubTab === 0 && !isBasketball && statMode === "pitching" && <MlbCareerTable player={player} />}
                  {statsSubTab === 0 && !isBasketball && statMode === "batting" && <MlbBattingCareerTable player={player} />}
                  {statsSubTab !== 0 && (
                    <div className="psp-coming-soon">
                      <p>{subTabs[statsSubTab]} data coming soon.</p>
                    </div>
                  )}

              <AwardsSection player={player} />
              <TransactionsSection player={player} />
            </section>
          </>
        ) : (
          <div className="psp-coming-soon psp-coming-soon--lg">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>{activeTab} section coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
