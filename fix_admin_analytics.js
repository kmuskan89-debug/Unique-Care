const fs = require('fs');
let admin = fs.readFileSync('uniquecare/frontend/src/components/AdminDashboard.tsx', 'utf8');

// Import useSWR and fetcher if not there
if (!admin.includes("import useSWR")) {
  admin = admin.replace(/import \{.*?\} from 'lucide-react'/, 
`import { ArrowRight, MapPin, Search, Calendar, Users, Target, Activity, Clock3, Timer, Repeat, TrendingDown, Package, Plus, TrendingUp } from 'lucide-react'
import useSWR from 'swr'
import { fetcher } from '../services/api'`);
}

// Add the SWR hook
admin = admin.replace(/export function AdminDashboard\(\{ records, onSelectIssue \}: AdminDashboardProps\) \{/, 
`export function AdminDashboard({ records, onSelectIssue }: AdminDashboardProps) {
  const { data: analytics } = useSWR('/analytics', fetcher, { refreshInterval: 15000 })
`);

// Replace the hardcoded SLA compliance and counts with real analytics
admin = admin.replace(/<span className="adm-perf-label">SLA Compliance<\/span>\n\s*<span className="adm-perf-value">92%<\/span>\n\s*<div className="adm-perf-bar"><div className="adm-perf-bar-fill" style=\{\{ width: '92%' \}\} \/><\/div>/, 
`<span className="adm-perf-label">SLA Compliance</span>
              <span className="adm-perf-value">{analytics ? Math.round(analytics.slaCompliance) : 92}%</span>
              <div className="adm-perf-bar"><div className="adm-perf-bar-fill" style={{ width: \`\${analytics ? Math.round(analytics.slaCompliance) : 92}%\` }} /></div>`);

admin = admin.replace(/<span className="adm-perf-label">Repeat Issues<\/span>\n\s*<span className="adm-perf-value">8%<\/span>\n\s*<span className="adm-perf-trend"><TrendingDown size=\{11\} \/> 3%<\/span>/,
`<span className="adm-perf-label">Resolved Issues</span>
              <span className="adm-perf-value">{analytics ? analytics.resolvedIncidents : 42}</span>
              <span className="adm-perf-trend"><TrendingUp size={11} /> Total</span>`);

admin = admin.replace(/<span className="adm-stat-val">342<\/span>/, `<span className="adm-stat-val">{analytics ? analytics.totalIncidents : 342}</span>`);
admin = admin.replace(/<span className="adm-stat-val">8<\/span>/, `<span className="adm-stat-val">{records.filter(r => r.status === 'Open').length}</span>`);

fs.writeFileSync('uniquecare/frontend/src/components/AdminDashboard.tsx', admin);

