import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice.js";

function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-bold text-gray-800">LabShop</h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-7xl gap-4 px-6 pb-3 text-sm font-medium text-gray-700">
          {user?.role === "technician" && (
            <>
              <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
              <Link to="/test-templates" className="hover:text-blue-600">Test Templates</Link>
              <Link to="/reports" className="hover:text-blue-600">Reports</Link>
            </>
          )}
          {user?.role === "owner" && (
            <Link to="/owner-dashboard" className="hover:text-blue-600">Owner Dashboard</Link>
          )}
        </nav>
      </header>

      <main className="p-6">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;