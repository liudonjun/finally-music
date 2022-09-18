<template>
  <Header />
  <Tab />
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view name="user" :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <transition appear name="slide">
        <component :is="Component" />
      </transition>
    </keep-alive>
  </router-view>
  <Player></Player>
</template>
<script lang="ts" setup>
import Header from "@comp/header/header.vue";
import Tab from "@comp/tab/tab.vue";
import Player from "@comp/player/player.vue";
import { computed } from "vue";
import { mainStore } from "@/store/index";
const store = mainStore();

const playlist = computed(() => store.playlist);
const viewStyle = computed(() => {
  const bottom = playlist.value.length ? "60px" : "0";
  return {
    bottom,
  };
});
</script>
