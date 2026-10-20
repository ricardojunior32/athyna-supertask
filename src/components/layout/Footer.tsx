import { FOOTER_LINKS } from '../../constants/links'

export const Footer = () => {
  return (
    <footer className="bg-foreground text-white">
      <div className="mx-auto flex w-full max-w-page flex-col gap-6 px-6 py-8">
        <span className="text-2xl leading-none font-bold tracking-tight">athyna.</span>
        <ul className="flex flex-col gap-2">
          {FOOTER_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-sm font-light text-white/80 hover:text-white">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
