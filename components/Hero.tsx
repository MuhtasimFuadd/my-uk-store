export default function Hero() {
  return (
    <section className="relative flex h-[92vh] min-h-[560px] w-full items-center justify-center overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/hero-portals.mp4"
        poster="/hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink" />

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-brass-light">
          A small perfumery
        </p>
        <h1 className="mt-5 font-display text-5xl leading-tight text-paper sm:text-6xl">
          Threshold
        </h1>
        <p className="mx-auto mt-5 max-w-md text-paper/75">
          Every bottle here is a door to somewhere else. Open one and see
          which world you step into.
        </p>
        <a
          href="#collection"
          className="mt-8 inline-block border border-brass/60 px-7 py-3 text-sm tracking-wide text-brass-light transition-colors hover:border-brass hover:bg-brass/10"
        >
          Enter the shop
        </a>
      </div>
    </section>
  );
}
