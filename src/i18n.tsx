import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'fr' | 'ar'

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'ar', label: 'العربية', short: 'AR' },
]

type Dict = Record<string, string>

const en: Dict = {
  tagline: 'Your training, your rank, your gains.',
  tapContinue: 'tap to continue',
  welcomeBack1: 'Welcome',
  welcomeBack2: 'back',
  loginSub: 'Log in to keep climbing the ranks.',
  email: 'Email',
  password: 'Password',
  forgot: 'Forgot password?',
  logIn: 'Log In',
  or: 'or',
  noAccount: "Don't have an account?",
  signUp: 'Sign Up',
  startYour: 'Start your',
  ascent: 'ascent',
  signupSub: 'Create your account to build your first program.',
  name: 'Name',
  confirmPassword: 'Confirm Password',
  createAccount: 'Create Account',
  createPwd: 'Create a password',
  reenterPwd: 'Re-enter password',
  haveAccount: 'Already training with us?',
  language: 'Language',
}

const fr: Dict = {
  tagline: 'Votre entraînement, votre rang, vos gains.',
  tapContinue: 'appuyez pour continuer',
  welcomeBack1: 'Bon',
  welcomeBack2: 'retour',
  loginSub: 'Connectez-vous pour continuer à grimper les rangs.',
  email: 'E-mail',
  password: 'Mot de passe',
  forgot: 'Mot de passe oublié ?',
  logIn: 'Se connecter',
  or: 'ou',
  noAccount: 'Pas encore de compte ?',
  signUp: "S'inscrire",
  startYour: 'Commencez votre',
  ascent: 'ascension',
  signupSub: 'Créez votre compte pour bâtir votre premier programme.',
  name: 'Nom',
  confirmPassword: 'Confirmer le mot de passe',
  createAccount: 'Créer un compte',
  createPwd: 'Créez un mot de passe',
  reenterPwd: 'Ressaisissez le mot de passe',
  haveAccount: 'Déjà membre ?',
  language: 'Langue',
}

const ar: Dict = {
  tagline: 'تدريبك، رتبتك، إنجازاتك.',
  tapContinue: 'اضغط للمتابعة',
  welcomeBack1: 'مرحبًا',
  welcomeBack2: 'بعودتك',
  loginSub: 'سجّل الدخول لمواصلة تسلّق الرتب.',
  email: 'البريد الإلكتروني',
  password: 'كلمة المرور',
  forgot: 'هل نسيت كلمة المرور؟',
  logIn: 'تسجيل الدخول',
  or: 'أو',
  noAccount: 'ليس لديك حساب؟',
  signUp: 'إنشاء حساب',
  startYour: 'ابدأ',
  ascent: 'صعودك',
  signupSub: 'أنشئ حسابك لبناء برنامجك الأول.',
  name: 'الاسم',
  confirmPassword: 'تأكيد كلمة المرور',
  createAccount: 'إنشاء حساب',
  createPwd: 'أنشئ كلمة مرور',
  reenterPwd: 'أعد إدخال كلمة المرور',
  haveAccount: 'أنت معنا بالفعل؟',
  language: 'اللغة',
}

const DICTS: Record<Lang, Dict> = { en, fr, ar }

type Ctx = { lang: Lang; setLang: (l: Lang) => void; dir: 'ltr' | 'rtl'; t: (key: keyof typeof en) => string }

const LanguageContext = createContext<Ctx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])

  const value = useMemo<Ctx>(
    () => ({ lang, setLang, dir, t: (key) => DICTS[lang][key] ?? DICTS.en[key] ?? String(key) }),
    [lang, dir],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useI18n() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider')
  return ctx
}
