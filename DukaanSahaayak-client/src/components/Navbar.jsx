import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  FileText,
  HandCoins,
  ShoppingCart,
  Menu,
  BotMessageSquare ,
  X,
} from "lucide-react";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/billing", label: "Billing", icon: FileText },
  { to: "/udhaar/sales", label: "Customer Udhaar", icon: HandCoins },
  { to: "/udhaar/purchases", label: "Vendor Payable", icon: ShoppingCart },
  { to: "/chat", label: "Sahaayak AI", icon: BotMessageSquare  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="w-full bg-green-700 px-4 py-3 shadow relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-white hover:opacity-90 transition"
        >
          <img src="/logo.png" alt="BillDeck Logo" className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white text-green-800 shadow-sm"
                    : "text-white hover:bg-green-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Dashboard Shortcut (Mobile) */}
        <Link
          to="/dashboard"
          className="md:hidden flex items-center gap-2 px-3 py-2 text-sm bg-white text-green-700 rounded-md font-medium shadow-sm hover:bg-green-50"
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </Link>

        {/* Hamburger Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-green-800/30 transition focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-green-700 border-t border-green-600 shadow-xl md:hidden animate-fade-in-down z-50">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-6 py-4 border-b border-green-600 font-medium transition-colors ${
                  isActive
                    ? "bg-white text-green-800"
                    : "text-white hover:bg-green-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
