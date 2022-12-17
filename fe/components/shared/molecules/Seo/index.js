import Head from 'next/head';

export default function Seo({
  title,
  description,
  url,
  metaImage,
  keywords,
  metaRobots,
  children,
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} key="description" />
      {!!keywords && <meta name="keywords" content={keywords} />}
      {!!url && <meta property="og:url" content={url} key="og:url" />}
      <meta property="og:title" content={title} key="og:title" />
      <meta
        property="og:description"
        content={description}
        key="og:description"
      />
      {!!metaImage && (
        <>
          <meta
            property="og:image"
            content={metaImage.url}
            key="og:image"
          />
          <meta property="og:image:width" content={'' + metaImage.width}></meta>
          <meta
            property="og:image:height"
            content={'' + metaImage.height}
          ></meta>
        </>
      )}
      {!!url && <link rel="canonical" href={url} />}

      {metaRobots && (
        <>
          <meta name="robots" content={metaRobots}></meta>
          <meta name="googlebot" content={metaRobots}></meta>
        </>
      )}
      {children}
    </Head>
  );
}
