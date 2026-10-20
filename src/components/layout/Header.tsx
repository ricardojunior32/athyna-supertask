import { Link } from 'react-router'
import { ANALYTICS_EMBED_URL } from '../../config'
import { AUTH_URLS, HIRING_URL } from '../../constants/links'
import { ADMIN_PATH, JOBS_PATH } from '../../constants/routes'
import { track } from '../../lib/analytics'
import { AnalyticsEvent, AuthCta, AuthCtaPlacement } from '../../types/analytics'
import { ButtonVariant } from '../../types/components/ui'
import { Button } from '../ui/Button'

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-background after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-6 after:bg-linear-to-b after:from-background after:to-transparent">
      <div className="mx-auto flex w-full max-w-page items-center justify-between gap-4 px-6 py-4 md:py-5">
        <div className="flex items-center gap-4">
          <Link
            to={JOBS_PATH}
            aria-label="Athyna jobs, home"
            className="text-2xl leading-none font-bold tracking-tight sm:text-3xl"
          >
            athyna.
          </Link>
          <a
            href={HIRING_URL}
            className="hidden rounded-full bg-foreground/5 px-2 py-0.5 text-sm text-foreground/60 md:inline-flex"
          >
            We're hiring!
          </a>
          {ANALYTICS_EMBED_URL && (
            <Link
              to={ADMIN_PATH}
              className="hidden rounded-full bg-primary-4 px-2 py-0.5 text-sm text-primary-12 md:inline-flex"
            >
              Admin panel (demo)
            </Link>
          )}
        </div>
        <nav aria-label="Account" className="flex items-center gap-2">
          <Button
            href={AUTH_URLS[AuthCta.Login]}
            variant={ButtonVariant.Outline}
            onClick={() =>
              track(AnalyticsEvent.AuthCtaClicked, {
                cta: AuthCta.Login,
                placement: AuthCtaPlacement.Header,
              })
            }
          >
            Log in
          </Button>
          <Button
            href={AUTH_URLS[AuthCta.Signup]}
            onClick={() =>
              track(AnalyticsEvent.AuthCtaClicked, {
                cta: AuthCta.Signup,
                placement: AuthCtaPlacement.Header,
              })
            }
          >
            Sign up
          </Button>
        </nav>
      </div>
    </header>
  )
}
