import Link from 'next/link';
import { classNames } from '@/utils';

const formatDate = (publishedAt) => {
  return new Date(publishedAt).toLocaleDateString('vi-VN', { timeZone: process.env.NEXT_PUBLIC_TZ });
};

export default function TodayILearnedPreview({ className, todayILearned }) {
  return (
    <div className={classNames('flex', className)}>
      <div className="body text-left space-y-1 w-full">
        <div className="flex flex-col md:flex-row items-baseline">
          <span className="text-gray-600 dark:text-slate-400 mr-5 w-24 text-sm">
            {formatDate(todayILearned.publishedAt)}
          </span>
          <Link
            className="text-sky-500 inline-block text-sm sm:text-base hover:underline"
            href={{
              pathname: '/today-i-learned/[slug]',
              query: { slug: todayILearned.permalink },
            }}
          >
            {todayILearned.title}
          </Link>
        </div>
      </div>
    </div>
  );
}
