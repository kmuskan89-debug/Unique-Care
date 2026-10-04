const fs = require('fs');

// 1. AuthContext.tsx
let ctx = fs.readFileSync('uniquecare/frontend/src/context/AuthContext.tsx', 'utf8');

// Fix getMeApi result unpacking
ctx = ctx.replace(/const result = await getMeApi\(stored\.token\)\n\s*if \(result\) \{\n\s*const restored: AuthUser = \{\n\s*_id: result\._id,\n\s*name: result\.name,\n\s*email: result\.email,\n\s*role: result\.role,\n\s*token: stored\.token,\n\s*\}/, 
`const result = await getMeApi(stored.token)
        if (result && result.user) {
          const restored: AuthUser = {
            _id: result.user._id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            token: stored.token,
          }`);

// Fix loginApi result unpacking
ctx = ctx.replace(/const authUser: AuthUser = \{\n\s*_id: result\.data\._id,\n\s*name: result\.data\.name,\n\s*email: result\.data\.email,\n\s*role: result\.data\.role,\n\s*token: result\.data\.token\n\s*\}/,
`const authUser: AuthUser = {
        _id: result.data.user._id,
        name: result.data.user.name,
        email: result.data.user.email,
        role: result.data.user.role,
        token: result.data.token
      }`);

fs.writeFileSync('uniquecare/frontend/src/context/AuthContext.tsx', ctx);


// 2. api.ts
let api = fs.readFileSync('uniquecare/frontend/src/services/api.ts', 'utf8');

// Update fetcher to use getStoredToken()
api = api.replace(/export const fetcher = async \(url: string\) => \{\n\s*const token = localStorage\.getItem\("token"\) \|\| "";/, 
`export const fetcher = async (url: string) => {
  const token = getStoredToken() || "";`);

// Update createIssueApi
api = api.replace(/export async function createIssueApi\(issue: Partial<IssueRecord>\): Promise<IssueRecord \| null> \{\n\s*const token = localStorage\.getItem\('token'\);/,
`export async function createIssueApi(issue: Partial<IssueRecord>): Promise<IssueRecord | null> {`);

// Update updateIssueStatusApi
api = api.replace(/export async function updateIssueStatusApi\(id: string, status: string\): Promise<boolean> \{\n\s*const token = localStorage\.getItem\('token'\);/,
`export async function updateIssueStatusApi(id: string, status: string): Promise<boolean> {`);

// Fix AuthResponse interface to match backend { user: {...}, token: ... }
api = api.replace(/export interface AuthResponse \{\n\s*success: boolean;\n\s*message\?: string;\n\s*data: \{\n\s*_id: string;\n\s*name: string;\n\s*email: string;\n\s*role: 'student' \| 'technician' \| 'admin' \| 'lab_admin';\n\s*token: string;\n\s*\};\n\}/,
`export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: 'student' | 'technician' | 'admin' | 'lab_admin';
    };
    token: string;
  };
}`);

// Fix MeResponse interface
api = api.replace(/export interface MeResponse \{\n\s*_id: string;\n\s*name: string;\n\s*email: string;\n\s*role: 'student' \| 'technician' \| 'admin' \| 'lab_admin';\n\}/,
`export interface MeResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'technician' | 'admin' | 'lab_admin';
  };
}`);

fs.writeFileSync('uniquecare/frontend/src/services/api.ts', api);

