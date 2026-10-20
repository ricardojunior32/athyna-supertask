import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import type { ModalProps } from '../../types/components/ui'

// Built on <dialog> so focus trapping, Escape and the inert background come from the browser.
export const Modal = ({ open, title, onClose, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      // A click on the dialog element itself, not its content, is a click on the backdrop.
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-3xl bg-background text-foreground shadow-popover backdrop:bg-foreground/40 backdrop:backdrop-blur-sm open:animate-pop-in"
    >
      <div className="flex flex-col gap-5 p-5 md:p-6">
        <div className="relative flex items-center justify-center">
          <h2 id={titleId} className="text-lg font-medium">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 flex size-9 cursor-pointer items-center justify-center rounded-full bg-neutral-4 transition-colors hover:bg-neutral-6"
          >
            <X aria-hidden className="size-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
