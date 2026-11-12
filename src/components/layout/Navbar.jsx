import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Compass,
  Search,
  Menu,
  User,
  PlusCircle,
  LogOut,
  LogIn,
  UserPlus,
  Luggage,
  Heart,
  LayoutDashboard,
  Globe,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      newParams.set("search", searchTerm.trim());
    } else {
      newParams.delete("search");
    }
    navigate(`/?${newParams.toString()}`);
    setIsSearchActive(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-shadow duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#ff385c] flex items-center justify-center transition-transform group-hover:scale-105">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight hidden sm:inline text-[#ff385c]">
              staySphere
            </span>
          </Link>

          {/* Airbnb Signature 3-Segment Search Pill */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center bg-white border border-gray-200 rounded-full py-2 px-3 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer divide-x divide-gray-200"
          >
            {/* Anywhere / Location Input */}
            <div
              onClick={() => {
                setIsSearchActive(true);
                searchInputRef.current?.focus();
              }}
              className="px-4 text-xs font-bold text-gray-900 hover:text-black flex items-center gap-2"
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Anywhere (Goa, Malibu, Paris...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-800 placeholder-gray-500 outline-none w-48 sm:w-56"
              />
            </div>

            {/* Any week */}
            <div
              onClick={() => navigate("/?category=trending")}
              className="px-4 text-xs font-semibold text-gray-600 hover:text-black hidden lg:block cursor-pointer"
            >
              Any week
            </div>

            {/* Add guests & Search button */}
            <div className="pl-4 flex items-center gap-2">
              <span className="text-xs text-gray-400 font-normal hidden xl:inline">
                Add guests
              </span>
              <button
                type="submit"
                aria-label="Search"
                className="bg-[#ff385c] hover:bg-[#e03150] text-white p-2 rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              >
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </form>

          {/* Right Section: Host Button & User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/listings/new"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 px-4 py-2.5 rounded-full transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-[#ff385c]" />
              Airbnb your home
            </Link>

            <Link
              to="/"
              className="hidden lg:inline-flex p-2.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
              title="Global destinations"
            >
              <Globe className="w-4 h-4" />
            </Link>

            {/* Profile Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 border border-gray-200 rounded-full py-1.5 px-3 hover:shadow-md transition-all cursor-pointer bg-white"
              >
                <Menu className="w-4 h-4 text-gray-600" />
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-bold">
                  {user ? (
                    user.username.charAt(0).toUpperCase()
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-3xl shadow-2xl border border-gray-100 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                          Signed in as
                        </p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/trips"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                          <Luggage className="w-4 h-4 text-[#ff385c]" />
                          My Trips
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-[#ff385c]" />
                          Wishlists
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#ff385c]" />
                          Host Dashboard
                        </Link>
                        <Link
                          to="/listings/new"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 text-gray-400" />
                          Airbnb your home
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 text-left cursor-pointer transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Log out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-1">
                      <Link
                        to="/login"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-900 hover:bg-gray-50"
                      >
                        <LogIn className="w-4 h-4 text-[#ff385c]" />
                        Log in
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        <UserPlus className="w-4 h-4 text-gray-400" />
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearchSubmit} className="md:hidden pb-4">
          <div className="flex items-center rounded-full border border-gray-200 py-2 px-3.5 shadow-sm bg-white">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Where to? (e.g. Goa, Malibu...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-xs text-gray-800 bg-transparent outline-none font-medium placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-[#ff385c] text-white p-1.5 rounded-full hover:bg-[#e03150] shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}
