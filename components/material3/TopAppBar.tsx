import Link from "next/link";

export function TopAppBar() {
  return (
    <header className="top-app-bar">
      <div className="top-app-bar-inner">
        <Link className="brand" href="/" aria-label="Namesia, accueil">
          <span className="brand-mark">n.</span>
          <span>namesia</span>
        </Link>
        <span className="top-app-bar-caption">Le sens derrière chaque prénom</span>
      </div>
    </header>
  );
}
