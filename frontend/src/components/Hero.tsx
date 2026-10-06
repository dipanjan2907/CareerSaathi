"use client";

import React from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Cpu } from "lucide-react";

export const Hero: React.FC<{ onStart: () => void; onExplore: () => void }> = ({
  onStart,
  onExplore,
}) => {
  return (
    <section className="py-20 md:py-28 border-b border-paper-border dark:border-charcoal-border">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-paper-secondary dark:bg-charcoal-secondary border border-paper-border dark:border-charcoal-border text-xs text-paper-muted dark:text-charcoal-muted">
            <span className="w-2 h-2 rounded-full bg-paper-sage dark:bg-charcoal-sage" />
            <span>Ministry of Skill Development & Entrepreneurship</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-normal tracking-tight text-paper-text dark:text-charcoal-text leading-[1.15]">
            A clearer path to the career you{" "}
            <span className="font-serif italic font-normal">actually</span>{" "}
            want.
          </h1>

          <p className="text-lg text-paper-muted dark:text-charcoal-muted max-w-2xl leading-relaxed font-normal">
            A deterministic career decision engine that maps practical
            competencies, budget constraints, and regional market
            demands—explained transparently for students and families.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <button
              onClick={onStart}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg bg-paper-text text-paper-surface dark:bg-charcoal-text dark:text-charcoal-bg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <span>Take Scenario Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExplore}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg border border-paper-border dark:border-charcoal-border text-paper-text dark:text-charcoal-text font-medium text-sm hover:bg-paper-secondary dark:hover:bg-charcoal-secondary transition-colors"
            >
              Explore Vocational Tracks
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-paper-border dark:border-charcoal-border text-xs text-paper-muted dark:text-charcoal-muted">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-paper-sage dark:text-charcoal-sage shrink-0" />
              <span>NSQF Aligned</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-paper-sage dark:text-charcoal-sage shrink-0" />
              <span>Constraint-Checked</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-paper-sage dark:text-charcoal-sage shrink-0" />
              <span>No AI Hallucinations</span>
            </div>
          </div>
        </div>

        {/* Minimal Editorial Visual Element */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-xl border border-paper-border dark:border-charcoal-border bg-paper-surface dark:bg-charcoal-surface shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-paper-border dark:border-charcoal-border">
              <span className="text-xs uppercase tracking-wider font-mono text-paper-muted dark:text-charcoal-muted">
                Decision Vector Preview
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-paper-softSage text-paper-sage dark:bg-charcoal-softSage dark:text-charcoal-sage font-mono">
                Student #26241
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-paper-text dark:text-charcoal-text">
                    Mechanical Aptitude
                  </span>
                  <span className="font-mono text-paper-sage dark:text-charcoal-sage">
                    88%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-paper-secondary dark:bg-charcoal-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-paper-sage dark:bg-charcoal-sage w-[88%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-paper-text dark:text-charcoal-text">
                    Spatial Reasoning
                  </span>
                  <span className="font-mono text-paper-sage dark:text-charcoal-sage">
                    91%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-paper-secondary dark:bg-charcoal-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-paper-sage dark:bg-charcoal-sage w-[91%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-paper-text dark:text-charcoal-text">
                    Hands-On Preference
                  </span>
                  <span className="font-mono text-paper-sage dark:text-charcoal-sage">
                    94%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-paper-secondary dark:bg-charcoal-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-paper-sage dark:bg-charcoal-sage w-[94%]" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-paper-secondary dark:bg-charcoal-secondary border border-paper-border dark:border-charcoal-border space-y-2">
              <div className="text-xs font-semibold uppercase text-paper-muted dark:text-charcoal-muted">
                Top Calculated Alignment
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-paper-text dark:text-charcoal-text">
                  EV Service Specialist
                </span>
                <span className="text-sm font-mono font-bold text-paper-sage dark:text-charcoal-sage">
                  89.2% Match
                </span>
              </div>
              <p className="text-xs text-paper-muted dark:text-charcoal-muted leading-relaxed pt-1">
                Matched via vector similarity. Financial constraint check passed
                (Under ₹50,000 budget threshold).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
