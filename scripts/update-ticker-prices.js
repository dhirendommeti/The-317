#!/usr/bin/env node
/* Fetches latest quotes from Finnhub for every symbol in ticker.js and
   patches the hardcoded fallback price/pct/up fields in-place.
   Run by GitHub Actions on weekdays at market open. */

const fs = require('fs');
const https = require('https');

const KEY = process.env.FINNHUB_KEY;
if (!KEY) { console.error('FINNHUB_KEY not set'); process.exit(1); }

const TICKER_JS = './ticker.js';
const src = fs.readFileSync(TICKER_JS, 'utf8');

/* Extract all symbols from the STOCK_TICKERS array */
const symRe = /\{\s*sym:\s*'([^']+)'/g;
const symbols = [];
let m;
while ((m = symRe.exec(src)) !== null) symbols.push(m[1]);

console.log(`Fetching quotes for ${symbols.length} symbols…`);

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fmt(n) {
  if (n >= 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n.toFixed(2);
}

async function main() {
  const updates = {};
  /* Finnhub free tier: 60 calls/min. Fetch with ~1.1s gap to stay safe. */
  for (let i = 0; i < symbols.length; i++) {
    const sym = symbols[i];
    try {
      const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${KEY}`;
      const q = await get(url);
      /* q.c = current price, q.pc = previous close */
      if (q && q.c && q.c > 0 && q.pc && q.pc > 0) {
        const change = ((q.c - q.pc) / q.pc) * 100;
        updates[sym] = {
          price: fmt(q.c),
          pct: (change >= 0 ? '+' : '') + change.toFixed(2) + '%',
          up: change >= 0,
        };
        console.log(`  ${sym}: $${updates[sym].price} ${updates[sym].pct}`);
      } else {
        console.log(`  ${sym}: no valid quote (skipping)`);
      }
    } catch (e) {
      console.log(`  ${sym}: error — ${e.message}`);
    }
    if (i < symbols.length - 1) await sleep(1100);
  }

  /* Patch ticker.js: replace price/pct/up fields for each updated symbol.
     Matches lines like:  { sym: 'LLY',  name: '...', price: '...', pct: '...', up: true/false, ... }
     and rewrites only the three data fields, leaving everything else intact. */
  let patched = src;
  let count = 0;
  for (const [sym, data] of Object.entries(updates)) {
    /* Match the full ticker object line for this symbol */
    const lineRe = new RegExp(
      `(\\{\\s*sym:\\s*'${sym.replace('-', '\\-')}'[^}]+?price:\\s*')[^']*('[^}]+?pct:\\s*')[^']*('[^}]+?up:\\s*)(true|false)`,
      'g'
    );
    const next = patched.replace(lineRe, (_, a, b, c) => {
      return `${a}${data.price}${b}${data.pct}${c}${data.up}`;
    });
    if (next !== patched) count++;
    patched = next;
  }

  fs.writeFileSync(TICKER_JS, patched, 'utf8');
  console.log(`\nPatched ${count} of ${symbols.length} symbols in ticker.js`);
}

main().catch(e => { console.error(e); process.exit(1); });
