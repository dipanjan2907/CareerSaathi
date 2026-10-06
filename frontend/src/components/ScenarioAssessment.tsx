"use client";

import React, { useState, useEffect } from "react";
import {
  fetchDynamicScenario,
  submitAssessmentAnswers,
  GeneratedScenario,
} from "../lib/api";
import { ArrowLeft, Check, Sparkles, Loader2 } from "lucide-react";

export const ScenarioAssessment: React.FC<{
  studentId: string;
  sector: string;
  onComplete: () => void;
  onBack: () => void;
}> = ({ studentId, sector, onComplete, onBack }) => {
  const [scenario, setScenario] = useState<GeneratedScenario | null>(null);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadScenario() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDynamicScenario(sector);
        setScenario(data);
      } catch {
        setError("Failed to load assessment question from backend.");
      } finally {
        setLoading(false);
      }
    }
    loadScenario();
  }, [sector]);

  const handleSubmitChoice = async () => {
    if (!selectedKey || !scenario) return;
    try {
      setSubmitting(true);
      await submitAssessmentAnswers(studentId, [selectedKey]);
      onComplete();
    } catch {
      setError("Error submitting response to decision engine.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-paper-sage dark:text-charcoal-sage" />
        <p className="text-sm font-mono text-paper-muted dark:text-charcoal-muted">
          Generating AI Scenario Assessment for {sector}...
        </p>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="py-16 max-w-lg mx-auto text-center space-y-4">
        <p className="text-sm text-red-600 dark:text-red-400 font-mono">
          {error}
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded bg-paper-secondary dark:bg-charcoal-secondary text-xs uppercase font-mono"
        >
          Return to Navigation
        </button>
      </div>
    );
  }

  return (
    <section className="py-16 max-w-4xl mx-auto px-6">
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-paper-border dark:border-charcoal-border pb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted hover:text-paper-text"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Assessment</span>
          </button>
          <div className="text-xs font-mono text-paper-sage dark:text-charcoal-sage">
            Sector: {scenario.sector}
          </div>
        </div>

        <div className="p-8 rounded-xl border border-paper-border dark:border-charcoal-border bg-paper-surface dark:bg-charcoal-surface space-y-6">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-paper-secondary dark:bg-charcoal-secondary text-xs font-mono text-paper-muted dark:text-charcoal-muted">
            <Sparkles className="w-3.5 h-3.5 text-paper-sage dark:text-charcoal-sage" />
            <span>{scenario.scenario_title}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-normal text-paper-text dark:text-charcoal-text leading-relaxed">
            {scenario.scenario_description}
          </h3>

          <div className="space-y-3 pt-4">
            {scenario.options.map((opt) => {
              const isSelected = selectedKey === opt.option_key;
              return (
                <div
                  key={opt.option_key}
                  onClick={() => setSelectedKey(opt.option_key)}
                  className={`p-5 rounded-lg border transition-all cursor-pointer flex items-start justify-between ${
                    isSelected
                      ? "border-paper-sage dark:border-charcoal-sage bg-paper-softSage/30 dark:bg-charcoal-softSage/30"
                      : "border-paper-border dark:border-charcoal-border hover:bg-paper-secondary dark:hover:bg-charcoal-secondary"
                  }`}
                >
                  <p className="text-sm font-medium text-paper-text dark:text-charcoal-text pr-4">
                    {opt.option_text}
                  </p>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? "border-paper-sage bg-paper-sage text-white dark:border-charcoal-sage dark:bg-charcoal-sage dark:text-charcoal-bg"
                        : "border-paper-border dark:border-charcoal-border"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 flex justify-end">
            <button
              disabled={!selectedKey || submitting}
              onClick={handleSubmitChoice}
              className={`px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-opacity flex items-center space-x-2 ${
                selectedKey && !submitting
                  ? "bg-paper-text text-paper-surface dark:bg-charcoal-text dark:text-charcoal-bg hover:opacity-90"
                  : "bg-paper-secondary text-paper-muted dark:bg-charcoal-secondary dark:text-charcoal-muted cursor-not-allowed"
              }`}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {submitting
                  ? "Calculating Vector..."
                  : "Submit Response to Engine"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
