export default function SiteFooter() {
  return (
    <footer id="about" className="border-t border-line">
      <div className="mx-auto max-w-content px-6 py-12 text-sm text-ink/60">
        <p className="max-w-md">
          Kettlewell &amp; Co. is a small shop for well-made, everyday
          things. Based in the UK, shipping across the UK.
        </p>
        <p className="mt-6">© {new Date().getFullYear()} Kettlewell & Co.</p>
      </div>
    </footer>
  );
}
