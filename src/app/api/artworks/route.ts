import { NextResponse } from "next/server";
import { getPublishedArtworks } from "@/lib/notion";

export async function GET() {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATASOURCE_ID) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const artworks = await getPublishedArtworks();
    return NextResponse.json(artworks);
  } catch (e) {
    console.error("Notion fetch error:", e);
    return NextResponse.json([], { status: 200 });
  }
}
