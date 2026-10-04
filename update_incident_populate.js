const fs = require('fs');
let incident = fs.readFileSync('uniquecare/backend/src/controllers/incidentController.ts', 'utf8');

incident = incident.replace(/\.populate\('assetId', 'name tagId healthStatus'\)/g, `.populate('assetId', 'name tagId healthStatus location category')`);

fs.writeFileSync('uniquecare/backend/src/controllers/incidentController.ts', incident);
