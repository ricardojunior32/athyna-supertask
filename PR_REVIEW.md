# PR Review: "Back to jobs" on the role page
## What's wrong

The button calls `router.back()`, which is the same as pressing the browser's back button. That only takes you to the job board if the
board is the previous page in your history, which is true only when you clicked into the job from the list.

As the scenario points out, many people don’t arrive from the board. Job pages get shared on LinkedIn, Slack and newsletters, and they show up on Google. 
For someone who lands straight on the page, "Back to jobs" either takes them back to LinkedIn or Google (we lose them), or, 
if the link opened in a new tab, does nothing at all, so the button just looks broken. It also misbehaves inside the site: if 
you go from one job to a similar job, "back" takes you to the previous job, not to the jobs list the label promises.

That's a real cost, since direct visitors are exactly the new people we most want to keep browsing the board.

## How I'd fix it

Make it a real link to the board instead of relying on browser history (I'm considering the page's on '/' to put the link redirecting to /):

```tsx
import Link from "next/link";
import { ChevronLeftIcon } from "@athynacom/athyna-ui/icons";

export const BackButton = () => (
  <Link
    href="/"
    className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors w-fit"
  >
    <ChevronLeftIcon width={16} height={16} aria-hidden />
    Back to jobs
  </Link>
);
```

To know where the user came from, the board can save its current URL (filters included) in sessionStorage. The button reads it: if it’s there, it shows “Back to jobs” and links back to that exact URL, so the filters are kept; if not, it shows “See all jobs” and links to /.

## The label should match where the user came from

"Back to jobs" assumes the user was already on the board. For someone who landed straight on the job page there's nothing to go "back" to, 
and the copy reads a little off. For them I'd use something like "See all jobs", which reads as an invitation to explore the board rather 
than a return.
- To know where the user came from, the board can save its current URL (filters included) in `sessionStorage`. The button reads it: if it's
there, it shows "Back to jobs" and links back to that exact URL, so the filters are kept; if not, it shows "See all jobs" and links to `/`.


Unrelated, but worth fixing in the same PR: if NEXT_PUBLIC_PLATFORM_URL isn’t set, the ?? "" fallback ends up in new URL("/auth/login"), which throws. Since the sign-in link is built for every job, that takes down every job page. I’d validate the variable once at startup and drop the silent fallback.
