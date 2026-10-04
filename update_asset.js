const fs = require('fs');
let asset = fs.readFileSync('uniquecare/backend/src/models/Asset.ts', 'utf8');

asset = asset.replace(/healthStatus: 'healthy' \| 'degraded' \| 'broken';/, 
`healthStatus: 'healthy' | 'degraded' | 'broken';
  location?: string;
  category?: string;`);

asset = asset.replace(/default: 'healthy',\n\s*\},/s, 
`default: 'healthy',
    },
    location: { type: String, default: 'Campus' },
    category: { type: String, default: 'General' },`);

fs.writeFileSync('uniquecare/backend/src/models/Asset.ts', asset);
