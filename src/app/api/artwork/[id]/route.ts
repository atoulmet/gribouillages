import { NextResponse } from "next/server";
import { getArtworkById } from "@/lib/notion";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATASOURCE_ID) {
    return NextResponse.json({ error: "Notion not configured" }, { status: 503 });
  }

  const { id } = await params;

  try {
    const artwork = await getArtworkById(id);
    if (!artwork) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(artwork);
  } catch (e) {
    console.error("Notion fetch error:", e);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
