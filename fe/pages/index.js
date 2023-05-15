import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NotePreview from '@/components/note/molecules/NotePreview';
import NoteRepository from '@/repositories/NoteRepository';
import { useTranslation } from 'next-i18next';
import Seo from '@/components/shared/molecules/Seo';

export async function getStaticProps({ locale }) {
  const notes = await NoteRepository.getList({
    page: 1, // TODO
    limit: 100,
  }).then(res => res.items).catch(() => []);
  return {
    props: {
      notes,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function Home({ notes }) {
  const { t } = useTranslation('common');
  return (
    <>
      <Seo title={t('blogName')} description="My space" />
      <div className="w-full md:max-w-3xl mx-auto">
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
