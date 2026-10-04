const fs = require('fs');
let file = fs.readFileSync('uniquecare/frontend/src/App.tsx', 'utf8');

// The AuthModal component string
const authModalRegex = /function AuthModal\(\{[\s\S]*?className="auth-overlay" onClick=\{onClose\}>[\s\S]*?<\/div>\n\s*\)\n\}/;

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
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      clearError()
      setFormError(null)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, clearError])

  useEffect(() => {
    if (isAuthenticated && user) {
      onClose()
      const roleMap: Record<string, string> = {
        'admin': '/dashboard',
        'technician': '/inventory',
        'student': '/report'
      }
      navigate(roleMap[user.role] || '/')
    }
  }, [isAuthenticated, user, navigate, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!email.trim() || !password) {
      setFormError('Please fill in all required fields.')
      return
    }
    const success = await login(email.trim(), password)
    if (success) {
      onClose()
    }
  }

  const fillMock = () => {
    setEmail('ajaydinodiya2007@gmail.com')
    setPassword('admin123')
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="auth-header">
          <div className="auth-logo-box">
            <LockKeyhole size={28} color="var(--red)" />
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to access your dashboard and tickets</p>
        </div>

        {(error || formError) && (
          <div className="auth-error-box">
            <AlertCircle size={18} />
            <span>{formError || error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          
          <div className="auth-input-group">
            <label>Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                placeholder="you@institution.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
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
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
              <a href="#" className="forgot-pwd" onClick={e => e.preventDefault()}>Forgot password?</a>
            </div>
          </div>

          <button type="submit" className="btn-red login-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : <><LogIn size={18} /> Sign In</>}
          </button>
          
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button type="button" onClick={fillMock} style={{ background: 'none', border: 'none', color: 'var(--txt-muted)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem' }}>
              Fill Mock Admin Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}`;

file = file.replace(authModalRegex, newAuthModal);
fs.writeFileSync('uniquecare/frontend/src/App.tsx', file);
