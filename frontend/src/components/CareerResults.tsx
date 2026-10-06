"use client";

import React from "react";
import { DecisionResponse } from "../lib/api";
import { ShieldAlert, CheckCircle2, FileText } from "lucide-react";

export const CareerResults: React.FC<{
  data: DecisionResponse;
  onOpenRoadmap: () => void;
  onOpenFamilyRoom: () => void;
}> = ({ data, onOpenRoadmap, onOpenFamilyRoom }) => {
  const topCareer = data.recommendations[0];

  return (
    <section className="py-16 max-w-7xl mx-auto px-6 space-y-12">
      {/* Header Profile Summary */}
      <div className="p-8 rounded-xl border border-paper-border dark:border-charcoal-border bg-paper-surface dark:bg-charcoal-surface space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-paper-border dark:border-charcoal-border">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-paper-sage dark:text-charcoal-sage">
              Decision Analysis Output
            </span>
            <h2 className="text-2xl md:text-3xl font-normal text-paper-text dark:text-charcoal-text mt-1">
              Evaluated Career Fit Profile
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-xs font-mono text-paper-muted dark:text-charcoal-muted">
                Confidence Rating
              </div>
              <div className="text-sm font-mono font-bold text-paper-sage dark:text-charcoal-sage">
                {data.confidence_rating} (
                {Math.round(data.confidence_score * 100)}%)
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-paper-softSage dark:bg-charcoal-softSage flex items-center justify-center text-paper-sage dark:text-charcoal-sage font-bold font-mono text-sm">
              {Math.round(data.confidence_score * 100)}
            </div>
          </div>
        </div>

        {/* Gemini Explanation Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted">
            <FileText className="w-4 h-4 text-paper-sage dark:text-charcoal-sage" />
            <span>AI Narrative Explanation (Grounded Evidence Only)</span>
          </div>
          <p className="text-sm text-paper-text dark:text-charcoal-text leading-relaxed bg-paper-secondary dark:bg-charcoal-secondary p-5 rounded-lg border border-paper-border dark:border-charcoal-border">
            {data.counselling_explanation}
          </p>
        </div>
      </div>

      {/* Top Recommendations Ranking Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-normal text-paper-text dark:text-charcoal-text">
          Ranked Career Recommendations
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Top Match Card */}
          <div className="lg:col-span-8 p-8 rounded-xl border border-paper-sage dark:border-charcoal-sage bg-paper-surface dark:bg-charcoal-surface space-y-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-paper-softSage dark:bg-charcoal-softSage text-paper-sage dark:text-charcoal-sage">
                  🥇 Ranked #1 Primary Pathway
                </span>
                <h4 className="text-2xl font-normal text-paper-text dark:text-charcoal-text mt-3">
                  {topCareer.career_title}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-3xl font-mono font-bold text-paper-sage dark:text-charcoal-sage">
                  {topCareer.match_score}%
                </span>
                <span className="block text-xs font-mono text-paper-muted dark:text-charcoal-muted">
                  Overall Score
                </span>
              </div>
            </div>

            {/* Strengths & Skill Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-paper-border dark:border-charcoal-border">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted">
                  Validated Competency Strengths
                </span>
                <ul className="space-y-1.5 text-xs text-paper-text dark:text-charcoal-text">
                  {topCareer.strengths.map((str, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-paper-sage dark:text-charcoal-sage" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted">
                  Identified Skill Gaps
                </span>
                <ul className="space-y-1.5 text-xs text-paper-text dark:text-charcoal-text">
                  {topCareer.skill_gaps.map((gap, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-paper-amber" />
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Itemized Constraint Evaluations */}
            <div className="space-y-3 pt-4 border-t border-paper-border dark:border-charcoal-border">
              <span className="text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted">
                Financial & Time Constraint Evaluations
              </span>
              {topCareer.constraint_evaluations.map((c, i) => (
                <div
                  key={i}
                  className="p-3 rounded bg-paper-secondary dark:bg-charcoal-secondary text-xs flex items-center justify-between"
                >
                  <span className="text-paper-text dark:text-charcoal-text">
                    {c.message}
                  </span>
                  <span
                    className={`font-mono px-2 py-0.5 rounded text-[10px] ${
                      c.passed
                        ? "bg-paper-softSage text-paper-sage dark:bg-charcoal-softSage dark:text-charcoal-sage"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    }`}
                  >
                    {c.severity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={onOpenRoadmap}
                className="px-5 py-2.5 rounded-lg bg-paper-text text-paper-surface dark:bg-charcoal-text dark:text-charcoal-bg text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                View Interactive Roadmap
              </button>
              <button
                onClick={onOpenFamilyRoom}
                className="px-5 py-2.5 rounded-lg border border-paper-border dark:border-charcoal-border text-paper-text dark:text-charcoal-text text-xs font-semibold uppercase tracking-wider hover:bg-paper-secondary dark:hover:bg-charcoal-secondary transition-colors"
              >
                Launch Family Decision Room
              </button>
            </div>
          </div>

          {/* Secondary Recommendations Column */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted">
              Alternative Pathways
            </span>
            {data.recommendations.slice(1).map((rec, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-paper-border dark:border-charcoal-border bg-paper-surface dark:bg-charcoal-surface space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h5 className="text-sm font-medium text-paper-text dark:text-charcoal-text">
                    {rec.career_title}
                  </h5>
                  <span className="text-sm font-mono font-bold text-paper-sage dark:text-charcoal-sage">
                    {rec.match_score}%
                  </span>
                </div>
                <p className="text-xs text-paper-muted dark:text-charcoal-muted">
                  Aptitude Fit: {rec.aptitude_fit_percentage}% | Deductions:{" "}
                  {rec.penalty_deductions}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
