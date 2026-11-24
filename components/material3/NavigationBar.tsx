import { NavigationDestinations } from "./NavigationDestinations";

export function NavigationBar() {
  return (
    <nav className="navigation-bar" aria-label="Navigation principale">
      <NavigationDestinations />
    </nav>
  );
}
