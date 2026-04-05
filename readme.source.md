<div align="center">

![visitors](https://visitor-badge.laobi.icu/badge?page_id=KunwarPrabhat.KunwarPrabhat)

</div>

```aura width=800 height=1115
<div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#06060a', borderRadius: 20, padding: 25, fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden', border: '1px solid rgba(110,80,220,0.2)', gap: 15 }}>
  <style>
    {`
      @keyframes drift { 0%, 100% { transform: translate(0, 0); opacity: 0.7; } 50% { transform: translate(30px, -20px); opacity: 0.9; } }
      @keyframes drift2 { 0%, 100% { transform: translate(0, 0); opacity: 0.6; } 50% { transform: translate(-30px, 15px); opacity: 0.8; } }
      @keyframes scan { 0% { transform: translateX(-900px); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateX(900px); opacity: 0; } }
      
      #g1 { animation: drift 8s ease-in-out infinite; }
      #g2 { animation: drift2 9s ease-in-out infinite 0.5s; }
      #g3 { animation: drift 7.5s ease-in-out infinite 0.3s; }
      #g4 { animation: drift2 8.5s ease-in-out infinite 0.8s; }
      
      .scan-line { animation: scan 4s linear infinite; }
    `}
  </style>

  {/* Optimized Global Animated Background for Zero Lag */}
  <svg width="800" height="1115" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
    <defs>
      <radialGradient id="grad1" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(138,43,226,0.3)" /><stop offset="100%" stopColor="rgba(138,43,226,0)" /></radialGradient>
      <radialGradient id="grad2" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(20,80,255,0.3)" /><stop offset="100%" stopColor="rgba(20,80,255,0)" /></radialGradient>
      <radialGradient id="grad3" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(0,220,240,0.25)" /><stop offset="100%" stopColor="rgba(0,220,240,0)" /></radialGradient>
      <radialGradient id="grad4" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(220,40,255,0.25)" /><stop offset="100%" stopColor="rgba(220,40,255,0)" /></radialGradient>
      
      <linearGradient id="scg" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(120,200,255,0)" /><stop offset="50%" stopColor="rgba(180,120,255,0.3)" /><stop offset="100%" stopColor="rgba(120,200,255,0)" />
      </linearGradient>
    </defs>
    
    {/* 4 Large softly animated background blobs instead of 8 to prevent browser lag */}
    <ellipse id="g1" cx="200" cy="150" rx="350" ry="250" fill="url(#grad1)" />
    <ellipse id="g2" cx="600" cy="450" rx="350" ry="250" fill="url(#grad2)" />
    <ellipse id="g3" cx="200" cy="750" rx="350" ry="250" fill="url(#grad3)" />
    <ellipse id="g4" cx="600" cy="1050" rx="350" ry="250" fill="url(#grad4)" />

    {/* Thin scanning laser effects */}
    <rect class="scan-line" x="0" y="200" width="200" height="1" fill="url(#scg)" />
    <rect class="scan-line" style={{ animationDelay: '1.5s' }} x="0" y="500" width="200" height="1" fill="url(#scg)" />
    <rect class="scan-line" style={{ animationDelay: '3s' }} x="0" y="800" width="200" height="1" fill="url(#scg)" />
  </svg>

  {/* ═══════════════ HERO ═══════════════ */}
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: 260, zIndex: 10 }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 64, fontWeight: 900, background: 'linear-gradient(135deg, #ffffff 0%, #d0c0ff 30%, #7ee7ff 55%, #ff88cc 80%, #ffffff 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', letterSpacing: 10 }}>PRABHAT</span>
      <span style={{ fontSize: 14, color: '#6a6a8a', fontWeight: 400, letterSpacing: 4, textTransform: 'uppercase', marginTop: 2 }}>Kunwar Prabhat</span>
      <span style={{ fontSize: 12, color: '#e0e0f0', fontWeight: 300, letterSpacing: 1.5, marginTop: 6 }}>Low-level Systems Programmer | Performance Engineering | Bare-metal</span>
    </div>
    <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
      {['C# developer', '.NET Core', 'AI/ML', 'open source'].map((skill, i) => (
        <span key={skill} style={{ padding: '5px 16px', background: 'rgba(8,6,14,0.7)', color: ['#7ee7ff', '#e8c8ff', '#ff88cc', '#9ee79e'][i], borderRadius: 14, fontSize: 12, fontWeight: 600, border: '1px solid rgba(120,200,255,0.2)', letterSpacing: 1 }}>{skill}</span>
      ))}
    </div>
  </div>

  {/* ═══════════════ TECH STACK ═══════════════ */}
  <div style={{ display: 'flex', gap: 10, width: '100%', height: 70, background: 'rgba(10,8,18,0.7)', borderRadius: 30, alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(110,80,220,0.15)', zIndex: 10 }}>
    {['C#', 'C++', 'x86 ASM', 'Python', 'JavaScript', 'ASP.NET', 'PostgreSQL', 'React.js'].map((t, i) => (
      <span key={t} style={{ padding: '5px 16px', background: 'rgba(8,6,14,0.7)', color: ['#7eb8ff', '#78d4ff', '#b8a0ff', '#9ee79e', '#ffcc88', '#ffb088', '#e8c8ff', '#7ee7ff'][i], borderRadius: 16, fontSize: 13, fontWeight: 700, border: '1px solid rgba(100,80,220,0.25)' }}>{t}</span>
    ))}
  </div>

  {/* ═══════════════ STATS ═══════════════ */}
  <div style={{ display: 'flex', width: '100%', height: 100, background: 'rgba(10,8,18,0.7)', borderRadius: 16, alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(110,80,220,0.15)', zIndex: 10 }}>
    <div style={{ display: 'flex', gap: 30, alignItems: 'center'}}>
      {[
        { val: 3, label: 'Stars', color: '#b8860b' },
        { val: 4, label: 'Forks', color: '#8b7ec8' },
        { val: 30, label: 'Repos', color: '#5a9ca8' },
        { val: 245, label: 'Commits', color: '#7ee7ff' }
      ].map((item, i) => (
        <React.Fragment key={item.label}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>{item.val ?? 0}</span>
            <span style={{ fontSize: 10, color: item.color, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600 }}>{item.label}</span>
          </div>
          {i < 3 && <span style={{ width: 1, height: 40, background: 'rgba(120,80,220,0.2)' }}></span>}
        </React.Fragment>
      ))}
    </div>
  </div>

  {/* ═══════════════ LANGUAGES ═══════════════ */}
  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: 180, background: 'rgba(10,8,18,0.7)', borderRadius: 16, padding: '24px 30px', border: '1px solid rgba(110,80,220,0.15)', zIndex: 10 }}>
    <span style={{ fontSize: 10, color: 'rgba(120,200,255,0.7)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16, fontWeight: 600 }}>Most Used Languages</span>
    <div style={{ display: 'flex', width: '100%', height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 16, background: 'rgba(255,255,255,0.05)' }}>
      <div style={{ width: '47.4%', height: '100%', background: '#178600' }} />
      <div style={{ width: '12.5%', height: '100%', background: '#222c37' }} />
      <div style={{ width: '11.1%', height: '100%', background: '#f34b7d' }} />
      <div style={{ width: '10.9%', height: '100%', background: '#f1e05a' }} />
      <div style={{ width: '7.0%', height: '100%', background: '#663399' }} />
      <div style={{ width: '3.9%', height: '100%', background: '#dd1100' }} />
      <div style={{ width: '3.2%', height: '100%', background: '#e34c26' }} />
      <div style={{ width: '2.5%', height: '100%', background: '#aace60' }} />
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 120 }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: '#178600', boxShadow: '0 0 6px #17860040' }}></span>
        <span style={{ fontSize: 13, color: '#e0e0f0', fontWeight: 500 }}>C#</span>
        <span style={{ fontSize: 11, color: '#6a6a8a', fontWeight: 400 }}>47.4%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 120 }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: '#222c37', boxShadow: '0 0 6px #222c3740' }}></span>
        <span style={{ fontSize: 13, color: '#e0e0f0', fontWeight: 500 }}>ShaderLab</span>
        <span style={{ fontSize: 11, color: '#6a6a8a', fontWeight: 400 }}>12.5%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 120 }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: '#f34b7d', boxShadow: '0 0 6px #f34b7d40' }}></span>
        <span style={{ fontSize: 13, color: '#e0e0f0', fontWeight: 500 }}>C++</span>
        <span style={{ fontSize: 11, color: '#6a6a8a', fontWeight: 400 }}>11.1%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 120 }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: '#f1e05a', boxShadow: '0 0 6px #f1e05a40' }}></span>
        <span style={{ fontSize: 13, color: '#e0e0f0', fontWeight: 500 }}>JavaScript</span>
        <span style={{ fontSize: 11, color: '#6a6a8a', fontWeight: 400 }}>10.9%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 120 }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: '#663399', boxShadow: '0 0 6px #66339940' }}></span>
        <span style={{ fontSize: 13, color: '#e0e0f0', fontWeight: 500 }}>CSS</span>
        <span style={{ fontSize: 11, color: '#6a6a8a', fontWeight: 400 }}>7.0%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 120 }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: '#dd1100', boxShadow: '0 0 6px #dd110040' }}></span>
        <span style={{ fontSize: 13, color: '#e0e0f0', fontWeight: 500 }}>Mathematica</span>
        <span style={{ fontSize: 11, color: '#6a6a8a', fontWeight: 400 }}>3.9%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 120 }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: '#e34c26', boxShadow: '0 0 6px #e34c2640' }}></span>
        <span style={{ fontSize: 13, color: '#e0e0f0', fontWeight: 500 }}>HTML</span>
        <span style={{ fontSize: 11, color: '#6a6a8a', fontWeight: 400 }}>3.2%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 120 }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: '#aace60', boxShadow: '0 0 6px #aace6040' }}></span>
        <span style={{ fontSize: 13, color: '#e0e0f0', fontWeight: 500 }}>HLSL</span>
        <span style={{ fontSize: 11, color: '#6a6a8a', fontWeight: 400 }}>2.5%</span>
      </div>
    </div>
  </div>

  {/* ═══════════════ CALENDAR ═══════════════ */}
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 195, zIndex: 10 }}>
     <img src="./.github/assets/contribution-calendar.svg" width={800} height={195} alt="Contribution Calendar" style={{ borderRadius: 16 }} />
  </div>

  {/* ═══════════════ TOP PROJECTS ═══════════════ */}
  <div style={{ display: 'flex', width: '100%', height: 185, gap: 15, zIndex: 10 }}>
    {[
      { name: 'MetalNet', tag: 'CNN Engine', desc: 'Engineered a high-performance CNN from scratch in C++ without libraries. Features a custom tensor system and modular architecture.', tags: ['C++', 'Ninja'], color: '#7ee7ff' },
      { name: 'ColdFish', tag: 'Chess Engine', desc: 'Custom chess engine with SDL2 GUI, Minimax + Alpha beta pruning, move ordering and efficient tree search reaching upto 1500 elo.', tags: ['C++', 'SDL2'], color: '#e8c8ff' },
      { name: 'KinetX', tag: 'Physics Engine', desc: 'Custom physics engine with Verlet integration and high-performance physics pipeline.', tags: ['C#', 'WPF'], color: '#ff88cc' }
    ].map((p) => (
      <div key={p.name} style={{ display: 'flex', flexDirection: 'column', flex: 1, background: 'rgba(10,8,18,0.7)', borderRadius: 14, padding: 18, border: '1px solid rgba(120,200,255,0.12)', justifyContent: 'center' }}>
        <span style={{ fontSize: 17, fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>{p.name}</span>
        <span style={{ fontSize: 11, color: p.color, marginBottom: 6, fontWeight: 600, letterSpacing: 0.5 }}>{p.tag}</span>
        <span style={{ fontSize: 11, color: 'rgba(200,200,230,0.85)', lineHeight: 1.4, marginBottom: 10 }}>{p.desc}</span>
        <div style={{ display: 'flex', gap: 5 }}>
          {p.tags.map(t => (
            <span key={t} style={{ padding: '2px 10px', background: 'rgba(120,200,255,0.08)', color: p.color, borderRadius: 8, fontSize: 10, fontWeight: 600, border: '1px solid rgba(120,200,255,0.15)' }}>{t}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
</div>
```
