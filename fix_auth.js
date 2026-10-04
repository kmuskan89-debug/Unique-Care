const fs = require('fs');
let app = fs.readFileSync('uniquecare/frontend/src/App.tsx', 'utf8');
app = app.replace(/function Auth\(\{(.*?)\n\s*\}\n/s, '');
fs.writeFileSync('uniquecare/frontend/src/App.tsx', app);
