// idea from vitepress

import { onUnmounted } from 'vue';

const hasFetched = new Set<string>()
const createLink = () => document.createElement('link');

const doFetch = (url?: string) => {
  if (!url) return;
  const link = createLink();
  link.rel = `prefetch`;
  link.href = url;
  document.head.appendChild(link);
}

export function pathToFile(path: string): string | undefined {
  let pagePath = path.replace(/\.html$/, '');
  pagePath = decodeURIComponent(pagePath);

  const base = import.meta.env.BASE_URL;
  pagePath = pagePath.slice(base.length);
  // client production build needs to account for page hash, which is
  // injected directly in the page's html
  const pageHash = __VP_HASH_MAP__['note-' + pagePath.toLowerCase()]; // TODO refactor note-
  if (pageHash) {
    return `${base}notes/note-${pagePath}.${pageHash}.js`;
  }
}

export function permalinkToFile(path: string): string | undefined {
  let pagePath = decodeURIComponent(path);

  // client production build needs to account for page hash, which is
  // injected directly in the page's html
  const pageHash = __VP_HASH_MAP__['note-' + pagePath.toLowerCase()]; // TODO refactor note-
  if (pageHash) {
    const base = import.meta.env.BASE_URL;
    return `${base}notes/note-${pagePath}.${pageHash}.js`;
  }
}

let observer : IntersectionObserver | null = null;
const getObserver = () => {
  if (!window.IntersectionObserver) {
    return;
  }
  let conn
  if (
    (conn = (navigator as any).connection) &&
    (conn.saveData || /2g/.test(conn.effectiveType))
  ) {
    // Don't prefetch if using 2G or if Save-Data is enabled.
    return;
  }
  if (observer) {
    return observer;
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const link = entry.target as HTMLAnchorElement
        observer!.unobserve(link)
        const { pathname } = link
        if (!hasFetched.has(pathname)) {
          hasFetched.add(pathname)
          const pageChunkPath = pathToFile(pathname);
          doFetch(pageChunkPath);
        }
      }
    })
  });
  return observer;
}

export function removeObserver() {
  onUnmounted(() => {
    observer && observer.disconnect()
  })
}

export function removePrefetch(link?: HTMLAnchorElement | null) {
  if (!link) {
    return;
  }
  observer && observer.unobserve(link);
}

export function usePrefetch(link?: HTMLAnchorElement | null) {
  if (!link) {
    return;
  }
  const _observer = getObserver();
  if (!_observer) {
    return;
  }

  const rIC = (window as any).requestIdleCallback || setTimeout
  rIC(() => {
    const { target, hostname, pathname } = link as HTMLAnchorElement;
    if (
      // only prefetch same tab navigation, since a new tab will load
      // the lean js chunk instead.
      target !== `_blank` &&
      // only prefetch inbound links
      hostname === location.hostname
    ) {
      if (pathname !== location.pathname) {
        _observer!.observe(link)
      } else {
        // No need to prefetch chunk for the current page, but also mark
        // it as already fetched. This is because the initial page uses its
        // lean chunk, and if we don't mark it, navigation to another page
        // with a link back to the first page will fetch its full chunk
        // which isn't needed.
        hasFetched.add(pathname)
      }
    }
  });
}
