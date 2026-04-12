import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATASOURCE_ID = process.env.NOTION_DATASOURCE_ID!;

export interface Artwork {
  id: string;
  title: string;
  date: string | null;
  description: string;
  medium: string | null;
  photos: string[];
  tags: string[];
}

function extractArtwork(page: PageObjectResponse): Artwork {
  const props = page.properties;

  const title =
    props.Titre?.type === "title"
      ? props.Titre.title.map((t) => t.plain_text).join("")
      : "";

  const date =
    props.Date?.type === "date" && props.Date.date
      ? props.Date.date.start
      : null;

  const description =
    props.Description?.type === "rich_text"
      ? props.Description.rich_text.map((t) => t.plain_text).join("")
      : "";

  const medium =
    props["Médium"]?.type === "select" && props["Médium"].select
      ? props["Médium"].select.name
      : null;

  const photos =
    props.Photos?.type === "files"
      ? props.Photos.files
          .map((f) => {
            if (f.type === "file") return f.file.url;
            if (f.type === "external") return f.external.url;
            return "";
          })
          .filter(Boolean)
      : [];

  const tags =
    props.Tags?.type === "multi_select"
      ? props.Tags.multi_select.map((t) => t.name)
      : [];

  return { id: page.id, title, date, description, medium, photos, tags };
}

export async function getPublishedArtworks(): Promise<Artwork[]> {
  const response = await notion.dataSources.query({
    data_source_id: DATASOURCE_ID,
    filter: {
      property: "Publié",
      checkbox: { equals: true },
    },
    sorts: [{ property: "Date", direction: "descending" }],
  });

  return response.results
    .filter((p): p is PageObjectResponse => "properties" in p)
    .map(extractArtwork);
}

export async function getArtworkById(id: string): Promise<Artwork | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    if (!("properties" in page)) return null;
    return extractArtwork(page as PageObjectResponse);
  } catch {
    return null;
  }
}
