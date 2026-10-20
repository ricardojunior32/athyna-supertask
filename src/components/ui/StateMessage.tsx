import { type StateMessageProps, StateRole } from '../../types/components/ui'

export const StateMessage = ({ title, description, action, role = StateRole.Status }: StateMessageProps) => {
  return (
    <div
      role={role}
      className="flex flex-col items-center gap-3 rounded-xl border border-neutral-4 bg-white px-6 py-12 text-center"
    >
      <h2 className="text-xl font-medium">{title}</h2>
      {description && <p className="max-w-md font-light text-neutral-11">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
