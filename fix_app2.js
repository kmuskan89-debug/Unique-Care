const fs = require('fs');
let content = fs.readFileSync('uniquecare/frontend/src/App.tsx', 'utf8');

// Conflict 1: Imports
content = content.replace(/<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>> 63296d6[^\n]*\n/, `$1\nimport useSWR from 'swr'\nimport { fetcher } from './services/api'\n`);

// Conflict 2: Portal routes
content = content.replace(/<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>> 63296d6[^\n]*\n/, `$1`);

// Conflict 3: Inner routes
content = content.replace(/<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>> 63296d6[^\n]*\n/, `$1`);

fs.writeFileSync('uniquecare/frontend/src/App.tsx', content);
