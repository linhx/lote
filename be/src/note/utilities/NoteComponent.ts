import { highlightCodeBlock } from './highlight-code-block';

export const create = (
  note: { title: string; content: string; tags: string[]; publishedAt: Date; permalink: string },
) => {
  let tags = '[]';
  if (note.tags && note.tags.length) {
    tags = `['${note.tags.join("','")}']`;
  }
  const publishedAt = note.publishedAt.toISOString();
  return `<template>
  <div class="note">
    <div class="note__header">
      <h2 class="note__header__title">{{ note.title }}</h2>
      <hr class="note__header__hr"/>
    </div>
    <div class="note__published_date">
      <span>{{ publishedDate }}</span>
    </div>
    <div class="note__content_wrapper ck ck-editor">
      <div class="ck ck-content">
        ${highlightCodeBlock(note.content)}
      </div>
    </div>
    <div class="note__tags">
      <span class="note__tags_label">Tags </span>
      <tag-link v-for="tag in note.tags" :key="tag" :tag="tag" />
    </div>

    <div class="note__comment_wrapper">
      <comments-section :permalink="permalink" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    permalink: {
      type: String,
      required: true
    }
  },
  data(): {
    note: any;
  } {
    return {
      note: {
        title: '${note.title}',
        tags: ${tags},
        publishedAt: '${publishedAt}'
      }
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
})
</script>`;
};
