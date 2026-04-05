```aura width=800 height=260
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#06060a', borderRadius: 20, padding: 30, fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden', border: '1px solid rgba(110,80,220,0.2)' }}>
  <style>
    {`
      @keyframes hdr-drift-r { 0%, 100% { transform: translate(0, 0); opacity: 0.7; } 50% { transform: translate(45px, -22px); opacity: 1.15; } }
      @keyframes hdr-drift-l { 0%, 100% { transform: translate(0, 0); opacity: 0.6; } 50% { transform: translate(-40px, 20px); opacity: 1.05; } }
      @keyframes hdr-drift-u { 0%, 100% { transform: translate(0, 0); opacity: 0.75; } 50% { transform: translate(30px, -30px); opacity: 1.1; } }
      @keyframes hdr-pulse { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.3); opacity: 0.35; } }
      @keyframes hdr-scan { 0% { transform: translate(-900px, 0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translate(900px, 0); opacity: 0; } }
      @keyframes hdr-ring-pulse { 0%, 100% { transform: scale(0.9); opacity: 0.15; } 50% { transform: scale(1.1); opacity: 0.4; } }
      @keyframes hdr-ring2-pulse { 0%, 100% { transform: scale(1.1); opacity: 0.1; } 50% { transform: scale(0.85); opacity: 0.3; } }
      @keyframes hdr-draw { 0% { stroke-dashoffset: 500; } 100% { stroke-dashoffset: 0; } }
      @keyframes hdr-draw-rev { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -400; } }
      @keyframes hdr-dot-float { 0%, 100% { transform: translate(0, 0); opacity: 0.4; } 50% { transform: translate(12px, -18px); opacity: 1; } }
      #hdr-g1 { animation: hdr-drift-r 6.5s ease-in-out infinite; }
      #hdr-g2 { animation: hdr-drift-l 8.2s ease-in-out infinite 0.4s; }
      #hdr-g3 { animation: hdr-drift-u 7.0s ease-in-out infinite 0.7s; }
      #hdr-g4 { animation: hdr-pulse 5.0s ease-in-out infinite; }
      #hdr-scan1 { animation: hdr-scan 4s linear infinite; }
      #hdr-scan2 { animation: hdr-scan 4.5s linear infinite 2s; }
      #hdr-ring1 { animation: hdr-ring-pulse 4s ease-in-out infinite; }
      #hdr-ring2 { animation: hdr-ring2-pulse 5s ease-in-out infinite 0.5s; }
      #hdr-path1 { animation: hdr-draw 3s ease-in-out infinite; }
      #hdr-dot1 { animation: hdr-dot-float 3.5s ease-in-out infinite; }
    `}
  </style>
  <svg width="800" height="260" style={{ position: 'absolute', top: 0, left: 0 }}>
    <defs>
      <radialGradient id="hg1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(138,43,226,0.65)" />
        <stop offset="100%" stopColor="rgba(138,43,226,0)" />
      </radialGradient>
      <radialGradient id="hg2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(20,80,255,0.6)" />
        <stop offset="100%" stopColor="rgba(20,80,255,0)" />
      </radialGradient>
      <radialGradient id="hg3" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(0,220,240,0.55)" />
        <stop offset="100%" stopColor="rgba(0,220,240,0)" />
      </radialGradient>
      <radialGradient id="hg4" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(220,40,255,0.5)" />
        <stop offset="100%" stopColor="rgba(220,40,255,0)" />
      </radialGradient>
      <linearGradient id="hg-scan" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(120,200,255,0)" />
        <stop offset="50%" stopColor="rgba(120,200,255,0.4)" />
        <stop offset="100%" stopColor="rgba(120,200,255,0)" />
      </linearGradient>
    </defs>
    <ellipse id="hdr-g1" cx="80" cy="50" rx="180" ry="120" fill="url(#hg1)" />
    <ellipse id="hdr-g2" cx="720" cy="70" rx="160" ry="110" fill="url(#hg2)" />
    <ellipse id="hdr-g3" cx="400" cy="220" rx="200" ry="120" fill="url(#hg3)" />
    <ellipse id="hdr-g4" cx="220" cy="180" rx="130" ry="90" fill="url(#hg4)" />
    <circle id="hdr-ring1" cx="400" cy="110" r="80" fill="none" stroke="rgba(120,80,255,0.2)" strokeWidth="1" />
    <circle id="hdr-ring2" cx="400" cy="110" r="120" fill="none" stroke="rgba(80,180,255,0.12)" strokeWidth="1" />
    <rect id="hdr-scan1" x="0" y="90" width="200" height="1" fill="url(#hg-scan)" />
    <circle id="hdr-dot1" cx="120" cy="45" r="2" fill="rgba(120,200,255,0.8)" />
  </svg>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, gap: 4 }}>
    <span style={{ fontSize: 64, fontWeight: 900, background: 'linear-gradient(135deg, #ffffff 0%, #d0c0ff 30%, #7ee7ff 55%, #ff88cc 80%, #ffffff 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', letterSpacing: 10 }}>PRABHAT</span>
    <span style={{ fontSize: 14, color: '#6a6a8a', fontWeight: 400, letterSpacing: 4, textTransform: 'uppercase', marginTop: 2 }}>Kunwar Prabhat</span>
    <span style={{ fontSize: 12, color: '#4a4a6a', fontWeight: 300, letterSpacing: 1.5, marginTop: 6 }}>Low-level Systems Programmer | Performance Engineering | Bare-metal</span>
  </div>
  <div style={{ display: 'flex', gap: 8, marginTop: 22, zIndex: 10 }}>
    {['C# developer', '.NET Core', 'AI/ML', 'open source'].map((skill, i) => (
      <span key={skill} style={{ padding: '5px 16px', background: 'rgba(8,6,14,0.7)', color: ['#7ee7ff', '#e8c8ff', '#ff88cc', '#9ee79e'][i], borderRadius: 14, fontSize: 12, fontWeight: 600, border: '1px solid rgba(120,200,255,0.2)', letterSpacing: 1 }}>{skill}</span>
    ))}
  </div>
</div>
```



```aura width=800 height=70
<div style={{ display: 'flex', gap: 10, padding: '14px 22px', width: '100%', height: '100%', background: '#06060a', borderRadius: 30, alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden', border: '1px solid rgba(110,80,220,0.15)' }}>
  <style>
    {`
      @keyframes ts-scan { 0% { transform: translate(-900px, 0); } 100% { transform: translate(900px, 0); } }
      #ts-scan1 { animation: ts-scan 3.5s linear infinite; }
    `}
  </style>
  <svg width="800" height="70" style={{ position: 'absolute', top: 0, left: 0 }}>
    <defs>
      <linearGradient id="ts-scg" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(120,200,255,0)" />
        <stop offset="50%" stopColor="rgba(180,120,255,0.35)" />
        <stop offset="100%" stopColor="rgba(120,200,255,0)" />
      </linearGradient>
    </defs>
    <rect id="ts-scan1" x="0" y="34" width="140" height="1" fill="url(#ts-scg)" />
  </svg>
  {['C#', 'C++', 'x86 ASM', 'Python', 'JavaScript', 'ASP.NET', 'PostgreSQL', 'React.js'].map((t, i) => (
    <span key={t} style={{ padding: '5px 16px', background: 'rgba(8,6,14,0.7)', color: ['#7eb8ff', '#78d4ff', '#b8a0ff', '#9ee79e', '#ffcc88', '#ffb088', '#e8c8ff', '#7ee7ff'][i], borderRadius: 16, fontSize: 13, fontWeight: 700, border: '1px solid rgba(100,80,220,0.25)', zIndex: 10 }}>{t}</span>
  ))}
</div>
```

```aura width=800 height=100
<div style={{ display: 'flex', width: '100%', height: '100%', gap: 12, fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden', background: '#06060a', borderRadius: 16, padding: 18, border: '1px solid rgba(110,80,220,0.15)', alignItems: 'center', justifyContent: 'center' }}>
  <div style={{ display: 'flex', gap: 30, alignItems: 'center', zIndex: 10 }}>
    {[
      { val: github?.stats?.totalStars, label: 'Stars', color: '#b8860b' },
      { val: github?.stats?.totalForks, label: 'Forks', color: '#8b7ec8' },
      { val: github?.stats?.totalRepos, label: 'Repos', color: '#5a9ca8' },
      { val: github?.stats?.totalCommits, label: 'Commits', color: '#7ee7ff' }
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
```

```aura width=800 height=180
<div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden', background: '#06060a', borderRadius: 16, padding: 24, border: '1px solid rgba(110,80,220,0.15)' }}>
  <span style={{ fontSize: 10, color: 'rgba(120,200,255,0.7)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16, fontWeight: 600, zIndex: 10 }}>Most Used Languages</span>
  <div style={{ display: 'flex', width: '100%', height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 16, zIndex: 10, background: 'rgba(255,255,255,0.05)' }}>
    {(github?.languages ?? []).map((lang, i) => (
      <div key={i} style={{ width: `${lang.percentage}%`, height: '100%', background: lang.color }} />
    ))}
  </div>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, zIndex: 10 }}>
    {(github?.languages ?? []).map((lang, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 120 }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: lang.color, boxShadow: `0 0 6px ${lang.color}40` }}></span>
        <span style={{ fontSize: 13, color: '#e0e0f0', fontWeight: 500 }}>{lang.name}</span>
        <span style={{ fontSize: 11, color: '#6a6a8a', fontWeight: 400 }}>{lang.percentage}%</span>
      </div>
    ))}
  </div>
</div>
```

<div align="center">

![Contribution Calendar](./.github/assets/contribution-calendar.svg "Contribution Calendar")

![visitors](https://visitor-badge.laobi.icu/badge?page_id=KunwarPrabhat.KunwarPrabhat)

</div>

```aura width=800 height=185
<div style={{ display: 'flex', width: '100%', height: '100%', gap: 12, fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden', background: '#06060a', borderRadius: 16, padding: 18, border: '1px solid rgba(110,80,220,0.15)' }}>
  <style>
    {`
      @keyframes proj-drift-r { 0%, 100% { transform: translate(0, 0); opacity: 0.7; } 50% { transform: translate(30px, -15px); opacity: 1.05; } }
      @keyframes proj-drift-l { 0%, 100% { transform: translate(0, 0); opacity: 0.6; } 50% { transform: translate(-26px, 14px); opacity: 1; } }
      #proj-g1 { animation: proj-drift-r 7s ease-in-out infinite; }
      #proj-g2 { animation: proj-drift-l 8.5s ease-in-out infinite 0.3s; }
    `}
  </style>
  <svg width="800" height="185" style={{ position: 'absolute', top: 0, left: 0 }}>
    <defs>
      <radialGradient id="pg1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(80,40,200,0.5)" />
        <stop offset="100%" stopColor="rgba(80,40,200,0)" />
      </radialGradient>
      <radialGradient id="pg2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(0,200,220,0.45)" />
        <stop offset="100%" stopColor="rgba(0,200,220,0)" />
      </radialGradient>
    </defs>
    <ellipse id="proj-g1" cx="180" cy="90" rx="170" ry="100" fill="url(#pg1)" />
    <ellipse id="proj-g2" cx="620" cy="110" rx="150" ry="90" fill="url(#pg2)" />
  </svg>
  {[
    { name: 'MetalNet', tag: 'CNN Engine', desc: 'Engineered a high-performance CNN from scratch in C++ without libraries. Features a custom tensor system and modular architecture.', tags: ['C++', 'Ninja'], color: '#7ee7ff' },
    { name: 'ColdFish', tag: 'Chess Engine', desc: 'Custom chess engine with SDL2 GUI, Minimax + Alpha beta pruning, move ordering and efficient tree search reaching upto 1500 elo.', tags: ['C++', 'SDL2'], color: '#e8c8ff' },
    { name: 'KinetX', tag: 'Physics Engine', desc: 'Custom physics engine with Verlet integration and high-performance physics pipeline.', tags: ['C#', 'WPF'], color: '#ff88cc' }
  ].map((p) => (
    <div key={p.name} style={{ display: 'flex', flexDirection: 'column', flex: 1, background: 'rgba(10,8,18,0.7)', borderRadius: 14, padding: 18, border: '1px solid rgba(120,200,255,0.12)', zIndex: 10, justifyContent: 'center' }}>
      <span style={{ fontSize: 17, fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>{p.name}</span>
      <span style={{ fontSize: 11, color: p.color, marginBottom: 6, fontWeight: 600, letterSpacing: 0.5 }}>{p.tag}</span>
      <span style={{ fontSize: 11, color: 'rgba(200,200,230,0.75)', lineHeight: 1.4, marginBottom: 10 }}>{p.desc}</span>
      <div style={{ display: 'flex', gap: 5 }}>
        {p.tags.map(t => (
          <span key={t} style={{ padding: '2px 10px', background: 'rgba(120,200,255,0.08)', color: p.color, borderRadius: 8, fontSize: 10, fontWeight: 600, border: '1px solid rgba(120,200,255,0.15)' }}>{t}</span>
        ))}
      </div>
    </div>
  ))}
</div>
```
