import { Button } from '../components/ui/Button'
import { StateMessage } from '../components/ui/StateMessage'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { StateRole } from '../types/components/ui'

export const ErrorPage = () => {
  useDocumentTitle('Something went wrong')

  return (
    <div className="mx-auto w-full max-w-article px-6">
      <StateMessage
        role={StateRole.Alert}
        title="Something went wrong"
        description="This page could not be shown. Reloading usually fixes it."
        action={<Button onClick={() => window.location.reload()}>Reload the page</Button>}
      />
    </div>
  )
}
