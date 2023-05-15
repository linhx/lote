import TodayILearnedRepository from '@/repositories/TodayILearnedRepository';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useBindContentEvent } from '@/hooks/content';
import { classNames } from '@/utils';
import Seo from '@/components/shared/molecules/Seo';

export async function getStaticPaths() {
  const tils = await TodayILearnedRepository.getList({
    page: 1,
    limit: 100,
  })
    .then((res) => res.items)
    .catch(() => []);

  const paths = tils.map((til) => ({
    params: { slug: til.permalink },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ locale, params }) {
  const { slug } = params;
  const contentHTML = await TodayILearnedRepository.getContentHTMLByPermalink(
    slug
  ).catch((e) => '');
  if (!contentHTML) {
    return {
      notFound: true,
    };
  }
  const til = await TodayILearnedRepository.getByPermalink(slug);
  return {
    props: {
      contentHTML,
      title: til.title,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function TodayILearnedView({ className, contentHTML, title }) {
  const { contentRef } = useBindContentEvent('/today-i-learned/tag/[tag]');
  return (
    <>
      <Seo title={title} description={title} />
      <div
        ref={contentRef}
        className={classNames('note', className)}
        dangerouslySetInnerHTML={{ __html: contentHTML }}
      ></div>
    </>
  );
}
