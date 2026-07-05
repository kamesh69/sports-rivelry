"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MLBTeam, TeamCategory, TimelineEvent, QuickFact } from "@/lib/mlb-team-types";
import {
  searchTeams,
  getFeaturedTeams,
  getCategories,
  getTimeline,
  getQuickFacts,
  getTeams,
  FEATURED_TEAM_IDS,
} from "@/lib/team-service";
import { HeroBanner } from "@/components/mlb-teams/HeroBanner";
import { CategoryGrid } from "@/components/mlb-teams/CategoryGrid";
import { FeaturedTeamsCarousel } from "@/components/mlb-teams/FeaturedTeamsCarousel";
import { LeagueOverview } from "@/components/mlb-teams/LeagueOverview";
import { TeamDirectory } from "@/components/mlb-teams/TeamDirectory";
import { HistoricalTimeline } from "@/components/mlb-teams/HistoricalTimeline";
import { QuickFacts } from "@/components/mlb-teams/QuickFacts";
import { NewsletterSection } from "@/components/mlb-teams/NewsletterSection";

type ViewMode = "grid" | "list";
type LeagueFilter = "All" | "American" | "National";
type DivisionFilter = "All" | "East" | "Central" | "West";

const PAGE_SIZE = 9;
const ALL_TEAMS_COUNT = 30;

interface MlbTeamsPageProps {
  initialTeams: MLBTeam[];
  initialFeatured: MLBTeam[];
  initialCategories: TeamCategory[];
  initialTimeline: TimelineEvent[];
  initialFacts: QuickFact[];
}

export function MlbTeamsPage({
  initialTeams,
  initialFeatured,
  initialCategories,
  initialTimeline,
  initialFacts,
}: MlbTeamsPageProps) {
  /* ── State ────────────────────────────────────────────── */
  const [searchQuery, setSearchQuery] = useState("");
  const [league, setLeague] = useState<LeagueFilter>("All");
  const [division, setDivision] = useState<DivisionFilter>("All");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllTeams, setShowAllTeams] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  /* ── Debounced search ─────────────────────────────────── */
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(value);
      setCurrentPage(1);
    }, 280);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  /* ── Filtered teams ───────────────────────────────────── */
  const filteredTeams = useMemo(
    () => searchTeams(initialTeams, debouncedQuery, league, division, activeCategory),
    [initialTeams, debouncedQuery, league, division, activeCategory]
  );

  /* ── Category handler (also resets filters) ───────────── */
  const handleCategoryChange = useCallback((id: string) => {
    setActiveCategory(id);
    setLeague("All");
    setDivision("All");
    setCurrentPage(1);
    setShowAllTeams(false);
  }, []);

  /* ── League filter from overview cards ───────────────── */
  const handleLeagueFilter = useCallback((l: "American" | "National") => {
    setLeague(l);
    setActiveCategory("all");
    setCurrentPage(1);
    const dirEl = document.getElementById("td-directory");
    if (dirEl) {
      dirEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="sport-theme td-page">
      {/* ── Hero ── */}
      <HeroBanner searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <div className="td-shell">
        {/* ── Browse Categories ── */}
        <CategoryGrid
          categories={initialCategories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* ── Featured Teams Carousel ── */}
        <FeaturedTeamsCarousel teams={initialFeatured} />

        {/* ── League Overview ── */}
        <LeagueOverview onLeagueFilter={handleLeagueFilter} />

        {/* ── Teams Directory ── */}
        <div id="td-directory">
          <TeamDirectory
            teams={initialTeams}
            filteredTeams={filteredTeams}
            viewMode={viewMode}
            league={league}
            division={division}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            showAllTeams={showAllTeams}
            totalTeamCount={ALL_TEAMS_COUNT}
            onViewModeChange={setViewMode}
            onLeagueChange={(l) => { setLeague(l); setCurrentPage(1); setShowAllTeams(false); }}
            onDivisionChange={(d) => { setDivision(d); setCurrentPage(1); setShowAllTeams(false); }}
            onPageChange={setCurrentPage}
            onShowAllTeams={() => setShowAllTeams(true)}
          />
        </div>
      </div>

      {/* ── Historical Timeline + Quick Facts (shared bg) ── */}
      <div className="td-info-band">
        <div className="td-shell">
          <HistoricalTimeline events={initialTimeline} />
          <QuickFacts facts={initialFacts} />
        </div>
      </div>

      {/* ── Newsletter (full bleed bg) ── */}
      <NewsletterSection />
    </div>
  );
}

/* ── Server-side data loader wrapper ─────────────────────────
   This async component fetches all data and passes it to the
   client component, keeping the service layer separate.
──────────────────────────────────────────────────────────── */
export async function MlbTeamsPageLoader() {
  const [teams, categories, timeline, facts] = await Promise.all([
    getTeams(),
    getCategories(),
    getTimeline(),
    getQuickFacts(),
  ]);

  const featured = teams.filter((t) => FEATURED_TEAM_IDS.includes(t.id));

  return (
    <MlbTeamsPage
      initialTeams={teams}
      initialFeatured={featured}
      initialCategories={categories}
      initialTimeline={timeline}
      initialFacts={facts}
    />
  );
}
