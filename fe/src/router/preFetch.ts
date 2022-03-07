// Clone from vitepress

import { onMounted, onUnmounted, watch } from 'vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';

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
    return `${base}assets/note-${pagePath}.${pageHash}.js`;
  }
}

export function permalinkToFile(path: string): string | undefined {
  let pagePath = decodeURIComponent(path);

  // client production build needs to account for page hash, which is
  // injected directly in the page's html
  const pageHash = __VP_HASH_MAP__['note-' + pagePath.toLowerCase()]; // TODO refactor note-
  if (pageHash) {
    const base = import.meta.env.BASE_URL;
    return `${base}assets/note-${pagePath}.${pageHash}.js`;
  }
}

export function usePrefetch(route: RouteLocationNormalizedLoaded) {
  if (!window.IntersectionObserver) {
    return
  }

  let conn
  if (
    (conn = (navigator as any).connection) &&
    (conn.saveData || /2g/.test(conn.effectiveType))
  ) {
    // Don't prefetch if using 2G or if Save-Data is enabled.
    return
  }

  const rIC = (window as any).requestIdleCallback || setTimeout
  let observer: IntersectionObserver | null = null

  const observeLinks = () => {
    if (observer) {
      observer.disconnect()
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
    })

    rIC(() => {
      document.querySelectorAll('#app a').forEach((link) => {
        const { target, hostname, pathname } = link as HTMLAnchorElement
        const extMatch = pathname.match(/\.\w+$/)
        if (extMatch && extMatch[0] !== '.html') {
          return
        }

        if (
          // only prefetch same tab navigation, since a new tab will load
          // the lean js chunk instead.
          target !== `_blank` &&
          // only prefetch inbound links
          hostname === location.hostname
        ) {
          if (pathname !== location.pathname) {
            observer!.observe(link)
          } else {
            // No need to prefetch chunk for the current page, but also mark
            // it as already fetched. This is because the initial page uses its
            // lean chunk, and if we don't mark it, navigation to another page
            // with a link back to the first page will fetch its full chunk
            // which isn't needed.
            hasFetched.add(pathname)
          }
        }
      })
    })
  }

  onMounted(observeLinks)

  watch(() => route.path, observeLinks)

  onUnmounted(() => {
    observer && observer.disconnect()
  })
}
