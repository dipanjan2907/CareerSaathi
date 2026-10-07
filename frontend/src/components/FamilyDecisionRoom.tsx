"use client";

import React, { useState } from "react";
import { submitFamilyMediation, MediationResponse } from "../lib/api";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Users, Scale, Loader2 } from "lucide-react";

export const FamilyDecisionRoom: React.FC<{ studentId: string }> = ({ studentId }) => {
  const [studentChoice, setStudentChoice] = useState("ev-tech-1");
  const [familyChoice, setFamilyChoice] = useState("ind-elec-2");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MediationResponse | null>(null);

  const handleMediate = async () => {
    setLoading(true);
    try {
      const data = await submitFamilyMediation(studentId, studentChoice, familyChoice);
      setResult(data);
    } catch (err) {
      console.error("Mediation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 max-w-5xl mx-auto px-6 space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-paper-secondary dark:bg-charcoal-secondary border border-paper-border dark:border-charcoal-border text-xs text-paper-muted dark:text-charcoal-muted">
          <Users className="w-3.5 h-3.5 text-paper-sage dark:text-charcoal-sage" />
          <span>Multi-Stakeholder Support (SIH PS 26241)</span>
        </div>
        <h2 className="text-3xl font-normal text-paper-text dark:text-charcoal-text">
          Family Decision Room
        </h2>
        <p className="text-sm text-paper-muted dark:text-charcoal-muted max-w-2xl">
          Compare student career preferences directly against family aspirations. The AI mediator presents transparent trade-offs without bias.
        </p>
      </div>

      {/* Input Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl border border-paper-border dark:border-charcoal-border bg-paper-surface dark:bg-charcoal-surface">
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted">
            Student Preferred Role
          </label>
          <select
            value={studentChoice}
            onChange={(e) => setStudentChoice(e.target.value)}
            className="w-full p-3 rounded-lg border border-paper-border dark:border-charcoal-border bg-paper-bg dark:bg-charcoal-bg text-sm text-paper-text dark:text-charcoal-text focus:outline-none"
          >
            <option value="ev-tech-1">EV Service Specialist & Technician</option>
            <option value="solar-tech">Solar PV Installation Specialist</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted">
            Family Preferred Role
          </label>
          <select
            value={familyChoice}
            onChange={(e) => setFamilyChoice(e.target.value)}
            className="w-full p-3 rounded-lg border border-paper-border dark:border-charcoal-border bg-paper-bg dark:bg-charcoal-bg text-sm text-paper-text dark:text-charcoal-text focus:outline-none"
          >
            <option value="ind-elec-2">Industrial Automation Electrician</option>
            <option value="academic-bsc">B.Sc Electronics (3-Year Degree)</option>
          </select>
        </div>

        <div className="md:col-span-2 pt-2">
          <button
            onClick={handleMediate}
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-paper-text text-paper-surface dark:bg-charcoal-text dark:text-charcoal-bg font-medium text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
            <span>{loading ? "Generating Mediation Summary..." : "Generate Family Trade-Off Report"}</span>
          </button>
        </div>
      </div>

      {/* Structured Mediation Output */}
      {result && (
    <div className="p-8 rounded-xl border border-paper-border dark:border-charcoal-border bg-paper-surface dark:bg-charcoal-surface shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-paper-border dark:border-charcoal-border">
        <span className="text-xs font-mono uppercase tracking-wider text-paper-sage dark:text-charcoal-sage">
        Neutral Family Mediation Report
        </span>
        <span className="text-xs font-mono text-paper-muted dark:text-charcoal-muted">
        MSDE Decision Engine
        </span>
      </div>

      {/* Formatted Markdown Component */}
      <MarkdownRenderer content={result.neutral_mediation_summary} />
    </div>
)}
    </section>
  );
};