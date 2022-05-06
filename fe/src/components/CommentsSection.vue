<script setup lang="ts">
import { computed, nextTick, onBeforeMount, ref } from 'vue';
import CommentDto from '../dtos/CommentDto';
import Comment from './comment/Comment';
import CommentItem from './comment/CommentItem.vue';
import TextareaWithBtn from './TextareaWithBtn.vue';
import CommentInput from './CommentInput.vue';
import CommentRepository from '../repositories/CommentRepository';

const props = defineProps<{
  permalink: string;
}>();

const emit = defineEmits<{
  (e: 'post', value: { author: string, content: string }): void,
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

const onComment = (comment: any) => {
  CommentRepository.post(props.permalink, comment).then(() => {
    alert('Comment sẽ được review');
  }).catch(e => {
    alert('Có lỗi xảy ra khi comment');
  });
}
</script>

<template>
  <div>
    <comment-item v-for="comment in commentsNested" :key="comment.id" :comment="comment" @post="onComment"></comment-item>
    <comment-input @post="onComment" />
  </div>
</template>
