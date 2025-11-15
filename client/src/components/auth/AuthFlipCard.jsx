import React, { useState } from 'react';
import './AuthFlipCard.css';

export default function AuthFlipCard({ isWide, DARK_TEXT, LIGHT_TEXT, BLUE_BUTTON, loginRef }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginForm, setLoginForm] = useState({ id: '', password: '' });
  const [signupForm, setSignupForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [focus, setFocus] = useState(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLoginChange = (e) => setLoginForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  const handleSignupChange = (e) => setSignupForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  
  const handleLoginSubmit = (e) => { 
    e.preventDefault(); 
    console.log('login', loginForm); 
  };
  
  const handleSignupSubmit = (e) => { 
    e.preventDefault(); 
    console.log('signup', signupForm); 
  };

  const inputStyle = (n) => ({ 
    width: '100%', 
    padding: '15px 18px 15px 48px',
    borderRadius: 14, 
    border: '1px solid rgba(74, 95, 115, 0.25)', 
    outline: 'none', 
    boxShadow: focus === n ? '0 0 0 3px rgba(94, 146, 176, 0.12)' : 'none',
    transition: 'all 0.2s',
    fontSize: 16,
    backgroundColor: '#fff',
    color: DARK_TEXT,
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  });

  const inputWrapper = {
    marginBottom: 20,
    width: '100%',
    position: 'relative'
  };

  const inputIcon = {
    position: 'absolute',
    left: '18px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    pointerEvents: 'none',
    zIndex: 1
  };

  const eyeIcon = {
    position: 'absolute',
    right: '18px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    zIndex: 1
  };

  const submitStyle = { 
    width: '100%', 
    marginTop: 8, 
    padding: '15px 18px', 
    borderRadius: 14, 
    border: 'none', 
    background: BLUE_BUTTON, 
    color: '#fff', 
    fontWeight: 600, 
    cursor: 'pointer',
    fontSize: 17,
    transition: 'all 0.2s',
    boxShadow: '0 6px 16px rgba(94, 146, 176, 0.35)',
    boxSizing: 'border-box'
  };

  const signupLinkStyle = {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 15,
    color: LIGHT_TEXT
  };

  const linkButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: DARK_TEXT,
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: 600,
    fontSize: 15
  };

  const cardTitleStyle = { 
    fontSize: isWide ? 26 : 22, 
    fontWeight: 600, 
    marginBottom: 24,
    marginTop: 0,
    color: DARK_TEXT,
    textAlign: 'left',
    lineHeight: 1.3
  };

  return (
    <div className="flip-card-container" ref={loginRef}>
      <div className={`flip-card-inner ${isSignUp ? 'flipped' : ''}`}>
        {/* FRONT FACE - LOGIN */}
        <div className="flip-card-face flip-card-front">
          <form onSubmit={handleLoginSubmit} aria-label="Login form">
            <h2 style={cardTitleStyle}>Login to your space</h2>

            <div style={inputWrapper}>
              <div style={{ position: 'relative' }}>
                <svg style={inputIcon} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input 
                  id="login-id" 
                  name="id" 
                  value={loginForm.id} 
                  onChange={handleLoginChange} 
                  onFocus={() => setFocus('login-id')} 
                  onBlur={() => setFocus(null)} 
                  style={inputStyle('login-id')} 
                  required 
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div style={inputWrapper}>
              <div style={{ position: 'relative' }}>
                <svg style={inputIcon} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input 
                  id="login-password" 
                  name="password" 
                  type={showLoginPassword ? "text" : "password"}
                  value={loginForm.password} 
                  onChange={handleLoginChange} 
                  onFocus={() => setFocus('login-password')} 
                  onBlur={() => setFocus(null)} 
                  style={{...inputStyle('login-password'), paddingRight: '48px'}}
                  required 
                  placeholder="Enter your password"
                />
                <svg 
                  style={eyeIcon} 
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#9CA3AF" 
                  strokeWidth="2"
                >
                  {showLoginPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </>
                  )}
                </svg>
              </div>
            </div>

            <button type="submit" style={submitStyle}>Login</button>

            <div style={signupLinkStyle}>
              Don't have an account?{' '}
              <button 
                type="button" 
                style={linkButtonStyle} 
                onClick={() => setIsSignUp(true)}
              >
                Sign up
              </button>
            </div>
          </form>
        </div>

        {/* BACK FACE - SIGN UP */}
        <div className="flip-card-face flip-card-back">
          <form onSubmit={handleSignupSubmit} aria-label="Sign up form">
            <h2 style={cardTitleStyle}>Create your account</h2>

            <div style={inputWrapper}>
              <div style={{ position: 'relative' }}>
                <svg style={inputIcon} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input 
                  id="signup-fullname" 
                  name="fullName" 
                  value={signupForm.fullName} 
                  onChange={handleSignupChange} 
                  onFocus={() => setFocus('signup-fullname')} 
                  onBlur={() => setFocus(null)} 
                  style={inputStyle('signup-fullname')} 
                  required 
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div style={inputWrapper}>
              <div style={{ position: 'relative' }}>
                <svg style={inputIcon} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input 
                  id="signup-email" 
                  name="email" 
                  type="email"
                  value={signupForm.email} 
                  onChange={handleSignupChange} 
                  onFocus={() => setFocus('signup-email')} 
                  onBlur={() => setFocus(null)} 
                  style={inputStyle('signup-email')} 
                  required 
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div style={inputWrapper}>
              <div style={{ position: 'relative' }}>
                <svg style={inputIcon} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input 
                  id="signup-password" 
                  name="password" 
                  type={showSignupPassword ? "text" : "password"}
                  value={signupForm.password} 
                  onChange={handleSignupChange} 
                  onFocus={() => setFocus('signup-password')} 
                  onBlur={() => setFocus(null)} 
                  style={{...inputStyle('signup-password'), paddingRight: '48px'}}
                  required 
                  placeholder="Enter your password"
                />
                <svg 
                  style={eyeIcon} 
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#9CA3AF" 
                  strokeWidth="2"
                >
                  {showSignupPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </>
                  )}
                </svg>
              </div>
            </div>

            <div style={inputWrapper}>
              <div style={{ position: 'relative' }}>
                <svg style={inputIcon} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input 
                  id="signup-confirm" 
                  name="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  value={signupForm.confirmPassword} 
                  onChange={handleSignupChange} 
                  onFocus={() => setFocus('signup-confirm')} 
                  onBlur={() => setFocus(null)} 
                  style={{...inputStyle('signup-confirm'), paddingRight: '48px'}}
                  required 
                  placeholder="Confirm your password"
                />
                <svg 
                  style={eyeIcon} 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#9CA3AF" 
                  strokeWidth="2"
                >
                  {showConfirmPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </>
                  )}
                </svg>
              </div>
            </div>

            <button type="submit" style={submitStyle}>Sign up</button>

            <div style={signupLinkStyle}>
              Already have an account?{' '}
              <button 
                type="button" 
                style={linkButtonStyle} 
                onClick={() => setIsSignUp(false)}
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
