<script setup lang="ts">
import { ref } from '@vue/reactivity';
import Comment from './Comment';
import CommentInput from '../CommentInput.vue';

const props = defineProps<{
  comment: Comment;
}>();
const emit = defineEmits<{
  (e: 'post', value: { author: string, content: string }): void,
}>();
const showReply = ref(false);
const onClickReply = () => {
  showReply.value = !showReply.value;
}
const onPost = (newComment: any) => {
  emit('post', {
    ...newComment,
    parentId: props.comment.id
  });
}
</script>

<template>
  <div class="border-gray-200 flex mb-1" :class="{ 'mb-2': !comment.parentId }">
    <div class="w-14 h-14 flex items-center">
      <div class="md:h-12 md:w-12 w-10 h-10 rounded-full shadow-md comment-avatar">
        <img src="../../assets/img/avatar.svg" alt="" class="md:h-12 md:w-12 w-10 h-10">
      </div>
    </div>

    <div class="ml-2 flex-1">
      <h6 class="font-bold">
        {{ comment.author }}
        <span class="text-gray-400 ml-2 font-normal">{{ comment.postedAt.toLocaleString() }}</span>
      </h6>
      <p class="font-normal tracking-wide leading-6 whitespace-pre-wrap break-all">
        {{ comment.content }}
      </p>
      <div class="flex items-center">
        <!-- <span class="inline-block"><svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg"> -->
            <!-- <path d="M1 7L6.5 1L12 7" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span> -->
        <!-- <span class="mx-1 inline-block font-semibold">5</span> -->
        <!-- <span class="inline-block"><svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L6.5 7L12 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span> -->
        <span v-if="!comment.parentId" class="inline-block cursor-pointer text-blue-500 text-sm" @click="onClickReply">Reply</span>
      </div>
      <div v-if="comment.subs.length" class="mt-2">
        <comment-item v-for="subComment in comment.subs" :key="subComment.id" :comment="subComment" ></comment-item>
      </div>
      <comment-input v-if="showReply" class="mt-2" @post="onPost" />
    </div>
  </div>
</template>

<style scoped>
.comment-avatar {
  box-shadow: 0 1px 1px rgb(0 0 0 / 11%), 0 2px 2px rgb(0 0 0 / 11%), 0 4px 4px rgb(0 0 0 / 11%), 0 8px 8px rgb(0 0 0 / 11%), 0 16px 16px rgb(0 0 0 / 11%), 0 32px 32px rgb(0 0 0 / 11%);
}
</style>