export default function Hero() {
  return (
    // The video/circle is gone, so this is back to one simple full-height
    // section: a static background image + a dark fade + centered text.
    <section className="relative flex h-[92vh] min-h-[560px] w-full items-center justify-center overflow-hidden">

      {/* ============ BACKGROUND IMAGE ============ */}
      {/* object-cover = fills the whole box, cropping edges if needed.
          object-contain = shows the whole image, letterboxed if needed. */}
      <img
        src="/hero-poster.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark fade over the image, so the text below stays readable.
          from-ink/70 = darkness at the TOP (70% opaque), to-ink = fully
          dark at the BOTTOM. Raise/lower these fraction numbers
          (e.g. /70 -> /90) to make it darker or lighter overall. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink" />

      {/* ============ TEXT CONTENT ============ */}
      {/* Back to one centered block (no more top/bottom split — that split
          only existed to leave a gap for the video circle). */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-brass-light">
          A small perfumery
        </p>

        {/* ============ THE GOLDEN GLOWING TITLE ============ */}
        {/* Two things create the "glowing gold" look together:
            1. bg-gradient-to-b + bg-clip-text + text-transparent
               -> fills the letters themselves with a gold gradient
               (light gold at the top fading to a deeper gold at the
               bottom) instead of a flat color.
            2. The inline style's textShadow
               -> adds the actual "glow" (a soft blurred halo around the
               letters), which Tailwind doesn't have a built-in class for.

            TO TWEAK:
            - Gradient colors: change "from-brass-light" and "to-brass"
              (or "to-brass-dark" for a deeper fade) — these are the same
              gold tones already used elsewhere on the site.
            - Glow color: change the "199, 154, 68" numbers below (that's
              the gold color as R,G,B — same as the "brass" color).
            - Glow strength: raise the opacity (the number after the last
              comma, e.g. 0.6) or the blur radius (the "40px" numbers) for
              a bigger/brighter glow. Lower them for a subtler glow.
            - Remove the glow entirely: just delete the whole style={...}
              part and keep the gradient-fill classes for a plain gold
              (non-glowing) title. */}
        <h1
          className="mt-5 bg-gradient-to-b from-brass-light to-brass bg-clip-text font-display text-5xl leading-tight text-transparent sm:text-7xl"
          style={{
            textShadow:
              "0 0 20px rgba(199,154,68,0.6), 0 0 45px rgba(199,154,68,0.4), 0 0 80px rgba(199,154,68,0.25)"
          }}
        >
          MMBoutique
        </h1>

        <p className="mx-auto mt-9 max-w-md text-paper/75">
        {/*  Every bottle here is a door to somewhere else. Open one and see
          which world you step into.*/}
        </p>
        <a
          href="/products"
          className="mt-8 inline-block border border-brass/60 px-7 py-3 text-sm tracking-wide text-brass-light transition-colors hover:border-brass hover:bg-brass/10"
        >
          Enter the shop
        </a>
      </div>
    </section>
  );
}

