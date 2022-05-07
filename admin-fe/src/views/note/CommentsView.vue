<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import CommentsSection from '../../components/CommentsSection.vue';
import CommentDto from '../../dtos/CommentDto';
import CommentRepository from '../../repositories/CommentRepository';
import Comment from '../../components/comment/Comment';

const props = defineProps<{
  noteId: string;
  noteTitle: string;
}>();

const comments = ref<CommentDto[]>([]);
const commentsNested = ref<Comment[]>([]);

const createCommentsNested = (commentDtos: CommentDto[]) => {
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
          // TODO show parent as deleted content
        }
      }
    });
    return Array.from(commentsMap.values());
  } else {
    return [];
  }
}

onBeforeMount(() => {
  CommentRepository.getList(props.noteId).then((res: any) => {
    comments.value = res.items;
    commentsNested.value = createCommentsNested(comments.value);
  });
});

const onComment = (comment: any) => {
  CommentRepository.post(props.noteId, comment)
  .then((newCommentDto: CommentDto) => {
    if (newCommentDto.parentId) {
      const parent = commentsNested.value.find(c => c.id === newCommentDto.parentId);
      if (parent) {
        parent.subs.push(new Comment(newCommentDto));
      }
    } else {
      commentsNested.value.push(new Comment(newCommentDto));
    }
  })
  .catch(e => {
    alert(e.response?.message);
  });
}

const findComment = (comment: Comment) => {
  if (comment.parentId) {
    const parent = commentsNested.value.find(c => c.id === comment.parentId);
    if (parent) {
      return parent.subs.find(sub => sub.id === comment.id);
    }
  } else {
    return commentsNested.value.find(c => c.id === comment.id);
  }
}

const activate = (comment: Comment) => {
  CommentRepository.active(props.noteId, comment.id).then(() => {
    const c = findComment(comment);
    console.log('c', comment)
    if (!!c) {
      console.log('c', c.isActive)
      c.isActive = true;
    }
  }).catch(e => {
    alert(e.message);
  });
}

const deleteComment = (comment: Comment) => {
  CommentRepository.delete(props.noteId, comment.id).then(() => {
    debugger
    if (comment.parentId) {
      const parent = commentsNested.value.find(c => c.id === comment.parentId);
      if (parent) {
        const index = parent.subs.findIndex(sub => sub.id === comment.id);
        if (index > -1) {
          parent.subs.splice(index, 1);
        }
      }
    } else {
      const index = commentsNested.value.findIndex(c => c.id === comment.id);
      if (index > -1) {
        commentsNested.value.splice(index, 1);
      }
    }
  }).catch(e => {
    alert(e.message);
  });
}
</script>

<template>
  <div class="mt-10 sm:mt-0 w-full md:max-w-3xl mx-auto">
    <div class="font-bold text-3xl py-3">
      <h2 class="text-orange-600">{{ noteTitle }}</h2>
      <hr/>
    </div>
    <comments-section
      :comments="commentsNested"
      @post="onComment"
      @activate="activate"
      @delete="deleteComment"
    />
  </div>
</template>
