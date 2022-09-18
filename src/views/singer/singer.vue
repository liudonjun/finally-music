<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList @select="selectSinger" :data="singers"></IndexList>
    <router-view :style="viewStyle" v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :singer="selectSingerData" />
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import IndexList from "@comp/base/index-list/index-list.vue";
import router from "@/router";
import { getSingerList } from "@api/api";
import { computed } from "@vue/reactivity";
import { mainStore } from "@/store/index";

const noResultText = ref("暂时没有更多歌手！");
const store = mainStore();

const singers = ref([]);
const selectSingerData = ref(null);

const playlist = computed(() => store.playlist);
const viewStyle = computed(() => {
  const bottom = playlist.value.length ? "60px" : "0";
  return {
    bottom,
  };
});

onBeforeMount(async () => {
  const res = await getSingerList();
  console.log(res);
  if (res.data instanceof Array) {
    singers.value = res.data;
  } else {
    singers.value = [];
  }
});

const selectSinger = (item: any) => {
  selectSingerData.value = item;
  cacheSinger(item);
  router.push(`/singer/${item.id}`);
};

const cacheSinger = (item: any) => {
  sessionStorage.setItem("__singer__", JSON.stringify(item));
};
</script>
<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
