/* ISUZU 70 Trust Passport — clickable iPhone prototype (vanilla JS, hash router).
   All people, plates, centres, prices and numbers are illustrative sample data. */
(() => {
'use strict';

// ---------------------------------------------------------------------------
// Icons (24px stroke)
// ---------------------------------------------------------------------------
const P = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
const I = {
  back: P('<path d="M15 5l-7 7 7 7"/>'),
  close: P('<path d="M6 6l12 12M18 6L6 18"/>'),
  home: P('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>'),
  passport: P('<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3.2"/><path d="M9 16h6"/>'),
  scan: P('<path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3"/><path d="M4 12h16"/>'),
  calendar: P('<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
  gift: P('<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8S10.5 3.5 8 4.5 9 8 12 8zm0 0s1.5-4.5 4-3.5S15 8 12 8z"/>'),
  check: P('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  shield: P('<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="M8.8 12l2.2 2.2 4.4-4.4"/>'),
  alert: P('<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>'),
  info: P('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
  chevron: P('<path d="M9 5l7 7-7 7"/>'),
  share: P('<path d="M12 15V3M7.5 7.5L12 3l4.5 4.5"/><path d="M5 12v7a1 1 0 001 1h12a1 1 0 001-1v-7"/>'),
  key: P('<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>'),
  truck: P('<path d="M2 6h11v10H2zM13 9h4.5L21 12.5V16h-8z"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>'),
  gauge: P('<path d="M4.5 17a8.5 8.5 0 1115 0"/><path d="M12 13l4-5"/><circle cx="12" cy="13" r="1.4"/>'),
  doc: P('<path d="M7 3h7l5 5v12a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
  pin: P('<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'),
  wrench: P('<path d="M14.5 6.5a4 4 0 00-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 005.3-5.3l-2.5 2.5-2.5-.5-.5-2.5z"/>'),
  user: P('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
  heart: P('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0112 7.4 4.3 4.3 0 0119.5 10c0 5.4-7.5 10-7.5 10z"/>'),
  lock: P('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>'),
  coffee: P('<path d="M4 9h13v5a5 5 0 01-5 5H9a5 5 0 01-5-5z"/><path d="M17 11h1.5a2.5 2.5 0 010 5H17M8 3v3M12 3v3"/>'),
  fuel: P('<path d="M4 21V5a2 2 0 012-2h6a2 2 0 012 2v16M3 21h12M14 9h2.5a1.5 1.5 0 011.5 1.5V17a1.5 1.5 0 003 0V8l-3-3"/><path d="M7 7h4"/>'),
  sparkle: P('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'),
  live: P('<circle cx="12" cy="12" r="2"/><path d="M8.5 8.5a5 5 0 000 7M15.5 8.5a5 5 0 010 7M5.6 5.6a9 9 0 000 12.8M18.4 5.6a9 9 0 010 12.8"/>'),
  down: P('<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>'),
};

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------
const TH_MONTHS = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const TH_DAYS = ['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'];
const fmtDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${TH_MONTHS[m - 1]} ${y}`; };
const fmtMonth = (iso) => { const [y, m] = iso.split('-').map(Number); return `${TH_MONTHS[m - 1]} ${String(y).slice(2)}`; };
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n = (x) => Number(x).toLocaleString('en-US');
const tYear = (iso) => { const [y, m, d] = iso.split('-').map(Number); return y + (m - 1) / 12 + (d - 1) / 365; };

const CENTER_KK = 'ศูนย์บริการอีซูซุ มิตรภาพ ขอนแก่น';
const MY_VISITS = [
  ['2562-04-10', 1012, CENTER_KK, 'เช็กระยะ 1,000 กม.'],
  ['2562-09-21', 10230, CENTER_KK, 'เช็กระยะ 10,000 กม.'],
  ['2563-02-15', 20480, CENTER_KK, 'เช็กระยะ 20,000 กม.'],
  ['2563-08-02', 30110, CENTER_KK, 'เช็กระยะ 30,000 กม.'],
  ['2564-01-19', 40350, 'ศูนย์บริการอีซูซุ บ้านไผ่', 'เช็กระยะ 40,000 กม. · เปลี่ยนผ้าเบรกหน้า'],
  ['2564-07-30', 50120, CENTER_KK, 'เช็กระยะ 50,000 กม.'],
  ['2565-01-08', 61400, CENTER_KK, 'เช็กระยะ 60,000 กม.'],
  ['2565-07-14', 72050, CENTER_KK, 'เช็กระยะ 70,000 กม. · เปลี่ยนแบตเตอรี่'],
  ['2566-02-26', 85300, 'ศูนย์บริการอีซูซุ ชุมแพ', 'เช็กระยะ 80,000 กม.'],
  ['2566-08-12', 98400, CENTER_KK, 'เช็กระยะ 90,000 กม. · ยาง 4 เส้น'],
].map(([date, km, center, title]) => ({ date, km, center, title }));
const CHECK_VISIT = { date: '2570-04-12', km: 152310, center: CENTER_KK, title: 'ตรวจ 70 จุด (G-IDSS) · ออกพาสปอร์ตหน้าใหม่', special: true };

const SELLER_CAR = { // scan demo: healthy history
  model: 'MU-X 1.9 Ddi Ultimate', year: 2563, plate: 'ฎศ 7720 นครราชสีมา',
  visits: [['2563-06-02',1050],['2563-12-10',10400],['2564-06-01',20800],['2564-11-22',30150],['2565-05-18',41200],['2565-11-03',50900],['2566-05-27',61800],['2566-11-15',72300],['2567-05-20',83900],['2567-12-02',95100],['2568-06-14',106400],['2569-12-09',118200]]
    .map(([date, km]) => ({ date, km })),
};
const ROLLED_CAR = { // scan demo: mileage drops between centre records
  model: 'D-MAX Spark 1.9 Ddi', year: 2560, plate: 'บต 3318 ชลบุรี',
  visits: [['2560-03-11',1020],['2560-10-02',15600],['2561-05-20',33400],['2562-01-14',52800],['2562-09-30',71900],['2563-07-08',92300],['2564-05-15',110600],['2565-05-02',128000],['2566-11-20',92450]]
    .map(([date, km]) => ({ date, km })),
};

const CENTERS = [
  { id: 'kk', name: CENTER_KK, dist: '3.2 กม.', note: 'ว่าง 6 ช่วงเวลาวันนี้' },
  { id: 'bp', name: 'ศูนย์บริการอีซูซุ บ้านไผ่', dist: '41 กม.', note: 'ใกล้บ้านเกิด · เช็กก่อนกลับบ้าน' },
  { id: 'cv', name: 'Trust Caravan · ตลาดน้ำพอง', dist: '28 กม.', note: 'walk-in ได้ 12–14 เม.ย.' },
];
const DATES = [ // prototype "today" = 8 เม.ย. 2570
  { iso: '2570-04-09', dow: 5 }, { iso: '2570-04-10', dow: 6 }, { iso: '2570-04-11', dow: 0 },
  { iso: '2570-04-12', dow: 1 }, { iso: '2570-04-13', dow: 2, hol: 'สงกรานต์' }, { iso: '2570-04-14', dow: 3, hol: 'สงกรานต์' },
  { iso: '2570-04-15', dow: 4, hol: 'สงกรานต์' },
];
const SLOTS = [['08:30', 0], ['09:00', 1], ['09:30', 0], ['10:00', 0], ['10:30', 1], ['13:00', 0], ['13:30', 0], ['14:00', 1]];

const FINDINGS = [
  { sev: 'red', t: 'ผ้าเบรกหน้า', d: 'เหลือ 2.8 มม. (ควรเปลี่ยนที่ต่ำกว่า 3 มม.)' },
  { sev: 'red', t: 'แบตเตอรี่', d: 'ค่า CCA 62% ของค่ามาตรฐาน' },
  { sev: 'warn', t: 'น้ำมันเกียร์', d: 'ครบระยะเปลี่ยนที่ 150,000 กม.' },
  { sev: 'warn', t: 'ไส้กรองโซล่า', d: 'ตรวจพบน้ำในระบบเล็กน้อย' },
  { sev: 'warn', t: 'ยางคู่หลัง', d: 'ดอกยางเหลือ 3.5 มม.' },
  { sev: 'warn', t: 'บูชปีกนกล่าง', d: 'เริ่มมีรอยแตกลายงา' },
  { sev: 'warn', t: 'ใบปัดน้ำฝน', d: 'ยางแข็งตัว ปัดไม่เรียบ' },
];

const S = { // app state
  points: 1250,
  vehicle: 'dmax',
  passportTab: 'km',
  checked: false,
  booking: { center: null, date: null, slot: null, consent: false },
  quote: 'isuzu',
  share: { history: true, check: true, owner: false },
  transferConsent: false,
  handover: { to: 'น้องเต้ย (ลูกชาย)', phone: '08x-xxx-4521', note: 'รถคันนี้พาพ่อไปส่งข้าวทุกฤดู\nดูแลมันให้ดี เข้าศูนย์ตามระยะ\nแล้วมันจะดูแลลูกเหมือนที่ดูแลพ่อ', sig: 'พ่อ' },
};

const myVisits = () => (S.checked ? [...MY_VISITS, CHECK_VISIT] : MY_VISITS);
const lastVisit = () => myVisits()[myVisits().length - 1];

// ---------------------------------------------------------------------------
// Graphic helpers
// ---------------------------------------------------------------------------
function carSVG(kind = 'pickup') {
  if (kind === 'truck') {
    return `<svg class="car" viewBox="0 0 320 120" aria-hidden="true">
      <ellipse cx="160" cy="108" rx="140" ry="7" fill="rgba(0,0,0,.08)"/>
      <path d="M40 30h150v62H40z" fill="#fff" stroke="#111" stroke-width="2.2"/>
      <path d="M190 44h52c6 0 10 2 13 7l20 22c3 3 4 6 4 10v9h-89z" fill="#fff" stroke="#111" stroke-width="2.2"/>
      <path d="M204 52h40l16 19h-56z" fill="#D9E3EA" stroke="#111" stroke-width="2"/>
      <rect x="40" y="76" width="150" height="6" fill="#DA291C"/>
      <circle cx="80" cy="96" r="13" fill="#111"/><circle cx="80" cy="96" r="5" fill="#bbb"/>
      <circle cx="112" cy="96" r="13" fill="#111"/><circle cx="112" cy="96" r="5" fill="#bbb"/>
      <circle cx="244" cy="96" r="13" fill="#111"/><circle cx="244" cy="96" r="5" fill="#bbb"/>
    </svg>`;
  }
  return `<svg class="car" viewBox="0 0 320 120" aria-hidden="true">
    <ellipse cx="160" cy="106" rx="140" ry="7" fill="rgba(0,0,0,.08)"/>
    <path d="M28 82V66c0-4 3-7 7-7h96l30-24c3-2 6-3 10-3h56c5 0 9 2 12 6l20 24h28c6 0 10 4 11 10l3 18c0 3-2 5-5 5H33c-3 0-5-2-5-5z" fill="#fff" stroke="#111" stroke-width="2.2"/>
    <path d="M168 40h40c3 0 5 1 7 3l16 19h-86z" fill="#D9E3EA" stroke="#111" stroke-width="2"/>
    <path d="M196 40v22" stroke="#111" stroke-width="2"/>
    <path d="M28 76h264" stroke="#DA291C" stroke-width="4"/>
    <path d="M276 66h14" stroke="#111" stroke-width="3" stroke-linecap="round"/>
    <circle cx="82" cy="90" r="17" fill="#111"/><circle cx="82" cy="90" r="7" fill="#C9C9CE"/>
    <circle cx="240" cy="90" r="17" fill="#111"/><circle cx="240" cy="90" r="7" fill="#C9C9CE"/>
  </svg>`;
}

function stampSVG(v, i = 0, opts = {}) {
  const rot = opts.rot ?? [-8, 6, -3, 9, -11, 4, -6, 10, -2, 7][i % 10];
  const id = `sp${Math.random().toString(36).slice(2, 8)}`;
  if (opts.kind === '70') {
    return `<svg viewBox="0 0 120 120"><g transform="rotate(${rot} 60 60)">
      <circle cx="60" cy="60" r="54" fill="#DA291C"/>
      <circle cx="60" cy="60" r="47" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 3"/>
      <path id="${id}" d="M60 60 m-38 0 a38 38 0 1 1 76 0" fill="none"/>
      <text font-family="Barlow Condensed" font-weight="700" font-size="11" fill="#fff" letter-spacing="2.5"><textPath href="#${id}" startOffset="50%" text-anchor="middle">ISUZU · TRUST</textPath></text>
      <text x="60" y="74" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="40" fill="#fff">70</text>
      <text x="60" y="90" text-anchor="middle" font-family="IBM Plex Sans Thai" font-weight="600" font-size="9" fill="#fff">ปีแห่งความไว้ใจ</text>
    </g></svg>`;
  }
  if (opts.kind === 'region') {
    return `<svg viewBox="0 0 120 120"><g transform="rotate(${rot} 60 60)" fill="none" stroke="#1F3A68" stroke-width="2.4" opacity=".9">
      <rect x="14" y="22" width="92" height="76" rx="10"/><rect x="20" y="28" width="80" height="64" rx="6" stroke-width="1" stroke-dasharray="3 2"/>
      <text x="60" y="52" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="11" fill="#1F3A68" stroke="none" letter-spacing="2">ISAN · อีสาน</text>
      <path d="M38 76c6-12 12-12 18 0s12 12 18 0 10-8 12-4" stroke-width="2"/>
      <text x="60" y="88" text-anchor="middle" font-family="IBM Plex Sans Thai" font-size="8.5" fill="#1F3A68" stroke="none">Trust Caravan 2570</text>
    </g></svg>`;
  }
  if (opts.kind === 'million') {
    return `<svg viewBox="0 0 120 120"><g transform="rotate(${rot} 60 60)">
      <circle cx="60" cy="60" r="54" fill="none" stroke="#C9A227" stroke-width="3"/>
      <circle cx="60" cy="60" r="46" fill="none" stroke="#C9A227" stroke-width="1.2"/>
      <text x="60" y="56" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="26" fill="#C9A227">1,000,000</text>
      <text x="60" y="74" text-anchor="middle" font-family="IBM Plex Sans Thai" font-weight="600" font-size="10" fill="#C9A227">กิโลเมตร</text>
    </g></svg>`;
  }
  const ink = opts.ink || '#C21E14';
  return `<svg viewBox="0 0 120 120"><g transform="rotate(${rot} 60 60)" opacity="${opts.empty ? 1 : .88}">
    <circle cx="60" cy="60" r="52" fill="none" stroke="${ink}" stroke-width="3"/>
    <circle cx="60" cy="60" r="44" fill="none" stroke="${ink}" stroke-width="1.2"/>
    <path id="${id}" d="M60 60 m-37 0 a37 37 0 1 1 74 0" fill="none"/>
    <text font-family="Barlow Condensed" font-weight="700" font-size="10" fill="${ink}" letter-spacing="2"><textPath href="#${id}" startOffset="50%" text-anchor="middle">ISUZU SERVICE</textPath></text>
    ${v ? `<text x="60" y="66" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="19" fill="${ink}">${n(v.km)}</text>
    <text x="60" y="79" text-anchor="middle" font-family="IBM Plex Sans Thai" font-weight="600" font-size="9" fill="${ink}">${fmtDate(v.date)}</text>
    <path d="M36 86h48" stroke="${ink}" stroke-width="1"/>` : `<text x="60" y="68" text-anchor="middle" font-family="IBM Plex Sans Thai" font-size="10" fill="${ink}">รอประทับ</text>`}
  </g></svg>`;
}

function mileageChart(visits, { dark = false, w = 340, h = 170 } = {}) {
  const pad = { l: 36, r: 12, t: 12, b: 24 };
  const xs = visits.map(v => tYear(v.date)), ys = visits.map(v => v.km);
  const x0 = Math.floor(Math.min(...xs)), x1 = Math.ceil(Math.max(...xs) + .01);
  const yMax = Math.ceil(Math.max(...ys) / 50000) * 50000;
  const X = (x) => pad.l + (x - x0) / (x1 - x0) * (w - pad.l - pad.r);
  const Y = (y) => h - pad.b - (y / yMax) * (h - pad.t - pad.b);
  const grid = dark ? 'rgba(255,255,255,.1)' : '#ECECEF', label = dark ? 'rgba(255,255,255,.5)' : '#8E8E95';
  let g = '';
  for (let y = 0; y <= yMax; y += 50000) g += `<line x1="${pad.l}" x2="${w - pad.r}" y1="${Y(y)}" y2="${Y(y)}" stroke="${grid}"/><text x="${pad.l - 6}" y="${Y(y) + 4}" text-anchor="end" font-size="10" fill="${label}" font-family="Barlow Condensed">${y ? (y / 1000) + 'k' : '0'}</text>`;
  const step = (x1 - x0) > 6 ? 2 : 1;
  for (let x = x0; x <= x1; x += step) g += `<text x="${X(x)}" y="${h - 6}" text-anchor="middle" font-size="10" fill="${label}" font-family="Barlow Condensed">${x}</text>`;
  let segs = '', dots = '';
  visits.forEach((v, i) => {
    const flag = i > 0 && v.km < visits[i - 1].km;
    if (i > 0) {
      const p = visits[i - 1];
      const gapYears = tYear(v.date) - tYear(p.date);
      const color = flag ? '#DA291C' : (dark ? '#fff' : '#111');
      const dash = gapYears > 1.5 ? 'stroke-dasharray="4 4"' : '';
      segs += `<line x1="${X(tYear(p.date))}" y1="${Y(p.km)}" x2="${X(tYear(v.date))}" y2="${Y(v.km)}" stroke="${color}" stroke-width="${flag ? 3 : 2.2}" ${dash} stroke-linecap="round"/>`;
    }
    const isLast = i === visits.length - 1;
    const fill = flag ? '#DA291C' : (v.special ? '#DA291C' : (dark ? '#fff' : '#111'));
    dots += `<circle cx="${X(tYear(v.date))}" cy="${Y(v.km)}" r="${isLast || flag || v.special ? 5 : 3.2}" fill="${fill}" stroke="${dark ? '#0E0E10' : '#fff'}" stroke-width="1.5"/>`;
    if (flag) dots += `<g transform="translate(${Math.min(X(tYear(v.date)) - 34, w - 70)} ${Y(v.km) + 10})"><rect width="68" height="18" rx="9" fill="#DA291C"/><text x="34" y="13" text-anchor="middle" font-size="10.5" font-weight="600" fill="#fff" font-family="IBM Plex Sans Thai">ไมล์ลดลง!</text></g>`;
  });
  return `<svg class="chart" viewBox="0 0 ${w} ${h}">${g}${segs}${dots}</svg>`;
}

function fakeQR(seed = 7, size = 25) {
  let s = seed;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const cells = [];
  const finder = (r, c) => {
    const inF = (r0, c0) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
    for (const [r0, c0] of [[0, 0], [0, size - 7], [size - 7, 0]]) {
      if (inF(r0, c0)) { const rr = r - r0, cc = c - c0; return (rr === 0 || rr === 6 || cc === 0 || cc === 6 || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4)) ? 1 : 0; }
    }
    if ((r === 7 && (c < 8 || c >= size - 8)) || (c === 7 && (r < 8 || r >= size - 8)) || (r === 7 && c < 8) || (c === size - 8 && r < 8) || (r === size - 8 && c < 8)) return 0;
    return -1;
  };
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
    const f = finder(r, c);
    if (f === 1 || (f === -1 && rnd() > .52)) cells.push(`<rect x="${c}" y="${r}" width="1.02" height="1.02"/>`);
  }
  return `<svg viewBox="-1 -1 ${size + 2} ${size + 2}" shape-rendering="crispEdges"><rect x="-1" y="-1" width="${size + 2}" height="${size + 2}" fill="#fff"/><g fill="#111">${cells.join('')}</g></svg>`;
}

function ring(pass, warn, red, total = 70) {
  const r = 44, c = 2 * Math.PI * r;
  const seg = (val, off, color) => `<circle cx="52" cy="52" r="${r}" fill="none" stroke="${color}" stroke-width="10" stroke-dasharray="${(val / total) * c - 2} ${c}" stroke-dashoffset="${-off / total * c}" transform="rotate(-90 52 52)"/>`;
  return `<svg viewBox="0 0 104 104">
    <circle cx="52" cy="52" r="${r}" fill="none" stroke="#ECECEF" stroke-width="10"/>
    ${seg(pass, 0, '#1E8E4E')}${seg(warn, pass, '#C98A00')}${seg(red, pass + warn, '#DA291C')}
    <text x="52" y="54" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="28" fill="#111">${pass}/${total}</text>
    <text x="52" y="70" text-anchor="middle" font-family="IBM Plex Sans Thai" font-size="10" fill="#6B6B72">จุดผ่าน</text>
  </svg>`;
}

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------
const topbar = (title, { back = true, cls = '', right = '' } = {}) => `
  <header class="topbar ${cls}">
    ${back ? `<button class="icon-btn" data-back aria-label="ย้อนกลับ">${I.back}</button>` : '<span></span>'}
    <h2>${title}</h2>
    ${right || '<span></span>'}
  </header>`;

const disclaimer = (txt) => `<div class="disclaimer">${I.info}<span>${txt}</span></div>`;
const PASSPORT_NOTE = 'Trust Passport คือบันทึกของศูนย์บริการ ณ วันที่และเลขไมล์ที่ระบุ ไม่ใช่การรับประกันสภาพรถ ข้อมูลส่งต่อเมื่อเจ้าของยินยอมตาม PDPA เท่านั้น';

const TABS = [
  ['home', 'หน้าหลัก', I.home], ['passport', 'พาสปอร์ต', I.passport], ['scan', 'สแกน', I.scan],
  ['book', 'จองตรวจ', I.calendar], ['rewards', 'สิทธิ์ของฉัน', I.gift],
];
const tabbar = (active) => `<nav class="tabbar">${TABS.map(([id, label, ic]) => id === 'scan'
  ? `<button class="tab scan" data-go="scan" aria-label="${label}"><span class="bubble">${ic}</span>${label}</button>`
  : `<button class="tab ${active === id ? 'active' : ''}" data-go="${id}">${ic}${label}</button>`).join('')}</nav>`;

// ---------------------------------------------------------------------------
// Screens
// ---------------------------------------------------------------------------
const screens = {};

screens.home = () => {
  const v = lastVisit();
  const truck = S.vehicle === 'truck';
  const stampCount = myVisits().length + (S.checked ? 2 : 0);
  return { tab: 'home', html: `
  <div class="screen">
    <div class="home-head">
      <div class="bar">
        <div class="wordmark">ISUZU<small>my-ISUZU</small></div>
        <button class="points-chip" data-go="rewards"><span class="dot">P</span><span class="num" style="font-size:16px">${n(S.points)}</span> คะแนน</button>
      </div>
      <div class="greet">สวัสดี คุณสมชาย</div>
      <div class="muted small">my-MEMBER · สมาชิกตั้งแต่ 2562</div>
      <div class="vehicle-tabs">
        <button class="vehicle-tab ${!truck ? 'active' : ''}" data-vehicle="dmax">D-MAX V-Cross</button>
        <button class="vehicle-tab ${truck ? 'active' : ''}" data-vehicle="truck">ELF NLR 130 (กองรถ)</button>
      </div>
    </div>
    <div class="home-hero">
      ${truck ? `
      <div class="vehicle-card">
        <div class="row"><div><div class="model">ELF NLR 130 แรงม้า</div><span class="plate">71-4528 ขอนแก่น</span></div><div class="spacer"></div><span class="chip dark">${I.live} Teletec</span></div>
        ${carSVG('truck')}
        <div class="vehicle-stats">
          <div><b>987,420</b><span>กม. (สด)</span></div>
          <div><b>12</b><span>วันถึงล้าน กม.</span></div>
          <div><b>31</b><span>ตราประทับ</span></div>
        </div>
      </div>` : `
      <div class="vehicle-card">
        <div class="row"><div><div class="model">D-MAX V-Cross 3.0 Ddi</div><span class="plate">กข 4521 ขอนแก่น</span></div><div class="spacer"></div><span class="chip ${S.checked ? 'ok' : 'warn'}">${S.checked ? 'ไมล์ยืนยันแล้ว' : 'ขาดการเข้าศูนย์'}</span></div>
        ${carSVG()}
        <div class="vehicle-stats">
          <div><b>${n(v.km)}</b><span>กม. ล่าสุดที่ยืนยัน</span></div>
          <div><b>2562</b><span>ปีที่ออกรถ</span></div>
          <div><b>${stampCount}</b><span>ตราประทับ</span></div>
        </div>
      </div>`}
    </div>

    ${truck ? `
    <a class="passport-teaser" href="#/million">
      <div class="label">MILLION-KM MOMENT</div>
      <h4>อีก 12,580 กม. ถึง 1,000,000 กม.</h4>
      <div class="small" style="color:rgba(255,255,255,.75)">ทีมศูนย์ขอนแก่นจะไปเซอร์ไพรส์คนขับที่จุดพักรถ</div>
      <div class="progress" style="margin:14px 0 4px"><i style="width:98.7%"></i></div>
      <div class="meta"><span><b>98.7%</b>ของล้านกิโลเมตร</span><span><b>~20 มิ.ย.</b>คาดว่าจะครบ</span></div>
    </a>` : `
    <a class="passport-teaser" href="#/passport">
      <div class="label">TRUST PASSPORT</div>
      <h4>พาสปอร์ตความไว้ใจของรถคุณ</h4>
      <div class="small" style="color:rgba(255,255,255,.75)">ทุกตราประทับคือเหตุผลที่รถของคุณขายได้ราคาดีกว่า</div>
      <div class="stamps-mini">${Array.from({ length: 12 }, (_, i) => `<i class="${i < stampCount ? 'on' : ''}"></i>`).join('')}</div>
      <div class="meta"><span><b>${n(v.km)}</b>กม. ที่ยืนยัน</span><span><b>${fmtDate(v.date)}</b>บันทึกล่าสุด</span></div>
    </a>
    ${S.checked ? '' : `
    <button class="eligibility" data-go="book" style="width:calc(100% - 32px);text-align:left">
      <div class="badge">70<small>จุด ฟรี</small></div>
      <div style="flex:1"><h4>คุณได้สิทธิ์ตรวจ 70 จุดฟรี 20 นาที</h4><p>ไม่ได้เข้าศูนย์ 44 เดือน · เช็กก่อนกลับบ้านช่วงสงกรานต์</p></div>
      <span class="go">${I.chevron}</span>
    </button>`}`}

    <div class="quick-grid">
      <a class="quick" href="#/transfer"><span class="ic">${I.share}</span>ส่งต่อ<br>ความไว้ใจ</a>
      <a class="quick" href="#/scan"><span class="ic">${I.scan}</span>สแกน<br>ก่อนซื้อ</a>
      <a class="quick" href="#/handover"><span class="ic">${I.key}</span>ส่งกุญแจ<br>รุ่นถัดไป</a>
      <a class="quick" href="#/odometer"><span class="ic">${I.gauge}</span>Trust<br>Odometer</a>
    </div>

    <div class="section-title"><h3>ไฮไลต์ครบรอบ 70 ปี</h3></div>
    <div class="campaign">
      <div class="art">
        <span class="q">TWIN TRUCK AUCTION</span>
        <svg viewBox="0 0 110 60"><path d="M4 16h58v32H4zM62 24h24l16 14v10H62z" fill="none" stroke="#fff" stroke-width="2"/><circle cx="22" cy="50" r="6" fill="#111" stroke="#fff" stroke-width="2"/><circle cx="84" cy="50" r="6" fill="#111" stroke="#fff" stroke-width="2"/><rect x="14" y="24" width="22" height="14" rx="2" fill="#DA291C"/><text x="25" y="34" text-anchor="middle" font-size="8" fill="#fff" font-family="Barlow Condensed" font-weight="700">TP</text></svg>
        <span class="vs">VS</span>
        <svg viewBox="0 0 110 60"><path d="M4 16h58v32H4zM62 24h24l16 14v10H62z" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2" stroke-dasharray="4 3"/><circle cx="22" cy="50" r="6" fill="#111" stroke="rgba(255,255,255,.55)" stroke-width="2"/><circle cx="84" cy="50" r="6" fill="#111" stroke="rgba(255,255,255,.55)" stroke-width="2"/><text x="33" y="36" text-anchor="middle" font-size="14" fill="rgba(255,255,255,.55)" font-family="Barlow Condensed" font-weight="700">?</text></svg>
      </div>
      <div class="body">
        <h4>“ความไว้ใจมีราคาเท่าไหร่?”</h4>
        <div class="muted small">ประมูลรถแฝด 2 คัน รุ่น ปี ไมล์ใกล้กัน — คันหนึ่งมีพาสปอร์ตครบ อีกคันไม่มี ถ่ายทอดสดบน Truck2Hand ปลาย มิ.ย.</div>
        <div class="row" style="margin-top:12px"><span class="chip red">เร็ว ๆ นี้</span><span class="chip">แจ้งเตือนฉัน</span></div>
      </div>
    </div>
  </div>` };
};

screens.passport = () => {
  const visits = myVisits();
  const v = lastVisit();
  const tab = S.passportTab;
  let body = '';
  if (tab === 'km') {
    const growth = n(v.km - visits[0].km);
    body = `
    <div class="card chart-card">
      <div class="head">
        <div><div class="muted small">เลขไมล์ที่ศูนย์ยืนยัน</div><div class="big">${n(v.km)}<small>กม.</small></div></div>
        <span class="chip ok">${I.check} ขึ้นต่อเนื่อง</span>
      </div>
      ${mileageChart(visits)}
      <div class="muted tiny" style="padding:2px 6px 6px">เส้นประ = ช่วงที่ไม่ได้เข้าศูนย์ · ไมล์ที่ลดลงจะถูกติดธงอัตโนมัติ · +${growth} กม. ตั้งแต่ออกรถ</div>
    </div>
    <div class="card timeline">
      ${visits.slice().reverse().map((x, i, arr) => {
        const prev = arr[i + 1];
        const gap = prev && (tYear(x.date) - tYear(prev.date)) > 1.5;
        return `<div class="tl-item"><span class="dot ${x.special ? '' : 'grey'}"></span><div><div class="t">${x.title}</div><div class="muted small">${fmtDate(x.date)} · ${x.center}</div></div><div class="km">${n(x.km)}</div></div>
        ${gap ? `<div class="gap-note">ไม่มีบันทึกจากศูนย์ ${Math.round((tYear(x.date) - tYear(prev.date)) * 12)} เดือน</div>` : ''}`;
      }).join('')}
    </div>`;
  } else if (tab === 'stamps') {
    const stamps = visits.map((x, i) => `<div class="stamp">${stampSVG(x, i)}</div>`);
    if (S.checked) { stamps.push(`<div class="stamp">${stampSVG(null, 0, { kind: '70', rot: -6 })}</div>`, `<div class="stamp">${stampSVG(null, 0, { kind: 'region', rot: 5 })}</div>`); }
    const empties = (3 - (stamps.length % 3)) % 3 + 3;
    for (let i = 0; i < empties; i++) stamps.push(`<div class="stamp empty">${stampSVG(null, i, { empty: true, ink: '#6B6B72' })}</div>`);
    body = `
    <div class="stamps-grid">${stamps.join('')}</div>
    <div class="card p" style="margin:12px 16px 0">
      <div class="row"><span class="chip red">ตราพิเศษ</span><div class="small muted">ตราปีที่ 70 · ตราประจำภูมิภาค · ตราล้านกิโลเมตร</div></div>
      <div class="small" style="margin-top:8px">ช่างผู้ตรวจประทับตราลงสมุดพาสปอร์ตเล่มจริงและในแอปพร้อมกัน สมุดส่งมอบไปพร้อมกุญแจตอนขาย</div>
    </div>`;
  } else {
    body = `
    <div class="card" style="margin:14px 16px 0">
      ${[['ตรวจ 70 จุด (G-IDSS)', S.checked ? '12 เม.ย. 2570' : '—', S.checked ? 'ผ่าน 61 · ควรดูแล 7 · ต้องแก้ไข 2' : 'ยังไม่เคยตรวจ — รับสิทธิ์ฟรี'],
         ['ยาง 4 เส้น', '12 ส.ค. 2566', 'อะไหล่แท้ตรีเพชร'],
         ['เปลี่ยนแบตเตอรี่', '14 ก.ค. 2565', 'อะไหล่แท้อีซูซุ'],
         ['เปลี่ยนผ้าเบรกหน้า', '19 ม.ค. 2564', 'อะไหล่แท้อีซูซุ'],
         ['เช็กระยะตามคู่มือ', '10 ครั้ง', 'น้ำมันเครื่อง กรอง ของเหลว']]
        .map(([t, d, s]) => `<div class="finding"><span class="sev" style="background:var(--grey-3)"></span><div class="grow"><div class="t">${t}</div><div class="muted small">${s}</div></div><div class="small muted">${d}</div></div>`).join('')}
    </div>
    ${S.checked ? `<div class="btn-stack"><button class="btn btn-ghost" data-go="result">${I.doc} ดูผลตรวจ 70 จุดล่าสุด</button></div>` : ''}`;
  }
  return { tab: 'passport', html: `
  <div class="screen">
    ${topbar('Trust Passport', { back: false, right: `<button class="icon-btn" data-toast="ดาวน์โหลด PDF บันทึกการตรวจแล้ว (ตัวอย่าง)" aria-label="ดาวน์โหลด">${I.down}</button>` })}
    <div class="passport-cover">
      <div class="top">
        <div><div class="tp">TRUST PASSPORT</div><h3>ส่งต่อความไว้ใจ</h3><div class="no">TP-2570-0045210</div></div>
        <div class="emblem">70</div>
      </div>
      <dl>
        <div><dt>รุ่น</dt><dd>D-MAX V-Cross 3.0</dd></div>
        <div><dt>ทะเบียน</dt><dd>กข 4521 ขอนแก่น</dd></div>
        <div><dt>เจ้าของปัจจุบัน</dt><dd>คุณสมชาย ใ.</dd></div>
        <div><dt>ผู้ครอบครอง</dt><dd>คนที่ 1</dd></div>
      </dl>
      <div class="row" style="margin-top:14px"><span class="verified">${I.shield} ข้อมูลจากระบบศูนย์ ${visits.length} ครั้ง</span></div>
      <div class="mrz">TP&lt;THA&lt;DMAX&lt;VCROSS&lt;&lt;MPATFS86JKT0&lt;&lt;&lt;&lt;&lt;${String(v.km).padStart(7, '0')}</div>
    </div>
    <div class="segmented">
      <button class="${tab === 'km' ? 'active' : ''}" data-ptab="km">ไมล์จริง</button>
      <button class="${tab === 'stamps' ? 'active' : ''}" data-ptab="stamps">ตราประทับ</button>
      <button class="${tab === 'history' ? 'active' : ''}" data-ptab="history">ประวัติซ่อม</button>
    </div>
    ${body}
    <div class="btn-stack">
      <button class="btn btn-primary" data-go="transfer">${I.share} ส่งต่อความไว้ใจ</button>
      ${S.checked ? '' : `<button class="btn btn-ghost" data-go="book">${I.calendar} ตรวจ 70 จุดฟรี เพื่อรับตราใหม่</button>`}
    </div>
    ${disclaimer(PASSPORT_NOTE)}
  </div>` };
};

// ---- Booking flow --------------------------------------------------------
screens.book = (step = '1') => {
  const b = S.booking;
  const steps = `<div class="stepper">${[1, 2, 3].map(i => `<i class="${i <= +step ? 'on' : ''}"></i>`).join('')}</div>`;
  if (step === '1') return { tab: 'book', html: `
  <div class="screen">
    ${topbar('จองตรวจ 70 จุดฟรี', { back: false })}
    ${steps}
    <div class="step-label">ขั้นที่ 1 จาก 3 · ตรวจสิทธิ์</div>
    <div class="step-title">รถของคุณได้สิทธิ์<br>ตรวจฟรีและออกพาสปอร์ต</div>
    <div class="card check-list">
      <div class="check-item"><span class="ok">${I.check}</span><div><b>สิ้นสุด Isuzu Smart Protection</b><div class="muted small">มี.ค. 2567</div></div></div>
      <div class="check-item"><span class="ok">${I.check}</span><div><b>ไม่ได้เข้าศูนย์ 12 เดือนขึ้นไป</b><div class="muted small">ครั้งล่าสุด 12 ส.ค. 2566 (44 เดือน)</div></div></div>
      <div class="check-item"><span class="ok no">${I.check}</span><div><b>รถมือสอง</b><div class="muted small">ไม่ใช่ · ไม่จำเป็นต้องครบทุกข้อ</div></div></div>
    </div>
    <div class="benefits">
      <div class="card benefit"><b>70</b><span>จุดตรวจด้วย G-IDSS</span></div>
      <div class="card benefit"><b>20</b><span>นาที รอรับได้เลย</span></div>
      <div class="card benefit"><b>2</b><span>ทางเลือกใบเสนอราคา แท้อีซูซุ / แท้ตรีเพชร</span></div>
      <div class="card benefit"><b>+300</b><span>คะแนน my-MEMBER และตราประทับใหม่</span></div>
    </div>
    <div class="btn-stack"><button class="btn btn-primary" data-go="book/2">เลือกศูนย์และเวลา</button></div>
    ${disclaimer('สิทธิ์ตรวจฟรีสำหรับรถหมดประกัน ขาดการเข้าศูนย์ 12 เดือนขึ้นไป หรือรถมือสอง ผลตรวจบันทึกลงพาสปอร์ตอัตโนมัติ')}
  </div>` };

  if (step === '2') {
    const ready = b.center && b.date && b.slot;
    return { tab: 'book', html: `
    <div class="screen">
      ${topbar('จองตรวจ 70 จุดฟรี')}
      ${steps}
      <div class="step-label">ขั้นที่ 2 จาก 3 · ศูนย์และเวลา</div>
      <div class="step-title">เลือกศูนย์ใกล้คุณ</div>
      <div class="option-list">
        ${CENTERS.map(c => `<button class="option ${b.center === c.id ? 'active' : ''}" data-center="${c.id}"><span class="radio"></span><span class="grow"><span class="t">${c.name}</span><br><span class="muted small">${c.dist} · ${c.note}</span></span></button>`).join('')}
      </div>
      <div class="section-title" style="margin-bottom:0"><h3>วันที่</h3><span class="muted small">เม.ย. 2570</span></div>
      <div class="date-row">
        ${DATES.map(d => `<button class="date ${b.date === d.iso ? 'active' : ''}" data-date="${d.iso}"><small>${TH_DAYS[d.dow]}</small><b>${+d.iso.slice(-2)}</b>${d.hol ? `<span class="hol">${d.hol}</span>` : ''}</button>`).join('')}
      </div>
      <div class="section-title" style="margin-bottom:0"><h3>เวลา</h3><span class="muted small">จำกัดคิวต่อศูนย์ต่อวัน</span></div>
      <div class="slots">
        ${SLOTS.map(([t, full]) => `<button class="slot ${full ? 'full' : ''} ${b.slot === t ? 'active' : ''}" data-slot="${t}">${t}</button>`).join('')}
      </div>
      <div class="btn-stack"><button class="btn btn-primary" data-go="book/3" ${ready ? '' : 'disabled'}>ถัดไป</button></div>
    </div>` };
  }

  if (step === '3') {
    const c = CENTERS.find(x => x.id === b.center) || CENTERS[0];
    return { tab: 'book', html: `
    <div class="screen">
      ${topbar('ยืนยันการจอง')}
      ${steps}
      <div class="step-label">ขั้นที่ 3 จาก 3 · ยืนยัน</div>
      <div class="step-title">ตรวจสอบรายละเอียด</div>
      <div class="card p summary" style="margin:16px 16px 0">
        <dl>
          <dt>รถ</dt><dd>D-MAX · กข 4521</dd>
          <dt>บริการ</dt><dd>ตรวจ 70 จุด (20 นาที)</dd>
          <dt>ศูนย์</dt><dd>${c.name}</dd>
          <dt>วันเวลา</dt><dd>${fmtDate(b.date || DATES[3].iso)} · ${b.slot || '09:30'}</dd>
          <dt>ค่าบริการ</dt><dd style="color:var(--ok)">ฟรี</dd>
        </dl>
      </div>
      <button class="card consent ${b.consent ? 'on' : ''}" data-consent>
        <span class="box">${b.consent ? I.check : ''}</span>
        <span class="small">ยินยอมให้ศูนย์บันทึกเลขไมล์ ผลตรวจ และประวัติซ่อมลง Trust Passport ของรถคันนี้ และส่งผลตรวจทาง LINE (PDPA) <a class="link" href="#" onclick="return false">อ่านนโยบาย</a></span>
      </button>
      <div class="btn-stack"><button class="btn btn-primary" data-confirm-booking ${b.consent ? '' : 'disabled'}>ยืนยันการจอง</button></div>
    </div>` };
  }

  // done
  const c = CENTERS.find(x => x.id === b.center) || CENTERS[0];
  return { tab: 'book', html: `
  <div class="screen">
    ${topbar('จองสำเร็จ', { back: false })}
    <div class="ticket">
      <div class="head"><div class="tag">TRUST CHECK · 70 POINTS</div><h3>${fmtDate(b.date || DATES[3].iso)} · ${b.slot || '09:30'} น.</h3><div class="small" style="opacity:.9">${c.name}</div></div>
      <div class="cut"></div>
      <div class="qr-wrap">${fakeQR(31, 21)}<div class="muted small">แสดง QR นี้ที่เคาน์เตอร์รับรถ</div></div>
    </div>
    <div class="line-msg"><span class="ln">LINE</span><span>ส่งใบนัดและการแจ้งเตือนล่วงหน้า 1 วันไปที่ LINE OA ของคุณแล้ว</span></div>
    <div class="btn-stack">
      <button class="btn btn-dark" data-simulate-check>${I.sparkle} จำลอง: ตรวจเสร็จแล้ว ดูผล</button>
      <button class="btn btn-ghost" data-go="home">กลับหน้าหลัก</button>
    </div>
  </div>` };
};

screens.result = () => {
  const qIsuzu = S.quote === 'isuzu';
  const total = qIsuzu ? 6850 : 4920;
  return { tab: 'passport', html: `
  <div class="screen">
    ${topbar('ผลตรวจ 70 จุด', { right: `<button class="icon-btn" data-toast="ส่ง PDF ผลตรวจไปที่ LINE แล้ว" aria-label="แชร์">${I.share}</button>` })}
    <div class="pad"><div class="muted small">12 เม.ย. 2570 · 152,310 กม. · ${CENTER_KK}</div><div class="small">ช่างผู้ตรวจ: คุณวิทยา ส. · G-IDSS #KK-0412</div></div>
    <div class="card score">
      ${ring(61, 7, 2)}
      <div class="legend" style="flex:1">
        <div><i style="background:var(--ok)"></i>ผ่าน<b>61</b></div>
        <div><i style="background:var(--warn)"></i>ควรดูแล<b>7</b></div>
        <div><i style="background:var(--isuzu-red)"></i>ต้องแก้ไข<b>2</b></div>
      </div>
    </div>
    <div class="section-title"><h3>สิ่งที่พบ</h3><span class="muted small">เรียงตามความสำคัญ</span></div>
    <div class="card" style="margin:0 16px">
      ${FINDINGS.map(f => `<div class="finding"><span class="sev ${f.sev}"></span><div class="grow"><div class="t">${f.t}</div><div class="muted small">${f.d}</div></div>${f.sev === 'red' ? '<span class="chip red">ต้องแก้ไข</span>' : '<span class="chip warn">ควรดูแล</span>'}</div>`).join('')}
    </div>
    <div class="section-title"><h3>ใบเสนอราคา 2 ทางเลือก</h3><span class="muted small">เฉพาะ 2 รายการเร่งด่วน</span></div>
    <div class="quote">
      <button class="option ${qIsuzu ? 'active' : ''}" data-quote="isuzu"><span class="chip dark">อะไหล่แท้อีซูซุ</span><span class="price">฿${n(6850)}</span><span class="muted tiny">รับประกันอะไหล่ 1 ปี</span></button>
      <button class="option ${!qIsuzu ? 'active' : ''}" data-quote="tp"><span class="chip">แท้ตรีเพชร</span><span class="price">฿${n(4920)}</span><span class="muted tiny">คุ้มค่าสำหรับรถอายุ 5 ปี+</span></button>
    </div>
    <div class="card installment">${I.calendar}<span>ผ่อน 0% 6 เดือน</span><span class="spacer"></span><b>฿${n(Math.round(total / 6))}/เดือน</b></div>
    <div class="btn-stack">
      <button class="btn btn-primary" data-toast="นัดซ่อมแล้ว · ศูนย์จะยืนยันทาง LINE">${I.wrench} นัดซ่อม 2 รายการ</button>
      <button class="btn btn-ghost" data-go="passport">ดูพาสปอร์ตที่อัปเดตแล้ว</button>
    </div>
    ${disclaimer('บันทึกการตรวจ ณ วันที่ 12 เม.ย. 2570 และเลขไมล์ 152,310 กม. เท่านั้น ไม่ใช่การรับประกันสภาพรถ')}
  </div>` };
};

// ---- Transfer ------------------------------------------------------------
screens.transfer = (step = '1') => {
  const sh = S.share;
  if (step === '1') return { tab: 'passport', html: `
  <div class="screen">
    ${topbar('ส่งต่อความไว้ใจ')}
    <div class="step-title" style="margin-top:6px">ขายรถ? ให้ผู้ซื้อเห็น<br>ไมล์จริงก่อนจ่ายเงิน</div>
    <div class="pad muted small" style="margin-top:6px">ผู้ซื้อสแกน QR เพื่อดูพาสปอร์ต เมื่อซื้อแล้วพาสปอร์ตย้ายไปบัญชีผู้ซื้อพร้อมสิทธิ์ my-MEMBER</div>
    <div class="card transfer-path">
      <div class="who"><div class="av red">ส</div>คุณ</div>
      <div class="arrow"></div>
      <div class="who"><div class="av" style="background:#111;color:#fff">${I.passport.replace('<svg', '<svg width="22" height="22"')}</div>พาสปอร์ต</div>
      <div class="arrow"></div>
      <div class="who"><div class="av">?</div>ผู้ซื้อ</div>
    </div>
    <div class="section-title"><h3>ข้อมูลที่ผู้ซื้อจะเห็น</h3></div>
    <div class="card" style="margin:0 16px">
      <div class="share-row"><div style="flex:1"><b>ไมล์จริงและประวัติซ่อม</b><div class="muted small">จำเป็นสำหรับการส่งต่อ</div></div><span class="switch on locked"></span></div>
      <div class="share-row"><div style="flex:1"><b>ผลตรวจ 70 จุดล่าสุด</b><div class="muted small">${S.checked ? '12 เม.ย. 2570' : 'ยังไม่มี — ตรวจฟรีได้'}</div></div><button class="switch ${sh.check ? 'on' : ''}" data-share="check" aria-label="สลับ"></button></div>
      <div class="share-row"><div style="flex:1"><b>ชื่อเจ้าของปัจจุบัน</b><div class="muted small">ปิดไว้ ผู้ซื้อจะเห็นเป็น “เจ้าของคนที่ 1”</div></div><button class="switch ${sh.owner ? 'on' : ''}" data-share="owner" aria-label="สลับ"></button></div>
    </div>
    <button class="card consent ${S.transferConsent ? 'on' : ''}" data-tconsent>
      <span class="box">${S.transferConsent ? I.check : ''}</span>
      <span class="small">ฉันยินยอมส่งต่อข้อมูลพาสปอร์ตให้ผู้ที่สแกน QR นี้ภายใน 24 ชั่วโมง (PDPA)</span>
    </button>
    <div class="btn-stack"><button class="btn btn-primary" data-go="transfer/2" ${S.transferConsent ? '' : 'disabled'}>สร้าง QR ส่งต่อ</button></div>
  </div>` };

  if (step === '2') return { tab: 'passport', html: `
  <div class="screen">
    ${topbar('QR ส่งต่อความไว้ใจ')}
    <div class="pad" style="text-align:center"><div class="step-title" style="margin:6px 0 0">ให้ผู้ซื้อสแกน</div><div class="muted small">ด้วยแอป my-ISUZU หรือกล้อง iPhone</div></div>
    <div class="qr-big">${fakeQR(4521, 29)}<div class="center">TP</div></div>
    <div class="countdown">ใช้ได้อีก <b class="num" style="font-size:16px">23:59:41</b> · TP-2570-0045210</div>
    <div class="card p" style="margin:18px 16px 0">
      <div class="row wrap"><span class="chip ok">${I.check} ไมล์จริง</span><span class="chip ok">${I.check} ประวัติซ่อม</span>${sh.check ? `<span class="chip ok">${I.check} ผลตรวจ</span>` : ''}${sh.owner ? '' : `<span class="chip">${I.lock} ซ่อนชื่อ</span>`}</div>
    </div>
    <div class="btn-stack">
      <button class="btn btn-dark" data-go="transfer/3">${I.sparkle} จำลอง: ผู้ซื้อยืนยันรับพาสปอร์ต</button>
      <button class="btn btn-ghost" data-toast="ส่งลิงก์พาสปอร์ตทาง LINE แล้ว">${I.share} ส่งลิงก์ทาง LINE</button>
    </div>
  </div>` };

  return { tab: 'passport', html: `
  <div class="screen">
    ${topbar('ส่งต่อสำเร็จ', { back: false })}
    <div class="success-hero"><div class="ring">${I.check}</div><h3>ส่งต่อความไว้ใจแล้ว</h3><p>พาสปอร์ตย้ายไปยังบัญชีของผู้ซื้อเรียบร้อย</p></div>
    <div class="card transfer-path">
      <div class="who"><div class="av">ส</div>เจ้าของคนที่ 1</div>
      <div class="arrow"></div>
      <div class="who"><div class="av red">ก</div>เจ้าของคนที่ 2</div>
    </div>
    <div class="card" style="margin:12px 16px 0">
      <div class="reward"><span class="ic">${I.user}</span><div class="grow"><b>ผู้ซื้อเข้าระบบอีซูซุทันที</b><div class="muted small">สมัคร my-MEMBER พร้อมคูปองเช็กระยะครั้งแรก</div></div></div>
      <div class="reward"><span class="ic">${I.passport}</span><div class="grow"><b>ประวัติทั้งหมดติดตัวรถไป</b><div class="muted small">${myVisits().length} บันทึก · ไมล์จริงต่อเนื่อง</div></div></div>
      <div class="reward"><span class="ic">${I.gift}</span><div class="grow"><b>คุณได้ +500 คะแนน</b><div class="muted small">ขอบคุณที่ส่งต่อความไว้ใจ</div></div></div>
    </div>
    <div class="btn-stack"><button class="btn btn-primary" data-go="home">กลับหน้าหลัก</button></div>
  </div>` };
};

// ---- Scan (buyer) ---------------------------------------------------------
screens.scan = (which) => {
  if (!which) return { tab: 'scan', dark: true, html: `
  <div class="screen dark">
    ${topbar('สแกนก่อนซื้อ', { back: false, cls: 'on-dark' })}
    <div class="viewfinder">
      <div class="frame"><i></i><i></i><i></i><i></i><div class="line"></div></div>
      <div class="hint">สแกน QR พาสปอร์ตจากผู้ขาย<br>หรือป้าย “มีพาสปอร์ต” บน Truck2Hand</div>
    </div>
    <div class="pad small" style="margin-top:14px;color:rgba(255,255,255,.6)">ตัวอย่างการสแกน (ข้อมูลจำลอง)</div>
    <div class="btn-stack" style="margin-top:10px">
      <button class="btn btn-ghost on-dark" data-go="scan/good">${I.shield} รถมีพาสปอร์ต ไมล์ต่อเนื่อง</button>
      <button class="btn btn-ghost on-dark" data-go="scan/rolled">${I.alert} รถที่ไมล์ผิดปกติ</button>
    </div>
  </div>` };

  const good = which === 'good';
  const car = good ? SELLER_CAR : ROLLED_CAR;
  const last = car.visits[car.visits.length - 1];
  const maxKm = Math.max(...car.visits.map(v => v.km));
  return { tab: 'scan', html: `
  <div class="screen">
    ${topbar('ผลสแกนพาสปอร์ต')}
    <div class="pad"><div style="font-size:20px;font-weight:700">${car.model}</div><div class="muted small">ปี ${car.year} · ${car.plate} · เจ้าของคนที่ 1</div></div>
    ${good ? `
    <div class="verdict good"><span class="ic">${I.shield}</span><div><h4>ไมล์ขึ้นต่อเนื่อง ยืนยัน ${car.visits.length} ครั้ง</h4><p>บันทึกจากศูนย์บริการอีซูซุทุกครั้ง ล่าสุด ${fmtDate(last.date)}</p></div></div>` : `
    <div class="verdict bad"><span class="ic">${I.alert}</span><div><h4>พบเลขไมล์ลดลง 1 ครั้ง</h4><p>${fmtDate(last.date)} บันทึก ${n(last.km)} กม. ต่ำกว่าครั้งก่อน ${n(maxKm - last.km)} กม.</p></div></div>`}
    <div class="card chart-card">${mileageChart(car.visits)}</div>
    <div class="facts">
      <div class="card fact"><b>${n(good ? last.km : maxKm)}</b><span>${good ? 'กม. ล่าสุดที่ยืนยัน' : 'กม. สูงสุดที่เคยบันทึก'}</span></div>
      <div class="card fact"><b>${car.visits.length}</b><span>ครั้งที่เข้าศูนย์</span></div>
      <div class="card fact"><b>${good ? '0' : '1'}</b><span>ธงเตือนไมล์</span></div>
      <div class="card fact"><b>${good ? '58/70' : '—'}</b><span>ผลตรวจล่าสุด</span></div>
    </div>
    ${good ? `
    <div class="value-card">
      <div class="small" style="color:rgba(255,255,255,.7)">ราคาของความไว้ใจ*</div>
      <div class="v">+฿18,000</div>
      <div class="small" style="color:rgba(255,255,255,.7)">ส่วนต่างราคาเฉลี่ยรถมี/ไม่มีพาสปอร์ต บน Truck2Hand · *ตัวเลขตัวอย่าง รอผลจริงจากโครงการนำร่อง</div>
    </div>
    <div class="btn-stack">
      <button class="btn btn-primary" data-toast="ขอรับโอนพาสปอร์ตแล้ว · รอผู้ขายยืนยัน">${I.passport} ขอรับโอนพาสปอร์ตเมื่อซื้อ</button>
      <button class="btn btn-ghost" data-go="book">${I.calendar} นัดตรวจ 70 จุดก่อนซื้อ</button>
    </div>` : `
    <div class="btn-stack">
      <button class="btn btn-primary" data-go="book">${I.calendar} นัดตรวจ 70 จุดก่อนตัดสินใจ</button>
      <button class="btn btn-ghost" data-toast="ส่งรายงานให้ทีมตรวจสอบแล้ว">แจ้งความผิดปกติ</button>
    </div>`}
    ${disclaimer('แสดงเฉพาะบันทึกจากศูนย์บริการอีซูซุที่เจ้าของยินยอมให้แชร์ ไม่ใช่การรับประกันสภาพรถ ข้อมูลรถและราคาเป็นตัวอย่าง')}
  </div>` };
};

// ---- Handover --------------------------------------------------------------
screens.handover = (step) => {
  const h = S.handover;
  if (step === 'done') return { tab: 'home', html: `
  <div class="screen">
    ${topbar('นัดพิธีส่งกุญแจแล้ว', { back: false })}
    <div class="success-hero"><div class="ring red">${I.key}</div><h3>ส่งกุญแจ ส่งความไว้ใจ</h3><p>27 พ.ย. 2570 · 10:00 น. · ${CENTER_KK}</p></div>
    <div class="card" style="margin:16px 16px 0">
      <div class="reward"><span class="ic">${I.wrench}</span><div class="grow"><b>ตรวจ 70 จุดก่อนส่งมอบ</b><div class="muted small">ฟรี สำหรับพิธีส่งต่อ</div></div></div>
      <div class="reward"><span class="ic">${I.passport}</span><div class="grow"><b>เปลี่ยนชื่อในพาสปอร์ต</b><div class="muted small">ตราประทับทั้งหมดของพ่อยังอยู่ครบ</div></div></div>
      <div class="reward"><span class="ic">${I.heart}</span><div class="grow"><b>ร่วมซีรีส์ “ส่งต่อ” (สมัครใจ)</b><div class="muted small">ลูกเล่าเรื่องร่วมกับครีเอเตอร์</div></div></div>
    </div>
    <div class="btn-stack"><button class="btn btn-primary" data-go="home">กลับหน้าหลัก</button></div>
  </div>` };

  return { tab: 'home', html: `
  <div class="screen">
    ${topbar('ส่งกุญแจ ส่งความไว้ใจ')}
    <div class="step-title" style="margin-top:6px">ส่งต่อรถให้รุ่นถัดไป<br>พร้อมเรื่องราวทั้งหมด</div>
    <div class="card generations">
      <div class="gen"><b>พ่อ · คุณสมชาย</b><span>2562–2570 · ${myVisits().length} ตราประทับ</span></div>
      ${I.key}
      <div class="gen"><b>${esc(h.to.split(' ')[0])}</b><span>เจ้าของคนถัดไป</span></div>
    </div>
    <div class="field"><label>ส่งต่อให้</label><input data-hf="to" value="${esc(h.to)}"></div>
    <div class="field"><label>เบอร์โทร (สำหรับรับพาสปอร์ตใน my-ISUZU)</label><input data-hf="phone" value="${esc(h.phone)}" inputmode="tel"></div>
    <div class="field"><label>บันทึกส่งต่อ — เขียนลงหน้าสุดท้ายของพาสปอร์ต</label><textarea data-hf="note">${esc(h.note)}</textarea></div>
    <div class="section-title"><h3>ตัวอย่างหน้าสุดท้าย</h3></div>
    <div class="last-page">
      <div class="hdr">HANDOVER · ส่งต่อความไว้ใจ</div>
      <div class="seal">${stampSVG(null, 0, { kind: '70', rot: 0 })}</div>
      <div class="note" id="note-preview">${esc(h.note)}</div>
      <div class="sig">— ${esc(h.sig)} · ${myVisits().length} ตราประทับ, ${n(lastVisit().km)} กม.</div>
    </div>
    <div class="btn-stack"><button class="btn btn-primary" data-go="handover/done">นัดพิธีที่ศูนย์</button></div>
  </div>` };
};

// ---- Million km ------------------------------------------------------------
screens.million = () => {
  const km = '987420'.padStart(7, '0');
  return { tab: 'home', dark: true, html: `
  <div class="screen dark">
    ${topbar('Million-km Moment', { cls: 'on-dark' })}
    <div class="million-hero">
      <span class="live"><i></i> สดจาก Teletec GPS</span>
      <div class="odo-digits">${km.split('').map((d, i) => `${i === 1 ? '<span class="sep">,</span>' : ''}${i === 4 ? '<span class="sep">,</span>' : ''}<span class="${i === 0 ? '' : ''}">${d}</span>`).join('')}</div>
      <div class="small" style="color:rgba(255,255,255,.7)">ELF NLR 130 · 71-4528 ขอนแก่น · คนขับ: ลุงประยูร</div>
      <div class="progress"><i style="width:98.74%"></i></div>
      <div class="row small" style="justify-content:space-between;color:rgba(255,255,255,.6)"><span>0</span><span class="num" style="font-size:15px;color:#fff">อีก 12,580 กม.</span><span>1,000,000</span></div>
    </div>
    <div class="dark-card">
      <div class="dark-row"><span class="ic">${I.calendar}</span><div><h4>คาดว่าจะครบ ~20 มิ.ย. 2570</h4><p>เฉลี่ย 1,050 กม./วัน จากข้อมูล 90 วันล่าสุด</p></div></div>
      <div class="dark-row"><span class="ic">${I.pin}</span><div><h4>นัดที่จุดพักรถที่ปลอดภัย</h4><p>ประสานผ่านเจ้าของกองรถ ไม่หยุดรถบนถนน</p></div></div>
      <div class="dark-row"><span class="ic">${I.live}</span><div><h4>ทีมศูนย์ขอนแก่นไปเซอร์ไพรส์</h4><p>ประทับตรา “ล้านกิโลเมตร” และถ่ายทอดสด (เมื่อคนขับยินยอม)</p></div></div>
    </div>
    <div class="dark-card" style="display:flex;gap:16px;align-items:center">
      <div style="width:96px;flex:none;opacity:.95">${stampSVG(null, 0, { kind: 'million', rot: -8 })}</div>
      <div><h4>ตราล้านกิโลเมตร</h4><p>ตราพิเศษที่มีเฉพาะรถที่วิ่งครบ 1,000,000 กม. พร้อมที่ยืนในงานครบรอบ 70 ปี 27 พ.ย.</p></div>
    </div>
    <div class="btn-stack"><button class="btn btn-primary" data-toast="ยืนยันการเข้าร่วมแล้ว · เจ้าของกองรถจะได้รับแจ้ง">ยินยอมเข้าร่วม Million-km Moment</button></div>
    ${disclaimer('ข้อมูลรถ คนขับ และตัวเลขเป็นตัวอย่าง นับเฉพาะกิโลเมตรที่ยืนยันที่ศูนย์หรือด้วย Teletec')}
  </div>` };
};

// ---- Trust Odometer ----------------------------------------------------------
screens.odometer = () => ({ tab: 'home', dark: true, html: `
  <div class="screen dark">
    ${topbar('Trust Odometer', { cls: 'on-dark' })}
    <div class="odo-hero">
      <span class="chip red">ISUZU 70 · ทั่วประเทศ</span>
      <div class="big" id="odo-count">2,990,000,000</div>
      <div class="unit">กิโลเมตรที่ตรวจยืนยันแล้วในพาสปอร์ตทุกเล่ม</div>
    </div>
    <div class="sun-orbit">
      <svg viewBox="0 0 340 120">
        <circle cx="300" cy="60" r="26" fill="#F5B301"/><circle cx="300" cy="60" r="34" fill="none" stroke="rgba(245,179,1,.25)" stroke-width="6"/>
        <circle cx="34" cy="60" r="9" fill="#3D7BD9"/>
        ${Array.from({ length: 10 }, (_, i) => `<path d="M44 ${60 - i * 0.2} Q170 ${12 + i * 4} 272 60" fill="none" stroke="rgba(218,41,28,${.25 + i * .07})" stroke-width="1.5"/><path d="M272 60 Q170 ${108 - i * 4} 44 ${60 + i * 0.2}" fill="none" stroke="rgba(218,41,28,${.25 + i * .07})" stroke-width="1.5"/>`).join('')}
        <text x="34" y="88" text-anchor="middle" fill="rgba(255,255,255,.7)" font-size="11" font-family="IBM Plex Sans Thai">โลก</text>
        <text x="300" y="108" text-anchor="middle" fill="rgba(255,255,255,.7)" font-size="11" font-family="IBM Plex Sans Thai">ดวงอาทิตย์</text>
      </svg>
      <div style="text-align:center;margin-top:6px"><b>≈ ไป-กลับดวงอาทิตย์ 10 รอบ</b><div class="small" style="color:rgba(255,255,255,.6)">ระยะทางจากโครงการนำร่อง การตรวจทั่วประเทศจะเพิ่มต่อทุกวัน</div></div>
    </div>
    <div class="dark-card">
      <h4 style="margin-bottom:12px">แยกตามภูมิภาค (ล้าน กม.)</h4>
      <div class="bars">
        ${[['อีสาน', 1120], ['ตะวันออก', 860], ['กลาง', 480], ['เหนือ', 320], ['ใต้', 210]].map(([r, v]) => `<div class="bar-row"><span>${r}</span><span class="track"><i style="width:${v / 1120 * 100}%"></i></span><b>${n(v)}</b></div>`).join('')}
      </div>
    </div>
    <div class="dark-card dark-row" style="display:flex">
      <span class="ic">${I.passport}</span>
      <div style="flex:1"><h4>รถของคุณร่วมด้วย ${n(lastVisit().km)} กม.</h4><p>แสดงเฉพาะยอดรวม ไม่แสดงข้อมูลส่วนบุคคล</p></div>
    </div>
    <div class="btn-stack"><button class="btn btn-primary" data-toast="สร้างการ์ดแชร์แล้ว (สมัครใจ)">${I.share} แชร์การ์ดของรถฉัน</button></div>
  </div>` });

// ---- Rewards -------------------------------------------------------------
screens.rewards = () => ({ tab: 'rewards', html: `
  <div class="screen">
    ${topbar('สิทธิ์ของฉัน', { back: false })}
    <div class="member-card">
      <div class="small" style="opacity:.85">my-MEMBER · Trusted Buddy</div>
      <div class="pts">${n(S.points)}</div>
      <div class="small" style="opacity:.85">คะแนนสะสม · ใช้ได้ที่ศูนย์บริการทั่วประเทศ</div>
    </div>
    <div class="section-title"><h3>วิธีรับคะแนนจากพาสปอร์ต</h3></div>
    <div class="card" style="margin:0 16px">
      <div class="reward"><span class="ic">${I.wrench}</span><div class="grow"><b>ตรวจ 70 จุดและรับตราประทับ</b><div class="muted small">ทุกครั้งที่เข้าศูนย์</div></div><span class="cost">+300</span></div>
      <div class="reward"><span class="ic">${I.share}</span><div class="grow"><b>ส่งต่อพาสปอร์ตตอนขายรถ</b><div class="muted small">ผู้ซื้อได้สิทธิ์ my-MEMBER ด้วย</div></div><span class="cost">+500</span></div>
      <div class="reward"><span class="ic">${I.user}</span><div class="grow"><b>จองตรวจรถของบ้านให้พ่อแม่</b><div class="muted small">คนรุ่นใหม่จองผ่าน LINE ได้คะแนนเอง</div></div><span class="cost">+200</span></div>
    </div>
    <div class="section-title"><h3>แลกคะแนน</h3></div>
    <div class="card" style="margin:0 16px">
      <div class="reward"><span class="ic">${I.fuel}</span><div class="grow"><b>ส่วนลดเปลี่ยนน้ำมันเครื่อง</b><div class="muted small">อะไหล่แท้อีซูซุ</div></div><span class="cost">800</span></div>
      <div class="reward"><span class="ic">${I.coffee}</span><div class="grow"><b>เครื่องดื่มที่เลานจ์ศูนย์</b><div class="muted small">ระหว่างรอตรวจ 20 นาที</div></div><span class="cost">120</span></div>
      <div class="reward"><span class="ic">${I.passport}</span><div class="grow"><b>ปกสมุดพาสปอร์ตหนัง ฉลอง 70 ปี</b><div class="muted small">จำนวนจำกัด</div></div><span class="cost">1,500</span></div>
    </div>
  </div>` });

// ---------------------------------------------------------------------------
// Router & rendering
// ---------------------------------------------------------------------------
const app = document.getElementById('app');
const statusbar = document.querySelector('.device-statusbar');

function route() {
  const hash = location.hash.replace(/^#\/?/, '') || 'home';
  const [name, arg] = hash.split('/');
  const fn = screens[name] || screens.home;
  if (name === 'result' && !S.checked) S.checked = true;
  if (name === 'transfer' && arg === '3' && !S._transferred) { S._transferred = true; S.points += 500; }
  const { html, tab, dark } = fn(arg);
  app.innerHTML = html + tabbar(tab) + '<div class="toast" id="toast"></div>';
  const scr = app.querySelector('.screen');
  scr.classList.add('enter');
  if (statusbar) statusbar.classList.toggle('on-dark', !!dark);
  document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#0E0E10' : '#FFFFFF');
  if (name === 'result' && S._justChecked) { S._justChecked = false; showStampOverlay(); }
  if (name === 'odometer') animateOdo();
}

function go(path) { location.hash = '#/' + path; }

let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

function rerender(keepScroll = true) {
  const y = app.querySelector('.screen')?.scrollTop || 0;
  route();
  const scr = app.querySelector('.screen');
  scr.classList.remove('enter');
  if (keepScroll) scr.scrollTop = y;
}

function showStampOverlay() {
  const el = document.createElement('div');
  el.className = 'stamp-overlay';
  el.innerHTML = `<div class="paper">${stampSVG(CHECK_VISIT, 0, { rot: 0 })}</div>
    <h3>ประทับตราลงพาสปอร์ตแล้ว</h3>
    <p>ไมล์ 152,310 กม. ยืนยันโดยศูนย์ · ได้ตราพิเศษปีที่ 70 และ +300 คะแนน</p>
    <button class="btn btn-primary">ดูผลตรวจ</button>`;
  el.querySelector('button').addEventListener('click', () => el.remove());
  app.appendChild(el);
}

function animateOdo() {
  const el = document.getElementById('odo-count');
  if (!el) return;
  const start = 2990000000, t0 = performance.now();
  const tick = (t) => {
    if (!document.body.contains(el)) return;
    el.textContent = n(Math.floor(start + (t - t0) * 0.85));
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

app.addEventListener('click', (e) => {
  const t = e.target.closest('button, a');
  if (!t) return;
  const d = t.dataset;
  if ('back' in d) { history.length > 1 ? history.back() : go('home'); return; }
  if (d.go) { go(d.go); return; }
  if (d.toast) { toast(d.toast); return; }
  if (d.vehicle) { S.vehicle = d.vehicle; rerender(); return; }
  if (d.ptab) { S.passportTab = d.ptab; rerender(); return; }
  if (d.center) { S.booking.center = d.center; rerender(); return; }
  if (d.date) { S.booking.date = d.date; rerender(); return; }
  if (d.slot) { S.booking.slot = d.slot; rerender(); return; }
  if ('consent' in d) { S.booking.consent = !S.booking.consent; rerender(); return; }
  if ('confirmBooking' in d) { go('book/done'); return; }
  if ('simulateCheck' in d) { S.checked = true; S.points += 300; S._justChecked = true; go('result'); return; }
  if (d.quote) { S.quote = d.quote; rerender(); return; }
  if (d.share) { S.share[d.share] = !S.share[d.share]; rerender(); return; }
  if ('tconsent' in d) { S.transferConsent = !S.transferConsent; rerender(); return; }
});

app.addEventListener('input', (e) => {
  const k = e.target.dataset.hf;
  if (!k) return;
  S.handover[k] = e.target.value;
  if (k === 'note') { const p = document.getElementById('note-preview'); if (p) p.textContent = e.target.value; }
});

window.addEventListener('hashchange', route);
route();
})();
