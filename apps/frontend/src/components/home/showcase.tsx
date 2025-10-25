
const Showcase = () => {

  return (
    <section className="border-b border-border bg-background min-h-screen grid place-items-center">
        <div className="mx-auto max-w-3xl text-center justify-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">See it in action</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Generate and preview your components in real time before exporting.
          </p>
        </div>
        <div className="mt-10 grid w-full max-w-5xl mx-auto gap-6 lg:grid-cols-2 justify-center place-items-center">
        </div>
    </section>
  )
}

export { Showcase };