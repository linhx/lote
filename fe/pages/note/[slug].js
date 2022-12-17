import NoteRepository from '@/repositories/NoteRepository';
import { classNames } from '@/utils';
import { useBindContentEvent } from '@/hooks/content';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CommentSection from '@/components/note/organisms/CommentSection';
import Seo from '@/components/shared/molecules/Seo';

export async function getServerSideProps({ locale, query }) {
  const { slug } = query;
  const contentHTML = await NoteRepository.getContentHTMLByPermalink(
    slug
  ).catch((e) => '');
  if (!contentHTML) {
    return {
      notFound: true,
    };
  }
  const note = await NoteRepository.getByPermalink(slug);
  return {
    props: {
      slug,
      contentHTML,
      title: note.title,
      overview: note.overview,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function NoteView({ className, contentHTML, title, overview, slug }) {
  const { contentRef } = useBindContentEvent('/tag/[tag]');
  return (
    <>
      <Seo title={title} description={overview} />
      <div
        ref={contentRef}
        className={classNames('note', className)}
        dangerouslySetInnerHTML={{ __html: contentHTML }}
      ></div>
      <div className="note__comment-wrapper">
        <CommentSection permalink={slug} />
      </div>
    </>
  );
}
