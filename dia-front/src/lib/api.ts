// dia-front/src/lib/api.ts
export const API_URL = "http://localhost:3000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  path: string,
  options: { method?: HttpMethod; body?: any } = {},
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let message = `Erro ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) {
        message = Array.isArray(data.message)
          ? data.message.join("\n")
          : data.message;
      }
    } catch {
      // ignora erro de parse
    }
    throw new Error(message);
  }

  return res.json();
}

// ---------- Tipos de autenticação ----------

export type AuthUser = {
  id: number;
  email: string;
  role: "PATIENT" | "DOCTOR";
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

// ---------- Login ----------

export function login(payload: { email: string; password: string }) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

// ---------- Cadastro de Paciente ----------

export type SignupPatientPayload = {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  diabetesType: string;
  treatment: string;
  glucoseChecks?: string;
  bolusInsulin?: string;
  basalInsulin?: string;
};

export function signupPatient(payload: SignupPatientPayload) {
  return request<AuthResponse>("/auth/signup/patient", {
    method: "POST",
    body: payload,
  });
}
// ---------- Perfis de usuário ----------

export type PatientProfile = {
  id: number;
  diabetesType: string;
  treatment: string;
  glucoseChecks?: string;
  bolusInsulin?: string;
  basalInsulin?: string;
};

export type DoctorProfile = {
  id: number;
  specialty: string;
  crm: string;
  institution: string;
};

// ...

export type UserDetails = {
  id: number;
  fullName: string;
  email: string;
  role: "PATIENT" | "DOCTOR";
  dateOfBirth?: string | null;
  patientProfile?: {
    id: number;
    diabetesType: string;
    diagnosisDate?: string | null;
    treatment: string;
    glucoseChecksPerDay?: string | null;
    usesInsulin?: boolean;
    bolusInsulin?: string | null;
    basalInsulin?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export function getUser(id: number) {
  return request<UserDetails>(`/users/${id}`);
}


// ---------- Glicemia ----------

export type GlucosePayload = {
  value: number;
  measuredAt: string; // ISO (new Date().toISOString())
  period: string;
  notes?: string;
};

export type GlucoseMeasurement = {
  id: number;
  value: number;
  measuredAt: string;
  period: string;
  notes?: string;
};

export function createGlucose(
  userId: number,
  payload: GlucosePayload,
) {
  return request<GlucoseMeasurement>(`/glucose/${userId}`, {
    method: "POST",
    body: payload,
  });
}

export function listGlucose(userId: number) {
  return request<GlucoseMeasurement[]>(`/glucose/${userId}`);
}
