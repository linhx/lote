<template>
  <div class="w-full md:max-w-4xl mx-auto">
    <today-i-learned-item-list
      class="py-3 border-b-1"
      v-for="todayILearned in todayILearnedList?.items"
      :key="todayILearned.id"
      :today-i-learned="todayILearned"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TodayILearnedItemList from './TodayILearnedItemList.vue';
import TodayILearnedRepository from '../../repositories/TodayILearnedRepository';
import PageDto from '../../dtos/PageDto';
import TodayILearnedItemListDto from '../../dtos/TodayILearnedItemListDto';
import ReqNoteFilterDto from '../../dtos/ReqTodayILearnedFilterDto';
import { ActiveLoader } from 'vue-loading-overlay';

export default defineComponent({
  components: {
    TodayILearnedItemList,
  },
  data(): {
    todayILearnedList: PageDto<TodayILearnedItemListDto> | null;
    filter: ReqNoteFilterDto;
  } {
    return {
      todayILearnedList: null,
      filter: {
        page: 1,
      },
    };
  },

  methods: {
    showLoading() {
      return this.$loading.show();
    },
    hideLoading(loader: ActiveLoader) {
      loader.hide();
    },
  },

  mounted() {
    const loader = this.showLoading();
    TodayILearnedRepository.getList(this.filter).then((res) => {
      this.todayILearnedList = res;
    }).finally(() => {
      this.hideLoading(loader);
    });
  },
});
</script>
