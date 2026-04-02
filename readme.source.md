```aura width=800 height=1150
<div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%', height: '100%', fontFamily: 'Inter, sans-serif', background: '#030305', borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', position: 'relative' }}>
  <style>
    {`
      @keyframes aurora-drift-1 {
        0%, 100% { transform: translate(0, 0); }
        33% { transform: translate(150px, 80px); }
        66% { transform: translate(-100px, 150px); }
      }
      @keyframes aurora-drift-2 {
        0%, 100% { transform: translate(0, 0); }
        33% { transform: translate(-120px, -60px); }
        66% { transform: translate(80px, -110px); }
      }
      @keyframes aurora-drift-3 {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(40px, -90px); }
      }
      @keyframes aurora-pulse {
        0%, 100% { opacity: 0.35; transform: scale(1); }
        50% { opacity: 0.65; transform: scale(1.15); }
      }
      .aurora {
        position: absolute;
        filter: blur(100px);
        z-index: 1;
        pointer-events: none;
      }
      .glass-panel {
        background: rgba(10, 10, 24, 0.45);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        position: relative;
        z-index: 10;
        backdrop-filter: blur(8px); /* Note: Not all renderers support this, simulation used below */
      }
    `}
  </style>

  {/* Background Aurora Blobs */}
  <svg width="800" height="1150" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
    <defs>
      <radialGradient id="aurora-1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(0,180,255,0.4)" />
        <stop offset="100%" stopColor="rgba(0,180,255,0)" />
      </radialGradient>
      <radialGradient id="aurora-2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(110,40,255,0.35)" />
        <stop offset="100%" stopColor="rgba(110,40,255,0)" />
      </radialGradient>
      <radialGradient id="aurora-3" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(0,255,200,0.25)" />
        <stop offset="100%" stopColor="rgba(0,255,200,0)" />
      </radialGradient>
    </defs>
    <ellipse cx="650" cy="150" rx="350" ry="250" fill="url(#aurora-1)" style={{ animation: 'aurora-drift-1 25s ease-in-out infinite, aurora-pulse 12s ease-in-out infinite' }} />
    <ellipse cx="150" cy="650" rx="320" ry="220" fill="url(#aurora-2)" style={{ animation: 'aurora-drift-2 22s ease-in-out infinite, aurora-pulse 10s ease-in-out infinite 1s' }} />
    <ellipse cx="500" cy="950" rx="300" ry="200" fill="url(#aurora-3)" style={{ animation: 'aurora-drift-3 18s ease-in-out infinite, aurora-pulse 15s ease-in-out infinite 0.5s' }} />
  </svg>

  {/* Component 0: Hero — Glassy Aesthetic */}
  <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: 270, padding: 30, overflow: 'hidden' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20, gap: 4 }}>
      <span style={{ fontSize: 58, fontWeight: 900, background: 'linear-gradient(135deg, #ffffff 0%, #b0d4ff 30%, #7ee7ff 55%, #60aaff 80%, #ffffff 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', letterSpacing: 8 }}>PRABHAT</span>
      <span style={{ fontSize: 14, color: 'rgba(160, 180, 220, 0.7)', fontWeight: 400, letterSpacing: 4, textTransform: 'uppercase', marginTop: 2 }}>B.Tech CSE · Cambridge Institute of Technology</span>
      <span style={{ fontSize: 13, color: 'rgba(230, 240, 255, 0.5)', fontWeight: 300, letterSpacing: 1.5, marginTop: 8 }}>C# developer · .NET Core · AI/ML</span>
    </div>
    <div style={{ display: 'flex', gap: 8, marginTop: 22, zIndex: 20 }}>
      {['C# / C++', 'ASP.NET Core', 'Machine Learning', 'x86 ASM'].map((skill, i) => (
        <span key={i} style={{ padding: '6px 16px', background: 'rgba(255,255,255,0.04)', color: '#7ee7ff', borderRadius: 14, fontSize: 12, fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)', letterSpacing: 1 }}>
          {skill}
        </span>
      ))}
    </div>
  </div>

  {/* Component 4: Languages — Glassy Row */}
  <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: 175, padding: '20px 26px 18px', overflow: 'hidden' }}>
    <span style={{ fontSize: 10, color: 'rgba(120, 180, 255, 0.7)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 15, fontWeight: 800 }}>Most Used Languages</span>
    <div style={{ display: 'flex', width: '100%', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {(() => {
        const fallback = [{name:'C#',percentage:38,color:'#00d4ff'},{name:'C++',percentage:28,color:'#f34b7d'},{name:'Python',percentage:12,color:'#3572A5'},{name:'C',percentage:8,color:'#555555'},{name:'x86 ASM',percentage:6,color:'#6E4C13'},{name:'JS',percentage:4,color:'#f1e05a'},{name:'Other',percentage:4,color:'#563d7c'}];
        const langs = (github?.languages?.[0]?.name === 'TypeScript') ? fallback : (github?.languages ?? fallback);
        return langs.map((lang, i) => (
          <div key={i} style={{ width: `${lang.percentage}%`, height: '100%', background: lang.color, opacity: 0.85 }} />
        ));
      })()}
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
      {(() => {
        const fallback = [{name:'C#',percentage:38,color:'#00d4ff'},{name:'C++',percentage:28,color:'#f34b7d'},{name:'Python',percentage:12,color:'#3572A5'},{name:'C',percentage:8,color:'#555555'},{name:'x86 ASM',percentage:6,color:'#6E4C13'},{name:'JS',percentage:4,color:'#f1e05a'}];
        const langs = (github?.languages?.[0]?.name === 'TypeScript') ? fallback : (github?.languages ?? fallback);
        return langs.slice(0, 6).map((lang, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 105 }}>
            <span style={{ width: 9, height: 9, borderRadius: 5, background: lang.color, boxShadow: `0 0 8px ${lang.color}55` }}></span>
            <span style={{ fontSize: 12, color: 'rgba(230, 240, 255, 0.8)', fontWeight: 600 }}>{lang.name}</span>
            <span style={{ fontSize: 11, color: 'rgba(230, 240, 255, 0.4)', fontWeight: 400 }}>{lang.percentage}%</span>
          </div>
        ));
      })()}
    </div>
  </div>

  {/* Component 1: Tech Stack — Glassy Icons */}
  <div className="glass-panel" style={{ display: 'flex', gap: 10, padding: '14px 22px', width: '100%', height: 75, alignItems: 'center', justifyContent: 'center' }}>
    {['C#', 'C++', 'x86 ASM', 'Python', 'JavaScript', 'ASP.NET', 'PostgreSQL', 'React.js'].map((t, i) => (
      <span key={i} style={{ padding: '5px 16px', background: 'rgba(0,0,0,0.2)', color: '#7eb8ff', borderRadius: 16, fontSize: 13, fontWeight: 700, border: '1px solid rgba(255,255,255,0.08)' }}>{t}</span>
    ))}
  </div>

  {/* Component 3: Stats — Glassy Stats Grid */}
  <div className="glass-panel" style={{ display: 'flex', width: '100%', height: 120, alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around', padding: '0 20px' }}>
      {[{v: github?.stats?.totalStars, l: 'Stars', c: '#fde047'}, {v: github?.stats?.totalForks, l: 'Forks', c: '#ff7eb9'}, {v: github?.stats?.totalRepos, l: 'Repos', c: '#7ee7ff'}, {v: github?.stats?.totalCommits, l: 'Commits', c: '#a855f7'}].map((s, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 36, fontWeight: 900, color: '#ffffff', lineHeight: 1, textShadow: `0 0 15px ${s.c}33` }}>{s.v ?? 0}</span>
          <span style={{ fontSize: 10, color: s.c, textTransform: 'uppercase', letterSpacing: 4, fontWeight: 800, opacity: 0.8 }}>{s.l}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Component 5: Matrix — Glassy Grid */}
  <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: 215, padding: '18px 24px 16px', overflow: 'hidden' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 800 }}>Contribution Matrix</span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }}></div>
    </div>
    <div style={{ display: 'flex', width: '100%', paddingLeft: 18, marginBottom: 6, justifyContent: 'space-between' }}>
      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
        <span key={i} style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>{m}</span>
      ))}
    </div>
    <div style={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginRight: 6, paddingTop: 2 }}>
        {['M','W','F'].map((d,i) => <span key={i} style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', height: 11, fontWeight: 900 }}>{d}</span>)}
      </div>
      {Array.from({length: 51}, (_, w) => (
        <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Array.from({length: 7}, (_, d) => {
            const idx = w * 7 + d;
            const seed = (idx * 1103515245 + 12345) & 0x7fffffff;
            const level = idx < 15 ? 0 : seed % 10 < 4 ? 0 : seed % 10 < 6 ? 1 : seed % 10 < 8 ? 2 : seed % 10 < 9 ? 3 : 4;
            const colors = ['rgba(255,255,255,0.03)', 'rgba(0,180,255,0.15)', 'rgba(0,180,255,0.3)', 'rgba(0,180,255,0.5)', 'rgba(0,180,255,0.7)'];
            return <div key={d} style={{ width: 11, height: 11, borderRadius: 2, background: colors[level], border: level===0 ? '1px solid rgba(255,255,255,0.02)' : 'none' }} />;
          })}
        </div>
      ))}
    </div>
  </div>

  {/* Component 2: Projects — Glassy Portfolio */}
  <div style={{ display: 'flex', width: '100%', height: 200, padding: 0, position: 'relative', background: 'transparent' }}>
    {[{
      t: 'KinetX',
      des: 'Custom physics engine with Verlet integration and high-performance physics pipeline.',
      tags: ['C#', 'WPF']
    }, {
      t: 'ColdFish',
      des: 'Chess engine with SDL2 GUI, Minimax/Alpha-Beta, and 1500 ELO reaching board logic.',
      tags: ['C++', 'SDL2']
    }, {
      t: 'MetalNet',
      des: 'Engineered a high-performance CNN from scratch in C++ without libraries. Features a custom tensor system and modular architecture.',
      tags: ['C++', 'Ninja']
    }].map((p, i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 22, background: i === 1 ? 'rgba(255,255,255,0.03)' : 'transparent', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none', position: 'relative' }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>{p.t}</span>
        <span style={{ fontSize: 11, color: 'rgba(230, 240, 255, 0.5)', lineHeight: 1.4, marginBottom: 12 }}>{p.des}</span>
        <div style={{ display: 'flex', gap: 5, marginTop: 'auto' }}>
          {p.tags.map((tag, j) => (
            <span key={j} style={{ padding: '2px 10px', background: 'rgba(255,255,255,0.05)', color: '#7ee7ff', borderRadius: 8, fontSize: 10, fontWeight: 600, border: '1px solid rgba(255,255,255,0.08)' }}>{tag}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
</div>
```

[![GitHub Streak](https://streak-stats.demolab.com/?user=KunwarPrabhat&theme=tokyonight&hide_border=true&background=06060a&stroke=1e3a8a&ring=60aaff&fire=7ee7ff&currStreakLabel=60aaff&sideLabels=7090a0&dates=506080&sideNums=ffffff&currStreakNum=ffffff)](https://github.com/KunwarPrabhat)

[![trophy](https://github-profile-trophy.vercel.app/?username=KunwarPrabhat&theme=tokyonight&rank=-?&margin-w=4&no-frame=true&column=7)](https://github.com/KunwarPrabhat)

![visitors](https://visitor-badge.laobi.icu/badge?page_id=KunwarPrabhat.KunwarPrabhat)
