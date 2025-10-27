import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { defaultMetaTags, generatePageMetaTags } from '../../utils/seo';

const SEO = ({ page = 'home', customTitle, customDescription, customImage }) => {
  const pageMeta = generatePageMetaTags(page);
  const title = customTitle || pageMeta.title;
  const description = customDescription || pageMeta.description;
  const image = customImage || defaultMetaTags.ogImage;
  const url = pageMeta.canonical;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={defaultMetaTags.keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content={defaultMetaTags.twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

SEO.propTypes = {
  page: PropTypes.string,
  customTitle: PropTypes.string,
  customDescription: PropTypes.string,
  customImage: PropTypes.string,
};

export default SEO;
