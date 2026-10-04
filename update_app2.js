const fs = require('fs');
let file = fs.readFileSync('uniquecare/frontend/src/App.tsx', 'utf8');

// Fix the auth modal invocation
file = file.replace(/<AuthModal\n\s*isOpen=\{!!authModalMode\}\n\s*initialMode=\{authModalMode \|\| 'login'\}\n\s*onClose=\{\(\) => \{\n\s*setAuthModalMode\(null\)\n\s*if \(window\.location\.pathname === '\/login' \|\| window\.location\.pathname === '\/signup'\) \{\n\s*window\.history\.replaceState\(null, '', '\/'\)\n\s*\}\n\s*\}\}\n\s*\/>/s, 
`<AuthModal
        isOpen={authModalMode}
        onClose={() => {
          setAuthModalMode(false)
          if (window.location.pathname === '/login') {
            window.history.replaceState(null, '', '/')
          }
        }}
      />`);

file = file.replace(/const \[authModalMode, setAuthModalMode\] = useState\<'login' \| 'signup' \| null\>\(initialAuthModal\)/g, 'const [authModalMode, setAuthModalMode] = useState<boolean>(!!initialAuthModal)');

// Wait, earlier I replaced `useState<'login' | 'signup' | null>` with `useState<boolean>`. Did it work? Let's check `authModalMode` in file.
fs.writeFileSync('uniquecare/frontend/src/App.tsx', file);
