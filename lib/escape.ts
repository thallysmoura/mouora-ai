/** Escapa texto para inserção segura em HTML (conteúdo e atributos). */
export const escapeHtml = (s: string) =>
  s.replace(/[&<>"'`]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" })[c]!);
