"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/material3/Icon";

const destinations = [
  { href: "/", label: "Accueil", icon: "home", activeIcon: "home-filled" },
  { href: "/prenoms", label: "Explorer", icon: "search", activePaths: ["/tendances"] },
  { href: "/comparer", label: "Comparer", icon: "compare-arrows" },
  { href: "/favoris", label: "Favoris", icon: "favorite", activeIcon: "favorite-filled" }
] as const;

function isActive(pathname: string, destination: (typeof destinations)[number]) {
  if (destination.href === "/") return pathname === "/";
  const activePaths = "activePaths" in destination
    ? [destination.href, ...destination.activePaths]
    : [destination.href];
  return activePaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function NavigationDestinations() {
  const pathname = usePathname();
  return (
    <ul className="navigation-items">
      {destinations.map((destination) => {
        const active = isActive(pathname, destination);
        const icon = active && "activeIcon" in destination ? destination.activeIcon : destination.icon;
        return (
          <li key={destination.href}>
            <Link
              className={`navigation-item${active ? " is-active" : ""}`}
              href={destination.href}
              aria-current={active ? "page" : undefined}
            >
              <span className="navigation-item-indicator">
                <Icon name={icon} size={24} />
              </span>
              <span className="navigation-item-label">{destination.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
