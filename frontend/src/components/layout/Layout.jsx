import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiBriefcase, FiFileText, FiGrid, FiLayers, FiLogOut, FiSettings } from "react-icons/fi";

import { logout } from "../../features/auth/authSlice";
import Logo from "../ui/Logo";

const technicianLinks = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/test-templates", label: "Test Templates", icon: FiLayers },
  { to: "/reports", label: "Reports", icon: FiFileText },
  { to: "/lab-profile", label: "Lab Profile", icon: FiSettings },
];

const ownerLinks = [{ to: "/owner-dashboard", label: "Owner Dashboard", icon: FiBriefcase }];

function NavItem({ to, icon: Icon, label, compact = false }) {
  const base = compact
    ? "flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
    : "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150";

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${base} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
          isActive
            ? "bg-teal-50 text-teal-800 [&>svg]:text-teal-600"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 [&>svg]:text-slate-400"
        }`
      }
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {label}
    </NavLink>
  );
}

function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const links =
    user?.role === "technician" ? technicianLinks : user?.role === "owner" ? ownerLinks : [];
  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden border-r border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        <div className="px-5 py-5">
          <Logo />
        </div>

        <nav aria-label="Main" className="flex-1 space-y-1 px-3">
          {links.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{user?.name}</p>
              <p className="text-xs capitalize text-slate-500">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <FiLogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile / tablet top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo />
          <div className="flex items-center gap-2">
            <span className="max-w-[9rem] truncate text-sm text-slate-600">
              {user?.name} <span className="capitalize text-slate-400">({user?.role})</span>
            </span>
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <FiLogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav aria-label="Main" className="flex gap-1 overflow-x-auto px-3 pb-2.5">
          {links.map((link) => (
            <NavItem key={link.to} {...link} compact />
          ))}
        </nav>
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
