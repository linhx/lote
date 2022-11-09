<template>
  <nav class="bg-gray-800 w-full">
  <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
    <div class="relative flex items-center justify-between h-16">
      <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false" @click="toggleMenu">
          <span class="sr-only">Open main menu</span>
          <svg class="block h-6 w-6" :class="{ hidden: isOpenMenu }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg class="h-6 w-6" :class="{ hidden: !isOpenMenu }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/">
            <img class="block lg:hidden h-8 w-auto" src="../assets/img/icon-home.png" alt="Home">
            <img class="hidden lg:block h-8 w-auto" src="../assets/img/icon-home.png" alt="Home">
          </router-link>
        </div>
        <div class="hidden sm:block sm:ml-6">
          <div class="flex space-x-4">
            <Menu as="div" class="relative ml-3">
              <div>
                <MenuButton class="menu-item flex">
                  <span>Note</span>
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem v-slot="{ active }">
                    <button class="block px-4 py-2 text-sm text-gray-700 focus:outline-none w-full text-left" @click="$router.push('/note/create')">Create</button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button class="block px-4 py-2 text-sm text-gray-700 focus:outline-none w-full text-left" @click="clickMenu('republishNotes')">Re-publish all notes</button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>

            <Menu as="div" class="relative ml-3">
              <div>
                <MenuButton class="menu-item flex">
                  <span>Today I learned</span>
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute z-10 mt-2 w-60 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem v-slot="{ active }">
                    <button class="block px-4 py-2 text-sm text-gray-700 focus:outline-none w-full text-left" @click="$router.push('/today-i-learned')">List</button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button class="block px-4 py-2 text-sm text-gray-700 focus:outline-none w-full text-left" @click="$router.push('/today-i-learned/create')">Create</button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button class="block px-4 py-2 text-sm text-gray-700 focus:outline-none w-full text-left" @click="clickMenu('republishAllTodayILearneds')">Re-publish all today-id-learn</button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="sm:hidden" :class="{ hidden: !isOpenMenu }">
    <div class="px-2 pt-2 pb-3 space-y-1">
      <router-link to="/note/create" class="menu-item-mobile" @click="closeMenu">Create</router-link>
      <button class="menu-item-mobile" @click="clickMenu('republishNotes')">Re-publish all notes</button>
    </div>
  </div>
</nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';

export default defineComponent({
  components: {
    Menu, MenuButton, MenuItem, MenuItems
  },
  data() {
    return {
      isOpenMenu: false
    }
  },
  methods: {
    toggleMenu() {
      this.isOpenMenu = !this.isOpenMenu;
    },
    closeMenu() {
      this.isOpenMenu = false;
    },
    clickMenu(name: string) {
      this.closeMenu();
      this.$emit('clickMenu', name);
    }
  }
})
</script>

<style lang="postcss">
.menu-item {
  @apply text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium;
}
.menu-item-mobile {
  @apply text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium;
}
.menu-item.router-link-active {
  @apply bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium;
}
.menu-item-mobile.router-link-active {
  @apply bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium
}
</style>
