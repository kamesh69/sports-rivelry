"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { MEDIA_BUCKET } from "@/lib/supabase/config";
import { requireAdmin } from "@/lib/supabase/auth";

function refreshHome() {
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}

// --------------------------------------------------------------------------
// Fan Zone
// --------------------------------------------------------------------------
export async function saveFanZoneCard(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const id = String(formData.get("id") || "");
  const payload = {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    icon: String(formData.get("icon") || "trophy").trim(),
    href: String(formData.get("href") || "").trim() || null,
    sort_order: Number(formData.get("sortOrder") || 0),
  };

  if (id) {
    await supabase.from("fan_zone_cards").update(payload).eq("id", id);
  } else {
    await supabase.from("fan_zone_cards").insert(payload);
  }

  refreshHome();
}

export async function deleteFanZoneCard(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = createSupabaseAdminClient();
  await supabase.from("fan_zone_cards").delete().eq("id", id);
  refreshHome();
}

// --------------------------------------------------------------------------
// Polls
// --------------------------------------------------------------------------
export async function createPoll(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const question = String(formData.get("question") || "").trim();
  const options = String(formData.get("options") || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!question || options.length < 2) {
    return;
  }

  const { data: poll } = await supabase
    .from("fan_polls")
    .insert({ question, is_active: true })
    .select("id")
    .single();

  if (poll) {
    await supabase.from("fan_poll_options").insert(
      options.map((label, index) => ({
        poll_id: poll.id,
        label,
        sort_order: index,
      })),
    );
  }

  refreshHome();
}

export async function setPollActive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const isActive = String(formData.get("isActive") || "") === "true";
  if (!id) return;
  const supabase = createSupabaseAdminClient();
  await supabase.from("fan_polls").update({ is_active: isActive }).eq("id", id);
  refreshHome();
}

export async function deletePoll(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = createSupabaseAdminClient();
  await supabase.from("fan_polls").delete().eq("id", id);
  refreshHome();
}

// --------------------------------------------------------------------------
// Predictions
// --------------------------------------------------------------------------
export async function createPrediction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const matchLabel = String(formData.get("matchLabel") || "").trim();
  const homeTeam = String(formData.get("homeTeam") || "").trim();
  const awayTeam = String(formData.get("awayTeam") || "").trim();
  const kickoff = String(formData.get("kickoffAt") || "").trim();

  if (!matchLabel || !homeTeam || !awayTeam) {
    return;
  }

  await supabase.from("match_predictions").insert({
    match_label: matchLabel,
    home_team: homeTeam,
    away_team: awayTeam,
    kickoff_at: kickoff ? new Date(kickoff).toISOString() : null,
    is_active: true,
  });

  refreshHome();
}

export async function deletePrediction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = createSupabaseAdminClient();
  await supabase.from("match_predictions").delete().eq("id", id);
  refreshHome();
}

// --------------------------------------------------------------------------
// Homepage modules
// --------------------------------------------------------------------------
export async function toggleHomeModule(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const isEnabled = String(formData.get("isEnabled") || "") === "true";
  if (!id) return;
  const supabase = createSupabaseAdminClient();
  await supabase.from("home_modules").update({ is_enabled: isEnabled }).eq("id", id);
  refreshHome();
}

export async function updateModuleOrder(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const sortOrder = Number(formData.get("sortOrder") || 0);
  if (!id) return;
  const supabase = createSupabaseAdminClient();
  await supabase.from("home_modules").update({ sort_order: sortOrder }).eq("id", id);
  refreshHome();
}

// --------------------------------------------------------------------------
// Media library
// --------------------------------------------------------------------------
export async function uploadMedia(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-").toLowerCase();
  const path = `${Date.now()}-${safeName}`;

  await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });

  revalidatePath("/admin/media");
}

export async function deleteMedia(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "");
  if (!name) return;
  const supabase = createSupabaseAdminClient();
  await supabase.storage.from(MEDIA_BUCKET).remove([name]);
  revalidatePath("/admin/media");
}
