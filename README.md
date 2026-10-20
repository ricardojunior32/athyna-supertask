# Athyna Jobs - Super Task

A React + TypeScript job board client for the Athyna develop API, focused on the job detail page:
key facts and skills next to the title, an Apply button that stays reachable while scrolling, and
similar jobs at the end of the page.

## Why it looks like the production site
This is deliberately a rebuild of the current jobs.athyna.com, not a new design. Every metric and
scenario in the brief was measured on that screen, so I used production as the reference and applied
the improvements on top of its layout and visual identity.

Starting from the same baseline keeps a before/after comparison meaningful: each change can be tied
to the metric it targets. A design from scratch would move every number at once and explain none of
them, and it would spend the time budget on decisions the data never asked for.

- [SCOPING.md](SCOPING.md): what I chose to build and why (Exercise 1)
- [PR_REVIEW.md](PR_REVIEW.md): the "Back to jobs" review (Exercise 3)
- [AI_USAGE.md](AI_USAGE.md): how AI was used

## Live demo

https://athyna-supertask-nmx7.vercel.app/

## Recording

_Link to be added._

## Setup

Requires Node 20.19+ (or 22.12+) and npm.

```bash
  npm install
  npm run dev
```

The app runs at http://localhost:5173 and reads jobs from `https://develop.api.athyna.com`
(`GET /api/public/jobs` and `GET /api/public/jobs/{id}`). No API key or backend setup is needed.

### Analytics

Events go to PostHog:
```bash
  cp .env.example .env.local
```

Then set `VITE_POSTHOG_KEY` on env.local

Without a key nothing is sent: in dev, every event is printed to the browser console as
`[analytics] <event> <properties>`, so the instrumentation can be checked without a PostHog account.

`VITE_POSTHOG_DASHBOARD_EMBED_URL` comes filled in `.env.example` and turns on the
[admin panel](#analytics-dashboard) at `/admin`. Leave it empty and the page and its header link
disappear.

### Scripts

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server            |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Serve the production build           |
| `npm test`        | Run the unit tests (Vitest)          |
| `npm run lint`    | Lint with oxlint                     |

## Approach
I decided to focus most of the changes on the job detail page. 61% of the traffic comes from mobile, conversion there is much lower than on desktop, and users spend a 
median of just 11 seconds on the page. On top of that, 43% of job detail views come directly from Google, so many users land on a job without ever seeing the job list first.

Based on that, I focused on a few changes:

- **Keep the key job details visible.** On desktop, skills and the main job details such as salary, location, employment type and seniority stay visible in a panel on the left while the user scrolls through the description. On mobile, these details appear near the top of the page, with skills right below the header. The idea is to help users understand what the job offers and what it requires without having to dig through the full description or back to the top to remember.
- **Keep Apply within reach.** On desktop, the Apply button stays in the left panel alongside the job details. On mobile, a floating Apply button appears at the bottom right when the original buttons are no longer visible. I wanted to make applying easier without forcing users to scroll back up.
- **Similar jobs.** Since sessions average only 1.2 job detail views, I added up to four similar jobs at the bottom of the page. Instead of leaving users with no obvious next step, the goal is to help them discover another relevant opportunity from the job they're already viewing.
- **Filters that actually filter.** Users who filter convert 3x better, but only 24% use filters,
  and the API can't apply location or skills because that data is empty. I added Remote only,
  Location (by region) and Skills filters that work around it in the browser. How they work and
  their limits are in [Filters on top of incomplete API data](#filters-on-top-of-incomplete-api-data).
- **Job alerts by email.** For Athyna, a user who logs in is what matters, since that is how they
  save jobs and come back. But 74% of users who reach the login screen never return. "Get jobs like
  this by email" on the job page asks only for an email, so even users who would not log in leave
  something behind: a talent who receives alerts for similar roles and can be brought back and
  converted later.
- **Smaller fixes on the list.** Popular searches now have a clearer selected state, and I changed the match percentage message to "Login to discover." This makes it clearer that users need to log in to see their match, rather than suggesting that a score has already been calculated and is simply hidden.

### Structure
Search and filters live in the URL, so a filtered list can be shared and survives the back button.
Logic that can be wrong in interesting ways (formatting, skill extraction, role extraction, URL
parsing) lives in `lib/` as pure functions and is unit-tested.

### Instrumentation

All events go through one typed `track()` in [src/lib/analytics.ts](src/lib/analytics.ts), so an
event name or property that is not in the schema fails type-checking.

| Event                    | Fired when                                              |
| ------------------------ | ------------------------------------------------------- |
| `job_viewed`             | A job detail page loads (`arrival`: direct / list / similar_jobs) |
| `job_opened`             | A job is opened from the list                           |
| `apply_clicked`          | Apply is clicked (`placement`: hero / footer / floating) |
| `similar_jobs_viewed`    | The similar jobs section scrolls into view              |
| `similar_job_clicked`    | A similar job is opened                                 |
| `jobs_searched`          | A search settles (debounced, once per query + filters; `results_partial` with a location or skills filter) |
| `popular_search_clicked` | A popular search chip is clicked                        |
| `filter_changed`         | A filter is changed                                     |
| `auth_cta_clicked`       | A login / signup CTA is clicked (`placement`)           |
| `share_opened`           | The share dialog is opened on a job page                |
| `job_shared`             | A share option is used (`channel`: copy_link / whatsapp / x / facebook / linkedin / telegram) |
| `job_alert_opened`       | The job alert dialog is opened (`has_alert`: this job already has an alert) |
| `job_alert_created`      | A job alert is created (`skills_count`)                 |

Design choices that keep the data trustworthy:

- `job_viewed` fires once per job, not once per render, and carries `arrival` so direct landings
  can be separated from in-app navigation. `direct` covers any entry from outside the app (search
  engine, typed URL, shared link); Google specifically comes from PostHog's `$referring_domain`.
- `apply_clicked` carries `placement`, which is what tells whether the floating button earns its
  place on mobile.
- `apply_clicked` is a click, not an application. Apply opens the employer's site in a new tab and
  nothing is visible after that, so its rate is click-through and is not directly comparable to
  the 8% apply rate in the brief.
- `similar_jobs_viewed` only fires when the section is actually seen, so click-through is measured
  against people who saw it rather than everyone who loaded the page.
- `job_viewed` carries `skills_source` (`api` / `derived` / `none`), so results can be split by
  whether the skills shown were real or inferred.

## Analytics dashboard

The events above feed a PostHog dashboard, embedded in the app at `/admin` ("Admin panel (demo)"
in the header, desktop only). It is a demo for this trial.

### What goes to PostHog

| Source | What it records |
| ------ | --------------- |
| Custom events | The events in [Instrumentation](#instrumentation), with their properties |
| posthog-js, automatic | Page views on every route change, page leaves, clicks (autocapture), heatmaps and web vitals |
| PostHog, per event | Device type, browser, OS, referrer and approximate location from the IP |

Not collected: session recordings are off, and nobody is identified, so there are no person
profiles, names or emails. Each visitor is an anonymous ID.

### What the dashboard shows

| Tile | Question it answers |
| ---- | ------------------- |
| View to apply conversion by device | Does mobile still convert far below desktop (8% vs 24% in the brief)? |
| View to apply conversion by arrival | Do people landing straight from outside convert differently from those who come from the list or from similar jobs? |
| Similar jobs: seen to clicked | Do the recommendations get clicked by people who actually saw them? |
| Apply clicks by button placement | Which Apply button is used: hero, footer or the floating one on mobile? |
| Job views by arrival over time | How much of the traffic lands directly on a job page, day by day |
| Search and filter usage over time | How often people search, use popular searches and change filters |
| Auth CTA clicks by placement | Where people run into the login wall |
| Event volume by event | A health check: every instrumented event is arriving |

### Simulated data

Real traffic from testing is a handful of sessions, so the dashboard also holds **simulated
data**, sent by [scripts/seed-posthog.mjs](scripts/seed-posthog.mjs).

- Rates start from the brief's figures (61% mobile traffic, 8% mobile and 24% desktop conversion,
  43% direct arrivals, 24% of users filtering and converting 3x) with random variation per user.
  The other rates, such as 15% click-through on similar jobs, are assumptions made only to give
  those events some volume.
- Every simulated event carries `is_synthetic: true` and `seed_batch`, and its `distinct_id` starts
  with `seed-`, so it can always be filtered out.
- It shows that the events, the funnels and the dashboard work end to end. **It does not show
  whether the changes improved conversion**: the numbers reproduce the "before" scenario from the
  brief.

### What else the data allows

With the same events, without new instrumentation:

- **Split any funnel by a property**: `$referring_domain` to isolate Google landings,
  `skills_source` to compare jobs with real vs inferred skills, `is_remote` or `has_salary` to see
  which jobs convert.
- **Heatmaps of the job page**, to check whether people reach the description, similar jobs and
  the footer Apply on mobile.
- **Paths after `job_viewed`**, to see what people do next when they do not apply.
- **Alerts**, for example when mobile conversion drops below a threshold after a release.
- **An A/B test** with PostHog feature flags and experiments, comparing the new detail page with the
  current one on the same funnel.
- **Apply Button improvement** on mobile. Considering that mobile has more users, we can identify witch apply button the user clicked (footer, floating on mobile or on top/header)

## Trade-offs

### Similar jobs is a frontend logic calc

[SCOPING.md](SCOPING.md) planned to match on the current job's attributes, such as skills and work
arrangement. That changed during the build: there is no recommendations endpoint, and `skills`
comes back empty from the API, so similarity is based on the title instead. The role is extracted from it ("Senior Data Engineer II - Remote" becomes
"Data Engineer"), searched through the API, and narrowed by seniority and by remote when the current
job is remote. If the strict query returns too few results, seniority is dropped.

It costs one or two extra requests per detail page and is only as good as the title. It is enough to
test whether a next step on the page raises views per session; it is not a ranking model, and it
belongs in the backend.

### Skills are derived from the description

Because the API returns `skills` empty, the skills shown near the title are extracted from the
description with a curated dictionary of technologies, ranked by number of mentions. API skills are
used whenever they exist. I preferred missing a skill over showing a wrong one: ambiguous words such
as "Go", "Flask" or "Spark" only match in list-like contexts. The dictionary is tech-only, so
non-technical roles often show no skills at all.

### Filters on top of incomplete API data

The search box looks broader than it is: `q` matches the job title as an exact phrase, so
`q=Brazil` only finds jobs with "Brazil" in the title, and `q=engineer Brazil` returns 0. Words
people use to narrow a search (a place, "remote", a technology) miss most of the jobs they are
looking for. The filters below work around this.

#### Remote only

Whether a job is remote is a real boolean in the API (`location.isRemote`, filterable with
`remote=true`). Searching "remote" as text only finds jobs that say it in the title, and leaves out
remote jobs whose title does not. Two things cover it:

- **A "Remote only" quick filter** in the filter bar, so the common case is one click instead of a
  search (`?remote=1`).
- **The word "remote" in the search box becomes the filter.** [`splitRemoteKeyword`](src/lib/jobSearch.ts)
  removes it from `q` and turns Remote only on, so "data engineer remote" searches
  `q=data engineer&remote=true`. It is tracked as `filter_changed` like a click on the filter.

#### Location

The API documents `city` and `country` filters, but the data behind them is empty. On a 50-job
sample both fields were `null` on every job, so `country=United States` returns 11 jobs out of
33,459, `United Kingdom` 0, and `city=London` 0. The real location only exists in the free-text
`locality` field (`"GB: Sunbury - ICBT, United Kingdom"`, `"Cincinnati, OH, United States"`),
which the API does not accept as a filter (400 error).

- **Countries are grouped by region.** North America (US, Canada), LATAM (Argentina, Brazil,
  Chile, Colombia, Mexico, Peru, Uruguay, Venezuela), Europe, Middle East, Africa and APAC; the
  full list is in [`constants/locations.ts`](src/constants/locations.ts). Ticking a region selects
  all of its countries, and a partly selected region shows as indeterminate. The URL keeps whole
  regions as a slug (`?location=latam,GB`).
- **The country is read from `locality` in the browser.** [`parseCountry`](src/lib/location.ts)
  matches country names, spellings, big cities, US states and codes like `OH` or `GB:`. On the
  1,000 most recent jobs it places 88%; most of the rest are "Remote" or countries outside the list.
- **One request at a time, only when asked.** With a location (or skill) selected the list is
  fetched in pages of 50 (the API maximum) and filtered locally. "Load more jobs" fetches one more
  page per click, up to 4 pages, after which the usual login CTA takes over. There are no parallel
  or automatic requests.
- **Counts in analytics stay separate.** The heading shows the jobs found so far, and
  `jobs_searched` carries `results_partial: true` so these counts are not mixed with real totals in
  PostHog.

Limits: common locations (US, UK, India, Europe) fill the first page; rare countries often need the
extra pages or come back empty, which the empty state says. Jobs whose location cannot be read are
left out when a location is selected.

The fix in the backend: parse `locality` into an ISO country at ingestion, fill `country`, and let
it take several values or a region. Then `parseCountry` moves there, and the filter becomes a normal
query parameter with a real total, with no change to the filter UI.

#### Skills, from the same derived skills

Three of the top five queries return nothing, and one of them is "React": people type
technologies into a search that only reads titles. The API documents a `skills` parameter, but it
has the same problem as location: the field is almost always empty, so `skills=Python` returns 0.

The Skills filter offers ten fixed technologies, picked by how often they appear in the 1,000 most
recent jobs: Python, AWS, SQL, Azure, Java, JavaScript, TypeScript, React, Kubernetes and Docker.
It uses the API's skills when a job has them and otherwise the skills extracted from the
description, the same ones shown in Details. Selecting several means any of them. A selected skill
is moved to the front of Details, so each row shows why it matched even when the skill is not among
its most mentioned. It runs on the same paged, filter-in-the-browser path as Location.

Limits: it inherits the extraction's choices (it misses a skill rather than guessing one), and less
common technologies are sparse per page: React appears in about 4% of jobs, Python in about 20%.

## Some improvements that can be made if the solution go to production

- Run the change as an A/B test against the current page. The brief's numbers are a single
  snapshot, and conversion also moves with seasonality and traffic mix.
- Move similar jobs to the backend. In the ideal setup, the job detail endpoint already returns the
  similar jobs (their URLs and the info the cards need), computed from real skills and category,
  and the frontend only displays them. For this challenge the logic runs in the frontend to
  simulate that response.
- Have the API returning `skills` with an accurated keyword search to choose the bests matchs do growup the access of the job, drop the client-side extraction, and let the Skills filter use the
  `skills` query parameter.
- Move country parsing into the API's ingestion so Location becomes a real query parameter with a
  real total.
- End-to-end tests (e.g. Playwright) that simulate user clicks through the main flows: search,
  apply a filter, open a job, open a similar job and click Apply, on both desktop and mobile
  viewports. The current unit tests cover the logic in `src/lib`, not the flows as a user walks them.
