import TodayILearnedRepository from "@/repositories/TodayILearnedRepository";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useBindContentEvent } from '@/hooks/content';
import Head from "next/head";
import { classNames } from "@/utils";

export async function getServerSideProps({ locale, query }) {
  const { slug } = query;
  const contentHTML = await TodayILearnedRepository.getContentHTMLByPermalink(slug).catch(e => '');
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
    <Head>
      <title>{ title }</title>
    </Head>
    <div
      ref={contentRef}
      className={classNames('note', className)}
      dangerouslySetInnerHTML={{ __html: contentHTML }}
    ></div>
  </>
);
}
