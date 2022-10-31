<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import CommentDto from '../dtos/CommentDto';
import Comment from './comment/Comment';
import CommentItem from './comment/CommentItem.vue';
import CommentInput, { NewContent } from './CommentInput.vue';
import CommentRepository from '../repositories/CommentRepository';
import * as VueI18n from 'vue-i18n';


const { t } = VueI18n.useI18n()
const props = defineProps<{
  permalink: string;
}>();

const emit = defineEmits<{
  (e: 'post', value: { authorName: string, content: string }): void,
}>();

const comments = ref<CommentDto[]>([]);
onBeforeMount(() => {
  CommentRepository.getList(props.permalink).then(res => {
    comments.value = res.items;
  });
});

const commentsNested = computed(() => {
  if (comments.value && comments.value.length) {
    const commentsClone = [...comments.value];
    commentsClone.sort((a, b) => {
        return a.postedAt > b.postedAt ? 1 : 0;
    });

    const commentsMap: Map<string, Comment> = new Map();
    commentsClone.forEach(commentDto => {
      if (!commentDto.parentId) {
        commentsMap.set(commentDto.id, new Comment(commentDto));
      } else {
        const parent = commentsMap.get(commentDto.parentId);
        if (parent) {
          parent.subs.push(new Comment(commentDto));
        } else {
          // TODO deleted parent
        }
      }
    });
    return Array.from(commentsMap.values());
  }
});

const getCaptcha = () => {
  return new Promise((resolve, reject) => {
    grecaptcha.ready(function() {
      try {
        grecaptcha.execute(import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY, { action: 'submit' }).then((token: string) => {
          resolve(token);
        }).catch((e: any) => {
          reject(e);
        });
      } catch(e) {
        reject(e);
      }
    });
  });
}


const newComment = ref<NewContent>({
  content: '',
  authorName: ''
});
const onComment = (_newComment: any) => {
  getCaptcha().then(captcha => {
    CommentRepository.post(props.permalink, {
        captcha,
        parentId: _newComment.parentId,
        content: _newComment.content,
        authorName: _newComment.authorName
      }).then(() => {
        _newComment.content = '';
        alert(t('message.comment.create.success'));
      }).catch(e => {
        alert(t(e.response.data.message));
      });
  }).catch(() => {
    alert(t('error.comment.create.captcha'));
  });
}
</script>

<template>
  <div>
    <comment-item
      v-for="comment in commentsNested"
      :key="comment.id"
      :comment="comment"
      @post="onComment"
    ></comment-item>
    <comment-input
      v-model="newComment"
      class="mt-4"
      @post="() => onComment(newComment)"
    />
  </div>
</template>
