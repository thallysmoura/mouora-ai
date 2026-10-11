import bcrypt from "bcryptjs";

export const BCRYPT_COST = 12;

/** bcrypt só considera os 72 primeiros bytes da senha. */
export const passwordTooLong = (p: string) => Buffer.byteLength(p, "utf8") > 72;

export const hashPassword = (p: string) => bcrypt.hash(p, BCRYPT_COST);

let dummy: string | undefined;
/** Compara a senha em tempo constante também quando o usuário não existe (evita descobrir e-mails pelo tempo de resposta). */
export async function checkPassword(p: string, hash?: string) {
  dummy ??= bcrypt.hashSync("senha-ficticia-mouora", BCRYPT_COST);
  const ok = await bcrypt.compare(p, hash ?? dummy);
  return !!hash && ok;
}

/** Hash gerado com custo antigo? Então vale regravar com o custo atual após um login correto. */
export const needsRehash = (hash: string) => bcrypt.getRounds(hash) < BCRYPT_COST;
