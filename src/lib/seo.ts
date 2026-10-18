/**
 * Page metadata, in one place.
 *
 * Every page now has its own URL, so every page needs its own title, description
 * and canonical. Two rules the social scrapers enforce that ordinary links do
 * not: URLs must be absolute (a relative og:image or og:url is dropped), and
 * there must always be an image or the card collapses to bare text.
 */
import { company, SITE_URL } from "./site-data";

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export type PageSeo = {
  title: string;
  description: string;
  /** Site-relative, e.g. "/projects". */
  path: string;
  /** The page's own image. Falls back to the branded share card. */
  image?: string | null;
  imageAlt?: string;
  keywords?: string;
  type?: "website" | "article";
};

/** Meta tags ready to spread into a route's `head().meta`. */
export function pageMeta({
  title,
  description,
  path,
  image,
  imageAlt,
  keywords,
  type = "website",
}: PageSeo) {
  const url = absoluteUrl(path);
  const ownImage = image?.trim();
  const shareImage = absoluteUrl(ownImage || company.ogImage);

  return [
    { title },
    { name: "description", content: description },
    ...(keywords ? [{ name: "keywords", content: keywords }] : []),

    { property: "og:site_name", content: company.name },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:image", content: shareImage },
    { property: "og:image:secure_url", content: shareImage },
    { property: "og:image:alt", content: imageAlt || title },
    // The share card's size is known, so WhatsApp and Facebook can draw the large
    // preview on the first share instead of waiting to download it. A page's own
    // photo varies in size, so it is left for the scraper to measure.
    ...(ownImage
      ? []
      : [
          { property: "og:image:type", content: "image/jpeg" },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
        ]),

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: shareImage },
  ];
}

export function canonical(path: string) {
  return [{ rel: "canonical", href: absoluteUrl(path) }];
}

/** Breadcrumbs help Google show the page's place in the site. */
export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: trail.map((crumb, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.path),
      })),
    }),
  };
}
