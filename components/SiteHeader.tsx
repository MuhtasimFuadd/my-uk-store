export default function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5">
        <span className="font-display text-xl tracking-tight text-ink">
          Kettlewell &amp; Co.
        </span>
        <nav className="flex items-center gap-6 text-sm text-ink/70">
          <a href="#shop" className="hover:text-ink">Shop</a>
          <a href="#about" className="hover:text-ink">About</a>
          <a href="#" className="hover:text-ink">Basket (0)</a>
        </nav>
      </div>
    </header>
  );
}
