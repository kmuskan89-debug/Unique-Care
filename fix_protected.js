const fs = require('fs');
let content = fs.readFileSync('uniquecare/frontend/src/components/ProtectedRoute.tsx', 'utf8');

content = content.replace(/<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>> 63296d6[^\n]*\n/, `$1`);

fs.writeFileSync('uniquecare/frontend/src/components/ProtectedRoute.tsx', content);
