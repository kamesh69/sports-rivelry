import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { FanPoll, FanZoneContent } from "@/lib/types";

export const DEFAULT_FAN_ZONE: FanZoneContent = {
  heading: "Join the Fan Zone",
  subheading:
    "Be part of the action. Play games, answer polls, make predictions and compete with fans worldwide.",
  ctaLabel: "Join Now",
  ctaHref: "/newsletters/fan-zone-weekly",
  cards: [
    {
      id: "community-challenges",
      title: "Community Challenges",
      description: "Compete in rivalry challenges and win exclusive rewards.",
      icon: "trophy",
      sortOrder: 0,
    },
    {
      id: "fan-polls",
      title: "Fan Polls",
      description: "Make your voice heard and see what fans think.",
      icon: "poll",
      sortOrder: 1,
    },
    {
      id: "match-predictions",
      title: "Match Predictions",
      description: "Predict results and climb the leaderboard.",
      icon: "target",
      sortOrder: 2,
    },
    {
      id: "fantasy-sports",
      title: "Fantasy Sports",
      description: "Build your team and battle for glory.",
      icon: "shield",
      sortOrder: 3,
    },
  ],
};

export async function getFanZoneContent(): Promise<FanZoneContent> {
  if (!isSupabaseConfigured) {
    return DEFAULT_FAN_ZONE;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("fan_zone_cards")
      .select("id, title, description, icon, href, sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data?.length) {
      return DEFAULT_FAN_ZONE;
    }

    return {
      ...DEFAULT_FAN_ZONE,
      cards: data.map((row) => ({
        id: String(row.id),
        title: row.title,
        description: row.description,
        icon: row.icon || "trophy",
        href: row.href || undefined,
        sortOrder: row.sort_order ?? 0,
      })),
    };
  } catch {
    return DEFAULT_FAN_ZONE;
  }
}

export async function getActivePoll(): Promise<FanPoll | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: poll, error } = await supabase
      .from("fan_polls")
      .select("id, question, is_active, fan_poll_options ( id, label, votes )")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !poll) {
      return null;
    }

    return {
      id: String(poll.id),
      question: poll.question,
      isActive: Boolean(poll.is_active),
      options: (poll.fan_poll_options || []).map((option: any) => ({
        id: String(option.id),
        label: option.label,
        votes: option.votes ?? 0,
      })),
    };
  } catch {
    return null;
  }
}
