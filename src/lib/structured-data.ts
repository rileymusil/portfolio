import { site } from "@/lib/site";
import { absoluteUrl, assetUrl } from "@/lib/site-url";

/* schema.org graph for the site. ProfessionalService is what puts the Houston
   service area, phone, and email in front of Google for local searches; Person
   ties the same details to Riley for the knowledge panel. */
export function buildStructuredData(): Record<string, unknown> {
  const home = absoluteUrl("/");
  const personId = `${home}#person`;
  const businessId = `${home}#business`;
  const logo = assetUrl("/RileyMusilLOGO.png");
  const sameAs = [site.linkedinUrl, site.instagramUrl];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${home}#website`,
        url: home,
        name: site.name,
        description: site.subtitle,
        inLanguage: "en-US",
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        url: home,
        image: assetUrl("/RileyHeadshot.jpg"),
        jobTitle: "Videographer & Photographer",
        email: `mailto:${site.email}`,
        telephone: site.phoneHref.replace(/^tel:/, ""),
        sameAs,
        worksFor: { "@id": businessId },
      },
      {
        "@type": "ProfessionalService",
        "@id": businessId,
        name: `${site.name} Creative Services`,
        url: home,
        image: logo,
        logo,
        description: site.subtitle,
        email: `mailto:${site.email}`,
        telephone: site.phoneHref.replace(/^tel:/, ""),
        founder: { "@id": personId },
        sameAs,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Houston",
          addressRegion: "TX",
          addressCountry: "US",
        },
        areaServed: {
          "@type": "City",
          name: "Houston",
          containedInPlace: {
            "@type": "State",
            name: "Texas",
          },
        },
        knowsAbout: [
          "Event videography",
          "Event photography",
          "Portrait photography",
          "Commercial video production",
          "Narrative film production",
          "Post-production and editing",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Creative services",
          itemListElement: [
            "Event video coverage",
            "Event photography",
            "Portrait sessions",
            "Commercial video production",
            "Post-production and editing",
          ].map((serviceName) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: serviceName },
          })),
        },
      },
    ],
  };
}

/* `</script>` inside a JSON string would close the tag early; escaping `<` is
   the standard way to keep the payload inert. */
export function serializeStructuredData(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
