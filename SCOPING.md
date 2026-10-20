- Which finding(s) above you think matter most, and why.

```
- The mobile experience needs attention: 61% of traffic comes from mobile, with a conversion rate of only 8%, compared to 24% on desktop. These figures indicate an opportunity to investigate and improve the mobile experience, which accounts for most of the traffic but has a significantly lower conversion rate.
- The median of 11 seconds suggests that the page needs to communicate the key job attributes quickly, including on the job details page, since 43% of views come directly from Google.
- The average of 1.2 job detail views per session suggests that more work should be done on recommending jobs based on the job the user is currently viewing.
- Users who apply filters have a significantly higher conversion rate (3x) than those who do not. However, only 24% of users use filters. This suggests an opportunity to improve the search experience by making filters more visible and easier to use. Although this association does not prove that using filters causes higher conversion, it justifies investigating improvements that make this feature easier to use.
```

- What you're proposing to build in response, specifically.

```
Considering that the metrics mentioned currently refer to the existing jobs.athyna.com page, I will start with a layout very similar to the one currently in production and apply improvements based on the metrics provided:
- Keep essential information prominently displayed: Currently, the header mainly shows location, type, salary, and experience. It would be very useful to also prominently display the skills/technologies required for the job near the title. This would allow users to evaluate the job without having to search for keywords within the description, which can sometimes be very long.
- Keep the essential job information and the Apply CTA accessible while scrolling down the page. (On mobile, only the Apply button will remain visible at all times, with an updated layout.) The idea is to use a fixed panel on the left on desktop, while on mobile, the floating Apply button will be positioned at the bottom right.
- Since sessions average only 1.2 job detail views and 43% of these views come directly from Google, I plan to display a selection of jobs similar to the one the user is viewing on the job details page. Recommendations will be based on the available attributes of the current job, such as skills and work arrangement, providing a relevant next option without requiring the user to return to the listings or perform a new search.
- Simple complementary improvements: Make the selected states of popular searches clearer and explain that users need to log in to discover their matching percentage, rather than suggesting that a score has already been calculated on the page but is locked until they log in.
- Usability improvements to the filters to make filtering easier, since users who apply a filter convert 3x better but only 24% use one. This includes filters for location and for a few popular technologies, which the API documents but cannot apply because its data for them is empty.
```

Job data will come from the development API. Recommendations will be selected, probably, by a simple script on the frontend, based on the available job attributes, without using mock data or implementing an advanced personalization model. Ideally, these recommended jobs would come from the backend, if possible.

- What you're explicitly not doing, and why that's the right call given the time you have.

```
- When I noticed the issue that 74% of users never return after encountering the login screen, I considered adding Google login to reduce this metric. However, this feature already exists, so the signup funnel would need further investigation.
- I will not implement a real job compatibility scoring model because it would require time and extensive testing before it could actually work effectively. Recommendations will come from a simple frontend heuristic over the job attributes the API returns.
- I will not change how search itself works: the API still matches the title only. The filter improvements stay on the client side, and the proper fix for the missing location and skills data belongs in the backend.
```

- How you'll know it worked: what you'd instrument, and what change in the data would tell you it helped.

```
I will connect PostHog to the project to record its events. This makes it possible to analyze and compare the previous metrics with the new ones. The events are:
job_viewed, job_opened, apply_clicked, similar_jobs_viewed, similar_job_clicked, jobs_searched, popular_search_clicked, filter_changed, auth_cta_clicked.

With these events in place, I will create dashboards in PostHog to follow the metrics below over time.
 
Important metrics to compare:
- Increase mobile user conversion compared to the previously reported 8%.
- Validate the number of clicks on similar job recommendations. (If using a real API, low rates could also indicate an issue with the backend calculation used to return similar jobs. This would help improve the analysis and recommendations.)
- Monitor desktop click metrics to identify potential regressions (considering that our main focus was mobile and desktop performance should never regress).

Since these are hypotheses based only on the metrics provided, and metric values may also fluctuate at different times of the year, the ideal approach would be to implement these changes and monitor the new metrics through an A/B test to determine which version performs better.
```