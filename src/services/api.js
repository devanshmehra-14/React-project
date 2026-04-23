import axios from 'axios';

const API_BASE = 'http://localhost:3001';
const API_TIMEOUT = 5000;

const api = axios.create({
  baseURL: API_BASE,
  timeout: API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

// --- Mock Data ---

const MOCK_USER = { name: 'Sarah Chen', role: 'clinician' };
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock';

const MOCK_PATIENTS = [
  { id: 'p001', name: 'James Whitfield', nhsNumber: '485 777 3456' },
  { id: 'p002', name: 'Amara Okafor', nhsNumber: '923 114 8901' },
  { id: 'p003', name: 'Eleanor Voss', nhsNumber: '601 442 5578' },
];

const MOCK_SOAP_NOTE = {
  subjective:
    'Patient reports persistent frontal headache for the past three days. Describes pain as dull, constant, 5/10 intensity. Denies visual disturbances, aura, or photophobia. No prior history of chronic headaches or migraines. Has been taking over-the-counter ibuprofen with minimal relief.',
  objective:
    'Alert and oriented x3. No focal neurological deficits. Blood pressure 128/82 mmHg, heart rate 76 bpm, respiratory rate 16, temperature 36.8 C. Head and neck exam unremarkable — no tenderness on palpation, no meningeal signs. Fundoscopic exam normal.',
  assessment:
    'Tension-type headache, likely secondary to stress and poor sleep hygiene. No red flags identified. Differential includes cervicogenic headache and medication overuse headache, though less likely given clinical presentation.',
  plan: '1. Paracetamol 1g every 6 hours as needed for pain (max 4g/day).\n2. Encourage regular sleep schedule, hydration, and screen breaks.\n3. Follow-up in 1 week if symptoms persist or worsen.\n4. Return sooner if new neurological symptoms develop (visual changes, weakness, numbness).',
  icd10: 'G44.2 — Tension-type headache',
};

const MOCK_TRANSCRIPTIONS = [
  'Patient reports persistent headache for the past three days, primarily frontal...',
  'No history of migraine in the family. Denies any visual disturbances or aura.',
  'Blood pressure measured at 128 over 82, heart rate 76 beats per minute.',
  'Recommending paracetamol 1g every six hours and follow-up in one week if symptoms persist.',
];

// --- Helper: wrap a real API call with mock fallback ---

async function withMock(apiCall, mockData, mockDelay = 800) {
  try {
    const res = await apiCall();
    return res.data;
  } catch {
    // Backend unavailable — return mock
    await new Promise((r) => setTimeout(r, mockDelay));
    return mockData;
  }
}

// --- Public API ---

export async function login(email, password) {
  return withMock(
    () => api.post('/api/auth/login', { email, password }),
    { token: MOCK_TOKEN, user: MOCK_USER }
  );
}

export async function fetchPatients() {
  return withMock(
    () => api.get('/api/patients'),
    MOCK_PATIENTS,
    300
  );
}

export async function fetchSoapNote(sessionId) {
  return withMock(
    () => api.get(`/api/scribe/note/${sessionId}`),
    MOCK_SOAP_NOTE,
    2000
  );
}

export async function saveToEhr(sessionId, note) {
  return withMock(
    () => api.post('/api/ehr/save', { sessionId, note }),
    { success: true },
    500
  );
}

export { MOCK_TRANSCRIPTIONS };
