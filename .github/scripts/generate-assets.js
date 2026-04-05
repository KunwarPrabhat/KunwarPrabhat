#!/usr/bin/env node
/**
 * generate-assets.js
 * KUNWAR PRABHAT — UNIFIED SINGLE-SVG PROFILE ENGINE
 *
 * Architecture (mirrors Ace's zero-lag approach):
 *  - Incremental y-cursor layout: no hardcoded absolute positions
 *  - Calendar cells: only x, y, w, h, rx, fill — no per-cell stroke (huge perf win)
 *  - All-time commits via year-by-year GraphQL loop
 *  - Dynamic project cards pulled from real API data
 *  - Single lightweight SVG output (~30–60 KB, not 521 KB)
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// GraphQL Queries
// ─────────────────────────────────────────────────────────────────────────────

const MAIN_QUERY = `
query ($login: String!) {
  user(login: $login) {
    name
    createdAt
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        name
        description
        stargazerCount
        forkCount
        primaryLanguage { name color }
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

const YEARLY_QUERY = `
query ($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
    }
  }
}`;

// ─────────────────────────────────────────────────────────────────────────────
// HTTP helper (no fetch in older Node — use https)
// ─────────────────────────────────────────────────────────────────────────────

function gql(token, query, variables) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables });
    const req = https.request({
      hostname: 'api.github.com',
      path: '/graphql',
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'kunwar-prabhat-readme',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.errors) return reject(new Error(json.errors.map(e => e.message).join(', ')));
          resolve(json.data);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function fetchData(username, token) {
  return (await gql(token, MAIN_QUERY, { login: username })).user;
}

async function fetchAllTimeCommits(username, token, createdAt) {
  const startYear = new Date(createdAt).getFullYear();
  const now = new Date();
  const endYear = now.getFullYear();
  let total = 0;
  for (let yr = startYear; yr <= endYear; yr++) {
    const from = new Date(`${yr}-01-01T00:00:00Z`).toISOString();
    const to   = yr === endYear
      ? now.toISOString()
      : new Date(`${yr + 1}-01-01T00:00:00Z`).toISOString();
    try {
      const d = await gql(token, YEARLY_QUERY, { login: username, from, to });
      const c = d.user.contributionsCollection.totalCommitContributions;
      console.log(`  ${yr}: ${c} commits`);
      total += c;
    } catch (e) {
      console.warn(`  ${yr}: failed (${e.message})`);
    }
  }
  return total;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data processing
// ─────────────────────────────────────────────────────────────────────────────

function processStats(user, allTimeCommits) {
  let totalStars = 0, totalForks = 0, totalSize = 0;
  const langMap = {};

  for (const repo of user.repositories.nodes) {
    totalStars += repo.stargazerCount;
    totalForks += repo.forkCount;
    for (const edge of repo.languages.edges) {
      const n = edge.node.name;
      if (!langMap[n]) langMap[n] = { name: n, color: edge.node.color || '#ccc', size: 0 };
      langMap[n].size += edge.size;
      totalSize += edge.size;
    }
  }

  const languages = Object.values(langMap)
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .map(l => ({ ...l, percentage: +((l.size / totalSize) * 100).toFixed(1) }));

  const topProjects = user.repositories.nodes
    .filter(r => r.name && r.description)
    .sort((a, b) => b.stargazerCount - a.stargazerCount)
    .slice(0, 3)
    .map(r => ({
      name: r.name,
      desc: r.description || '',
      stars: r.stargazerCount,
      forks: r.forkCount,
      lang:  r.primaryLanguage ? r.primaryLanguage.name : null,
      langColor: r.primaryLanguage ? (r.primaryLanguage.color || '#555') : '#555',
    }));

  return {
    stars:    totalStars,
    forks:    totalForks,
    repos:    user.repositories.totalCount,
    commits:  allTimeCommits || user.contributionsCollection.totalCommitContributions,
    languages,
    topProjects,
    calendar: user.contributionsCollection.contributionCalendar,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock data (used when no token is present — local preview)
// ─────────────────────────────────────────────────────────────────────────────

function mockStats() {
  const weeks = [];
  const now = Date.now();
  for (let w = 0; w < 52; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      days.push({
        contributionCount: Math.floor(Math.random() * 10),
        date: new Date(now - (52 - w) * 7 * 86400000 + d * 86400000).toISOString().split('T')[0],
        weekday: d,
      });
    }
    weeks.push({ contributionDays: days });
  }
  return {
    stars: 0, forks: 0, repos: 12, commits: 0,
    languages: [
      { name: 'C++',        percentage: 42.5, color: '#f34b7d' },
      { name: 'C#',         percentage: 30.2, color: '#178600' },
      { name: 'JavaScript', percentage: 14.1, color: '#f1e05a' },
      { name: 'Assembly',   percentage:  8.2, color: '#6e4a7e' },
      { name: 'Python',     percentage:  5.0, color: '#3572A5' },
    ],
    topProjects: [
      { name: 'MetalNet',  desc: 'High-performance CNN from scratch in C++ without any libraries.', stars: 0, forks: 0, lang: 'C++',  langColor: '#f34b7d' },
      { name: 'ColdFish',  desc: 'Chess engine with SDL2 GUI, Minimax, alpha-beta pruning.', stars: 0, forks: 0, lang: 'C++',  langColor: '#f34b7d' },
      { name: 'KinetX',    desc: 'Physics engine with Verlet integration and WPF rendering.', stars: 0, forks: 0, lang: 'C#',   langColor: '#178600' },
    ],
    calendar: { totalContributions: 0, weeks },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG Generation Engine
// ─────────────────────────────────────────────────────────────────────────────

function generateSVG(stats) {
  const W    = 800;
  const font = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif`;
  const gap  = 14;

  // Section heights
  const heroH    = 230;
  const statsH   = 110;
  const langH    = stats.languages.length > 5 ? 210 : 180;
  const calH     = 175;
  const projH    = 220;
  const footerH  = 36;

  const totalH = heroH + statsH + langH + calH + projH + footerH + gap * 5;

  // ── STYLES ──────────────────────────────────────────────────────────────────
  const style = `
    @font-face {
      font-family: 'Inter'; font-style: normal; font-weight: 400 900; font-display: swap;
      src: url(https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyMZhrib2Bg-4.woff2) format('woff2');
    }
    @keyframes drift-r  { 0%,100%{transform:translate(0,0);opacity:.55} 50%{transform:translate(38px,-20px);opacity:1} }
    @keyframes drift-l  { 0%,100%{transform:translate(0,0);opacity:.5}  50%{transform:translate(-30px,18px);opacity:.95} }
    @keyframes drift-u  { 0%,100%{transform:translate(0,0);opacity:.65} 50%{transform:translate(22px,-24px);opacity:1} }
    @keyframes pulse    { 0%,100%{transform:scale(1);opacity:.55}        50%{transform:scale(1.18);opacity:.3} }
    @keyframes scan     { 0%{transform:translateX(-900px)} 100%{transform:translateX(900px)} }
    @keyframes ring-p   { 0%,100%{opacity:.12} 50%{opacity:.32} }
    @keyframes draw     { 0%{stroke-dashoffset:500} 100%{stroke-dashoffset:0} }
    @keyframes dot-f    { 0%,100%{opacity:.3} 50%{opacity:.9} }
    @keyframes pfade    { 0%,100%{opacity:0} 40%,60%{opacity:var(--pk,.4)} }
    .g-dr  { animation: drift-r  8.0s ease-in-out infinite }
    .g-dl  { animation: drift-l  9.0s ease-in-out infinite .3s }
    .g-du  { animation: drift-u  7.0s ease-in-out infinite .6s }
    .g-p   { animation: pulse    6.0s ease-in-out infinite }
    .g-sc  { animation: scan     4.5s linear     infinite }
    .g-ri  { animation: ring-p   4.0s ease-in-out infinite }
    .g-dw  { animation: draw     3.0s ease-in-out infinite; stroke-dasharray:250 250 }
    .g-dt  { animation: dot-f    5.0s ease-in-out infinite }
    .pt    { animation: pfade    var(--dur) ease-in-out infinite; opacity:0 }
    @media (prefers-reduced-motion: reduce) {
      *,*::before,*::after { animation: none !important }
      .pt { opacity:.3 !important }
    }`;

  // ── DEFS ────────────────────────────────────────────────────────────────────
  const defs = `
    <radialGradient id="g1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(120,40,255,.6)"/><stop offset="100%" stop-color="rgba(120,40,255,0)"/></radialGradient>
    <radialGradient id="g2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(0,200,220,.5)"/><stop offset="100%" stop-color="rgba(0,200,220,0)"/></radialGradient>
    <radialGradient id="g3" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(220,40,200,.45)"/><stop offset="100%" stop-color="rgba(220,40,200,0)"/></radialGradient>
    <radialGradient id="g4" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(40,120,255,.4)"/><stop offset="100%" stop-color="rgba(40,120,255,0)"/></radialGradient>
    <radialGradient id="g5" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(80,50,220,.35)"/><stop offset="100%" stop-color="rgba(80,50,220,0)"/></radialGradient>
    <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#ffffff"/>
      <stop offset="30%"  stop-color="#d0c0ff"/>
      <stop offset="60%"  stop-color="#7ee7ff"/>
      <stop offset="85%"  stop-color="#ff88cc"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>
    <linearGradient id="scg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="rgba(120,200,255,0)"/>
      <stop offset="40%"  stop-color="rgba(120,200,255,.1)"/>
      <stop offset="50%"  stop-color="rgba(160,120,255,.45)"/>
      <stop offset="60%"  stop-color="rgba(120,200,255,.1)"/>
      <stop offset="100%" stop-color="rgba(120,200,255,0)"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(110,80,220,.06)" stroke-width=".5"/>
    </pattern>
    <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="cb"/><feMerge><feMergeNode in="cb"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

  // ── PARTICLES ────────────────────────────────────────────────────────────────
  const accentColors = ['#7ee7ff', '#e8c8ff', '#ff88cc', '#ffffff'];
  let particles = '';
  for (let i = 0; i < 20; i++) {
    const px   = Math.floor(Math.random() * W);
    const py   = Math.floor(Math.random() * totalH);
    const sz   = (Math.random() * 1.8 + 0.4).toFixed(1);
    const dur  = (Math.random() * 6 + 5).toFixed(1);
    const del  = (Math.random() * 12).toFixed(1);
    const pk   = (Math.random() * 0.3 + 0.2).toFixed(2);
    const col  = accentColors[i % 4];
    particles += `<circle class="pt" cx="${px}" cy="${py}" r="${sz}" fill="${col}" style="--dur:${dur}s;--pk:${pk};animation-delay:${del}s"/>`;
  }

  // y cursor — each section increments it
  let y = 0;

  // ── HERO ─────────────────────────────────────────────────────────────────────
  const heroCY = y + heroH / 2;
  const hero = `
  <g>
    <ellipse class="g-dr" cx="180" cy="${heroCY}" rx="200" ry="120" fill="url(#g1)"/>
    <ellipse class="g-dl" cx="630" cy="${heroCY+25}" rx="170" ry="100" fill="url(#g2)"/>
    <ellipse class="g-du" cx="410" cy="${heroCY-30}" rx="150" ry="95" fill="url(#g3)"/>
    <ellipse class="g-p"  cx="90"  cy="${heroCY+45}" rx="130" ry="85" fill="url(#g4)"/>
    <rect class="g-sc" x="-200" y="${heroCY-22}" width="400" height="42" fill="url(#scg)" opacity=".3"/>
    <circle class="g-ri" cx="400" cy="${heroCY}" r="115" fill="none" stroke="rgba(120,200,255,.14)" stroke-width=".8"/>
    <circle class="g-ri" cx="400" cy="${heroCY}" r="75"  fill="none" stroke="rgba(200,120,255,.11)" stroke-width=".6" style="animation-delay:.5s"/>
    <path class="g-dw" d="M 28 ${y+18} L 28 ${y+8} L 44 ${y+8}"  fill="none" stroke="rgba(126,231,255,.7)" stroke-width="2.4" stroke-linecap="round"/>
    <path class="g-dw" d="M 772 ${y+18} L 772 ${y+8} L 756 ${y+8}" fill="none" stroke="rgba(232,200,255,.7)" stroke-width="2.4" stroke-linecap="round" style="animation-delay:.5s"/>
    <path class="g-dw" d="M 28 ${y+heroH-18} L 28 ${y+heroH-8} L 44 ${y+heroH-8}" fill="none" stroke="rgba(255,136,204,.6)" stroke-width="2.4" stroke-linecap="round" style="animation-delay:1s"/>
    <path class="g-dw" d="M 772 ${y+heroH-18} L 772 ${y+heroH-8} L 756 ${y+heroH-8}" fill="none" stroke="rgba(126,231,255,.5)" stroke-width="2.4" stroke-linecap="round" style="animation-delay:1.5s"/>
    <circle class="g-dt" cx="65"  cy="${heroCY-60}" r="2"   fill="#7ee7ff"/>
    <circle class="g-dt" cx="738" cy="${heroCY+42}" r="2"   fill="#e8c8ff" style="animation-delay:1.5s"/>
    <circle class="g-dt" cx="698" cy="${heroCY-52}" r="1.5" fill="#ff88cc" style="animation-delay:2.5s"/>

    <text x="400" y="${heroCY-42}" text-anchor="middle" font-family="${font}" font-size="62" font-weight="900" fill="url(#tg)" letter-spacing="12" filter="url(#glow)">PRABHAT</text>
    <text x="400" y="${heroCY-10}" text-anchor="middle" font-family="${font}" font-size="11" fill="rgba(126,231,255,.85)" letter-spacing="7" font-weight="700">KUNWAR PRABHAT</text>
    <line x1="240" y1="${heroCY+5}" x2="560" y2="${heroCY+5}" stroke="rgba(126,231,255,.2)" stroke-width="1"/>
    <text x="400" y="${heroCY+28}" text-anchor="middle" font-family="${font}" font-size="10.5" fill="rgba(232,200,255,.8)" letter-spacing="2.5" font-weight="600">LOW-LEVEL SYSTEMS PROGRAMMER  |  PERFORMANCE ENGINEERING</text>
    <text x="400" y="${heroCY+50}" text-anchor="middle" font-family="${font}" font-size="9.5"  fill="rgba(126,231,255,.6)"  letter-spacing="2" font-weight="500">BARE-METAL  •  C++ / C# / ASM  •  AI / ML  •  OPEN SOURCE</text>
  </g>`;
  y += heroH + gap;

  // ── DIVIDER helper ───────────────────────────────────────────────────────────
  const div = (baseY) => `<line x1="28" y1="${baseY}" x2="772" y2="${baseY}" stroke="rgba(110,80,220,.15)" stroke-width=".8"/>`;

  // ── STATS ────────────────────────────────────────────────────────────────────
  const statsBaseY = y;
  const statsItems = [
    { val: stats.stars,   label: 'STARS',   color: '#ffcc33' },
    { val: stats.forks,   label: 'FORKS',   color: '#e8c8ff' },
    { val: stats.repos,   label: 'REPOS',   color: '#7ee7ff' },
    { val: stats.commits, label: 'COMMITS', color: '#ff88cc' },
  ];
  const colW  = 170;
  const startX = (W - colW * 4) / 2;
  let statsCols = '';
  statsItems.forEach((item, i) => {
    const cx = startX + i * colW + colW / 2;
    statsCols += `
      <text x="${cx}" y="${statsBaseY+52}" text-anchor="middle" font-family="${font}" font-size="30" font-weight="900" fill="#ffffff">${item.val}</text>
      <text x="${cx}" y="${statsBaseY+72}" text-anchor="middle" font-family="${font}" font-size="9"   font-weight="800" fill="${item.color}" letter-spacing="2.5">${item.label}</text>`;
    if (i < 3) {
      statsCols += `<line x1="${startX+(i+1)*colW}" y1="${statsBaseY+25}" x2="${startX+(i+1)*colW}" y2="${statsBaseY+80}" stroke="rgba(120,80,220,.2)" stroke-width=".8" stroke-dasharray="3 3"/>`;
    }
  });
  const statsBlock = `
  <g>
    ${div(statsBaseY)}
    <ellipse class="g-dl" cx="400" cy="${statsBaseY+50}" rx="310" ry="58" fill="url(#g1)" opacity=".65"/>
    <rect class="g-sc" x="-200" y="${statsBaseY+45}" width="200" height="2" fill="url(#scg)" style="animation-delay:1.5s"/>
    ${statsCols}
  </g>`;
  y += statsH + gap;

  // ── LANGUAGES ────────────────────────────────────────────────────────────────
  const langBaseY  = y;
  const barW       = 720;
  const barX       = 40;
  const barY       = langBaseY + 46;
  let langBar = `<rect x="${barX}" y="${barY}" width="${barW}" height="8" rx="4" fill="rgba(255,255,255,.05)"/>`;
  let bx = barX;
  for (const l of stats.languages) {
    const w = Math.max(barW * l.percentage / 100, 3);
    langBar += `<rect x="${bx}" y="${barY}" width="${w.toFixed(1)}" height="8" rx="${w < 5 ? 0 : 4}" fill="${l.color}" opacity=".9"/>`;
    bx += w;
  }
  let langLegend = '';
  const ITEMS_PER_ROW = 5;
  const COL_W = 144;
  stats.languages.slice(0, 10).forEach((l, i) => {
    const row = Math.floor(i / ITEMS_PER_ROW);
    const col = i % ITEMS_PER_ROW;
    const lx  = barX + col * COL_W;
    const ly  = barY + 26 + row * 30;
    langLegend += `
      <circle cx="${lx+5}"  cy="${ly+6}" r="4.5" fill="${l.color}" opacity=".9"/>
      <text x="${lx+15}" y="${ly+10}" font-family="${font}" font-size="11" font-weight="700" fill="rgba(240,240,255,.95)">${l.name}</text>
      <text x="${lx+15+l.name.length*6.5+6}" y="${ly+10}" font-family="${font}" font-size="9.5" fill="rgba(180,180,210,.6)" font-weight="500">${l.percentage}%</text>`;
  });
  const langsBlock = `
  <g>
    ${div(langBaseY)}
    <ellipse class="g-dr" cx="660" cy="${langBaseY+100}" rx="180" ry="95" fill="url(#g5)"/>
    <text x="${barX}" y="${langBaseY+26}" font-family="${font}" font-size="10" fill="rgba(126,231,255,.85)" letter-spacing="4" font-weight="800">STACK ANALYTICS</text>
    ${langBar}
    ${langLegend}
  </g>`;
  y += langH + gap;

  // ── CONTRIBUTION CALENDAR ────────────────────────────────────────────────────
  const calBaseY  = y;
  const cellSize  = 10;
  const cgap      = 2;
  const step      = cellSize + cgap;
  const gridX     = 52;
  const gridY     = calBaseY + 42;
  // 5-level colour ramp (no stroke attributes on cells — this is the perf fix)
  const calColors = [
    'rgba(25,25,45,.7)',
    'rgba(45,74,110,.85)',
    'rgba(74,126,200,.9)',
    'rgba(126,231,255,.95)',
    '#ffffff',
  ];
  const getLevel = c => c === 0 ? 0 : c <= 2 ? 1 : c <= 5 ? 2 : c <= 9 ? 3 : 4;

  const weeks = stats.calendar.weeks;
  const maxWeeks = Math.min(weeks.length, Math.floor((W - gridX - 30) / step));
  const displayWeeks = weeks.slice(weeks.length - maxWeeks);

  let cells = '';
  for (let w = 0; w < displayWeeks.length; w++) {
    for (const d of displayWeeks[w].contributionDays) {
      const lv = getLevel(d.contributionCount);
      const cx = gridX + w * step;
      const cy = gridY + d.weekday * step;
      // ONLY x, y, width, height, rx, fill — no stroke whatsoever
      cells += `<rect x="${cx}" y="${cy}" width="${cellSize}" height="${cellSize}" rx="2.5" fill="${calColors[lv]}"/>`;
    }
  }

  const calBlock = `
  <g>
    ${div(calBaseY)}
    <text x="40"  y="${calBaseY+24}" font-family="${font}" font-size="10" fill="rgba(126,231,255,.85)" letter-spacing="4" font-weight="800">ACTIVITY PULSE</text>
    <text x="760" y="${calBaseY+24}" text-anchor="end" font-family="${font}" font-size="10" fill="rgba(232,200,255,.65)" font-weight="700">${stats.calendar.totalContributions} contributions</text>
    ${cells}
  </g>`;
  y += calH + gap;

  // ── PROJECTS ─────────────────────────────────────────────────────────────────
  const projBaseY   = y;
  const cardW       = 230;
  const cardH       = 180;
  const cardGap     = 16;
  const cardStartX  = (W - cardW * 3 - cardGap * 2) / 2;
  const cardAccents = ['#7ee7ff', '#e8c8ff', '#ff88cc'];

  // Fall back to static projects if API returned no described repos
  const displayProjects = stats.topProjects.length >= 1 ? stats.topProjects : [
    { name: 'MetalNet',  desc: 'High-performance CNN from scratch in C++ without any libraries.', stars: 0, forks: 0, lang: 'C++', langColor: '#f34b7d' },
    { name: 'ColdFish',  desc: 'Chess engine with SDL2 GUI, Minimax & alpha-beta pruning.',       stars: 0, forks: 0, lang: 'C++', langColor: '#f34b7d' },
    { name: 'KinetX',    desc: 'Physics engine with Verlet integration and WPF rendering.',        stars: 0, forks: 0, lang: 'C#',  langColor: '#178600' },
  ];

  // Word-wrap helper
  function wrapText(text, maxChars) {
    const words = text.split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
      if ((cur + ' ' + w).trim().length > maxChars) {
        if (cur) lines.push(cur.trim());
        cur = w;
      } else {
        cur = cur ? cur + ' ' + w : w;
      }
    }
    if (cur) lines.push(cur.trim());
    return lines.slice(0, 3);
  }

  let cards = '';
  displayProjects.slice(0, 3).forEach((p, i) => {
    const cx     = cardStartX + i * (cardW + cardGap);
    const cy     = projBaseY + 28;
    const accent = cardAccents[i % 3];
    const sRGB   = accent === '#7ee7ff' ? '126,231,255' : accent === '#e8c8ff' ? '232,200,255' : '255,136,204';
    const lines  = wrapText(p.desc || '', 28);
    let descSVG  = '';
    lines.forEach((line, li) => {
      descSVG += `<text x="${cx+18}" y="${cy+54+li*16}" font-family="${font}" font-size="10" fill="rgba(190,190,220,.8)">${line}</text>`;
    });
    cards += `
    <g>
      <rect x="${cx}" y="${cy}" width="${cardW}" height="${cardH}" rx="16" fill="rgba(10,8,20,.9)" stroke="rgba(${sRGB},.25)" stroke-width="1.5"/>
      <text x="${cx+18}" y="${cy+28}" font-family="${font}" font-size="15" font-weight="900" fill="#ffffff">${p.name}</text>
      ${descSVG}
      <line x1="${cx+18}" y1="${cy+cardH-58}" x2="${cx+cardW-18}" y2="${cy+cardH-58}" stroke="rgba(${sRGB},.12)" stroke-width=".6"/>
      <circle cx="${cx+26}" cy="${cy+cardH-38}" r="5" fill="${accent}" opacity=".9"/>
      <text x="${cx+36}" y="${cy+cardH-33}" font-family="${font}" font-size="10" font-weight="700" fill="${accent}">${p.lang || 'N/A'}</text>
      <text x="${cx+cardW-18}" y="${cy+cardH-33}" text-anchor="end" font-family="${font}" font-size="10" fill="rgba(200,200,230,.5)" font-weight="600">★ ${p.stars}  ⑂ ${p.forks}</text>
    </g>`;
  });

  const projBlock = `
  <g>
    ${div(projBaseY)}
    <ellipse class="g-du" cx="400" cy="${projBaseY+110}" rx="270" ry="80" fill="url(#g3)" opacity=".45"/>
    <text x="40" y="${projBaseY+22}" font-family="${font}" font-size="10" fill="rgba(126,231,255,.85)" letter-spacing="4" font-weight="800">PRIMARY DEPLOYMENTS</text>
    ${cards}
  </g>`;
  y += projH;

  // ── FOOTER ───────────────────────────────────────────────────────────────────
  const footer = `<text x="400" y="${y+22}" text-anchor="middle" font-family="${font}" font-size="8.5" fill="rgba(100,100,150,.4)" font-weight="600" letter-spacing="2">KUNWAR PRABHAT  •  LOW-LEVEL SYSTEMS  •  PERFORMANCE ENGINEERING</text>`;

  // ── ASSEMBLE ─────────────────────────────────────────────────────────────────
  return `<!-- Kunwar Prabhat Profile | Generated ${new Date().toISOString()} -->
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${totalH}" viewBox="0 0 ${W} ${totalH}">
<style>${style}</style>
<defs>${defs}</defs>
<!-- Base background -->
<rect width="${W}" height="${totalH}" rx="24" fill="#060610" stroke="rgba(110,80,220,.2)" stroke-width="1.5"/>
<rect width="${W}" height="${totalH}" rx="24" fill="url(#grid)"/>
<!-- Particles -->
${particles}
<!-- Sections -->
${hero}
${statsBlock}
${langsBlock}
${calBlock}
${projBlock}
${footer}
</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────────────────────

const username = process.env.GITHUB_USER  || 'KunwarPrabhat';
const token    = process.env.METRICS_TOKEN || process.env.GITHUB_TOKEN;

(async () => {
  let stats;

  if (token) {
    console.log(`[Profile Engine] Fetching data for @${username}...`);
    try {
      const user = await fetchData(username, token);
      console.log(`  Account created: ${user.createdAt}`);
      const allTimeCommits = await fetchAllTimeCommits(username, token, user.createdAt);
      console.log(`  All-time commits: ${allTimeCommits}`);
      stats = processStats(user, allTimeCommits);
    } catch (e) {
      console.error('  Fetch failed, falling back to mock data:', e.message);
      stats = mockStats();
    }
  } else {
    console.log('[Profile Engine] No token — using mock data for preview.');
    stats = mockStats();
  }

  const svg    = generateSVG(stats);
  const outDir = path.resolve(process.cwd(), '.github/assets');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'profile.svg');
  fs.writeFileSync(outPath, svg, 'utf-8');
  console.log(`[OK] profile.svg written (${(svg.length / 1024).toFixed(1)} KB) → ${outPath}`);
})();
