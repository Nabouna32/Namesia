"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/material3/Icon";

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

export function NavigationDestinations() {
  const pathname = usePathname();
  return (
    <ul className="navigation-items">
      {destinations.map((destination) => {
        const active = isActive(pathname, destination.href);
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
