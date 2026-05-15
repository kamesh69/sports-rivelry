import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const previewSecret = process.env.WORDPRESS_PREVIEW_SECRET;

  if (!slug || !secret || secret !== previewSecret) {
    return new Response("Invalid preview request", { status: 401 });
  }

  (await draftMode()).enable();
  redirect(slug);
}
