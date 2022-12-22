import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import ImageZoom from '@/components/shared/molecules/ImageZoom';
import { useModal } from './modal';

export const useBindContentEvent = (tagRoutePath) => {
  let $tocLinks;
  const contentRef = useRef();
  const getTocItemById = (tocItemId) => {
    return contentRef?.current?.querySelector(
      `.note__toc a[href="#${tocItemId}"]`
    );
  };
  const clearSelectedTocItems = () => {
    $tocLinks?.forEach((a) => clearSelectedTocItem(a));
  };
  const clearSelectedTocItem = (item) => {
    item.classList.remove('active');
  };
  const setActiveTocItem = (item) => {
    item.classList.add('active');
  };
  const selectTocItem = (item) => {
    clearSelectedTocItems();
    if (item) {
      setActiveTocItem(item);
    }
  };
  const selectTocItemById = (id) => {
    const item = getTocItemById(id);
    if (item) {
      selectTocItem(item);
    }
    return item;
  };
  let $activateToc;
  const activeTocItemOnScroll = () => {
    let $clickedTocItem;
    let hasScrolled = false;
    setTimeout(() => {
      const id = window.location.hash?.substring(1);
      if (id) {
        document.getElementById(id)?.scrollIntoView();
        $clickedTocItem = getTocItemById(id);
      }
    }, 100);
    const $headings = document.querySelectorAll('.heading');
    if (!$headings) {
      return;
    }
    $tocLinks = contentRef.current?.querySelectorAll('.note__toc a');
    const $headerLinks = contentRef.current?.querySelectorAll(
      '.note__content .heading > a.heading-lnk'
    );
    $headerLinks?.forEach(($headerLink) =>
      $headerLink.addEventListener('click', (evt) => {
        evt.preventDefault();
        const id = evt.target.nextSibling.getAttribute('id');
        const $clickedTocItem = getTocItemById(id);
        $clickedTocItem?.click();
      })
    );
    $tocLinks?.forEach(($tocLink) =>
      $tocLink.addEventListener('click', (evt) => {
        $clickedTocItem = evt.target;
        setTimeout(() => {
          if (!hasScrolled) {
            selectTocItem(evt.target);
          }
        }, 145);
      })
    );

    let timer;
    $activateToc = () => {
      hasScrolled = true;
      if (timer !== null) {
        clearTimeout(timer);
      }
      // this is for auto set active class when scrolling
      for (let i = 0; i < $headings.length; i++) {
        const $heading = $headings[i];
        if ($heading.getBoundingClientRect().top > 100) {
          if (i > 0) {
            const id = $headings[i - 1].children[1].getAttribute('id');
            selectTocItemById(id);
            break;
          }
        } else if (i === $headings.length - 1) {
          const id = $heading.children[1].getAttribute('id');
          selectTocItemById(id);
        }
      }
      // this is for setting active class when click TOC item
      timer = setTimeout(() => {
        // when scrolling has stopped
        hasScrolled = false;
        if (!!$clickedTocItem) {
          selectTocItem($clickedTocItem);
          $clickedTocItem = undefined;
        }
      }, 150);
    };
    window.addEventListener('scroll', $activateToc);
  };

  const router = useRouter();
  const onClickTag = function () {
    router.push({
      pathname: tagRoutePath,
      query: {
        tag: this.innerText,
      },
    });
  };
  const onClickTags = () => {
    const $tags = contentRef?.current?.querySelectorAll('.note__tags .tag');
    $tags?.forEach(($tag) => {
      $tag.addEventListener('click', onClickTag);
    });
  };

  const modal = useModal();
  const onClickImage = function () {
    modal.open(ImageZoom, {
      src: this.querySelector('img')?.getAttribute('src'),
    });
  };
  const onClickImages = () => {
    const $images = contentRef?.current?.querySelectorAll('figure.image');
    $images?.forEach(($image) => {
      $image.addEventListener('click', onClickImage);
    });
  };

  useEffect(() => {
    activeTocItemOnScroll();
    onClickImages();
    onClickTags();

    return () => {
      clearSelectedTocItems(); // vue cache the pure element, TODO check for react
      window.removeEventListener('scroll', $activateToc);
    };
  }, []);

  return { contentRef };
};
