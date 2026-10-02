const API_BASE = 'http://localhost:5000/api';

/* ── Types ─────────────────────────────────────────────────── */
export interface IssueRecord {
  id: string;
  title: string;
  location: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  assignee: string;
  reporter: string;
  date: string;
  time?: string;
  description?: string;
  category?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'technician' | 'admin' | 'lab_admin';
    token: string;
  };
}

export interface MeResponse {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'technician' | 'admin' | 'lab_admin';
}

/* ── Auth Token Helper ─────────────────────────────────────── */
function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem('ucare-auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/* ── Auth API ──────────────────────────────────────────────── */

/** POST /api/auth/login */
export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, message: data.message || 'Login failed', data: data.data };
  }
  return data;
}

/** POST /api/auth/register */
export async function signupApi(name: string, email: string, password: string, role?: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ name, email, password, role: role || 'student' }),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, message: data.message || 'Registration failed', data: data.data };
  }
  return data;
}

/** GET /api/auth/me — Validate session with token */
export async function getMeApi(token: string): Promise<MeResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
    return null;
  } catch {
    return null;
  }
}

/* ── Issues API ────────────────────────────────────────────── */

export async function fetchIssuesFromApi(): Promise<IssueRecord[] | null> {
  try {
    const res = await fetch(`${API_BASE}/issues`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return null;
  } catch (e) {
    console.warn('Backend API unavailable, using local state fallback');
    return null;
  }
}

export async function createIssueApi(issue: Partial<IssueRecord>): Promise<IssueRecord | null> {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(issue),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${url}`, { headers });
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    (error as any).info = await res.json().catch(() => ({}));
    (error as any).status = res.status;
    throw error;
  }
  const data = await res.json();
  return data.data;
};

export async function updateIssueStatusApi(id: string, status: string): Promise<boolean> {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${API_BASE}/incidents/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}
