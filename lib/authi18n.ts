// Textos das telas de login, cadastro e recuperação de senha (PT, EN, ES).
export type Lang = "pt" | "en" | "es";
export const LANGS: Lang[] = ["pt", "en", "es"];

/** Idioma vindo de ?lang= ou do corpo da requisição; padrão pt. */
export const pickLang = (v: unknown): Lang => (v === "en" || v === "es" || v === "pt" ? v : "pt");
export const homePath = (l: Lang) => (l === "en" ? "/" : `/${l}`);
export const legalPath = (l: Lang, slug: "terms" | "privacy") => (l === "en" ? `/${slug}` : `/${l}/${slug}`);

const pt = {
  brandAria: "MOUORA AI — Voltar ao início",
  // login
  loginTitle: "Entrar — Mouora AI", loginMh1: "Seu trabalho,", loginMh2: "seus resultados.", loginMlead: "Organize seus projetos e acompanhe seus ganhos em um só lugar.",
  loginH1a: "Centralize seus projetos e transforme", loginH1b: "horas em resultados.", loginLead: "Organize entregas, registre atividades e acompanhe seus ganhos em um só lugar.",
  loginF1: "Projetos organizados", loginF2: "Horas registradas", loginF3: "Ganhos visíveis",
  enter: "Entrar", loginSub: "Acesse sua conta para continuar.", forgot: "Esqueceu a senha?", remember: "Lembrar de mim neste dispositivo",
  noAccount: "Ainda não tem conta?", createAccount: "Criar conta",
  // cadastro
  regTitle: "Criar conta — Mouora AI", regMh1: "Crie sua conta,", regMh2: "comece a ganhar.", regMlead: "Cadastre-se grátis, grave tarefas com o celular e receba pelas horas aprovadas.",
  regH1a: "Comece em poucos minutos e", regH1b: "seja recompensado.", regLead: "Crie sua conta, grave tarefas do seu dia a dia com o celular e receba pelas horas aprovadas.",
  regF1: "Cadastro gratuito", regF2: "Com o seu celular", regF3: "No seu ritmo", haveAccount: "Já tenho conta", regSub: "Preencha seus dados para começar.",
  nameLabel: "Nome completo", namePh: "Ex.: Ana Silva", emailLabel: "E-mail", emailPh: "seu@email.com", passLabel: "Crie uma senha", passPh: "Mínimo de 8 caracteres",
  confirmLabel: "Confirme a senha", confirmPh: "Repita a senha", termsPre: "Li e aceito os", terms: "termos de uso", termsAnd: "e a", privacy: "política de privacidade",
  hasAccount: "Já tem uma conta?",
  // recuperar senha
  forgotTitle: "Redefinir senha — Mouora AI", fgMh1: "Recupere seu", fgMh2: "acesso.", fgMlead: "Enviaremos um código de 6 dígitos para o seu e-mail.",
  fgH1a: "Recupere seu acesso com", fgH1b: "segurança.", fgLead: "Enviaremos um código de 6 dígitos para o seu e-mail. Ele vale por 15 minutos.",
  fgF1: "Código enviado ao seu e-mail", fgF2: "Crie uma nova senha", fgF3: "Acesso protegido", fgFormTitle: "Esqueceu a senha?",
  fgSub: "Informe o e-mail da sua conta para receber o código.", remembered: "Lembrou a senha?",
  // campos
  password: "Senha", showPass: "Mostrar senha", hidePass: "Ocultar senha", passRules: "Requisitos da senha", met: "atendido", pending: "pendente",
  honeypot: "Não preencha este campo",
  // regras
  r1: "Mínimo de 8 caracteres", r2: "Uma letra maiúscula (A-Z)", r3: "Uma letra minúscula (a-z)", r4: "Um número (0-9)", r5: "Um caractere especial (! @ # $ % & * ...)",
  // validação
  vNameEmpty: "Informe seu nome completo.", vNameHidden: "O nome contém caracteres inválidos.", vNameShort: "O nome deve ter pelo menos 2 letras.", vNameLong: "O nome deve ter no máximo 120 caracteres.",
  vNameChars: "Use apenas letras, espaços, hífen, apóstrofo e ponto no nome.",
  vEmailEmpty: "Informe seu e-mail.", vEmailLong: "E-mail longo demais.", vEmailBad: "Informe um e-mail válido, como nome@email.com.",
  vPassEmpty: "Crie uma senha.", vPassLong: "A senha deve ter no máximo 72 caracteres.", vPassBad: "A senha contém caracteres inválidos.", vPassSpace: "A senha não pode começar nem terminar com espaço.",
  vPassNeeds: "A senha precisa de:", vPassRepeat: "Escolha uma senha menos repetitiva.", vPassEasy: "Senha fácil de adivinhar. Escolha outra.",
  vConfirmEmpty: "Confirme a senha.", vConfirmDiff: "As senhas não coincidem.", vTerms: "Aceite os termos de uso e a política de privacidade para continuar.",
  // formulário
  fixFields: "Corrija os campos destacados para continuar.", failGeneric: "Não foi possível concluir. Tente novamente.", failConn: "Falha de conexão. Tente novamente.", failShort: "Não foi possível concluir.", failConnShort: "Falha de conexão.",
  // verificação de cadastro
  vcIntro: "Enviamos um código de 6 dígitos para o seu e-mail. Confira também o spam.", vcSentTo: "Código enviado para", vcLabel: "Código de verificação", vcConfirm: "Confirmar e entrar", vcNew: "Novo código enviado.",
  resendIn: "Reenviar código em", resend: "Reenviar código",
  // recuperar fluxo
  fgEmail: "E-mail", sendCode: "Enviar código", fgSendFail: "Não foi possível enviar o código.", fgThrottled: "Um código foi enviado há pouco e continua válido por 15 minutos. Para pedir outro, aguarde", fgSent: "Se este e-mail estiver cadastrado, enviamos o código. Confira também o spam e a aba Promoções.",
  fgVerifyFail: "Não foi possível validar o código.", fgMismatch: "As senhas não coincidem.", fgResetFail: "Não foi possível redefinir a senha.",
  enterCode: "Digite o código", codeSent6: "Enviamos um código de 6 dígitos para", confirmCode: "Confirmar código", close: "Fechar", digit: "Dígito", didntGet: "Não recebeu o código?",
  codeConfirmed: "Código confirmado para", newPassNow: "Agora crie sua nova senha.", newPass: "Nova senha", confirmNew: "Confirme a nova senha", repeat: "Repita a senha", saveNew: "Salvar nova senha",
  // API
  eBot: "Não foi possível confirmar que você é uma pessoa. Atualize a página e tente novamente.", eSuspended: "Sua conta está suspensa. Entre em contato com o suporte.", eInvalidCreds: "E-mail ou senha incorretos.", eTooMany: "Muitas tentativas. Aguarde um pouco e tente novamente.", eBadRequest: "Requisição inválida.", eEmailTaken: "E-mail já cadastrado.", eEmailTakenField: "E-mail já cadastrado. Use outro ou faça login.",
  eMailFail: "Não foi possível enviar o e-mail de verificação. Tente novamente em instantes.", eNotFound: "Cadastro não encontrado ou já verificado.", eWait: "Aguarde cerca de 1 minuto para pedir um novo código.", eResendFail: "Falha ao reenviar o e-mail.",
  eCodeExpired: "Código expirado ou tentativas esgotadas. Peça um novo código.", eCodeWrong: "Código incorreto.", eCode6: "Informe o código de 6 dígitos.", eSession: "Sessão de redefinição expirada. Peça um novo código.", eEmailValid: "Informe um e-mail válido.",
} as const;

type Dict = Record<keyof typeof pt, string>;

const en: Dict = {
  brandAria: "MOUORA AI — Back to home",
  loginTitle: "Log in — Mouora AI", loginMh1: "Your work,", loginMh2: "your results.", loginMlead: "Organize your projects and track your earnings in one place.",
  loginH1a: "Centralize your projects and turn", loginH1b: "hours into results.", loginLead: "Organize deliveries, log activities and track your earnings in one place.",
  loginF1: "Organized projects", loginF2: "Logged hours", loginF3: "Visible earnings",
  enter: "Log in", loginSub: "Sign in to your account to continue.", forgot: "Forgot your password?", remember: "Remember me on this device",
  noAccount: "Don't have an account yet?", createAccount: "Create account",
  regTitle: "Create account — Mouora AI", regMh1: "Create your account,", regMh2: "start earning.", regMlead: "Sign up for free, record tasks with your phone and get paid for approved hours.",
  regH1a: "Get started in minutes and", regH1b: "get rewarded.", regLead: "Create your account, record everyday tasks with your phone and get paid for approved hours.",
  regF1: "Free sign-up", regF2: "With your phone", regF3: "At your own pace", haveAccount: "I already have an account", regSub: "Fill in your details to get started.",
  nameLabel: "Full name", namePh: "E.g.: Jane Smith", emailLabel: "Email", emailPh: "you@email.com", passLabel: "Create a password", passPh: "At least 8 characters",
  confirmLabel: "Confirm password", confirmPh: "Repeat the password", termsPre: "I have read and accept the", terms: "terms of use", termsAnd: "and the", privacy: "privacy policy",
  hasAccount: "Already have an account?",
  forgotTitle: "Reset password — Mouora AI", fgMh1: "Recover your", fgMh2: "access.", fgMlead: "We'll send a 6-digit code to your email.",
  fgH1a: "Recover your access", fgH1b: "securely.", fgLead: "We'll send a 6-digit code to your email. It is valid for 15 minutes.",
  fgF1: "Code sent to your email", fgF2: "Create a new password", fgF3: "Protected access", fgFormTitle: "Forgot your password?",
  fgSub: "Enter your account email to receive the code.", remembered: "Remembered your password?",
  password: "Password", showPass: "Show password", hidePass: "Hide password", passRules: "Password requirements", met: "met", pending: "pending",
  honeypot: "Do not fill in this field",
  r1: "At least 8 characters", r2: "One uppercase letter (A-Z)", r3: "One lowercase letter (a-z)", r4: "One number (0-9)", r5: "One special character (! @ # $ % & * ...)",
  vNameEmpty: "Enter your full name.", vNameHidden: "The name contains invalid characters.", vNameShort: "The name must have at least 2 letters.", vNameLong: "The name must have at most 120 characters.",
  vNameChars: "Use only letters, spaces, hyphens, apostrophes and periods in the name.",
  vEmailEmpty: "Enter your email.", vEmailLong: "Email is too long.", vEmailBad: "Enter a valid email, like name@email.com.",
  vPassEmpty: "Create a password.", vPassLong: "The password must have at most 72 characters.", vPassBad: "The password contains invalid characters.", vPassSpace: "The password cannot start or end with a space.",
  vPassNeeds: "The password needs:", vPassRepeat: "Choose a less repetitive password.", vPassEasy: "Easy-to-guess password. Choose another.",
  vConfirmEmpty: "Confirm the password.", vConfirmDiff: "Passwords do not match.", vTerms: "Accept the terms of use and privacy policy to continue.",
  fixFields: "Fix the highlighted fields to continue.", failGeneric: "Could not complete. Please try again.", failConn: "Connection failed. Please try again.", failShort: "Could not complete.", failConnShort: "Connection failed.",
  vcIntro: "We sent a 6-digit code to your email. Check your spam folder too.", vcSentTo: "Code sent to", vcLabel: "Verification code", vcConfirm: "Confirm and sign in", vcNew: "New code sent.",
  resendIn: "Resend code in", resend: "Resend code",
  fgEmail: "Email", sendCode: "Send code", fgSendFail: "Could not send the code.", fgThrottled: "A code was sent a moment ago and is still valid for 15 minutes. To request another, wait", fgSent: "If this email is registered, we sent the code. Also check your spam and Promotions tab.",
  fgVerifyFail: "Could not validate the code.", fgMismatch: "Passwords do not match.", fgResetFail: "Could not reset the password.",
  enterCode: "Enter the code", codeSent6: "We sent a 6-digit code to", confirmCode: "Confirm code", close: "Close", digit: "Digit", didntGet: "Didn't get the code?",
  codeConfirmed: "Code confirmed for", newPassNow: "Now create your new password.", newPass: "New password", confirmNew: "Confirm the new password", repeat: "Repeat the password", saveNew: "Save new password",
  eBot: "We could not verify that you are human. Refresh the page and try again.", eSuspended: "Your account is suspended. Please contact support.", eInvalidCreds: "Incorrect email or password.", eTooMany: "Too many attempts. Please wait a moment and try again.", eBadRequest: "Invalid request.", eEmailTaken: "Email already registered.", eEmailTakenField: "Email already registered. Use another one or log in.",
  eMailFail: "Could not send the verification email. Please try again shortly.", eNotFound: "Registration not found or already verified.", eWait: "Please wait about 1 minute to request a new code.", eResendFail: "Failed to resend the email.",
  eCodeExpired: "Code expired or attempts exhausted. Request a new code.", eCodeWrong: "Incorrect code.", eCode6: "Enter the 6-digit code.", eSession: "Reset session expired. Request a new code.", eEmailValid: "Enter a valid email.",
};

const es: Dict = {
  brandAria: "MOUORA AI — Volver al inicio",
  loginTitle: "Entrar — Mouora AI", loginMh1: "Tu trabajo,", loginMh2: "tus resultados.", loginMlead: "Organiza tus proyectos y sigue tus ganancias en un solo lugar.",
  loginH1a: "Centraliza tus proyectos y convierte", loginH1b: "horas en resultados.", loginLead: "Organiza entregas, registra actividades y sigue tus ganancias en un solo lugar.",
  loginF1: "Proyectos organizados", loginF2: "Horas registradas", loginF3: "Ganancias visibles",
  enter: "Entrar", loginSub: "Accede a tu cuenta para continuar.", forgot: "¿Olvidaste tu contraseña?", remember: "Recordarme en este dispositivo",
  noAccount: "¿Aún no tienes cuenta?", createAccount: "Crear cuenta",
  regTitle: "Crear cuenta — Mouora AI", regMh1: "Crea tu cuenta,", regMh2: "empieza a ganar.", regMlead: "Regístrate gratis, graba tareas con el celular y recibe pago por las horas aprobadas.",
  regH1a: "Empieza en pocos minutos y", regH1b: "sé recompensado.", regLead: "Crea tu cuenta, graba tareas de tu día a día con el celular y recibe pago por las horas aprobadas.",
  regF1: "Registro gratuito", regF2: "Con tu celular", regF3: "A tu ritmo", haveAccount: "Ya tengo cuenta", regSub: "Completa tus datos para empezar.",
  nameLabel: "Nombre completo", namePh: "Ej.: Ana Silva", emailLabel: "Correo electrónico", emailPh: "tu@email.com", passLabel: "Crea una contraseña", passPh: "Mínimo 8 caracteres",
  confirmLabel: "Confirma la contraseña", confirmPh: "Repite la contraseña", termsPre: "He leído y acepto los", terms: "términos de uso", termsAnd: "y la", privacy: "política de privacidad",
  hasAccount: "¿Ya tienes una cuenta?",
  forgotTitle: "Restablecer contraseña — Mouora AI", fgMh1: "Recupera tu", fgMh2: "acceso.", fgMlead: "Enviaremos un código de 6 dígitos a tu correo.",
  fgH1a: "Recupera tu acceso con", fgH1b: "seguridad.", fgLead: "Enviaremos un código de 6 dígitos a tu correo. Es válido por 15 minutos.",
  fgF1: "Código enviado a tu correo", fgF2: "Crea una nueva contraseña", fgF3: "Acceso protegido", fgFormTitle: "¿Olvidaste tu contraseña?",
  fgSub: "Ingresa el correo de tu cuenta para recibir el código.", remembered: "¿Recordaste la contraseña?",
  password: "Contraseña", showPass: "Mostrar contraseña", hidePass: "Ocultar contraseña", passRules: "Requisitos de la contraseña", met: "cumplido", pending: "pendiente",
  honeypot: "No rellenes este campo",
  r1: "Mínimo 8 caracteres", r2: "Una letra mayúscula (A-Z)", r3: "Una letra minúscula (a-z)", r4: "Un número (0-9)", r5: "Un carácter especial (! @ # $ % & * ...)",
  vNameEmpty: "Ingresa tu nombre completo.", vNameHidden: "El nombre contiene caracteres inválidos.", vNameShort: "El nombre debe tener al menos 2 letras.", vNameLong: "El nombre debe tener como máximo 120 caracteres.",
  vNameChars: "Usa solo letras, espacios, guion, apóstrofo y punto en el nombre.",
  vEmailEmpty: "Ingresa tu correo.", vEmailLong: "Correo demasiado largo.", vEmailBad: "Ingresa un correo válido, como nombre@email.com.",
  vPassEmpty: "Crea una contraseña.", vPassLong: "La contraseña debe tener como máximo 72 caracteres.", vPassBad: "La contraseña contiene caracteres inválidos.", vPassSpace: "La contraseña no puede empezar ni terminar con espacio.",
  vPassNeeds: "La contraseña necesita:", vPassRepeat: "Elige una contraseña menos repetitiva.", vPassEasy: "Contraseña fácil de adivinar. Elige otra.",
  vConfirmEmpty: "Confirma la contraseña.", vConfirmDiff: "Las contraseñas no coinciden.", vTerms: "Acepta los términos de uso y la política de privacidad para continuar.",
  fixFields: "Corrige los campos resaltados para continuar.", failGeneric: "No fue posible completar. Inténtalo de nuevo.", failConn: "Fallo de conexión. Inténtalo de nuevo.", failShort: "No fue posible completar.", failConnShort: "Fallo de conexión.",
  vcIntro: "Enviamos un código de 6 dígitos a tu correo. Revisa también el spam.", vcSentTo: "Código enviado a", vcLabel: "Código de verificación", vcConfirm: "Confirmar y entrar", vcNew: "Nuevo código enviado.",
  resendIn: "Reenviar código en", resend: "Reenviar código",
  fgEmail: "Correo electrónico", sendCode: "Enviar código", fgSendFail: "No fue posible enviar el código.", fgThrottled: "Se envió un código hace poco y sigue válido por 15 minutos. Para pedir otro, espera", fgSent: "Si este correo está registrado, enviamos el código. Revisa también el spam y la pestaña Promociones.",
  fgVerifyFail: "No fue posible validar el código.", fgMismatch: "Las contraseñas no coinciden.", fgResetFail: "No fue posible restablecer la contraseña.",
  enterCode: "Ingresa el código", codeSent6: "Enviamos un código de 6 dígitos a", confirmCode: "Confirmar código", close: "Cerrar", digit: "Dígito", didntGet: "¿No recibiste el código?",
  codeConfirmed: "Código confirmado para", newPassNow: "Ahora crea tu nueva contraseña.", newPass: "Nueva contraseña", confirmNew: "Confirma la nueva contraseña", repeat: "Repite la contraseña", saveNew: "Guardar nueva contraseña",
  eBot: "No pudimos verificar que eres una persona. Actualiza la página e inténtalo de nuevo.", eSuspended: "Tu cuenta está suspendida. Contacta con soporte.", eInvalidCreds: "Correo o contraseña incorrectos.", eTooMany: "Demasiados intentos. Espera un momento e inténtalo de nuevo.", eBadRequest: "Solicitud inválida.", eEmailTaken: "Correo ya registrado.", eEmailTakenField: "Correo ya registrado. Usa otro o inicia sesión.",
  eMailFail: "No fue posible enviar el correo de verificación. Inténtalo de nuevo en unos instantes.", eNotFound: "Registro no encontrado o ya verificado.", eWait: "Espera cerca de 1 minuto para pedir un nuevo código.", eResendFail: "Error al reenviar el correo.",
  eCodeExpired: "Código vencido o intentos agotados. Pide un nuevo código.", eCodeWrong: "Código incorrecto.", eCode6: "Ingresa el código de 6 dígitos.", eSession: "La sesión de restablecimiento expiró. Pide un nuevo código.", eEmailValid: "Ingresa un correo válido.",
};

const D: Record<Lang, Dict> = { pt, en, es };
export const tr = (l: Lang): Dict => D[l];
export type AuthDict = Dict;
