<script setup lang="ts">
import { ref } from '@vue/reactivity';
import Comment from './Comment';
import CommentInput from '../CommentInput.vue';

const props = defineProps<{
  comment: Comment;
}>();
const emit = defineEmits<{
  (e: 'post', value: { authorName: string, content: string }): void,
  (e: 'activate', value: Comment): void,
  (e: 'delete', value: Comment): void,
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

const onActivate = () => {
  const result = confirm("Activate comment?");
  if (result) {
    emit('activate', props.comment);
  }
}

const onDelete = () => {
  const result = confirm("Delete comment?");
  if (result) {
    emit('delete', props.comment);
  }
}
</script>

<template>
  <div class="border-gray-200 flex" :class="{ 'mb-2': !comment.parentId }">
    <div class="h-14 w-14 bg-white">
      <img src="../../assets/img/icon-home.png" alt="" class="md:h-12 md:w-12 w-10 h-10">
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
        <span v-if="!comment.parentId" class="inline-block cursor-pointer text-blue-500 text-sm mr-2" @click="onClickReply">Reply</span>
        <span v-if="!comment.isActive" class="inline-block cursor-pointer text-green-500 text-sm mr-2" @click="onActivate">Activate</span>
        <span class="inline-block cursor-pointer text-red-500 text-sm mr-2" @click="onDelete">Delete</span>
      </div>
      <div v-if="comment.subs.length" class="mt-2">
        <comment-item
          v-for="subComment in comment.subs"
          :key="subComment.id"
          :comment="subComment"
          @post="(newComment) => emit('post', newComment)"
          @activate="(comment) => emit('activate', comment)"
          @delete="(comment) => emit('delete', comment)"
        ></comment-item>
      </div>
      <comment-input v-if="showReply" class="mt-2" @post="onPost" />
    </div>
  </div>
</template>
