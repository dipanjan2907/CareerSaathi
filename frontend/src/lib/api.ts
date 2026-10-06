const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// --- Authentication Types ---

export interface CaptchaData {
  captcha_token: string;
  svg_data: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: "student" | "parent";
  user_id: string;
  full_name: string;
  student_id: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
  captcha_token: string;
  captcha_answer: string;
}

export interface RegistrationPayload extends LoginPayload {
  full_name: string;
  role: "student" | "parent";
  state?: string;
  district?: string;
  max_family_budget: number;
  max_duration_months?: number;
  preferred_work_environment?: "hands_on" | "indoor" | "outdoor";
}

// --- Assessment Types ---

export interface ScenarioOption {
  option_key: string;
  option_text: string;
  competency_impacts: Record<string, number>;
}

export interface GeneratedScenario {
  scenario_id: string;
  sector: string;
  scenario_title: string;
  scenario_description: string;
  options: ScenarioOption[];
}

export interface AssessmentSubmissionResponse {
  student_id: string;
  competency_vector: Record<string, number>;
}

// --- Decision & Career Types ---

export interface Recommendation {
  career_id: string;
  career_title: string;
  match_score: number;
  aptitude_fit_percentage: number;
  penalty_deductions: number;
  strengths: string[];
  skill_gaps: string[];
  constraint_evaluations: ConstraintEvaluation[];
}

export interface ConstraintEvaluation {
  constraint_type: string;
  passed: boolean;
  severity: string;
  message: string;
}

export interface DecisionResponse {
  student_id: string;
  confidence_score: number;
  confidence_rating: string;
  recommendations: Recommendation[];
  counselling_explanation: string;
}

export interface CareerGraphNode {
  id: string;
  label: string;
  sector: string;
  nsqf_level: number;
  avg_salary: number;
}

export interface CareerRoadmapResponse {
  root_career_id: string;
  nodes: CareerGraphNode[];
  edges: { source: string; target: string }[];
}

export interface MediationPayload {
  student_id: string;
  student_preferred_career_id: string;
  family_preferred_career_id: string;
}

export interface MediationResponse {
  student_career_title: string;
  family_career_title: string;
  tradeoffs: {
    factor_name: string;
    option_a_value: string;
    option_b_value: string;
    favorable_option: string;
  }[];
  neutral_mediation_summary: string;
}

// --- Authentication Endpoints ---

export async function fetchCaptcha(): Promise<CaptchaData> {
  const res = await fetch(`${API_BASE_URL}/auth/captcha`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load CAPTCHA");
  return res.json();
}

export async function registerUser(
  payload: RegistrationPayload,
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Registration failed");
  return data;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  return data;
}

// --- Assessment Endpoints (Original Names Restored) ---

export async function fetchDynamicScenario(
  sector: string,
): Promise<GeneratedScenario> {
  const res = await fetch(
    `${API_BASE_URL}/assessment/generate-scenario?sector=${encodeURIComponent(sector)}`,
    { cache: "no-store" },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to fetch scenario");
  return data;
}

// Alias kept for backward compatibility
export const fetchScenario = fetchDynamicScenario;

export async function submitAssessmentAnswers(
  studentId: string,
  selectedOptionKeys: string[],
): Promise<AssessmentSubmissionResponse> {
  const res = await fetch(`${API_BASE_URL}/assessment/${studentId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ selected_option_keys: selectedOptionKeys }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to submit assessment");
  return data;
}

// Alias kept for backward compatibility
export const submitAssessmentResponses = submitAssessmentAnswers;

// --- Decision & Career Endpoints ---

export async function fetchDecisionEvaluation(
  studentId: string,
): Promise<DecisionResponse> {
  const res = await fetch(`${API_BASE_URL}/decision/${studentId}/evaluate`, {
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.detail || "Failed to fetch decision evaluation");
  return data;
}

export async function fetchCareerRoadmap(
  careerId: string,
): Promise<CareerRoadmapResponse> {
  const res = await fetch(`${API_BASE_URL}/careers/${careerId}/roadmap`, {
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to fetch career roadmap");
  return data;
}

export async function submitFamilyMediation(
  payload: MediationPayload,
  language: string = "English",
): Promise<MediationResponse> {
  const res = await fetch(
    `${API_BASE_URL}/family/mediate?language=${encodeURIComponent(language)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Family mediation failed");
  return data;
}
