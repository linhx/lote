import Link from 'next/link';
import { classNames } from '@/utils';

export default function TagLink({ className, tag }) {
  return (
    <Link
      href={{
        pathname: '/tag/[tag]',
        query: { tag },
      }}
    >
      <span className={classNames(className, 'tag')}>{ tag }</span>
    </Link>
  );
}
