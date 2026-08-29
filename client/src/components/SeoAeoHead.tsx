import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  jsonLdSchema?: object | object[];
}

export const SeoAeoHead: React.FC<SeoProps> = ({
  title,
  description,
  canonicalUrl = 'https://careers.fillosoft.com',
  jsonLdSchema,
}) => {
  const fullTitle = `${title} | Fillosoft Careers Portal`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* AEO / AI Search Engine Meta Keywords & Hints */}
      <meta name="keywords" content="Fillosoft careers, sales executive jobs, 100% commission sales, software developer jobs, IT careers Guwahati Assam, Fillosoft software" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* OpenGraph Protocol (Facebook / LinkedIn) */}
      <meta property="og:site_name" content="Fillosoft Technologies Careers" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content="https://www.fillosoft.com/assets/img/logo3.png" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://www.fillosoft.com/assets/img/logo3.png" />

      {/* Structured JSON-LD Schema (Google Jobs & AI Answer Engines) */}
      {jsonLdSchema && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLdSchema)}
        </script>
      )}
    </Helmet>
  );
};
