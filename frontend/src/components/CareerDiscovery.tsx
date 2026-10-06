"use client";

import React, { useState } from "react";
import { Zap, Wrench, Cpu, Activity, Sun, Shield } from "lucide-react";

interface CareerCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  nsqfLevel: string;
  demand: string;
  pathsCount: number;
  description: string;
}

const CATEGORIES: CareerCategory[] = [
  {
    id: "auto",
    title: "Automotive & EV Mobility",
    icon: Zap,
    nsqfLevel: "Level 4 - 6",
    demand: "High Regional Demand (+40%)",
    pathsCount: 12,
    description:
      "Electric vehicle powertrain diagnostics, battery management systems, and auto electronics.",
  },
  {
    id: "elec",
    title: "Industrial Automation & Electrical",
    icon: Wrench,
    nsqfLevel: "Level 3 - 5",
    demand: "Steady Industrial Growth",
    pathsCount: 18,
    description:
      "PLC panel wiring, industrial maintenance, motor control systems, and power grid setup.",
  },
  {
    id: "electronics",
    title: "Consumer & Smart Electronics",
    icon: Cpu,
    nsqfLevel: "Level 4",
    demand: "High Employer Demand",
    pathsCount: 14,
    description:
      "PCB micro-soldering, IoT sensor calibration, and electronic equipment diagnostics.",
  },
  {
    id: "solar",
    title: "Renewable Energy & Solar PV",
    icon: Sun,
    nsqfLevel: "Level 4 - 5",
    demand: "National Green Initiative",
    pathsCount: 9,
    description:
      "Rooftop solar installation, inverter grid synchronization, and renewable maintenance.",
  },
  {
    id: "health",
    title: "Healthcare Allied Technical",
    icon: Activity,
    nsqfLevel: "Level 4",
    demand: "Critical Public Need",
    pathsCount: 11,
    description:
      "Dialysis technicians, medical equipment calibration, and radiology assistance.",
  },
  {
    id: "safety",
    title: "Industrial Safety & Quality",
    icon: Shield,
    nsqfLevel: "Level 5",
    demand: "Mandatory Compliance",
    pathsCount: 8,
    description:
      "Workplace hazard inspection, non-destructive testing (NDT), and quality assurance.",
  },
];

export const CareerDiscovery: React.FC<{
  onSelectCategory: (id: string) => void;
}> = ({ onSelectCategory }) => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  return (
    <section className="py-20 border-b border-paper-border dark:border-charcoal-border">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-paper-sage dark:text-charcoal-sage">
              Vocational Knowledge Base
            </span>
            <h2 className="text-3xl md:text-4xl font-normal text-paper-text dark:text-charcoal-text">
              Explore High-Demand Vocational Domains
            </h2>
            <p className="text-sm text-paper-muted dark:text-charcoal-muted max-w-xl">
              All career profiles are mapped directly to MSDE National Skills
              Qualifications Framework (NSQF) levels and NCVT certification
              tracks.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-paper-secondary dark:bg-charcoal-secondary p-1 rounded-lg border border-paper-border dark:border-charcoal-border text-xs">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                selectedFilter === "all"
                  ? "bg-paper-surface dark:bg-charcoal-surface text-paper-text dark:text-charcoal-text shadow-sm"
                  : "text-paper-muted dark:text-charcoal-muted hover:text-paper-text"
              }`}
            >
              All Domains
            </button>
            <button
              onClick={() => setSelectedFilter("high-demand")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                selectedFilter === "high-demand"
                  ? "bg-paper-surface dark:bg-charcoal-surface text-paper-text dark:text-charcoal-text shadow-sm"
                  : "text-paper-muted dark:text-charcoal-muted hover:text-paper-text"
              }`}
            >
              High Demand Only
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group p-6 rounded-xl border border-paper-border dark:border-charcoal-border bg-paper-surface dark:bg-charcoal-surface hover:border-paper-sage dark:hover:border-charcoal-sage transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-paper-secondary dark:bg-charcoal-secondary flex items-center justify-center text-paper-sage dark:text-charcoal-sage group-hover:bg-paper-softSage dark:group-hover:bg-charcoal-softSage transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-paper-secondary dark:bg-charcoal-secondary text-paper-muted dark:text-charcoal-muted">
                      {cat.nsqfLevel}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-paper-text dark:text-charcoal-text group-hover:text-paper-sage dark:group-hover:text-charcoal-sage transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-paper-muted dark:text-charcoal-muted mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-paper-border dark:border-charcoal-border flex items-center justify-between text-xs font-mono">
                  <span className="text-paper-sage dark:text-charcoal-sage font-medium">
                    {cat.demand}
                  </span>
                  <span className="text-paper-muted dark:text-charcoal-muted">
                    {cat.pathsCount} Pathways →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
