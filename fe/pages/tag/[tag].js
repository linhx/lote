import NotePreview from '@/components/note/molecules/NotePreview';
import { classNames } from '@/utils';
import NoteRepository from '@/repositories/NoteRepository';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Seo from '@/components/shared/molecules/Seo';

export async function getStaticPaths() {
  const notes = await NoteRepository.getList({
    page: 1, // TODO
    limit: 100,
  })
    .then((res) => res.items)
    .catch(() => []);

  const tags = new Set();
  notes.forEach((note) => {
    note.tags?.forEach((tag) => {
      tags.add(tag);
    });
  });

  const paths = [...tags].map((tag) => ({
    params: { tag },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ locale, params }) {
  const { tag } = params;
  const notes = await NoteRepository.getList({
    page: 1, // TODO
    limit: 100,
    tag,
  })
    .then((res) => res.items)
    .catch(() => []);
  return {
    props: {
      notes,
      tag,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function NotesTagView({ className, notes, tag }) {
  const { t } = useTranslation('common');
  const title = `${t('tag')}: ${tag}`;

  return (
    <>
      <Seo title={title} description={title} />
      <div className={classNames('w-full mx-auto', className)}>
        <div className="font-bold logo-text text-gray-800 dark:text-slate-200">
          <h2 className="text-xl sm:text-2xl md:text-3xl my-2">{title}</h2>
        </div>
        {notes.map((note) => (
          <NotePreview
            className="py-4 border-b-1 border-slate-200 dark:border-slate-700"
            key={note.permalink}
            note={note}
          />
        ))}
      </div>
    </>
  );
}
