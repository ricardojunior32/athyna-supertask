export enum JobAlertStep {
  Form = 'form',
  Done = 'done',
}

/** One email per browser, plus the jobs whose "jobs like this" alert it signed up for. */
export type JobAlerts = {
  email: string
  jobIds: string[]
}
