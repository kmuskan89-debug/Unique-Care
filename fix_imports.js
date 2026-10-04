const fs = require('fs');
let app = fs.readFileSync('uniquecare/frontend/src/App.tsx', 'utf8');

app = app.replace("import { Mail, Lock, \n  BrowserRouter", "import {\n  BrowserRouter");

// Find lucide-react import and add Mail, Lock if not there
if (app.includes("lucide-react") && !app.includes("Mail, Lock,")) {
    app = app.replace(/import \{([^}]*?)\} from 'lucide-react'/g, "import { Mail, Lock, $1 } from 'lucide-react'");
}

fs.writeFileSync('uniquecare/frontend/src/App.tsx', app);
