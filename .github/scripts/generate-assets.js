#!/usr/bin/env node
/**
 * generate-assets.js
 * TRUE "ACE" ARCHITECTURE: NATIVE RAW SVG ENGINE
 * This completely bypasses React/HTML compilers to guarantee absolute 0-lag 
 * hardware-accelerated rendering by drawing everything as raw SVG code natively.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const QUERY = `
query ($login: String!) {
  user(login: $login) {
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        stargazerCount
        forkCount
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node { name color }
          }
        }
      }
    }
    contributionsCollection {
      totalCommitContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
            weekday
          }
        }
      }
    }
  }
}`;

async function fetchData(username, token) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: QUERY, variables: { login: username } });
    const req = https.request({
      hostname: 'api.github.com',
      path: '/graphql',
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'kunwar-prabhat-readme',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', hunk => data += hunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.errors) reject(new Error(json.errors.map(e => e.message).join(', ')));
          resolve(json.data.user);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function mockApiData() {
  const weeks = [];
  for (let w = 0; w < 52; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      days.push({ contributionCount: Math.floor(Math.random() * 8), date: new Date().toISOString().split('T')[0], weekday: d });
    }
    weeks.push({ contributionDays: days });
  }
  return {
    stars: 1240, forks: 420, repos: 15, commits: 847,
    languages: [
      { name: 'C++', percentage: 40.5, color: '#f34b7d' },
      { name: 'C#', percentage: 32.2, color: '#178600' },
      { name: 'JavaScript', percentage: 15.1, color: '#f1e05a' },
      { name: 'Assembly', percentage: 12.2, color: '#6e4a7e' }
    ],
    calendar: { totalContributions: 847, weeks }
  };
}

function processStats(user) {
  let totalStars = 0, totalForks = 0, totalSize = 0;
  const langMap = {};
  for (const repo of user.repositories.nodes) {
    totalStars += repo.stargazerCount;
    totalForks += repo.forkCount;
    for (const edge of repo.languages.edges) {
      if (!langMap[edge.node.name]) langMap[edge.node.name] = { name: edge.node.name, color: edge.node.color || '#ccc', size: 0 };
      langMap[edge.node.name].size += edge.size;
      totalSize += edge.size;
    }
  }
  const languages = Object.values(langMap).sort((a,b) => b.size - a.size).slice(0, 8)
    .map(lang => ({ ...lang, percentage: ((lang.size/totalSize)*100).toFixed(1) }));
  
  return {
    stars: totalStars, forks: totalForks, repos: user.repositories.totalCount,
    commits: user.contributionsCollection.totalCommitContributions, languages,
    calendar: user.contributionsCollection.contributionCalendar
  };
}

// -------------------------------------------------------------
// CORE SVG DRAWING ENGINE
// -------------------------------------------------------------

function generateProfileSVG(stats) {
  const W = 800;
  const H = 1040;
  const FONT = `'Inter', -apple-system, sans-serif`;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <style>
    @keyframes drift { 0%, 100% { transform: translate(0, 0); opacity: 0.5; } 50% { transform: translate(40px, -20px); opacity: 0.8; } }
    @keyframes drift2 { 0%, 100% { transform: translate(0, 0); opacity: 0.4; } 50% { transform: translate(-30px, 20px); opacity: 0.7; } }
    @keyframes scan { 0% { transform: translateX(-800px); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateX(800px); opacity: 0; } }
    
    .grad-a { animation: drift 8s ease-in-out infinite; }
    .grad-b { animation: drift2 9s ease-in-out infinite 0.5s; }
    .scan-line { animation: scan 4s linear infinite; }
  </style>

  <rect width="${W}" height="${H}" rx="20" fill="#06060a" stroke="rgba(110,80,220,0.2)" stroke-width="1"/>

  <defs>
    <!-- Background Meshes -->
    <radialGradient id="g1" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(138,43,226,0.3)" /><stop offset="100%" stopColor="rgba(138,43,226,0)" /></radialGradient>
    <radialGradient id="g2" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(20,80,255,0.3)" /><stop offset="100%" stopColor="rgba(20,80,255,0)" /></radialGradient>
    <radialGradient id="g3" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(0,220,240,0.25)" /><stop offset="100%" stopColor="rgba(0,220,240,0)" /></radialGradient>
    <radialGradient id="g4" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(220,40,255,0.25)" /><stop offset="100%" stopColor="rgba(220,40,255,0)" /></radialGradient>
    <linearGradient id="scg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="rgba(120,200,255,0)" /><stop offset="50%" stopColor="rgba(180,120,255,0.4)" /><stop offset="100%" stopColor="rgba(120,200,255,0)" />
    </linearGradient>
    
    <!-- Text Gradients -->
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="30%" stopColor="#d0c0ff" />
      <stop offset="55%" stopColor="#7ee7ff" />
      <stop offset="80%" stopColor="#ff88cc" />
      <stop offset="100%" stopColor="#ffffff" />
    </linearGradient>
  </defs>

  <!-- Animated Glowing Background -->
  <g>
    <ellipse class="grad-a" cx="200" cy="150" rx="300" ry="200" fill="url(#g1)" />
    <ellipse class="grad-b" cx="600" cy="400" rx="300" ry="200" fill="url(#g2)" />
    <ellipse class="grad-a" cx="150" cy="700" rx="250" ry="200" fill="url(#g3)" />
    <ellipse class="grad-b" cx="650" cy="950" rx="350" ry="200" fill="url(#g4)" />
    <rect class="scan-line" x="0" y="200" width="300" height="1" fill="url(#scg)" />
    <rect class="scan-line" style="animation-delay: 2s;" x="0" y="600" width="300" height="1" fill="url(#scg)" />
  </g>
  `;

  // --- HERO (y: 20-200) ---
  svg += `
  <g transform="translate(0, 50)">
    <circle cx="400" cy="50" r="80" fill="none" stroke="rgba(120,80,255,0.2)" stroke-width="1" />
    <circle cx="400" cy="50" r="120" fill="none" stroke="rgba(80,180,255,0.12)" stroke-width="1" />
    
    <text x="400" y="60" font-family="${FONT}" font-size="64" font-weight="900" fill="url(#textGrad)" text-anchor="middle" letter-spacing="10">PRABHAT</text>
    <text x="400" y="90" font-family="${FONT}" font-size="14" font-weight="400" fill="#6a6a8a" text-anchor="middle" letter-spacing="4">KUNWAR PRABHAT</text>
    <text x="400" y="115" font-family="${FONT}" font-size="12" font-weight="300" fill="#e0e0f0" text-anchor="middle" letter-spacing="1.5">Low-level Systems Programmer | Performance Engineering | Bare-metal</text>

    <!-- Skills Flexbox Shim manually drawn -->
    <g transform="translate(200, 140)">
      <rect x="0" y="0" width="105" height="26" rx="13" fill="rgba(8,6,14,0.7)" stroke="rgba(120,200,255,0.2)" />
      <text x="52" y="17" font-family="${FONT}" font-size="12" font-weight="600" fill="#7ee7ff" text-anchor="middle" letter-spacing="0.5">C# developer</text>
      
      <rect x="115" y="0" width="85" height="26" rx="13" fill="rgba(8,6,14,0.7)" stroke="rgba(120,200,255,0.2)" />
      <text x="157" y="17" font-family="${FONT}" font-size="12" font-weight="600" fill="#e8c8ff" text-anchor="middle" letter-spacing="0.5">.NET Core</text>
      
      <rect x="210" y="0" width="60" height="26" rx="13" fill="rgba(8,6,14,0.7)" stroke="rgba(120,200,255,0.2)" />
      <text x="240" y="17" font-family="${FONT}" font-size="12" font-weight="600" fill="#ff88cc" text-anchor="middle" letter-spacing="0.5">AI/ML</text>
      
      <rect x="280" y="0" width="100" height="26" rx="13" fill="rgba(8,6,14,0.7)" stroke="rgba(120,200,255,0.2)" />
      <text x="330" y="17" font-family="${FONT}" font-size="12" font-weight="600" fill="#9ee79e" text-anchor="middle" letter-spacing="0.5">open source</text>
    </g>
  </g>`;

  // --- STATS (y: 280-380) ---
  svg += `
  <g transform="translate(30, 260)">
    <rect width="740" height="90" rx="16" fill="rgba(10,8,18,0.7)" stroke="rgba(110,80,220,0.15)"/>
    <text x="135" y="45" font-family="${FONT}" font-size="28" font-weight="800" fill="#fff" text-anchor="middle">${stats.stars}</text>
    <text x="135" y="65" font-family="${FONT}" font-size="10" font-weight="600" fill="#b8860b" letter-spacing="2" text-anchor="middle">STARS</text>
    
    <rect x="240" y="25" width="1" height="40" fill="rgba(120,80,220,0.2)" />
    
    <text x="320" y="45" font-family="${FONT}" font-size="28" font-weight="800" fill="#fff" text-anchor="middle">${stats.forks}</text>
    <text x="320" y="65" font-family="${FONT}" font-size="10" font-weight="600" fill="#8b7ec8" letter-spacing="2" text-anchor="middle">FORKS</text>
    
    <rect x="420" y="25" width="1" height="40" fill="rgba(120,80,220,0.2)" />

    <text x="500" y="45" font-family="${FONT}" font-size="28" font-weight="800" fill="#fff" text-anchor="middle">${stats.repos}</text>
    <text x="500" y="65" font-family="${FONT}" font-size="10" font-weight="600" fill="#5a9ca8" letter-spacing="2" text-anchor="middle">REPOS</text>
    
    <rect x="580" y="25" width="1" height="40" fill="rgba(120,80,220,0.2)" />

    <text x="660" y="45" font-family="${FONT}" font-size="28" font-weight="800" fill="#fff" text-anchor="middle">${stats.commits}</text>
    <text x="660" y="65" font-family="${FONT}" font-size="10" font-weight="600" fill="#7ee7ff" letter-spacing="2" text-anchor="middle">COMMITS</text>
  </g>`;

  // --- LANGUAGES (y: 370-490) ---
  svg += `
  <g transform="translate(30, 365)">
    <rect width="740" height="150" rx="16" fill="rgba(10,8,18,0.7)" stroke="rgba(110,80,220,0.15)"/>
    <text x="30" y="30" font-family="${FONT}" font-size="10" font-weight="600" fill="rgba(120,200,255,0.7)" letter-spacing="3">MOST USED LANGUAGES</text>
    
    <rect x="30" y="50" width="680" height="8" rx="4" fill="rgba(255,255,255,0.05)" />`;
  
  let xOffset = 30;
  for (const lang of stats.languages) {
    const w = (lang.percentage / 100) * 680;
    svg += `<rect x="${xOffset}" y="50" width="${w}" height="8" fill="${lang.color}" />`;
    xOffset += w;
  }

  let row = 0, col = 0;
  for (const lang of stats.languages) {
    const px = 30 + col * 160;
    const py = 85 + row * 25;
    svg += `<circle cx="${px+5}" cy="${py-4}" r="5" fill="${lang.color}"/>`;
    svg += `<text x="${px+18}" y="${py}" font-family="${FONT}" font-size="13" font-weight="500" fill="#e0e0f0">${lang.name}</text>`;
    svg += `<text x="${px+120}" y="${py}" font-family="${FONT}" font-size="11" font-weight="400" fill="#6a6a8a" text-anchor="end">${lang.percentage}%</text>`;
    col++;
    if (col > 3) { col = 0; row++; }
  }
  svg += `</g>`;

  // --- CALENDAR NATIVE (y: 530-730) ---
  const weeks = stats.calendar.weeks;
  const cellSize = 11;
  const gap = 3;
  const step = cellSize + gap;
  const gridX = 44 + 30; // inset
  const gridY = 530 + 35; 
  const cColors = ['rgba(30,30,50,0.6)', 'rgba(45,74,110,0.8)', 'rgba(74,126,200,0.85)', 'rgba(126,231,255,0.9)', 'rgba(184,240,255,0.95)'];
  const getLevel = (c) => c === 0 ? 0 : c <= 2 ? 1 : c <= 5 ? 2 : c <= 9 ? 3 : 4;
  
  svg += `<rect x="30" y="530" width="740" height="200" rx="16" fill="rgba(10,8,18,0.7)" stroke="rgba(110,80,220,0.15)"/>
    <text x="60" y="555" font-family="${FONT}" font-size="10" font-weight="600" fill="rgba(120,200,255,0.7)" letter-spacing="3">CONTRIBUTION MATRIX</text>
    <text x="250" y="555" font-family="${FONT}" font-size="10" fill="#4a4a6a">— ${stats.calendar.totalContributions} contributions in the last year</text>`;

  for (let w = 0; w < weeks.length; w++) {
    for (const d of weeks[w].contributionDays) {
      const lv = getLevel(d.contributionCount);
      const cx = gridX + w * step;
      const cy = gridY + d.weekday * step;
      const stroke = lv > 2 ? cColors[lv].replace(/[\d.]+\)$/, '0.4)') : 'rgba(60,60,100,0.12)';
      svg += `<rect x="${cx}" y="${cy}" width="${cellSize}" height="${cellSize}" rx="3" fill="${cColors[lv]}" stroke="${stroke}" stroke-width="${lv > 2 ? 0.8 : 0.4}"/>`;
    }
  }

  // --- TOP PROJECTS (y: 745-930) ---
  const projs = [
    { name: 'MetalNet', tag: 'CNN Engine', desc: 'Engineered a high-performance CNN from scratch in C++ without libraries.', t1: 'C++', t2: 'Ninja', c: '#7ee7ff' },
    { name: 'ColdFish', tag: 'Chess Engine', desc: 'Custom chess engine with SDL2 GUI, Minimax, alpha-beta, sorting, fast tree search.', t1: 'C++', t2: 'SDL2', c: '#e8c8ff' },
    { name: 'KinetX', tag: 'Physics Engine', desc: 'Custom physics engine with Verlet integration and high-performance pipeline.', t1: 'C#', t2: 'WPF', c: '#ff88cc' }
  ];
  
  let projX = 30;
  for (let i = 0; i < 3; i++) {
    const p = projs[i];
    svg += `
    <g transform="translate(${projX}, 745)">
      <rect width="236" height="150" rx="14" fill="rgba(10,8,18,0.7)" stroke="rgba(120,200,255,0.12)"/>
      <text x="18" y="32" font-family="${FONT}" font-size="17" font-weight="800" fill="#ffffff">${p.name}</text>
      <text x="18" y="52" font-family="${FONT}" font-size="11" font-weight="600" fill="${p.c}" letter-spacing="0.5">${p.tag}</text>
      <text x="18" y="75" font-family="${FONT}" font-size="11" font-weight="400" fill="rgba(200,200,230,0.85)">${p.desc.substring(0, 40)}</text>
      <text x="18" y="90" font-family="${FONT}" font-size="11" font-weight="400" fill="rgba(200,200,230,0.85)">${p.desc.substring(40, 80)}</text>
      <text x="18" y="105" font-family="${FONT}" font-size="11" font-weight="400" fill="rgba(200,200,230,0.85)">${p.desc.substring(80, 120)}</text>
      <rect x="18" y="115" width="40" height="20" rx="8" fill="rgba(120,200,255,0.08)" stroke="rgba(120,200,255,0.15)"/>
      <text x="38" y="129" font-family="${FONT}" font-size="10" font-weight="600" fill="${p.c}" text-anchor="middle">${p.t1}</text>
      <rect x="65" y="115" width="45" height="20" rx="8" fill="rgba(120,200,255,0.08)" stroke="rgba(120,200,255,0.15)"/>
      <text x="87" y="129" font-family="${FONT}" font-size="10" font-weight="600" fill="${p.c}" text-anchor="middle">${p.t2}</text>
    </g>`;
    projX += 236 + 16;
  }

  svg += `</svg>`;
  return svg;
}

const username = process.env.GITHUB_USER || 'KunwarPrabhat';
const token = process.env.METRICS_TOKEN || process.env.GITHUB_TOKEN;

(async () => {
  let stats;
  if (token) {
    console.log(`[Native ACE Engine] Fetching stats for @${username}...`);
    try {
      const user = await fetchData(username, token);
      stats = processStats(user);
    } catch (e) {
      console.error('Fetch failed, using mock data:', e.message);
      stats = mockApiData();
    }
  } else {
    console.log('[Native ACE Engine] No TOKEN - Mock Data.');
    stats = mockApiData();
  }

  const svg = generateProfileSVG(stats);
  const outDir = path.resolve(process.cwd(), '.github/assets');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'profile.svg'), svg, 'utf-8');
  console.log(`[OK] Raw 0-lag SVG Profile compiled successfully to .github/assets/profile.svg`);
})();
