const buildStages = [
  {
    number: "01",
    title: "Project foundation",
    detail: "Original design system, quality checks, and local preview.",
    state: "Live",
  },
  {
    number: "02",
    title: "Secure access",
    detail: "Owner and viewer sign-in with protected sessions.",
    state: "Next",
  },
  {
    number: "03",
    title: "Operations workspace",
    detail: "Navigation, dashboard, inventory, and production.",
    state: "Queued",
  },
  {
    number: "04",
    title: "People & insights",
    detail: "Employees, attendance, reports, and settings.",
    state: "Queued",
  },
] as const;

const principles = [
  {
    title: "Built fresh",
    copy: "This implementation starts here. The older app is used only to understand the product.",
  },
  {
    title: "Real data only",
    copy: "Until a trusted data source is connected, operational figures will be marked unavailable.",
  },
  {
    title: "Verified in steps",
    copy: "Every feature is checked, reviewed, and committed as its own working milestone.",
  },
] as const;

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
      <path d="m5 10 3.25 3.25L15 6.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--canvas)] text-[var(--ink)]">
      <div aria-hidden="true" className="page-grid" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-5 pb-8 pt-5 sm:px-8 sm:pt-7 lg:px-12">
        <header className="flex items-center justify-between border-b border-[var(--border)] pb-5">
          <a href="#top" className="group flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-4">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--green)] text-sm font-bold tracking-tight text-white shadow-[0_8px_24px_rgba(23,107,85,0.18)] transition-transform group-hover:-translate-y-0.5">
              MB
            </span>
            <span>
              <span className="block text-sm font-bold tracking-[-0.01em]">Mero Basket</span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">Factory operations</span>
            </span>
          </a>

          <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/75 px-3 py-2 text-xs font-semibold text-[var(--green)] shadow-[0_1px_0_rgba(22,35,31,0.02)] backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-50 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
            </span>
            Local preview live
          </div>
        </header>

        <section id="top" className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[rgba(23,107,85,0.18)] bg-[rgba(23,107,85,0.07)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.13em] text-[var(--green)]">
              <CheckIcon />
              Phase 2 has started
            </div>

            <h1 className="max-w-[760px] text-balance text-[clamp(3.2rem,7vw,6.6rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
              A clean build,
              <span className="mt-2 block text-[var(--green)]">from the ground up.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-pretty text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
              The new Mero Basket workspace is now running. We are turning the approved product specification into a secure factory-operations app, one verified feature at a time.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#build-plan" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--green)] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(23,107,85,0.18)] transition hover:bg-[var(--green-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-4">
                See the build plan
                <ArrowIcon />
              </a>
              <a href="/api/health" className="inline-flex min-h-11 items-center rounded-xl border border-[var(--border-strong)] bg-white px-5 py-3 text-sm font-bold transition hover:border-[var(--green)] hover:text-[var(--green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-4">
                Check system status
              </a>
            </div>
          </div>

          <aside id="build-plan" className="rounded-3xl border border-[var(--border)] bg-white p-3 shadow-[0_28px_80px_rgba(34,55,47,0.09)] sm:p-4">
            <div className="rounded-2xl bg-[var(--ink)] p-6 text-white sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">Build sequence</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em]">Phase 2 roadmap</h2>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/75">1 of 4 live</span>
              </div>

              <ol className="mt-7 space-y-2">
                {buildStages.map((stage, index) => (
                  <li key={stage.number} className={`group grid grid-cols-[38px_1fr_auto] gap-3 rounded-xl border px-3 py-4 transition ${index === 0 ? "border-[rgba(116,215,177,0.36)] bg-[rgba(66,164,127,0.13)]" : "border-white/8 bg-white/[0.025]"}`}>
                    <span className={`mt-0.5 grid size-8 place-items-center rounded-lg text-xs font-bold tabular-nums ${index === 0 ? "bg-[var(--mint)] text-[var(--ink)]" : "bg-white/8 text-white/55"}`}>
                      {stage.number}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{stage.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-white/50">{stage.detail}</span>
                    </span>
                    <span className={`mt-1 text-[10px] font-bold uppercase tracking-[0.12em] ${index === 0 ? "text-[var(--mint)]" : index === 1 ? "text-[var(--amber)]" : "text-white/35"}`}>
                      {stage.state}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid gap-2 p-3 pt-5 sm:grid-cols-3 sm:p-4 sm:pt-6">
              {principles.map((principle) => (
                <div key={principle.title} className="rounded-xl border border-[var(--border)] bg-[var(--soft)] p-4">
                  <h3 className="text-sm font-bold tracking-[-0.01em]">{principle.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{principle.copy}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <footer className="flex flex-col gap-3 border-t border-[var(--border)] pt-5 text-xs font-medium text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>New implementation · No reused source code</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <span>Port 3002</span>
            <span>Data not connected</span>
            <span>Foundation v0.1</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
