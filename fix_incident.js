const fs = require('fs');

// 1. Backend: incidentController.ts
let incidentCtrl = fs.readFileSync('uniquecare/backend/src/controllers/incidentController.ts', 'utf8');

incidentCtrl = incidentCtrl.replace(/export const createIncident = catchAsync\(async \(req: AuthRequest, res: Response, next: NextFunction\) => \{\n\s*const \{ assetId, description, mediaUrls \} = req\.body;\n\s*if \(\!assetId \|\| \!description\) \{\n\s*return next\(new AppError\('Missing required fields: assetId, description', 400\)\);\n\s*\}\n\n\s*const asset = await Asset\.findById\(assetId\);\n\s*if \(\!asset\) \{\n\s*return next\(new AppError\('Asset not found', 404\)\);\n\s*\}/, 
`export const createIncident = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { assetId, tagId, title, description, mediaUrls, location, category } = req.body;
  if (!description && !title) {
    return next(new AppError('Missing required fields: description or title', 400));
  }

  let asset = null;
  if (assetId) {
    asset = await Asset.findById(assetId);
  } else if (tagId) {
    asset = await Asset.findOne({ tagId });
  }

  // Auto-create a generic asset if not found (useful for general issues reported without a specific asset tag)
  if (!asset) {
    asset = await Asset.create({
      tagId: tagId || \`GEN-\${Math.floor(Math.random() * 10000)}\`,
      name: title || 'General Facility Issue',
      location: location || 'Campus',
      category: category || 'General',
      healthStatus: 'degraded'
    });
  }`);

// Update the Incident creation to use the possibly generic description
incidentCtrl = incidentCtrl.replace(/const incident = await Incident\.create\(\{[\s\S]*?status: 'Open'\n\s*\}\);/,
`const incident = await Incident.create({
    assetId: asset._id,
    description: description || title,
    mediaUrls: mediaUrls || [],
    reportedBy: req.user._id,
    status: 'Open'
  });`);

fs.writeFileSync('uniquecare/backend/src/controllers/incidentController.ts', incidentCtrl);

// 2. Frontend: api.ts createIssueApi
let api = fs.readFileSync('uniquecare/frontend/src/services/api.ts', 'utf8');
api = api.replace(/export async function createIssueApi\(issue: Partial<IssueRecord>\): Promise<IssueRecord \| null> \{\n\s*const token = getStoredToken\(\);\n\s*try \{\n[\s\S]*?const res = await fetch\(`\$\{API_BASE\}\/issues`, \{/, 
`export async function createIssueApi(issue: Partial<IssueRecord>): Promise<IssueRecord | null> {
  const token = getStoredToken();
  try {
    const payload = {
      title: issue.title,
      description: issue.description || issue.title,
      location: issue.location,
      category: issue.category,
      tagId: issue.id // we can pass the scanned code / id as tagId
    };
    const res = await fetch(\`\${API_BASE}/incidents\`, {`);

// 3. Frontend: api.ts fetchIssuesFromApi
api = api.replace(/export async function fetchIssuesFromApi\(\): Promise<IssueRecord\[\] \| null> \{\n\s*try \{\n\s*const res = await fetch\(`\$\{API_BASE\}\/issues`/, 
`export async function fetchIssuesFromApi(): Promise<IssueRecord[] | null> {
  try {
    const res = await fetch(\`\${API_BASE}/incidents\``);

// 4. Update updateIssueStatusApi in api.ts
api = api.replace(/export async function updateIssueStatusApi\(id: string, status: string\): Promise<boolean> \{\n\s*try \{\n\s*const res = await fetch\(`\$\{API_BASE\}\/incidents\/\$\{id\}\/status`, \{/,
`export async function updateIssueStatusApi(id: string, status: string): Promise<boolean> {
  const token = getStoredToken();
  try {
    const res = await fetch(\`\${API_BASE}/incidents/\${id}/status\`, {`);

fs.writeFileSync('uniquecare/frontend/src/services/api.ts', api);

