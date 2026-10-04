const fs = require('fs');
let seedScript = fs.readFileSync('uniquecare/backend/scripts/seedUsers.ts', 'utf8');

seedScript = seedScript.replace(
  "await mongoose.connect(mongoUri);",
  "const dbName = process.env.DB_NAME || 'ucare_test';\n    await mongoose.connect(mongoUri, { dbName });"
);

fs.writeFileSync('uniquecare/backend/scripts/seedUsers.ts', seedScript);
