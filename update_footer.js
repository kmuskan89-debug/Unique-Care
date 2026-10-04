const fs = require('fs');
let file = fs.readFileSync('uniquecare/frontend/src/components/shared/Footer.tsx', 'utf8');
file = file.replace(/onOpenAuth\?: \(mode: 'login' \| 'signup'\) => void/, 'onOpenAuth?: () => void');
file = file.replace(/onClick=\{\(\) => onOpenAuth\?\('login'\)\}/, 'onClick={() => onOpenAuth?.()}');
fs.writeFileSync('uniquecare/frontend/src/components/shared/Footer.tsx', file);
