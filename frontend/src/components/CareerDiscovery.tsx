"use client";

import React, { useState } from "react";
import { Zap, Wrench, Cpu, Activity, Sun, Shield, Search, ArrowRight } from "lucide-react";

interface CareerCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  nsqfLevel: string;
  demand: string;
  description: string;
}

const DEFAULT_CATEGORIES: CareerCategory[] = [
  { id: "Automotive & EV Mobility", title: "Automotive & EV Mobility", icon: Zap, nsqfLevel: "Level 4-6", demand: "High Demand (+40%)", description: "EV powertrain diagnostics, battery management, and auto electronics." },
  { id: "Industrial Automation", title: "Industrial Automation & Electrical", icon: Wrench, nsqfLevel: "Level 3-5", demand: "Steady Growth", description: "PLC panel wiring, industrial maintenance, and motor control systems." },
  { id: "Electronics", title: "Consumer & Smart Electronics", icon: Cpu, nsqfLevel: "Level 4", demand: "High Demand", description: "PCB micro-soldering, IoT sensor calibration, and equipment repair." },
  { id: "Renewable Energy", title: "Renewable Energy & Solar PV", icon: Sun, nsqfLevel: "Level 4-5", demand: "Green Initiative", description: "Rooftop solar installation, inverter grid setup, and maintenance." },
  { id: "Healthcare Allied", title: "Healthcare Allied Technical", icon: Activity, nsqfLevel: "Level 4", demand: "Critical Need", description: "Dialysis technicians, medical calibration, and radiology support." },
  { id: "Industrial Safety", title: "Industrial Safety & Quality", icon: Shield, nsqfLevel: "Level 5", demand: "Mandatory Compliance", description: "Workplace hazard inspection, quality assurance, and non-destructive testing." },
];

export const CareerDiscovery: React.FC<{ onSelectCategory: (domain: string) => void }> = ({ onSelectCategory }) => {
  const [customDomain, setCustomDomain] = useState("");

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDomain.trim()) {
      onSelectCategory(customDomain.trim());
    }
  };

  return (
    <section className="py-16 border-b border-paper-border dark:border-charcoal-border max-w-7xl mx-auto px-6 space-y-12">
      {/* Custom Domain Input Bar */}
      <div className="p-8 rounded-xl border border-paper-border dark:border-charcoal-border bg-paper-surface dark:bg-charcoal-surface space-y-4 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-paper-sage dark:text-charcoal-sage">
            Custom Career Discovery
          </span>
          <h3 className="text-xl font-normal text-paper-text dark:text-charcoal-text">
            Looking for a specific trade or skill domain?
          </h3>
          <p className="text-xs text-paper-muted dark:text-charcoal-muted">
            Type any trade (e.g. <i>Plumbing, Culinary Arts, HVAC Repair, Animation, Textile Design</i>) to generate a customized scenario assessment.
          </p>
        </div>

        <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-muted dark:text-charcoal-muted" />
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="Enter trade or sector (e.g. Mobile Hardware Repairing)..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-paper-border dark:border-charcoal-border bg-paper-bg dark:bg-charcoal-bg text-sm text-paper-text dark:text-charcoal-text focus:outline-none focus:border-paper-sage dark:focus:border-charcoal-sage"
            />
          </div>
          <button
            type="submit"
            disabled={!customDomain.trim()}
            className="px-6 py-3 rounded-lg bg-paper-text text-paper-surface dark:bg-charcoal-text dark:text-charcoal-bg text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center space-x-2 shrink-0"
          >
            <span>Assess Domain</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Default Domain Cards */}
      <div className="space-y-6">
        <h3 className="text-lg font-normal text-paper-text dark:text-charcoal-text">
          Or Select From High-Demand National Sectors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEFAULT_CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group p-6 rounded-xl border border-paper-border dark:border-charcoal-border bg-paper-surface dark:bg-charcoal-surface hover:border-paper-sage dark:hover:border-charcoal-sage transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-paper-secondary dark:bg-charcoal-secondary flex items-center justify-center text-paper-sage dark:text-charcoal-sage">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-paper-secondary dark:bg-charcoal-secondary text-paper-muted dark:text-charcoal-muted">
                      {cat.nsqfLevel}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-medium text-paper-text dark:text-charcoal-text group-hover:text-paper-sage transition-colors">
                      {cat.title}
                    </h4>
                    <p className="text-xs text-paper-muted dark:text-charcoal-muted mt-1.5 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-paper-border dark:border-charcoal-border flex items-center justify-between text-xs font-mono">
                  <span className="text-paper-sage dark:text-charcoal-sage">{cat.demand}</span>
                  <span className="text-paper-muted">Assess Trade →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};