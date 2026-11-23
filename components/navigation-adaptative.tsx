"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const destinations = [
  { href: "/", label: "Accueil", icon: "home" },
  { href: "/prenoms", label: "Explorer", icon: "search" },
  { href: "/comparer", label: "Comparer", icon: "compare" },
  { href: "/favoris", label: "Favoris", icon: "favorite" }
] as const;

function Icon({ name, filled = false }: { name: string; filled?: boolean }) {
  const paths: Record<string, string> = {
    home: filled
      ? "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
      : "M3 10.5 12 3l9 7.5M5.25 9v11.25h13.5V9M9 20.25v-6h6v6",
    search: "M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.78l5 5L20.49 20l-4.99-6zm-5 0A4.5 4.5 0 1 1 10.5 5a4.5 4.5 0 0 1 0 9z",
    compare: "M10 3 5 8l5 5V9c3.31 0 6 2.69 6 6 0 .34-.03.67-.08 1h2.02c.04-.33.06-.66.06-1 0-4.42-3.58-8-8-8V3zm4 18 5-5-5-5v4c-3.31 0-6-2.69-6-6 0-.34.03-.67.08-1H6.06C6.02 8.33 6 8.66 6 9c0 4.42 3.58 8 8 8v4z",
    favorite: filled
      ? "M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.51z"
       : "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
  };

  return <svg aria-hidden="true" className="navigation-icon" viewBox="0 0 24 24" focusable="false">
    <path d={paths[name] ?? paths.home} fill={(!filled && (name === "home" || name === "favorite")) ? "none" : "currentColor"} stroke={(!filled && (name === "home" || name === "favorite")) ? "currentColor" : "none"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

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
          <span className="navigation-item-indicator"><Icon name={destination.icon} filled={active} /></span>
          <span className="navigation-item-label">{destination.label}</span>
        </Link>
      </li>;
    })}
  </ul>;
}

export function NavigationAdaptative() {
  const pathname = usePathname() ?? "/";
  const [expanded, setExpanded] = useState(false);

  return <>
    <nav className="navigation-bar" aria-label="Navigation principale">
      <NavigationItems pathname={pathname} />
    </nav>

    <nav className={`navigation-rail${expanded ? " is-expanded" : ""}`} aria-label="Navigation principale">
      <button className="navigation-rail-toggle" type="button" aria-expanded={expanded} aria-label={expanded ? "Réduire la navigation" : "Développer la navigation"} onClick={() => setExpanded((value) => !value)}>
        <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" fill="currentColor" /></svg>
      </button>
      <NavigationItems pathname={pathname} />
    </nav>
  </>;
}
