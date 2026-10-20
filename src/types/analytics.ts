import type { ShareChannel } from './share'
import type { SkillsSource } from './skills'

export type AnalyticsClient = typeof import('posthog-js').default

export enum AnalyticsEvent {
  JobViewed = 'job_viewed',
  JobOpened = 'job_opened',
  SimilarJobClicked = 'similar_job_clicked',
  ApplyClicked = 'apply_clicked',
  SimilarJobsViewed = 'similar_jobs_viewed',
  JobsSearched = 'jobs_searched',
  PopularSearchClicked = 'popular_search_clicked',
  FilterChanged = 'filter_changed',
  AuthCtaClicked = 'auth_cta_clicked',
  ShareOpened = 'share_opened',
  JobShared = 'job_shared',
  JobAlertOpened = 'job_alert_opened',
  JobAlertCreated = 'job_alert_created',
}

export enum Arrival {
  Direct = 'direct',
  List = 'list',
  SimilarJobs = 'similar_jobs',
}

export enum ApplyPlacement {
  Hero = 'hero',
  Footer = 'footer',
  Floating = 'floating',
}

export enum AuthCta {
  Login = 'login',
  Signup = 'signup',
}

export enum AuthCtaPlacement {
  Header = 'header',
  MatchTeaser = 'match_teaser',
  SaveJob = 'save_job',
  AllJobs = 'all_jobs',
  UnlockAllJobs = 'unlock_all_jobs',
}

export type AnalyticsEventProperties = {
  [AnalyticsEvent.JobViewed]: {
    job_id: string
    arrival: Arrival
    is_remote: boolean
    has_salary: boolean
    seniority: string | null
    employment_type: string | null
    skills_source: SkillsSource
  }
  [AnalyticsEvent.JobOpened]: { job_id: string; source: Arrival.List }
  [AnalyticsEvent.SimilarJobClicked]: { job_id: string; from_job_id: string | null }
  [AnalyticsEvent.ApplyClicked]: { job_id: string; placement: ApplyPlacement }
  [AnalyticsEvent.SimilarJobsViewed]: { job_id: string; count: number }
  [AnalyticsEvent.JobsSearched]: {
    query: string
    results_count: number
    /** True when a location filter is on: the count covers only the jobs checked so far. */
    results_partial: boolean
    filters: string[]
  }
  [AnalyticsEvent.PopularSearchClicked]: { term: string }
  [AnalyticsEvent.FilterChanged]: { filter: string; value: string | number | boolean | null }
  [AnalyticsEvent.AuthCtaClicked]: { cta: AuthCta; placement: AuthCtaPlacement }
  [AnalyticsEvent.ShareOpened]: { job_id: string }
  [AnalyticsEvent.JobShared]: { job_id: string; channel: ShareChannel }
  [AnalyticsEvent.JobAlertOpened]: { job_id: string; has_alert: boolean }
  /** The email itself is never sent to analytics. */
  [AnalyticsEvent.JobAlertCreated]: { job_id: string; skills_count: number }
}
