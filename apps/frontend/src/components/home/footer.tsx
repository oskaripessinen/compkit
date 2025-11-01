


const Footer = () => {
  return (
    <footer className="border-t border-border bg-black/10">
        <div className="mx-30 max-w-screen px-4 sm:px-6 lg:px-8 py-16 space-y-6">
          <div className="flex flex-row justify-between">
            <div className="space-y-1">
              <div className="text-2xl font-semibold text-foreground">Compkit</div>
              <p className="text-sm text-muted-foreground">Assemble beautiful UI with AI.</p>
            </div>


            <button
              type="button"
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted"
              title="Back to top"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5l-7 7m7-7 7 7M12 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <hr className="my-3 border-0 border-border/70" />

          <div className="flex flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">©2025 compkit</p>
            <nav className="flex flex-row items-center gap-5 text-sm">
              <a className="text-muted-foreground hover:text-foreground" href="#">Home</a>
              <a className="text-muted-foreground hover:text-foreground" href="#">GitHub</a>
            </nav>
          </div>
          
        </div>
    </footer>
  )
}

export { Footer};