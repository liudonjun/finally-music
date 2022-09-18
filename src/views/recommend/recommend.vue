<template>
  <div class="recommend" v-loading="loading">
    <Scroll class="recommend-content">
      <div>
        <div class="slider-wrapper" v-if="sliders.length">
          <div class="slider-content">
            <slider @select="selectBanner" :sliders="sliders"></slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li
              v-for="item in albums"
              class="item"
              :key="item.id"
              @click="selectAlbumItem(item)"
            >
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic" />
              </div>
              <div class="text">
                <h2 class="name">
                  {{ item.name }}
                </h2>
                <p class="title">{{ item.artist_name }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
    <router-view :style="viewStyle" v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :singer="selectSingerData" />
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref, computed } from "vue";
import { getBanner, getplayList } from "@api/api";
import Slider from "@comp/base/slider/slider.vue";
import Scroll from "@/components/wrap-scroll";
import { storeToRefs } from "pinia";
import router from "@/router";
import { mainStore } from "@/store/index";
const store = mainStore();

const playlist = computed(() => store.playlist);
const viewStyle = computed(() => {
  const bottom = playlist.value.length ? "60px" : "0";
  return {
    bottom,
  };
});
// const { helloWorld, count } = storeToRefs(store);
const sliders = ref([]);
const albums = ref([]);

// 点击item获得
const selectSingerData = ref(null);

const selectAlbumItem = (item: any) => {
  selectSingerData.value = item;
  cacheAlbum(item);
  router.push(`/recommend/${item.id}`);
};

const selectBanner = (item: any) => {
  selectSingerData.value = item;
  cacheAlbum(item);
  router.push(`/recommend/${item.id}`);
};

const cacheAlbum = (item: any) => {
  sessionStorage.setItem("__album__", JSON.stringify(item));
};

// store.changeState()

const loading = computed(() => {
  return !albums.value.length;
});
onBeforeMount(async () => {
  console.log(loading.value);
  const res = await getBanner();
  if (res.success) {
    const { data } = res;
    console.log(data);
    sliders.value = data;
  }
  const respone = await getplayList();
  console.log(respone);
  if (respone.success) {
    const { data } = respone;
    console.log(data);
    albums.value = data.prettyList;
  }
});
</script>
<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }
        .name {
          margin-bottom: 10px;
          color: $color-text;
        }
        .title {
          color: $color-text-d;
        }
      }
    }
  }
}
.recommend::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
