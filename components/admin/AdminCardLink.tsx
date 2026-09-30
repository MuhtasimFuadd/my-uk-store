import Link from "next/link";

export default function AdminCardLink({
  href,
  title,
  description
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group block border border-line bg-panel p-6 transition-colors hover:border-brass/60 hover:bg-brass/5"
    >
      <h2 className="font-display text-xl text-paper group-hover:text-brass-light">
        {title}
      </h2>
      <p className="mt-2 text-sm text-paper/60">{description}</p>
      <span className="mt-4 inline-block text-xs uppercase tracking-wide text-brass-light">
        Open →
      </span>
    </Link>
  );
}
