import { NavLink } from "react-router-dom";

function TeamNavbar({ links }) {
  return (
    <nav
      className="
        rounded-2xl
        border
        px-2
        bg-[var(--surface-base)]
        border-[var(--border-default)]
        shadow-[var(--shadow-sm)]
      "
    >
      <ul className="flex gap-2 overflow-x-auto whitespace-nowrap p-1 scrollbar-hide">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              end={link.path === ""}
              className={({ isActive }) =>
                `
                flex items-center gap-2
                rounded-2xl
                px-4 py-2.5
                md:px-5
                md:py-3
                text-sm font-medium
                transition-all duration-200

                ${
                  isActive
                    ? "bg-[var(--action-primary-bg)] text-[var(--action-primary-text)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                }
              `
              }
            >
              {link.icon && <link.icon size={17} />}
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default TeamNavbar;