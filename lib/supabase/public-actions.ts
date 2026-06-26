"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface NewsletterState {
  status: "idle" | "success" | "error";
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const source = String(formData.get("source") || "homepage");

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  if (!isSupabaseConfigured) {
    return {
      status: "success",
      message: "Thanks for subscribing!",
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, source });

    if (error && !error.message.toLowerCase().includes("duplicate")) {
      return { status: "error", message: "Something went wrong. Please try again." };
    }

    return { status: "success", message: "You're in. Watch your inbox!" };
  } catch {
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}

export interface PollVoteState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function voteInPoll(
  _prevState: PollVoteState,
  formData: FormData,
): Promise<PollVoteState> {
  const pollId = String(formData.get("pollId") || "");
  const optionId = String(formData.get("optionId") || "");

  if (!pollId || !optionId) {
    return { status: "error", message: "Please choose an option." };
  }

  if (!isSupabaseConfigured) {
    return { status: "success", message: "Thanks for voting!" };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error: rpcError } = await supabase.rpc("increment_poll_vote", {
      p_option_id: optionId,
    });

    if (rpcError) {
      return { status: "error", message: "Could not record your vote." };
    }

    await supabase.from("fan_poll_votes").insert({ poll_id: pollId, option_id: optionId });

    revalidatePath("/");
    return { status: "success", message: "Thanks for voting!" };
  } catch {
    return { status: "error", message: "Could not record your vote." };
  }
}
