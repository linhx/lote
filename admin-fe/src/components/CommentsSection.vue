<script setup lang="ts">
import Comment from './comment/Comment';
import CommentItem from './comment/CommentItem.vue';
import CommentInput from './CommentInput.vue';

const props = defineProps<{
  comments: Comment[];
}>();

const emit = defineEmits<{
  (e: 'post', value: { parentId?: string, content: string }): void,
  (e: 'activate', value: any): void,
  (e: 'delete', value: any): void,
}>();

const onPost = (newComment: any) => {
  emit('post', newComment);
}
const onActivate = (comment: any) => {
  console.log('', comment)
  emit('activate', comment);
}
const onDelete = (comment: any) => {
  emit('delete', comment);
}
</script>

<template>
  <div>
    <comment-item
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      @post="onPost"
      @activate="onActivate"
      @delete="onDelete"
    >
    </comment-item>
    <comment-input @post="onPost" />
  </div>
</template>
