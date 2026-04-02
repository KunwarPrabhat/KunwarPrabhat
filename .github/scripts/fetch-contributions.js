#!/usr/bin/env node
/**
 * fetch-contributions.js
 * 1. Fetches real GitHub contribution calendar data via GraphQL API
 * 2. Generates a standalone SVG fragment: contributions-calendar.svg
 * 3. The readme-aura source embeds it via <img> — a static pre-rendered SVG loads instantly
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.METRICS_TOKEN || process.env.GITHUB_TOKEN;
const USERNAME = process.env.GITHUB_REPOSITORY_OWNER || 'KunwarPrabhat';
const OUT_DIR = path.join(__dirname, '..', 'assets');

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Level → color mapping (glass-aurora style)
const COLORS = {
  NONE: 'rgba(255,255,255,0.04)',
  FIRST_QUARTILE: 'rgba(0,150,255,0.22)',
  SECOND_QUARTILE: 'rgba(0,165,255,0.42)',
  THIRD_QUARTILE: 'rgba(0,185,255,0.67)',
  FOURTH_QUARTILE: 'rgba(0,205,255,0.92)'
};

function generateCalendarSVG(weeks, totalContributions) {
  const cell = 11, gap = 3;
  const offsetX = 28, offsetY = 30;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const svgW = 800;
  const svgH = offsetY + 7 * (cell + gap) + 24;

  let rects = '';
  let monthXMap = {};

  weeks.forEach((week, wi) => {
    (week.contributionDays || []).forEach((day, di) => {
      const color = COLORS[day.contributionLevel] || COLORS.NONE;
      const x = offsetX + wi * (cell + gap);
      const y = offsetY + di * (cell + gap);
      rects += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${color}"/>`;

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
  let legend = `<text x="${legendX}" y="${svgH - 2}" font-size="8" fill="rgba(255,255,255,0.2)" font-family="Inter,sans-serif">Less</text>`;
  legendColors.forEach((c, i) => {
    legend += `<rect x="${legendX + 30 + i * 14}" y="${legendY}" width="10" height="10" rx="2" fill="${c}"/>`;
  });
  legend += `<text x="${legendX + 104}" y="${svgH - 2}" font-size="8" fill="rgba(255,255,255,0.2)" font-family="Inter,sans-serif">More</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
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
