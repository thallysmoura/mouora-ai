// Gera o fundo vetorial (SVG) do banner "Faça parte" da página /sobre.
const fs = require("fs");
let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const W = 963, H = 217;

// curva do limbo do planeta (quadrática)
const P0 = [380, H + 12], P1 = [730, 100], P2 = [W + 10, 18];
const bez = (t) => [
  (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0],
  (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1],
];
const rimY = (x) => { let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (bez(m)[0] < x) lo = m; else hi = m; } return bez(lo)[1]; };

let dots = "", glows = "", lines = "";
const nodes = [];
for (let i = 0; i < 230; i++) {
  const x = 540 + Math.pow(rnd(), 0.7) * (W - 540);
  const ry = rimY(x);
  const y = ry + 6 + Math.pow(rnd(), 1.6) * (H - ry - 6);
  if (y > H - 2) continue;
  const r = 0.45 + rnd() * 1.0, o = 0.25 + rnd() * 0.6;
  const k = rnd();
  const c = k < 0.2 ? "#ffd9a0" : k < 0.6 ? "#ffa24a" : "#ff8a30";
  dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${c}" opacity="${o.toFixed(2)}"/>`;
  if (rnd() < 0.1) nodes.push([x, y]);
}
for (let i = 0; i < 10; i++) {
  const x = 560 + rnd() * (W - 580);
  const y = rimY(x) + 14 + rnd() * (H - rimY(x) - 20);
  if (y > H - 6) continue;
  nodes.push([x, y]);
  glows += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(10 + rnd() * 20).toFixed(0)}" fill="url(#bokeh)" opacity="${(0.25 + rnd() * 0.4).toFixed(2)}"/>`;
}
nodes.sort((a, b) => a[0] - b[0]);
for (let i = 0; i < nodes.length - 1; i++) {
  const a = nodes[i], b = nodes[Math.min(nodes.length - 1, i + 1 + Math.floor(rnd() * 3))];
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - 20 - rnd() * 30;
  lines += `<path d="M${a[0].toFixed(1)} ${a[1].toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}"/>`;
}

const rim = `M${P0[0]} ${P0[1]} Q${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`;
const planet = `${rim} L${W} ${H} L${P0[0]} ${H} Z`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMaxYMid slice">
<defs>
 <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#150d0a"/><stop offset=".55" stop-color="#120b09"/><stop offset="1" stop-color="#1c0f08"/></linearGradient>
 <radialGradient id="sun" cx="0.94" cy="0.02" r="0.58"><stop offset="0" stop-color="#ffe3a6" stop-opacity="1"/><stop offset=".12" stop-color="#ffb255" stop-opacity=".95"/><stop offset=".38" stop-color="#ff7a1f" stop-opacity=".55"/><stop offset="1" stop-color="#ff6a10" stop-opacity="0"/></radialGradient>
 <radialGradient id="haze" cx="0.78" cy="0.12" r="0.7"><stop offset="0" stop-color="#ff8a2a" stop-opacity=".45"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient>
 <linearGradient id="planetG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a1409" stop-opacity=".55"/><stop offset=".5" stop-color="#1d0f08" stop-opacity=".9"/><stop offset="1" stop-color="#2b1306" stop-opacity=".85"/></linearGradient>
 <linearGradient id="rimG" gradientUnits="userSpaceOnUse" x1="380" y1="0" x2="${W}" y2="0"><stop offset="0" stop-color="#ffb070" stop-opacity="0"/><stop offset=".35" stop-color="#ff9f55" stop-opacity=".55"/><stop offset=".75" stop-color="#ffc98a" stop-opacity=".95"/><stop offset="1" stop-color="#fff0cf" stop-opacity="1"/></linearGradient>
 <radialGradient id="bokeh"><stop offset="0" stop-color="#ffb468" stop-opacity=".9"/><stop offset="1" stop-color="#ff8a30" stop-opacity="0"/></radialGradient>
 <filter id="b6" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="6"/></filter>
 <filter id="b16" x="-20%" y="-100%" width="140%" height="300%"><feGaussianBlur stdDeviation="16"/></filter>
 <filter id="b1"><feGaussianBlur stdDeviation="1"/></filter>
 <clipPath id="pc"><path d="${planet}"/></clipPath>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#haze)"/>
<rect width="${W}" height="${H}" fill="url(#sun)"/>
<path d="${planet}" fill="url(#planetG)"/>
<g clip-path="url(#pc)">
  <path d="${rim}" fill="none" stroke="#ff8a2a" stroke-width="30" opacity=".35" filter="url(#b16)"/>
  <g fill="none" stroke="#ffb070" stroke-width=".6" opacity=".32">${lines}</g>
  ${glows}
  <g>${dots}</g>
</g>
<path d="${rim}" fill="none" stroke="url(#rimG)" stroke-width="9" opacity=".55" filter="url(#b6)"/>
<path d="${rim}" fill="none" stroke="url(#rimG)" stroke-width="1.6"/>
<path d="${rim}" fill="none" stroke="url(#rimG)" stroke-width="3.2" opacity=".35" filter="url(#b1)" transform="translate(0 2.5)"/>
</svg>`;
fs.writeFileSync("public/assets/about2-join.svg", svg);
console.log("svg", svg.length, "bytes");
