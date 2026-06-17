import { Helmet } from 'react-helmet-async';
import { usePortfolio } from '@/src/context/PortfolioContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website'
}: SEOProps) {
  const { data } = usePortfolio();

  // Dynamic values pulled from portfolio data context or custom values
  const siteName = data?.personal?.name || 'Yallanuru Revanth Kumar';
  const role = data?.personal?.role || 'FullStack Web Developer';
  const defaultMetaDescription = data?.personal?.tagline || data?.personal?.about || 'Turning bold ideas into blazing web experiences.';
  
  const finalTitle = title ? `${title} | ${siteName}` : `${siteName} | ${role}`;
  const finalDescription = description || defaultMetaDescription;
  
  // High-value tech tags + customizable props
  const baseKeywords = [
    'Yallanuru Revanth Kumar',
    'Revanth Kumar Yallanuru',
    'YRK',
    'YRK portfolio',
    'Web Developer Portfolio',
    'React Developer',
    'FullStack Developer',
    'Tirupati Developer',
    ...keywords
  ];
  
  const finalKeywords = Array.from(new Set(baseKeywords)).join(', ');
  
  const siteUrl = url || window.location.origin;
  const ogImage = image || `${window.location.origin}/portrait.jpg`;

  return (
    <Helmet>
      {/* Standard HTML Elements */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={siteName} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph (Facebook, LinkedIn, Discord etc.) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card UI */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
