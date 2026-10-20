import { Button } from '../components/ui/Button'
import { StateMessage } from '../components/ui/StateMessage'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { JOBS_PATH } from '../constants/routes'

export const NotFoundPage = () => {
  useDocumentTitle('Page not found')

  return (
    <div className="mx-auto w-full max-w-article px-6">
      <StateMessage
        title="Page not found"
        description="The page you are looking for does not exist or has moved."
        action={<Button to={JOBS_PATH}>Browse all jobs</Button>}
      />
    </div>
  )
}
