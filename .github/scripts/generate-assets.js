#!/usr/bin/env node
/**
 * generate-assets.js
 * Mimics the 'ACE' reference logic to generate a high-performance, real-data 
 * contribution calendar SVG using native rect elements.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const QUERY = `
query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
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

function generateCalendarSVG(calendar) {
  const weeks = calendar.weeks;
  const total = calendar.totalContributions;
  const cellSize = 11;
  const gap = 2;
  const step = cellSize + gap;
  const gridX = 44;
  const gridY = 42;
  const W = 800;
  const H = 195;
  const font = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;
  
  const colors = ['rgba(30,30,50,0.6)', 'rgba(45,74,110,0.8)', 'rgba(74,126,200,0.85)', 'rgba(126,231,255,0.9)', 'rgba(184,240,255,0.95)'];
  function getLevel(c) { return c === 0 ? 0 : c <= 2 ? 1 : c <= 5 ? 2 : c <= 9 ? 3 : 4; }

  let cells = '';
  for (let w = 0; w < weeks.length; w++) {
    for (const d of weeks[w].contributionDays) {
      const lv = getLevel(d.contributionCount);
      const cx = gridX + w * step;
      const cy = gridY + d.weekday * step;
      const stroke = lv > 2 ? colors[lv].replace(/[\d.]+\)$/, '0.4)') : 'rgba(60,60,100,0.12)';
      cells += `<rect x="${cx}" y="${cy}" width="${cellSize}" height="${cellSize}" rx="2" fill="${colors[lv]}" stroke="${stroke}" stroke-width="${lv > 2 ? 0.8 : 0.4}"/>`;
    }
  }

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let mLabels = '';
  let lastM = -1;
  for (let w = 0; w < weeks.length; w++) {
    const fd = weeks[w].contributionDays[0];
    if (!fd) continue;
    const m = new Date(fd.date).getMonth();
    if (m !== lastM) { lastM = m; mLabels += `<text x="${gridX + w*step}" y="${gridY-6}" font-family="${font}" font-size="8" fill="#4a4a6a">${months[m]}</text>`; }
  }

  const dayL = ['','M','','W','','F',''];
  let dLabels = '';
  dayL.forEach((d, i) => { if (d) dLabels += `<text x="${gridX-8}" y="${gridY + i*step + cellSize - 2}" text-anchor="end" font-family="${font}" font-size="7" fill="#4a4a6a">${d}</text>`; });

  const lgX = gridX + weeks.length * step - 100;
  const lgY = gridY + 7 * step + 10;
  let lg = `<text x="${lgX}" y="${lgY+8}" font-family="${font}" font-size="8" fill="#4a4a6a">Less</text>`;
  for (let i = 0; i < 5; i++) lg += `<rect x="${lgX+24+i*14}" y="${lgY}" width="10" height="10" rx="2" fill="${colors[i]}"/>`;
  lg += `<text x="${lgX+96}" y="${lgY+8}" font-family="${font}" font-size="8" fill="#4a4a6a">More</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" rx="16" fill="#06060a" stroke="rgba(110,80,220,0.15)" stroke-width="1"/>
    <text x="28" y="18" font-family="${font}" font-size="9" fill="rgba(120,200,255,0.7)" letter-spacing="3" font-weight="600">CONTRIBUTION MATRIX</text>
    <text x="220" y="18" font-family="${font}" font-size="10" fill="#4a4a6a">— ${total} contributions in the last year</text>
    ${mLabels}
    ${dLabels}
    ${cells}
    ${lg}
  </svg>`;
}

function mockCalendar() {
  const weeks = [];
  for (let w = 0; w < 52; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(Date.now() - (52 - w) * 7 * 86400000 + d * 86400000);
      days.push({ contributionCount: Math.floor(Math.random() * 8), date: date.toISOString().split('T')[0], weekday: d });
    }
    weeks.push({ contributionDays: days });
  }
  return { totalContributions: 847, weeks };
}

const username = process.env.GITHUB_USER || 'KunwarPrabhat';
const token = process.env.METRICS_TOKEN || process.env.GITHUB_TOKEN;

(async () => {
  let calendar;
  if (token) {
    console.log(`Fetching calendar for @${username}...`);
    try {
      const user = await fetchData(username, token);
      calendar = user.contributionsCollection.contributionCalendar;
    } catch (e) {
      console.error('Fetch failed, using mock data:', e.message);
      calendar = mockCalendar();
    }
  } else {
    console.log('No GITHUB_TOKEN — using mock data.');
    calendar = mockCalendar();
  }

  const svg = generateCalendarSVG(calendar);
  const outDir = path.resolve(process.cwd(), '.github/assets');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'contribution-calendar.svg'), svg, 'utf-8');
  console.log(`Generated contribution-calendar.svg`);
})();
