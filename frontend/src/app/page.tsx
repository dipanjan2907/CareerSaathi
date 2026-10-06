"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { CareerDiscovery } from "../components/CareerDiscovery";
import { ScenarioAssessment } from "../components/ScenarioAssessment";
import { CareerResults } from "../components/CareerResults";
import { CareerRoadmap } from "../components/CareerRoadmap";
import { FamilyDecisionRoom } from "../components/FamilyDecisionRoom";
import AuthModal from "../components/AuthModal";
import { fetchDecisionEvaluation, DecisionResponse } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedSector, setSelectedSector] = useState("Automotive");
  const [decisionData, setDecisionData] = useState<DecisionResponse | null>(
    null,
  );
  const [loadingDecision, setLoadingDecision] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const activeStudentId = user?.role === "student" ? user.student_id : null;

  const navigateToSection = (section: string) => {
    setActiveSection(section);
    if (
      ["assessment", "profile", "roadmap", "family"].includes(section) &&
      !activeStudentId
    ) {
      setIsAuthOpen(true);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleAssessmentComplete = async () => {
    if (!activeStudentId) return;
    try {
      setLoadingDecision(true);
      setActiveSection("profile");
      // Fetch live calculated results from FastAPI Decision Engine
      const data = await fetchDecisionEvaluation(activeStudentId);
      setDecisionData(data);
    } catch (err) {
      console.error("Failed to evaluate decision:", err);
    } finally {
      setLoadingDecision(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-bg text-paper-text dark:bg-charcoal-bg dark:text-charcoal-text transition-colors duration-200">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeSection={activeSection}
        setActiveSection={navigateToSection}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className="pb-24">
        {!activeStudentId &&
          ["assessment", "profile", "roadmap", "family"].includes(
            activeSection,
          ) && (
            <div className="py-24 text-center space-y-4">
              <p className="text-sm font-mono text-paper-muted dark:text-charcoal-muted">
                Sign in with a student account to use this feature.
              </p>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2 rounded bg-paper-sage dark:bg-charcoal-sage text-white text-xs font-mono uppercase"
              >
                Login / Register
              </button>
            </div>
          )}

        {activeSection === "hero" && (
          <>
            <Hero
              onStart={() => navigateToSection("assessment")}
              onExplore={() => navigateToSection("explore")}
            />
            <CareerDiscovery
              onSelectCategory={(sec) => {
                setSelectedSector(sec);
                navigateToSection("assessment");
              }}
            />
          </>
        )}

        {activeSection === "explore" && (
          <CareerDiscovery
            onSelectCategory={(sec) => {
              setSelectedSector(sec);
              navigateToSection("assessment");
            }}
          />
        )}

        {activeSection === "assessment" && activeStudentId && (
          <ScenarioAssessment
            studentId={activeStudentId}
            sector={selectedSector}
            onComplete={handleAssessmentComplete}
            onBack={() => setActiveSection("hero")}
          />
        )}

        {activeSection === "profile" &&
          activeStudentId &&
          (loadingDecision ? (
            <div className="py-28 text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-paper-sage dark:text-charcoal-sage" />
              <p className="text-sm font-mono text-paper-muted dark:text-charcoal-muted">
                Executing FastAPI Vector Matching Engine...
              </p>
            </div>
          ) : decisionData ? (
            <CareerResults
              data={decisionData}
              onOpenRoadmap={() => setActiveSection("roadmap")}
              onOpenFamilyRoom={() => setActiveSection("family")}
            />
          ) : (
            <div className="py-24 text-center text-sm font-mono text-paper-muted dark:text-charcoal-muted">
              No evaluation data found. Please complete an assessment.
            </div>
          ))}

        {activeSection === "roadmap" &&
          (decisionData?.recommendations[0]?.career_id ? (
            <CareerRoadmap
              careerId={decisionData.recommendations[0].career_id}
            />
          ) : (
            activeStudentId && (
              <div className="py-24 text-center text-sm font-mono text-paper-muted dark:text-charcoal-muted">
                Complete an assessment to view a career roadmap.
              </div>
            )
          ))}

        {activeSection === "family" &&
          activeStudentId &&
          (decisionData ? (
            <FamilyDecisionRoom
              studentId={activeStudentId}
              careerOptions={decisionData.recommendations}
            />
          ) : (
            <div className="py-24 text-center text-sm font-mono text-paper-muted dark:text-charcoal-muted">
              Complete an assessment to open the family decision room.
            </div>
          ))}
      </main>

      <footer className="border-t border-paper-border dark:border-charcoal-border py-8 text-xs text-center text-paper-muted dark:text-charcoal-muted font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>
            CAREER SAATHI — Ministry of Skill Development & Entrepreneurship
            (SIH 26241)
          </span>
          <span>Deterministic FastAPI + Next.js Integration</span>
        </div>
      </footer>

      {/* Auth Modal overlay for Login/Register with CAPTCHA */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
