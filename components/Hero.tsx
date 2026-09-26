export default function Hero() {
  return (
    // h-[92vh]  -> how tall the whole hero section is (92% of screen height).
    //              Make it "h-screen" for full-height, or e.g. "h-[70vh]" for shorter.
    // min-h-[560px] -> never lets it get shorter than this, even on tiny screens.
    <section className="relative flex h-[92vh] min-h-[560px] w-full items-center justify-center overflow-hidden">

      {/* ============ BACKGROUND IMAGE (always visible, both doors) ============ */}
      {/* object-cover = fills the whole box, cropping edges if needed.
          object-contain = shows the whole image, letterboxed if needed. */}
      <img
        src="/hero-poster.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* ============ THE CIRCULAR VIDEO PORTAL ============ */}
      {/* This whole <div> is the circle's position + size on screen.
          - top-[46%]      -> vertical position of the circle's CENTER.
                              Smaller number = higher up, bigger number = lower down.
          - left-1/2 + the -translate-x/y-1/2 combo keeps it centered horizontally
            no matter its size — don't remove those, just adjust top-[46%].
          - h-[34vh] w-[34vh]  -> the circle's size, as a % of screen height.
                              Bigger number = bigger circle. Keep h and w equal
                              (it's a circle, not an oval).
          - max-h-[380px] max-w-[380px] -> caps how big it can get on huge screens.
          - rounded-full   -> what makes it a circle instead of a square.
            (change to e.g. "rounded-3xl" for a rounded square instead)
          - overflow-hidden -> crops the video to fit this shape. This is also
            what hides the watermark — it's outside this cropped circle. */}
      <div
        className="absolute left-1/2 top-[46%] flex h-[44vh] w-[44vh] max-h-[440px] max-w-[440px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full"
        /* Outer glow/shadow applied directly to the portal wrapper */
        style={{ boxShadow: "0 0 60px 20px rgba(172, 152, 25, 0.64)" }}
      >
        <video
          className="min-h-[150%] min-w-[150%] max-w-none scale-[0.7] object-cover"
          src="/hero-portals.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Dark fade over everything, so the white text below stays readable.
          from-ink/70 = darkness at the TOP (70% opaque), to-ink = fully dark
          at the BOTTOM. Raise/lower these fraction numbers (e.g. /70 -> /90)
          to make it darker or lighter overall. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink" />

      {/* ============ TEXT CONTENT ============ */}
      {/* Changed to flex-col, h-full, and justify-between to anchor text top and bottom */}
      <div className="relative z-10 mx-auto flex h-full max-w-2xl flex-col items-center justify-between px-6 py-16 text-center sm:py-30">
        
        {/* --- TOP TEXT BLOCK (Above Video) --- */}
        <div>
          <p className="font-display text-xs uppercase tracking-[0.35em] text-brass-light">
            A small perfumery
          </p>
          <h1 className="mt-5 font-display text-5xl leading-tight text-paper sm:text-6xl">
            MMBoutique
          </h1>
        </div>

        {/* --- BOTTOM TEXT BLOCK (Below Video) --- */}
        <div>
          {/* Heads up: this stack of <br> tags is a fragile way to add vertical
              space — it adds a FIXED number of pixels no matter the screen
              size, so on a phone it can push the rest of the text way off
              screen. A sturdier way to get the same gap is to delete this
              whole <h1><br>...</br></h1> block and instead add a margin
              utility to the <p> tag right below it, e.g. change
              "mx-auto mt-5 max-w-md text-paper/75" to
              "mx-auto mt-32 max-w-md text-paper/75" (mt-32 = a big top gap
              that scales properly). Bigger number after "mt-" = bigger gap. */}

          {/* Note: I removed the mt-80 here since justify-between does the spacing automatically now! */}
          <p className="mx-auto max-w-md text-paper/75 leading-loose">
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

      </div>
    </section>
  );
}
