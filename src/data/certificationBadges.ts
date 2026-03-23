/**
 * Certification slides: your uploaded reference PNGs plus matching SVG recreations.
 * Replace or extend entries anytime under `public/cert-badges/`.
 */
export type BadgeKind = "clutch" | "goodfirms" | "designrush";

export type CertificationBadge = {
  kind: BadgeKind;
  src: string;
  alt: string;
  label: string;
  caption?: string;
  officialBadgeUrl?: string;
};

export const certificationBadges: CertificationBadge[] = [
  {
    kind: "clutch",
    label: "Clutch — Top 1000 Global",
    caption: "Reference artwork (your upload)",
    src: "/cert-badges/reference-clutch.png",
    alt: "Clutch top 1000 global companies badge",
    officialBadgeUrl:
      "https://help.clutch.co/migration/en/knowledge/access-clutch-badge",
  },
  {
    kind: "goodfirms",
    label: "GoodFirms — Top web development",
    caption: "Reference artwork (your upload)",
    src: "/cert-badges/reference-goodfirms.png",
    alt: "GoodFirms top web development company badge",
    officialBadgeUrl: "https://www.goodfirms.co/community/badges",
  },
  {
    kind: "designrush",
    label: "DesignRush — Top companies",
    caption: "Reference artwork (your upload)",
    src: "/cert-badges/reference-designrush.png",
    alt: "DesignRush top companies badge",
    officialBadgeUrl: "https://www.designrush.com/",
  },
  {
    kind: "clutch",
    label: "Clutch — Top B2B (vector demo)",
    caption: "SVG layout match for RobertRM",
    src: "/cert-badges/clutch-top-b2b.svg",
    alt: "Clutch-style top B2B service providers badge",
    officialBadgeUrl:
      "https://help.clutch.co/migration/en/knowledge/access-clutch-badge",
  },
  {
    kind: "goodfirms",
    label: "GoodFirms — SaaS leaders (vector demo)",
    caption: "SVG layout match for RobertRM",
    src: "/cert-badges/goodfirms-saas.svg",
    alt: "GoodFirms-style top SaaS development badge",
    officialBadgeUrl: "https://www.goodfirms.co/community/badges",
  },
  {
    kind: "designrush",
    label: "DesignRush — UI/UX (vector demo)",
    caption: "SVG layout match for RobertRM",
    src: "/cert-badges/designrush-uiux.svg",
    alt: "DesignRush-style top UI UX design companies badge",
    officialBadgeUrl: "https://www.designrush.com/",
  },
];

export const badgeOfficialResources: { name: string; href: string }[] = [
  {
    name: "Clutch — access badges",
    href: "https://help.clutch.co/migration/en/knowledge/access-clutch-badge",
  },
  {
    name: "GoodFirms — community & badges",
    href: "https://www.goodfirms.co/community/badges",
  },
  { name: "DesignRush", href: "https://www.designrush.com/" },
];
