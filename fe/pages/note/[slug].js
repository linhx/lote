import NoteRepository from '@/repositories/NoteRepository';
import { classNames } from '@/utils';
import { useBindContentEvent } from '@/hooks/content';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CommentSection from '@/components/note/organisms/CommentSection';
import Seo from '@/components/shared/molecules/Seo';

export async function getStaticPaths() {
  const notes = await NoteRepository.getList({
    page: 1, // TODO
    limit: 100,
  })
    .then((res) => res.items)
    .catch(() => []);

  const paths = notes.map((note) => ({
    params: { slug: note.permalink },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ locale, params }) {
  const { slug } = params;
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

export default function NoteView({
  className,
  contentHTML,
  title,
  overview,
  slug,
}) {
  const { contentRef } = useBindContentEvent('/tag/[tag]');
  return (
    <>
      <Seo title={title} description={overview} />
      <div
        ref={contentRef}
        className={classNames('note', className)}
        dangerouslySetInnerHTML={{ __html: contentHTML }}
      ></div>
      {process.env.NEXT_PUBLIC_BUILD_COMMENT === 'true' && (
        <div className="note__comment-wrapper">
          <CommentSection permalink={slug} />
        </div>
      )}
    </>
  );
}
