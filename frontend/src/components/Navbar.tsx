"use client";

import React from "react";
import { Moon, Sun, Compass } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  activeSection,
  setActiveSection,
  onOpenAuth,
}) => {
  const navItems = [
    { id: "explore", label: "Explore Careers" },
    { id: "profile", label: "Decision Profile" },
    { id: "roadmap", label: "Career Graph" },
    { id: "family", label: "Family Decision Room" },
  ];

  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-paper-border dark:border-charcoal-border bg-paper-bg/90 dark:bg-charcoal-bg/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => setActiveSection("hero")}
        >
          <div className="w-8 h-8 rounded bg-paper-sage dark:bg-charcoal-sage flex items-center justify-center text-white dark:text-charcoal-bg font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-base tracking-tight text-paper-text dark:text-charcoal-text">
              CAREER SAATHI
            </span>
            <span className="text-xs text-paper-muted dark:text-charcoal-muted ml-2 font-mono uppercase tracking-wider">
              MSDE 26241
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`text-sm font-medium transition-colors relative py-1 ${
                activeSection === item.id
                  ? "text-paper-sage dark:text-charcoal-sage"
                  : "text-paper-muted dark:text-charcoal-muted hover:text-paper-text dark:hover:text-charcoal-text"
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-paper-sage dark:bg-charcoal-sage rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg border border-paper-border dark:border-charcoal-border hover:bg-paper-secondary dark:hover:bg-charcoal-secondary text-paper-text dark:text-charcoal-text transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono px-2 py-1 rounded bg-paper-bg dark:bg-charcoal-bg border border-paper-border dark:border-charcoal-border">
                {user.role === "parent" ? "PARENT" : "STUDENT"}:{" "}
                {user.full_name}
              </span>
              <button
                onClick={logout}
                className="text-xs font-mono px-3 py-1.5 rounded bg-paper-border dark:bg-charcoal-border hover:opacity-80"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs font-mono px-3 py-1.5 rounded bg-paper-sage text-(--my-color) dark:bg-charcoal-sage hover:opacity-90 font-bold"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
