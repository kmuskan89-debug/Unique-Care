const fs = require('fs');

// 1. AuthContext.tsx
let ctx = fs.readFileSync('uniquecare/frontend/src/context/AuthContext.tsx', 'utf8');
ctx = ctx.replace(/const signup = useCallback[\s\S]*?\}, \[\]\)/, '');
ctx = ctx.replace(/signup,/g, '');
fs.writeFileSync('uniquecare/frontend/src/context/AuthContext.tsx', ctx);

// 2. Footer.tsx
let ftr = fs.readFileSync('uniquecare/frontend/src/components/shared/Footer.tsx', 'utf8');
ftr = ftr.replace(/onOpenAuth\('login'\)/g, 'onOpenAuth()');
fs.writeFileSync('uniquecare/frontend/src/components/shared/Footer.tsx', ftr);

// 3. App.tsx
let app = fs.readFileSync('uniquecare/frontend/src/App.tsx', 'utf8');
app = app.replace(/setAuthModalMode\('login'\)/g, "setAuthModalMode(true)");

app = app.replace(/function Auth\(\{ mode \}: \{ mode: 'login' \| 'signup' \}\) \{\n[\s\S]*?\n\}/, '');

// Fix Mail and Lock imports in App.tsx
if (!app.includes('Mail,')) {
    app = app.replace(/import \{([\s\S]*?)\} from 'lucide-react'/, "import { Mail, Lock, $1 } from 'lucide-react'");
}

fs.writeFileSync('uniquecare/frontend/src/App.tsx', app);
