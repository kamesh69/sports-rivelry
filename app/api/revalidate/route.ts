import { revalidatePath, revalidateTag } from "next/cache";

function isAuthorized(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.REVALIDATE_SECRET;

  return secret && authHeader === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ revalidated: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    paths?: string[];
    tags?: string[];
  };

  const paths = body.paths?.length ? body.paths : ["/"];
  const tags = body.tags?.length ? body.tags : ["wordpress"];

  for (const path of paths) {
    revalidatePath(path);
  }

  for (const tag of tags) {
    revalidateTag(tag);
  }

  return Response.json({ revalidated: true, now: Date.now(), paths, tags });
}
