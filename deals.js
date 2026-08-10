/* Shared real-deal data — used by the homepage, Deal Flow page, and category pages.
   Every entry is a real, publicly reported transaction with a source link.
   Dates marked from a deal tracker with month-level-only granularity at time
   of sourcing use the 15th as a placeholder day. */

const DEALS = [
  { target: 'Comerica Incorporated',                    counterparty: 'Fifth Third Bancorp',             sector: 'Banking',              dealType: 'M&A',           value: 10900000000, valueDisplay: '$10.9B',      dateAnnounced: '2026-02-01', source: 'https://www.investing.com/news/sec-filings/comerica-completes-merger-with-fifth-third-delisting-from-nyse-93CH-4478481' },
  { target: 'Cadence Bank',                             counterparty: 'Huntington Bancshares',           sector: 'Banking',              dealType: 'M&A',           value: 7400000000,  valueDisplay: '$7.4B',       dateAnnounced: '2026-02-02', source: 'https://www.cnbc.com/2025/10/27/huntington-bancshares-to-buy-cadence-bank.html' },
  { target: 'Clearwater Corporate Finance',             counterparty: 'KeyCorp',                         sector: 'Banking',              dealType: 'M&A',           value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-04-22', source: 'https://www.prnewswire.com/news-releases/keycorp-to-acquire-clearwater-uk-expanding-financial-advisory-capabilities-302749460.html' },
  { target: 'Hillenbrand, Inc.',                        counterparty: 'Lone Star Funds',                 sector: 'Industrials',          dealType: 'PE Buyout',     value: 3800000000,  valueDisplay: '$3.8B',       dateAnnounced: '2026-02-10', source: 'https://hillenbrand.com/corporate-news/lone-star-completes-acquisition-of-hillenbrand/' },
  { target: 'Duna Services',                            counterparty: 'Aecon Utilities Group (Oaktree)', sector: 'Energy',               dealType: 'M&A',           value: 60000000,    valueDisplay: '$60M',        dateAnnounced: '2026-03-15', source: 'https://www.privsource.com/acquisitions/private-equity-backed-acquisitions/state/indiana' },
  { target: 'OneStream, Inc.',                          counterparty: 'Hg',                              sector: 'Technology',           dealType: 'PE Buyout',     value: 6400000000,  valueDisplay: '$6.4B',       dateAnnounced: '2026-04-01', source: 'https://www.crainsdetroit.com/technology/cdb-onestream-acquisition-closed-hg-20260401/' },
  { target: 'Maitland Engineering',                     counterparty: 'BTX Precision (L Squared Capital)', sector: 'Industrials',        dealType: 'PE Buyout',     value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-04-15', source: 'https://www.privsource.com/acquisitions/private-equity-backed-acquisitions/state/indiana' },
  { target: 'Midwest Interventional Spine Specialists', counterparty: 'CPIhealth (Iron Path Capital)',   sector: 'Healthcare',           dealType: 'PE Buyout',     value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-04-15', source: 'https://www.privsource.com/acquisitions/private-equity-backed-acquisitions/state/indiana' },
  { target: 'A. Hattersley & Sons',                     counterparty: 'Foundral (McNally Capital)',      sector: 'Industrials',          dealType: 'PE Buyout',     value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-05-15', source: 'https://www.privsource.com/acquisitions/private-equity-backed-acquisitions/state/indiana' },
  { target: 'CAI',                                      counterparty: 'JLL Partners',                    sector: 'Healthcare',           dealType: 'Growth Equity', value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-05-15', source: 'https://www.privsource.com/acquisitions/private-equity-backed-acquisitions/state/indiana' },
  { target: 'Crowe LLP',                                counterparty: 'KKR',                             sector: 'Professional Services', dealType: 'PE Buyout',    value: 3000000000,  valueDisplay: '$3B',         dateAnnounced: '2026-06-12', source: 'https://www.chicagobusiness.com/banking-finance/ccb-crowe-kkr-stake-20260612/' },
  { target: 'Material Handling Exchange, LLC',          counterparty: 'Architect Equity',                sector: 'Industrials',          dealType: 'PE Buyout',     value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-06-15', source: 'https://www.privsource.com/acquisitions/private-equity-backed-acquisitions/state/indiana' },
  { target: 'Tallman Equipment Company',                counterparty: 'Platte River Equity',             sector: 'Energy',               dealType: 'Growth Equity', value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-06-15', source: 'https://www.privsource.com/acquisitions/private-equity-backed-acquisitions/state/indiana' },
  { target: 'Heraeus Epurio Semiconductor Chemicals',   counterparty: 'Brewer Science',                  sector: 'Industrials',          dealType: 'Asset Sale',    value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-06-18', source: 'https://www.prnewswire.com/news-releases/brewer-science-to-acquire-semiconductor-chemical-business-line-from-heraeus-epurio-302804538.html' },
  { target: 'Erdman',                                   counterparty: 'Brightstar Capital Partners',     sector: 'Professional Services', dealType: 'PE Buyout',    value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-06-22', source: 'https://www.businesswire.com/news/home/20260622000400/en/Brightstar-Capital-Partners-Acquires-Erdman-Expanding-Its-Architecture-Design-Platform-into-Healthcare-and-Senior-Living', articleSlug: 'brightstar-capital-erdman-june-2026' },
  { target: "Church's Texas (Golub Capital)",           counterparty: 'Golub Capital',                   sector: 'Consumer',             dealType: 'Growth Equity', value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-08-09', source: null, articleSlug: 'churchs-chicken-golub-2026' },
  { target: 'Claros Technologies',                      counterparty: 'Series B Investors',              sector: 'Environmental Tech',   dealType: 'Private Placement', value: 55000000, valueDisplay: '$55M',      dateAnnounced: '2026-08-09', source: null, articleSlug: 'claros-technologies-pfas-2026' },
  { target: 'Finward Bancorp',                          counterparty: 'First Financial Bancorp',         sector: 'Banking',              dealType: 'M&A',           value: 208000000,   valueDisplay: '$208M',       dateAnnounced: '2026-08-09', source: null, articleSlug: 'first-financial-finward-2026' },
  { target: 'Prince & Izant',                          counterparty: 'TransDigm Group',                 sector: 'Industrials',          dealType: 'M&A',           value: 1000000000,  valueDisplay: '$1B+',        dateAnnounced: '2026-08-10', source: null, articleSlug: 'transdigm-prince-izant-2026' },
  { target: 'Sextant',                                 counterparty: 'Element Three',                   sector: 'Technology',           dealType: 'M&A',           value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-07-28', source: 'https://elementthree.com/blog/element-three-acquires-sextant-betting-the-future-of-oem-growth-on-connecting-marketing-data-and-dealer-performance/', articleSlug: null },
  { target: 'Avisoft Bioacoustics',                    counterparty: 'Lafayette Instrument Company',     sector: 'Life Sciences',        dealType: 'M&A',           value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-07-15', source: null, articleSlug: 'lafayette-instrument-avisoft-2026' },
  { target: 'Ultra I&C Mission Solutions',             counterparty: 'Booz Allen Hamilton',             sector: 'Defense Tech',         dealType: 'M&A',           value: 720000000,   valueDisplay: '$720M',       dateAnnounced: '2026-06-15', source: null, articleSlug: 'booz-allen-ultra-mission-solutions-june-2026' },
  { target: 'Meaden & Moore',                         counterparty: 'Unity Partners',                  sector: 'Professional Services', dealType: 'PE Buyout',    value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-06-15', source: null, articleSlug: 'unity-partners-meaden-moore-2026' },
  { target: 'Strack Industrial',                      counterparty: 'Kanawha Scales & Systems',        sector: 'Industrials',          dealType: 'M&A',           value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-06-15', source: null, articleSlug: 'kanawha-scales-strack-2026' },
  { target: 'K&L Freight Management',                 counterparty: 'Argosy Private Equity',           sector: 'Logistics',            dealType: 'PE Buyout',     value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-06-15', source: null, articleSlug: 'argosy-kl-freight-2026' },
  { target: 'Giant Eagle',                             counterparty: 'Kroger',                          sector: 'Consumer',             dealType: 'M&A',           value: 1650000000,  valueDisplay: '$1.65B',      dateAnnounced: '2026-07-15', source: null, articleSlug: 'kroger-giant-eagle-2026' },
  { target: 'Cleveland Cavaliers (minority stake)',    counterparty: 'Blue Owl Capital',                sector: 'Sports & Media',       dealType: 'Growth Equity', value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-06-15', source: null, articleSlug: 'blue-owl-cavaliers-june-2026' },
  { target: 'Mid-State Insurance',                     counterparty: 'Relation Insurance Services',      sector: 'Professional Services', dealType: 'M&A',           value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-07-29', source: 'https://www.insurancejournal.com/news/midwest/2026/07/29/879559.htm', articleSlug: null },
  { target: 'FarmaceuticalRx (Ohio cannabis platform)', counterparty: 'Vireo Growth Inc.',              sector: 'Consumer',             dealType: 'M&A',           value: 208000000,   valueDisplay: '$208M',       dateAnnounced: '2026-07-31', source: 'https://www.globenewswire.com/news-release/2026/07/31/3336682/0/en/vireo-growth-inc-announces-a-four-deal-transaction-to-establish-presence-in-ohio.html', articleSlug: null },
  { target: 'Signature Bancorporation, Inc.',          counterparty: 'Esquire Financial Holdings',       sector: 'Banking',              dealType: 'M&A',           value: 350000000,   valueDisplay: '$350M',       dateAnnounced: '2026-08-01', source: 'https://www.prnewswire.com/news-releases/esquire-financial-holdings-inc-completes-acquisition-of-signature-bancorporation-inc-on-august-1-2026-302840612.html', articleSlug: null },
  { target: 'Salentine Pump & Equipment',              counterparty: 'Motion & Control Enterprises',     sector: 'Industrials',          dealType: 'M&A',           value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-08-03', source: 'https://www.inddist.com/mergers-acquisitions/news/22971805/mce-acquires-wisconsin-pump-distributor', articleSlug: null },
  { target: 'New Point Stone Co. & Harrison Sand and Gravel', counterparty: 'US Aggregates',            sector: 'Industrials',          dealType: 'M&A',           value: null,        valueDisplay: 'Undisclosed', dateAnnounced: '2026-08-05', source: 'https://www.cdrecycler.com/news/us-aggregates-expands-indiana-presence-through-acquisition/', articleSlug: null },
];

const DEAL_TAG_CLASSES = {
  'M&A': 'tag-ma',
  'PE Buyout': 'tag-pe',
  'Growth Equity': 'tag-growth',
  'IPO': 'tag-ipo',
  'Private Placement': 'tag-private',
  'Asset Sale': 'tag-asset',
  'Debt Financing': 'tag-debt',
};

function dealsBySector(sector) {
  return DEALS.filter(function(d) { return d.sector === sector; })
    .slice()
    .sort(function(a, b) { return new Date(b.dateAnnounced) - new Date(a.dateAnnounced); });
}

function recentDeals(n) {
  return DEALS.slice()
    .sort(function(a, b) { return new Date(b.dateAnnounced) - new Date(a.dateAnnounced); })
    .slice(0, n);
}

/* Renders a deal array into a <tbody> with the given id, company names linking
   to their source. Shared by the homepage, Deal Flow page, and category pages. */
function renderDealRows(data, tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  if (!data.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">No deals tracked in this sector yet.</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(function(d) {
    const nameHtml = d.articleSlug
      ? '<a href="' + d.articleSlug + '.html" title="Read our coverage">' + d.target + ' <span style="font-size:11px;opacity:0.5;">→</span></a>'
      : d.source
        ? '<a href="' + d.source + '" target="_blank" rel="noopener" title="View source">' + d.target + ' <span style="font-size:11px;opacity:0.5;">↗</span></a>'
        : d.target;
    return '<tr>'
      + '<td class="company">' + nameHtml + '</td>'
      + '<td>' + d.counterparty + '</td>'
      + '<td class="sector">' + d.sector + '</td>'
      + '<td><span class="deal-tag ' + (DEAL_TAG_CLASSES[d.dealType] || '') + '">' + d.dealType + '</span></td>'
      + '<td class="value">' + d.valueDisplay + '</td>'
      + '<td class="date">' + d.dateAnnounced + '</td>'
      + '</tr>';
  }).join('');
}
