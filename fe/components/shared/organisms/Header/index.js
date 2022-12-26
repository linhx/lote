import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { classNames } from '../../../../utils';
import style from './style.module.css';
import ButtonThemeMode from '../../molecules/ButtonThemeMode';
import logo from '@/assets/img/logo.svg';
import logoDark from '@/assets/img/logo-dark.svg';

const BREADCRUMBS = {
  HOME: { label: '/home', path: '/' },
  TIL: { label: '/today-i-learned', path: '/today-i-learned' },
};

const getBreadcrumbs = (prevPath, path) => {
  if (path.startsWith('/tag/')) {
    return [BREADCRUMBS.HOME];
  }
  if (path.startsWith('/note/')) {
    if (prevPath.startsWith('/tag/')) {
      return [
        BREADCRUMBS.HOME,
        { label: `/${prevPath.replace('/tag/', '')}`, path: prevPath },
      ];
    } else {
      return [BREADCRUMBS.HOME];
    }
  }
  if (path === '/today-i-learned') {
    return [BREADCRUMBS.HOME];
  }

  if (path.startsWith('/today-i-learned/tag/')) {
    return [BREADCRUMBS.HOME, BREADCRUMBS.TIL];
  }

  if (path.startsWith('/today-i-learned/')) {
    if (prevPath.startsWith('/today-i-learned/tag/')) {
      return [
        BREADCRUMBS.HOME,
        BREADCRUMBS.TIL,
        {
          label: `/${prevPath.replace('/today-i-learned/tag/', '')}`,
          path: prevPath,
        },
      ];
    } else {
      return [BREADCRUMBS.HOME, BREADCRUMBS.TIL];
    }
  }

  return [BREADCRUMBS.HOME];
};

export default function Header({ innerClass, className }) {
  const { t } = useTranslation('common');
  const [isTop, setIsTop] = useState(true);
  const router = useRouter();
  const [prevPath, setPrevPath] = useState('/');
  const [curPath, setCurPath] = useState(router.asPath);
  useEffect(() => {
    const onScroll = () => {
      setIsTop(window.scrollY <= 0);
    };
    window.addEventListener('scroll', onScroll);
    const handleRouteChange = (url) => {
      setCurPath((old) => {
        setPrevPath(old);
        return url;
      });
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      window.removeEventListener('scroll', onScroll);
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);
  const isHomePage = router.pathname === '/';
  const changeThemeMode = () => {
    if (document.getElementsByTagName('html')[0].classList.contains('dark')) {
      document.getElementsByTagName('html')[0].classList.remove('dark');
      window.localStorage.removeItem('theme_mode');
    } else {
      document.getElementsByTagName('html')[0].classList.add('dark');
      window.localStorage.setItem('theme_mode', 'dark');
    }
  };

  const breadcrumbs = useMemo(() => {
    return getBreadcrumbs(prevPath, curPath);
  }, [prevPath, curPath]);

  return (
    <div className={classNames(className, style['header-wrapper'], 'w-full')}>
      <div
        className={classNames(
          style['header'],
          'w-full bg-white dark:bg-slate-900 transition-all box-border z-10 fixed top-0',
          isTop ? '' : style['fixed-header']
        )}
      >
        <div
          className={classNames(
            'h-full flex items-center flex-wrap',
            innerClass
          )}
        >
          {isHomePage ? (
            <>
              <h2
                className={classNames(
                  'm-0 text-3xl c-hidden xs:inline',
                  style['title']
                )}
              >
                {t('blogName')}
              </h2>
              <img
                src={logo.src}
                width="25"
                className="xs:c-hidden dark:c-hidden"
              />
              <img
                src={logoDark.src}
                width="25"
                className="c-hidden dark:inline-block dark:xs:c-hidden"
              />
              <Link
                href="/today-i-learned"
                className="ml-auto lowercase hover:underline hover:text-gray-700 dark:hover:text-slate-50 border-r border-slate-200 mr-4 pr-5 dark:border-slate-800 text-sm sm:text-base"
              >
                /{t('today-i-learned')}
              </Link>
              <ButtonThemeMode onClick={changeThemeMode} />
            </>
          ) : (
            <>
              {breadcrumbs.map((item) => (
                <Link
                  href={item.path}
                  key={item.path}
                  className="lowercase hover:underline hover:text-gray-700 dark:hover:text-slate-100 text-sm sm:text-base"
                >
                  {item.label}
                </Link>
              ))}
              <ButtonThemeMode className="ml-auto" onClick={changeThemeMode} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
