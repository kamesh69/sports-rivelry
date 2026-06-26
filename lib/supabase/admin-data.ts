import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { MEDIA_BUCKET, isSupabaseAdminConfigured } from "@/lib/supabase/config";

export interface AdminFanZoneCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string | null;
  sortOrder: number;
}

export interface AdminPollOption {
  id: string;
  label: string;
  votes: number;
}

export interface AdminPoll {
  id: string;
  question: string;
  isActive: boolean;
  options: AdminPollOption[];
}

export interface AdminPrediction {
  id: string;
  matchLabel: string;
  homeTeam: string;
  awayTeam: string;
  kickoffAt: string | null;
  isActive: boolean;
}

export interface AdminSubscriber {
  id: string;
  email: string;
  source: string;
  createdAt: string;
}

export interface AdminHomeModule {
  id: string;
  key: string;
  title: string;
  isEnabled: boolean;
  sortOrder: number;
}

export interface AdminMediaItem {
  name: string;
  url: string;
  size: number | null;
  updatedAt: string | null;
}

export async function listFanZoneCards(): Promise<AdminFanZoneCard[]> {
  if (!isSupabaseAdminConfigured) return [];
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("fan_zone_cards")
    .select("id, title, description, icon, href, sort_order")
    .order("sort_order", { ascending: true });

  return (data || []).map((row) => ({
    id: String(row.id),
    title: row.title,
    description: row.description,
    icon: row.icon,
    href: row.href,
    sortOrder: row.sort_order ?? 0,
  }));
}

export async function listPolls(): Promise<AdminPoll[]> {
  if (!isSupabaseAdminConfigured) return [];
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("fan_polls")
    .select("id, question, is_active, fan_poll_options ( id, label, votes, sort_order )")
    .order("created_at", { ascending: false });

  return (data || []).map((row: any) => ({
    id: String(row.id),
    question: row.question,
    isActive: Boolean(row.is_active),
    options: (row.fan_poll_options || [])
      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((option: any) => ({
        id: String(option.id),
        label: option.label,
        votes: option.votes ?? 0,
      })),
  }));
}

export async function listPredictions(): Promise<AdminPrediction[]> {
  if (!isSupabaseAdminConfigured) return [];
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("match_predictions")
    .select("id, match_label, home_team, away_team, kickoff_at, is_active")
    .order("created_at", { ascending: false });

  return (data || []).map((row) => ({
    id: String(row.id),
    matchLabel: row.match_label,
    homeTeam: row.home_team,
    awayTeam: row.away_team,
    kickoffAt: row.kickoff_at,
    isActive: Boolean(row.is_active),
  }));
}

export async function listSubscribers(): Promise<AdminSubscriber[]> {
  if (!isSupabaseAdminConfigured) return [];
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, source, created_at")
    .order("created_at", { ascending: false });

  return (data || []).map((row) => ({
    id: String(row.id),
    email: row.email,
    source: row.source,
    createdAt: row.created_at,
  }));
}

export async function listHomeModules(): Promise<AdminHomeModule[]> {
  if (!isSupabaseAdminConfigured) return [];
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("home_modules")
    .select("id, key, title, is_enabled, sort_order")
    .order("sort_order", { ascending: true });

  return (data || []).map((row) => ({
    id: String(row.id),
    key: row.key,
    title: row.title,
    isEnabled: Boolean(row.is_enabled),
    sortOrder: row.sort_order ?? 0,
  }));
}

export async function listMedia(): Promise<AdminMediaItem[]> {
  if (!isSupabaseAdminConfigured) return [];
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.storage.from(MEDIA_BUCKET).list("", {
    limit: 100,
    sortBy: { column: "updated_at", order: "desc" },
  });

  return (data || [])
    .filter((item) => item.id !== null)
    .map((item) => {
      const { data: publicUrl } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(item.name);
      return {
        name: item.name,
        url: publicUrl.publicUrl,
        size: (item.metadata as any)?.size ?? null,
        updatedAt: item.updated_at ?? null,
      };
    });
}
