#!/usr/bin/env node
/**
 * Sitemap submission.
 *
 * IndexNow (Bing, Yandex, Naver, Seznam — and Google reads the same pings)
 * is fully automatable: this script reads the deployed sitemap.xml and
 * pings the IndexNow API with every URL.
 *
 * Google Search Console and Bing Webmaster Tools sitemap submission still
 * require a one-time manual step (account verification) — the script prints
 * the exact URLs to paste at the end.
 *
 * Usage:
 *   node scripts/submit-sitemap.mjs                 # uses https://biggdate.app
 *   SITE_URL=https://staging.biggdate.app node scripts/submit-sitemap.mjs
 */

const SITE_URL = (process.env.SITE_URL || "https://biggdate.app").replace(/\/$/, "");
const INDEXNOW_KEY = "38fa483e7c9a6a81b02f5f52b49d0441";
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const HOST = new URL(SITE_URL).host;

async function fetchSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) {
    throw new Error(`sitemap.xml returned ${res.status}`);
  }
  const xml = await res.text();
  // Sitemaps are simple enough that a regex over <loc> is robust here.
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urls.length === 0) {
    throw new Error("no <loc> entries found in sitemap.xml");
  }
  return urls;
}

async function submitToIndexNow(urls) {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    }),
  });
  // IndexNow: 200/202 = accepted, 422 = key/host mismatch, 403 = key not found.
  return res.status;
}

async function main() {
  console.log(`Sitemap submission for ${SITE_URL}\n`);

  let urls;
  try {
    urls = await fetchSitemapUrls();
  } catch (err) {
    console.error(`Could not read sitemap: ${err.message}`);
    console.error("Is the site deployed and /sitemap.xml reachable?");
    process.exit(1);
  }
  console.log(`Found ${urls.length} URLs in sitemap.xml`);

  let status;
  try {
    status = await submitToIndexNow(urls);
  } catch (err) {
    console.error(`IndexNow request failed: ${err.message}`);
    process.exit(1);
  }

  if (status === 200 || status === 202) {
    console.log(`IndexNow: accepted (HTTP ${status}) — Bing/Yandex/Naver/Seznam notified.`);
  } else if (status === 403) {
    console.error(`IndexNow: HTTP 403 — key file not found at ${KEY_LOCATION}.`);
    console.error("Deploy the public/<key>.txt file first, then re-run.");
    process.exit(1);
  } else if (status === 422) {
    console.error(`IndexNow: HTTP 422 — URL/host mismatch. Check SITE_URL.`);
    process.exit(1);
  } else {
    console.error(`IndexNow: unexpected HTTP ${status}.`);
    process.exit(1);
  }

  console.log(`
Manual one-time steps (account verification required, can't be scripted):

  Google Search Console
    1. Add the property ${SITE_URL} at https://search.google.com/search-console
    2. Sitemaps → submit:  ${SITE_URL}/sitemap.xml

  Bing Webmaster Tools
    1. Add the site at https://www.bing.com/webmasters
    2. Sitemaps → submit:  ${SITE_URL}/sitemap.xml
       (IndexNow above already covers Bing crawl pings; this adds sitemap-level coverage.)
`);
}

main();
