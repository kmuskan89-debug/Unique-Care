const fs = require('fs');
let file = fs.readFileSync('uniquecare/frontend/src/App.tsx', 'utf8');

// 1. Remove community link in navbar
file = file.replace(/<a href="#community">Community<\/a>\n/, '');

// 2. Fix Navbar props/interface (if any)
// No need.

// 3. Update handleOpenAuth in Home component
// Look for handleOpenAuth function in Home
file = file.replace(/const \[authModalMode, setAuthModalMode\] = useState\<'login' \| 'signup' \| null\>\(initialAuthModal\)/, 'const [authModalMode, setAuthModalMode] = useState<boolean>(!!initialAuthModal)');
file = file.replace(/const handleOpenAuth = \(mode: 'login' \| 'signup'\) => \{\n    setAuthModalMode\(mode\)\n  \}/, 'const handleOpenAuth = () => {\n    setAuthModalMode(true)\n  }');
file = file.replace(/onClick=\{\(\) => handleOpenAuth\('login'\)\}/g, 'onClick={() => handleOpenAuth()}');
file = file.replace(/initialAuthModal\?: 'login' \| 'signup' \| null;/, 'initialAuthModal?: boolean;');

// 4. Remove community section
file = file.replace(/\s*\{\/\* Member Registration Section \(Matching Screenshot 2 EXACTLY\) \*\/\}\n\s*<section id="community" className="community-section">[\s\S]*?<\/section>/, '');

// 5. Update AuthModal component
file = file.replace(/function AuthModal\(\{ isOpen, onClose, initialMode = 'login' \}: \{\n  isOpen: boolean\n  onClose: \(\) => void\n  initialMode\?: 'login' \| 'signup'\n\}\) \{/, 'function AuthModal({ isOpen, onClose }: {\n  isOpen: boolean\n  onClose: () => void\n}) {');
file = file.replace(/const \{ login, signup, user, error, clearError, loading \} = useAuth\(\)/, 'const { login, user, error, clearError, loading } = useAuth()');
file = file.replace(/const \[mode, setMode\] = useState\<'login' \| 'signup'\>\(initialMode\)/, '');
file = file.replace(/const \[name, setName\] = useState\(''\)/, '');
file = file.replace(/const \[selectedRole, setSelectedRole\] = useState\('student'\)/, '');

file = file.replace(/if \(mode === 'login'\) \{\n\s*const success = await login\(email\.trim\(\), password\)\n\s*if \(success\) onClose\(\)\n\s*\} else \{\n\s*const success = await signup\(name\.trim\(\), email\.trim\(\), password, selectedRole\)\n\s*if \(success\) onClose\(\)\n\s*\}/, 'const success = await login(email.trim(), password)\n      if (success) onClose()');

file = file.replace(/\{mode === 'login' \? 'Welcome Back' : 'Create Account'\}/, 'Welcome Back');
file = file.replace(/\{mode === 'login'\n\s*\? 'Sign in to access your dashboard and tickets'\n\s*: 'Register to join the campus maintenance system'\}/, 'Sign in to access your dashboard and tickets');

// Remove name input
file = file.replace(/\{mode === 'signup' && \([\s\S]*?\}\)/, '');
// Wait, there might be another mode === 'signup' block
file = file.replace(/\{mode === 'signup' && \([\s\S]*?\}\)/, '');

file = file.replace(/<button type="submit" className="btn-red login-submit-btn" disabled=\{loading\}>\n\s*\{loading \? 'Processing\.\.\.' : \(mode === 'login' \? <><LogIn size=\{18\} \/> Sign In<\/>\n\s*: <><UserPlus size=\{18\} \/> Create Account<\/>\)\}\n\s*<\/button>/, '<button type="submit" className="btn-red login-submit-btn" disabled={loading}>\n              {loading ? \'Processing...\' : <><LogIn size={18} /> Sign In</>}\n            </button>');

file = file.replace(/<div className="auth-footer">\n\s*<button\n\s*type="button"\n\s*className="text-btn"\n\s*onClick=\{\(\) => \{\n\s*clearError\(\)\n\s*setMode\(prev => \(prev === 'login' \? 'signup' : 'login'\)\)\n\s*\}\}\n\s*>\n\s*\{mode === 'login'\n\s*\? "Don't have an account\? Sign up"\n\s*: "Already have an account\? Sign in"\}\n\s*<\/button>\n\s*<\/div>/, '');

// 6. Fix Routes in App component
file = file.replace(/<Route path="\/signup" element=\{<Home records=\{records\} theme=\{theme\} toggleTheme=\{toggleTheme\} initialAuthModal="signup" \/>\} \/>\n/, '');

// Fix any leftover initialAuthModal="login"
file = file.replace(/initialAuthModal="login"/g, 'initialAuthModal={true}');

// AuthModal instantiation in Home
file = file.replace(/<AuthModal\n\s*isOpen=\{!!authModalMode\}\n\s*initialMode=\{authModalMode === true \? 'login' : \(authModalMode \|\| 'login'\)\}\n\s*onClose=\{\(\) => setAuthModalMode\(false\)\}\n\s*\/>/g, '<AuthModal\n        isOpen={authModalMode}\n        onClose={() => setAuthModalMode(false)}\n      />');

file = file.replace(/<AuthModal\n\s*isOpen=\{!!authModalMode\}\n\s*initialMode=\{authModalMode \|\| 'login'\}\n\s*onClose=\{\(\) => setAuthModalMode\(false\)\}\n\s*\/>/g, '<AuthModal\n        isOpen={authModalMode}\n        onClose={() => setAuthModalMode(false)}\n      />');

// In case it's in App component for the catch-all
file = file.replace(/<AuthModal\n\s*isOpen=\{true\}\n\s*initialMode=\{mode\}\n\s*onClose=\{\(\) => navigate\('\/', \{ replace: true \}\)\}\n\s*\/>/g, '<AuthModal\n      isOpen={true}\n      onClose={() => navigate(\'/\', { replace: true })}\n    />');


fs.writeFileSync('uniquecare/frontend/src/App.tsx', file);
