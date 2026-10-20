import Markdown, { type Components } from 'react-markdown'
import type { JobDescriptionProps } from '../../types/components/jobs'

const components: Components = {
  h1: ({ node: _node, ...props }) => <h2 {...props} />,
  h2: ({ node: _node, ...props }) => <h3 {...props} />,
  a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
}

export const JobDescription = ({ markdown }: JobDescriptionProps) => {
  return (
    <div className="job-description">
      <Markdown components={components}>{markdown}</Markdown>
    </div>
  )
}
