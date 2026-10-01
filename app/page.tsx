import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Hero from "@/components/Hero";

// Forced dynamic (rendered fresh per request) rather than static. This
// works around a bug where @supabase/ssr's createBrowserClient — pulled
// in by AccountMenu, in SiteHeader — crashes Next's build-time static
// prerendering with an unrelated-looking "Element type is invalid" error,
// even when the import is never actually called. Forcing this page
// dynamic skips that prerendering step entirely. Trade-off: this page is
// now rendered on the server per visit instead of served from a cached
// static file — negligible for a small shop, not worth chasing further
// right now.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <SiteFooter />
    </>
  );
}
