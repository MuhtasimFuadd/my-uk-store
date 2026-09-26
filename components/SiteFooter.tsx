export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-content px-4 py-10 text-sm text-paper/50 sm:px-6 sm:py-12">
        <p className="max-w-md font-display italic text-paper/70">
          "Every scent is a door. We only pick which ones to leave open."
        </p>
        <p className="mt-6">© {new Date().getFullYear()} Threshold</p>
      </div>
    </footer>
  );
}
