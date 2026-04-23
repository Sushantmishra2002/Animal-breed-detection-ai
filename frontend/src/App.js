import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import boviLogo from './assets/BoviSense_AI_logo.png'; // ← place the logo in src/assets/

/* ─── TEAM DATA ─── */
const TEAM = [
  {
    name: 'Sushant Mishra',
    role: 'AI/ML Engineer',
    avatar: 'SM',
    color: '#3bf3f6',
    profileImg: `https://ui-avatars.com/api/?name=Sushant+Mishra&background=1e3a8a&color=93c5fd&size=128&bold=true&font-size=0.4`,
    github: 'https://github.com/Sushantmishra2002',
    linkedin: 'https://www.linkedin.com/in/sushant-mishra-9b6423293/',
    email: 'mailto:sushantmishra.ctr@gmail.com',
  },
  {
    name: 'Suran Singh Dhami',
    role: 'Full Stack Developer',
    avatar: 'SD',
    color: '#d73bcf',
    profileImg: `https://ui-avatars.com/api/?name=Suran+Dhami&background=2e1065&color=c4b5fd&size=128&bold=true&font-size=0.4`,
    github: 'https://github.com/Dhammi7',
    linkedin: 'https://www.linkedin.com/in/dhamii7?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    email: 'mailto:dhamisuran12@gmail.com',
  },
  {
    name: 'Saveen Kumar',
    role: 'Backend Developer',
    avatar: 'SK',
    color: '#b85b14',
    profileImg: `https://ui-avatars.com/api/?name=Saveen+Kumar&background=042f2e&color=5eead4&size=128&bold=true&font-size=0.4`,
    github: 'https://github.com/saveen04',
    linkedin: 'https://www.linkedin.com/in/saveen-kumar-12b65b284?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    email: 'mailto:saveen.jr2006@gmail.com',
  },
];

const GUIDE = {
  name: 'Ms. V Niranjani',
  role: 'Project Guide',
  avatar: 'VN',
  color: '#68fb00',
  profileImg: `https://ui-avatars.com/api/?name=V+Niranjani&background=451a03&color=fde68a&size=128&bold=true&font-size=0.4`,
  linkedin: 'https://www.linkedin.com/in/niranjani-vijayan-aa16b8116/',
  email: 'mailto:niranjani0408@gmail.com',
};

/* ─── PARTICLE CANVAS ─── */
function ParticleCanvas({ theme }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    const pts = [];

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      pts.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        op: Math.random() * 0.45 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const isDark = theme === 'dark';
      const dot = isDark ? '100,160,255' : '40,80,200';
      const line = isDark ? '70,120,255' : '60,90,200';

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dot},${p.op})`;
        ctx.fill();
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 115) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${line},${(1 - d / 115) * 0.16})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

/* ─── SCAN EFFECT ─── */
function ScanEffect() {
  return (
    <div className="scan-wrapper" aria-hidden="true">
      <div className="scan-frame">
        <div className="scan-corner sc-tl" />
        <div className="scan-corner sc-tr" />
        <div className="scan-corner sc-bl" />
        <div className="scan-corner sc-br" />
        <div className="scan-grid-lines">
          {[...Array(4)].map((_,i) => <div key={i} className="sgl-h" style={{top:`${25*(i+1)}%`}} />)}
          {[...Array(4)].map((_,i) => <div key={i} className="sgl-v" style={{left:`${25*(i+1)}%`}} />)}
        </div>
        <div className="scan-animal">🐄</div>
        <div className="scan-beam" />
        <div className="scan-ring scan-ring-1" />
        <div className="scan-ring scan-ring-2" />
        <div className="scan-ring scan-ring-3" />
        <div className="scan-status">
          <span className="scan-dot" />
          AI Vision Active
        </div>
        <div className="scan-data-stream">
          {['ResNet-50','Feature Extraction','Breed Match','99.2% Accuracy'].map((t,i)=>(
            <div key={i} className="sds-row" style={{animationDelay:`${i*0.6}s`}}>{t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SVG ICONS ─── */
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

/* ═══════════════════════════════════
   MAIN APP
═══════════════════════════════════ */
export default function App() {
  const [theme, setTheme] = useState('dark');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Support both environment variable and localhost fallback
  const [apiUrl] = useState(
    process.env.REACT_APP_API_URL || 'http://localhost:8000'
  );
  const fileInputRef = useRef(null);

  /* ── Set browser tab title + favicon ── */
  useEffect(() => {
    document.title = 'BoviSense AI — Livestock Breed Identification';

    // Set favicon to the logo
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = boviLogo;
    document.head.appendChild(link);
  }, []);

  /* theme */
  useEffect(() => {
    const saved = localStorage.getItem('cv-theme') || 'dark';
    setTheme(saved);
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cv-theme', theme);
  }, [theme]);

  /* scroll nav */
  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* reveal observer */
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleFileSelect = useCallback(file => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select a valid image file.'); return; }
    if (file.size > 50 * 1024 * 1024) { setError('File size must be less than 50MB.'); return; }
    setSelectedFile(file); setError(null); setPredictions(null);
    const r = new FileReader();
    r.onloadend = () => setPreview(r.result);
    r.readAsDataURL(file);
  }, []);

  const handleDrop = e => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); };

  const handlePredict = async () => {
    if (!selectedFile) { setError('Please select an image first.'); return; }
    setLoading(true); setError(null); setPredictions(null);
    try {
      const fd = new FormData();
      fd.append('file', selectedFile);
      const res = await axios.post(`${apiUrl}/predict`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
      setPredictions(res.data);
    } catch (err) {
      if (err.response?.status === 503) setError('Model not loaded. Please train the model first.');
      else if (err.response?.data?.detail) setError(err.response.data.detail);
      else if (err.code === 'ECONNREFUSED') setError('Cannot connect to backend at http://localhost:8000');
      else setError(err.message || 'Prediction error');
    } finally { setLoading(false); }
  };

  const handleClear = () => {
    setSelectedFile(null); setPreview(null); setPredictions(null); setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confColor = c => c >= 80 ? '#22c55e' : c >= 50 ? '#f59e0b' : '#ef4444';

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const NAV_ITEMS = [
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'upload', label: 'Try It' },
    { id: 'team', label: 'Team' },
    { id: 'about', label: 'About' },
  ];

  return (
    <div className="App">

      {/* ══════════ NAVBAR ══════════ */}
      <nav className={`navbar ${navScrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">

          {/* ── LOGO: real image replaces animated ring ── */}
          <button className="nav-logo" onClick={() => scrollTo('hero')}>
            <img
              src={boviLogo}
              alt="BoviSense AI"
              className="nav-logo-img"
            />
            <span className="logo-wordmark">BoviSense <em>AI</em></span>
          </button>

          <div className={`nav-menu ${mobileMenuOpen ? 'is-open' : ''}`}>
            <div className="nav-menu-bg" onClick={() => setMobileMenuOpen(false)} />
            <div className="nav-menu-inner">
              {NAV_ITEMS.map(({ id, label }) => (
                <button key={id} className="nav-item" onClick={() => scrollTo(id)}>{label}</button>
              ))}
              <button className="btn-nav-cta" onClick={() => scrollTo('upload')}>
                Try Free
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="nav-end">
            <button
              className="theme-btn"
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              <div className={`theme-track ${theme}`}>
                <span className="t-sun">☀️</span>
                <span className="t-moon">🌙</span>
                <div className="theme-thumb" />
              </div>
            </button>
            <button
              className={`hamburger-btn ${mobileMenuOpen ? 'is-open' : ''}`}
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section id="hero" className="hero-section">
        <ParticleCanvas theme={theme} />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-orb hero-orb-4" />
        <div className="hero-mesh-grid" />

        <div className="hero-layout">
          {/* Left copy */}
          <div className="hero-copy">
            <div className="hero-badge">
              <span className="hb-pulse" />
              <span>ResNet-50 · Deep Learning · 50+ Breeds</span>
            </div>
            <h1 className="hero-h1">
              <span className="hh-line hh-l1">The Smartest</span>
              <span className="hh-line hh-l2"><span className="g-text">AI Vision</span> for</span>
              <span className="hh-line hh-l3">Livestock Breeds</span>
            </h1>
            <p className="hero-desc">
              Upload a photo — our convolutional neural network identifies cattle &amp; buffalo breeds
              with <strong>scientific accuracy</strong> in under 3 seconds.
            </p>
            <div className="hero-ctas">
              <button className="cta-primary" onClick={() => scrollTo('upload')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Identify a Breed Now
              </button>
              <button className="cta-ghost" onClick={() => scrollTo('how-it-works')}>
                See How It Works →
              </button>
            </div>
            <div className="hero-stats-row">
              {[['50+','Breeds'],['ResNet-50','Architecture'],['< 3s','Response'],['Top-3','Predictions']].map(([v, l], i) => (
                <div key={i} className="hs-item">
                  <strong>{v}</strong>
                  <span>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right scan visual */}
          <div className="hero-visual-col">
            <ScanEffect />
          </div>
        </div>

        <div className="hero-wave-divider">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z" fill="var(--bg)" />
          </svg>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" className="features-section">
        <div className="sc reveal">
          <div className="eyebrow">Why BoviSense AI</div>
          <h2 className="section-h2">Built for Precision &amp; Scale</h2>
          <p className="section-p">Everything researchers, farmers and agritech platforms need.</p>
          <div className="features-grid">
            {[
              { icon:'🧠', title:'Deep Learning Core', desc:'Fine-tuned ResNet-50 CNN trained on thousands of labelled livestock images for industry-leading accuracy.', accent:'#3b82f6' },
              { icon:'⚡', title:'Lightning Fast', desc:'Optimised inference pipeline delivers breed predictions in under 3 seconds — even on CPU deployments.', accent:'#f59e0b' },
              { icon:'📊', title:'Calibrated Confidence', desc:'Every result includes a confidence score plus top-3 alternatives so you always have full context.', accent:'#8b5cf6' },
              { icon:'🌍', title:'Global Breed Coverage', desc:'Covers indigenous Indian, Zebu, Taurine & hybrid breeds from 20+ countries and agricultural zones.', accent:'#14b8a6' },
            ].map((f, i) => (
              <div className="feat-card" key={i} style={{ '--acc': f.accent, '--d': `${i * 0.08}s` }}>
                <div className="feat-icon-ring" style={{ background: `${f.accent}18`, borderColor: `${f.accent}33` }}>
                  <span>{f.icon}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className="feat-shine" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how-it-works" className="hiw-section">
        <div className="sc reveal">
          <div className="eyebrow">Process</div>
          <h2 className="section-h2">Three Steps to Identification</h2>
          <p className="section-p">From photo to breed profile in seconds.</p>
          <div className="hiw-row">
            {[
              { n:'01', icon:'📸', title:'Upload Photo', desc:'Drag-and-drop or click to select a clear image. JPG, PNG & BMP up to 50 MB accepted.' },
              { n:'02', icon:'🤖', title:'Neural Scan', desc:'ResNet-50 extracts coat colour, structure, horn morphology and matches against all breed profiles.' },
              { n:'03', icon:'✅', title:'Instant Result', desc:'Top breed match + confidence score + origin data + 3 alternatives — all in under 3 seconds.' },
            ].map((s, i) => (
              <React.Fragment key={i}>
                <div className="hiw-card" style={{ '--d': `${i * 0.12}s` }}>
                  <div className="hiw-num">{s.n}</div>
                  <div className="hiw-icon-circle"><span>{s.icon}</span></div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hiw-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ UPLOAD / PREDICT ══════════ */}
      <section id="upload" className="upload-section">
        <div className="sc reveal">
          <div className="eyebrow">AI Identification</div>
          <h2 className="section-h2">Upload &amp; Identify</h2>
          <p className="section-p">Drop a clear photo of a cattle or buffalo and get the breed in seconds.</p>

          <div className="upload-card">
            {/* Drop zone */}
            <div
              className={`drop-zone ${dragOver ? 'dz-over' : ''} ${preview ? 'dz-filled' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !preview && fileInputRef.current?.click()}
            >
              {!preview ? (
                <div className="dz-content">
                  <div className="dz-icon-wrap">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <div className="dz-icon-ring-anim" />
                  </div>
                  <p className="dz-title">{dragOver ? 'Drop it! 🎯' : 'Drag & drop your image'}</p>
                  <p className="dz-divider">— or —</p>
                  <button className="btn-browse" type="button" onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                    Browse Files
                  </button>
                  <p className="dz-formats">JPG · PNG · BMP · Max 50 MB</p>
                </div>
              ) : (
                <div className="preview-container">
                  <img src={preview} alt="Preview" className="preview-img" />
                  <div className="preview-scan-overlay">
                    <div className="pso-beam" />
                  </div>
                  <div className="preview-bar">
                    <span className="pb-filename">{selectedFile?.name}</span>
                    <button className="btn-remove" onClick={e => { e.stopPropagation(); handleClear(); }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={e => handleFileSelect(e.target.files[0])}
              style={{ display: 'none' }}
            />

            <div className="action-row">
              <button
                className={`btn-predict ${loading ? 'btn-loading' : ''}`}
                onClick={handlePredict}
                disabled={!selectedFile || loading}
              >
                {loading
                  ? <><span className="spinner" /> Scanning…</>
                  : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Identify Breed</>
                }
              </button>
              {(selectedFile || predictions) && (
                <button className="btn-clear" onClick={handleClear}>Clear</button>
              )}
            </div>

            {error && (
              <div className="err-banner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}

            {predictions && (
              <div className="results-panel">
                <div className="rp-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                  Analysis Complete
                </div>

                {/* Top match */}
                <div className="top-match">
                  <div className="tm-left">
                    <span className="tm-trophy">🏆</span>
                    <div>
                      <div className="tm-eyebrow">Top Match</div>
                      <div className="tm-breed">{predictions.top_match}</div>
                      {predictions.predictions[0] && (
                        <div className="tm-tags">
                          <span className="pill p-blue">{predictions.predictions[0].type}</span>
                          <span className="pill p-teal">{predictions.predictions[0].origin}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="conf-donut" style={{ '--pct': predictions.confidence, '--clr': confColor(predictions.confidence) }}>
                    <svg viewBox="0 0 36 36">
                      <path className="cd-track" d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"/>
                      <path className="cd-fill" strokeDasharray={`${predictions.confidence},100`} d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"/>
                    </svg>
                    <div className="cd-inner">
                      <strong>{predictions.confidence}%</strong>
                      <span>match</span>
                    </div>
                  </div>
                </div>

                {/* Predictions list */}
                <div className="preds-list">
                  <div className="pl-title">All Predictions</div>
                  {predictions.predictions.map((p, i) => (
                    <div key={i} className={`pred-row ${i === 0 ? 'pr-first' : ''}`} style={{ '--d': `${i * 0.07}s` }}>
                      <span className="pr-rank">#{i + 1}</span>
                      <div className="pr-info">
                        <div className="pr-name">{p.breed}</div>
                        <div className="pr-tags">
                          <span className="pill p-sm">{p.type}</span>
                          <span className="pill p-sm p-ghost">{p.origin}</span>
                        </div>
                      </div>
                      <div className="pr-bar-wrap">
                        <div className="pr-bar">
                          <div className="pr-fill" style={{ width: `${p.confidence}%`, background: confColor(p.confidence) }} />
                        </div>
                        <span className="pr-pct">{p.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="btn-again" onClick={handleClear}>Try Another Image</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════ ABOUT ══════════ */}
      <section id="about" className="about-section">
        <div className="sc reveal">
          <div className="about-grid">
            <div className="about-copy">
              <div className="eyebrow">About the Project</div>
              <h2 className="section-h2 left">AI That Understands Livestock</h2>
              <p>BoviSense AI helps farmers, vets, researchers and agritech platforms identify cattle &amp; buffalo breeds from photographs — instantly and accurately.</p>
              <p>The model uses <strong>transfer learning on ResNet-50</strong>, a 50-layer residual network, trained on a curated dataset covering indigenous and exotic breeds worldwide.</p>
              <div className="tech-stack">
                {['🏗 ResNet-50','🔬 Transfer Learning','📦 PyTorch','🌾 AgriAI','⚡ FastAPI','⚛️ React'].map((t, i) => (
                  <span key={i} className="tech-tag">{t}</span>
                ))}
              </div>
            </div>
            <div className="about-arch">
              <div className="arch-box glass-card">
                <div className="arch-title">Model Architecture</div>
                <div className="arch-steps">
                  {['📷  Input Image','🔲  Conv Layers','♾️  Residual Blocks','🔄  Global Avg Pool','📊  Softmax Output'].map((l, i, arr) => (
                    <React.Fragment key={i}>
                      <div className="arch-step">{l}</div>
                      {i < arr.length - 1 && <div className="arch-down">↓</div>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ TEAM ══════════ */}
      <section id="team" className="team-section">
        <div className="sc reveal">
          <div className="eyebrow">The People Behind It</div>
          <h2 className="section-h2">Our Team</h2>
          <p className="section-p">Passionate engineers building AI tools for agriculture.</p>

          <div className="team-grid">
            {TEAM.map((m, i) => (
              <div className="team-card" key={i} style={{ '--tc': m.color, '--d': `${i * 0.1}s` }}>
                <div className="tc-aura" />
                <div className="tc-avatar-wrap">
                  <div className="tc-avatar" style={{ borderColor: `${m.color}60` }}>
                    <img src={m.profileImg} alt={m.name} className="tc-avatar-img" />
                  </div>
                  <div className="tc-avatar-halo" style={{ borderColor: m.color }} />
                  <div className="tc-avatar-badge" style={{ background: m.color }} />
                </div>
                <div className="tc-name">{m.name}</div>
                <div className="tc-role">{m.role}</div>
                <div className="tc-socials">
                  <a href={m.github} target="_blank" rel="noreferrer" className="social-btn" title="GitHub" style={{ '--sc': m.color }}>
                    <GithubIcon />
                  </a>
                  <a href={m.linkedin} target="_blank" rel="noreferrer" className="social-btn" title="LinkedIn" style={{ '--sc': m.color }}>
                    <LinkedinIcon />
                  </a>
                  <a href={m.email} className="social-btn" title="Email" style={{ '--sc': m.color }}>
                    <MailIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Guide card */}
          <div className="guide-section">
            <div className="guide-eyebrow">Project Guide</div>
            <div className="guide-card glass-card" style={{ '--tc': GUIDE.color }}>
              <div className="gc-aura" />
              <div className="gc-avatar-wrap">
                <div className="gc-avatar" style={{ borderColor: `${GUIDE.color}60` }}>
                  <img src={GUIDE.profileImg} alt={GUIDE.name} className="tc-avatar-img" />
                </div>
                <div className="gc-star">⭐</div>
              </div>
              <div className="gc-text">
                <div className="gc-name">{GUIDE.name}</div>
                <div className="gc-role">{GUIDE.role}</div>
              </div>
              <div className="gc-socials">
                <a href={GUIDE.linkedin} target="_blank" rel="noreferrer" className="social-btn" title="LinkedIn" style={{ '--sc': GUIDE.color }}>
                  <LinkedinIcon />
                </a>
                <a href={GUIDE.email} className="social-btn" title="Email" style={{ '--sc': GUIDE.color }}>
                  <MailIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-grid">
            {/* Brand column */}
            <div className="footer-col footer-col-brand">
              {/* ── FOOTER LOGO: real image ── */}
              <div className="footer-logo-row">
                <img
                  src={boviLogo}
                  alt="BoviSense AI"
                  className="footer-logo-img"
                />
                <span className="logo-wordmark">BoviSense <em>AI</em></span>
              </div>
              <p className="footer-about-text">
                AI-powered cattle &amp; buffalo breed identification using deep learning. Built for farmers, vets, and agritech platforms.
              </p>
              <div className="footer-tech-pills">
                {['ResNet-50', 'PyTorch', 'FastAPI', 'React'].map((t, i) => (
                  <span key={i} className="footer-tech-pill">{t}</span>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <div className="footer-col-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Quick Links
              </div>
              <ul className="footer-links">
                {[['features','Features'],['how-it-works','How It Works'],['upload','Try It'],['team','Team'],['about','About']].map(([id, l]) => (
                  <li key={id}>
                    <button className="footer-link-btn" onClick={() => scrollTo(id)}>
                      <span className="footer-link-arrow">→</span> {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Team column */}
            <div className="footer-col">
              <div className="footer-col-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Our Team
              </div>
              <div className="footer-team-list">
                {TEAM.map((m, i) => (
                  <div key={i} className="footer-team-member">
                    <div className="ftm-dot" style={{ background: m.color }} />
                    <div>
                      <div className="ftm-name">{m.name}</div>
                      <div className="ftm-role">{m.role}</div>
                    </div>
                  </div>
                ))}
                <div className="footer-team-member ftm-guide">
                  <div className="ftm-dot" style={{ background: GUIDE.color }} />
                  <div>
                    <div className="ftm-name">{GUIDE.name}</div>
                    <div className="ftm-role">{GUIDE.role}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact column */}
            <div className="footer-col">
              <div className="footer-col-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Connect
              </div>
              <div className="footer-social-grid">
                <a href={TEAM[0].github} target="_blank" rel="noreferrer" className="footer-social-btn" title="GitHub">
                  <GithubIcon />
                  <span>GitHub</span>
                </a>
                <a href={TEAM[0].linkedin} target="_blank" rel="noreferrer" className="footer-social-btn footer-social-linkedin" title="LinkedIn">
                  <LinkedinIcon />
                  <span>LinkedIn</span>
                </a>
                <a href={GUIDE.email} className="footer-social-btn footer-social-mail" title="Email">
                  <MailIcon />
                  <span>Email Us</span>
                </a>
              </div>
              <div className="footer-badge-row">
                <div className="footer-status-badge">
                  <span className="hb-pulse" />
                  Model Active
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <span className="footer-copy">
              © {new Date().getFullYear()} <strong>BoviSense AI</strong> · all rights reserved.
            </span>
            <div className="footer-bottom-links">
              <span>Dept. of Computer Science &amp; Engineering</span>
              <span className="footer-dot">·</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}