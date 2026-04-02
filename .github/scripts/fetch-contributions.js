#!/usr/bin/env node
/**
 * fetch-contributions.js
 * 1. Fetches last 26 weeks of GitHub contribution data via GraphQL API
 * 2. Generates a standalone contributions-calendar.svg (native SVG rects — zero render cost)
 * 3. The readme-aura source embeds it via <img>
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.METRICS_TOKEN || process.env.GITHUB_TOKEN;
const USERNAME = process.env.GITHUB_REPOSITORY_OWNER || 'KunwarPrabhat';
const OUT_DIR = path.join(__dirname, '..', 'assets');

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Level → color mapping (glowing aurora style)
const COLORS = {
  NONE: 'rgba(255,255,255,0.05)',
  FIRST_QUARTILE: 'rgba(0,160,255,0.3)',
  SECOND_QUARTILE: 'rgba(0,175,255,0.52)',
  THIRD_QUARTILE: 'rgba(0,195,255,0.75)',
  FOURTH_QUARTILE: 'rgba(0,215,255,1.0)'
};

const GLOW = {
  NONE: '',
  FIRST_QUARTILE: 'filter:drop-shadow(0 0 3px rgba(0,160,255,0.4))',
  SECOND_QUARTILE: 'filter:drop-shadow(0 0 5px rgba(0,175,255,0.6))',
  THIRD_QUARTILE: 'filter:drop-shadow(0 0 7px rgba(0,195,255,0.8))',
  FOURTH_QUARTILE: 'filter:drop-shadow(0 0 9px rgba(0,215,255,1.0))'
};

function generateCalendarSVG(weeksAll, totalContributions) {
  // Only use last 26 weeks
  const weeks = weeksAll.slice(-26);
  const cell = 14, gap = 3;
  const offsetX = 28, offsetY = 30;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const svgW = 26 * (cell + gap) + offsetX + 10;
  const svgH = offsetY + 7 * (cell + gap) + 24;

  let rects = '';
  let monthXMap = {};

  weeks.forEach((week, wi) => {
    (week.contributionDays || []).forEach((day, di) => {
      const color = COLORS[day.contributionLevel] || COLORS.NONE;
      const x = offsetX + wi * (cell + gap);
      const y = offsetY + di * (cell + gap);
      const lvl = day.contributionLevel || 'NONE';
      const filterAttr = lvl === 'THIRD_QUARTILE' ? ' filter="url(#glow-md)"' : lvl === 'FOURTH_QUARTILE' ? ' filter="url(#glow-hi)"' : '';
      rects += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="3" fill="${color}"${filterAttr}/>`;

      // Track month start positions
      if (di === 0 && day.date) {
        const m = parseInt(day.date.split('-')[1], 10) - 1;
        if (!(m in monthXMap)) monthXMap[m] = x;
      }
    });
  });

  let monthLabels = '';
  for (const [m, x] of Object.entries(monthXMap)) {
    monthLabels += `<text x="${x}" y="${offsetY - 8}" font-size="9" fill="rgba(255,255,255,0.3)" font-family="Inter,sans-serif" font-weight="700">${months[m]}</text>`;
  }

  // Day labels
  const dayLabels = `
    <text x="10" y="${offsetY + (cell + gap) - 2}" font-size="9" fill="rgba(255,255,255,0.2)" font-family="Inter,sans-serif" font-weight="600">M</text>
    <text x="10" y="${offsetY + 3 * (cell + gap) - 2}" font-size="9" fill="rgba(255,255,255,0.2)" font-family="Inter,sans-serif" font-weight="600">W</text>
    <text x="10" y="${offsetY + 5 * (cell + gap) - 2}" font-size="9" fill="rgba(255,255,255,0.2)" font-family="Inter,sans-serif" font-weight="600">F</text>
  `;

  // Legend
  const legendX = offsetX;
  const legendY = svgH - 12;
  const legendColors = Object.values(COLORS);
  let legend = `<text x="${legendX}" y="${svgH - 2}" font-size="9" fill="rgba(255,255,255,0.28)" font-family="Inter,sans-serif" font-weight="600">Less</text>`;
  legendColors.forEach((c, i) => {
    legend += `<rect x="${legendX + 32 + i * 16}" y="${legendY}" width="12" height="12" rx="3" fill="${c}"/>`;
  });
  legend += `<text x="${legendX + 118}" y="${svgH - 2}" font-size="9" fill="rgba(255,255,255,0.28)" font-family="Inter,sans-serif" font-weight="600">More</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="overflow:visible">
  <defs>
    <filter id="glow-md"><feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glow-hi"><feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  ${dayLabels}
  ${monthLabels}
  ${rects}
  ${legend}
</svg>`;
}

// --- If no token, write a placeholder and exit ---
if (!TOKEN) {
  console.warn('No GitHub token. Writing placeholder calendar.');
  const placeholderWeeks = Array.from({length:52}, (_, wi) => ({
    contributionDays: Array.from({length:7}, (_, di) => ({
      contributionCount: 0,
      contributionLevel: 'NONE',
      date: ''
    }))
  }));
  fs.writeFileSync(path.join(OUT_DIR, 'contributions-calendar.svg'), generateCalendarSVG(placeholderWeeks, 0));
  process.exit(0);
}

// --- Fetch from GitHub GraphQL ---
const now = new Date();
const from = new Date(now);
from.setFullYear(from.getFullYear() - 1);

const body = JSON.stringify({
  query: `query($login:String!,$from:DateTime!,$to:DateTime!){
    user(login:$login){
      contributionsCollection(from:$from,to:$to){
        contributionCalendar{
          totalContributions
          weeks{
            contributionDays{
              contributionCount
              date
              contributionLevel
            }
          }
        }
      }
    }
  }`,
  variables: { login: USERNAME, from: from.toISOString(), to: now.toISOString() }
});

const options = {
  hostname: 'api.github.com',
  path: '/graphql',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'User-Agent': 'readme-aura-bot'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.errors || !json.data?.user) {
        console.error('API error:', JSON.stringify(json.errors || json));
        throw new Error('API failed');
      }
      const cal = json.data.user.contributionsCollection.contributionCalendar;
      const svg = generateCalendarSVG(cal.weeks, cal.totalContributions);
      fs.writeFileSync(path.join(OUT_DIR, 'contributions-calendar.svg'), svg);
      console.log(`Calendar SVG generated: ${cal.weeks.length} weeks, ${cal.totalContributions} total contributions`);
    } catch (e) {
      console.error('Error:', e.message);
      const fallback = Array.from({length:52}, () => ({
        contributionDays: Array.from({length:7}, () => ({ contributionCount:0, contributionLevel:'NONE', date:'' }))
      }));
      fs.writeFileSync(path.join(OUT_DIR, 'contributions-calendar.svg'), generateCalendarSVG(fallback, 0));
    }
  });
});

req.on('error', e => {
  console.error('Request error:', e.message);
  process.exit(1);
});
req.write(body);
req.end();
