const fs = require('fs');
let file = fs.readFileSync('uniquecare/frontend/src/services/api.ts', 'utf8');
file = file.replace(/\/\*\* POST \/api\/auth\/register \*\/\nexport async function signupApi.*?\n  \}\n\}\n/s, '');
fs.writeFileSync('uniquecare/frontend/src/services/api.ts', file);
