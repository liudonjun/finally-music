<template>
  <div class="singer-detail">
    <music-list
      :songs="detailData"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, computed, onMounted } from "vue";
import { getplayListDetail, getBannerPlayList } from "@api/api";
import { useRoute } from "vue-router";
import router from "../../router";
import MusicList from "@comp/music-list/music-list.vue";

const detailData = ref([]);
const loading = ref(true);
const props = defineProps({
  singer: {
    type: Object,
    default() {
      return {};
    },
  },
});

const route = useRoute();

const computedSinger = computed(() => {
  let ret = null;
  const singerData = props.singer;

  if (singerData&&singerData.value) {
    ret = singerData;
  } else {
    const cachedSinger = JSON.parse(sessionStorage.getItem("__album__"));
    if (cachedSinger && cachedSinger.id == route.params.id) {
      ret = cachedSinger;
    }
  }
  return ret;
});

const title = computed(() => {
  const singerData = computedSinger.value;
  return singerData && singerData.name;
});
const pic = computed(() => {
  const singerData = computedSinger.value;
  return singerData && singerData.pic;
});

onMounted(() => {
  console.log(computedSinger);
  if (!computedSinger.value) {
    const path = route.matched[0].path;
    router.push({
      path: path,
    });
    return;
  }
  let id = "";
  if (computedSinger.value.detail) {
    id = computedSinger.value.detail;
  } else {
    id = computedSinger.value.id;
  }
  console.log(id);
  if (computedSinger.value.digest == "13") {
    getBannerPlayList(id, 1, 100).then((res: any) => {
      loading.value = false;
      detailData.value = res.data.list;
    });
    return;
  }
  getplayListDetail(id, 1, 100).then((res: any) => {
    loading.value = false;
    detailData.value = res.data.musicList;
  });
});
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
