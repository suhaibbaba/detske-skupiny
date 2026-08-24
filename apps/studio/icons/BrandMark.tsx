/**
 * The studio's brand mark, drawn rather than imported.
 *
 * The site has no logo file to reuse: `apps/web/public` carries only
 * `og-default.png`, a 1200x630 social card, and the real header logo is an
 * uploaded image on the `header` document - not something the studio bundle
 * can reach at build time. So the mark is an SVG in the site's own colours,
 * taken from `apps/web/src/theme/palette.ts`: `primary.main` for the tile and
 * `secondary.main` for the figures on it.
 *
 * Sanity renders this at 25px in the navbar and stretches the `<svg>` to fill
 * its box (`svg { width: 100%; height: 100% }`), so the viewBox is square and
 * the shapes are chunky enough to survive that size - three heads over a
 * cradle, which is what "dětské skupinky" is a directory of.
 *
 * No `size`/`color` props: `createIcon` in the navbar mounts it as `<Icon />`
 * with no arguments, so anything configurable here would only ever be the
 * default.
 */
export default function BrandMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      role="img"
      aria-label="Dětské skupinky"
    >
      <rect width="32" height="32" rx="8" fill="#9980B0" />
      <g fill="#FDFBEB">
        <circle cx="10" cy="13.5" r="3.1" />
        <circle cx="16" cy="10.8" r="3.1" />
        <circle cx="22" cy="13.5" r="3.1" />
      </g>
      <path
        d="M7 20.5c2.6 4.2 5.6 6.3 9 6.3s6.4-2.1 9-6.3"
        fill="none"
        stroke="#FDFBEB"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
