import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SeoWrapper = ({ title, description, canonical, children }) => {
    const siteTitle = 'Die Zauberverben - Lerne starke Verben spielerisch!';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || 'Lerne unregelmäßige deutsche Verben mit Spaß! Interaktive Spiele und Übungen für Schüler.';
    const siteUrl = 'https://diezauberverben.de'; // Replace with actual domain if known
    const currentUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

    return (
        <Helmet>
            {/* Basic Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            {/* <meta property="og:image" content={`${siteUrl}/og-image.jpg`} /> */}

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={currentUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={metaDescription} />
            {/* <meta property="twitter:image" content={`${siteUrl}/og-image.jpg`} /> */}

            {/* Structured Data & Other Head Elements */}
            {children}
        </Helmet>
    );
};

SeoWrapper.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    canonical: PropTypes.string,
    children: PropTypes.node,
};

export default SeoWrapper;
