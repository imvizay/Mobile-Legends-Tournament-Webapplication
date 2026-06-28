import { NavLink } from "react-router-dom";

function TeamNavbar({ links }) {
  return (
    <nav
      className="relative overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--surface-base)] shadow-[var(--shadow-sm)] md:rounded-2xl"
    >

      <ul className="flex snap-x snap-mandatory gap-1 overflow-x-auto px-2 py-2 scrollbar-hide">

        {links.map((link) => (

          <li key={link.path} className="snap-start shrink-0">
            <NavLink to={link.path} end={link.path === ""}
              className={({ isActive }) =>
                `
                                flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 md:rounded-2xl md:px-5 md:py-3
                                ${isActive
                  ? "bg-[var(--action-primary-bg)] text-[var(--action-primary-text)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                }
                                `
              }
            >
              {link.icon && <link.icon size={18} className="shrink-0" />}
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TeamNavbar