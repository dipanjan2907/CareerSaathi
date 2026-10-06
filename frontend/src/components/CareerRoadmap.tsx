"use client";

import React, { useState, useEffect } from "react";
import { fetchCareerRoadmap, CareerRoadmapResponse } from "../lib/api";
import { Award, Loader2 } from "lucide-react";

export const CareerRoadmap: React.FC<{ careerId: string }> = ({ careerId }) => {
  const [data, setData] = useState<CareerRoadmapResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRoadmap() {
      try {
        setLoading(true);
        const result = await fetchCareerRoadmap(careerId);
        setData(result);
      } catch {
        setError("Could not load career graph roadmap from database.");
      } finally {
        setLoading(false);
      }
    }
    loadRoadmap();
  }, [careerId]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-paper-sage dark:text-charcoal-sage" />
        <p className="text-sm font-mono text-paper-muted dark:text-charcoal-muted">
          Traversing Career Knowledge Graph...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-16 text-center text-sm font-mono text-red-500">
        {error || "Graph roadmap unavailable."}
      </div>
    );
  }

  return (
    <section className="py-16 max-w-4xl mx-auto px-6 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-paper-sage dark:text-charcoal-sage">
          Live Graph Progression
        </span>
        <h2 className="text-3xl font-normal text-paper-text dark:text-charcoal-text">
          Career Path Transition Roadmap
        </h2>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-paper-border dark:before:bg-charcoal-border">
        {data.nodes.map((node, idx) => (
          <div key={node.id} className="relative pl-12 space-y-3">
            <div className="absolute left-3.5 top-1.5 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-paper-sage bg-paper-surface dark:border-charcoal-sage dark:bg-charcoal-surface flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-paper-sage dark:bg-charcoal-sage" />
            </div>

            <div className="p-6 rounded-xl border border-paper-border dark:border-charcoal-border bg-paper-surface dark:bg-charcoal-surface space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-paper-sage dark:text-charcoal-sage">
                  Node #{idx + 1}
                </span>
                <span className="text-paper-muted dark:text-charcoal-muted font-bold">
                  Avg Salary: ₹{node.avg_salary.toLocaleString("en-IN")}/mo
                </span>
              </div>

              <h4 className="text-lg font-medium text-paper-text dark:text-charcoal-text">
                {node.label}
              </h4>

              <div className="inline-flex items-center space-x-2 text-xs font-mono px-2.5 py-1 rounded bg-paper-secondary dark:bg-charcoal-secondary text-paper-muted dark:text-charcoal-muted">
                <Award className="w-3.5 h-3.5 text-paper-sage dark:text-charcoal-sage" />
                <span>
                  NSQF Level {node.nsqf_level} ({node.sector})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
