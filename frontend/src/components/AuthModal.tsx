"use client";

import React, { useState, useEffect } from "react";
import {
  fetchCaptcha,
  loginUser,
  registerUser,
  CaptchaData,
  RegistrationPayload,
} from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<"student" | "parent">("student");

  // Dynamic user input state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [stateName, setStateName] = useState("");
  const [district, setDistrict] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [maxDurationMonths, setMaxDurationMonths] = useState("");
  const [preferredWorkEnvironment, setPreferredWorkEnvironment] = useState<
    "hands_on" | "indoor" | "outdoor"
  >("hands_on");
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const [captcha, setCaptcha] = useState<CaptchaData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadCaptcha = async () => {
    try {
      const data = await fetchCaptcha();
      setCaptcha(data);
      setCaptchaAnswer("");
    } catch {
      setError("Failed to load security CAPTCHA.");
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    fetchCaptcha()
      .then((data) => {
        if (!cancelled) {
          setCaptcha(data);
          setCaptchaAnswer("");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load security CAPTCHA.");
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, isRegister]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!captcha) throw new Error("CAPTCHA system unavailable");

      let response;
      if (isRegister) {
        const payload: RegistrationPayload = {
          email: email.trim(),
          password: password,
          full_name: fullName.trim(),
          role,
          captcha_token: captcha.captcha_token,
          captcha_answer: captchaAnswer.trim(),
          max_family_budget: Number(maxBudget),
          state: role === "student" ? stateName.trim() : undefined,
          district: role === "student" ? district.trim() : undefined,
          max_duration_months:
            role === "student" ? Number(maxDurationMonths) : undefined,
          preferred_work_environment:
            role === "student" ? preferredWorkEnvironment : undefined,
        };
        response = await registerUser(payload);
      } else {
        response = await loginUser({
          email: email.trim(),
          password: password,
          captcha_token: captcha.captcha_token,
          captcha_answer: captchaAnswer.trim(),
        });
      }

      login(response);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
      loadCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-paper-card dark:bg-charcoal-card p-6 border border-paper-border dark:border-charcoal-border text-paper-text dark:text-charcoal-text shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-paper-border dark:border-charcoal-border pb-3">
          <h2 className="text-lg font-bold font-mono">
            {isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
          </h2>
          <button
            onClick={handleClose}
            className="text-paper-muted dark:text-charcoal-muted hover:text-paper-text dark:hover:text-charcoal-text text-sm font-mono"
          >
            [ESC]
          </button>
        </div>

        {error && (
          <div className="mb-4 text-xs font-mono text-red-500 bg-red-950/20 p-3 rounded border border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted mb-1">
                  User Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`py-2 rounded text-xs font-mono font-bold border transition-colors ${
                      role === "student"
                        ? "bg-paper-sage dark:bg-charcoal-sage text-white"
                        : "border-paper-border dark:border-charcoal-border text-paper-muted dark:text-charcoal-muted  border-transparent"
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("parent")}
                    className={`py-2 rounded text-xs font-mono font-bold border transition-colors ${
                      role === "parent"
                        ? "bg-paper-terracotta dark:bg-charcoal-terracotta text-white "
                        : "border-paper-border dark:border-charcoal-border text-paper-muted dark:text-charcoal-muted border-transparent"
                    }`}
                  >
                    Parent / Guardian
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-paper-bg dark:bg-charcoal-bg border border-paper-border dark:border-charcoal-border rounded p-2.5 text-sm focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              {role === "student" ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full bg-paper-bg dark:bg-charcoal-bg border border-paper-border dark:border-charcoal-border rounded p-2.5 text-sm focus:outline-none"
                        placeholder="Enter your state"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted mb-1">
                        District
                      </label>
                      <input
                        type="text"
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-paper-bg dark:bg-charcoal-bg border border-paper-border dark:border-charcoal-border rounded p-2.5 text-sm focus:outline-none"
                        placeholder="Enter your district"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted mb-1">
                        Annual Training Budget (INR)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                        className="w-full bg-paper-bg dark:bg-charcoal-bg border border-paper-border dark:border-charcoal-border rounded p-2.5 text-sm focus:outline-none"
                        placeholder="Enter your budget"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted mb-1">
                        Maximum Duration (months)
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        step="1"
                        value={maxDurationMonths}
                        onChange={(e) => setMaxDurationMonths(e.target.value)}
                        className="w-full bg-paper-bg dark:bg-charcoal-bg border border-paper-border dark:border-charcoal-border rounded p-2.5 text-sm focus:outline-none"
                        placeholder="Enter months"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted mb-1">
                      Preferred Work Environment
                    </label>
                    <select
                      required
                      value={preferredWorkEnvironment}
                      onChange={(e) =>
                        setPreferredWorkEnvironment(
                          e.target.value as "hands_on" | "indoor" | "outdoor",
                        )
                      }
                      className="w-full bg-paper-bg dark:bg-charcoal-bg border border-paper-border dark:border-charcoal-border rounded p-2.5 text-sm focus:outline-none"
                    >
                      <option value="hands_on">Hands-on</option>
                      <option value="indoor">Indoor</option>
                      <option value="outdoor">Outdoor</option>
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted mb-1">
                    Max Annual Skill Training Budget (INR)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="w-full bg-paper-bg dark:bg-charcoal-bg border border-paper-border dark:border-charcoal-border rounded p-2.5 text-sm focus:outline-none"
                    placeholder="Enter your budget"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-paper-bg dark:bg-charcoal-bg border border-paper-border dark:border-charcoal-border rounded p-2.5 text-sm focus:outline-none"
              placeholder="you@domain.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted mb-1">
              Password
            </label>
            <input
              type="password"
              required
              maxLength={72}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-paper-bg dark:bg-charcoal-bg border border-paper-border dark:border-charcoal-border rounded p-2.5 text-sm focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="bg-paper-bg/50 dark:bg-charcoal-bg/50 p-3 rounded border border-paper-border dark:border-charcoal-border space-y-2">
            <span className="block text-xs font-mono uppercase text-paper-muted dark:text-charcoal-muted">
              Security Verification
            </span>
            <div className="flex items-center gap-3">
              {captcha?.svg_data && (
                <div
                  className="rounded overflow-hidden cursor-pointer border border-paper-border dark:border-charcoal-border"
                  title="Click to refresh CAPTCHA"
                  onClick={loadCaptcha}
                  dangerouslySetInnerHTML={{ __html: captcha.svg_data }}
                />
              )}
              <input
                type="text"
                required
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                className="w-24 bg-paper-bg dark:bg-charcoal-bg border border-paper-border dark:border-charcoal-border rounded p-2.5 text-center text-sm font-bold font-mono focus:outline-none"
                placeholder="Result"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded text-xs font-mono font-bold uppercase tracking-wider bg-paper-sage dark:bg-charcoal-sage text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading
              ? "Authenticating..."
              : isRegister
                ? "Register Account"
                : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center text-xs font-mono text-paper-muted dark:text-charcoal-muted">
          {isRegister ? "Already registered?" : "Need an account?"}{" "}
          <button
            onClick={() => {
              setError(null);
              setIsRegister(!isRegister);
            }}
            className="underline font-bold text-paper-text dark:text-charcoal-text"
          >
            {isRegister ? "Sign In" : "Register Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
