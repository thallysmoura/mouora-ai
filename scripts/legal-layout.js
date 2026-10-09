// Layout das páginas legais: remove "última atualização" e sumário lateral; numera as seções com destaque.
const fs = require("fs");
for (const f of ["pt_privacy", "pt_terms", "x_privacy", "x_terms", "x_es_privacy", "x_es_terms"]) {
  const p = `content/${f}.html`;
  let s = fs.readFileSync(p, "utf8");
  s = s.replace(/<p class="terms-updated">[\s\S]*?<\/p>/, "");
  s = s.replace(/<aside class="terms-summary legal-contents">[\s\S]*?<\/aside>/, "");
  if (!s.includes("lg-num")) s = s.replace(/<h2>(\d+)\.\s*/g, '<h2><span class="lg-num">$1</span>');
  fs.writeFileSync(p, s);
  console.log(f, s.includes("terms-summary"), s.includes("terms-updated"), (s.match(/lg-num/g) || []).length);
}
