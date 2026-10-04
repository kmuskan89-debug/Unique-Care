const fs = require('fs');
let app = fs.readFileSync('uniquecare/frontend/src/App.tsx', 'utf8');

// A. Navbar links
app = app.replace('<a href="#community">Community</a>\n', '');

// B. Community Section removal
const communitySectionRegex = /\{\/\* Member Registration Section \(Matching Screenshot 2 EXACTLY\) \*\/\}\n\s*<section id="community" className="community-section">[\s\S]*?<\/section>/;
app = app.replace(communitySectionRegex, '');

// C. initialAuthModal props
app = app.replace("initialAuthModal?: 'login' | 'signup' | null;", "initialAuthModal?: boolean;");
app = app.replace("initialAuthModal = null", "initialAuthModal = false");
app = app.replace("const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(initialAuthModal)", "const [authModalMode, setAuthModalMode] = useState<boolean>(!!initialAuthModal)");
app = app.replace("const handleOpenAuth = (mode: 'login' | 'signup') => {\n    setAuthModalMode(mode)\n  }", "const handleOpenAuth = () => {\n    setAuthModalMode(true)\n  }");
app = app.replace(/onClick=\{\(\) => handleOpenAuth\('login'\)\}/g, "onClick={() => handleOpenAuth()}");
app = app.replace(/onClick=\{\(\) => handleOpenAuth\('signup'\)\}/g, "onClick={() => handleOpenAuth()}");
app = app.replace("<Footer onOpenAuth={handleOpenAuth} />", "<Footer onOpenAuth={() => handleOpenAuth()} />");

// D. Home component's AuthModal invocation
app = app.replace(`<AuthModal
        isOpen={!!authModalMode}
        initialMode={authModalMode || 'login'}
        onClose={() => {
          setAuthModalMode(null)
          if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
            window.history.replaceState(null, '', '/')
          }
        }}
      />`, `<AuthModal
        isOpen={authModalMode}
        onClose={() => {
          setAuthModalMode(false)
          if (window.location.pathname === '/login') {
            window.history.replaceState(null, '', '/')
          }
        }}
      />`);

// E. Remove signup route
app = app.replace(`<Route path="/signup" element={<Home records={records} theme={theme} toggleTheme={toggleTheme} initialAuthModal="signup" />} />\n`, "");
app = app.replace(`initialAuthModal="login"`, "initialAuthModal={true}");

// F. AuthModal component rewriting
const oldAuthModalRegex = /function AuthModal\(\{ [\s\S]*?className="auth-modal-overlay" onClick=\{onClose\}>[\s\S]*?<\/div>\n\s*\)\n\}/;
const newAuthModal = `function AuthModal({ 
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
      const roleMap: Record<string, string> = {
        'admin': '/dashboard',
        'technician': '/inventory',
        'student': '/report'
      }
      navigate(roleMap[targetRole] || '/', { replace: true })
    }
  }

  const displayError = formError || error

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-card" onClick={e => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} title="Close">
          <X size={18} />
        </button>

        <div className="auth-brand">
          <div className="auth-brand-link">
            <div className="auth-brand-icon">
              <ShieldCheck size={22} />
            </div>
            <span className="auth-brand-text">
              UNI<span className="auth-brand-accent">CARE</span>
            </span>
          </div>
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to access your maintenance dashboard</p>

        {displayError && (
          <div className="auth-error">
            <CircleAlert size={16} />
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Email Address</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                placeholder="you@institution.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button 
                type="button" 
                className="pwd-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            <div className="auth-field-extras">
              <a href="#" className="forgot-pwd" onClick={e => e.preventDefault()}>Forgot password?</a>
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Processing...' : 'Sign In'}
          </button>
          
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button type="button" onClick={() => { setEmail('ajaydinodiya2007@gmail.com'); setPassword('admin123'); }} style={{ background: 'none', border: 'none', color: 'var(--txt-muted)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem' }}>
              Fill Mock Admin Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}`;

app = app.replace(oldAuthModalRegex, newAuthModal);

// G. Fix AuthRoute
app = app.replace(`function AuthRoute({ mode }: { mode: 'login' | 'signup' }) {\n  const navigate = useNavigate()\n  return (\n    <AuthModal\n      isOpen={true}\n      initialMode={mode}\n      onClose={() => navigate('/', { replace: true })}\n    />\n  )\n}`, 
`function AuthRoute() {
  const navigate = useNavigate()
  return (
    <AuthModal
      isOpen={true}
      onClose={() => navigate('/', { replace: true })}
    />
  )
}`);
app = app.replace(`<Route path="/login" element={<AuthRoute mode="login" />} />`, `<Route path="/login" element={<AuthRoute />} />`);

fs.writeFileSync('uniquecare/frontend/src/App.tsx', app);
