import { useEffect, useRef, useState } from 'react'
import yariLogo from './imports/YARI_COACH.png'
import yariSuppsLogo from './imports/image-2.png'
import suppCreatine from './imports/image-3.png'
import suppGlutamine from './imports/image-4.png'
import suppBeefMass from './imports/image-5.png'
import suppBeefAminos from './imports/image-6.png'
import suppAnabol from './imports/image-7.png'
import suppThunderGain from './imports/image-8.png'
import { LANGS, LanguageProvider, useI18n, type Lang } from './i18n'
import {
  Chip,
  GhostLink,
  Input,
  PrimaryButton,
  ProgressBar,
  RankBadge,
  SecondaryButton,
  SelectCard,
} from './components/ui'

/* ================================================================== */
/* Flow state                                                         */
/* ================================================================== */
type Answers = {
  gender: string
  goal: string
  level: string
  days: number
  session: string
  injuries: string[]
  injuryNote: string
  height: string
  weight: string
  age: string
  activity: string
  budget: string
}

const emptyAnswers: Answers = {
  gender: '',
  goal: '',
  level: '',
  days: 4,
  session: '',
  injuries: [],
  injuryNote: '',
  height: '',
  weight: '',
  age: '',
  activity: '',
  budget: '300',
}
/* Root — renders a phone frame around the active screen              */
/* ================================================================== */

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  )
}
type Theme = 'dark' | 'light'

function AppInner() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Answers>(emptyAnswers)
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('yari.theme') as Theme) || 'dark')

  // apply theme to document + persist
  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', theme === 'light')
    try {
      localStorage.setItem('yari.theme', theme)
    } catch {
      /* storage unavailable */
    }
  }, [theme])

  // auto-advance splash
  useEffect(() => {
    if (screen !== 'splash') return
    const t = setTimeout(() => setScreen('login'), 2600)
    return () => clearTimeout(t)
  }, [screen])

  const set = <K extends keyof Answers>(key: K, val: Answers[K]) =>
    setAnswers((a) => ({ ...a, [key]: val }))

  const toggle = (key: 'injuries', val: string) =>
    setAnswers((a) => ({
      ...a,
      injuries: a.injuries.includes(val) ? a.injuries.filter((v) => v !== val) : [...a.injuries, val],
    }))

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{
        background:
          theme === 'light'
            ? 'radial-gradient(circle at 50% -10%, #ffffff, #dcdee4 60%)'
            : 'radial-gradient(circle at 50% -10%, #1a1a1a, #000 60%)',
      }}
    >
      <Phone>
        {screen === 'splash' && <Splash onSkip={() => setScreen('login')} />}
        {screen === 'login' && (
          <Login onSignup={() => setScreen('signup')} onLogin={() => setScreen('dashboard')} />
        )}
        {screen === 'signup' && (
          <Signup onLogin={() => setScreen('login')} onCreate={() => { setStep(1); setScreen('onboarding') }} />
        )}
        {screen === 'onboarding' && (
          <Onboarding
            step={step}
            answers={answers}
            set={set}
            toggle={toggle}
            onBack={() => (step === 1 ? setScreen('login') : setStep((s) => s - 1))}
            onNext={() => (step === TOTAL_STEPS ? setScreen('generating') : setStep((s) => s + 1))}
          />
        )}
        {screen === 'generating' && (
          <Generating onDone={() => setScreen('dashboard')} />
        )}
        {screen === 'dashboard' && (
          <Dashboard
            answers={answers}
            setAnswers={setAnswers}
            theme={theme}
            setTheme={setTheme}
            onLogout={() => setScreen('login')}
            onRestart={() => {
              setAnswers(emptyAnswers)
              setStep(1)
              setScreen('splash')
            }}
          />
        )}
      </Phone>
    </div>
  )
}

/* ================================================================== */
/* Phone frame                                                        */
/* ================================================================== */

function Phone({ children }: { children: React.ReactNode }) {
  const { dir } = useI18n()
  return (
    <div
      dir={dir}
      className="relative h-[844px] w-[390px] max-w-full overflow-hidden bg-[var(--color-ink)] rounded-[28px] border border-[var(--color-hair)] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] mx-auto"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="h-full">{children}</div>
    </div>
  )
}

function Logo({ size = 'text-3xl' }: { size?: string }) {
  return (
    <div className={`flex items-center gap-3 font-display font-extrabold uppercase tracking-tight ${size} text-[var(--color-bone)]`}>
      <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--color-volt)]/40 bg-black">
        <img src={yariLogo} alt="Yari Coach logo" className="size-full object-cover" />
      </span>
      Yari<span className="text-[var(--color-volt)]">Coach</span>
    </div>
  )
}

function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const current = LANGS.find((l) => l.code === lang)!

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t('language')}
        className="flex items-center gap-2 rounded-full border border-[var(--color-hair)] bg-[var(--color-surface)] py-2 pl-3 pr-2.5 text-sm font-semibold text-[var(--color-bone)] transition-colors hover:border-[var(--color-volt)]/60"
      >
        <svg viewBox="0 0 24 24" className="size-4 text-[var(--color-volt)]" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" strokeLinecap="round" />
        </svg>
        {current.short}
        <svg viewBox="0 0 24 24" className={'size-4 text-[var(--color-ash)] transition-transform ' + (open ? 'rotate-180' : '')} fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute end-0 z-40 mt-2 w-40 overflow-hidden rounded-xl border border-[var(--color-hair)] bg-[var(--color-surface-2)] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8)]" style={{ animation: 'rise 0.2s ease-out both' }}>
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code as Lang); setOpen(false) }}
              className={
                'flex w-full items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-[var(--color-surface)] ' +
                (l.code === lang ? 'text-[var(--color-volt)]' : 'text-[var(--color-bone)]')
              }
            >
              <span className="font-semibold">{l.label}</span>
              <span className="text-xs text-[var(--color-ash)]">{l.short}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ================================================================== */
/* 1 · Splash                                                         */
/* ================================================================== */

function Splash({ onSkip }: { onSkip: () => void }) {
  const { t } = useI18n()
  return (
    <button
      onClick={onSkip}
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[var(--color-ink)]"
    >
      {/* glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-volt)]/15 blur-[90px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-52 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 rounded-full border border-[var(--color-volt)]/40" style={{ animation: 'volt-ring 2.4s ease-out infinite' }} />
        <span className="absolute inset-0 rounded-full border border-[var(--color-volt)]/40" style={{ animation: 'volt-ring 2.4s ease-out infinite 1.2s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center" style={{ animation: 'rise 0.7s ease-out both' }}>
        <div
          className="overflow-hidden rounded-3xl border border-[var(--color-volt)]/30 shadow-[0_0_60px_-10px_rgba(255,210,0,0.4)]"
          style={{ animation: 'volt-pulse 2.8s ease-in-out infinite' }}
        >
          <img src={yariLogo} alt="Yari Coach" className="size-52 object-cover" />
        </div>
        <p className="mt-8 max-w-[260px] text-center text-sm font-medium text-[var(--color-ash)]">
          {t('tagline')}
        </p>
      </div>

      <span className="absolute bottom-10 text-xs uppercase tracking-[0.3em] text-[var(--color-ash)]/70">
        {t('tapContinue')}
      </span>
    </button>
  )
}

/* ================================================================== */
/* Screen shell for scrollable auth/onboarding screens               */
/* ================================================================== */

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.09A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.57.38-2.29V6.62H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.38l4.01-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.62l4.01 3.09C6.23 6.86 8.88 4.75 12 4.75z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.54c-.02-2.02 1.65-2.99 1.73-3.04-.94-1.38-2.41-1.57-2.93-1.59-1.25-.13-2.44.73-3.07.73-.63 0-1.61-.71-2.65-.69-1.36.02-2.62.79-3.32 2.01-1.42 2.46-.36 6.1 1.02 8.1.67.98 1.47 2.08 2.51 2.04 1.01-.04 1.39-.65 2.61-.65 1.22 0 1.56.65 2.63.63 1.09-.02 1.78-1 2.44-1.98.77-1.13 1.09-2.23 1.11-2.29-.02-.01-2.13-.82-2.15-3.25zM15.03 6.3c.56-.68.94-1.62.84-2.56-.81.03-1.79.54-2.37 1.22-.52.6-.97 1.56-.85 2.48.9.07 1.82-.46 2.38-1.14z" />
    </svg>
  )
}

function OAuthRow() {
  const { t } = useI18n()
  return (
    <div className="grid grid-cols-2 gap-3">
      <SecondaryButton className="!flex !items-center !justify-center !gap-2.5 !py-3">
        <GoogleIcon /> {t('google')}
      </SecondaryButton>
      <SecondaryButton className="!flex !items-center !justify-center !gap-2.5 !py-3">
        <AppleIcon /> {t('apple')}
      </SecondaryButton>
    </div>
  )
}

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--color-ash)]/70">
      <span className="h-px flex-1 bg-[var(--color-hair)]" />
      {children}
      <span className="h-px flex-1 bg-[var(--color-hair)]" />
    </div>
  )
}

/* ================================================================== */
/* 2 · Login                                                          */
/* ================================================================== */

function Login({ onSignup, onLogin }: { onSignup: () => void; onLogin: () => void }) {
  const { t } = useI18n()
  return (
    <div className="flex h-full flex-col px-7 pb-8 pt-20" style={{ animation: 'rise 0.4s ease-out both' }}>
      <div className="flex items-center justify-between">
        <Logo />
        <LanguageSwitcher />
      </div>
      <div className="mt-8">
        <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.95] text-[var(--color-bone)]">
          {t('welcomeBack1')}<br />{t('welcomeBack2')}
        </h1>
        <p className="mt-3 text-sm text-[var(--color-ash)]">{t('loginSub')}</p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <Input label={t('email')} type="email" placeholder="you@example.com" defaultValue="fadi.nassraoui@gmail.com" />
        <Input label={t('password')} type="password" placeholder="••••••••" defaultValue="password" />
        <div className="text-end">
          <GhostLink>{t('forgot')}</GhostLink>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <PrimaryButton onClick={onLogin}>{t('logIn')}</PrimaryButton>
        <Divider>{t('or')}</Divider>
        <OAuthRow />
        <p className="text-center text-sm text-[var(--color-ash)]">
          {t('noAccount')}{' '}
          <button onClick={onSignup} className="font-semibold text-[var(--color-volt)] hover:underline">
            {t('signUp')}
          </button>
        </p>
      </div>
    </div>
  )
}

/* ================================================================== */
/* 3 · Sign up                                                        */
/* ================================================================== */

function Signup({ onLogin, onCreate }: { onLogin: () => void; onCreate: () => void }) {
  const { t } = useI18n()
  return (
    <div className="flex h-full flex-col px-7 pb-8 pt-20" style={{ animation: 'rise 0.4s ease-out both' }}>
      <div className="flex items-center justify-between">
        <Logo />
        <LanguageSwitcher />
      </div>
      <div className="mt-7">
        <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.95] text-[var(--color-bone)]">
          {t('startYour')}<br /><span className="text-[var(--color-volt)]">{t('ascent')}</span>
        </h1>
        <p className="mt-3 text-sm text-[var(--color-ash)]">{t('signupSub')}</p>
      </div>

      <div className="mt-6 flex flex-col gap-3.5">
        <Input label={t('name')} placeholder="Fadi Nassraoui" />
        <Input label={t('email')} type="email" placeholder="you@example.com" />
        <Input label={t('password')} type="password" placeholder={t('createPwd')} />
        <Input label={t('confirmPassword')} type="password" placeholder={t('reenterPwd')} />
      </div>

      <div className="mt-auto flex flex-col gap-4 pt-6">
        <PrimaryButton onClick={onCreate}>{t('createAccount')}</PrimaryButton>
        <p className="text-center text-sm text-[var(--color-ash)]">
          {t('haveAccount')}{' '}
          <button onClick={onLogin} className="font-semibold text-[var(--color-volt)] hover:underline">
            {t('logIn')}
          </button>
        </p>
      </div>
    </div>
  )
}

/* ================================================================== */
/* 4 · Onboarding questionnaire                                       */
/* ================================================================== */

function Onboarding({
  step,
  answers,
  set,
  toggle,
  onBack,
  onNext,
}: {
  step: number
  answers: Answers
  set: <K extends keyof Answers>(k: K, v: Answers[K]) => void
  toggle: (k: 'injuries', v: string) => void
  onBack: () => void
  onNext: () => void
}) {
  const canContinue = (() => {
    switch (step) {
      case 1: return !!answers.gender
      case 2: return !!answers.goal
      case 3: return !!answers.level
      case 5: return !!answers.session
      case 7: return !!answers.height && !!answers.weight && !!answers.age && !!answers.activity
      default: return true
    }
  })()

  return (
    <div className="flex h-full flex-col pt-16">
      {/* header */}
      <div className="px-7">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-hair)] bg-[var(--color-surface)] text-[var(--color-bone)] transition-colors hover:border-[var(--color-ash)]"
            aria-label="Back"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.4}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex-1">
            <ProgressBar value={(step / TOTAL_STEPS) * 100} />
          </div>
          <span className="shrink-0 font-display text-sm font-semibold uppercase tracking-wide text-[var(--color-ash)]">
            {step}/{TOTAL_STEPS}
          </span>
        </div>
      </div>

      {/* body */}
      <div key={step} className="flex-1 overflow-y-auto px-7 pb-4 pt-8" style={{ animation: 'rise 0.35s ease-out both' }}>
        <StepContent step={step} answers={answers} set={set} toggle={toggle} />
      </div>

      {/* footer */}
      <div className="border-t border-[var(--color-hair)]/60 bg-[var(--color-ink)]/80 px-7 py-5 backdrop-blur">
            <PrimaryButton onClick={onNext} disabled={!canContinue}>
              {step === TOTAL_STEPS ? useI18n().t('buildProgram') : useI18n().t('continueBtn')}
            </PrimaryButton>
      </div>
    </div>
  )
}

function StepHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-volt)]">{eyebrow}</span>
      <h2 className="mt-2 font-display text-4xl font-bold uppercase leading-[0.98] text-[var(--color-bone)]">{title}</h2>
    </div>
  )
}

function StepContent({
  step,
  answers,
  set,
  toggle,
}: {
  step: number
  answers: Answers
  set: <K extends keyof Answers>(k: K, v: Answers[K]) => void
  toggle: (k: 'injuries', v: string) => void
}) {
  const { t } = useI18n()

  switch (step) {
    case 1:
      return (
        <>
          <StepHeading eyebrow={t('aboutYouEyebrow')} title={t('whatsYourGender')} />
          <p className="mb-6 -mt-3 text-[13px] text-[var(--color-ash)]">{t('genderSub')}</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Male', 'maleSub', '♂'],
              ['Female', 'femaleSub', '♀'],
            ].map(([key, subKey, i]) => (
              <button
                key={key}
                onClick={() => {
                  if (answers.gender !== key) set('goal', '')
                  set('gender', key)
                }}
                className={
                  'flex flex-col items-center gap-3 rounded-2xl border px-4 py-8 transition-all active:scale-[0.98] ' +
                  (answers.gender === key
                    ? 'border-[var(--color-volt)] bg-[var(--color-volt)]/10'
                    : 'border-[var(--color-hair)] bg-[var(--color-surface)] hover:border-[var(--color-ash)]/60')
                }
              >
                <span
                  className={
                    'flex size-14 items-center justify-center rounded-full text-3xl transition-colors ' +
                    (answers.gender === key ? 'bg-[var(--color-volt)] text-[var(--color-onaccent)]' : 'bg-[var(--color-surface-2)] text-[var(--color-bone)]')
                  }
                >
                  {i}
                </span>
                <span className="text-center">
                  <span className="block font-display text-xl font-bold uppercase text-[var(--color-bone)]">{t(key.toLowerCase())}</span>
                  <span className="mt-1 block text-[12px] leading-tight text-[var(--color-ash)]">{t(subKey)}</span>
                </span>
              </button>
            ))}
          </div>
        </>
      )
    case 2: {
      const goals =
        answers.gender === 'Female'
          ? [
              [t('goal_glutes_title'), t('goal_glutes_sub'), '🍑'],
              [t('goal_tone_title'), t('goal_tone_sub'), '✨'],
              [t('goal_fatloss_title'), t('goal_fatloss_sub'), '🔥'],
              [t('goal_general_title'), t('goal_general_sub'), '⚡'],
            ]
          : [
              [t('goal_build_title'), t('goal_build_sub'), '💪'],
              [t('goal_stronger_title'), t('goal_stronger_sub'), '🏋️'],
              [t('goal_fatloss_title'), t('goal_fatloss_sub'), '🔥'],
              [t('goal_athletic_title'), t('goal_athletic_sub'), '⚡'],
            ]
      return (
        <>
          <StepHeading eyebrow="Your objective" title="What's your main goal?" />
          <div className="flex flex-col gap-3">
            {goals.map(([t, s, i]) => (
              <SelectCard key={t} icon={i} title={t} subtitle={s} selected={answers.goal === t} onClick={() => set('goal', t)} />
            ))}
          </div>
        </>
      )
    }
    case 3:
      return (
        <>
          <StepHeading eyebrow="Where you're at" title="Your experience level?" />
          <div className="flex flex-col gap-3">
            {[
              ['Beginner', 'New or returning to the gym', '🥉'],
              ['Intermediate', '1–3 years of consistent lifting', '🥈'],
              ['Advanced', '3+ years, dialed-in technique', '🥇'],
            ].map(([t, s, i]) => (
              <SelectCard key={t} icon={i} title={t} subtitle={s} selected={answers.level === t} onClick={() => set('level', t)} />
            ))}
          </div>
        </>
      )
    case 4:
      return (
        <>
          <StepHeading eyebrow="Your schedule" title="Days per week you can train?" />
          <div className="mt-4 flex flex-col items-center">
            <span className="font-display text-8xl font-extrabold leading-none text-[var(--color-volt)]">{answers.days}</span>
            <span className="mt-1 text-sm uppercase tracking-[0.2em] text-[var(--color-ash)]">days / week</span>
          </div>
          <input
            type="range"
            min={2}
            max={6}
            value={answers.days}
            onChange={(e) => set('days', Number(e.target.value))}
            className="mt-8 w-full accent-[var(--color-volt)]"
          />
          <div className="mt-3 flex justify-between px-1 text-xs font-semibold text-[var(--color-ash)]">
            {[2, 3, 4, 5, 6].map((n) => (
              <span key={n} className={answers.days === n ? 'text-[var(--color-volt)]' : ''}>{n}</span>
            ))}
          </div>
          <p className="mt-8 rounded-xl bg-[var(--color-surface)] px-4 py-3 text-center text-[13px] text-[var(--color-ash)]">
            {answers.days <= 3 ? 'Full-body & upper/lower splits work best here.' : 'Great — a push/pull/legs split is on the table.'}
          </p>
        </>
      )
    case 5:
      return (
        <>
          <StepHeading eyebrow="Time per session" title="How long is each session?" />
          <div className="grid grid-cols-2 gap-3">
            {['30 min', '45 min', '60 min', '90+ min'].map((t) => (
              <button
                key={t}
                onClick={() => set('session', t)}
                className={
                  'rounded-2xl border py-8 text-center font-display text-2xl font-bold uppercase transition-all active:scale-[0.98] ' +
                  (answers.session === t
                    ? 'border-[var(--color-volt)] bg-[var(--color-volt)]/10 text-[var(--color-volt)]'
                    : 'border-[var(--color-hair)] bg-[var(--color-surface)] text-[var(--color-bone)] hover:border-[var(--color-ash)]/60')
                }
              >
                {t}
              </button>
            ))}
          </div>
        </>
      )
    case 6:
      return (
        <>
          <StepHeading eyebrow="Train safe" title="Any injuries or limits?" />
          <div className="mb-5 flex flex-wrap gap-2.5">
            {['Knees', 'Shoulders', 'Lower Back', 'None'].map((t) => (
              <Chip key={t} selected={answers.injuries.includes(t)} onClick={() => toggle('injuries', t)}>
                {t}
              </Chip>
            ))}
          </div>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ash)]">Notes (optional)</span>
            <textarea
              rows={4}
              value={answers.injuryNote}
              onChange={(e) => set('injuryNote', e.target.value)}
              placeholder="e.g. Left shoulder impingement — avoid overhead pressing."
              className="w-full resize-none rounded-xl border border-[var(--color-hair)] bg-[var(--color-surface)] px-4 py-3.5 text-[15px] text-[var(--color-bone)] placeholder:text-[var(--color-ash)]/70 outline-none transition-all focus:border-[var(--color-volt)] focus:ring-2 focus:ring-[var(--color-volt)]/30"
            />
          </label>
        </>
      )
    case 7:
      return (
        <>
          <StepHeading eyebrow={t('nutritionBasicsEyebrow')} title={t('bodyMetricsTitle')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('heightCm')} inputMode="numeric" placeholder="178" value={answers.height} onChange={(e) => set('height', e.target.value)} />
            <Input label={t('weightKg')} inputMode="numeric" placeholder="76" value={answers.weight} onChange={(e) => set('weight', e.target.value)} />
          </div>
          <div className="mt-3">
            <Input label={t('age')} inputMode="numeric" placeholder="27" value={answers.age} onChange={(e) => set('age', e.target.value)} />
          </div>
          <span className="mb-2 mt-5 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ash)]">{t('activityLevel')}</span>
          <div className="flex flex-col gap-2.5">
            {[t('activity_mostly'), t('activity_lightly'), t('activity_very')].map((label) => (
              <SelectCard key={label} title={label} selected={answers.activity === label} onClick={() => set('activity', label)} />
            ))}
          </div>
        </>
      )
    case 8:
      return (
        <>
          <StepHeading eyebrow={t('budgetEyebrow')} title={t('budgetTitle')} />
          <div className="mt-6">
            <div className="mb-2 flex items-end justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ash)]">{t('monthlyFoodBudget')}</span>
              <span className="font-display text-2xl font-extrabold text-[var(--color-volt)]">{answers.budget} {CURRENCY}</span>
            </div>
            <input
              type="range"
              min={150}
              max={600}
              step={10}
              value={Number(answers.budget) || 300}
              onChange={(e) => set('budget', e.target.value)}
              className="w-full accent-[var(--color-volt)]"
            />
            <div className="mt-1 flex justify-between text-[11px] text-[var(--color-ash)]">
              <span>{t('monthlyMin')} {CURRENCY}</span>
              <span>{t('monthlyMax')} {CURRENCY}</span>
            </div>
          </div>
        </>
      )
    default:
      return null
  }
}

/* ================================================================== */
/* 5 · Generating                                                     */
/* ================================================================== */

const PHASES = ['phase_analyzing', 'phase_selecting', 'phase_calculating', 'phase_assigning']

function Generating({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0)
  const { t } = useI18n()

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => {
        if (p >= PHASES.length - 1) {
          clearInterval(interval)
          setTimeout(onDone, 1400)
          return p
        }
        return p + 1
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [onDone])

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[var(--color-ink)] px-8">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-volt)]/12 blur-[80px]" />

      <div className="relative flex items-center justify-center">
        <span className="absolute size-40 rounded-full border-2 border-[var(--color-volt)]/25 border-t-[var(--color-volt)]" style={{ animation: 'spin-slow 1.4s linear infinite' }} />
        <div style={{ animation: 'volt-pulse 1.8s ease-in-out infinite' }}>
          <RankBadge rank="Bronze" size={100} />
        </div>
      </div>

      <h2 className="relative mt-12 text-center font-display text-3xl font-bold uppercase leading-tight text-[var(--color-bone)]">
        {t('buildingProgramTitle').split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i === 0 && <br />}
          </span>
        ))}
      </h2>

      <div key={phase} className="relative mt-5 flex items-center gap-2.5 text-sm text-[var(--color-ash)]" style={{ animation: 'rise 0.4s ease-out both' }}>
        <span className="size-1.5 rounded-full bg-[var(--color-volt)]" style={{ animation: 'volt-pulse 1s ease-in-out infinite' }} />
        {PHASES[phase]}
      </div>

      <div className="relative mt-10 w-full max-w-[240px]">
        <ProgressBar value={((phase + 1) / PHASES.length) * 100} />
      </div>
    </div>
  )
}

/* ================================================================== */
/* 6 · Dashboard — full functional home                               */
/* ================================================================== */

type Tab = 'home' | 'train' | 'progress' | 'nutrition' | 'rank'

const GYM_NAME = 'Yari Club — Tunis'
const CURRENCY = 'DT'

// A gender-aware weekly split, mapped to this single gym's stations.
function buildSplit(a: Answers) {
  const female = a.gender === 'Female'
  const glutes = a.goal === 'Glutes & Curves'
  if (female) {
    return [
      { day: 'Mon', name: glutes ? 'Glutes & Hamstrings' : 'Lower Body Sculpt', focus: 'Glutes · Hams', done: true, kcal: 420 },
      { day: 'Tue', name: 'Upper Body Tone', focus: 'Back · Shoulders', done: true, kcal: 310 },
      { day: 'Wed', name: 'Active Recovery', focus: 'Mobility · Core', done: false, kcal: 180 },
      { day: 'Thu', name: glutes ? 'Glute Focus + Abs' : 'Lower Body & Abs', focus: 'Glutes · Waist', done: false, kcal: 400 },
      { day: 'Fri', name: 'Full Body Burn', focus: 'Conditioning', done: false, kcal: 360 },
    ]
  }
  return [
    { day: 'Mon', name: 'Push — Chest & Shoulders', focus: 'Chest · Delts · Tri', done: true, kcal: 480 },
    { day: 'Tue', name: 'Pull — Back & Biceps', focus: 'Back · Biceps', done: true, kcal: 460 },
    { day: 'Wed', name: 'Legs — Quads & Hams', focus: 'Quads · Hams · Calves', done: false, kcal: 540 },
    { day: 'Thu', name: 'Push — Strength', focus: 'Heavy pressing', done: false, kcal: 470 },
    { day: 'Fri', name: 'Pull + Arms', focus: 'Back · Arms', done: false, kcal: 450 },
  ]
}

function macroTargets(a: Answers) {
  const w = Number(a.weight) || 75
  const female = a.gender === 'Female'
  const cut = a.goal.includes('Fat Loss') || a.goal === 'Tone & Sculpt'
  const base = female ? 28 : 32
  const kcal = Math.round(w * base * (cut ? 0.88 : 1.08))
  const protein = Math.round(w * 2.1)
  const fat = Math.round((kcal * 0.27) / 9)
  const carbs = Math.round((kcal - protein * 4 - fat * 9) / 4)
  return { kcal, protein, carbs, fat }
}

type SplitDay = ReturnType<typeof buildSplit>[number]

type Exercise = {
  name: string
  muscles: string[]
  sets: number
  reps: string
  // YouTube video ID — Fadi films these at the gym and uploads to YouTube.
  yt: string
}

// Placeholder tutorial ID — swap each for the real filmed clip's YouTube ID.
const DEMO_YT = 'ScMzIvxBSi4'

const EX_POOLS: Record<string, Exercise[]> = {
  push: [
    { name: 'Barbell Bench Press', muscles: ['Chest', 'Triceps', 'Front Delts'], sets: 4, reps: '8–10', yt: DEMO_YT },
    { name: 'Incline Dumbbell Press', muscles: ['Upper Chest', 'Front Delts'], sets: 3, reps: '10–12', yt: DEMO_YT },
    { name: 'Machine Chest Fly', muscles: ['Chest'], sets: 3, reps: '12–15', yt: DEMO_YT },
    { name: 'Shoulder Press Machine', muscles: ['Shoulders', 'Triceps'], sets: 3, reps: '10–12', yt: DEMO_YT },
    { name: 'Cable Lateral Raise', muscles: ['Side Delts'], sets: 3, reps: '15', yt: DEMO_YT },
    { name: 'Triceps Rope Pushdown', muscles: ['Triceps'], sets: 3, reps: '12–15', yt: DEMO_YT },
  ],
  pull: [
    { name: 'Lat Pulldown', muscles: ['Lats', 'Biceps'], sets: 4, reps: '10–12', yt: DEMO_YT },
    { name: 'Seated Cable Row', muscles: ['Mid Back', 'Biceps'], sets: 3, reps: '10–12', yt: DEMO_YT },
    { name: 'Machine Reverse Fly', muscles: ['Rear Delts', 'Upper Back'], sets: 3, reps: '15', yt: DEMO_YT },
    { name: 'Barbell Curl', muscles: ['Biceps'], sets: 3, reps: '10–12', yt: DEMO_YT },
    { name: 'Hammer Curl', muscles: ['Biceps', 'Forearms'], sets: 3, reps: '12', yt: DEMO_YT },
    { name: 'Cable Face Pull', muscles: ['Rear Delts', 'Traps'], sets: 3, reps: '15', yt: DEMO_YT },
  ],
  legs: [
    { name: 'Barbell Back Squat', muscles: ['Quads', 'Glutes'], sets: 4, reps: '8–10', yt: DEMO_YT },
    { name: 'Leg Press', muscles: ['Quads', 'Glutes'], sets: 3, reps: '12', yt: DEMO_YT },
    { name: 'Romanian Deadlift', muscles: ['Hamstrings', 'Glutes'], sets: 3, reps: '10', yt: DEMO_YT },
    { name: 'Leg Extension', muscles: ['Quads'], sets: 3, reps: '15', yt: DEMO_YT },
    { name: 'Lying Leg Curl', muscles: ['Hamstrings'], sets: 3, reps: '12–15', yt: DEMO_YT },
    { name: 'Standing Calf Raise', muscles: ['Calves'], sets: 4, reps: '15–20', yt: DEMO_YT },
  ],
  glutes: [
    { name: 'Barbell Hip Thrust', muscles: ['Glutes', 'Hamstrings'], sets: 4, reps: '10–12', yt: DEMO_YT },
    { name: 'Bulgarian Split Squat', muscles: ['Glutes', 'Quads'], sets: 3, reps: '12', yt: DEMO_YT },
    { name: 'Cable Glute Kickback', muscles: ['Glutes'], sets: 3, reps: '15', yt: DEMO_YT },
    { name: 'Romanian Deadlift', muscles: ['Hamstrings', 'Glutes'], sets: 3, reps: '10–12', yt: DEMO_YT },
    { name: 'Hip Abduction Machine', muscles: ['Glute Medius'], sets: 3, reps: '20', yt: DEMO_YT },
    { name: 'Cable Crunch', muscles: ['Abs', 'Waist'], sets: 3, reps: '15', yt: DEMO_YT },
  ],
  upper: [
    { name: 'Lat Pulldown', muscles: ['Lats', 'Biceps'], sets: 3, reps: '12', yt: DEMO_YT },
    { name: 'Shoulder Press Machine', muscles: ['Shoulders'], sets: 3, reps: '12', yt: DEMO_YT },
    { name: 'Seated Cable Row', muscles: ['Back'], sets: 3, reps: '12', yt: DEMO_YT },
    { name: 'Cable Lateral Raise', muscles: ['Side Delts'], sets: 3, reps: '15', yt: DEMO_YT },
    { name: 'Triceps Pushdown', muscles: ['Triceps'], sets: 3, reps: '15', yt: DEMO_YT },
  ],
  full: [
    { name: 'Goblet Squat', muscles: ['Quads', 'Glutes'], sets: 3, reps: '12', yt: DEMO_YT },
    { name: 'Incline Dumbbell Press', muscles: ['Chest', 'Shoulders'], sets: 3, reps: '12', yt: DEMO_YT },
    { name: 'Lat Pulldown', muscles: ['Back', 'Biceps'], sets: 3, reps: '12', yt: DEMO_YT },
    { name: 'Kettlebell Swing', muscles: ['Glutes', 'Hamstrings', 'Core'], sets: 3, reps: '20', yt: DEMO_YT },
    { name: 'Plank', muscles: ['Core'], sets: 3, reps: '45s', yt: DEMO_YT },
  ],
  recovery: [
    { name: 'Incline Treadmill Walk', muscles: ['Cardio', 'Calves'], sets: 1, reps: '20 min', yt: DEMO_YT },
    { name: 'Hip Mobility Flow', muscles: ['Hips', 'Lower Back'], sets: 2, reps: '8 each', yt: DEMO_YT },
    { name: 'Dead Bug', muscles: ['Core'], sets: 3, reps: '12', yt: DEMO_YT },
    { name: 'Foam Roll — Full Body', muscles: ['Recovery'], sets: 1, reps: '10 min', yt: DEMO_YT },
  ],
}

function poolFor(day: SplitDay): Exercise[] {
  const n = day.name.toLowerCase()
  if (n.includes('glute')) return EX_POOLS.glutes
  if (n.includes('recovery')) return EX_POOLS.recovery
  if (n.includes('full') || n.includes('burn')) return EX_POOLS.full
  if (n.includes('upper') || n.includes('tone')) return EX_POOLS.upper
  if (n.includes('lower')) return EX_POOLS.legs
  if (n.includes('push')) return EX_POOLS.push
  if (n.includes('pull')) return EX_POOLS.pull
  if (n.includes('leg')) return EX_POOLS.legs
  return EX_POOLS.full
}

// User exercise swaps — persisted, keyed by `${day.name}#${index}` → exercise name
const EX_OVERRIDE_KEY = 'yari.exoverrides.v1'

function loadExOverrides(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(EX_OVERRIDE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveExOverride(dayName: string, index: number, exName: string) {
  const all = loadExOverrides()
  all[`${dayName}#${index}`] = exName
  try {
    localStorage.setItem(EX_OVERRIDE_KEY, JSON.stringify(all))
  } catch {
    /* storage unavailable */
  }
}

const ALL_EXERCISES: Exercise[] = Array.from(
  new Map(Object.values(EX_POOLS).flat().map((e) => [e.name, e])).values(),
)

// Shared option sets (also used by onboarding)
const GOALS_MALE = ['goal_build_title', 'goal_stronger_title', 'goal_fatloss_title', 'goal_athletic_title']
const GOALS_FEMALE = ['goal_glutes_title', 'goal_tone_title', 'goal_fatloss_title', 'goal_general_title']
const LEVELS = ['level_beginner', 'level_intermediate', 'level_advanced']
const SESSIONS = ['session_30', 'session_45', 'session_60', 'session_90']
const ACTIVITIES = ['activity_mostly', 'activity_lightly', 'activity_very']

function exercisesFor(day: SplitDay): Exercise[] {
  const pool = poolFor(day)
  const overrides = loadExOverrides()
  return pool.map((ex, i) => {
    const name = overrides[`${day.name}#${i}`]
    if (!name) return ex
    return ALL_EXERCISES.find((e) => e.name === name) ?? ex
  })
}

function Dashboard({
  answers,
  setAnswers,
  theme,
  setTheme,
  onLogout,
  onRestart,
}: {
  answers: Answers
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>
  theme: Theme
  setTheme: (t: Theme) => void
  onLogout: () => void
  onRestart: () => void
}) {
  const [tab, setTab] = useState<Tab>('home')
  const [workoutDay, setWorkoutDay] = useState<SplitDay | null>(null)
  const [showSupps, setShowSupps] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const split = buildSplit(answers)
  const macros = macroTargets(answers)
  const rank = answers.gender === 'Female' ? 'Silver' : 'Bronze'

  if (workoutDay) {
    return <WorkoutSession day={workoutDay} answers={answers} onBack={() => setWorkoutDay(null)} />
  }

  if (showSupps) {
    return <SuppsStore onBack={() => setShowSupps(false)} />
  }

  if (showSettings) {
    return (
      <Settings
        answers={answers}
        setAnswers={setAnswers}
        split={split}
        theme={theme}
        setTheme={setTheme}
        onLogout={onLogout}
        onBack={() => setShowSettings(false)}
      />
    )
  }

  return (
    <div className="flex h-full flex-col bg-[var(--color-ink)]">
      <div className="flex-1 overflow-y-auto pb-24 pt-14">
        {tab === 'home' && <HomeTab answers={answers} split={split} macros={macros} rank={rank} onRestart={onRestart} onStart={setWorkoutDay} onOpenSupps={() => setShowSupps(true)} onOpenSettings={() => setShowSettings(true)} />}
        {tab === 'train' && <TrainTab answers={answers} split={split} onStart={setWorkoutDay} />}
        {tab === 'progress' && <ProgressTab split={split} />}
        {tab === 'nutrition' && <NutritionTab macros={macros} answers={answers} />}
        {tab === 'rank' && <RankTab rank={rank} />}
      </div>
      <TabBar tab={tab} setTab={setTab} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Settings — edit everything, theme, logout                         */
/* ------------------------------------------------------------------ */

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h2 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-volt)]">{title}</h2>
      <div className="rounded-2xl border border-[var(--color-hair)] bg-[var(--color-surface)] p-4">{children}</div>
    </div>
  )
}

function Settings({
  answers,
  setAnswers,
  split,
  theme,
  setTheme,
  onLogout,
  onBack,
}: {
  answers: Answers
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>
  split: SplitDay[]
  theme: Theme
  setTheme: (t: Theme) => void
  onLogout: () => void
  onBack: () => void
}) {
  // draft — pre-filled with current info; nothing is applied until "Save"
  const [draft, setDraft] = useState<Answers>(answers)
  const [draftOv, setDraftOv] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  const set = <K extends keyof Answers>(key: K, val: Answers[K]) => {
    setDraft((a) => ({ ...a, [key]: val }))
    setSaved(false)
  }
  const goals = draft.gender === 'Female' ? GOALS_FEMALE : GOALS_MALE

  // exercise customization (based on the draft split)
  const trainingDays = buildSplit(draft).filter((d) => !/recovery/i.test(d.name))
  const [openDay, setOpenDay] = useState<string | null>(null)
  const [swapAt, setSwapAt] = useState<number | null>(null)

  const activeDay = trainingDays.find((d) => d.name === openDay) ?? null
  const effOverrides = { ...loadExOverrides(), ...draftOv }
  const dayPool = activeDay ? poolFor(activeDay) : []
  const dayExercises = activeDay
    ? dayPool.map((ex, i) => {
        const nm = effOverrides[`${activeDay.name}#${i}`]
        return nm ? ALL_EXERCISES.find((e) => e.name === nm) ?? ex : ex
      })
    : []

  const applySwap = (index: number, exName: string) => {
    if (!activeDay) return
    setDraftOv((o) => ({ ...o, [`${activeDay.name}#${index}`]: exName }))
    setSwapAt(null)
    setSaved(false)
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(answers) || Object.keys(draftOv).length > 0

  const onSave = () => {
    setAnswers(draft)
    if (Object.keys(draftOv).length > 0) {
      const all = { ...loadExOverrides(), ...draftOv }
      try {
        localStorage.setItem(EX_OVERRIDE_KEY, JSON.stringify(all))
      } catch {
        /* storage unavailable */
      }
      setDraftOv({})
    }
    setSaved(true)
  }

  const pill = (active: boolean) =>
    'rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-all active:scale-95 ' +
    (active
      ? 'border-[var(--color-volt)] bg-[var(--color-volt)] text-[var(--color-onaccent)]'
      : 'border-[var(--color-hair)] bg-[var(--color-surface-2)] text-[var(--color-bone)] hover:border-[var(--color-ash)]/60')

  return (
    <div className="flex h-full flex-col bg-[var(--color-ink)]">
      {/* header */}
      <div className="flex items-center gap-4 px-6 pb-3 pt-14">
        <button
          onClick={onBack}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-hair)] bg-[var(--color-surface)] text-[var(--color-bone)] transition-colors hover:border-[var(--color-ash)]"
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" className="size-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth={2.4}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="font-display text-2xl font-extrabold uppercase text-[var(--color-bone)]">{useI18n().t('settings')}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32 pt-1">
        {/* PERSONAL INFO */}
        <SettingsSection title={useI18n().t('personalInfo')}>
          <div className="grid grid-cols-2 gap-3">
            <Input label={useI18n().t('heightCm')} inputMode="numeric" value={draft.height} onChange={(e) => set('height', e.target.value)} />
            <Input label={useI18n().t('weightKg')} inputMode="numeric" value={draft.weight} onChange={(e) => set('weight', e.target.value)} />
          </div>
          <div className="mt-3">
            <Input label={useI18n().t('age')} inputMode="numeric" value={draft.age} onChange={(e) => set('age', e.target.value)} />
          </div>
          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ash)]">{useI18n().t('activityLevel')}</p>
          <div className="flex flex-wrap gap-2">
            {ACTIVITIES.map((a) => (
              <button key={a} onClick={() => set('activity', a)} className={pill(draft.activity === a)}>{useI18n().t(a)}</button>
            ))}
          </div>
          <p className="mt-3 text-[12px] text-[var(--color-ash)]">{useI18n().t('updatingRecalculates')}</p>
        </SettingsSection>

        {/* GOAL */}
        <SettingsSection title={useI18n().t('objective')}>
          <div className="mb-3 flex gap-2">
            {[useI18n().t('male'), useI18n().t('female')].map((g) => (
              <button
                key={g}
                onClick={() => {
                  if (draft.gender !== g) set('goal', '')
                  set('gender', g)
                }}
                className={'flex-1 ' + pill(draft.gender === g)}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {goals.map((g) => (
              <button key={g} onClick={() => set('goal', g)} className={pill(draft.goal === g)}>{useI18n().t(g)}</button>
            ))}
          </div>
        </SettingsSection>

        {/* TRAINING PLAN */}
        <SettingsSection title={useI18n().t('trainingPlan')}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ash)]">Experience level</p>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <button key={l} onClick={() => set('level', l)} className={pill(draft.level === l)}>{useI18n().t(l)}</button>
            ))}
          </div>

          <div className="mt-5 mb-1 flex items-end justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ash)]">Days per week</span>
            <span className="font-display text-2xl font-extrabold text-[var(--color-volt)]">{draft.days}</span>
          </div>
          <input
            type="range" min={2} max={6} value={draft.days}
            onChange={(e) => set('days', Number(e.target.value))}
            className="w-full accent-[var(--color-volt)]"
          />
          <div className="flex justify-between px-1 text-[11px] font-semibold text-[var(--color-ash)]">
            {[2, 3, 4, 5, 6].map((n) => <span key={n} className={draft.days === n ? 'text-[var(--color-volt)]' : ''}>{n}</span>)}
          </div>

          <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ash)]">Session length</p>
          <div className="flex flex-wrap gap-2">
            {SESSIONS.map((s) => (
              <button key={s} onClick={() => set('session', s)} className={pill(draft.session === s)}>{useI18n().t(s)}</button>
            ))}
          </div>
          <p className="mt-3 text-[12px] text-[var(--color-ash)]">{useI18n().t('splitRebuilds')}</p>
        </SettingsSection>

        {/* CUSTOMIZE EXERCISES */}
        <SettingsSection title={useI18n().t('customizeExercises')}>
          <p className="-mt-1 mb-3 text-[12px] text-[var(--color-ash)]">{useI18n().t('splitRebuilds')}</p>
          <div className="flex flex-col gap-2">
            {trainingDays.map((d) => {
              const isOpen = openDay === d.name
              return (
                <div key={d.name} className="overflow-hidden rounded-xl border border-[var(--color-hair)] bg-[var(--color-surface-2)]">
                  <button
                    onClick={() => { setOpenDay(isOpen ? null : d.name); setSwapAt(null) }}
                    className="flex w-full items-center justify-between px-4 py-3 text-start"
                  >
                    <span>
                      <span className="block font-display text-base font-bold uppercase text-[var(--color-bone)]">{d.day} · {d.name}</span>
                      <span className="text-[11px] text-[var(--color-ash)]">{d.focus}</span>
                    </span>
                    <svg viewBox="0 0 24 24" className={'size-5 text-[var(--color-ash)] transition-transform ' + (isOpen ? 'rotate-180' : '')} fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[var(--color-hair)]">
                      {dayExercises.map((ex, i) => (
                        <div key={i} className="border-b border-[var(--color-hair)]/60 last:border-0">
                          <div className="flex items-center justify-between gap-2 px-4 py-2.5">
                            <div className="min-w-0">
                              <p className="truncate text-[14px] font-semibold text-[var(--color-bone)]">{ex.name}</p>
                              <p className="truncate text-[11px] text-[var(--color-ash)]">{ex.muscles.join(' · ')}</p>
                            </div>
                            <button
                              onClick={() => setSwapAt(swapAt === i ? null : i)}
                              className="shrink-0 rounded-lg border border-[var(--color-hair)] bg-[var(--color-surface)] px-3 py-1.5 text-[12px] font-semibold text-[var(--color-volt)]"
                            >
                              {swapAt === i ? useI18n().t('close') : useI18n().t('change')}
                            </button>
                          </div>
                          {swapAt === i && (
                            <div className="flex flex-col gap-1.5 bg-[var(--color-ink)]/40 px-4 pb-3 pt-1">
                              {dayPool.filter((alt) => alt.name !== ex.name).map((alt) => (
                                <button
                                  key={alt.name}
                                  onClick={() => applySwap(i, alt.name)}
                                  className="flex items-center justify-between rounded-lg border border-[var(--color-hair)] bg-[var(--color-surface)] px-3 py-2 text-start transition-colors hover:border-[var(--color-volt)]/60"
                                >
                                  <span className="min-w-0">
                                    <span className="block truncate text-[13px] font-semibold text-[var(--color-bone)]">{alt.name}</span>
                                    <span className="block truncate text-[10px] text-[var(--color-ash)]">{alt.muscles.join(' · ')}</span>
                                  </span>
                                  <span className="shrink-0 text-[11px] font-bold text-[var(--color-volt)]">{alt.sets}×{alt.reps}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </SettingsSection>

        {/* APPEARANCE */}
        <SettingsSection title={useI18n().t('appearance')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-base font-bold uppercase text-[var(--color-bone)]">{useI18n().t('appearance')}</p>
              <p className="text-[12px] text-[var(--color-ash)]">{theme === 'dark' ? useI18n().t('themeSomber') : useI18n().t('themeClear')}</p>
            </div>
            <div className="flex gap-1 rounded-full border border-[var(--color-hair)] bg-[var(--color-surface-2)] p-1">
              {(['dark', 'light'] as Theme[]).map((tm) => (
                <button
                  key={tm}
                  onClick={() => setTheme(tm)}
                  className={
                    'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors ' +
                    (theme === tm ? 'bg-[var(--color-volt)] text-[var(--color-onaccent)]' : 'text-[var(--color-ash)]')
                  }
                >
                  {tm === 'dark' ? '🌙' : '☀️'} {tm === 'dark' ? 'Somber' : 'Clear'}
                </button>
              ))}
            </div>
          </div>
        </SettingsSection>

        {/* ACCOUNT */}
        <SettingsSection title={useI18n().t('account')}>
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-[var(--color-volt)] font-display text-lg font-extrabold text-[var(--color-onaccent)]">FN</span>
            <div className="min-w-0">
              <p className="truncate font-display text-base font-bold uppercase text-[var(--color-bone)]">Fadi Nassraoui</p>
              <p className="truncate text-[12px] text-[var(--color-ash)]">{GYM_NAME}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 py-3 font-display text-sm font-bold uppercase tracking-wide text-red-400 transition-colors hover:bg-red-500/20"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.2}>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {useI18n().t('logout')}
          </button>
        </SettingsSection>
      </div>

      {/* sticky save bar */}
      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-[var(--color-hair)] bg-[var(--color-ink)]/95 px-6 pb-6 pt-3 backdrop-blur">
        <button
          onClick={onSave}
          disabled={!dirty}
          className={
            'w-full rounded-2xl py-4 font-display text-lg font-bold uppercase tracking-wide transition-all active:scale-[0.98] ' +
            (dirty
              ? 'bg-[var(--color-volt)] text-[var(--color-onaccent)] shadow-[0_10px_30px_-8px_rgba(255,210,0,0.55)]'
              : saved
                ? 'bg-[var(--color-volt)]/15 text-[var(--color-volt)]'
                : 'bg-[var(--color-surface)] text-[var(--color-ash)]')
          }
        >
          {dirty ? useI18n().t('saveChanges') : saved ? useI18n().t('saved') : useI18n().t('upToDate')}
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Yari Supps — in-gym supplement store                              */
/* ------------------------------------------------------------------ */

type Supp = {
  name: string
  brand: string
  category: string
  price: number
  size: string
  blurb: string
  emoji: string
  img?: string
  tag?: string
}

const SUPP_CATEGORIES = ['All', 'Creatine', 'Gainer', 'Recovery', 'Boosters'] as const

const SUPPS: Supp[] = [
  { name: 'Red Rex Creatine 5000', brand: 'Big Ramy Labs', category: 'Creatine', price: 85, size: '300 g · 60 servings', blurb: '5000 mg creatine per serve for raw strength, power and fuller pumps.', emoji: '⚡', img: suppCreatine, tag: 'New' },
  { name: 'Red Rex Glutamine 5000', brand: 'Big Ramy Labs', category: 'Recovery', price: 80, size: '300 g · 60 servings', blurb: '5000 mg L-glutamine to speed recovery and protect muscle.', emoji: '💧', img: suppGlutamine },
  { name: 'Red Rex Beef Mass Plus', brand: 'Big Ramy Labs', category: 'Gainer', price: 240, size: '2.7 kg · 8 servings', blurb: '1340 kcal, 50 g protein, 282 g carbs + creatine HCL. Chocolate peanut butter.', emoji: '🏋️', img: suppBeefMass, tag: 'Bulk' },
  { name: 'Red Rex Beef Aminos', brand: 'Big Ramy Labs', category: 'Recovery', price: 130, size: '300 tablets', blurb: 'Beef-derived aminos for muscle building & repair between sessions.', emoji: '🧬', img: suppBeefAminos },
  { name: 'Anabol Hardcore', brand: 'Nutrex Research', category: 'Boosters', price: 160, size: '60 liqui-caps', blurb: 'Anabolic activator to support strength, size and hard training.', emoji: '🔩', img: suppAnabol, tag: 'Hardcore' },
  { name: 'Thunder Gain', brand: 'Challenger Nutrition', category: 'Gainer', price: 210, size: '5.4 kg · 16 servings', blurb: '1300+ kcal, 50 g protein, 261 g carbs. Superior-taste chocolate mass.', emoji: '🍫', img: suppThunderGain, tag: 'Value' },
]

/* ------------------------------------------------------------------ */
/* Charge (PR) logging — persisted per exercise for overload tracking */
/* ------------------------------------------------------------------ */

type ChargeLog = { best: number; last: number; date: string }
const PR_KEY = 'yari.charges.v1'

function loadCharges(): Record<string, ChargeLog> {
  try {
    return JSON.parse(localStorage.getItem(PR_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveCharge(name: string, kg: number): ChargeLog {
  const all = loadCharges()
  const prev = all[name]
  const entry: ChargeLog = {
    best: Math.max(kg, prev?.best ?? 0),
    last: kg,
    date: new Date().toISOString().slice(0, 10),
  }
  all[name] = entry
  try {
    localStorage.setItem(PR_KEY, JSON.stringify(all))
  } catch {
    /* storage unavailable — keep in-memory only */
  }
  return entry
}

/* ------------------------------------------------------------------ */
/* Workout session — exercises + video tutorials                     */
/* ------------------------------------------------------------------ */

function WorkoutSession({ day, answers, onBack }: { day: SplitDay; answers: Answers; onBack: () => void }) {
  const exercises = exercisesFor(day)
  const [video, setVideo] = useState<Exercise | null>(null)
  const [done, setDone] = useState<Set<number>>(new Set())
  const [charges, setCharges] = useState<Record<string, ChargeLog>>(() => loadCharges())
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [newPr, setNewPr] = useState<Set<string>>(new Set())

  const toggleDone = (i: number) =>
    setDone((s) => {
      const next = new Set(s)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  const logCharge = (name: string) => {
    const kg = parseFloat(drafts[name])
    if (!Number.isFinite(kg) || kg <= 0) return
    const prevBest = charges[name]?.best ?? 0
    const entry = saveCharge(name, kg)
    setCharges((c) => ({ ...c, [name]: entry }))
    setDrafts((d) => ({ ...d, [name]: '' }))
    if (kg > prevBest) {
      setNewPr((s) => new Set(s).add(name))
      setTimeout(() => setNewPr((s) => {
        const n = new Set(s)
        n.delete(name)
        return n
      }), 2500)
    }
  }

  return (
    <div className="flex h-full flex-col bg-[var(--color-ink)]">
      {/* header */}
      <div className="flex items-center gap-4 px-6 pb-3 pt-14">
        <button
          onClick={onBack}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-hair)] bg-[var(--color-surface)] text-[var(--color-bone)] transition-colors hover:border-[var(--color-ash)]"
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" className="size-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth={2.4}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-volt)]">{day.day} · {day.focus}</p>
          <h1 className="truncate font-display text-2xl font-extrabold uppercase text-[var(--color-bone)]">{day.name}</h1>
        </div>
      </div>

      {/* progress */}
      <div className="px-6 pb-3">
        <div className="mb-1.5 flex justify-between text-[12px] text-[var(--color-ash)]">
          <span>{done.size} / {exercises.length} done</span>
          <span>{answers.session || '60 min'}</span>
        </div>
        <ProgressBar value={(done.size / exercises.length) * 100} />
      </div>

      {/* exercises */}
      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-2">
        <div className="flex flex-col gap-3">
          {exercises.map((ex, i) => (
            <div
              key={ex.name}
              className={
                'overflow-hidden rounded-2xl border transition-colors ' +
                (done.has(i) ? 'border-[var(--color-volt)]/40 bg-[var(--color-volt)]/5' : 'border-[var(--color-hair)] bg-[var(--color-surface)]')
              }
            >
              <div className="flex gap-3 p-3">
                {/* video thumbnail */}
                <button
                  onClick={() => setVideo(ex)}
                  className="group relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl bg-black"
                  aria-label={`Play tutorial for ${ex.name}`}
                >
                  <img
                    src={`https://img.youtube.com/vi/${ex.yt}/mqdefault.jpg`}
                    alt=""
                    className="size-full object-cover opacity-70 transition group-hover:opacity-90"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex size-9 items-center justify-center rounded-full bg-[var(--color-volt)] text-[var(--color-onaccent)] shadow-lg transition group-hover:scale-110">
                      <svg viewBox="0 0 24 24" className="size-4 translate-x-[1px]" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  </span>
                </button>

                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg font-bold uppercase leading-tight text-[var(--color-bone)]">{ex.name}</h3>
                      <span className="shrink-0 font-display text-sm font-bold text-[var(--color-volt)]">{ex.sets}×{ex.reps}</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {ex.muscles.map((m) => (
                        <span key={m} className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ash)]">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* charge / PR logging */}
              <div className="border-t border-[var(--color-hair)]/70 px-3 py-2.5">
                <div className="mb-1.5 flex items-center justify-between text-[11px]">
                  <span className="font-semibold uppercase tracking-wide text-[var(--color-ash)]">Charge used</span>
                  <span className="flex items-center gap-2">
                    {newPr.has(ex.name) && (
                      <span className="rounded-full bg-[var(--color-volt)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[var(--color-onaccent)]">
                        New PR!
                      </span>
                    )}
                    {charges[ex.name] ? (
                      <span className="text-[var(--color-ash)]">
                        Last <b className="text-[var(--color-bone)]">{charges[ex.name].last} kg</b> · PR{' '}
                        <b className="text-[var(--color-volt)]">{charges[ex.name].best} kg</b>
                      </span>
                    ) : (
                      <span className="text-[var(--color-ash)]/70">No record yet</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center rounded-xl border border-[var(--color-hair)] bg-[var(--color-ink)] px-3">
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.5"
                      value={drafts[ex.name] ?? ''}
                      onChange={(e) => setDrafts((d) => ({ ...d, [ex.name]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && logCharge(ex.name)}
                      placeholder={charges[ex.name] ? String(charges[ex.name].last) : '0'}
                      className="w-full bg-transparent py-2 text-[15px] font-semibold text-[var(--color-bone)] outline-none placeholder:text-[var(--color-ash)]/50"
                    />
                    <span className="text-[12px] font-semibold text-[var(--color-ash)]">kg</span>
                  </div>
                    <button
                      onClick={() => logCharge(ex.name)}
                      className="shrink-0 rounded-xl bg-[var(--color-volt)] px-4 py-2 font-display text-sm font-bold uppercase tracking-wide text-[var(--color-onaccent)] transition active:scale-95 disabled:opacity-35"
                      disabled={!drafts[ex.name] || parseFloat(drafts[ex.name]) <= 0}
                    >
                      {useI18n().t('save')}
                    </button>
                </div>
              </div>

              <div className="flex border-t border-[var(--color-hair)]/70">
                <button
                  onClick={() => setVideo(ex)}
                  className="flex flex-1 items-center justify-center gap-2 py-2.5 text-[13px] font-semibold text-[var(--color-bone)] transition-colors hover:bg-[var(--color-surface-2)]"
                >
                  <svg viewBox="0 0 24 24" className="size-4 text-[var(--color-volt)]" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  {useI18n().t('watchTutorial')}
                </button>
                <button
                  onClick={() => toggleDone(i)}
                  className={
                    'flex flex-1 items-center justify-center gap-2 border-s border-[var(--color-hair)]/70 py-2.5 text-[13px] font-semibold transition-colors ' +
                    (done.has(i) ? 'text-[var(--color-volt)]' : 'text-[var(--color-ash)] hover:bg-[var(--color-surface-2)]')
                  }
                >
                  <span className={'flex size-4 items-center justify-center rounded-full border-2 ' + (done.has(i) ? 'border-[var(--color-volt)] bg-[var(--color-volt)]' : 'border-[var(--color-ash)]')}>
                    {done.has(i) && (
                      <svg viewBox="0 0 24 24" className="size-2.5 text-[var(--color-onaccent)]" fill="none" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                  </span>
                  {done.has(i) ? useI18n().t('done') : useI18n().t('markDone')}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onBack}
          className="mt-5 w-full rounded-2xl bg-[var(--color-volt)] py-4 font-display text-lg font-bold uppercase tracking-wide text-[var(--color-onaccent)] shadow-[0_10px_30px_-8px_rgba(255,210,0,0.55)] transition active:scale-[0.98]"
        >
          {done.size === exercises.length ? useI18n().t('finishSessionDone') : useI18n().t('finishSession')}
        </button>
      </div>

      {video && <VideoModal exercise={video} onClose={() => setVideo(null)} />}
    </div>
  )
}

function VideoModal({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="rounded-t-3xl border-t border-[var(--color-hair)] bg-[var(--color-surface)] p-5 pb-8"
        style={{ animation: 'rise 0.3s ease-out both' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--color-hair)]" />
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-extrabold uppercase text-[var(--color-bone)]">{exercise.name}</h3>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {exercise.muscles.map((m) => (
                <span key={m} className="rounded-full bg-[var(--color-volt)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-volt)]">{m}</span>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-ash)] transition hover:text-[var(--color-bone)]" aria-label="Close">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
          <iframe
            className="size-full"
            src={`https://www.youtube-nocookie.com/embed/${exercise.yt}?autoplay=1&rel=0`}
            title={`${exercise.name} tutorial`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="mt-3 text-center text-[12px] text-[var(--color-ash)]">Filmed at {GYM_NAME} · Coach Fadi</p>
      </div>
    </div>
  )
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 mt-7 flex items-end justify-between">
      <h3 className="font-display text-xl font-bold uppercase tracking-wide text-[var(--color-bone)]">{children}</h3>
      {action}
    </div>
  )
}

function Ring({ pct, label, value, sub }: { pct: number; label: string; value: string; sub: string }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center">
      <div className="relative size-24">
        <svg viewBox="0 0 80 80" className="size-24 -rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="var(--color-hair)" strokeWidth={7} />
          <circle
            cx="40" cy="40" r={r} fill="none" stroke="var(--color-volt)" strokeWidth={7} strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c - (c * Math.min(100, pct)) / 100}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-extrabold leading-none text-[var(--color-bone)]">{value}</span>
          <span className="text-[10px] uppercase tracking-wide text-[var(--color-ash)]">{sub}</span>
        </div>
      </div>
      <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ash)]">{label}</span>
    </div>
  )
}

function HomeTab({ answers, split, macros, rank, onRestart, onStart, onOpenSupps, onOpenSettings }: { answers: Answers; split: ReturnType<typeof buildSplit>; macros: ReturnType<typeof macroTargets>; rank: string; onRestart: () => void; onStart: (d: SplitDay) => void; onOpenSupps: () => void; onOpenSettings: () => void }) {
  const { t } = useI18n()
  const today = split.find((d) => !d.done) ?? split[0]
  const doneCount = split.filter((d) => d.done).length
  const eaten = Math.round(macros.kcal * 0.46)
  return (
    <div className="px-6" style={{ animation: 'rise 0.4s ease-out both' }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-ash)]">{useI18n().t('goodMorning')}</p>
          <h1 className="font-display text-3xl font-extrabold uppercase text-[var(--color-bone)]">Fadi</h1>
          <p className="mt-1 text-[12px] text-[var(--color-ash)]">{t('gymNamePlaceholder')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onRestart} className="flex items-center gap-2 rounded-full border border-[var(--color-hair)] bg-[var(--color-surface)] py-2 pl-2 pr-3">
            <RankBadge rank={rank} size={30} />
            <span className="font-display text-sm font-bold uppercase text-[var(--color-bone)]">{rank}</span>
          </button>
          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="flex size-10 items-center justify-center rounded-full border border-[var(--color-hair)] bg-[var(--color-surface)] text-[var(--color-bone)] transition-colors hover:border-[var(--color-volt)]/60"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Today's workout hero */}
      <SectionTitle>{t('todaysSession')}</SectionTitle>
      <div className="overflow-hidden rounded-2xl border border-[var(--color-volt)]/30 bg-gradient-to-br from-[var(--color-volt)]/15 to-[var(--color-surface)]">
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-volt)]">
            <span className="size-1.5 rounded-full bg-[var(--color-volt)]" /> {today.day} · {today.focus}
          </div>
          <h2 className="mt-2 font-display text-3xl font-extrabold uppercase leading-none text-[var(--color-bone)]">{today.name}</h2>
          <div className="mt-3 flex gap-5 text-sm text-[var(--color-ash)]">
            <span><b className="text-[var(--color-bone)]">{exercisesFor(today).length}</b> exercises</span>
            <span><b className="text-[var(--color-bone)]">{answers.session || '60 min'}</b></span>
            <span><b className="text-[var(--color-bone)]">~{today.kcal}</b> kcal</span>
          </div>
            <button onClick={() => onStart(today)} className="mt-4 w-full rounded-xl bg-[var(--color-volt)] py-3.5 font-display text-base font-bold uppercase tracking-wide text-[var(--color-onaccent)] transition active:scale-[0.98]">
            {t('startWorkout')}
          </button>
        </div>
      </div>

      {/* Yari Supps promo */}
      <button
        onClick={onOpenSupps}
        className="mt-4 flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-[var(--color-hair)] bg-gradient-to-r from-[var(--color-surface-2)] to-[var(--color-surface)] p-4 text-start transition active:scale-[0.99] hover:border-[var(--color-volt)]/50"
      >
        <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black">
          <img src={yariSuppsLogo} alt="Yari Supps" className="size-full object-cover" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg font-bold uppercase leading-none text-[var(--color-bone)]">Yari Supps</span>
          <span className="mt-1 block text-[12px] text-[var(--color-ash)]">{t('suppsBlurb')}</span>
        </span>
        <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-[var(--color-volt)] rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth={2.4}>
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Rings */}
      <SectionTitle>{t('todaysTargets')}</SectionTitle>
      <div className="flex justify-around rounded-2xl border border-[var(--color-hair)] bg-[var(--color-surface)] py-5">
        <Ring pct={(eaten / macros.kcal) * 100} label={t('calories')} value={`${(eaten / 1000).toFixed(1)}k`} sub={`/${(macros.kcal / 1000).toFixed(1)}k`} />
        <Ring pct={62} label={t('protein')} value="118" sub={`/${macros.protein}g`} />
        <Ring pct={(doneCount / split.length) * 100} label={t('workouts')} value={`${doneCount}`} sub={`/${split.length}`} />
      </div>

      {/* Streak / stats */}
      <SectionTitle>{t('thisWeek')}</SectionTitle>
      <div className="grid grid-cols-3 gap-3">
        {[['🔥', '12', 'Day streak'], ['🏋️', `${doneCount}`, 'Sessions'], ['📈', '+2.4kg', 'Lifted avg']].map(([i, v, l]) => (
          <div key={l} className="rounded-2xl border border-[var(--color-hair)] bg-[var(--color-surface)] p-4">
            <div className="text-xl">{i}</div>
            <div className="mt-2 font-display text-2xl font-extrabold text-[var(--color-bone)]">{v}</div>
            <div className="text-[11px] text-[var(--color-ash)]">{l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrainTab({ answers, split, onStart }: { answers: Answers; split: ReturnType<typeof buildSplit>; onStart: (d: SplitDay) => void }) {
  const { t } = useI18n()
  return (
    <div className="px-6" style={{ animation: 'rise 0.4s ease-out both' }}>
      <h1 className="font-display text-3xl font-extrabold uppercase text-[var(--color-bone)]">{t('yourSplit')}</h1>
      <p className="mt-1 text-[13px] text-[var(--color-ash)]">
        {answers.days}-day plan · {answers.goal || 'Custom goal'} · {answers.level || 'Tailored'}
      </p>
      <div className="mt-5 flex flex-col gap-3">
        {split.map((d) => (
          <button
            key={d.day}
            onClick={() => onStart(d)}
            className={
              'flex w-full items-center gap-4 rounded-2xl border p-4 text-start transition-colors active:scale-[0.99] ' +
              (d.done ? 'border-[var(--color-hair)] bg-[var(--color-surface)]/60' : 'border-[var(--color-hair)] bg-[var(--color-surface)] hover:border-[var(--color-ash)]/60')
            }
          >
            <div className={'flex size-12 shrink-0 flex-col items-center justify-center rounded-xl font-display font-bold uppercase ' + (d.done ? 'bg-[var(--color-volt)]/15 text-[var(--color-volt)]' : 'bg-[var(--color-surface-2)] text-[var(--color-bone)]')}>
              <span className="text-[15px] leading-none">{d.day}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg font-bold uppercase text-[var(--color-bone)]">{d.name}</p>
              <p className="text-[12px] text-[var(--color-ash)]">{d.focus} · {exercisesFor(d).length} exercises</p>
            </div>
            {d.done ? (
              <span className="flex items-center gap-1 rounded-full bg-[var(--color-volt)]/15 px-3 py-1 text-[11px] font-bold uppercase text-[var(--color-volt)]">Done</span>
            ) : (
              <span className="text-lg text-[var(--color-ash)] rtl:rotate-180">›</span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-dashed border-[var(--color-hair)] p-4 text-center text-[12px] text-[var(--color-ash)]">
        Exercises are matched to {GYM_NAME}&apos;s machines.
      </div>
    </div>
  )
}

function NutritionTab({ macros, answers }: { macros: ReturnType<typeof macroTargets>; answers: Answers }) {
  const { t } = useI18n()
  const bars = [
    ['Protein', macros.protein, 118, 'g'],
    ['Carbs', macros.carbs, Math.round(macros.carbs * 0.4), 'g'],
    ['Fat', macros.fat, Math.round(macros.fat * 0.5), 'g'],
  ] as const

  // Local halal staples — per common portion: kcal, protein g, carbs g, fat g.
  type Food = { name: string; portion: string; kcal: number; p: number; c: number; f: number }
  const foodGroups: { group: string; items: Food[] }[] = [
    {
      group: 'Protein',
      items: [
        { name: 'Eggs', portion: '2 large', kcal: 143, p: 13, c: 1, f: 10 },
        { name: 'Canned tuna', portion: '100 g', kcal: 116, p: 26, c: 0, f: 1 },
        { name: 'Sardines', portion: '100 g', kcal: 208, p: 25, c: 0, f: 11 },
        { name: 'Chicken breast', portion: '100 g', kcal: 165, p: 31, c: 0, f: 4 },
        { name: 'Greek / raïb yogurt', portion: '170 g', kcal: 100, p: 17, c: 6, f: 0 },
        { name: 'Chickpeas (cooked)', portion: '100 g', kcal: 164, p: 9, c: 27, f: 3 },
        { name: 'Lentils (cooked)', portion: '100 g', kcal: 116, p: 9, c: 20, f: 0 },
      ],
    },
    {
      group: 'Carbs',
      items: [
        { name: 'Khobz (bread)', portion: '100 g', kcal: 265, p: 9, c: 49, f: 3 },
        { name: 'Couscous (cooked)', portion: '100 g', kcal: 112, p: 4, c: 23, f: 0 },
        { name: 'Rice (cooked)', portion: '100 g', kcal: 130, p: 3, c: 28, f: 0 },
        { name: 'Oats', portion: '50 g', kcal: 190, p: 7, c: 33, f: 3 },
        { name: 'Potato', portion: '150 g', kcal: 116, p: 3, c: 26, f: 0 },
        { name: 'Banana', portion: '1 medium', kcal: 105, p: 1, c: 27, f: 0 },
        { name: 'Dates', portion: '3 pcs', kcal: 60, p: 0, c: 16, f: 0 },
      ],
    },
    {
      group: 'Fats',
      items: [
        { name: 'Olive oil', portion: '1 tbsp', kcal: 119, p: 0, c: 0, f: 14 },
        { name: 'Almonds', portion: '30 g', kcal: 173, p: 6, c: 6, f: 15 },
        { name: 'Peanuts', portion: '30 g', kcal: 170, p: 7, c: 5, f: 14 },
        { name: 'Avocado', portion: '1/2 fruit', kcal: 120, p: 1, c: 6, f: 11 },
      ],
    },
  ]

  return (
    <div className="px-6" style={{ animation: 'rise 0.4s ease-out both' }}>
      <h1 className="font-display text-3xl font-extrabold uppercase text-[var(--color-bone)]">{t('nutritionHeader')}</h1>
      <p className="mt-1 text-[13px] text-[var(--color-ash)]">
        Halal · Local &amp; budget-friendly
      </p>

      <div className="mt-5 rounded-2xl border border-[var(--color-hair)] bg-[var(--color-surface)] p-5 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-ash)]">Daily calories</p>
        <p className="font-display text-6xl font-extrabold text-[var(--color-volt)]">{macros.kcal}</p>
        <p className="text-[12px] text-[var(--color-ash)]">kcal target</p>
      </div>

      <SectionTitle>Macros</SectionTitle>
      <div className="flex flex-col gap-4">
        {bars.map(([label, target, eaten, unit]) => (
          <div key={label}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="font-semibold text-[var(--color-bone)]">{label}</span>
              <span className="text-[var(--color-ash)]">{eaten} / {target}{unit}</span>
            </div>
            <ProgressBar value={(eaten / target) * 100} />
          </div>
        ))}
      </div>

      <SectionTitle>Food basics</SectionTitle>
      <p className="-mt-2 mb-3 text-[12px] text-[var(--color-ash)]">Per portion · build your own meals from local halal staples.</p>
      <div className="flex flex-col gap-5">
        {foodGroups.map(({ group, items }) => (
          <div key={group}>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-volt)]">{group}</p>
            <div className="overflow-hidden rounded-2xl border border-[var(--color-hair)] bg-[var(--color-surface)]">
              <div className="flex items-center gap-2 border-b border-[var(--color-hair)]/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ash)]">
                <span className="flex-1">Food</span>
                <span className="w-12 text-right">Kcal</span>
                <span className="w-9 text-right">P</span>
                <span className="w-9 text-right">C</span>
                <span className="w-9 text-right">F</span>
              </div>
              {items.map((f, i) => (
                <div key={f.name} className={'flex items-center gap-2 px-4 py-2.5 ' + (i > 0 ? 'border-t border-[var(--color-hair)]/60' : '')}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-[var(--color-bone)]">{f.name}</p>
                    <p className="text-[11px] text-[var(--color-ash)]">{f.portion}</p>
                  </div>
                  <span className="w-12 text-right font-display text-[15px] font-bold text-[var(--color-volt)]">{f.kcal}</span>
                  <span className="w-9 text-right text-[13px] text-[var(--color-bone)]">{f.p}g</span>
                  <span className="w-9 text-right text-[13px] text-[var(--color-ash)]">{f.c}g</span>
                  <span className="w-9 text-right text-[13px] text-[var(--color-ash)]">{f.f}g</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-[12px] text-[var(--color-ash)]">
        P = protein · C = carbs · F = fat. Hit your daily targets with the foods you like.
      </p>
    </div>
  )
}

const RANK_LADDER = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'GM']

function RankTab({ rank }: { rank: string }) {
  const { t } = useI18n()
  const idx = RANK_LADDER.indexOf(rank)
  return (
    <div className="px-6" style={{ animation: 'rise 0.4s ease-out both' }}>
      <h1 className="font-display text-3xl font-extrabold uppercase text-[var(--color-bone)]">{t('yourRank')}</h1>
      <div className="mt-5 flex flex-col items-center rounded-2xl border border-[var(--color-hair)] bg-gradient-to-b from-[var(--color-surface-2)] to-[var(--color-surface)] py-8">
        <div style={{ animation: 'volt-pulse 2.6s ease-in-out infinite' }}>
          <RankBadge rank={rank} size={110} />
        </div>
        <p className="mt-4 font-display text-3xl font-extrabold uppercase text-[var(--color-bone)]">{rank}</p>
        <p className="text-[12px] text-[var(--color-ash)]">340 XP to {RANK_LADDER[Math.min(idx + 1, RANK_LADDER.length - 1)]}</p>
        <div className="mt-4 w-56"><ProgressBar value={64} /></div>
      </div>

      <SectionTitle>Rank ladder</SectionTitle>
      <div className="grid grid-cols-4 gap-3">
        {RANK_LADDER.map((r, i) => (
          <div key={r} className={'flex flex-col items-center gap-1.5 rounded-xl border p-3 ' + (i <= idx ? 'border-[var(--color-volt)]/40 bg-[var(--color-surface)]' : 'border-[var(--color-hair)] bg-[var(--color-surface)]/40 opacity-45')}>
            <RankBadge rank={r} size={38} />
            <span className="text-[10px] font-semibold uppercase text-[var(--color-ash)]">{r}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-[12px] text-[var(--color-ash)]">Earn XP by completing sessions and hitting macro targets.</p>
    </div>
  )
}

function ProgressTab({ split }: { split: SplitDay[] }) {
  const charges = loadCharges()

  // training days only (skip recovery/rest), with their exercises
  const days = split
    .map((d) => ({ day: d, exercises: exercisesFor(d) }))
    .filter((x) => !/recovery/i.test(x.day.name))

  const logged = Object.keys(charges).length
  const bestPr = Object.values(charges).reduce((m, c) => Math.max(m, c.best), 0)

  return (
    <div className="px-6" style={{ animation: 'rise 0.4s ease-out both' }}>
      <h1 className="font-display text-3xl font-extrabold uppercase text-[var(--color-bone)]">Charge Log</h1>
      <p className="mt-1 text-[13px] text-[var(--color-ash)]">Every weight you lift, tracked for overload.</p>

      {/* summary */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[var(--color-hair)] bg-[var(--color-surface)] p-4">
          <p className="font-display text-3xl font-extrabold text-[var(--color-volt)]">{logged}</p>
          <p className="text-[12px] text-[var(--color-ash)]">exercises logged</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-hair)] bg-[var(--color-surface)] p-4">
          <p className="font-display text-3xl font-extrabold text-[var(--color-bone)]">{bestPr || '—'}<span className="text-lg text-[var(--color-ash)]">{bestPr ? ' kg' : ''}</span></p>
          <p className="text-[12px] text-[var(--color-ash)]">heaviest PR</p>
        </div>
      </div>

      {logged === 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-[var(--color-hair)] bg-[var(--color-surface)]/50 p-5 text-center">
          <p className="text-[13px] text-[var(--color-ash)]">No charges saved yet. Start a workout and hit <b className="text-[var(--color-bone)]">Save</b> after each exercise to build your log.</p>
        </div>
      )}

      {days.map(({ day, exercises }) => (
        <div key={day.day} className="mt-6">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-bold uppercase text-[var(--color-bone)]">{day.day} · {day.name}</h2>
            <span className="text-[11px] uppercase tracking-wide text-[var(--color-ash)]">{day.focus}</span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[var(--color-hair)] bg-[var(--color-surface)]">
            {exercises.map((ex, i) => {
              const c = charges[ex.name]
              return (
                <div
                  key={ex.name}
                  className={'flex items-center justify-between gap-3 px-4 py-3 ' + (i > 0 ? 'border-t border-[var(--color-hair)]/70' : '')}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-[var(--color-bone)]">{ex.name}</p>
                    <p className="text-[11px] text-[var(--color-ash)]">{ex.sets}×{ex.reps}{c ? ` · updated ${c.date}` : ''}</p>
                  </div>
                  {c ? (
                    <div className="flex shrink-0 items-center gap-3 text-right">
                      <div>
                        <p className="font-display text-base font-bold text-[var(--color-bone)]">{c.last}<span className="text-[11px] text-[var(--color-ash)]"> kg</span></p>
                        <p className="text-[10px] uppercase tracking-wide text-[var(--color-ash)]">last</p>
                      </div>
                      <div className="rounded-lg bg-[var(--color-volt)]/10 px-2.5 py-1">
                        <p className="font-display text-base font-bold text-[var(--color-volt)]">{c.best}<span className="text-[11px]"> kg</span></p>
                        <p className="text-[10px] uppercase tracking-wide text-[var(--color-volt)]/70">PR</p>
                      </div>
                    </div>
                  ) : (
                    <span className="shrink-0 text-[12px] text-[var(--color-ash)]/60">not logged</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function SuppsStore({ onBack }: { onBack: () => void }) {
  const [cat, setCat] = useState<(typeof SUPP_CATEGORIES)[number]>('All')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [reserved, setReserved] = useState(false)

  const items = cat === 'All' ? SUPPS : SUPPS.filter((s) => s.category === cat)
  const add = (name: string) => setCart((c) => ({ ...c, [name]: (c[name] ?? 0) + 1 }))
  const remove = (name: string) =>
    setCart((c) => {
      const n = { ...c }
      if ((n[name] ?? 0) <= 1) delete n[name]
      else n[name] -= 1
      return n
    })

  const count = Object.values(cart).reduce((a, b) => a + b, 0)
  const total = SUPPS.reduce((sum, s) => sum + (cart[s.name] ?? 0) * s.price, 0)

  return (
    <div className="flex h-full flex-col bg-[var(--color-ink)]">
      {/* header */}
      <div className="flex items-center gap-4 px-6 pb-3 pt-14">
        <button
          onClick={onBack}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-hair)] bg-[var(--color-surface)] text-[var(--color-bone)] transition-colors hover:border-[var(--color-ash)]"
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" className="size-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth={2.4}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black">
          <img src={yariSuppsLogo} alt="Yari Supps" className="size-full object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-volt)]">{useI18n().t('inGymStore')}</p>
          <h1 className="truncate font-display text-2xl font-extrabold uppercase text-[var(--color-bone)]">Yari Supps</h1>
        </div>
      </div>

      {/* category filter */}
      <div className="flex gap-2 overflow-x-auto px-6 pb-3 pt-1">
        {SUPP_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={
              'shrink-0 rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-all ' +
              (cat === c
                ? 'border-[var(--color-volt)] bg-[var(--color-volt)] text-[var(--color-onaccent)]'
                : 'border-[var(--color-hair)] bg-[var(--color-surface)] text-[var(--color-bone)]')
            }
          >
            {c}
          </button>
        ))}
      </div>

      {/* products */}
      <div className="flex-1 overflow-y-auto px-6 pb-32 pt-2">
        <div className="grid grid-cols-2 gap-3">
          {items.map((s) => {
            const qty = cart[s.name] ?? 0
            return (
              <div key={s.name} className="flex flex-col overflow-hidden rounded-2xl border border-[var(--color-hair)] bg-[var(--color-surface)]">
                <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-ink)] text-5xl">
                  {s.img ? (
                    <img src={s.img} alt={s.name} className="size-full object-contain p-3" />
                  ) : (
                    s.emoji
                  )}
                  {s.tag && (
                    <span className="absolute left-2 top-2 rounded-full bg-[var(--color-volt)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[var(--color-onaccent)]">
                      {s.tag}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <p className="text-[10px] uppercase tracking-wide text-[var(--color-volt)]">{s.brand}</p>
                  <h3 className="mt-0.5 font-display text-base font-bold uppercase leading-tight text-[var(--color-bone)]">{s.name}</h3>
                  <p className="mt-0.5 text-[11px] text-[var(--color-ash)]">{s.size}</p>
                  <p className="mt-1.5 flex-1 text-[11px] leading-snug text-[var(--color-ash)]">{s.blurb}</p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="font-display text-lg font-extrabold text-[var(--color-volt)]">{s.price} <span className="text-[11px] text-[var(--color-ash)]">{CURRENCY}</span></span>
                    {qty === 0 ? (
                      <button
                        onClick={() => add(s.name)}
                        className="rounded-lg bg-[var(--color-volt)] px-3 py-1.5 font-display text-[13px] font-bold uppercase text-[var(--color-onaccent)] transition active:scale-95"
                      >
                        {useI18n().t('add')}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 rounded-lg border border-[var(--color-hair)] bg-[var(--color-ink)] px-1.5 py-1">
                        <button onClick={() => remove(s.name)} className="flex size-6 items-center justify-center rounded text-lg font-bold text-[var(--color-bone)]">−</button>
                        <span className="min-w-4 text-center font-display text-sm font-bold text-[var(--color-bone)]">{qty}</span>
                        <button onClick={() => add(s.name)} className="flex size-6 items-center justify-center rounded text-lg font-bold text-[var(--color-volt)]">+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

            <p className="mt-5 text-center text-[12px] text-[var(--color-ash)]">
          Reserve online · pay & pick up at {GYM_NAME} front desk.
        </p>
      </div>

      {/* cart bar */}
      {count > 0 && (
        <div className="absolute inset-x-0 bottom-0 z-30 border-t border-[var(--color-hair)] bg-[var(--color-ink)]/95 px-6 pb-6 pt-3 backdrop-blur" style={{ animation: 'rise 0.3s ease-out both' }}>
          {reserved ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-volt)]/15 py-4 text-center">
              <span className="text-lg">✓</span>
              <span className="font-display text-sm font-bold uppercase text-[var(--color-volt)]">Reserved — pick up at the front desk</span>
            </div>
          ) : (
            <button
              onClick={() => setReserved(true)}
              className="flex w-full items-center justify-between rounded-2xl bg-[var(--color-volt)] px-5 py-4 text-[var(--color-onaccent)] transition active:scale-[0.98]"
            >
              <span className="flex items-center gap-2 font-display text-base font-bold uppercase tracking-wide">
                <span className="flex size-6 items-center justify-center rounded-full bg-[var(--color-ink)] text-[12px] font-extrabold text-[var(--color-volt)]">{count}</span>
                {useI18n().t('reserveOrderButton')}
              </span>
              <span className="font-display text-lg font-extrabold">{total} {CURRENCY}</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: [Tab, string, string][] = [
    ['home', useI18n().t('tab_home'), 'M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z'],
    ['train', useI18n().t('tab_train'), 'M4 9h2v6H4zm14 0h2v6h-2zM7 11h10v2H7zM2 10h2v4H2zm18 0h2v4h-2z'],
    ['progress', useI18n().t('tab_progress'), 'M4 20V10m5 10V4m5 16v-7m5 7V8'],
    ['nutrition', useI18n().t('tab_nutrition'), 'M7 3v7a3 3 0 006 0V3m-3 11v7M17 3c-1.5 2-2 4-2 7s.5 5 2 7'],
    ['rank', useI18n().t('tab_rank'), 'M12 2l3 6 6 .5-4.5 4 1.5 6L12 15l-6 3.5 1.5-6L3 8.5 9 8z'],
  ]
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-[var(--color-hair)] bg-[var(--color-ink)]/95 px-4 pb-6 pt-3 backdrop-blur">
      {items.map(([id, label, path]) => {
        const active = tab === id
        return (
          <button key={id} onClick={() => setTab(id)} className="flex flex-1 flex-col items-center gap-1">
            <svg viewBox="0 0 24 24" className={'size-6 transition-colors ' + (active ? 'text-[var(--color-volt)]' : 'text-[var(--color-ash)]')} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d={path} />
            </svg>
            <span className={'text-[10px] font-semibold uppercase tracking-wide ' + (active ? 'text-[var(--color-volt)]' : 'text-[var(--color-ash)]')}>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
