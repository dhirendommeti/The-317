/* Shared market ticker — used by every page on The 317.
   Renders static fallback prices immediately, then fetches live quotes
   from Finnhub and re-renders as each one arrives. If a fetch fails,
   the static fallback for that symbol just stays in place. */

const STOCK_TICKERS = [
  { sym: 'LLY',  name: 'Eli Lilly',             price: '1,102.08', pct: '+0.32%', up: true,  sector: 'Healthcare',  state: 'Indiana'   },
  { sym: 'CMI',  name: 'Cummins',               price: '724.93',   pct: '+1.13%', up: true,  sector: 'Industrials', state: 'Indiana'   },
  { sym: 'ELV',  name: 'Elevance Health',       price: '394.82',   pct: '+1.63%', up: true,  sector: 'Healthcare',  state: 'Indiana'   },
  { sym: 'STLD', name: 'Steel Dynamics',        price: '250.98',   pct: '+0.43%', up: true,  sector: 'Industrials', state: 'Indiana'   },
  { sym: 'SPG',  name: 'Simon Property Group',  price: '214.57',   pct: '+1.53%', up: true,  sector: 'Real Estate', state: 'Indiana'   },
  { sym: 'CTVA', name: 'Corteva',               price: '78.86',    pct: '+0.34%', up: true,  sector: 'Agriculture', state: 'Indiana'   },
  { sym: 'ONB',  name: 'Old National Bancorp',  price: '25.01',    pct: '+0.85%', up: true,  sector: 'Banking',     state: 'Indiana'   },
  { sym: 'ALSN', name: 'Allison Transmission',  price: '121.12',   pct: '+1.70%', up: true,  sector: 'Industrials', state: 'Indiana'   },
  { sym: 'INBK', name: 'First Internet Bancorp',price: '25.42',    pct: '-1.40%', up: false, sector: 'Banking',     state: 'Indiana'   },
  { sym: 'CAT',  name: 'Caterpillar',           price: '1,022.28', pct: '+3.70%', up: true,  sector: 'Industrials', state: 'Illinois'  },
  { sym: 'DE',   name: 'Deere & Company',       price: '598.59',   pct: '+1.59%', up: true,  sector: 'Industrials', state: 'Illinois'  },
  { sym: 'ADM',  name: 'Archer-Daniels-Midland',price: '76.29',    pct: '+1.58%', up: true,  sector: 'Agriculture', state: 'Illinois'  },
  { sym: 'FITB', name: 'Fifth Third Bancorp',   price: '53.61',    pct: '+1.65%', up: true,  sector: 'Banking',     state: 'Ohio'      },
  { sym: 'PG',   name: 'Procter & Gamble',      price: '147.68',   pct: '-1.80%', up: false, sector: 'Consumer',    state: 'Ohio'      },
  { sym: 'WHR',  name: 'Whirlpool',             price: '36.57',    pct: '-5.89%', up: false, sector: 'Consumer',    state: 'Michigan'  },
  { sym: 'SYK',  name: 'Stryker',               price: '304.69',   pct: '-1.01%', up: false, sector: 'Healthcare',  state: 'Michigan'  },
  { sym: 'MMM',  name: '3M',                    price: '163.22',   pct: '+1.63%', up: true,  sector: 'Industrials', state: 'Minnesota' },
  { sym: 'TGT',  name: 'Target',                price: '129.73',   pct: '-0.77%', up: false, sector: 'Retail',      state: 'Minnesota' },
  { sym: 'USB',  name: 'U.S. Bancorp',          price: '58.68',    pct: '+0.93%', up: true,  sector: 'Banking',     state: 'Minnesota' },
];

/* FINNHUB_KEY comes from config.js, loaded via <script> before this file. */

function buildTickerItem(t) {
  return '<span class="ticker-item">'
    + '<span class="ticker-sym">' + t.sym + '</span>'
    + '<span class="ticker-price">' + t.price + '</span>'
    + '<span class="' + (t.up ? 'ticker-up' : 'ticker-down') + '">' + (t.up ? '▲' : '▼') + ' ' + t.pct + '</span>'
    + '</span>';
}

/* extraStaticItems: page-specific entries that should display but never be
   live-fetched (e.g. index/yield figures like DJI, SPX, 2YR on the Fed article —
   Finnhub's free quote endpoint only covers individual equities). */
function initTicker(extraStaticItems) {
  extraStaticItems = extraStaticItems || [];
  const allItems = STOCK_TICKERS.concat(extraStaticItems);

  function render() {
    const track = document.getElementById('ticker-track');
    if (!track) return;
    const html = allItems.map(buildTickerItem).join('');
    track.innerHTML = html + html; /* duplicated for the seamless scroll loop */
  }
  render();

  function fetchLiveQuotes() {
    STOCK_TICKERS.forEach(function(t) {
      fetch('https://finnhub.io/api/v1/quote?symbol=' + t.sym + '&token=' + FINNHUB_KEY)
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (typeof data.c !== 'number' || data.c === 0) return;
          t.price = data.c.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          t.pct = (data.dp >= 0 ? '+' : '') + data.dp.toFixed(2) + '%';
          t.up = data.dp >= 0;
          /* day's high/low/open, used for the volatility callout below — not shown in the ticker bar itself */
          if (typeof data.h === 'number') t.dayHigh = data.h;
          if (typeof data.l === 'number') t.dayLow = data.l;
          if (typeof data.o === 'number') t.dayOpen = data.o;
          render();
          renderMarketDigest();
        })
        .catch(function() { /* keep last-known value for this symbol */ });
    });
  }

  fetchLiveQuotes();
  renderMarketDigest();

  /* Re-fetch every 60s — keeps the ticker and digest current while the tab stays open,
     and lets the digest's pre-market/open/closed framing transition on its own through the day.
     19 symbols × once/min is well inside Finnhub's free-tier 60-calls/min limit. */
  setInterval(fetchLiveQuotes, 60000);

  /* Re-render the digest every 30s on its own — no network call, just re-checks the clock
     so the "as of" time and open/closed status keep ticking between quote refreshes. */
  setInterval(renderMarketDigest, 30000);
}

/* ── MARKET DIGEST ──
   Turns the same live ticker data into a readable summary instead of
   requiring a separate AI/LLM call. Re-runs every time a quote updates. */

function getMarketStatus() {
  const now = new Date();
  const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day = et.getDay(); /* 0 = Sunday, 6 = Saturday */
  const minutes = et.getHours() * 60 + et.getMinutes();
  const open = 9 * 60 + 30;
  const close = 16 * 60;

  if (day === 0 || day === 6) return { state: 'closed', label: 'Markets closed for the weekend', et: et };
  if (minutes < open) return { state: 'pre', label: 'Markets open at 9:30 AM ET', et: et };
  if (minutes >= close) return { state: 'closed', label: 'Markets closed for the day', et: et };
  return { state: 'open', label: 'Markets open', et: et };
}

/* Groups parsed tickers by a key (sector or state) and averages their % change.
   Returns entries sorted best-to-worst, each with { key, avg, count }. */
function groupAndAverage(parsed, keyFn) {
  const groups = {};
  parsed.forEach(function(p) {
    const key = keyFn(p);
    if (!groups[key]) groups[key] = { key: key, total: 0, count: 0 };
    groups[key].total += p.pct;
    groups[key].count += 1;
  });
  return Object.keys(groups)
    .map(function(key) { return { key: key, avg: groups[key].total / groups[key].count, count: groups[key].count }; })
    .sort(function(a, b) { return b.avg - a.avg; });
}

function renderMarketDigest() {
  const card = document.getElementById('market-digest');
  if (!card) return;

  const status = getMarketStatus();
  const liveDataArrived = STOCK_TICKERS.some(function(t) { return typeof t.dayHigh === 'number'; });
  const parsed = STOCK_TICKERS.map(function(t) {
    const price = parseFloat(String(t.price).replace(/,/g, ''));
    const rangePct = (typeof t.dayHigh === 'number' && typeof t.dayLow === 'number' && price)
      ? ((t.dayHigh - t.dayLow) / price) * 100
      : null;
    return { sym: t.sym, name: t.name, pct: parseFloat(t.pct), up: t.up, sector: t.sector, state: t.state, rangePct: rangePct };
  });
  const upCount = parsed.filter(function(p) { return p.up; }).length;
  const downCount = parsed.length - upCount;
  const sorted = parsed.slice().sort(function(a, b) { return b.pct - a.pct; });
  const leader = sorted[0];
  const laggard = sorted[sorted.length - 1];
  const avgPct = parsed.reduce(function(sum, p) { return sum + p.pct; }, 0) / parsed.length;
  const verbHigher = status.state === 'open' ? 'are' : 'finished';

  let sentiment;
  if (upCount >= parsed.length * 0.7) sentiment = 'broadly higher';
  else if (downCount >= parsed.length * 0.7) sentiment = 'broadly lower';
  else if (upCount > downCount) sentiment = 'mixed, tilting higher';
  else if (downCount > upCount) sentiment = 'mixed, tilting lower';
  else sentiment = 'mixed';

  let lead;
  if (status.state === 'open') {
    lead = 'Right now, markets are ' + sentiment + '.';
  } else if (status.state === 'pre') {
    lead = 'Markets open at 9:30 AM ET. Based on the last close, sentiment heading in is ' + sentiment + '.';
  } else {
    lead = 'Markets closed ' + sentiment + ' today.';
  }

  const overview = lead
    + ' Of the ' + parsed.length + ' Midwest-anchored names we track, '
    + upCount + ' ' + verbHigher + ' higher and ' + downCount + ' ' + verbHigher + ' lower, '
    + 'averaging ' + (avgPct >= 0 ? '+' : '') + avgPct.toFixed(2) + '%. '
    + leader.name + ' (' + leader.sym + ') leads at ' + (leader.pct >= 0 ? '+' : '') + leader.pct.toFixed(2) + '%, '
    + 'while ' + laggard.name + ' (' + laggard.sym + ') lags at ' + (laggard.pct >= 0 ? '+' : '') + laggard.pct.toFixed(2) + '%.';

  /* Sector breakdown — only worth a sentence when there's real spread between the best and worst sector */
  const sectorGroups = groupAndAverage(parsed, function(p) { return p.sector; });
  const topSector = sectorGroups[0];
  const bottomSector = sectorGroups[sectorGroups.length - 1];
  let sectorLine = '';
  if (sectorGroups.length > 1 && (topSector.avg - bottomSector.avg) > 0.5) {
    sectorLine = 'By sector, ' + topSector.key + ' led (' + (topSector.avg >= 0 ? '+' : '') + topSector.avg.toFixed(2) + '% avg.), '
      + 'while ' + bottomSector.key + ' lagged (' + (bottomSector.avg >= 0 ? '+' : '') + bottomSector.avg.toFixed(2) + '% avg.).';
  }

  /* State breakdown — same idea, geography instead of sector */
  const stateGroups = groupAndAverage(parsed, function(p) { return p.state; });
  const topState = stateGroups[0];
  const bottomState = stateGroups[stateGroups.length - 1];
  let stateLine = '';
  if (stateGroups.length > 1 && (topState.avg - bottomState.avg) > 0.5) {
    stateLine = topState.key + '-based names outperformed today (' + (topState.avg >= 0 ? '+' : '') + topState.avg.toFixed(2) + '% avg.), '
      + 'compared with ' + (bottomState.avg >= 0 ? '+' : '') + bottomState.avg.toFixed(2) + '% for ' + bottomState.key + '.';
  }

  /* Volatility callout — only once live high/low data has actually arrived */
  let volLine = '';
  if (liveDataArrived) {
    const withRange = parsed.filter(function(p) { return p.rangePct !== null; });
    if (withRange.length) {
      const mostVolatile = withRange.slice().sort(function(a, b) { return b.rangePct - a.rangePct; })[0];
      if (mostVolatile.rangePct >= 2) {
        volLine = mostVolatile.name + ' (' + mostVolatile.sym + ') was today’s most volatile name, '
          + 'swinging ' + mostVolatile.rangePct.toFixed(1) + '% between its session high and low.';
      }
    }
  }

  const body = [overview, sectorLine, stateLine, volLine].filter(Boolean).join(' ');
  const timeStr = status.et.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + ' ET';

  card.innerHTML =
    '<div class="digest-header">' +
      '<span class="digest-status"><span class="digest-status-dot ' + (status.state === 'open' ? 'live' : 'idle') + '"></span>' + status.label + '</span>' +
      '<span class="digest-time">As of ' + timeStr + '</span>' +
    '</div>' +
    '<p class="digest-body">' + body + '</p>';
}

/* ── M&A ACTIVITY — COMPANIES WE TRACK ──
   Real, live news from Finnhub's company-news endpoint for the same 19 tickers
   above. This is NOT comprehensive Midwest deal coverage — it can only ever surface
   M&A involving these specific public companies, since that's how the underlying
   API works (per-symbol, not a general search). Most real middle-market M&A never
   involves a company this size, so this is a genuine but narrow slice — a complement
   to The Deal Flow page's manually sourced deals, not a replacement for it. */

const DEAL_NEWS_POSITIVE = /\bacquisition of\b|\bto acquire\b|\bacquired by\b|\bacquires\b|\bmerger\b|\bmerges with\b|\bbuyout\b|\bspin[\s-]?off\b|\bdefinitive agreement\b|\bdivest|\btakeover\b/i;
const DEAL_NEWS_NEGATIVE = /stocks? to buy|reasons? to buy|good stock to buy|buy now|upgrades?.*to buy|price target|best .* stocks|buy according|still .* buy|too late to buy|time to buy|reduces? (its )?stake|boosts? (its )?stake|increases? (its )?stake|decreases? (its )?stake/i;

function initDealNews() {
  const container = document.getElementById('deal-news');
  if (!container) return;

  function render(items) {
    if (!items.length) {
      container.innerHTML = '<p class="deal-news-empty">No recent M&A activity found among the companies we track.</p>';
      return;
    }
    container.innerHTML = items.slice(0, 8).map(function(item) {
      const date = new Date(item.datetime * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return '<a class="deal-news-item" href="' + item.url + '" target="_blank" rel="noopener">'
        + '<span class="deal-news-sym">' + item.related + '</span>'
        + '<span class="deal-news-headline">' + item.headline + '</span>'
        + '<span class="deal-news-meta">' + item.source + ' · ' + date + '</span>'
        + '</a>';
    }).join('');
  }

  const to = new Date();
  const from = new Date(to.getTime() - 120 * 24 * 60 * 60 * 1000); /* trailing 120 days */
  const fmt = function(d) { return d.toISOString().slice(0, 10); };

  Promise.all(STOCK_TICKERS.map(function(t) {
    return fetch('https://finnhub.io/api/v1/company-news?symbol=' + t.sym + '&from=' + fmt(from) + '&to=' + fmt(to) + '&token=' + FINNHUB_KEY)
      .then(function(r) { return r.json(); })
      .catch(function() { return []; });
  })).then(function(results) {
    const all = [];
    results.forEach(function(list) {
      if (!Array.isArray(list)) return;
      list.forEach(function(item) {
        const headline = item.headline || '';
        if (DEAL_NEWS_POSITIVE.test(headline) && !DEAL_NEWS_NEGATIVE.test(headline)) {
          all.push(item);
        }
      });
    });
    /* de-dupe near-identical headlines covering the same deal from multiple outlets */
    const seen = new Set();
    const unique = all.filter(function(item) {
      const key = item.headline.toLowerCase().slice(0, 40);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    unique.sort(function(a, b) { return b.datetime - a.datetime; });
    render(unique);
  }).catch(function() {
    container.innerHTML = '<p class="deal-news-empty">Couldn\'t load M&A activity right now.</p>';
  });
}
