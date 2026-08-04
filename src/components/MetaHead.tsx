import React, { useEffect } from "react";
import { TOOLS } from "../data/tools";

interface MetaHeadProps {
  activeRoute: string;
}

export const MetaHead: React.FC<MetaHeadProps> = ({ activeRoute }) => {
  useEffect(() => {
    let title = "DevStudio - Free Client-Side Developer Tools & Utilities";
    let description =
      "DevStudio is a high-performance suite of free, 100% client-side developer tools including JSON Formatter, JWT Decoder, Base64 Converter, Regex Tester, SQL Formatter, and more.";
    let keywords =
      "developer tools, json formatter, jwt decoder, base64 encoder, regex tester, sql formatter, cron parser, client-side, offline tools";
    let routePath = "/";

    if (activeRoute === "privacy") {
      title = "Privacy Policy - DevStudio Developer Utilities";
      description =
        "DevStudio Privacy Policy. 100% client-side tool execution ensuring zero data transmission or payload logging.";
      keywords = "privacy policy, devstudio privacy, data privacy, client-side security";
      routePath = "/privacy";
    } else if (activeRoute === "terms") {
      title = "Terms of Service - DevStudio Developer Utilities";
      description =
        "DevStudio Terms of Service. Terms and conditions for using our free online developer tools and utilities.";
      keywords = "terms of service, devstudio terms, usage rules";
      routePath = "/terms";
    } else if (activeRoute === "contact") {
      title = "Contact Us & Feedback - DevStudio Developer Utilities";
      description =
        "Contact the DevStudio engineering team for tool requests, feedback, or bug reports.";
      keywords = "contact devstudio, support, feature request, bug report";
      routePath = "/contact";
    } else if (activeRoute !== "home") {
      const tool = TOOLS.find((t) => t.id === activeRoute);
      if (tool) {
        title = tool.pageTitle || `${tool.name} | Free Online Developer Tool - DevStudio`;
        description = tool.metaDescription || `${tool.description} Fast, 100% client-side, free developer utility with zero server logging.`;
        if (tool.keywords && tool.keywords.length > 0) {
          keywords = `${tool.keywords.join(", ")}, devstudio, online tool`;
        }
        routePath = `/tools/${tool.id}`;
      }
    }

    // 1. Update Document Title
    document.title = title;

    // Helper to update or create meta tags
    const updateMetaTag = (nameAttr: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(nameAttr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper to update or create link tags
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    const currentOrigin = window.location.origin;
    const fullCanonicalUrl = `${currentOrigin}${routePath}`;

    // 2. Standard Meta Tags
    updateMetaTag("name", "description", description);
    updateMetaTag("name", "keywords", keywords);
    updateMetaTag("name", "robots", "index, follow");

    // 3. Open Graph Meta Tags
    updateMetaTag("property", "og:title", title);
    updateMetaTag("property", "og:description", description);
    updateMetaTag("property", "og:url", fullCanonicalUrl);
    updateMetaTag("property", "og:type", "website");
    updateMetaTag("property", "og:site_name", "DevStudio");

    // 4. Twitter Card Meta Tags
    updateMetaTag("name", "twitter:card", "summary_large_image");
    updateMetaTag("name", "twitter:title", title);
    updateMetaTag("name", "twitter:description", description);

    // 5. Canonical Link
    updateLinkTag("canonical", fullCanonicalUrl);

    // 6. JSON-LD Structured Data Schema for Google Crawlers
    const schemaId = "devstudio-jsonld-schema";
    let schemaScript = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = schemaId;
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }

    if (
      activeRoute !== "home" &&
      activeRoute !== "privacy" &&
      activeRoute !== "terms" &&
      activeRoute !== "contact"
    ) {
      const tool = TOOLS.find((t) => t.id === activeRoute);
      if (tool) {
        schemaScript.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.name,
          description: tool.description,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "All",
          url: fullCanonicalUrl,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        });
      }
    } else {
      schemaScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "DevStudio",
        url: currentOrigin,
        description: "High-performance client-side developer tools and utilities.",
      });
    }
  }, [activeRoute]);

  return null;
};
