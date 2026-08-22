import {
  ArrowRight,
  Banknote,
  BarChart3,
  Boxes,
  Building2,
  Database,
  Factory,
  Leaf,
  Package,
  RotateCcw,
  Send,
  User,
  X,
} from "lucide-react";

import { getBusinessCentralConfig } from "@/server/business-central/config";

const projectCards = [
  {
    title: "AG Health",
    description: "Open the ERP dashboard, sales analysis, production, raw materials, and AG Health operations.",
    icon: Factory,
    accent: "factory",
    action: "Open AG Health",
  },
  {
    title: "Parvati Agro",
    description: "Open the Swastik-backed inventory, valuation, and future accounting reports for Parvati Agro.",
    icon: Leaf,
    accent: "agro",
    action: "Open Parvati Agro",
  },
] as const;

const quickActions = ["Today summary", "Inventory", "Bank", "Production", "Low stock", "FG stock", "Qty source", "Diaper materials"] as const;

const guidedQuestions = ["Production summary", "Inventory detail", "Receivables"] as const;

const snapshotCards = [
  {
    label: "Business Central sales",
    value: "Awaiting live sync",
    note: "Ready for 12-month sales once the Business Central service URL is provided.",
    icon: BarChart3,
  },
  {
    label: "Customer receivables",
    value: "Awaiting live sync",
    note: "Will use the AG Health customer trial balance feed after the connector is mapped.",
    icon: Banknote,
  },
  {
    label: "Raw material stock",
    value: "Awaiting live sync",
    note: "Prepared for raw material stock, positive quantities, and low-stock alerts.",
    icon: Boxes,
  },
] as const;

function ProjectCard({ project }: { project: (typeof projectCards)[number] }) {
  const Icon = project.icon;

  return (
    <article className="project-card">
      <span className={`project-icon project-icon-${project.accent}`}>
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <h2 className="mt-6 text-2xl font-black text-[var(--ink)]">{project.title}</h2>
      <p className="mt-4 max-w-xl text-base leading-7 text-[var(--text)]">{project.description}</p>
      <a href="#ag-health" className="mt-5 inline-flex items-center gap-3 text-base font-black text-[var(--ink)]">
        {project.action}
        <ArrowRight className="size-5" aria-hidden="true" />
      </a>
    </article>
  );
}

function GunteAssistant() {
  return (
    <aside className="assistant-panel" aria-label="Gunte assistant">
      <div className="assistant-header">
        <div className="flex items-center gap-4">
          <span className="grid size-10 place-items-center rounded-2xl bg-white/12">
            <Building2 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-black text-white">Gunte</h2>
            <p className="mt-1 text-sm leading-5 text-white/72">Live data answers with source-aware follow ups</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="grid size-9 place-items-center rounded-full bg-white/10 text-white" aria-label="Refresh assistant">
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
          <button className="grid size-9 place-items-center rounded-full bg-white/10 text-white" aria-label="Close assistant">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="border-b border-[var(--border)] bg-white px-5 py-3 text-sm text-[var(--text)]">
        Ask for totals, drilldowns, source fields, or setup help.
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-[var(--border)] bg-white px-5 py-4">
        {quickActions.map((action) => (
          <button key={action} className="assistant-chip">
            {action}
          </button>
        ))}
      </div>

      <div className="min-h-60 bg-[linear-gradient(135deg,#f8fafc_0%,#f6f8fc_52%,#f7f4e8_100%)] p-5">
        <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-black text-[var(--navy)]">Gunte</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--ink)]">
            I can answer from live ERP data, local dashboard records, product recipes, and setup docs. Ask naturally, or tap a quick action below.
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--border)] bg-white px-5 py-4">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">Try a guided question</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {guidedQuestions.map((question) => (
            <button key={question} className="assistant-chip">
              {question}
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-3">
          <div className="min-h-16 flex-1 rounded-2xl border border-[var(--border-strong)] px-4 py-3 text-base text-[var(--text-light)]">
            Ask Gunte about qty, inventory, sources, bank balance...
          </div>
          <button className="grid size-16 place-items-center rounded-2xl bg-[var(--gold)] text-white" aria-label="Send question">
            <Send className="size-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function Home() {
  const businessCentral = getBusinessCentralConfig();

  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/94 px-6 py-4 shadow-[0_8px_28px_rgba(31,48,74,0.05)] backdrop-blur">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-4 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)]">
            <span className="grid size-12 place-items-center rounded-2xl bg-[var(--navy)] text-white shadow-[0_10px_25px_rgba(31,63,103,0.22)]">
              <BarChart3 className="size-7" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xl font-black leading-tight">Factory Manager</span>
              <span className="block text-xs font-black uppercase tracking-[0.14em] text-[var(--gold)]">Project Selection</span>
            </span>
          </a>

          <div className="hidden items-center gap-4 md:flex">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] px-5 py-3">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">Project</p>
              <div className="mt-2 flex gap-2">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-black shadow-sm">AG Health</span>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-black shadow-sm">Parvati Agro</span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 shadow-sm">
              <span className="grid size-11 place-items-center rounded-xl bg-[var(--gold)] text-white">
                <User className="size-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-black">Mangal</span>
                <span className="block text-sm text-[var(--text-light)]">Administrator</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <section id="top" className="relative mx-auto max-w-[1480px] overflow-hidden px-6 py-16 lg:min-h-[calc(100vh-82px)] lg:pr-[31rem]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(121,105,239,0.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(226,190,50,0.1),transparent_26%)]" />

        <p className="inline-flex rounded-2xl bg-[var(--badge)] px-4 py-3 text-base font-black text-[var(--navy)]">Project Hub</p>
        <h1 className="mt-7 max-w-4xl bg-[linear-gradient(90deg,#4168e8_0%,#8f72ee_48%,#b983ff_100%)] bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
          Choose A Project Space
        </h1>
        <p className="mt-6 max-w-5xl text-lg leading-8 text-[var(--ink)]">
          This workspace has separate sections so AG Health and Parvati Agro can be managed independently while sharing the same premium ERP command center.
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-2">
          {projectCards.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        <section id="ag-health" className="mt-16">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">AG Health Live</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight">Business Central connection</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="status-card">
              <Database className="size-7 text-[var(--blue)]" aria-hidden="true" />
              <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">ERP target</p>
              <p className="mt-2 font-black">{businessCentral.company}</p>
            </article>
            <article className="status-card">
              <Package className="size-7 text-[var(--gold)]" aria-hidden="true" />
              <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">Credentials</p>
              <p className="mt-2 font-black">{businessCentral.hasCredentials ? "Configured locally" : "Add to .env.local"}</p>
            </article>
            <article className="status-card">
              <Banknote className="size-7 text-[var(--navy)]" aria-hidden="true" />
              <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">Data service</p>
              <p className="mt-2 font-black">{businessCentral.serviceBaseUrl ? "Ready to test" : "OData/API URL needed"}</p>
            </article>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {snapshotCards.map((card) => {
              const Icon = card.icon;

              return (
                <article key={card.label} className="snapshot-card">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">{card.label}</p>
                    <Icon className="size-6 text-[var(--navy)]" aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-2xl font-black text-[var(--navy)]">{card.value}</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--text)]">{card.note}</p>
                </article>
              );
            })}
          </div>
        </section>

        <GunteAssistant />
      </section>
    </main>
  );
}
