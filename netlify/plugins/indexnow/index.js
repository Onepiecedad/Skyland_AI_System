import { readFile } from "node:fs/promises";
import { join } from "node:path";

const host = "skylandai.se";
const key = "c5bdec9fd193404c8a41a1be3709a470";
const keyLocation = `https://${host}/${key}.txt`;

export const onSuccess = async ({ constants: { PUBLISH_DIR }, utils: { status } }) => {
  if (process.env.CONTEXT !== "production") {
    console.log(`Skipping IndexNow in ${process.env.CONTEXT} context`);
    return;
  }

  const sitemap = await readFile(join(PUBLISH_DIR, "sitemap.xml"), "utf8");
  const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  let response;
  try {
    response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key, keyLocation, urlList }),
    });
  } catch (error) {
    status.show({
      title: "IndexNow warning",
      summary: `Request failed: ${error.message}. Deploy was not affected.`,
    });
    return;
  }

  if (![200, 202].includes(response.status)) {
    status.show({
      title: "IndexNow warning",
      summary: `API returned HTTP ${response.status}. Deploy was not affected.`,
    });
    return;
  }

  status.show({
    title: "IndexNow",
    summary: `Submitted ${urlList.length} sitemap URLs (HTTP ${response.status})`,
  });
};
