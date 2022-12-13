import NotePreview from '@/components/note/molecules/NotePreview';
import { classNames } from '@/utils';
import NoteRepository from '@/repositories/NoteRepository';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export async function getServerSideProps({ locale, query }) {
  const { tag } = query;
  const notes = await NoteRepository.getList({
    page: 1,
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

  return (
    <div className={classNames('w-full mx-auto', className)}>
      <div className="font-bold logo-text text-gray-800 dark:text-slate-200">
        <h2 className="text-xl sm:text-2xl md:text-3xl my-2">
          {t('tag')}: {tag}
        </h2>
      </div>
      {notes.map((note) => (
        <NotePreview
          className="py-4 border-b-1 border-slate-200 dark:border-slate-700"
          key={note.permalink}
          note={note}
        />
      ))}
    </div>
  );
}
