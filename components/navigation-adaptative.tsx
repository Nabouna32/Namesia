"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconeMaterial } from "./icone-material";

const destinations = [
  { href: "/", label: "Accueil", icon: "home", activeIcon: "home-filled" },
  { href: "/prenoms", label: "Explorer", icon: "search" },
  { href: "/comparer", label: "Comparer", icon: "compare-arrows" },
  { href: "/favoris", label: "Favoris", icon: "favorite", activeIcon: "favorite-filled" }
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavigationItems({ pathname }: { pathname: string }) {
  return <ul className="navigation-items">
    {destinations.map((destination) => {
      const active = isActive(pathname, destination.href);\n      const icon = active && "activeIcon" in destination ? destination.activeIcon : destination.icon;
      return <li key={destination.href}>
        <Link className={`navigation-item${active ? " is-active" : ""}`} href={destination.href} aria-current={active ? "page" : undefined}>
          <span className="navigation-item-indicator"><IconeMaterial name={icon} size={24} /></span>
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
