export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-content px-6 py-12 text-sm text-paper/50">
        <p className="max-w-md font-display italic text-paper/70">
          "Every scent is a door. We only pick which ones to leave open."
        </p>
        <p className="mt-6">© {new Date().getFullYear()} MMBoutique</p>
      </div>
    </footer>
  );
}
