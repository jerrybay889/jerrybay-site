# Search Registration Packet — Prepare Only

This packet records exact public endpoints and a post-production checklist. It does not authorize or claim Google, Naver, or Bing account submission or verification.

## Exact endpoints after an approved Production merge

- Canonical origin: `https://www.jerrybay.kr`
- Authority hub: `https://www.jerrybay.kr/insights/`
- Sitemap: `https://www.jerrybay.kr/sitemap.xml`
- RSS: `https://www.jerrybay.kr/feed.xml`
- Robots: `https://www.jerrybay.kr/robots.txt`

## Shared preflight

- Confirm the approved B2 exact SHA is live on the canonical origin.
- Fetch robots, sitemap, feed, hub, and all three seed articles from Production and require HTTP 200.
- Confirm sitemap contains exactly the intended 18 canonical public routes and no Preview/local URL.
- Confirm canonical and `og:url` resolve to each live document.
- Re-run static/search QA and desktop/mobile Production smoke at the deployed SHA.
- Do not add verification tokens/files, DNS records, analytics, or environment variables under this packet.

## Google Search Console

Use an already authorized property or obtain separate Owner authority, submit the sitemap, and record the response and later coverage status without respondent PII.

## Naver Search Advisor

Use an already authorized site or obtain separate Owner authority, submit the sitemap and RSS, and record crawl status. Do not change DNS or add a verification file in this Gate.

## Bing Webmaster Tools

Use an already authorized site or obtain separate Owner authority, submit the sitemap, and record crawl status. Do not import or mutate another account without explicit authority.

## Current status

`PREPARED / NOT SUBMITTED / NOT VERIFIED`
