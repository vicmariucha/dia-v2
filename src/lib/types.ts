export type GlucoseRecord = { ts: string; mgdl: number };

export type InsulinDose = { ts: string; units: number; tipo?: 'Basal' | 'Bolo' };
export type Meal = { ts: string; carbs: number; tipo: 'Café da manhã'|'Almoço'|'Jantar'|'Lanche' };
export type Activity = { ts: string; durMin: number; tipo: string };

export type Exam = { id: string; name: string; date: string; resultUrl?: string };
export type ExamRequest = { id: string; name: string; notes?: string; status: 'pending'|'sent'|'rejected'; requestedAt: string };

export type ReportRequest = {
  id: string;
  kind: 'glicemia-historico' | 'insulina-historico' | 'atividades' | 'alimentacao';
  rangeDays: number;
  status: 'pending'|'approved'|'rejected';
  requestedAt: string;
};

export type Patient = {
  id: string;
  nome: string;
  email?: string;
  nascimento?: string;
  sexo?: 'M'|'F'|'Outro';
  telefone?: string;
  shared: {
    glucose: GlucoseRecord[];
    insulin: InsulinDose[];
    meals: Meal[];
    activities: Activity[];
    exams: Exam[];
  };
  pendingRequests: ReportRequest[];
  examRequests: ExamRequest[];
};
