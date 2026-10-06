"use client";

import React, { useState } from "react";
import {
  Recommendation,
  submitFamilyMediation,
  MediationResponse,
} from "../lib/api";
import { Users, Scale, AlertCircle } from "lucide-react";

export const FamilyDecisionRoom: React.FC<{
  studentId: string;
  careerOptions: Recommendation[];
}> = ({ studentId, careerOptions }) => {
  const [studentChoice, setStudentChoice] = useState(
    careerOptions[0]?.career_id ?? "",
  );
  const [familyChoice, setFamilyChoice] = useState(
    careerOptions[1]?.career_id ?? careerOptions[0]?.career_id ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MediationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMediate = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await submitFamilyMediation({
        student_id: studentId,
        student_preferred_career_id: studentChoice,
        family_preferred_career_id: familyChoice,
      });
      setResult(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Family mediation failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 max-w-5xl mx-auto px-6 space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-paper-secondary dark:bg-charcoal-secondary border border-paper-border dark:border-charcoal-border text-xs text-paper-muted dark:text-charcoal-muted">
          <Users className="w-3.5 h-3.5 text-paper-sage dark:text-charcoal-sage" />
          <span>Core PS Feature: Multi-Stakeholder Support</span>
        </div>
        <h2 className="text-3xl font-normal text-paper-text dark:text-charcoal-text">
          Family Decision Room
        </h2>
        <p className="text-sm text-paper-muted dark:text-charcoal-muted max-w-2xl">
          Compare student career preferences directly against parent
          aspirations. The AI acts as a neutral mediator—surfacing cost,
          duration, and aptitude trade-offs without judgment.
        </p>
      </div>

      {/* Input Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl border border-paper-border dark:border-charcoal-border bg-paper-surface dark:bg-charcoal-surface">
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted">
            Student Preferred Career
          </label>
          <select
            value={studentChoice}
            onChange={(e) => setStudentChoice(e.target.value)}
            className="w-full p-3 rounded-lg border border-paper-border dark:border-charcoal-border bg-paper-bg dark:bg-charcoal-bg text-sm text-paper-text dark:text-charcoal-text focus:outline-none"
          >
            {careerOptions.map((career) => (
              <option key={career.career_id} value={career.career_id}>
                {career.career_title}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted">
            Parent / Family Preferred Pathway
          </label>
          <select
            value={familyChoice}
            onChange={(e) => setFamilyChoice(e.target.value)}
            className="w-full p-3 rounded-lg border border-paper-border dark:border-charcoal-border bg-paper-bg dark:bg-charcoal-bg text-sm text-paper-text dark:text-charcoal-text focus:outline-none"
          >
            {careerOptions.map((career) => (
              <option key={career.career_id} value={career.career_id}>
                {career.career_title}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 pt-2">
          <button
            onClick={handleMediate}
            disabled={loading || !studentChoice || !familyChoice}
            className="w-full py-3.5 rounded-lg bg-paper-text text-paper-surface dark:bg-charcoal-text dark:text-charcoal-bg font-medium text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
          >
            <Scale className="w-4 h-4" />
            <span>
              {loading
                ? "Calculating Trade-Offs..."
                : "Generate Neutral Trade-off Comparison"}
            </span>
          </button>
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* Side-by-Side Trade-off Output Table */}
      {result && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-paper-border dark:border-charcoal-border bg-paper-surface dark:bg-charcoal-surface space-y-4">
            <h4 className="text-sm font-mono uppercase text-paper-sage dark:text-charcoal-sage">
              Neutral Family AI Mediation Summary
            </h4>
            <p className="text-sm text-paper-text dark:text-charcoal-text leading-relaxed bg-paper-secondary dark:bg-charcoal-secondary p-5 rounded-lg border border-paper-border dark:border-charcoal-border">
              {result.neutral_mediation_summary}
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-paper-border dark:border-charcoal-border bg-paper-surface dark:bg-charcoal-surface">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-paper-border dark:border-charcoal-border bg-paper-secondary dark:bg-charcoal-secondary text-paper-muted dark:text-charcoal-muted font-mono">
                  <th className="p-4">Decision Factor</th>
                  <th className="p-4">
                    {result.student_career_title} (Student)
                  </th>
                  <th className="p-4">{result.family_career_title} (Family)</th>
                  <th className="p-4">Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-border dark:divide-charcoal-border text-paper-text dark:text-charcoal-text">
                {result.tradeoffs.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-paper-secondary/50 dark:hover:bg-charcoal-secondary/50"
                  >
                    <td className="p-4 font-medium">{row.factor_name}</td>
                    <td className="p-4 font-mono">{row.option_a_value}</td>
                    <td className="p-4 font-mono">{row.option_b_value}</td>
                    <td className="p-4 font-mono text-paper-sage dark:text-charcoal-sage">
                      {row.favorable_option}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
