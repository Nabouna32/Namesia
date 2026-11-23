"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconeMaterial } from "./icone-material";

const destinations = [
  { href: "/", label: "Accueil", icon: "home" },
  { href: "/prenoms", label: "Explorer", icon: "search" },
  { href: "/comparer", label: "Comparer", icon: "compare-arrows" },
  { href: "/favoris", label: "Favoris", icon: "favorite" }
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavigationItems({ pathname }: { pathname: string }) {
  return <ul className="navigation-items">
    {destinations.map((destination) => {
      const active = isActive(pathname, destination.href);
      return <li key={destination.href}>
        <Link className={`navigation-item${active ? " is-active" : ""}`} href={destination.href} aria-current={active ? "page" : undefined}>
          <span className="navigation-item-indicator"><IconeMaterial name={active && destination.icon === "home" ? "home-filled" : active && destination.icon === "favorite" ? "favorite-filled" : destination.icon} size={24} /></span>
          <span className="navigation-item-label">{destination.label}</span>
        </Link>
      </li>;
    })}
  </ul>;
}

export function NavigationAdaptative() {
  const pathname = usePathname() ?? "/";

  return <>
    <nav className="navigation-bar" aria-label="Navigation principale">
      <NavigationItems pathname={pathname} />
    </nav>
    <nav className="navigation-rail" aria-label="Navigation principale">
      <NavigationItems pathname={pathname} />
    </nav>
  </>;
}
