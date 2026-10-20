# AI Usage

I used AI tools throughout the challenge, for visual direction, product reasoning and comparison, implementation,
analytics and review.

**ChatGPT**: Visual direction based on the production site, exploring product hypotheses and comparison with other job boards

**Claude Code**: Implementation, UI refinement, tests, code review, the analytics seed script

**PostHog MCP (through Claude Code)**: Checking that events arrive, sending and checking the simulated data, following the dashboards

## ChatGPT

- **Visual direction.** I decided early to keep Athyna's current visual identity instead of
  creating a new design (the reasoning is in the [README](README.md#why-it-looks-like-the-production-site)).
  I gave ChatGPT screenshots and context from jobs.athyna.com and used it to describe that
  direction, so the implementation had a consistent reference to follow.
- **Product hypotheses.** I used it to explore hypotheses and challenge my reasoning, using the
  metrics in the brief (mobile share, conversion by device, direct arrivals, time on page) to help
  decide what was worth building. The final scope and its justification in
  [SCOPING.md](SCOPING.md) are mine.

## Claude Code

I used Claude Code during the whole development process:

- **UI refinement.** Iterating on layout, responsive behavior, information hierarchy and
  interactions, especially the mobile job page (key facts near the top, floating Apply button).
- **Tests.** Unit tests for the logic that can go wrong in subtle ways: formatting, skill
  extraction, role extraction for similar jobs, location parsing and URL state.
- **Review and feedback.** Reviewing the code for inconsistencies, comparing the intended behavior
  with the actual result.
- **Analytics instrumentation.** The typed `track()` in [src/lib/analytics.ts](src/lib/analytics.ts)
  and the event properties that make the data usable (`arrival`, `placement`, `skills_source`,
  `results_partial`).
- **Simulated data.** Writing [scripts/seed-posthog.mjs](scripts/seed-posthog.mjs), which generates
  1,000 synthetic users and about 2,900 events over 14 days. The rates come from the brief's
  baseline figures; every event is marked `is_synthetic: true` so it can always be filtered out.

## PostHog MCP

I connected the PostHog MCP server to Claude Code, so I could query the PostHog project directly
from the same session where I was writing the code:

- **Following events.** After instrumenting a flow, I checked that the events actually arrived in
  PostHog with the expected names and properties, instead of trusting only the console output.
- **Running the seed script.** I ran the dry run first to check the summary (rates per device,
  counts per event), then sent the batch with `--send` and confirmed in PostHog that the 1,000
  synthetic users and their events were there.
- **Following the dashboards.** I used it to look at the insights behind the dashboard embedded at
  `/admin` and check that the numbers matched what the seed data was supposed to reproduce.

## How I worked with AI

- I checked each change against the scope and against the behavior in the browser, and asked for changes when it did not
  match the intended experience.
- For analytics, I reviewed whether each event and property would actually answer the questions in
  SCOPING.md, and kept synthetic data clearly labelled so it cannot be mistaken for real traffic.

AI made the implementation faster, but the final deliverable reflects my decisions about what to
build, what to leave out, and how to evaluate the result.
