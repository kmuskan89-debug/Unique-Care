const fs = require('fs');
let app = fs.readFileSync('uniquecare/frontend/src/App.tsx', 'utf8');
app = app.replace(/  const navigate = useNavigate\(\)\n  return \(\n    <AuthModal\n      isOpen=\{true\}\n      initialMode=\{mode\}\n      onClose=\{\(\) => navigate\('\/', \{ replace: true \}\)\}\n    \/>\n  \)\n\}\n/s, '');
fs.writeFileSync('uniquecare/frontend/src/App.tsx', app);
