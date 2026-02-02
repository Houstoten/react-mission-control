"use client"

import { ExposeProvider, ExposeTrigger, ExposeWrapper } from "react-expose"

export default function Home() {
  return (
    <ExposeProvider shortcut="ArrowUp+ArrowUp">
      <main className="min-h-screen bg-surface text-ink">
        {/* ── Hero ── */}
        <section className="h-screen flex flex-col items-center justify-center px-grid-4">
          <h1 className="text-display text-ink mb-grid-3">
            react-expose
          </h1>
          <p className="text-body text-muted mb-grid-6">
            mission control for react
          </p>

          {/* Animated hotkey hint */}
          <div className="flex items-center gap-grid-2">
            <span className="text-caption text-muted mr-grid-1">press</span>
            <kbd className="key-1 inline-flex items-center justify-center w-[40px] h-[36px] border border-border bg-white text-caption text-ink select-none">
              <Arrow />
            </kbd>
            <kbd className="key-2 inline-flex items-center justify-center w-[40px] h-[36px] border border-border bg-white text-caption text-ink select-none">
              <Arrow />
            </kbd>
          </div>
        </section>

        {/* ── Cards Grid ── */}
        <section className="bg-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px]">
          <ExposeWrapper label="install" style={{ height: "100%" }}>
            <Card number="01" title="install">
              <pre className="mt-grid-3 bg-white border border-border">
                <code>
                  <div className="code-line">
                    <span className="code-comment">{"# npm"}</span>
                  </div>
                  <div className="code-line">
                    <span className="code-keyword">npm</span>{" "}
                    <span className="code-string">install react-expose</span>
                  </div>
                  <div className="code-line">&nbsp;</div>
                  <div className="code-line">
                    <span className="code-comment">{"# pnpm"}</span>
                  </div>
                  <div className="code-line">
                    <span className="code-keyword">pnpm</span>{" "}
                    <span className="code-string">add react-expose</span>
                  </div>
                </code>
              </pre>
            </Card>
          </ExposeWrapper>

          <ExposeWrapper label="wrap" style={{ height: "100%" }}>
            <Card number="02" title="wrap">
              <pre className="mt-grid-3 bg-white border border-border">
                <code>
                  <div className="code-line">
                    <span className="code-keyword">{"import"}</span>
                    {" { ExposeProvider, ExposeWrapper }"}
                  </div>
                  <div className="code-line">
                    {"  "}
                    <span className="code-keyword">from</span>{" "}
                    <span className="code-string">{'"react-expose"'}</span>
                  </div>
                  <div className="code-line">&nbsp;</div>
                  <div className="code-line">
                    {"<"}
                    <span className="code-keyword">ExposeProvider</span>
                    {">"}
                  </div>
                  <div className="code-line">
                    {"  <"}
                    <span className="code-keyword">ExposeWrapper</span>
                    {">"}
                  </div>
                  <div className="code-line">
                    {"    <"}
                    <span className="code-keyword">YourComponent</span>
                    {" />"}
                  </div>
                  <div className="code-line">
                    {"  </"}
                    <span className="code-keyword">ExposeWrapper</span>
                    {">"}
                  </div>
                  <div className="code-line">
                    {"</"}
                    <span className="code-keyword">ExposeProvider</span>
                    {">"}
                  </div>
                </code>
              </pre>
            </Card>
          </ExposeWrapper>

          <ExposeWrapper label="activate" style={{ height: "100%" }}>
            <Card number="03" title="activate">
              <div className="mt-grid-3 flex items-center justify-center gap-grid-3">
                <kbd className="inline-flex items-center justify-center w-[56px] h-[48px] border border-border bg-white text-body text-ink select-none shadow-[0_2px_0_0_#c0c0c0]">
                  <Arrow />
                </kbd>
                <span className="text-caption text-muted">then</span>
                <kbd className="inline-flex items-center justify-center w-[56px] h-[48px] border border-border bg-white text-body text-ink select-none shadow-[0_2px_0_0_#c0c0c0]">
                  <Arrow />
                </kbd>
              </div>

              <div className="mt-grid-3 flex items-center justify-center gap-grid-2">
                <span className="text-caption text-muted">or</span>
                <ExposeTrigger className="px-grid-2 py-1 border border-border bg-white text-caption text-ink hover:bg-ink hover:text-white transition-colors">
                  click to activate
                </ExposeTrigger>
              </div>

              <pre className="mt-grid-3 bg-white border border-border">
                <code>
                  <div className="code-line">
                    <span className="code-comment">{"// component"}</span>
                  </div>
                  <div className="code-line">
                    {"<"}
                    <span className="code-keyword">ExposeTrigger</span>
                    {">"}
                    <span className="code-string">activate</span>
                    {"</"}
                    <span className="code-keyword">ExposeTrigger</span>
                    {">"}
                  </div>
                  <div className="code-line">&nbsp;</div>
                  <div className="code-line">
                    <span className="code-comment">{"// hook"}</span>
                  </div>
                  <div className="code-line">
                    <span className="code-keyword">const</span>
                    {" { activate } = "}
                    <span className="code-keyword">useExposeActions</span>
                    {"()"}
                  </div>
                </code>
              </pre>
            </Card>
          </ExposeWrapper>

          <ExposeWrapper label="navigate" style={{ height: "100%" }}>
            <Card number="04" title="navigate">
              <p className="mt-grid-3 text-body text-ink leading-relaxed">
                all wrapped components zoom out into a grid.
                click any component to focus it.
                press escape to return.
              </p>
              <p className="mt-grid-2 text-caption text-muted">
                mission control for your interface.
              </p>
            </Card>
          </ExposeWrapper>

          <ExposeWrapper label="configure" style={{ height: "100%" }}>
            <Card number="05" title="configure">
              <pre className="mt-grid-3 bg-white border border-border">
                <code>
                  <div className="code-line">
                    {"<"}
                    <span className="code-keyword">ExposeProvider</span>
                  </div>
                  <div className="code-line">
                    {"  shortcut="}
                    <span className="code-string">{'"ArrowUp+ArrowUp"'}</span>
                  </div>
                  <div className="code-line">
                    {"  blurAmount="}
                    <span className="code-string">{"{10}"}</span>
                  </div>
                  <div className="code-line">
                    {"  onActivate="}
                    <span className="code-string">{"{() => ...}"}</span>
                  </div>
                  <div className="code-line">
                    {"  onDeactivate="}
                    <span className="code-string">{"{() => ...}"}</span>
                  </div>
                  <div className="code-line">{"/>"}</div>
                </code>
              </pre>
            </Card>
          </ExposeWrapper>

          <ExposeWrapper label="customize" style={{ height: "100%" }}>
            <Card number="06" title="customize">
              <pre className="mt-grid-3 bg-white border border-border">
                <code>
                  <div className="code-line">
                    <span className="code-keyword">{":root"}</span>
                    {" {"}
                  </div>
                  <div className="code-line">
                    {"  "}
                    <span className="code-comment">--expose-highlight</span>
                    {": rgba(64,156,255,0.85);"}
                  </div>
                  <div className="code-line">
                    {"  "}
                    <span className="code-comment">--expose-backdrop-bg</span>
                    {": rgba(0,0,0,0.3);"}
                  </div>
                  <div className="code-line">
                    {"  "}
                    <span className="code-comment">--expose-transition-duration</span>
                    {": 0.2s;"}
                  </div>
                  <div className="code-line">
                    {"  "}
                    <span className="code-comment">--expose-border-radius</span>
                    {": 8px;"}
                  </div>
                  <div className="code-line">{"}"}</div>
                </code>
              </pre>
            </Card>
          </ExposeWrapper>
        </section>

        {/* ── Footer ── */}
        <footer className="flex items-center justify-between px-grid-4 py-grid-3 border-t border-border text-caption text-muted">
          <span>react-expose</span>
          <a
            href="https://github.com/ilyahuman/react-expose"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink hover:text-muted transition-colors"
          >
            github
          </a>
        </footer>
      </main>
    </ExposeProvider>
  )
}

function Card({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white p-grid-5 h-full min-h-[320px] flex flex-col">
      <div className="flex items-baseline gap-grid-2">
        <span className="text-caption text-muted font-mono">{number}</span>
        <h2 className="text-heading text-ink">{title}</h2>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {children}
      </div>
    </div>
  )
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 12V2M7 2L2.5 6.5M7 2L11.5 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  )
}
