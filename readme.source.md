```aura width=800 height=900
<div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%', height: '100%', fontFamily: 'Inter, sans-serif', background: '#030305', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 0 60px rgba(0,100,255,0.04)' }}>
  <style>
    {`
      @keyframes aurora-drift-1 {
        0%, 100% { transform: translate(0,0) scale(1); opacity: 0.55; }
        50% { transform: translate(80px, 40px) scale(1.1); opacity: 0.75; }
      }
      @keyframes aurora-drift-2 {
        0%, 100% { transform: translate(0,0) scale(1); opacity: 0.45; }
        50% { transform: translate(-65px, -35px) scale(1.12); opacity: 0.65; }
      }
      @keyframes aurora-drift-3 {
        0%, 100% { transform: translate(0,0); opacity: 0.35; }
        50% { transform: translate(30px, 50px); opacity: 0.55; }
      }
    `}
  </style>

  {/* Aurora — 3 blobs, faster 16s/14s/18s, higher opacity */}
  <svg width="800" height="900" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} aria-hidden="true">
    <defs>
      <radialGradient id="a1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(0,140,255,0.5)" />
        <stop offset="100%" stopColor="rgba(0,140,255,0)" />
      </radialGradient>
      <radialGradient id="a2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(100,40,230,0.42)" />
        <stop offset="100%" stopColor="rgba(100,40,230,0)" />
      </radialGradient>
      <radialGradient id="a3" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(0,200,180,0.32)" />
        <stop offset="100%" stopColor="rgba(0,200,180,0)" />
      </radialGradient>
    </defs>
    <ellipse cx="640" cy="180" rx="320" ry="210" fill="url(#a1)" style={{ animation: 'aurora-drift-1 16s ease-in-out infinite' }} />
    <ellipse cx="160" cy="680" rx="290" ry="190" fill="url(#a2)" style={{ animation: 'aurora-drift-2 14s ease-in-out infinite' }} />
    <ellipse cx="480" cy="480" rx="240" ry="160" fill="url(#a3)" style={{ animation: 'aurora-drift-3 18s ease-in-out infinite' }} />
  </svg>

  {/* HERO */}
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: 240, padding: 28, position: 'relative', zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 56, fontWeight: 900, background: 'linear-gradient(135deg, #ffffff 0%, #b0d4ff 25%, #7ee7ff 50%, #60aaff 75%, #ffffff 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', letterSpacing: 8, filter: 'drop-shadow(0 0 18px rgba(80,180,255,0.5))' }}>PRABHAT</span>
      <span style={{ fontSize: 13, color: 'rgba(180,205,240,0.85)', fontWeight: 500, letterSpacing: 4, textTransform: 'uppercase', marginTop: 4 }}>B.Tech CSE · Cambridge Institute of Technology</span>
      <span style={{ fontSize: 12, color: 'rgba(140,180,220,0.65)', fontWeight: 300, letterSpacing: 2, marginTop: 6 }}>C# developer · .NET Core · AI/ML</span>
    </div>
    <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
      {['C# / C++', 'ASP.NET Core', 'Machine Learning', 'x86 ASM'].map((skill, i) => (
        <span key={i} style={{ padding: '6px 16px', background: 'rgba(0,130,255,0.08)', color: '#7ee7ff', borderRadius: 14, fontSize: 12, fontWeight: 600, border: '1px solid rgba(0,180,255,0.25)', letterSpacing: 1, boxShadow: '0 0 10px rgba(0,180,255,0.12)' }}>{skill}</span>
      ))}
    </div>
  </div>

  {/* LANGUAGES */}
  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '16px 26px 14px', position: 'relative', zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
    <span style={{ fontSize: 10, color: 'rgba(120,200,255,0.85)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 12, fontWeight: 800, filter: 'drop-shadow(0 0 6px rgba(0,180,255,0.4))' }}>Most Used Languages</span>
    <div style={{ display: 'flex', width: '100%', height: 7, borderRadius: 4, overflow: 'hidden', marginBottom: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 0 8px rgba(0,0,0,0.3)' }}>
      {(() => {
        const fb = [{name:'C#',percentage:38,color:'#00c8f0'},{name:'C++',percentage:28,color:'#f34b7d'},{name:'Python',percentage:12,color:'#3572A5'},{name:'C',percentage:8,color:'#777777'},{name:'x86 ASM',percentage:6,color:'#b09060'},{name:'JS',percentage:4,color:'#f1e05a'},{name:'Other',percentage:4,color:'#7050a0'}];
        const langs = (github?.languages?.[0]?.name === 'TypeScript') ? fb : (github?.languages ?? fb);
        return langs.map((l, i) => <div key={i} style={{ width: `${l.percentage}%`, height: '100%', background: l.color }} />);
      })()}
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px 22px' }}>
      {(() => {
        const fb = [{name:'C#',percentage:38,color:'#00c8f0'},{name:'C++',percentage:28,color:'#f34b7d'},{name:'Python',percentage:12,color:'#3572A5'},{name:'C',percentage:8,color:'#777777'},{name:'x86 ASM',percentage:6,color:'#b09060'},{name:'JS',percentage:4,color:'#f1e05a'}];
        const langs = (github?.languages?.[0]?.name === 'TypeScript') ? fb : (github?.languages ?? fb);
        return langs.slice(0,6).map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: l.color, boxShadow: `0 0 6px ${l.color}88` }}></div>
            <span style={{ fontSize: 12, color: 'rgba(220,235,255,0.9)', fontWeight: 600 }}>{l.name}</span>
            <span style={{ fontSize: 11, color: 'rgba(220,235,255,0.4)' }}>{l.percentage}%</span>
          </div>
        ));
      })()}
    </div>
  </div>

  {/* TECH STACK */}
  <div style={{ display: 'flex', gap: 9, padding: '10px 22px', width: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
    {['C#', 'C++', 'x86 ASM', 'Python', 'JavaScript', 'ASP.NET', 'PostgreSQL', 'React.js'].map((t, i) => (
      <span key={i} style={{ padding: '4px 13px', background: 'rgba(0,100,200,0.08)', color: '#85c4ff', borderRadius: 16, fontSize: 12, fontWeight: 700, border: '1px solid rgba(0,160,255,0.2)', boxShadow: '0 0 8px rgba(0,140,255,0.1)' }}>{t}</span>
    ))}
  </div>

  {/* STATS */}
  <div style={{ display: 'flex', width: '100%', height: 100, alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around', padding: '0 30px' }}>
      {[{v: github?.stats?.totalStars, l: 'Stars', c: '#fde047'}, {v: github?.stats?.totalForks, l: 'Forks', c: '#ff7eb9'}, {v: github?.stats?.totalRepos, l: 'Repos', c: '#7ee7ff'}, {v: github?.stats?.totalCommits, l: 'Commits', c: '#c084fc'}].map((s, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <span style={{ fontSize: 34, fontWeight: 900, color: '#ffffff', lineHeight: 1, filter: `drop-shadow(0 0 10px ${s.c}66)` }}>{s.v ?? 0}</span>
          <span style={{ fontSize: 10, color: s.c, textTransform: 'uppercase', letterSpacing: 4, fontWeight: 800, filter: `drop-shadow(0 0 5px ${s.c}55)` }}>{s.l}</span>
        </div>
      ))}
    </div>
  </div>

  {/* CONTRIBUTION CALENDAR — pre-rendered half-year SVG with real GitHub API data */}
  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '14px 26px 12px', position: 'relative', zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 10, color: 'rgba(120,200,255,0.85)', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 800, filter: 'drop-shadow(0 0 6px rgba(0,180,255,0.4))' }}>Contribution Activity</span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(0,180,255,0.25), transparent)' }}></div>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: 1 }}>Last 6 months</span>
    </div>
    <img src="./.github/assets/contributions-calendar.svg" width={750} height={120} alt="Contribution Calendar" style={{ display: 'block', borderRadius: 6 }} />
  </div>

  {/* PROJECTS */}
  <div style={{ display: 'flex', width: '100%', position: 'relative', zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
    {[{t:'KinetX',d:'Custom physics engine with Verlet integration and high-performance collision pipeline.',tags:['C#','WPF']},{t:'ColdFish',d:'Chess engine with SDL2 GUI, Minimax/Alpha-Beta reaching 1500 ELO.',tags:['C++','SDL2']},{t:'MetalNet',d:'High-performance CNN from scratch in C++ with custom tensor system and modular architecture.',tags:['C++','Ninja']}].map((p, i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '18px 20px', background: i === 1 ? 'rgba(0,100,255,0.04)' : 'transparent', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', marginBottom: 5, filter: 'drop-shadow(0 0 8px rgba(80,160,255,0.4))' }}>{p.t}</span>
        <span style={{ fontSize: 11, color: 'rgba(200,220,250,0.55)', lineHeight: 1.45, marginBottom: 12 }}>{p.d}</span>
        <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
          {p.tags.map((tag, j) => (
            <span key={j} style={{ padding: '2px 10px', background: 'rgba(0,130,255,0.07)', color: '#7ee7ff', borderRadius: 8, fontSize: 10, fontWeight: 600, border: '1px solid rgba(0,160,255,0.2)', boxShadow: '0 0 6px rgba(0,160,255,0.1)' }}>{tag}</span>
          ))}
        </div>
      </div>
    ))}
  </div>

  {/* STREAK — flush with the projects, no gap */}
  <div style={{ display: 'flex', width: '100%', height: 148, alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
    <img src="https://streak-stats.demolab.com/?user=KunwarPrabhat&theme=transparent&hide_border=true&background=00000000&stroke=1a3060&ring=60aaff&fire=7ee7ff&currStreakLabel=7ee7ff&sideLabels=6080a0&dates=40607a&sideNums=ffffff&currStreakNum=ffffff" width={720} height={135} alt="GitHub Streak" />
  </div>
</div>
```

<div align="center">

![visitors](https://visitor-badge.laobi.icu/badge?page_id=KunwarPrabhat.KunwarPrabhat)

</div>
