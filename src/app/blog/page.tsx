import type { Metadata } from "next";
import BlogPage from "@/components/blog/BlogPage";

export const metadata: Metadata = {
  title: "Blog — Complete Guides on Solar Systems & Cranes",
  description:
    "Expert guides on solar panels, inverters, batteries, and complete solar systems. Plus crane types, parts, and configuration guides. JinkoSolar, LONGi, Trina, Huawei, SMA, Liebherr, and more.",
  keywords: [
    "solar blog",
    "solar panel guide",
    "solar inverter guide",
    "crane parts guide",
    "solar system configuration",
    "crane types explained",
    "JinkoSolar",
    "LONGi",
    "Trina Solar",
    "Huawei inverter",
    "SMA inverter",
    "Liebherr crane",
    "overhead crane guide",
    "solar installation tips",
    "crane maintenance",
  ],
  openGraph: {
    title: "Blog — Complete Guides on Solar Systems & Cranes | Silicon Power",
    description:
      "Expert guides on solar panels, inverters, batteries, and complete solar systems. Plus crane types, parts, and configuration guides.",
    url: "https://siliconpower.com/blog",
    type: "website",
    images: [
      {
        url: "https://placehold.co/1200x630/1a1a2e/ffd700?text=Silicon+Power+Blog",
        width: 1200,
        height: 630,
        alt: "Silicon Power Blog — Solar Systems & Crane Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Complete Guides on Solar Systems & Cranes | Silicon Power",
    description:
      "Expert guides on solar panels, inverters, batteries, and complete solar systems. Plus crane types, parts, and configuration guides.",
    images: [
      "https://placehold.co/1200x630/1a1a2e/ffd700?text=Silicon+Power+Blog",
    ],
  },
  alternates: {
    canonical: "https://siliconpower.com/blog",
  },
};

export default function BlogPageRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Silicon Power Blog",
            url: "https://siliconpower.com/blog",
            description:
              "Expert guides on solar panels, inverters, batteries, and complete solar systems. Plus crane types, parts, and configuration guides.",
            publisher: {
              "@type": "Organization",
              name: "Silicon Power",
              url: "https://siliconpower.com",
              logo: {
                "@type": "ImageObject",
                url: "https://siliconpower.com/logo.svg",
              },
            },
            blogPost: [
              {
                "@type": "BlogPosting",
                headline:
                  "Solar Panels Explained: JinkoSolar, LONGi, Trina & How to Choose",
                url: "https://siliconpower.com/blog/solar-panels-jinkosolar-longi-trina-how-to-choose",
                datePublished: "2026-05-10",
                author: {
                  "@type": "Person",
                  name: "Dr. Sarah Chen",
                },
              },
              {
                "@type": "BlogPosting",
                headline:
                  "Solar Inverters: Huawei, Sungrow, SMA, SolarEdge – String vs. Micro vs. Hybrid",
                url: "https://siliconpower.com/blog/solar-inverters-huawei-sungrow-sma-solaredge-string-micro-hybrid",
                datePublished: "2026-05-15",
                author: {
                  "@type": "Person",
                  name: "James Rodriguez",
                },
              },
              {
                "@type": "BlogPosting",
                headline:
                  "Crane Parts 101: Base, Mast, Boom, Jib, Hoist, Hook, and Counterweights",
                url: "https://siliconpower.com/blog/crane-parts-101-base-mast-boom-jib-hoist-hook-counterweights-explained",
                datePublished: "2026-05-30",
                author: {
                  "@type": "Person",
                  name: "Mark Thompson, CCO",
                },
              },
              {
                "@type": "BlogPosting",
                headline:
                  "Case Study: Off-Grid Solar System for Remote Clinic",
                url: "https://siliconpower.com/blog/case-study-off-grid-solar-longi-sungrow-schletter-remote-clinic",
                datePublished: "2026-06-20",
                author: {
                  "@type": "Person",
                  name: "Dr. Sarah Chen",
                },
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://siliconpower.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://siliconpower.com/blog",
              },
            ],
          }),
        }}
      />
      <BlogPage />
    </>
  );
}