import { NavLink } from "react-router-dom";

function TeamNavbar({ links }) {
  return (
    <nav className="rounded-2xl border border-gray-200">
      <ul className="flex items-center gap-2">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              end={link.path === ""}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
                }`
              }
            >
              {link.icon && <link.icon size={14} />}
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default TeamNavbar;