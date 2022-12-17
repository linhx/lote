import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TodayILearnedRepository from '@/repositories/TodayILearnedRepository';
import TodayILearnedPreview from '@/components/today-i-learned/TodayILearnedPreview';
import { useTranslation } from 'next-i18next';
import Seo from '@/components/shared/molecules/Seo';

export async function getServerSideProps({ locale }) {
  const tils = await TodayILearnedRepository.getList({
    page: 1,
    limit: 100,
  })
    .then((res) => res.items)
    .catch(() => []);
  return {
    props: {
      tils,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function Home({ tils }) {
  const { t } = useTranslation('common');
  return (
    <>
      <Seo title={t('todayILearned')} description={t('todayILearned')} />

      <div className="w-full md:max-w-3xl mx-auto">
        <div>
          <h2 className="text-gray-800 dark:text-slate-200">
            {t('todayILearned')}
          </h2>
        </div>
        {tils.map((til) => (
          <TodayILearnedPreview
            className="py-2"
            key={til.permalink}
            todayILearned={til}
          />
        ))}
      </div>
    </>
  );
}
