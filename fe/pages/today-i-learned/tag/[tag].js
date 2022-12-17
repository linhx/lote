import { classNames } from '@/utils';
import TodayILearnedRepository from '@/repositories/TodayILearnedRepository';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import TodayILearnedPreview from '@/components/today-i-learned/TodayILearnedPreview';
import Seo from '@/components/shared/molecules/Seo';

export async function getServerSideProps({ locale, query }) {
  const { tag } = query;
  const tils = await TodayILearnedRepository.getList({
    page: 1,
    limit: 100,
    tag,
  })
    .then((res) => res.items)
    .catch(() => []);
  return {
    props: {
      tils,
      tag,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function TodayILearnedsTagView({ className, tils, tag }) {
  const { t } = useTranslation('common');

  const title = `${t('tag')}: ${tag}`;

  return (
    <>
      <Seo title={title} description={title} />

      <div className={classNames('w-full mx-auto', className)}>
        <div className="font-bold logo-text text-gray-800 dark:text-slate-200">
          <h2 className="text-xl sm:text-2xl md:text-3xl my-2">{title}</h2>
        </div>
        {tils.map((til) => (
          <TodayILearnedPreview
            className="py-4 border-b-1 border-slate-200 dark:border-slate-700"
            key={til.permalink}
            todayILearned={til}
          />
        ))}
      </div>
    </>
  );
}
