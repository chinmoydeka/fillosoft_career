export function getSalesJobPostingSchema() {
  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": "Sales Executive (100% Commission @ 15% Rate)",
    "description": "Fillosoft Technologies is hiring high-performing Sales Executives on a 100% Commission basis. Earn a flat 15% commission on every closed software, banking solution, web, and mobile app deal with uncapped payout potential.",
    "identifier": {
      "@type": "PropertyValue",
      "name": "Fillosoft Technologies",
      "value": "JOB-SALES-2026"
    },
    "datePosted": "2026-08-01",
    "validThrough": "2026-12-31",
    "employmentType": ["FULL_TIME", "CONTRACTOR"],
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Fillosoft Technologies",
      "sameAs": "https://www.fillosoft.com",
      "logo": "https://www.fillosoft.com/assets/img/logo3.png"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Pragjyotishnagar Bylane-12, Jalukbari",
        "addressLocality": "Guwahati",
        "addressRegion": "Assam",
        "postalCode": "781011",
        "addressCountry": "IN"
      }
    },
    "jobLocationType": "TELECOMMUTE",
    "incentiveCompensation": "100% Commission Basis: 15% uncapped commission on every closed deal.",
    "jobBenefits": "Flexible remote/hybrid work, uncapped earnings potential, technical demo support.",
    "skills": ["B2B Sales", "SaaS Sales", "Lead Generation", "IT Solution Sales", "Client Negotiations"]
  };
}

export function getDeveloperJobPostingSchema() {
  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": "Full-Stack Software Engineer",
    "description": "Fillosoft Technologies is seeking skilled Full-Stack Developers proficient in React, TypeScript, Node.js, Express, and Database Architectures to build enterprise software, banking applications, and custom web/mobile platforms.",
    "identifier": {
      "@type": "PropertyValue",
      "name": "Fillosoft Technologies",
      "value": "JOB-DEV-2026"
    },
    "datePosted": "2026-08-01",
    "validThrough": "2026-12-31",
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Fillosoft Technologies",
      "sameAs": "https://www.fillosoft.com",
      "logo": "https://www.fillosoft.com/assets/img/logo3.png"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Guwahati",
        "addressRegion": "Assam",
        "addressCountry": "IN"
      }
    },
    "skills": ["React", "TypeScript", "Node.js", "Express", "SQLite", "REST APIs", "Mobile App Development"]
  };
}

export function getFaqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the compensation model for Sales Executives at Fillosoft?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fillosoft offers a high-reward 100% Commission basis where Sales Executives earn a 15% commission on every closed deal with no earning caps or limits."
        }
      },
      {
        "@type": "Question",
        "name": "How are sales commissions calculated and paid at Fillosoft?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Commissions are calculated immediately upon client payment milestone clearance (15% rate) and disbursed monthly with transparent deal tracking reports."
        }
      }
    ]
  };
}
