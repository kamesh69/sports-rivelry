import { getPlayerBySlug, PLAYERS } from "@/lib/player-data";
import { PlayerStatsPage } from "@/components/player-stats-page";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface PlayerPageProps {
  params: Promise<{
    primary: string;
    secondary: string;
    tertiary: string;
  }>;
}

export async function generateStaticParams() {
  return PLAYERS.map((player) => ({
    primary: player.sport === "basketball" ? "basketball" : "mlb",
    secondary: "player",
    tertiary: player.slug,
  }));
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { secondary, tertiary } = await params;

  if (secondary !== "player") {
    return buildMetadata({
      title: "Not found | Sports Rivalry",
      description: "",
      canonicalPath: "/",
      noIndex: true,
    });
  }

  const player = getPlayerBySlug(tertiary);

  if (!player) {
    return buildMetadata({
      title: "Player not found | Sports Rivalry",
      description: "",
      canonicalPath: "/",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${player.name} #${player.number} — ${player.team} | Sports Rivalry`,
    description: `${player.name} career statistics, awards, bio and more. ${player.position} for the ${player.team}.`,
    canonicalPath: `/${player.sport === "basketball" ? "basketball" : "mlb"}/player/${player.slug}`,
  });
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { secondary, tertiary } = await params;

  if (secondary !== "player") {
    notFound();
  }

  const player = getPlayerBySlug(tertiary);

  if (!player) {
    notFound();
  }

  return <PlayerStatsPage player={player} />;
}
