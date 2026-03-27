/* eslint-disable */
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

const styleTag = document.createElement('style')
styleTag.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes floatA { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-22px) rotate(4deg); } }
  @keyframes floatB { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(18px) rotate(-3deg); } }
  @keyframes floatC { 0%,100% { transform: translateY(0px); } 33% { transform: translateY(-14px); } 66% { transform: translateY(10px); } }
  @keyframes pulseRing { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
  @keyframes slideUp { from { opacity:0; transform: translateY(40px); } to { opacity:1; transform: translateY(0); } }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  .home-root { font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
  .hn-bar { position:fixed; top:0; left:0; right:0; z-index:999; display:flex; justify-content:space-between; align-items:center; padding:16px 48px; background:rgba(4,10,24,0.82); backdrop-filter:blur(18px); border-bottom:1px solid rgba(255,255,255,0.06); }
  .hn-logo { display:flex; align-items:center; gap:10px; }
  .hn-logo-icon { width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg,#00d2c8,#0066ff); display:flex; align-items:center; justify-content:center; font-size:1.1rem; box-shadow:0 0 18px rgba(0,210,200,0.35); }
  .hn-logo-text { color:white; font-family:'Syne',sans-serif; font-weight:700; font-size:1.1rem; }
  .hn-links { display:flex; gap:12px; }
  .hn-btn-ghost { padding:8px 22px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); color:white; text-decoration:none; font-size:0.9rem; font-weight:500; transition: all 0.2s; }
  .hn-btn-ghost:hover { border-color:rgba(0,210,200,0.5); background:rgba(0,210,200,0.06); }
  .hn-btn-primary { padding:8px 22px; border-radius:8px; background:linear-gradient(135deg,#00d2c8,#0066ff); color:white; text-decoration:none; font-size:0.9rem; font-weight:600; box-shadow:0 4px 14px rgba(0,102,255,0.35); transition: all 0.2s; }
  .hn-btn-primary:hover { box-shadow:0 6px 20px rgba(0,102,255,0.5); transform:translateY(-1px); }
  .hero-wrap { min-height:100vh; background:radial-gradient(ellipse 80% 60% at 20% 40%,rgba(0,102,255,0.18) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 80% 70%,rgba(0,210,200,0.12) 0%,transparent 60%),linear-gradient(170deg,#040a18 0%,#060d22 40%,#07102a 100%); display:flex; align-items:center; justify-content:center; padding:120px 24px 80px; position:relative; overflow:hidden; }
  .hero-grid-overlay { position:absolute; inset:0; pointer-events:none; background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px); background-size:60px 60px; }
  .hero-blob1 { position:absolute; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle,rgba(0,210,200,0.12),transparent 70%); top:-10%; left:-8%; animation:floatA 8s ease-in-out infinite; }
  .hero-blob2 { position:absolute; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle,rgba(0,102,255,0.1),transparent 70%); bottom:0%; right:-5%; animation:floatB 10s ease-in-out infinite; }
  .hero-content { max-width:740px; text-align:center; position:relative; z-index:1; animation:slideUp 0.9s ease both; }
  .hero-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(0,210,200,0.1); border:1px solid rgba(0,210,200,0.25); border-radius:100px; padding:6px 16px; margin-bottom:28px; color:#00d2c8; font-size:0.78rem; font-weight:600; letter-spacing:1.2px; text-transform:uppercase; }
  .hero-badge-dot { width:7px; height:7px; border-radius:50%; background:#00d2c8; position:relative; }
  .hero-badge-dot::after { content:''; position:absolute; inset:-3px; border-radius:50%; border:1px solid #00d2c8; animation:pulseRing 1.5s ease-out infinite; }
  .hero-h1 { font-family:'Syne',sans-serif; font-weight:800; line-height:1.12; font-size:clamp(2.4rem,5.5vw,3.8rem); color:white; margin-bottom:22px; }
  .hero-h1 .accent { background:linear-gradient(90deg,#00d2c8,#0066ff,#00d2c8); background-size:200%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:shimmer 3s linear infinite; }
  .hero-sub { color:rgba(255,255,255,0.55); font-size:1.1rem; line-height:1.75; max-width:540px; margin:0 auto 44px; }
  .hero-cta { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
  .cta-primary { padding:15px 38px; border-radius:10px; background:linear-gradient(135deg,#00d2c8,#0066ff); color:white; text-decoration:none; font-weight:700; font-size:1rem; box-shadow:0 8px 28px rgba(0,102,255,0.4); transition:all 0.25s; display:inline-flex; align-items:center; gap:8px; }
  .cta-primary:hover { transform:translateY(-2px); box-shadow:0 12px 35px rgba(0,102,255,0.55); }
  .cta-secondary { padding:15px 38px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.04); color:white; text-decoration:none; font-weight:500; font-size:1rem; transition:all 0.25s; }
  .cta-secondary:hover { border-color:rgba(0,210,200,0.4); background:rgba(0,210,200,0.05); }
  .stats-strip { display:flex; justify-content:center; gap:0; margin-top:70px; border:1px solid rgba(255,255,255,0.08); border-radius:16px; overflow:hidden; background:rgba(255,255,255,0.03); backdrop-filter:blur(10px); }
  .stat-item { flex:1; padding:22px 32px; text-align:center; border-right:1px solid rgba(255,255,255,0.08); }
  .stat-item:last-child { border-right:none; }
  .stat-val { font-family:'Syne',sans-serif; font-size:2rem; font-weight:800; color:white; }
  .stat-val.teal { color:#00d2c8; }
  .stat-label { color:rgba(255,255,255,0.4); font-size:0.82rem; margin-top:4px; }
  .float-card { position:absolute; border-radius:14px; padding:14px 18px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); backdrop-filter:blur(12px); color:white; font-size:0.82rem; box-shadow:0 8px 32px rgba(0,0,0,0.3); }
  .fc1 { top:22%; left:3%; animation:floatA 7s ease-in-out infinite; }
  .fc2 { top:30%; right:3%; animation:floatB 9s ease-in-out infinite; }
  .fc3 { bottom:18%; left:5%; animation:floatC 6s ease-in-out infinite; }
  .section { padding:96px 24px; }
  .section-label { display:inline-block; font-size:0.75rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#00d2c8; margin-bottom:14px; }
  .section-h2 { font-family:'Syne',sans-serif; font-weight:800; font-size:clamp(1.8rem,4vw,2.5rem); color:#0d1117; line-height:1.2; margin-bottom:14px; }
  .section-h2.light { color:white; }
  .section-sub { color:#6c757d; font-size:1.05rem; line-height:1.7; max-width:560px; }
  .section-sub.light { color:rgba(255,255,255,0.5); }
  .features-bg { background:#f4f6fb; }
  .feat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:22px; margin-top:56px; }
  .feat-card { background:white; border-radius:16px; padding:30px 26px; border:1px solid rgba(0,0,0,0.05); box-shadow:0 2px 8px rgba(0,0,0,0.04); transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1); position:relative; overflow:hidden; }
  .feat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#00d2c8,#0066ff); transform:scaleX(0); transform-origin:left; transition:transform 0.3s; }
  .feat-card:hover { transform:translateY(-6px); box-shadow:0 16px 40px rgba(0,102,255,0.12); }
  .feat-card:hover::before { transform:scaleX(1); }
  .feat-icon-wrap { width:52px; height:52px; border-radius:12px; margin-bottom:18px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; }
  .feat-title { font-family:'Syne',sans-serif; font-weight:700; font-size:1.05rem; color:#0d1117; margin-bottom:8px; }
  .feat-desc { color:#6c757d; font-size:0.92rem; line-height:1.65; }
  .how-bg { background:white; }
  .step-row { display:flex; gap:28px; align-items:flex-start; padding-bottom:48px; position:relative; }
  .step-row:not(:last-child)::after { content:''; position:absolute; left:24px; top:52px; bottom:0; width:2px; background:linear-gradient(180deg,#00d2c8,rgba(0,102,255,0.2)); }
  .step-num { width:50px; height:50px; border-radius:50%; background:linear-gradient(135deg,#00d2c8,#0066ff); color:white; font-family:'Syne',sans-serif; font-weight:800; font-size:1rem; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(0,102,255,0.35); flex-shrink:0; }
  .step-body { padding-top:10px; }
  .step-title { font-family:'Syne',sans-serif; font-weight:700; font-size:1.05rem; color:#0d1117; margin-bottom:6px; }
  .step-desc { color:#6c757d; font-size:0.93rem; line-height:1.65; }
  .roles-bg { background:linear-gradient(170deg,#040a18,#07102a); }
  .roles-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:20px; margin-top:56px; }
  .role-card { border-radius:16px; padding:30px 22px; text-align:center; border:1px solid rgba(255,255,255,0.07); background:rgba(255,255,255,0.04); transition:all 0.3s; position:relative; overflow:hidden; }
  .role-card:hover { transform:translateY(-5px); border-color:rgba(0,210,200,0.25); }
  .role-icon-wrap { width:60px; height:60px; border-radius:50%; margin:0 auto 16px; display:flex; align-items:center; justify-content:center; font-size:1.7rem; }
  .role-badge { display:inline-block; border-radius:100px; padding:4px 16px; font-size:0.78rem; font-weight:700; margin-bottom:12px; }
  .role-desc { color:rgba(255,255,255,0.5); font-size:0.88rem; line-height:1.65; }
  .cta-banner { background:linear-gradient(135deg,#040a18,#060d22); border-top:1px solid rgba(255,255,255,0.06); padding:96px 24px; text-align:center; position:relative; overflow:hidden; }
  .cta-banner::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 70% 60% at 50% 50%,rgba(0,102,255,0.15),transparent 70%); }
  .cta-banner-content { position:relative; z-index:1; }
  .hn-footer { background:#020610; padding:28px 48px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; border-top:1px solid rgba(255,255,255,0.05); }
  .hn-footer-brand { color:rgba(255,255,255,0.3); font-size:0.85rem; display:flex; align-items:center; gap:8px; }
  .hn-footer-links { display:flex; gap:24px; }
  .hn-footer-links a { color:rgba(255,255,255,0.25); font-size:0.82rem; text-decoration:none; transition:color 0.2s; }
  .hn-footer-links a:hover { color:#00d2c8; }
  .reveal { opacity:0; transform:translateY(32px); transition:opacity 0.65s ease, transform 0.65s ease; }
  .reveal.visible { opacity:1; transform:translateY(0); }
  @media(max-width:768px){
    .hn-bar{padding:14px 20px;}
    .stats-strip{flex-direction:column;}
    .stat-item{border-right:none;border-bottom:1px solid rgba(255,255,255,0.08);}
    .stat-item:last-child{border-bottom:none;}
    .fc1,.fc2,.fc3{display:none;}
    .how-grid{grid-template-columns:1fr!important;}
  }
`
if (!document.getElementById('home-styles')) {
  styleTag.id = 'home-styles'
  document.head.appendChild(styleTag)
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80)
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const end = parseInt(target)
      if (isNaN(end)) { setCount(target); return }
      let start = 0
      const step = Math.ceil(end / (1400 / 16))
      const timer = setInterval(() => {
        start = Math.min(start + step, end)
        setCount(start)
        if (start >= end) clearInterval(timer)
      }, 16)
    }, { threshold: 0.5 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [target])
  return <span ref={ref}>{count}{suffix}</span>
}

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  useReveal()
  useEffect(() => { if (user) navigate('/dashboard') }, [user])

  const features = [
    { icon: '💼', color: '#e8f0ff', label: 'Job Listings',       desc: 'Browse and manage open positions across all departments in real time.' },
    { icon: '📅', color: '#e8fff9', label: 'Smart Scheduling',    desc: 'Book interview slots with live availability — no back-and-forth emails.' },
    { icon: '🎯', color: '#fff4e8', label: 'Interview Tracking',  desc: 'Track every interview from scheduled to completed with a single view.' },
    { icon: '📊', color: '#f3e8ff', label: 'Reports & Insights',  desc: 'Get detailed hiring funnel reports and candidate analytics on demand.' },
    { icon: '💬', color: '#e8f8ff', label: 'Feedback System',     desc: 'Structured, consistent feedback collection directly from interviewers.' },
    { icon: '⚙️', color: '#fff0f0', label: 'Admin Control',       desc: 'Full user, role, and data management for platform administrators.' },
  ]

  const steps = [
    { n: '01', title: 'Create your account',          desc: 'Sign up in seconds. Choose your role — Admin, HR, Interviewer, or Candidate.' },
    { n: '02', title: 'Post jobs & open slots',        desc: 'HR posts open positions. Interviewers open time slots for bookings.' },
    { n: '03', title: 'Candidates apply & book',       desc: 'Candidates browse jobs, apply, and book slots that fit their schedule.' },
    { n: '04', title: 'Interview & collect feedback',  desc: 'Conduct interviews and capture structured feedback immediately afterward.' },
    { n: '05', title: 'Track & generate reports',      desc: 'Monitor the full pipeline and generate hiring reports with one click.' },
  ]

  const roles = [
    { icon: '🛡️', role: 'Admin',       color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.2)',  desc: 'Manage users, jobs, slots and view all analytics.' },
    { icon: '👔', role: 'HR',          color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.2)', desc: 'Post jobs, manage candidates and track interviews.' },
    { icon: '🎤', role: 'Interviewer', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.2)', desc: 'Open slots, conduct interviews, submit feedback.' },
    { icon: '👤', role: 'Candidate',   color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.2)', desc: 'Browse jobs, book slots and track your status.' },
  ]

  return (
    <div className="home-root">

      <nav className="hn-bar">
        <div className="hn-logo">
          <div className="hn-logo-icon">🎯</div>
          <span className="hn-logo-text">Interview System</span>
        </div>
        <div className="hn-links">
          <Link to="/login"    className="hn-btn-ghost">Sign In</Link>
          <Link to="/register" className="hn-btn-primary">Get Started</Link>
        </div>
      </nav>

      <div className="hero-wrap">
        <div className="hero-grid-overlay" />
        <div className="hero-blob1" />
        <div className="hero-blob2" />
        <div className="float-card fc1">
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
            <span>✅</span><span style={{fontWeight:600,fontSize:'0.8rem'}}>Slot Booked</span>
          </div>
          <div style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem'}}>Tomorrow, 10:00 AM</div>
        </div>
        <div className="float-card fc2">
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
            <span>📋</span><span style={{fontWeight:600,fontSize:'0.8rem'}}>Feedback Submitted</span>
          </div>
          <div style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem'}}>Rating: ⭐⭐⭐⭐⭐</div>
        </div>
        <div className="float-card fc3">
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
            <span>📈</span><span style={{fontWeight:600,fontSize:'0.8rem'}}>12 Interviews</span>
          </div>
          <div style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem'}}>This week</div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Streamline your hiring process
          </div>
          <h1 className="hero-h1">
            Interview Management<br />
            <span className="accent">Made Simple</span>
          </h1>
          <p className="hero-sub">
            Schedule interviews, manage candidates, collect structured feedback and track your entire hiring pipeline — all in one place.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="cta-primary">Get Started Free →</Link>
            <Link to="/login"    className="cta-secondary">Sign In</Link>
          </div>
          <div className="stats-strip">
            <div className="stat-item">
              <div className="stat-val teal"><Counter target="4" />+</div>
              <div className="stat-label">User Roles</div>
            </div>
            <div className="stat-item">
              <div className="stat-val">∞</div>
              <div className="stat-label">Interview Slots</div>
            </div>
            <div className="stat-item">
              <div className="stat-val teal"><Counter target="100" />%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat-item">
              <div className="stat-val">Live</div>
              <div className="stat-label">Reports</div>
            </div>
          </div>
        </div>
      </div>

      <div className="section features-bg">
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center'}} className="reveal">
            <span className="section-label">Features</span>
            <h2 className="section-h2">Everything you need to hire smarter</h2>
            <p className="section-sub" style={{margin:'0 auto'}}>A complete toolkit for every step of your interview pipeline.</p>
          </div>
          <div className="feat-grid">
            {features.map(({ icon, color, label, desc }) => (
              <div key={label} className="feat-card reveal">
                <div className="feat-icon-wrap" style={{background:color}}>{icon}</div>
                <div className="feat-title">{label}</div>
                <p className="feat-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section how-bg">
        <div className="how-grid" style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'start'}}>
          <div className="reveal">
            <span className="section-label">How It Works</span>
            <h2 className="section-h2">From sign-up to hire<br/>in 5 simple steps</h2>
            <p className="section-sub">No complicated setup. Just a clean, structured flow for your entire team.</p>
            <Link to="/register" className="cta-primary" style={{marginTop:32}}>Start Now →</Link>
          </div>
          <div className="reveal">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="step-row">
                <div className="step-num">{n}</div>
                <div className="step-body">
                  <div className="step-title">{title}</div>
                  <p className="step-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section roles-bg">
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center'}} className="reveal">
            <span className="section-label">Roles</span>
            <h2 className="section-h2 light">Built for every team member</h2>
            <p className="section-sub light" style={{margin:'0 auto'}}>Different roles, tailored dashboards and permissions.</p>
          </div>
          <div className="roles-grid">
            {roles.map(({ icon, role, color, bg, border, desc }) => (
              <div key={role} className="role-card reveal">
                <div className="role-icon-wrap" style={{background:bg,border:`1px solid ${border}`}}>{icon}</div>
                <div className="role-badge" style={{background:bg,color,border:`1px solid ${border}`}}>{role}</div>
                <p className="role-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cta-banner">
        <div className="cta-banner-content reveal">
          <span className="section-label">Get Started</span>
          <h2 className="section-h2 light" style={{marginBottom:16}}>Ready to streamline<br/>your hiring?</h2>
          <p className="section-sub light" style={{margin:'0 auto 40px'}}>Join your team today and manage interviews the smart way.</p>
          <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/register" className="cta-primary">Create Account →</Link>
            <Link to="/login"    className="cta-secondary">Sign In</Link>
          </div>
        </div>
      </div>

      <footer className="hn-footer">
        <div className="hn-footer-brand">
          <span>🎯</span>
          <span>Interview System · Built for seamless hiring</span>
        </div>
        <div className="hn-footer-links">
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
        </div>
      </footer>
    </div>
  )
}

export default Home
