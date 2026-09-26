export default function Hero() {
  return (
    // h-[92vh]  -> how tall the whole hero section is (92% of screen height)
    //              on larger screens. On phones we switch to a fixed
    //              min-height instead (see the sm: below) since 92% of a
    //              short mobile screen (with the browser's address bar
    //              eating into it) can feel cramped once the top text,
    //              circle, and bottom text are all stacked inside it.
    <section className="relative flex min-h-[640px] w-full items-center justify-center overflow-hidden sm:h-[92vh] sm:min-h-[680px]">

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
                              Smaller number = higher up, bigger = lower down.
          - left-1/2 + the -translate-x/y-1/2 combo keeps it centered
            horizontally no matter its size — don't remove those, just
            adjust top-[46%] for vertical position.
          - Size now scales in 3 steps so it doesn't dominate small screens:
              phones:  h-[24vh] w-[24vh]  (base, no prefix)
              tablets: sm:h-[34vh] sm:w-[34vh]
              desktop: md:h-[44vh] md:w-[44vh]
            Change any of the three independently. Keep each pair's h and w
            equal (it's a circle, not an oval). The max-h/max-w after each
            just caps how big it can get on huge screens.
          - rounded-full   -> what makes it a circle instead of a square
            (try "rounded-3xl" for a rounded square instead).
          - overflow-hidden -> crops the video to fit this shape. This is
            also what hides the watermark — it sits outside this crop. */}
      <div
        className="absolute left-1/2 top-[46%] flex h-[24vh] w-[24vh] max-h-[220px] max-w-[220px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full sm:h-[34vh] sm:w-[34vh] sm:max-h-[340px] sm:max-w-[340px] md:h-[44vh] md:w-[44vh] md:max-h-[440px] md:max-w-[440px]"
        // Outer glow around the circle. Change the color (the three numbers
        // before the comma, e.g. "199,154,68" for gold) and the opacity
        // (the last number, 0 = invisible, 1 = solid) to taste.
        style={{ boxShadow: "0 0 60px 20px rgba(172, 152, 25, 0.64)" }}
      >
        {/* scale-[0.7] -> zooms the video IN (>1) or OUT (<1) inside the
              circle.
              - Bigger than 1 (e.g. 1.7) = zoomed in, shows less of the
                frame — safest for keeping the watermark out of view.
              - Smaller than 1 (e.g. 0.7) = zoomed OUT, shows MORE of the
                frame — watch out, zooming out too far can bring the
                watermark (top-left corner of the original video) back
                into view.
            min-h/min-w-[150%] + max-w-none -> makes sure the video always
              overflows its own circle before scaling, so there's no gap
              at the edges regardless of screen size or aspect ratio.
            object-cover -> fills the circle completely (crops video edges
              as needed to avoid stretching/distorting it). */}
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
          from-ink/70 = darkness at the TOP (70% opaque), to-ink = fully
          dark at the BOTTOM. Raise/lower these fraction numbers
          (e.g. /70 -> /90) to make it darker or lighter overall. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink" />

      {/* ============ TEXT CONTENT ============ */}
      {/* flex-col + h-full + justify-between anchors one text block to the
          top and one to the bottom, with the circle showing through the
          gap in the middle — instead of everything being stacked in one
          pile. py-16 sm:py-30 controls how close the text sits to the very
          top/bottom edges of the hero on phones vs larger screens. */}
      <div className="relative z-10 mx-auto flex h-full max-w-2xl flex-col items-center justify-between px-6 py-10 text-center sm:py-16">

        {/* --- TOP TEXT BLOCK (Above the circle) --- */}
        <div>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-brass-light sm:tracking-[0.35em]">
            A small perfumery
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-paper sm:mt-5 sm:text-5xl md:text-6xl">
            MMBoutique
          </h1>
        </div>

        {/* --- BOTTOM TEXT BLOCK (Below the circle) --- */}
        {/* justify-between (above) handles the spacing automatically now,
            so there's no need for the old stack of <br> tags or a big
            mt-32/mt-80 margin here — deleting either was safe. */}
        <div>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-paper/75 sm:text-base sm:leading-loose">
            Every bottle here is a door to somewhere else. Open one and see
            which world you step into.
          </p>
          <a
            href="#collection"
            className="mt-6 inline-block border border-brass/60 px-6 py-3 text-xs tracking-wide text-brass-light transition-colors hover:border-brass hover:bg-brass/10 sm:mt-8 sm:px-7 sm:text-sm"
          >
            Enter the shop
          </a>
        </div>

      </div>
    </section>
  );
}
