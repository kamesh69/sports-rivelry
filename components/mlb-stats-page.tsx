"use client";

import { useState } from "react";
import Link from "next/link";
import { nameToSlug } from "@/lib/player-data";
import type { BattingRow, FieldingRow, MlbStatsTables, PitchingRow } from "@/lib/mlb-stats-types";
import { BATTING, FIELDING, PITCHING } from "@/lib/mlb-stats-data";

type Tab = "batting" | "pitching" | "fielding";

/* ─────────────────────────────────────────────
   Glossary data
───────────────────────────────────────────── */
const PITCHING_GLOSSARY = [
  { abbr: "POS", def: "Position" },
  { abbr: "GP", def: "Games Played" },
  { abbr: "GS", def: "Games Started" },
  { abbr: "QS", def: "Quality Starts" },
  { abbr: "ERA", def: "Earned Run Average" },
  { abbr: "W", def: "Wins" },
  { abbr: "L", def: "Losses" },
  { abbr: "SV", def: "Saves" },
  { abbr: "HLD", def: "Holds" },
  { abbr: "IP", def: "Innings Pitched" },
  { abbr: "H", def: "Hits" },
  { abbr: "ER", def: "Earned Runs" },
  { abbr: "HR", def: "Home Runs" },
  { abbr: "BB", def: "Walks" },
  { abbr: "K", def: "Strikeouts" },
  { abbr: "K/9", def: "Strikeouts Per 9 Innings" },
  { abbr: "WAR", def: "Wins Above Replacement" },
  { abbr: "WHIP", def: "Walks Plus Hits Per Inning Pitched" },
];

const BATTING_GLOSSARY = [
  { abbr: "POS", def: "Position" },
  { abbr: "G", def: "Games Played" },
  { abbr: "AB", def: "At Bats" },
  { abbr: "R", def: "Runs Scored" },
  { abbr: "H", def: "Hits" },
  { abbr: "2B", def: "Doubles" },
  { abbr: "3B", def: "Triples" },
  { abbr: "HR", def: "Home Runs" },
  { abbr: "RBI", def: "Runs Batted In" },
  { abbr: "SB", def: "Stolen Bases" },
  { abbr: "BB", def: "Walks" },
  { abbr: "SO", def: "Strikeouts" },
  { abbr: "AVG", def: "Batting Average" },
  { abbr: "OBP", def: "On-Base Percentage" },
  { abbr: "SLG", def: "Slugging Percentage" },
  { abbr: "OPS", def: "On-Base Plus Slugging" },
  { abbr: "WAR", def: "Wins Above Replacement" },
];

const FIELDING_GLOSSARY = [
  { abbr: "POS", def: "Position" },
  { abbr: "G", def: "Games Played" },
  { abbr: "GS", def: "Games Started" },
  { abbr: "INN", def: "Innings Played" },
  { abbr: "TC", def: "Total Chances" },
  { abbr: "PO", def: "Putouts" },
  { abbr: "A", def: "Assists" },
  { abbr: "E", def: "Errors" },
  { abbr: "DP", def: "Double Plays" },
  { abbr: "FLD%", def: "Fielding Percentage" },
  { abbr: "RF/G", def: "Range Factor Per Game" },
  { abbr: "RF/9", def: "Range Factor Per 9 Innings" },
  { abbr: "DRS", def: "Defensive Runs Saved" },
  { abbr: "OAA", def: "Outs Above Average" },
];

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const INITIAL_ROWS = 11;
const SEASONS = ["2026 Regular Season", "2025 Regular Season", "2024 Regular Season"];
const TEAMS = ["All MLB", "AL East", "AL Central", "AL West", "NL East", "NL Central", "NL West"];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="mlb-stats__filter-wrap">
      <select
        className="mlb-stats__filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={value}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <span className="mlb-stats__filter-chevron" aria-hidden="true">
        <ChevronDown />
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Table sub-components
───────────────────────────────────────────── */
function PitchingTable({ rows }: { rows: PitchingRow[] }) {
  return (
    <div className="mlb-stats__table-scroll">
      <table className="mlb-stats__table">
        <thead>
          <tr>
            <th className="mlb-stats__th mlb-stats__th--rk">RK</th>
            <th className="mlb-stats__th mlb-stats__th--name">NAME</th>
            <th className="mlb-stats__th">TEAM</th>
            <th className="mlb-stats__th">POS</th>
            <th className="mlb-stats__th">GP</th>
            <th className="mlb-stats__th">GS</th>
            <th className="mlb-stats__th">QS</th>
            <th className="mlb-stats__th mlb-stats__th--accent">ERA</th>
            <th className="mlb-stats__th">W</th>
            <th className="mlb-stats__th">L</th>
            <th className="mlb-stats__th">SV</th>
            <th className="mlb-stats__th">HLD</th>
            <th className="mlb-stats__th">IP</th>
            <th className="mlb-stats__th">H</th>
            <th className="mlb-stats__th">ER</th>
            <th className="mlb-stats__th">HR</th>
            <th className="mlb-stats__th">BB</th>
            <th className="mlb-stats__th">K</th>
            <th className="mlb-stats__th">K/9</th>
            <th className="mlb-stats__th mlb-stats__th--accent">WAR</th>
            <th className="mlb-stats__th">WHIP</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.rk} className="mlb-stats__tr">
              <td className="mlb-stats__td mlb-stats__td--rk">{row.rk}</td>
              <td className="mlb-stats__td mlb-stats__td--name">
                <Link href={`/mlb/player/${nameToSlug(row.name)}`} className="mlb-stats__player-link">{row.name}</Link>
              </td>
              <td className="mlb-stats__td">{row.team}</td>
              <td className="mlb-stats__td">{row.pos}</td>
              <td className="mlb-stats__td">{row.gp}</td>
              <td className="mlb-stats__td">{row.gs}</td>
              <td className="mlb-stats__td">{row.qs}</td>
              <td className="mlb-stats__td mlb-stats__td--accent">{row.era}</td>
              <td className="mlb-stats__td">{row.w}</td>
              <td className="mlb-stats__td">{row.l}</td>
              <td className="mlb-stats__td">{row.sv}</td>
              <td className="mlb-stats__td">{row.hld}</td>
              <td className="mlb-stats__td">{row.ip}</td>
              <td className="mlb-stats__td">{row.h}</td>
              <td className="mlb-stats__td">{row.er}</td>
              <td className="mlb-stats__td">{row.hr}</td>
              <td className="mlb-stats__td">{row.bb}</td>
              <td className="mlb-stats__td">{row.k}</td>
              <td className="mlb-stats__td">{row.k9}</td>
              <td className="mlb-stats__td mlb-stats__td--accent">{row.war}</td>
              <td className="mlb-stats__td">{row.whip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BattingTable({ rows }: { rows: BattingRow[] }) {
  return (
    <div className="mlb-stats__table-scroll">
      <table className="mlb-stats__table">
        <thead>
          <tr>
            <th className="mlb-stats__th mlb-stats__th--rk">RK</th>
            <th className="mlb-stats__th mlb-stats__th--name">NAME</th>
            <th className="mlb-stats__th">TEAM</th>
            <th className="mlb-stats__th">POS</th>
            <th className="mlb-stats__th">G</th>
            <th className="mlb-stats__th">AB</th>
            <th className="mlb-stats__th">R</th>
            <th className="mlb-stats__th">H</th>
            <th className="mlb-stats__th">2B</th>
            <th className="mlb-stats__th">3B</th>
            <th className="mlb-stats__th">HR</th>
            <th className="mlb-stats__th">RBI</th>
            <th className="mlb-stats__th">SB</th>
            <th className="mlb-stats__th">BB</th>
            <th className="mlb-stats__th">SO</th>
            <th className="mlb-stats__th mlb-stats__th--accent">AVG</th>
            <th className="mlb-stats__th">OBP</th>
            <th className="mlb-stats__th">SLG</th>
            <th className="mlb-stats__th mlb-stats__th--accent">OPS</th>
            <th className="mlb-stats__th mlb-stats__th--accent">WAR</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.rk} className="mlb-stats__tr">
              <td className="mlb-stats__td mlb-stats__td--rk">{row.rk}</td>
              <td className="mlb-stats__td mlb-stats__td--name">
                <Link href={`/mlb/player/${nameToSlug(row.name)}`} className="mlb-stats__player-link">{row.name}</Link>
              </td>
              <td className="mlb-stats__td">{row.team}</td>
              <td className="mlb-stats__td">{row.pos}</td>
              <td className="mlb-stats__td">{row.g}</td>
              <td className="mlb-stats__td">{row.ab}</td>
              <td className="mlb-stats__td">{row.r}</td>
              <td className="mlb-stats__td">{row.h}</td>
              <td className="mlb-stats__td">{row.doubles}</td>
              <td className="mlb-stats__td">{row.triples}</td>
              <td className="mlb-stats__td">{row.hr}</td>
              <td className="mlb-stats__td">{row.rbi}</td>
              <td className="mlb-stats__td">{row.sb}</td>
              <td className="mlb-stats__td">{row.bb}</td>
              <td className="mlb-stats__td">{row.so}</td>
              <td className="mlb-stats__td mlb-stats__td--accent">{row.avg}</td>
              <td className="mlb-stats__td">{row.obp}</td>
              <td className="mlb-stats__td">{row.slg}</td>
              <td className="mlb-stats__td mlb-stats__td--accent">{row.ops}</td>
              <td className="mlb-stats__td mlb-stats__td--accent">{row.war}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FieldingTable({ rows }: { rows: FieldingRow[] }) {
  return (
    <div className="mlb-stats__table-scroll">
      <table className="mlb-stats__table">
        <thead>
          <tr>
            <th className="mlb-stats__th mlb-stats__th--rk">RK</th>
            <th className="mlb-stats__th mlb-stats__th--name">NAME</th>
            <th className="mlb-stats__th">TEAM</th>
            <th className="mlb-stats__th">POS</th>
            <th className="mlb-stats__th">G</th>
            <th className="mlb-stats__th">GS</th>
            <th className="mlb-stats__th">INN</th>
            <th className="mlb-stats__th">TC</th>
            <th className="mlb-stats__th">PO</th>
            <th className="mlb-stats__th">A</th>
            <th className="mlb-stats__th">E</th>
            <th className="mlb-stats__th">DP</th>
            <th className="mlb-stats__th mlb-stats__th--accent">FLD%</th>
            <th className="mlb-stats__th">RF/G</th>
            <th className="mlb-stats__th">RF/9</th>
            <th className="mlb-stats__th mlb-stats__th--accent">DRS</th>
            <th className="mlb-stats__th mlb-stats__th--accent">OAA</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.rk} className="mlb-stats__tr">
              <td className="mlb-stats__td mlb-stats__td--rk">{row.rk}</td>
              <td className="mlb-stats__td mlb-stats__td--name">
                <Link href={`/mlb/player/${nameToSlug(row.name)}`} className="mlb-stats__player-link">{row.name}</Link>
              </td>
              <td className="mlb-stats__td">{row.team}</td>
              <td className="mlb-stats__td">{row.pos}</td>
              <td className="mlb-stats__td">{row.g}</td>
              <td className="mlb-stats__td">{row.gs}</td>
              <td className="mlb-stats__td">{row.inn}</td>
              <td className="mlb-stats__td">{row.tc}</td>
              <td className="mlb-stats__td">{row.po}</td>
              <td className="mlb-stats__td">{row.a}</td>
              <td className="mlb-stats__td">{row.e}</td>
              <td className="mlb-stats__td">{row.dp}</td>
              <td className="mlb-stats__td mlb-stats__td--accent">{row.fldPct}</td>
              <td className="mlb-stats__td">{row.rfg}</td>
              <td className="mlb-stats__td">{row.rf9}</td>
              <td className="mlb-stats__td mlb-stats__td--accent">{row.drs}</td>
              <td className="mlb-stats__td mlb-stats__td--accent">{row.oaa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main page component
───────────────────────────────────────────── */
export function MlbStatsPage({ tables }: { tables?: MlbStatsTables }) {
  const [activeTab, setActiveTab] = useState<Tab>("pitching");
  const [showAll, setShowAll] = useState(false);
  const [season, setSeason] = useState(SEASONS[0]);
  const [teamFilter, setTeamFilter] = useState(TEAMS[0]);
  const seasonLabel = tables?.seasonLabel || "2026";

  const tabLabel: Record<Tab, string> = {
    batting: "Batting",
    pitching: "Pitching",
    fielding: "Fielding",
  };

  const titleMap: Record<Tab, string> = {
    batting: `MLB Player Batting Stats ${seasonLabel}`,
    pitching: `MLB Player Pitching Stats ${seasonLabel}`,
    fielding: `MLB Player Fielding Stats ${seasonLabel}`,
  };

  const allRows = {
    batting: tables?.batting ?? BATTING,
    pitching: tables?.pitching ?? PITCHING,
    fielding: tables?.fielding ?? FIELDING,
  };

  const currentRows = allRows[activeTab];
  const visibleRows = showAll ? currentRows : currentRows.slice(0, INITIAL_ROWS);
  const glossary = activeTab === "batting" ? BATTING_GLOSSARY : activeTab === "pitching" ? PITCHING_GLOSSARY : FIELDING_GLOSSARY;

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setShowAll(false);
  }

  return (
    <div className="mlb-stats-page">
      {/* ── Page header ──────────────────────────────── */}
      <div className="mlb-stats__header">
        <h1 className="mlb-stats__title">{titleMap[activeTab]}</h1>
        <div className="mlb-stats__header-right">
          <FilterDropdown
            value="Team Statistics"
            options={["Team Statistics", "Individual Leaders"]}
            onChange={() => {}}
          />
        </div>
      </div>

      {/* ── Tab nav ──────────────────────────────────── */}
      <nav className="mlb-stats__tabs" aria-label="Stats categories">
        {(["batting", "pitching", "fielding"] as Tab[]).map((tab) => (
          <button
            key={tab}
            className={`mlb-stats__tab${activeTab === tab ? " mlb-stats__tab--active" : ""}`}
            onClick={() => handleTabChange(tab)}
            aria-pressed={activeTab === tab}
          >
            {tabLabel[tab]}
          </button>
        ))}
      </nav>

      {/* ── Filters row ──────────────────────────────── */}
      <div className="mlb-stats__filters">
        <FilterDropdown value={season} options={SEASONS} onChange={setSeason} />
        <FilterDropdown value={teamFilter} options={TEAMS} onChange={setTeamFilter} />
      </div>

      {/* ── Stats table ──────────────────────────────── */}
      <div className="mlb-stats__table-wrap">
        {activeTab === "pitching" && <PitchingTable rows={visibleRows as PitchingRow[]} />}
        {activeTab === "batting" && <BattingTable rows={visibleRows as BattingRow[]} />}
        {activeTab === "fielding" && <FieldingTable rows={visibleRows as FieldingRow[]} />}

        {/* Show more */}
        {!showAll && currentRows.length > INITIAL_ROWS && (
          <div className="mlb-stats__showmore-wrap">
            <button
              className="mlb-stats__showmore"
              onClick={() => setShowAll(true)}
              aria-label={`Show all ${currentRows.length} ${tabLabel[activeTab].toLowerCase()} stats`}
            >
              Show More
            </button>
          </div>
        )}
      </div>

      {/* ── Info + Glossary ──────────────────────────── */}
      <div className="mlb-stats__footer-box">
        <div className="mlb-stats__info-banner" role="note">
          <svg className="mlb-stats__info-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 8v5M9 6v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>
            Statistics are updated weekly.&nbsp;
            <span className="mlb-stats__info-em">Player statistics refresh every week using official MLB data sources.</span>
          </span>
        </div>

        <section className="mlb-stats__glossary" aria-label="Stats glossary">
          <h2 className="mlb-stats__glossary-title">GLOSSARY</h2>
          <dl className="mlb-stats__glossary-grid">
            {glossary.map(({ abbr, def }) => (
              <div key={abbr} className="mlb-stats__glossary-item">
                <dt className="mlb-stats__glossary-abbr">{abbr}:</dt>
                <dd className="mlb-stats__glossary-def">{def}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
