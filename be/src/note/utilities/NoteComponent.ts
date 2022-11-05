import { addHeadingAnchor, TableOfContentItem } from './add-heading-anchor';
import { highlightCodeBlock } from './highlight-code-block';

export const createTableOfContents = (data: Array<TableOfContentItem>) => {
  return data.reduce(( toc, item ) => {
    return toc + `<a href="#${item.id}" class="note__toc__item note__toc__level_${item.level}">${item.content}</a>`
  }, '');
}

export const formatContent = (_content: string) => {
  const {
    content,
    tableOfContents
  } = addHeadingAnchor(highlightCodeBlock(_content));

  return {
    content,
    tableOfContents: createTableOfContents(tableOfContents),
  }
}

export const create = (
  note: { title: string; content: string; tags: string[]; publishedAt: Date; permalink: string },
) => {
  let tags = '[]';
  if (note.tags && note.tags.length) {
    tags = `['${note.tags.join("','")}']`;
  }
  const publishedAt = note.publishedAt.toISOString();
  const {
    content,
    tableOfContents,
  } = formatContent(note.content);

  return `<template>
  <div class="note">
    <div class="note__header">
      <h2 class="note__header__title">{{ note.title }}</h2>
      <hr class="note__header__hr"/>
    </div>
    <div class="note__published-date">
      <span>{{ publishedDate }}</span>
    </div>
    <div class="note__content-wrapper ck ck-editor">
      <div class="note__toc">
        <div ref="toc">
          ${tableOfContents}
        </div>
      </div>
      <div ref="content" class="ck ck-content">
        ${content}
      </div>
    </div>
    <div class="note__tags">
      <span class="note__tags-label">Tags </span>
      <tag-link v-for="tag in note.tags" :key="tag" :tag="tag" />
    </div>

    <div class="note__comment-wrapper">
      <comments-section :permalink="permalink" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  $observer: null,
  props: {
    permalink: {
      type: String,
      required: true
    }
  },
  data(): {
    note: any;
    clickedTocItem?: Node;
    hasScrolled: boolean; // content has scrolled
  } {
    return {
      note: {
        title: '${note.title}',
        tags: ${tags},
        publishedAt: '${publishedAt}'
      },
      clickedTocItem: undefined,
      hasScrolled: false,
    }
  },

  computed: {
    publishedDate() {
      if (this.note.publishedAt) {
        return new Date(this.note.publishedAt).toLocaleDateString('vi-VN');
      }
      return '';
    },
  },

  methods: {
    clearSelectedTocItems() {
      this.$tocLinks.forEach(a => this.clearSelectedTocItem(a));
    },
    clearSelectedTocItem(item) {
      item.classList.remove('active');
    },
    setActiveTocItem(item) {
      item.classList.add('active');
    },
    selectTocItem(item) {
      this.clearSelectedTocItems();
      this.setActiveTocItem(item);
    }
  },

  $activateToc: null,
  $tocLinks: null,
  $headerLinks: null,
  mounted() {
    const $headings = this.$refs.content.querySelectorAll('.heading');
    this.$tocLinks = this.$refs.toc.querySelectorAll('a');
    this.$headerLinks = this.$refs.content.querySelectorAll('.heading > a.heading-lnk');
    this.$headerLinks.forEach($headerLink => $headerLink.addEventListener('click', (evt) => {
      const id = evt.target.nextSibling.getAttribute('id');
      const $clickedTocItem = this.$refs.toc.querySelector(\`a[href="#\${id}"]\`);
      $clickedTocItem.click();
    }));
    this.$tocLinks.forEach($tocLink => $tocLink.addEventListener('click', (evt) => {
      this.clickedTocItem = evt.target;
      setTimeout(() => {
        if (!this.hasScrolled) {
          this.selectTocItem(evt.target);
        }
      }, 145);
    }));

    let timer: number | null = null;
    let $activeTocItem;
    this.$activateToc = () => {
      if (!this.$refs.toc) {
        return;
      }
      this.hasScrolled = true;
      if(timer !== null) {
        clearTimeout(timer);
      }
      for (let i = 0; i < $headings.length; i++) {
        const $heading = $headings[i];
        if ($heading.getBoundingClientRect().top > 100) {
          if (i > 0) {
            const id = $headings[i - 1].children[1].getAttribute('id');
            $activeTocItem = this.$refs.toc.querySelector(\`a[href="#\${id}"]\`);
            this.selectTocItem($activeTocItem);
            break;
          }
        } else 
        if (i === $headings.length - 1) {
          const id = $heading.children[1].getAttribute('id');
          $activeTocItem = this.$refs.toc.querySelector(\`a[href="#\${id}"]\`);
          this.selectTocItem($activeTocItem);
        }
      }
      // when scrolling has stopped
      timer = setTimeout(() => {
        this.hasScrolled = false;
        if (this.clickedTocItem) {
          if ($activeTocItem) {
            this.clearSelectedTocItem($activeTocItem);
          }
          this.setActiveTocItem(this.clickedTocItem);
          this.clickedTocItem = undefined;
        }
      }, 150);
    }
    window.addEventListener('scroll', this.$activateToc);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.$activateToc);
  },
})
</script>`;
};
