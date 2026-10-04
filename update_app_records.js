const fs = require('fs');
let app = fs.readFileSync('uniquecare/frontend/src/App.tsx', 'utf8');

app = app.replace(/const records = recordsData \|\| \[\]/g, 
`const records = (recordsData || []).map((inc: any) => ({
    id: inc._id,
    title: inc.assetId?.name || inc.description?.substring(0, 20) || 'Unknown Issue',
    location: inc.assetId?.location || 'Campus',
    priority: 'Medium', // Default for now
    status: inc.status || 'Open',
    assignee: inc.assignedTo?.name || 'Unassigned',
    reporter: inc.reportedBy?.name || 'Unknown',
    date: new Date(inc.createdAt).toLocaleDateString(),
    time: new Date(inc.createdAt).toLocaleTimeString(),
    description: inc.description || '',
    category: inc.assetId?.category || 'General'
  }))`);

fs.writeFileSync('uniquecare/frontend/src/App.tsx', app);
