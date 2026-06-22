import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// Lu au moment de l'appel (et non à l'import) pour que les variables
// chargées par dotenv dans le script de build soient bien prises en compte.
function getNotion() {
  return new Client({ auth: process.env.NOTION_TOKEN });
}

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
  const response = await getNotion().dataSources.query({
    data_source_id: process.env.NOTION_DATASOURCE_ID!,
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
