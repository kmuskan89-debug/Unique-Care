const fs = require('fs');
let file = fs.readFileSync('uniquecare/frontend/src/App.tsx', 'utf8');

// 1. Remove Community Nav Link
file = file.replace(/<a href="#community">Community<\/a>\n/, '');

// 2. Remove the Community Section block completely
file = file.replace(/\s*\{\/\* Member Registration Section \(Matching Screenshot 2 EXACTLY\) \*\/\}\n\s*<section id="community" className="community-section">[\s\S]*?<\/section>\n/, '');

// 3. Fix initialAuthModal in App()
file = file.replace(/initialAuthModal\?: 'login' \| 'signup' \| null;/, 'initialAuthModal?: boolean;');
file = file.replace(/initialAuthModal = null/, 'initialAuthModal = false');
file = file.replace(/const \[authModalMode, setAuthModalMode\] = useState\<'login' \| 'signup' \| null\>\(initialAuthModal\)/, 'const [authModalMode, setAuthModalMode] = useState<boolean>(!!initialAuthModal)');
file = file.replace(/const handleOpenAuth = \(mode: 'login' \| 'signup'\) => \{\n\s*setAuthModalMode\(mode\)\n\s*\}/, 'const handleOpenAuth = () => {\n    setAuthModalMode(true)\n  }');

// Fix handleOpenAuth usages
file = file.replace(/onClick=\{\(\) => handleOpenAuth\('login'\)\}/g, 'onClick={() => handleOpenAuth()}');
file = file.replace(/onClick=\{\(\) => handleOpenAuth\('signup'\)\}/g, 'onClick={() => handleOpenAuth()}');
// Also the onOpenAuth passed to Footer
file = file.replace(/<Footer onOpenAuth=\{handleOpenAuth\} \/>/, '<Footer onOpenAuth={() => handleOpenAuth()} />');


// Fix <AuthModal> usage inside Home component
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
      
// Fix <Route path="/signup"> in App component
file = file.replace(/<Route path="\/signup" element=\{<Home records=\{records\} theme=\{theme\} toggleTheme=\{toggleTheme\} initialAuthModal="signup" \/>\} \/>\n/, '');

// Fix any leftover initialAuthModal="login"
file = file.replace(/initialAuthModal="login"/g, 'initialAuthModal={true}');


// Replace AuthModal signature and body
file = file.replace(/function AuthModal\(\{ [\s\S]*?\) \{[\s\S]*?const toggleMode = \(\) => \{[\s\S]*?\}\n\n  const displayError = formError \|\| error/s, 
`function AuthModal({ 
  isOpen, 
  onClose
}: { 
  isOpen: boolean
  onClose: () => void
}) {
  const { login, isAuthenticated, user, error, clearError, loading } = useAuth()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    setFormError(null)
    clearError()
  }, [isOpen, clearError])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    clearError()

    if (!email.trim() || !password.trim()) {
      setFormError('Please enter both email and password')
      return
    }
    const success = await login(email.trim(), password)
    if (success) {
      onClose()
      const targetRole = user?.role || 'student'
      // Use existing dashboard routes
      const roleMap: Record<string, string> = {
        'admin': '/dashboard',
        'technician': '/inventory',
        'student': '/report'
      }
      navigate(roleMap[targetRole] || '/', { replace: true })
    }
  }

  const displayError = formError || error`);

// Remove the condition for {mode === 'login' ? ... : ...}
file = file.replace(/\{mode === 'login'\n\s*\? 'Sign in to access your maintenance dashboard'\n\s*: 'Register to join the campus maintenance system'\n\s*\}/s, 'Sign in to access your maintenance dashboard');

// Remove Name input inside AuthModal
file = file.replace(/\{mode === 'signup' && \(\n\s*<div className="auth-field">\n\s*<label>Full Name<\/label>\n\s*<div className="auth-input-wrap">\n\s*<Users size=\{16\} className="auth-input-icon" \/>\n\s*<input\n\s*type="text"\n\s*placeholder="Jane Doe"\n\s*value=\{name\}\n\s*onChange=\{e => setName\(e\.target\.value\)\}\n\s*required=\{mode === 'signup'\}\n\s*\/>\n\s*<\/div>\n\s*<\/div>\n\s*\)\}/s, '');

// Remove Role input inside AuthModal
file = file.replace(/\{mode === 'signup' && \(\n\s*<div className="auth-field">\n\s*<label>Account Role<\/label>\n\s*<div className="auth-role-select">\n\s*\{[\s\S]*?\}\n\s*<\/div>\n\s*<\/div>\n\s*\)\}/s, '');

// Fix Submit Button
file = file.replace(/<button type="submit" className="auth-submit" disabled=\{loading\}>\n\s*\{loading\n\s*\? 'Processing\.\.\.'\n\s*: mode === 'login' \? 'Sign In' : 'Create Account'\n\s*\}\n\s*<\/button>/s, 
`<button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Processing...' : 'Sign In'}
          </button>`);

// Fix mode toggle at the bottom
file = file.replace(/<div className="auth-footer">\n\s*<button type="button" onClick=\{toggleMode\} className="auth-mode-toggle">\n\s*\{mode === 'login'\n\s*\? "Don't have an account\? Sign up"\n\s*: "Already have an account\? Sign in"\}\n\s*<\/button>\n\s*<\/div>/s, '');

// Fix the trailing AuthRoute
file = file.replace(/function AuthRoute\(\{ mode \}: \{ mode: 'login' \| 'signup' \}\) \{\n\s*const navigate = useNavigate\(\)\n\s*return \(\n\s*<AuthModal\n\s*isOpen=\{true\}\n\s*initialMode=\{mode\}\n\s*onClose=\{\(\) => navigate\('\/', \{ replace: true \}\)\}\n\s*\/>\n\s*\)\n\}/s, 
`function AuthRoute() {
  const navigate = useNavigate()
  return (
    <AuthModal
      isOpen={true}
      onClose={() => navigate('/', { replace: true })}
    />
  )
}`);

// Fix the App component routes for AuthRoute
file = file.replace(/<Route path="\/login" element=\{<AuthRoute mode="login" \/>\} \/>/g, '<Route path="/login" element={<AuthRoute />} />');

fs.writeFileSync('uniquecare/frontend/src/App.tsx', file);
