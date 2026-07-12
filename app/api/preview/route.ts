import { timingSafeEqual } from "crypto";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

function previewSecretsMatch(provided: string, expected: string) {
  const candidates = [provided, provided.replace(/ /g, "+")];

  return candidates.some((candidate) => {
    try {
      const left = Buffer.from(candidate);
      const right = Buffer.from(expected);

      return left.length === right.length && timingSafeEqual(left, right);
    } catch {
      return false;
    }
  });
}

function isValidPreviewSlug(slug: string) {
  const segments = slug.split("/").filter(Boolean);

  return segments.length >= 2;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret") ?? "";
  const slug = searchParams.get("slug") ?? "";
  const previewSecret = process.env.WORDPRESS_PREVIEW_SECRET ?? "";

  if (
    !slug ||
    !secret ||
    !previewSecret ||
    !isValidPreviewSlug(slug) ||
    !previewSecretsMatch(secret, previewSecret)
  ) {
    return new Response("Invalid preview request", { status: 401 });
  }

  (await draftMode()).enable();
  redirect(slug.startsWith("/") ? slug : `/${slug}`);
}
