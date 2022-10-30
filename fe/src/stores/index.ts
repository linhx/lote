import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
  state: () => {
    return {
      showButtonBack: false
    };
  },
  actions: {
    setShowButtonBack(val: boolean) {
      this.showButtonBack = val;
    }
  }
});
