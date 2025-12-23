import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-red-600 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-4 py-4 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <h1 className="text-xl font-bold text-red-500">
          🏋️ Gym Admin
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-3">
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/add-member" className={linkClass("/add-member")}>
            Add Member
          </Link>
          <Link to="/members" className={linkClass("/members")}>
            Members
          </Link>

        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden text-gray-300 focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                open
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 space-y-2">
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={linkClass("/dashboard")}
          >
            Dashboard
          </Link>

          <Link
            to="/add-member"
            onClick={() => setOpen(false)}
            className={linkClass("/add-member")}
          >
            Add Member
          </Link>

          <Link
            to="/members"
            onClick={() => setOpen(false)}
            className={linkClass("/members")}
          >
            Members
          </Link>


        </div>
      )}
    </nav>
  );
}

export default Navbar;
