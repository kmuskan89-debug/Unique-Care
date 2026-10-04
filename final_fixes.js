const fs = require('fs');

// 1. AuthContext.tsx
let ctx = fs.readFileSync('uniquecare/frontend/src/context/AuthContext.tsx', 'utf8');
ctx = ctx.replace(/const authUser: AuthUser = \{\n\s*_id: result\.data\._id,\n\s*name: result\.data\.name,\n\s*email: result\.data\.email,\n\s*role: result\.data\.role,\n\s*token: result\.data\.token,\n\s*\}/, 
`const authUser: AuthUser = {
        _id: result.data.user._id,
        name: result.data.user.name,
        email: result.data.user.email,
        role: result.data.user.role,
        token: result.data.token,
      }`);
fs.writeFileSync('uniquecare/frontend/src/context/AuthContext.tsx', ctx);

// 2. api.ts
let api = fs.readFileSync('uniquecare/frontend/src/services/api.ts', 'utf8');
api = api.replace(/export async function createIssueApi\(issue: Partial<IssueRecord>\): Promise<IssueRecord \| null> \{\n\s*const token = getStoredToken\(\);\n\s*try \{/g, 
`export async function createIssueApi(issue: Partial<IssueRecord>): Promise<IssueRecord | null> {
  try {`);
api = api.replace(/export async function updateIssueStatusApi\(id: string, status: string\): Promise<boolean> \{\n\s*const token = getStoredToken\(\);\n\s*try \{/g, 
`export async function updateIssueStatusApi(id: string, status: string): Promise<boolean> {
  try {`);
api = api.replace(/const payload = \{\n\s*title: issue\.title,\n\s*description: issue\.description \|\| issue\.title,\n\s*location: issue\.location,\n\s*category: issue\.category,\n\s*tagId: issue\.id \/\/ we can pass the scanned code \/ id as tagId\n\s*\};/, 
`const payload = {
      title: issue.title,
      description: issue.description || issue.title,
      location: issue.location,
      category: issue.category,
      tagId: issue.id
    };`);
fs.writeFileSync('uniquecare/frontend/src/services/api.ts', api);

// 3. AdminDashboard.tsx
let admin = fs.readFileSync('uniquecare/frontend/src/components/AdminDashboard.tsx', 'utf8');
if (!admin.includes("import useSWR")) {
  admin = admin.replace(/import type \{ IssueRecord \} from '\.\.\/types'/, 
`import type { IssueRecord } from '../types'
import useSWR from 'swr'
import { fetcher } from '../services/api'`);
}
fs.writeFileSync('uniquecare/frontend/src/components/AdminDashboard.tsx', admin);

