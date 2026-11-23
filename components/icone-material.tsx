type NomIconeMaterial =
  | "favorite"
  | "favorite-filled"
  | "home"
  | "home-filled"
  | "menu"
  | "arrow-up-right"
  | "search"
  | "shuffle"
  | "compare-arrows"
  | "check";

const chemins: Record<NomIconeMaterial, string> = {
  home: "M3 10.5 12 3l9 7.5M5.25 9v11.25h13.5V9M9 20.25v-6h6v6",
  "home-filled": "M12 3 2 12h3v9h5v-6h4v6h5v-9h3L12 3z",
  menu: "M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z",
  favorite: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  "favorite-filled": "M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.51z",
  "arrow-up-right": "M5 19 19 5M8 5h11v11",
  search: "M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.78l5 5L20.49 20l-4.99-6zm-5 0A4.5 4.5 0 1 1 10.5 5a4.5 4.5 0 0 1 0 9z",
  shuffle: "M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm-.09 10.83-1.41 1.41 3.54 3.55L14.5 22H20v-5.5l-2.04 2.04-3.55-3.71z",
  "compare-arrows": "M10 3 5 8l5 5V9c3.31 0 6 2.69 6 6 0 .34-.03.67-.08 1h2.02c.04-.33.06-.66.06-1 0-4.42-3.58-8-8-8V3zm4 18 5-5-5-5v4c-3.31 0-6-2.69-6-6 0-.34.03-.67.08-1H6.06C6.02 8.33 6 8.66 6 9c0 4.42 3.58 8 8 8v4z",
  check: "m9 16.17-4.17-4.18L3.41 13.4 9 19l12-12-1.41-1.41z"
};

export function IconeMaterial({
  name,
  size = 20,
  className
}: {
  name: NomIconeMaterial;
  size?: number;
  className?: string;
}) {
  const trace = name === "favorite" || name === "arrow-up-right" || name === "home";
  return (
    <svg
      aria-hidden="true"
      className={className ? `material-icon ${className}` : "material-icon"}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={trace ? "none" : "currentColor"}
      stroke={trace ? "currentColor" : "none"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <path d={chemins[name]} />
    </svg>
  );
}
