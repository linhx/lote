<script setup lang="ts">
import { ref, nextTick } from 'vue';
import Comment from './Comment';
import CommentInput from '../CommentInput.vue';
import CommentAvatar from './CommentAvatar.vue';
import ROLES from '../../constants/roles';

const props = defineProps<{
  comment: Comment;
}>();
const emit = defineEmits<{
  (e: 'post', value: any): void,
}>();
const showReply = ref(false);
const commentInputRef = ref<HTMLElement>();
const onClickReply = () => {
  showReply.value = !showReply.value;
  if (showReply.value) {
    nextTick(() => {
      commentInputRef.value?.scrollIntoView();
    });
  }
}

const newComment = ref<{
  parentId: string;
  content: string;
  authorName: string;
}>({
  parentId: props.comment.id,
  content: '',
  authorName: ''
});
const onPost = (_newComment: any) => {
  _newComment.parentId = props.comment.id;
  emit('post', _newComment); // TODO should not taking advantage of the reference to delete content
}
</script>

<template>
  <div class="border-gray-200 flex mb-1" :class="{ 'mb-2': !comment.parentId }">
    <div class="w-14 h-14 flex items-center">
      <div class="md:h-12 md:w-12 w-10 h-10 rounded-full shadow-md comment-avatar overflow-hidden">
        <img v-if="comment.author.role === ROLES.ADMIN" src="../../assets/img/admin-avatar.png" alt="Admin" class="md:h-12 md:w-12 w-10 h-10">
        <comment-avatar v-else :hash="comment.author.uuid" :name="comment.author.name"></comment-avatar>
      </div>
    </div>

    <div class="ml-2 flex-1">
      <h6 class="font-bold">
        {{ comment.author.name }}
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
      <div v-if="comment.subs && comment.subs.length" class="mt-2">
        <comment-item v-for="subComment in comment.subs" :key="subComment.id" :comment="subComment" ></comment-item>
      </div>
      <div ref="commentInputRef" style="visibility: hidden;"></div>
      <comment-input
        v-if="showReply"
        v-model="newComment"
        class="mt-2"
        @post="() => onPost(newComment)"
      />
    </div>
  </div>
</template>

<style scoped>
.comment-avatar {
  box-shadow: 0 1px 1px rgb(0 0 0 / 11%), 0 2px 2px rgb(0 0 0 / 11%), 0 4px 4px rgb(0 0 0 / 11%), 0 8px 8px rgb(0 0 0 / 11%), 0 16px 16px rgb(0 0 0 / 11%), 0 32px 32px rgb(0 0 0 / 11%);
}
</style>