const fs = require('fs');
let content = fs.readFileSync('uniquecare/frontend/src/services/api.ts', 'utf8');

// Replace all conflicts, keeping HEAD
content = content.replace(/<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>> 63296d6[^\n]*\n/g, `$1`);

fs.writeFileSync('uniquecare/frontend/src/services/api.ts', content);
