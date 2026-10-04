const fs = require('fs');

// 1. Backend: incidentController.ts
let incidentCtrl = fs.readFileSync('uniquecare/backend/src/controllers/incidentController.ts', 'utf8');

incidentCtrl = incidentCtrl.replace(/status: 'success',/g, "success: true,");

fs.writeFileSync('uniquecare/backend/src/controllers/incidentController.ts', incidentCtrl);

// 2. Tests: incident.test.ts
let testFile = fs.readFileSync('uniquecare/backend/tests/incident.test.ts', 'utf8');

// We need an admin or technician token for the PATCH route.
testFile = testFile.replace(/let user: any;\n\s*let asset: any;/, 
`let user: any;
  let admin: any;
  let adminToken: string;
  let asset: any;`);

testFile = testFile.replace(/token = generateToken\(user\._id\.toString\(\)\);/, 
`token = generateToken(user._id.toString());
    admin = await User.create({
      name: 'Test Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    adminToken = generateToken(admin._id.toString());`);

testFile = testFile.replace(/\.patch\(`\/api\/incidents\/\$\{incident\._id\}\/status`\)\n\s*\.set\('Authorization', `Bearer \$\{token\}`\)/, 
`.patch(\`/api/incidents/\${incident._id}/status\`)
        .set('Authorization', \`Bearer \${adminToken}\`)`);

fs.writeFileSync('uniquecare/backend/tests/incident.test.ts', testFile);

