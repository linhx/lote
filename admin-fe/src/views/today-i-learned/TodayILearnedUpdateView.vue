<template>
  <div class="mt-10 sm:mt-0 shadow p-3">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="mt-5 md:mt-0 md:col-span-1">
        <c-field label="Title">
          <c-input v-model="todayILearned.title" name="title" @change="onChangeTitle" />
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
        <c-field label="Permalink">
          <c-input v-model="todayILearned.permalink" name="permalink" />
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-1">
        <c-field label="Tags">
          <c-tag-input v-model="todayILearned.tags"></c-tag-input>
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-3 w-full max-w-3xl mx-auto">
        <c-field label="Content">
          <c-editor v-if="isFetched" ref="editor" :model-value="todayILearned.content" class="-mx-4"></c-editor>
        </c-field>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-3 items-center">
        <c-button variant="green" @click="onSave" :disabled="isLoading">Save</c-button>
        <c-button variant="blue" class="ml-2" @click="preview" :disabled="isLoading">Preview</c-button>
        <c-button variant="green" class="ml-2" @click="publish" :disabled="isLoading">Publish</c-button>
        <c-button variant="red" class="ml-2" @click="unpublish" :disabled="isLoading">Unpublish</c-button>
        <c-button variant="red" class="ml-2" @click="hardDelete" :disabled="isLoading">Delete</c-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CInput from '../../components/CInput.vue';
import CTextarea from '../../components/CTextarea.vue';
import CEditor from '../../components/CEditor.vue';
import CField from '../../components/CField.vue';
import CTagInput from '../../components/CTagInput.vue';
import CButton from '../../components/CButton.vue';
import CFileInput from '../../components/CFileInput.vue';
import TodayILearnedRepository from '../../repositories/TodayILearnedRepository';
import TodayILearnedDto from '../../dtos/TodayILearnedDto';
import { convertFreeTextToKebabCase } from '../../utilities/StringUtils';
import ROUTES_NAME from '../../constants/routes';
import { Data } from '../../utilities/Editor';
import { getResponseError } from '../../utilities/ErrorUtils';

const confirmationMessage = 'Warning unsaved changes'; // TODO message source

const warningUnsave = (e: any) => {
  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  return confirmationMessage;
}

export default defineComponent({
  components: {
    CField,
    CInput,
    CTextarea,
    CEditor,
    CTagInput,
    CButton,
    CFileInput
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data (): {
    isLoading: boolean,
    isFetched: boolean,
    todayILearned: TodayILearnedDto,
  } {
    return {
      isLoading: false,
      isFetched: false,
      todayILearned: {
        id: '',
        title: '',
        permalink: '',
        content: '',
        tags: [],
        category: 0,
        publishedAt: undefined,
      },
    }
  },
  methods: {
    onChangeTitle() {
      this.todayILearned.permalink = convertFreeTextToKebabCase(this.todayILearned.title) || '';
    },
    async onSave() {
      try {
        this.isLoading = true;
        const data: Data = (<any>this.$refs.editor).getData();
        const {
          id,
          ...dto
        } = this.todayILearned;
        await TodayILearnedRepository.update(
          id, {
            ...dto,
            ...data
          }).catch(e => {
            alert(getResponseError(e));
          });
      } finally {
        this.isLoading = false;
      }
    },
    publish() {
      var result = confirm("Publish?");
      if (!result) {
        return;
      }
      this.isLoading = true;
      TodayILearnedRepository.publish(this.id)
      .then(() => {
        this.isLoading = false;
      }).catch((e: Error) => {
        this.isLoading = false;
        alert(getResponseError(e));
      });
    },
    unpublish() {
      var result = confirm("Unpublish?");
      if (!result) {
        return;
      }
      this.isLoading = true;
      TodayILearnedRepository.unpublish(this.id)
      .then(() => {
        this.isLoading = false;
      }).catch((e: Error) => {
        this.isLoading = false;
        alert(getResponseError(e));
      });
    },
    preview() {
      window.open(`/today-i-learned/${this.id}/preview`, '_blank')?.focus();
    },
    softDelete() {
      var result = confirm("Xóa?");
      if (result) {
        this.isLoading = true;
        TodayILearnedRepository.softDelete(this.id)
        .then(() => {
          this.isLoading = false;
        }).catch((e: Error) => {
          this.isLoading = false;
          alert(getResponseError(e));
        });
      }
    },
    hardDelete() {
      var result = confirm("Xóa hoàn toàn?");
      if (result) {
        this.isLoading = true;
        TodayILearnedRepository.delete(this.id)
        .then(() => {
          this.isLoading = false;
          window.removeEventListener('beforeunload', warningUnsave);
          this.$router.push(ROUTES_NAME.TODAY_I_LEARNEDS);
        }).catch((e: Error) => {
          this.isLoading = false;
          alert(getResponseError(e));
        });
      }
    }
  },

  beforeMount() {
    TodayILearnedRepository.findById(this.id).then(res => {
      this.todayILearned = res;
      this.isFetched = true;
    }).catch((e: Error) => {
      this.isFetched = true;
      alert(getResponseError(e));
    });
  },
  beforeRouteEnter() {
    window.addEventListener('beforeunload', warningUnsave);
  },
  beforeRouteLeave(to, from , next)  {
    const answer = window.confirm(confirmationMessage);
    if (answer) {
      window.removeEventListener('beforeunload', warningUnsave);
      next();
    } else {
      next(false);
    }
  }
});
</script>
