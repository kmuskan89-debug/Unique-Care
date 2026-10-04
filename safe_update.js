const fs = require('fs');

// 1. Footer.tsx
let footer = fs.readFileSync('uniquecare/frontend/src/components/shared/Footer.tsx', 'utf8');
footer = footer.replace("onOpenAuth?: (mode: 'login' | 'signup') => void", "onOpenAuth?: () => void");
footer = footer.replace("onClick={() => onOpenAuth?.('login')}", "onClick={() => onOpenAuth?.()}");
fs.writeFileSync('uniquecare/frontend/src/components/shared/Footer.tsx', footer);

// 2. api.ts
let api = fs.readFileSync('uniquecare/frontend/src/services/api.ts', 'utf8');
const signupApiStr = `/** POST /api/auth/register */
export async function signupApi(name: string, email: string, password: string, role?: string): Promise<AuthResponse> {
  const res = await fetch(\`\${API_BASE}/auth/register\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Signup failed');
  }
  return res.json();
}`;
api = api.replace(signupApiStr, '');
fs.writeFileSync('uniquecare/frontend/src/services/api.ts', api);

// 3. AuthContext.tsx
let authContext = fs.readFileSync('uniquecare/frontend/src/context/AuthContext.tsx', 'utf8');
authContext = authContext.replace("import { loginApi, signupApi, getMeApi } from '../services/api'", "import { loginApi, getMeApi } from '../services/api'");
authContext = authContext.replace("signup: (name: string, email: string, password: string, role?: string) => Promise<boolean>", "");
const signupImpl = `  const signup = useCallback(async (name: string, email: string, password: string, role?: string): Promise<boolean> => {
    try {
      setLoading(true)
      clearError()
      const result = await signupApi(name, email, password, role)
      localStorage.setItem('token', result.token)
      setToken(result.token)
      setUser(result.user)
      setIsAuthenticated(true)
      return true
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
      return false
    } finally {
      setLoading(false)
    }
  }, [])`;
authContext = authContext.replace(signupImpl, '');
authContext = authContext.replace("    signup,\n", '');
fs.writeFileSync('uniquecare/frontend/src/context/AuthContext.tsx', authContext);

