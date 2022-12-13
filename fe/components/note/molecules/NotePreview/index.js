import Link from 'next/link';
import TagLink from '@/components/shared/atoms/TagLink';
import { classNames } from '@/utils';

export default function NotePreview({ className, note }) {
  const publishedDate = new Date(note.publishedAt).toLocaleDateString('vi-VN');
  return (
    <div className={classNames(className, 'flex')}>
      <div className="body text-left space-y-1 w-full">
        <div>
          <Link
            className="text-lg sm:text-xl md:text-2xl font-semibold text-sky-500 inline-block"
            href={{ pathname: '/note/[slug]', query: { slug: note.permalink } }}
          >
            {note.title}
          </Link>
        </div>
        <div className="font-light whitespace-pre-wrap w-full">
          <div className="text-sm md:text-base line-clamp-2">
            {note.overview}
          </div>
          <div className="mt-2.5">
            <span className="text-gray-600 dark:text-slate-400 mr-2 text-sm">
              {publishedDate}
            </span>
            {note.tags.map((tag) => (
              <TagLink key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
