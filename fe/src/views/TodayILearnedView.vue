<script setup lang="ts">
import { nextTick, onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useTodayILearnedsStore } from '../stores/today-i-learneds';
import { useRoute, useRouter } from 'vue-router';
import { PATHS_NAME } from '../constants/paths';
const todayILearnedsStore = useTodayILearnedsStore();
const props = defineProps<{
  permalink: string;
  v?: string;
}>();

let $tocLinks: NodeListOf<Element> | undefined;
const contentRef = ref<HTMLElement>();
const getTocItemById = (tocItemId: string | null): HTMLElement | null | undefined => {
  return contentRef.value?.querySelector(`.note__toc a[href="#${tocItemId}"]`);
}
const clearSelectedTocItems = () => {
  $tocLinks?.forEach(a => clearSelectedTocItem(a));
}
const clearSelectedTocItem = (item: Element) => {
  item.classList.remove('active');
}
const setActiveTocItem = (item: Element) => {
  item.classList.add('active');
}
const selectTocItem = (item: Element | null) => {
  clearSelectedTocItems();
  if (item) {
    setActiveTocItem(item);
  }
}
const selectTocItemById = (id: string | null) => {
  const item = getTocItemById(id);
  if (item) {
    selectTocItem(item);
  }
  return item;
}
const route = useRoute();
let $activateToc: () => void;
const activeTocItemOnScroll = () => {
  let $clickedTocItem: HTMLElement | null | undefined;
  let hasScrolled = false;
  setTimeout(() => {
    const id = route.hash?.substring(1);
    if (id) {
      document.getElementById(id)?.scrollIntoView();
      $clickedTocItem = getTocItemById(id);
    }
  }, 100);
  const $headings = document.querySelectorAll('.heading');
  if (!$headings) {
    return;
  }
  $tocLinks = contentRef.value?.querySelectorAll('.note__toc a');
  const $headerLinks = contentRef.value?.querySelectorAll('.note__content .heading > a.heading-lnk');
  $headerLinks?.forEach($headerLink => $headerLink.addEventListener('click', (evt: any) => {
    const id = evt.target.nextSibling.getAttribute('id');
    const $clickedTocItem = getTocItemById(id);
    $clickedTocItem?.click();
  }));
  $tocLinks?.forEach($tocLink => $tocLink.addEventListener('click', (evt) => {
    $clickedTocItem = evt.target as HTMLElement;
    setTimeout(() => {
      if (!hasScrolled) {
        selectTocItem(evt.target as HTMLElement);
      }
    }, 145);
  }));

  let timer: NodeJS.Timeout | null = null;
  $activateToc = () => {
    hasScrolled = true;
    if(timer !== null) {
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
      } else
      if (i === $headings.length - 1) {
        const id = $heading.children[1].getAttribute('id');
        selectTocItemById(id);
      }
    }
    // this is for setting active class when click TOC item
    timer = setTimeout(() => { // when scrolling has stopped
      hasScrolled = false;
      if (!!$clickedTocItem) {
        selectTocItem($clickedTocItem);
        $clickedTocItem = undefined;
      }
    }, 150);
  }
  window.addEventListener('scroll', $activateToc);
};

const router = useRouter();
const onClickTags = () => {
  const $tags: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.note__tags .tag');
  $tags?.forEach(($tag) => {
    $tag.addEventListener('click', () => {
      router.push({
        name: PATHS_NAME.TODAY_I_LEARNEDS_TAG,
        params: {
          tag: $tag.innerText,
        }
      });
    })
  })
}

const contentHTML = ref('');
onBeforeMount(async () => {
  await todayILearnedsStore.getContentHTMLByPermalink(props.permalink).catch(e => {
    router.replace({
      name: PATHS_NAME.VIEW_404,
    });
  });
  contentHTML.value = todayILearnedsStore.cacheTodayILearnedsContentHTML.get(props.permalink) || '';
  nextTick(() => {
    activeTocItemOnScroll();
    onClickTags();
  });
});

onBeforeUnmount(() => {
  clearSelectedTocItems(); // vue cache the pure element
  window.removeEventListener('scroll', $activateToc);
});
</script>

<template>
  <div ref="contentRef" class="note" v-html="contentHTML">
  </div>
</template>
