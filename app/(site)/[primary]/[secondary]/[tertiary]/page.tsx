import { getPlayerBySlug, PLAYERS } from "@/lib/player-data";
import { PlayerStatsPage } from "@/components/player-stats-page";
import { TeamRosterPage } from "@/components/team-roster/TeamRosterPage";
import { buildBreadcrumbJsonLd, buildMetadata, type BreadcrumbItem } from "@/lib/seo";
import { getArticle } from "@/lib/cms";
import { getTeams, getTeamBySlug } from "@/services/team.service";
import { getGroupedRosterForTeam } from "@/services/player.service";
import { JsonLd } from "@/components/json-ld";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

export const revalidate = 60;

interface TertiaryPageProps {
  params: Promise<{
    primary: string;
    secondary: string;
    tertiary: string;
  }>;
}

export async function generateStaticParams() {
  const teams = await getTeams();

  return [
    ...PLAYERS.map((player) => ({
      primary: player.sport === "basketball" ? "basketball" : "mlb",
      secondary: "player",
      tertiary: player.slug,
    })),
    ...teams.map((team) => ({
      primary: "mlb",
      secondary: "teams",
      tertiary: team.slug,
    })),
  ];
}

export async function generateMetadata({ params }: TertiaryPageProps): Promise<Metadata> {
  const { primary, secondary, tertiary } = await params;

  /* ── MLB team roster page ─────────────────────────── */
  if (primary === "mlb" && secondary === "teams") {
    const team = await getTeamBySlug(tertiary);

    if (!team) {
      return buildMetadata({
        title: "Team not found | The Sports Rivalry",
        description: "",
        canonicalPath: "/mlb/teams",
        noIndex: true,
      });
    }

    return buildMetadata({
      title: `${team.name} Roster ${new Date().getFullYear()} — Players, Positions & Stats | The Sports Rivalry`,
      description: `Full ${team.name} roster: pitchers, catchers, infielders and outfielders with jersey numbers, bats/throws, age, height, weight and birthplace.`,
      canonicalPath: `/mlb/teams/${team.slug}`,
    });
  }

  /* ── MLB news article ─────────────────────────────── */
  if (primary === "mlb" && secondary === "news") {
    const article = await getArticle("mlb", tertiary);

    if (!article) {
      return buildMetadata({
        title: "Article not found | The Sports Rivalry",
        description: "",
        canonicalPath: "/mlb/news",
        noIndex: true,
      });
    }

    return buildMetadata({
      title: article.seo.title,
      description: article.seo.description,
      canonicalPath: article.seo.canonicalPath,
      noIndex: true,
    });
  }

  if (secondary !== "player") {
    return buildMetadata({
      title: "Not found | The Sports Rivalry",
      description: "",
      canonicalPath: "/",
      noIndex: true,
    });
  }

  const player = getPlayerBySlug(tertiary);

  if (!player) {
    return buildMetadata({
      title: "Player not found | The Sports Rivalry",
      description: "",
      canonicalPath: "/",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${player.name} #${player.number} — ${player.team} | The Sports Rivalry`,
    description: `${player.name} career statistics, awards, bio and more. ${player.position} for the ${player.team}.`,
    canonicalPath: `/${player.sport === "basketball" ? "basketball" : "mlb"}/player/${player.slug}`,
  });
}

export default async function TertiaryPage({ params }: TertiaryPageProps) {
  const { primary, secondary, tertiary } = await params;

  /* ── MLB team roster page ─────────────────────────── */
  if (primary === "mlb" && secondary === "teams") {
    const [team, allTeams] = await Promise.all([getTeamBySlug(tertiary), getTeams()]);

    if (!team) {
      notFound();
    }

    const groupedRoster = await getGroupedRosterForTeam(team);

    const breadcrumbs: BreadcrumbItem[] = [
      { name: "Home", href: "/" },
      { name: "MLB", href: "/mlb" },
      { name: "Teams", href: "/mlb/teams" },
      { name: team.name, href: `/mlb/teams/${team.slug}` },
    ];

    return (
      <>
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <TeamRosterPage team={team} allTeams={allTeams} initialGroupedRoster={groupedRoster} />
      </>
    );
  }

  /* ── MLB news article ─────────────────────────────── */
  if (primary === "mlb" && secondary === "news") {
    const article = await getArticle("mlb", tertiary);

    if (!article) {
      notFound();
    }

    permanentRedirect(article.seo.canonicalPath);
  }

  if (secondary !== "player") {
    notFound();
  }

  const player = getPlayerBySlug(tertiary);

  if (!player) {
    notFound();
  }

  return <PlayerStatsPage player={player} />;
}
