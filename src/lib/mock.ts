import { subHours } from 'date-fns'
import { Patient, GlucoseRecord, Exam, ReportRequest, ExamRequest } from './types'

const now = new Date()

function genGlucose24h(): GlucoseRecord[] {
  const pts: GlucoseRecord[] = []
  for (let i = 24; i >= 0; i--) {
    const t = subHours(now, i)
    const mgdl = Math.round(95 + 25 * Math.sin(i/2) + 15 * Math.random())
    pts.push({ ts: t.toISOString(), mgdl })
  }
  return pts
}

const exampleExams: Exam[] = [
  { id:'e1', name:'HbA1c', date: subHours(now, 24*20).toISOString(), resultUrl:'#' },
  { id:'e2', name:'Colesterol', date: subHours(now, 24*40).toISOString(), resultUrl:'#' },
]

const examplePending: ReportRequest[] = [
  { id:'r1', kind:'glicemia-historico', rangeDays:90, status:'pending', requestedAt: now.toISOString() }
]

const exampleExamReqs: ExamRequest[] = [
  { id:'x1', name:'Hemoglobina Glicada (HbA1c)', status:'pending', requestedAt: now.toISOString() }
]

export const PATIENTS: Patient[] = [
  {
    id: 'p1',
    nome: 'Laura Lopes',
    email: 'laura@example.com',
    nascimento: '1993-05-12',
    sexo: 'F',
    telefone: '(11) 99999-9999',
    shared: {
      glucose: genGlucose24h(),
      insulin: [
        { ts: subHours(now, 3).toISOString(), units: 4, tipo:'Bolo' },
        { ts: subHours(now, 10).toISOString(), units: 18, tipo:'Basal' },
      ],
      meals: [
        { ts: subHours(now, 4).toISOString(), carbs: 60, tipo:'Almoço' },
        { ts: subHours(now, 1).toISOString(), carbs: 30, tipo:'Lanche' },
      ],
      activities: [
        { ts: subHours(now, 6).toISOString(), durMin: 45, tipo:'Caminhada' }
      ],
      exams: exampleExams,
    },
    pendingRequests: examplePending,
    examRequests: exampleExamReqs
  },
  {
    id: 'p2',
    nome: 'Eduardo Raulino',
    email: 'eduardo@example.com',
    nascimento: '1989-10-01',
    sexo: 'M',
    telefone: '(21) 98888-8888',
    shared: { glucose: genGlucose24h(), insulin: [], meals: [], activities: [], exams: [] },
    pendingRequests: [],
    examRequests: []
  }
]

// “mock API” local – troque por chamadas reais depois.
export const api = {
  listPatients: async () => PATIENTS,
  getPatient: async (id: string) => PATIENTS.find(p => p.id === id)!,
  requestReport: async (patientId: string, kind: ReportRequest['kind'], rangeDays: number) => {
    const p = PATIENTS.find(px => px.id === patientId)!
    const req: ReportRequest = { id: crypto.randomUUID(), kind, rangeDays, status:'pending', requestedAt: new Date().toISOString() }
    p.pendingRequests.push(req)
    return req
  },
  requestExam: async (patientId: string, name: string, notes?: string) => {
    const p = PATIENTS.find(px => px.id === patientId)!
    const req: ExamRequest = { id: crypto.randomUUID(), name, notes, status:'pending', requestedAt: new Date().toISOString() }
    p.examRequests.push(req)
    return req
  },
  updatePatientProfile: async (id: string, patch: Partial<Patient>) => {
    const p = PATIENTS.find(px => px.id === id)!
    Object.assign(p, patch)
    return p
  }
}
