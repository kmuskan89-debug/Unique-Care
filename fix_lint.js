const fs = require('fs');

// Fix api.ts
let api = fs.readFileSync('uniquecare/frontend/src/services/api.ts', 'utf8');
api = api.replace(/export const fetcher = async \(url: string\) => \{\n  const token = localStorage\.getItem\('token'\);\n/g, 'export const fetcher = async (url: string) => {\n  const token = localStorage.getItem("token") || "";\n');
fs.writeFileSync('uniquecare/frontend/src/services/api.ts', api);

// Fix App.tsx
let app = fs.readFileSync('uniquecare/frontend/src/App.tsx', 'utf8');
// Fix missing assets prop
app = app.replace(/<Report onAddRecord=\{\(newR\) => setRecords\(\[newR, \.\.\.records\]\)\} \/>/g, '<Report onAddRecord={(newR) => setRecords([newR, ...records])} assets={assets} />');
fs.writeFileSync('uniquecare/frontend/src/App.tsx', app);
