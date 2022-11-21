<template>
  <nav>
    <ul v-if="pages > 0" class="pagination">
      <!-- prev page button -->
      <li class="page-item" :class="active(1)" @click="prev">
        <span class="page-link">&lt;</span>
      </li>
      <!-- first page button -->
      <li class="page-item" :class="active(1)" @click="change(1)">
        <span class="page-link">1</span>
      </li>
      <!-- left ellipse button -->
      <li v-if="withLeftEllipse" class="page-item page-ellipse">
        <!-- left page input -->
        <input
          v-if="leftPageInput"
          ref="leftInput"
          type="number"
          @keydown.esc="inputLeft"
          @keydown.enter="inputLeft"
          @blur="inputLeft"
        />
        <span v-if="!leftPageInput" class="page-link" @click="openLeftInput"
          >...</span
        >
      </li>
      <!-- the buttons in the visible -->
      <li
        v-for="i in visiblePages"
        :key="i"
        class="page-item"
        :class="active(i)"
        @click="change(i)"
      >
        <span class="page-link">{{ i }}</span>
      </li>
      <!-- right ellipse button -->
      <li v-if="withRightEllipse" class="page-item page-ellipse">
        <!-- right page input -->
        <input
          v-if="rightPageInput"
          ref="rightInput"
          type="number"
          @keydown.esc="inputRight"
          @keydown.enter="inputRight"
          @blur="inputRight"
        />
        <span v-if="!rightPageInput" class="page-link" @click="openRightInput"
          >...</span
        >
      </li>
      <!-- last page button -->
      <li
        v-if="pages > 1"
        class="page-item"
        :class="active(pages)"
        @click="change(pages)"
      >
        <span class="page-link">{{ pages }}</span>
      </li>
      <!-- next page button -->
      <li class="page-item" :class="active(pages)" @click="next">
        <span class="page-link">&gt;</span>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    modelValue: {
      type: Number,
      required: true,
      default: 1,
    },
    /**
     * rows per page
     */
    rowsPerPage: {
      type: Number,
      default: 10,
    },
    /**
     * total number of rows
     */
    totalRows: {
      type: Number,
      default: 0,
    },
    /**
     * the number of pages are visible before/after the current page.
     */
    edgeCount: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      /**
       * current page
       */
      page: this.modelValue,
      leftPageInput: false,
      rightPageInput: false,
    };
  },
  computed: {
    /**
     * total number of pages
     */
    pages() {
      return Math.ceil(this.totalRows / this.rowsPerPage);
    },
    /**
     * the visible button (include ellipse buttons)
     */
    buttons() {
      return (
        this.edgeCount * 2 + // before + after current page
        1 + // current page
        2
      ); // two ellipse buttons
    },
    /**
     * the start page of the pages in the visible
     * e.g. |1|...|4|5|6|7|8|...|20|
     * 4, 5, 6, 7, 8 is the buttons in the visible
     * the start page is 4
     */
    startVisiblePage() {
      let startVisiblePage = this.page - this.edgeCount;
      return this.getStartVisiblePage(startVisiblePage);
    },
    /**
     * the end page of the pages in the visible
     * e.g. |1|...|4|5|6|7|8|...|20|
     * 4, 5, 6, 7, 8 is the pages in the visible
     * the end page is 8
     */
    endVisiblePage() {
      let endVisiblePage = this.page + this.edgeCount;
      return this.getEndVisiblePage(endVisiblePage);
    },
    /**
     * number of the pages in the visible
     */
    visiblePages() {
      let startVisiblePage = this.startVisiblePage;
      let endVisiblePage = this.endVisiblePage;
      let numOfVisiblePages = endVisiblePage - startVisiblePage;
      numOfVisiblePages = numOfVisiblePages >= 0 ? numOfVisiblePages + 1 : 0;

      let _withLeftEllipse = startVisiblePage !== 2;
      let _withRightEllipse = endVisiblePage !== this.pages - 1;

      if (_withLeftEllipse) numOfVisiblePages++;
      if (_withRightEllipse) numOfVisiblePages++;

      if (numOfVisiblePages < this.buttons) {
        // re-calc the visible pages, if not enough number of buttons
        if (!_withLeftEllipse) {
          endVisiblePage = this.getEndVisiblePage(this.buttons);
        }
        if (!_withRightEllipse) {
          startVisiblePage = this.getStartVisiblePage(
            this.pages - this.buttons + 1
          );
        }
      }
      // create array of visible buttons
      let visiblePagesArr = [];
      for (let i = startVisiblePage; i <= endVisiblePage; i++) {
        visiblePagesArr.push(i);
      }
      return visiblePagesArr;
    },
    /**
     * show the left ellipse button if withLeftEllipse = true
     */
    withLeftEllipse() {
      return this.visiblePages.length && this.visiblePages[0] !== 2;
    },
    /**
     * show the right ellipse button if withRightEllipse = true
     */
    withRightEllipse() {
      return (
        this.visiblePages.length &&
        this.visiblePages[this.visiblePages.length - 1] !== this.pages - 1
      );
    },
  },
  watch: {
    pages() {
      if (this.page > this.pages) {
        this.setPage(this.pages);
      } else {
        this.setPage(this.modelValue);
      }
    },
    modelValue(newVal) {
      this.setPage(newVal);
    },
  },
  methods: {
    /**
     * return the page 2 if the startVisiblePage <= 3
     */
    getStartVisiblePage(startVisiblePage) {
      return startVisiblePage > 3 ? startVisiblePage : 2;
    },
    /**
     * return this.pages - 1 if the endVisiblePage >= this.pages - 2
     */
    getEndVisiblePage(endVisiblePage) {
      return endVisiblePage < this.pages - 2 ? endVisiblePage : this.pages - 1;
    },
    /**
     * return class 'active' if the page equal the current page
     */
    active(page) {
      return this.page === page ? 'active' : null;
    },
    setPage(page) {
      if (!page || page < 1 || this.page === page || page > this.pages) return;
      this.page = +page;
    },
    /**
     * change the current page
     * @param {Number} page the page value want to set
     */
    change(page) {
      this.setPage(page);
      this.$emit('update:modelValue', page);
      this.$emit('change', page);
    },
    /**
     * go to previous page
     */
    prev() {
      if (this.page === 1) return;
      this.change(this.page - 1);
    },
    /**
     * go to next page
     */
    next() {
      if (this.page === this.pages) return;
      this.change(this.page + 1);
    },
    /**
     * open the left page textbox
     */
    openLeftInput() {
      this.leftPageInput = true;
      this.$nextTick(() => {
        this.$refs.leftInput.focus();
      });
    },
    /**
     * open the right page textbox
     */
    openRightInput() {
      this.rightPageInput = true;
      this.$nextTick(() => {
        this.$refs.rightInput.focus();
      });
    },
    /**
     * go to the page which input in the left page textbox
     * @param {Number} page the input's value
     */
    inputLeft(event) {
      if (event.key === 'Escape') {
        event.target.value = null;
      }
      this.change(parseInt(event.target.value));
      this.leftPageInput = false;
    },
    /**
     * go to page which input in the right page textbox
     * @param {Number} page the input's value
     */
    inputRight(event) {
      if (event.key === 'Escape') {
        event.target.value = null;
      }
      this.change(parseInt(event.target.value));
      this.rightPageInput = false;
    },
  },
};
</script>

<style scoped>
.pagination {
  margin-top: 0;
  margin-bottom: 0;
  display: flex;
  padding-left: 0;
  list-style: none;
  border-radius: 0.25rem;
}
.pagination .page-item {
  min-width: 43px;
}
.pagination .page-ellipse {
  width: 43px;
}
.pagination .page-item:first-child .page-link {
  margin-left: 0;
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
}
.pagination .page-link {
  position: relative;
  display: block;
  text-align: center;
  cursor: pointer;
  padding: 0.5rem 0.3rem;
  font-size: 1.25em;
  user-select: none;
  margin-left: -1px;
  line-height: 1.25;
  color: #007bff;
  background-color: #fff;
  border: 1px solid #dee2e6;
  -webkit-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
  -o-user-select: none;
  -moz-user-select: none;
}
.pagination .page-ellipse {
  display: inline-flex;
}
.pagination .page-ellipse span {
  width: 100%;
}
.pagination .page-ellipse input {
  display: inline-block;
  width: 100%;
  margin: 0 1px;
}
.pagination .page-ellipse input::-webkit-outer-spin-button,
.pagination .page-ellipse input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

.pagination .page-item.active .page-link {
  background: none;
  color: black;
}
</style>
