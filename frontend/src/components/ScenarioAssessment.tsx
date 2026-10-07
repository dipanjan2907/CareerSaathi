"use client";

import React, { useState, useEffect } from "react";
import { fetchDynamicScenario, submitAssessmentAnswers, ScenarioItem } from "../lib/api";
import { ArrowLeft, ArrowRight, Check, Sparkles, Loader2 } from "lucide-react";

export const ScenarioAssessment: React.FC<{
  studentId: string;
  sector: string;
  onComplete: () => void;
  onBack: () => void;
}> = ({ studentId, sector, onComplete, onBack }) => {
  const [scenarios, setScenarios] = useState<ScenarioItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadScenarios() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDynamicScenario(sector);
        
        // Support both batch format and single scenario fallback
        if (data.scenarios && Array.isArray(data.scenarios)) {
          setScenarios(data.scenarios);
        } else if ((data as any).scenario_title) {
          setScenarios([data as any]);
        } else {
          throw new Error("Invalid scenario format returned.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load 10-question assessment suite.");
      } finally {
        setLoading(false);
      }
    }
    loadScenarios();
  }, [sector]);

  const currentQ = scenarios[currentIdx];
  const selectedKeyForCurrent = selectedAnswers[currentIdx] || "";

  const handleSelectOption = (key: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: key }));
  };

  const handleNext = () => {
    if (currentIdx < scenarios.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSubmitAllAnswers = async () => {
    const chosenKeys = Object.values(selectedAnswers);
    if (chosenKeys.length < scenarios.length) return;

    try {
      setSubmitting(true);
      // Submit all 10 selected option keys to FastAPI backend
      await submitAssessmentAnswers(studentId, chosenKeys);
      onComplete();
    } catch (err: any) {
      setError(err.message || "Error submitting responses to decision engine.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-paper-sage dark:text-charcoal-sage" />
        <p className="text-sm font-mono text-paper-muted dark:text-charcoal-muted">
          Generating 10-Question Micro-Assessment for <b>{sector}</b>...
        </p>
      </div>
    );
  }

  if (error || scenarios.length === 0) {
    return (
      <div className="py-16 max-w-lg mx-auto text-center space-y-4">
        <p className="text-sm text-red-600 dark:text-red-400 font-mono">{error}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded bg-paper-secondary dark:bg-charcoal-secondary text-xs uppercase font-mono"
        >
          Return to Navigation
        </button>
      </div>
    );
  }

  const progressPercentage = ((currentIdx + 1) / scenarios.length) * 100;
  const isLastQuestion = currentIdx === scenarios.length - 1;
  const totalAnswered = Object.keys(selectedAnswers).length;

  return (
    <section className="py-16 max-w-4xl mx-auto px-6">
      <div className="space-y-8">
        {/* Navigation & Counter Header */}
        <div className="flex items-center justify-between border-b border-paper-border dark:border-charcoal-border pb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted hover:text-paper-text"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Assessment</span>
          </button>
          <div className="text-xs font-mono text-paper-sage dark:text-charcoal-sage font-bold">
            Question {currentIdx + 1} of {scenarios.length}
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-paper-muted dark:text-charcoal-muted">
            <span>Progress</span>
            <span>{totalAnswered} / {scenarios.length} Answered</span>
          </div>
          <div className="h-2 w-full bg-paper-secondary dark:bg-charcoal-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-paper-sage dark:bg-charcoal-sage transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="p-8 rounded-xl border border-paper-border dark:border-charcoal-border bg-paper-surface dark:bg-charcoal-surface space-y-6 shadow-sm">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-paper-secondary dark:bg-charcoal-secondary text-xs font-mono text-paper-muted dark:text-charcoal-muted">
            <Sparkles className="w-3.5 h-3.5 text-paper-sage dark:text-charcoal-sage" />
            <span>{currentQ.scenario_title}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-normal text-paper-text dark:text-charcoal-text leading-relaxed">
            {currentQ.scenario_description}
          </h3>

          {/* Options List */}
          <div className="space-y-3 pt-4">
            {currentQ.options.map((opt) => {
              const isSelected = selectedKeyForCurrent === opt.option_key;
              return (
                <div
                  key={opt.option_key}
                  onClick={() => handleSelectOption(opt.option_key)}
                  className={`p-5 rounded-lg border transition-all cursor-pointer flex items-start justify-between ${
                    isSelected
                      ? "border-paper-sage dark:border-charcoal-sage bg-paper-softSage/30 dark:bg-charcoal-softSage/30"
                      : "border-paper-border dark:border-charcoal-border hover:bg-paper-secondary dark:hover:bg-charcoal-secondary"
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <span className="text-xs font-mono uppercase text-paper-sage dark:text-charcoal-sage block">
                      Option {opt.option_key}
                    </span>
                    <p className="text-sm font-medium text-paper-text dark:text-charcoal-text">
                      {opt.option_text}
                    </p>
                  </div>
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

          {/* Pagination & Submission Controls */}
          <div className="pt-6 border-t border-paper-border dark:border-charcoal-border flex items-center justify-between">
            <button
              disabled={currentIdx === 0}
              onClick={handlePrev}
              className="px-4 py-2 rounded border border-paper-border dark:border-charcoal-border text-xs font-mono uppercase disabled:opacity-40"
            >
              Previous
            </button>

            {isLastQuestion ? (
              <button
                disabled={totalAnswered < scenarios.length || submitting}
                onClick={handleSubmitAllAnswers}
                className={`px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-opacity flex items-center space-x-2 ${
                  totalAnswered === scenarios.length && !submitting
                    ? "bg-paper-text text-paper-surface dark:bg-charcoal-text dark:text-charcoal-bg hover:opacity-90"
                    : "bg-paper-secondary text-paper-muted dark:bg-charcoal-secondary dark:text-charcoal-muted cursor-not-allowed"
                }`}
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{submitting ? "Processing 10 Vectors..." : "Calculate Final Decision Profile"}</span>
              </button>
            ) : (
              <button
                disabled={!selectedKeyForCurrent}
                onClick={handleNext}
                className={`px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 ${
                  selectedKeyForCurrent
                    ? "bg-paper-text text-paper-surface dark:bg-charcoal-text dark:text-charcoal-bg hover:opacity-90"
                    : "bg-paper-secondary text-paper-muted cursor-not-allowed"
                }`}
              >
                <span>Next Scenario</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};