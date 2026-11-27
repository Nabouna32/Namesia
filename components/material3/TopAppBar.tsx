import Link from "next/link";
import { Button } from "@/components/material3/Button";

export function TopAppBar() {
  return (
    <header className="top-app-bar">
      <div className="top-app-bar-inner">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">n.</span>
          <span>namesia</span>
        </Link>
        <span className="top-app-bar-caption">Le sens derrière chaque prénom</span>
        <Button href="/compte" variant="outlined">Mon compte</Button>
      </div>
    </header>
  );
}
