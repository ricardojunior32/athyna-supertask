import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router'
import { ANALYTICS_EMBED_URL } from '../config'
import { JOBS_PATH } from '../constants/routes'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export const AdminPage = () => {
  useDocumentTitle('Admin panel (demo)')

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 px-6">
      <Link
        to={JOBS_PATH}
        className="-ml-3 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground"
      >
        <ChevronLeft aria-hidden className="size-4" />
        Back to jobs
      </Link>
      <h1 className="text-3xl font-medium">Admin panel</h1>
      {ANALYTICS_EMBED_URL && (
        <iframe
          title="PostHog dashboard: job board instrumentation and conversion"
          src={ANALYTICS_EMBED_URL}
          sandbox="allow-scripts allow-same-origin allow-popups"
          allowFullScreen
          className="h-[200svh] w-full rounded-xl border border-neutral-4 bg-white"
        />
      )}
    </div>
  )
}
