/* Shared market ticker — used by every page on The 317.
   Renders static fallback prices immediately, then fetches live quotes
   from Finnhub and re-renders as each one arrives. If a fetch fails,
   the static fallback for that symbol just stays in place. */

/* Trimmed from an earlier 111-company list (see git history) to roughly the
   most recognizable name per state/sector, after the larger list made full
   live-quote rotation through every symbol take ~8 minutes against Finnhub's
   free-tier rate limit. Fewer companies = faster real coverage. */
const STOCK_TICKERS = [
  { sym: 'LLY',  name: 'Eli Lilly',             price: '1,282.86', pct: '+4.66%', up: true,  sector: 'Healthcare',  state: 'Indiana'   },
  { sym: 'CMI',  name: 'Cummins',               price: '609.69',   pct: '-1.79%', up: false,  sector: 'Industrials', state: 'Indiana'   },
  { sym: 'ELV',  name: 'Elevance Health',       price: '399.50',   pct: '+0.31%', up: true,  sector: 'Healthcare',  state: 'Indiana'   },
  { sym: 'STLD', name: 'Steel Dynamics',        price: '250.28',   pct: '+0.19%', up: true,  sector: 'Industrials', state: 'Indiana'   },
  { sym: 'SPG',  name: 'Simon Property Group',  price: '222.86',   pct: '+1.02%', up: true,  sector: 'Real Estate', state: 'Indiana'   },
  { sym: 'CTVA', name: 'Corteva',               price: '79.27',    pct: '+1.75%', up: true,  sector: 'Agriculture', state: 'Indiana'   },
  { sym: 'ALSN', name: 'Allison Transmission',  price: '126.41',   pct: '+0.77%', up: true,  sector: 'Industrials', state: 'Indiana'   },
  { sym: 'CAT',  name: 'Caterpillar',           price: '813.94', pct: '-3.20%', up: false,  sector: 'Industrials', state: 'Illinois'  },
  { sym: 'DE',   name: 'Deere & Company',       price: '591.99',   pct: '+0.56%', up: true,  sector: 'Industrials', state: 'Illinois'  },
  { sym: 'ADM',  name: 'Archer-Daniels-Midland',price: '81.95',    pct: '-0.61%', up: false,  sector: 'Agriculture', state: 'Illinois'  },
  { sym: 'FITB', name: 'Fifth Third Bancorp',   price: '56.93',    pct: '-0.63%', up: false,  sector: 'Banking',     state: 'Ohio'      },
  { sym: 'PG',   name: 'Procter & Gamble',      price: '145.63',   pct: '+1.52%', up: true, sector: 'Consumer',    state: 'Ohio'      },
  { sym: 'WHR',  name: 'Whirlpool',             price: '40.77',    pct: '+3.82%', up: true, sector: 'Consumer',    state: 'Michigan'  },
  { sym: 'SYK',  name: 'Stryker',               price: '342.79',   pct: '+3.45%', up: true, sector: 'Healthcare',  state: 'Michigan'  },
  { sym: 'MMM',  name: '3M',                    price: '182.96',   pct: '+1.12%', up: true,  sector: 'Industrials', state: 'Minnesota' },
  { sym: 'TGT',  name: 'Target',                price: '160.10',   pct: '+5.00%', up: true, sector: 'Retail',      state: 'Minnesota' },
  { sym: 'USB',  name: 'U.S. Bancorp',          price: '64.49',    pct: '-0.46%', up: false,  sector: 'Banking',     state: 'Minnesota' },
  { sym: 'NTRS', name: 'Northern Trust',        price: '189.97',   pct: '-0.32%', up: false,  sector: 'Banking',     state: 'Illinois'  },
  { sym: 'CAH',  name: 'Cardinal Health',       price: '236.72',   pct: '+0.74%', up: true,  sector: 'Healthcare',  state: 'Ohio'      },
  { sym: 'BAX',  name: 'Baxter International',  price: '26.64',    pct: '+2.70%', up: true,  sector: 'Healthcare',  state: 'Illinois'  },
  { sym: 'MDT',  name: 'Medtronic',             price: '93.92',    pct: '+1.99%', up: true,  sector: 'Healthcare',  state: 'Minnesota' },
  { sym: 'UNH',  name: 'UnitedHealth Group',    price: '393.05',   pct: '-0.22%', up: false,  sector: 'Healthcare',  state: 'Minnesota' },
  { sym: 'PH',   name: 'Parker Hannifin',       price: '1,029.86',   pct: '-1.15%', up: false, sector: 'Industrials', state: 'Ohio'      },
  { sym: 'ITW',  name: 'Illinois Tool Works',   price: '288.57',   pct: '+1.37%', up: true, sector: 'Industrials', state: 'Illinois'  },
  { sym: 'EMR',  name: 'Emerson Electric',      price: '158.72',   pct: '+0.60%', up: true, sector: 'Industrials', state: 'Missouri'  },
  { sym: 'ROK',  name: 'Rockwell Automation',   price: '436.22',   pct: '+0.59%', up: true, sector: 'Industrials', state: 'Wisconsin' },
  { sym: 'ABT', name: 'Abbott Laboratories', price: '114.88', pct: '+1.95%', up: true, sector: 'Healthcare', state: 'Illinois' },
  { sym: 'ABBV', name: 'AbbVie', price: '264.72', pct: '+2.24%', up: true, sector: 'Healthcare', state: 'Illinois' },
  { sym: 'MCD', name: 'McDonald\'s', price: '270.11', pct: '+1.17%', up: true, sector: 'Consumer', state: 'Illinois' },
  { sym: 'EXC', name: 'Exelon', price: '45.69', pct: '+0.84%', up: true, sector: 'Energy', state: 'Illinois' },
  { sym: 'CAG', name: 'Conagra Brands', price: '15.99', pct: '+3.03%', up: true, sector: 'Agriculture', state: 'Illinois' },
  { sym: 'ALL', name: 'Allstate', price: '265.19', pct: '+1.55%', up: true, sector: 'Insurance', state: 'Illinois' },
  { sym: 'CME', name: 'CME Group', price: '270.14', pct: '-0.52%', up: false, sector: 'Banking', state: 'Illinois' },
  { sym: 'GWW', name: 'W.W. Grainger', price: '1,324.13', pct: '+0.76%', up: true, sector: 'Industrials', state: 'Illinois' },
  { sym: 'MPC', name: 'Marathon Petroleum', price: '362.11', pct: '-1.12%', up: false, sector: 'Energy', state: 'Ohio' },
  { sym: 'SHW', name: 'Sherwin-Williams', price: '354.81', pct: '+2.76%', up: true, sector: 'Industrials', state: 'Ohio' },
  { sym: 'GT', name: 'Goodyear Tire & Rubber', price: '6.14', pct: '+3.54%', up: true, sector: 'Industrials', state: 'Ohio' },
  { sym: 'PGR', name: 'Progressive Corporation', price: '215.36', pct: '+3.92%', up: true, sector: 'Insurance', state: 'Ohio' },
  { sym: 'AEP', name: 'American Electric Power', price: '126.31', pct: '-0.03%', up: false, sector: 'Energy', state: 'Ohio' },
  { sym: 'OC', name: 'Owens Corning', price: '152.83', pct: '+1.47%', up: true, sector: 'Industrials', state: 'Ohio' },
  { sym: 'KR', name: 'Kroger', price: '57.20', pct: '+1.53%', up: true, sector: 'Retail', state: 'Ohio' },
  { sym: 'CLF', name: 'Cleveland-Cliffs', price: '12.17', pct: '+2.44%', up: true, sector: 'Industrials', state: 'Ohio' },
  { sym: 'F', name: 'Ford Motor Company', price: '14.30', pct: '+2.66%', up: true, sector: 'Consumer', state: 'Michigan' },
  { sym: 'GM', name: 'General Motors', price: '85.75', pct: '+2.44%', up: true, sector: 'Consumer', state: 'Michigan' },
  { sym: 'DOW', name: 'Dow Inc', price: '31.95', pct: '+2.44%', up: true, sector: 'Industrials', state: 'Michigan' },
  { sym: 'GIS', name: 'General Mills', price: '39.25', pct: '+3.07%', up: true, sector: 'Agriculture', state: 'Minnesota' },
  { sym: 'BBY', name: 'Best Buy', price: '89.60', pct: '+2.67%', up: true, sector: 'Retail', state: 'Minnesota' },
  { sym: 'ECL', name: 'Ecolab', price: '285.25', pct: '+1.88%', up: true, sector: 'Industrials', state: 'Minnesota' },
  { sym: 'HRL', name: 'Hormel Foods', price: '24.70', pct: '+1.48%', up: true, sector: 'Agriculture', state: 'Minnesota' },
  { sym: 'HOG', name: 'Harley-Davidson', price: '27.68', pct: '+1.65%', up: true, sector: 'Consumer', state: 'Wisconsin' },
  { sym: 'JCI', name: 'Johnson Controls', price: '146.37', pct: '-2.21%', up: false, sector: 'Industrials', state: 'Wisconsin' },
  { sym: 'GNRC', name: 'Generac Holdings', price: '206.94', pct: '-2.18%', up: false, sector: 'Industrials', state: 'Wisconsin' },
  { sym: 'CNC', name: 'Centene Corporation', price: '64.95', pct: '-0.41%', up: false, sector: 'Healthcare', state: 'Missouri' },
  { sym: 'HRB', name: 'H&R Block', price: '52.38', pct: '+2.83%', up: true, sector: 'Professional Services', state: 'Missouri' },
  { sym: 'BG', name: 'Bunge Global', price: '114.20', pct: '-0.14%', up: false, sector: 'Agriculture', state: 'Missouri' },
  { sym: 'PFG', name: 'Principal Financial Group', price: '112.90', pct: '-0.21%', up: false, sector: 'Insurance', state: 'Iowa' },
  { sym: 'CASY', name: 'Casey\'s General Stores', price: '846.45', pct: '-1.00%', up: false, sector: 'Retail', state: 'Iowa' },
  { sym: 'GRMN', name: 'Garmin', price: '305.46', pct: '+2.70%', up: true, sector: 'Technology', state: 'Kansas' },
  { sym: 'BRK-B', name: 'Berkshire Hathaway', price: '506.72', pct: '+0.75%', up: true, sector: 'Insurance', state: 'Nebraska' },
  { sym: 'UNP', name: 'Union Pacific', price: '307.40', pct: '+2.90%', up: true, sector: 'Industrials', state: 'Nebraska' },
  { sym: 'HUM', name: 'Humana', price: '382.61', pct: '+0.16%', up: true, sector: 'Healthcare', state: 'Kentucky' },
  { sym: 'YUM', name: 'Yum! Brands', price: '147.43', pct: '+1.77%', up: true, sector: 'Consumer', state: 'Kentucky' },
  { sym: 'BF-B', name: 'Brown-Forman', price: '27.75', pct: '+2.21%', up: true, sector: 'Consumer', state: 'Kentucky' },
];

/* FINNHUB_KEY comes from config.js, loaded via <script> before this file. */

function buildTickerItem(t) {
  return '<span class="ticker-item">'
    + '<span class="ticker-sym">' + t.sym + '</span>'
    + '<span class="ticker-price">' + t.price + '</span>'
    + '<span class="' + (t.up ? 'ticker-up' : 'ticker-down') + '">' + (t.up ? '▲' : '▼') + ' ' + t.pct + '</span>'
    + '</span>';
}

/* Subscriber list — anything that needs to re-render when live quotes update
   (the ticker bar, the market digest, any per-sector snapshot on a category
   page) registers here via onTickerUpdate() instead of being hardcoded into
   fetchLiveQuotes(). */
const TICKER_SUBSCRIBERS = [];
function onTickerUpdate(fn) { TICKER_SUBSCRIBERS.push(fn); }

/* extraStaticItems: page-specific entries that should display but never be
   live-fetched (e.g. index/yield figures like DJI, SPX, 2YR on the Fed article —
   Finnhub's free quote endpoint only covers individual equities). */
/* Caches the full set of live quote fields (not just whichever symbols the
   rotation last touched) so a page reload within the TTL can apply real data
   to every tracked company instantly, with zero network calls — instead of
   waiting for the rotation to slowly reach each one over several minutes.
   The recurring rotation only exists to stay under budget on every *repeated*
   60s refresh; a one-time full fetch on cold load doesn't have that problem,
   it's a single burst, not a sustained per-minute cost. */
const QUOTE_CACHE_TTL_MS = 55 * 1000; /* just under the 60s refresh interval */

function getQuoteCache() {
  try {
    const raw = localStorage.getItem('the317-quotes-v2');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > QUOTE_CACHE_TTL_MS) return null;
    return parsed.items;
  } catch (e) {
    return null;
  }
}

function setQuoteCache() {
  try {
    const items = STOCK_TICKERS.map(function(t) {
      return { sym: t.sym, price: t.price, pct: t.pct, up: t.up, dayHigh: t.dayHigh, dayLow: t.dayLow, dayOpen: t.dayOpen };
    });
    localStorage.setItem('the317-quotes-v2', JSON.stringify({ savedAt: Date.now(), items: items }));
  } catch (e) { /* storage full or unavailable — fine, just won't cache */ }
}

function applyQuoteCache(items) {
  const bySym = {};
  items.forEach(function(item) { bySym[item.sym] = item; });
  STOCK_TICKERS.forEach(function(t) {
    const cached = bySym[t.sym];
    if (!cached) return;
    t.price = cached.price;
    t.pct = cached.pct;
    t.up = cached.up;
    if (typeof cached.dayHigh === 'number') t.dayHigh = cached.dayHigh;
    if (typeof cached.dayLow === 'number') t.dayLow = cached.dayLow;
    if (typeof cached.dayOpen === 'number') t.dayOpen = cached.dayOpen;
  });
}

function initTicker(extraStaticItems) {
  extraStaticItems = extraStaticItems || [];
  const allItems = STOCK_TICKERS.concat(extraStaticItems);

  function render() {
    const track = document.getElementById('ticker-track');
    if (!track) return;
    const html = allItems.map(buildTickerItem).join('');
    track.innerHTML = html + html; /* duplicated for the seamless scroll loop */
    /* Scroll speed scales with item count (~2s per item, same pace the bar
       was originally tuned at with ~19 items / 38s) so adding more tracked
       companies doesn't make the bar visibly speed up. */
    track.style.animationDuration = (allItems.length * 2) + 's';
  }
  render();
  onTickerUpdate(render);
  onTickerUpdate(renderMarketDigest);

  /* Batched (not all-at-once) — with the tracked companies, firing every quote
     request simultaneously reliably trips Finnhub's concurrency limit (same
     issue the M&A news panel hit). Small sequential batches keep it reliable.

     Refreshing every tracked symbol every 60s would mean roughly one call per symbol per minute —
     already over Finnhub's free-tier 60-calls/min limit on its own, before the
     M&A news panel or mover-news clicks use any of that same budget. Worse,
     fetchInBatches always walks the array in the same fixed order, so the same
     ~60 symbols at the front of STOCK_TICKERS would win the rate-limit race
     every single cycle while everything past that point got a 429 every time
     and never refreshed — permanently stale, not randomly stale. Fixed by only
     refreshing a rotating slice each cycle (well under budget) and advancing
     the start point every time, so every symbol gets a fair turn over a few
     cycles instead of the same tail always losing. */
  /* A single page load fires this AND the M&A news panel's own chunk (see
     DEAL_NEWS_CHUNK_SIZE below) nearly simultaneously — those two budgets are
     not independent, they share the same 60-calls/min key. With the company
     list trimmed to ~63, 20 + 20 = 40 per load leaves real margin for a
     second refresh within that same minute, while still completing a full
     rotation in ~4 cycles instead of ~8. */
  const QUOTE_CHUNK_SIZE = 20;
  /* Randomized rather than always starting at 0 — quoteCursor resets on every
     page load (it's local to initTicker), so a fixed start point meant the
     same first-chunk symbols always refreshed first and everything past that
     window stayed on its static fallback until a later cycle. Owens Corning's
     fallback (+8.10%) happens to be the single highest value in the whole
     dataset, so it dominated Top Gainers on nearly every reload simply
     because its index was always outside that first window. Randomizing the
     start means a different slice gets priority each load. */
  let quoteCursor = Math.floor(Math.random() * STOCK_TICKERS.length);

  function fetchLiveQuotes() {
    const chunk = [];
    for (let n = 0; n < Math.min(QUOTE_CHUNK_SIZE, STOCK_TICKERS.length); n++) {
      chunk.push(STOCK_TICKERS[(quoteCursor + n) % STOCK_TICKERS.length]);
    }
    quoteCursor = (quoteCursor + QUOTE_CHUNK_SIZE) % STOCK_TICKERS.length;

    fetchInBatches(chunk, 6, function(t) {
      return fetch('https://finnhub.io/api/v1/quote?symbol=' + t.sym + '&token=' + FINNHUB_KEY)
        .then(function(r) { return r.ok ? r.json() : null; })
        .then(function(data) {
          if (!data || typeof data.c !== 'number' || data.c === 0) return;
          t.price = data.c.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          t.pct = (data.dp >= 0 ? '+' : '') + data.dp.toFixed(2) + '%';
          t.up = data.dp >= 0;
          /* day's high/low/open, used for the volatility callout below — not shown in the ticker bar itself */
          if (typeof data.h === 'number') t.dayHigh = data.h;
          if (typeof data.l === 'number') t.dayLow = data.l;
          if (typeof data.o === 'number') t.dayOpen = data.o;
          if (typeof data.pc === 'number' && data.pc > 0) t.prevClose = data.pc;
        })
        .catch(function() { /* keep last-known value for this symbol */ });
    }, 300).then(function() {
      setQuoteCache(); /* keeps the cache current so the *next* reload, even after this cycle, can apply real data instantly */
      TICKER_SUBSCRIBERS.forEach(function(fn) { fn(); });
    });
  }

  /* A "fetch everything in one burst" approach was tried here and reverted —
     testing showed Finnhub's free tier enforces a much stricter short-burst
     limit than the advertised 60/min figure (as few as ~6 calls in quick
     succession before 429s start, regardless of pacing), so trying to fetch
     all tracked companies at once just reliably fails outright. The rotation
     below (QUOTE_CHUNK_SIZE per cycle) is the part that's actually proven
     reliable; the cache below it means once the rotation *has* gathered real
     data, a reload within the TTL reuses it instantly instead of resetting
     back to the static fallback every time. */
  const cachedQuotes = getQuoteCache();
  if (cachedQuotes) {
    applyQuoteCache(cachedQuotes); /* instant — no network call at all */
    render(); /* the ticker bar already rendered once above with stale data before this ran — re-render now that real values are applied */
    TICKER_SUBSCRIBERS.forEach(function(fn) { fn(); }); /* movers/snapshots registered after this point will pick up fresh STOCK_TICKERS naturally, but anything already subscribed needs an explicit nudge */
  } else {
    fetchLiveQuotes();
  }
  renderMarketDigest();

  /* Re-fetch every 60s. Each cycle only refreshes QUOTE_CHUNK_SIZE symbols
     (rotating), so a full rotation across all tracked companies completes every
     ~3 cycles (~3 min) — every symbol gets refreshed regularly without ever
     exceeding Finnhub's free-tier rate limit. This keeps running even after
     the cold-load full fetch above, so data stays current between reloads. */
  setInterval(fetchLiveQuotes, 60000);

  /* Re-render the digest every 30s on its own — no network call, just re-checks the clock
     so the "as of" time and open/closed status keep ticking between quote refreshes. */
  setInterval(renderMarketDigest, 30000);

  initWebSocket();
}

/* ── FINNHUB WEBSOCKET ──
   Opens a single persistent connection that receives real-time trade prices for
   all 63 symbols the moment a trade occurs — no rate limit on receiving.
   WebSocket only provides trade price (not pct change), so the REST rotation
   above still handles pct. We recalculate pct ourselves when prevClose is known
   (stored by fetchLiveQuotes on first REST cycle). */
function initWebSocket() {
  if (!FINNHUB_KEY || typeof WebSocket === 'undefined') return;

  var ws = null;
  var reconnectDelay = 3000;
  var pendingRender = false;

  function scheduleRender() {
    if (pendingRender) return;
    pendingRender = true;
    setTimeout(function() {
      pendingRender = false;
      TICKER_SUBSCRIBERS.forEach(function(fn) { fn(); });
    }, 500); /* batch trade bursts — re-render at most every 500ms */
  }

  function connect() {
    ws = new WebSocket('wss://ws.finnhub.io?token=' + FINNHUB_KEY);

    ws.onopen = function() {
      reconnectDelay = 3000;
      STOCK_TICKERS.forEach(function(t) {
        ws.send(JSON.stringify({ type: 'subscribe', symbol: t.sym }));
      });
    };

    ws.onmessage = function(event) {
      try {
        var msg = JSON.parse(event.data);
        if (msg.type !== 'trade' || !Array.isArray(msg.data)) return;

        var updated = false;
        msg.data.forEach(function(trade) {
          var price = trade.p;
          if (!trade.s || typeof price !== 'number') return;
          var ticker = null;
          for (var i = 0; i < STOCK_TICKERS.length; i++) {
            if (STOCK_TICKERS[i].sym === trade.s) { ticker = STOCK_TICKERS[i]; break; }
          }
          if (!ticker) return;

          ticker.price = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          if (typeof ticker.prevClose === 'number' && ticker.prevClose > 0) {
            var pctNum = ((price - ticker.prevClose) / ticker.prevClose) * 100;
            ticker.pct = (pctNum >= 0 ? '+' : '') + pctNum.toFixed(2) + '%';
            ticker.up = pctNum >= 0;
          }
          updated = true;
        });

        if (updated) scheduleRender();
      } catch (e) {}
    };

    ws.onerror = function() { try { ws.close(); } catch (e) {} };

    ws.onclose = function() {
      setTimeout(connect, reconnectDelay);
      reconnectDelay = Math.min(reconnectDelay * 2, 30000);
    };
  }

  connect();

  /* Finnhub closes idle connections after ~60s — keep-alive ping every 20s */
  setInterval(function() {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping' }));
    }
  }, 20000);
}

/* ── SECTOR SNAPSHOT ──
   A live mini-ticker for a single sector, used on category pages (Banking,
   Pharma, Industrials). Renders immediately from the static fallback, then
   updates automatically whenever initTicker's live quotes arrive. */
function renderSectorSnapshot(sector, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  function render() {
    const items = STOCK_TICKERS.filter(function(t) { return t.sector === sector; });
    if (!items.length) {
      container.innerHTML = '<p class="deal-news-empty">No companies tracked in this sector yet.</p>';
      return;
    }
    container.innerHTML = items.map(function(t) {
      return '<div class="snapshot-row">'
        + '<span class="snapshot-sym">' + t.sym + '</span>'
        + '<span class="snapshot-name">' + t.name + '</span>'
        + '<span class="snapshot-state">' + t.state + '</span>'
        + '<span class="snapshot-price">' + t.price + '</span>'
        + '<span class="' + (t.up ? 'snapshot-up' : 'snapshot-down') + '">' + (t.up ? '▲' : '▼') + ' ' + t.pct + '</span>'
        + '</div>';
    }).join('');
  }

  render();
  onTickerUpdate(render);
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

  /* Scoped explicitly to OUR tracked sample, not "the market" broadly — a
     tracked Midwest sample can (and will, sometimes) diverge from the
     S&P 500 or the broader market on any given day, so the lead sentence
     must not read as a claim about the overall market. */
  let lead;
  if (status.state === 'open') {
    lead = 'Right now, our tracked Midwest companies are ' + sentiment + '.';
  } else if (status.state === 'pre') {
    lead = 'Markets open at 9:30 AM ET. Based on the last close, our tracked Midwest companies are heading in ' + sentiment + '.';
  } else {
    lead = 'Our tracked Midwest companies closed ' + sentiment + ' today.';
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
   Real, live news from Finnhub's company-news endpoint for the same 32 tickers
   above. This is NOT comprehensive Midwest deal coverage — it can only ever surface
   M&A involving these specific public companies, since that's how the underlying
   API works (per-symbol, not a general search). Most real middle-market M&A never
   involves a company this size, so this is a genuine but narrow slice — a complement
   to The Deal Flow page's manually sourced deals, not a replacement for it. */

const DEAL_NEWS_POSITIVE = /\bacquisition of\b|\bto acquire\b|\bacquired by\b|\bacquires\b|\bmerger\b|\bmerges with\b|\bbuyout\b|\bspin[\s-]?off\b|\bdefinitive agreement\b|\bdivest|\btakeover\b/i;
const DEAL_NEWS_NEGATIVE = /stocks? to buy|reasons? to buy|good stock to buy|buy now|upgrades?.*to buy|price target|best .* stocks|buy according|still .* buy|too late to buy|time to buy|reduces? (its )?stake|boosts? (its )?stake|increases? (its )?stake|decreases? (its )?stake/i;

/* Client-side cache so we don't re-hit Finnhub's company-news endpoint on
   every page load. Quotes alone (32 calls) already use a meaningful chunk of
   Finnhub's free-tier rate limit; adding 32+ more news calls on top of that,
   every single time someone loads a page, reliably tripped 429s and made the
   panel come back empty. Caching means most page loads cost zero news calls. */
const DEAL_NEWS_CACHE_TTL_MS = 10 * 60 * 1000; /* 10 minutes */

function getDealNewsCache(cacheKey) {
  try {
    /* v2: invalidates stale entries cached by a now-fixed bug that cached a
       rate-limited fetch's empty result as if it were genuine "no M&A news." */
    const raw = localStorage.getItem('the317-deal-news-v2-' + cacheKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > DEAL_NEWS_CACHE_TTL_MS) return null;
    return parsed.items;
  } catch (e) {
    return null; /* localStorage unavailable (e.g. private browsing) — just skip caching */
  }
}

function setDealNewsCache(cacheKey, items) {
  try {
    localStorage.setItem('the317-deal-news-v2-' + cacheKey, JSON.stringify({ savedAt: Date.now(), items: items }));
  } catch (e) { /* storage full or unavailable — fine, just won't cache */ }
}

/* Fetches in small sequential batches (waiting for each batch to fully
   resolve before starting the next) instead of firing everything at once —
   spreads load so it doesn't collide with the ticker's own concurrent quote
   calls and trip Finnhub's rate limit. Individual 429s are skipped rather
   than failing the whole batch. */
function fetchInBatches(items, batchSize, fetchFn, delayMs) {
  let results = [];
  let i = 0;
  function next() {
    if (i >= items.length) return Promise.resolve(results);
    const batch = items.slice(i, i + batchSize);
    i += batchSize;
    return Promise.all(batch.map(fetchFn)).then(function(batchResults) {
      results = results.concat(batchResults);
      if (!delayMs || i >= items.length) return next();
      return new Promise(function(resolve) { setTimeout(resolve, delayMs); }).then(next);
    });
  }
  return next();
}

/* sectorFilter (optional): only fetch/show news for companies in that sector
   (used by category pages). Omit it to cover all tracked companies. */
/* The homepage's unfiltered panel covers every tracked company — checking
   news for all of them in one burst is, by itself, already over Finnhub's
   60-calls/min free-tier cap, even before the ticker bar's own quote calls.
   So each fetch cycle only checks a rotating chunk (same approach as the
   quote rotation above), and results are merged with whatever's already
   cached instead of replacing it — so coverage still builds up to the full
   company list across a few 10-minute cycles instead of one over-budget
   burst that mostly just fails.

   This chunk fires on the same page load as the quote rotation above, and
   they share the same 60-calls/min key — their two budgets add up, they
   don't reset independently. Sized so quotes (20) + this (20) = 40 per
   page load, leaving real headroom for a refresh or two within the same
   minute instead of guaranteeing 429s the moment someone reloads to check. */
const DEAL_NEWS_CHUNK_SIZE = 20;
const dealNewsCursors = {}; /* cacheKey -> rotation cursor */

function initDealNews(sectorFilter) {
  const container = document.getElementById('deal-news');
  if (!container) return;

  const tickers = sectorFilter ? STOCK_TICKERS.filter(function(t) { return t.sector === sectorFilter; }) : STOCK_TICKERS;
  const cacheKey = sectorFilter || 'all';

  /* Keep the disclaimer's company count accurate automatically as STOCK_TICKERS
     grows or shrinks, instead of a number hand-typed into the HTML going stale. */
  const countEl = document.getElementById('deal-news-count');
  if (countEl) countEl.textContent = tickers.length;

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

  function fetchAndRender() {
    const to = new Date();
    const from = new Date(to.getTime() - 120 * 24 * 60 * 60 * 1000); /* trailing 120 days */
    const fmt = function(d) { return d.toISOString().slice(0, 10); };

    /* Only check a rotating chunk this cycle — see DEAL_NEWS_CHUNK_SIZE note above. */
    const cursor = dealNewsCursors[cacheKey] || 0;
    const chunkSize = Math.min(DEAL_NEWS_CHUNK_SIZE, tickers.length);
    const chunk = [];
    for (let n = 0; n < chunkSize; n++) {
      chunk.push(tickers[(cursor + n) % tickers.length]);
    }
    dealNewsCursors[cacheKey] = (cursor + chunkSize) % tickers.length;

    /* Track real fetch failures (rate-limited, network error) separately from
       "fetch succeeded and there's genuinely no news" — same distinction the
       mover-news cache fix made. Without it, a batch that gets rate-limited
       returns [] for every symbol, which then gets cached as "no M&A activity"
       for 10 minutes even though the real answer is just "couldn't check." */
    let anyFailed = false;
    fetchInBatches(chunk, 6, function(t) {
      return fetch('https://finnhub.io/api/v1/company-news?symbol=' + t.sym + '&from=' + fmt(from) + '&to=' + fmt(to) + '&token=' + FINNHUB_KEY)
        .then(function(r) {
          if (!r.ok) { anyFailed = true; return []; }
          return r.json();
        })
        .catch(function() { anyFailed = true; return []; });
    }, 200).then(function(results) {
      const fresh = [];
      results.forEach(function(list) {
        if (!Array.isArray(list)) return;
        list.forEach(function(item) {
          const headline = item.headline || '';
          if (DEAL_NEWS_POSITIVE.test(headline) && !DEAL_NEWS_NEGATIVE.test(headline)) {
            fresh.push(item);
          }
        });
      });

      /* Merge with whatever's already cached from previous cycles — otherwise
         companies outside this cycle's chunk would disappear from the panel
         every time it rotates, instead of the coverage building up over time. */
      const previous = getDealNewsCache(cacheKey) || [];
      const merged = fresh.concat(previous);
      const seen = new Set();
      const unique = merged.filter(function(item) {
        const key = item.headline.toLowerCase().slice(0, 40);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      unique.sort(function(a, b) { return b.datetime - a.datetime; });
      const finalList = unique.slice(0, 40); /* cap stored size so the cache doesn't grow unbounded */

      /* Only cache a genuinely empty result — if some calls failed and we got
         nothing, that's "couldn't check," not "checked and there's nothing." */
      if (finalList.length || !anyFailed) setDealNewsCache(cacheKey, finalList);

      if (!finalList.length && anyFailed) {
        container.innerHTML = '<p class="deal-news-empty">Couldn\'t load M&amp;A activity right now — try again shortly.</p>';
        return;
      }
      render(finalList);
    }).catch(function() {
      container.innerHTML = '<p class="deal-news-empty">Couldn\'t load M&A activity right now.</p>';
    });
  }

  const cached = getDealNewsCache(cacheKey);
  if (cached) {
    render(cached); /* instant — no network call at all on most page loads */
  } else {
    container.innerHTML = '<p class="deal-news-empty">Loading recent M&amp;A activity…</p>';
    fetchAndRender();
  }

  /* Re-check every 10 minutes — as real time passes, this naturally surfaces
     newer headlines (the 120-day window slides forward) and ages out old
     ones. Matches the cache TTL, so an open tab refreshes itself instead of
     only updating on a manual reload. */
  setInterval(fetchAndRender, DEAL_NEWS_CACHE_TTL_MS);
}

/* ── TODAY'S MOVERS ──
   Ranks every tracked company (see STOCK_TICKERS) by today's
   % change. This is NOT a full-market screener — no free API gives that
   reliably — it's the biggest movers among the real Midwest companies we
   track. Clicking a row fetches that company's real recent news on demand
   (cached per-symbol) so you can see what's actually been published about it,
   rather than a synthesized "why" claim. */

const MOVER_NEWS_CACHE_TTL_MS = 10 * 60 * 1000; /* 10 minutes */

/* Which symbols' news panels are currently expanded — survives across
   renderTodaysMovers' re-renders (which happen every 60s as live quotes
   refresh and the grid re-sorts). Without this, a live-quote refresh would
   blow away every open panel via innerHTML, and any fetch already in flight
   would resolve into a now-detached DOM node and silently do nothing —
   exactly the "closes everything" / "sometimes nothing loads" symptoms. */
const openMoverSyms = {};
const moverNewsLoading = {}; /* prevents duplicate concurrent fetches per symbol */

function buildMoverRow(t) {
  const pctNum = parseFloat(t.pct);
  const isOpen = !!openMoverSyms[t.sym];
  return '<div class="mover-row" data-sym="' + t.sym + '" onclick="toggleMoverNews(this)">'
    + '<span class="mover-sym">' + t.sym + '</span>'
    + '<span class="mover-name">' + t.name + '</span>'
    + '<span class="mover-state">' + t.state + '</span>'
    + '<span class="mover-price">$' + t.price + '</span>'
    + '<span class="' + (pctNum >= 0 ? 'mover-up' : 'mover-down') + '">' + (pctNum >= 0 ? '▲' : '▼') + ' ' + t.pct + '</span>'
    + '</div>'
    + '<div class="mover-news" id="mover-news-' + t.sym + '" style="display:' + (isOpen ? 'block' : 'none') + '"></div>';
}

function renderTodaysMovers(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  count = count || 15;

  /* Keep the disclaimer's company count accurate automatically as
     STOCK_TICKERS grows or shrinks — same pattern as deal-news-count. */
  const moversCountEl = document.getElementById('movers-count');
  if (moversCountEl) moversCountEl.textContent = STOCK_TICKERS.length;

  function render() {
    const sorted = STOCK_TICKERS.slice().sort(function(a, b) { return parseFloat(b.pct) - parseFloat(a.pct); });
    const gainers = sorted.slice(0, count);
    const losers = sorted.slice(-count).reverse();

    container.innerHTML =
      '<div class="movers-col">' +
        '<p class="movers-col-title">Top Gainers</p>' +
        '<div class="movers-list">' + gainers.map(buildMoverRow).join('') + '</div>' +
      '</div>' +
      '<div class="movers-col">' +
        '<p class="movers-col-title">Top Losers</p>' +
        '<div class="movers-list">' + losers.map(buildMoverRow).join('') + '</div>' +
      '</div>';

    /* Re-populate any panels that were left open before this re-render —
       reads from cache instantly if still fresh, otherwise re-fetches. */
    Object.keys(openMoverSyms).forEach(function(sym) {
      if (document.getElementById('mover-news-' + sym)) loadMoverNews(sym);
    });
  }

  render();
  onTickerUpdate(render);
}

/* Called via inline onclick from buildMoverRow above. Expands/collapses the
   news panel under the clicked row, fetching on first expand only. */
function toggleMoverNews(rowEl) {
  const sym = rowEl.dataset.sym;
  const newsEl = document.getElementById('mover-news-' + sym);
  if (!newsEl) return;

  const isOpen = newsEl.style.display !== 'none';
  if (isOpen) {
    newsEl.style.display = 'none';
    delete openMoverSyms[sym];
    return;
  }
  newsEl.style.display = 'block';
  openMoverSyms[sym] = true;
  loadMoverNews(sym);
}

/* Looks up the news panel by id at call time (rather than holding a DOM
   reference across the fetch) so it still works correctly even if
   renderTodaysMovers rebuilt the grid while this fetch was in flight. */
function loadMoverNews(sym) {
  const newsEl = document.getElementById('mover-news-' + sym);
  if (!newsEl) return;

  const cacheKey = 'the317-mover-news-v2-' + sym; /* v2: invalidates stale entries cached by a now-fixed bug that wrongly treated rate-limit failures as "no news" */
  let cached = null;
  try {
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.savedAt < MOVER_NEWS_CACHE_TTL_MS) cached = parsed.items;
    }
  } catch (e) { /* localStorage unavailable — just skip caching */ }

  if (cached) {
    renderMoverNews(newsEl, cached);
    return;
  }

  if (moverNewsLoading[sym]) return; /* already fetching this symbol — don't double up */
  moverNewsLoading[sym] = true;

  newsEl.innerHTML = '<p class="deal-news-empty">Loading recent news for ' + sym + '…</p>';

  const to = new Date();
  const from = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000); /* trailing 30 days — recent context for "why did this move today" */
  const fmt = function(d) { return d.toISOString().slice(0, 10); };

  fetch('https://finnhub.io/api/v1/company-news?symbol=' + sym + '&from=' + fmt(from) + '&to=' + fmt(to) + '&token=' + FINNHUB_KEY)
    .then(function(r) {
      /* Distinguish "API call failed" (rate-limited, network error) from
         "API call succeeded and there's genuinely no news" — a 429 must NOT
         be treated as or cached as "no news," or clicking several tickers in
         quick succession would wrongly poison the cache for all of them. */
      if (!r.ok) throw new Error('Finnhub returned ' + r.status);
      return r.json();
    })
    .then(function(list) {
      if (!Array.isArray(list)) list = [];
      /* No M&A filter here — any recent news is fair context for a price move,
         not just deal activity. Just de-dupe and take the most recent few. */
      const seen = {};
      const unique = list.filter(function(item) {
        const key = (item.headline || '').toLowerCase().slice(0, 40);
        if (seen[key]) return false;
        seen[key] = true;
        return true;
      });
      unique.sort(function(a, b) { return b.datetime - a.datetime; });
      const top = unique.slice(0, 6);
      try { localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), items: top })); } catch (e) {}
      moverNewsLoading[sym] = false;
      const el = document.getElementById('mover-news-' + sym); /* re-query — a rebuild may have happened mid-fetch */
      if (el) renderMoverNews(el, top);
    })
    .catch(function() {
      moverNewsLoading[sym] = false;
      const el = document.getElementById('mover-news-' + sym);
      if (el) el.innerHTML = '<p class="deal-news-empty">Couldn\'t load news for ' + sym + ' right now.</p>';
    });
}

function renderMoverNews(newsEl, items) {
  if (!items.length) {
    newsEl.innerHTML = '<p class="deal-news-empty">No recent news found for this company.</p>';
    return;
  }
  newsEl.innerHTML = items.map(function(item) {
    const date = new Date(item.datetime * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return '<a class="deal-news-item" href="' + item.url + '" target="_blank" rel="noopener">'
      + '<span class="deal-news-headline">' + item.headline + '</span>'
      + '<span class="deal-news-meta">' + item.source + ' · ' + date + '</span>'
      + '</a>';
  }).join('');
}
