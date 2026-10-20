import { createBrowserRouter } from 'react-router'
import { AppLayout } from './components/layout/AppLayout'
import { ANALYTICS_EMBED_URL } from './config'
import { ADMIN_PATH } from './constants/routes'
import { ErrorPage } from './pages/ErrorPage'
import { JobDetailPage } from './pages/JobDetailPage'
import { JobsPage } from './pages/JobsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <JobsPage /> },
          { path: 'jobs/:id', element: <JobDetailPage /> },
          ...(ANALYTICS_EMBED_URL
            ? [
                {
                  path: ADMIN_PATH,
                  lazy: async () => ({ Component: (await import('./pages/AdminPage')).AdminPage }),
                },
              ]
            : []),
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
