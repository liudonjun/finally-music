<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" @click="random" v-show="songs.length > 0">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <Scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :rank="rank" @select="selectItem" :songs="songs"></song-list>
      </div>
    </Scroll>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import Scroll from "@/components/wrap-scroll";
import SongList from "../base/song-list/song-list.vue";
import { storeToRefs } from "pinia";
import { getLyric, getSongUrl } from "@api/api";
import { mainStore } from "@/store/index";
import router from "@/router";

// const { helloWorld, count } = storeToRefs(store);

const store = mainStore();

const RESERVED_HEIGHT = 40;

const imageHeight = ref(0);
const scrollY = ref(0);
const maxTranslateY = ref(0);

const bgImage = ref(null);

const props = defineProps({
  songs: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
  },
  noResultText: {
    type: String,
    default: "抱歉，没有找到可播放的歌曲",
  },
  pic: {
    type: String,
    default: "",
  },
  rank: Boolean,
});
onMounted(() => {
  console.log(bgImage);
  imageHeight.value = bgImage.value.clientHeight;
  maxTranslateY.value = imageHeight.value - RESERVED_HEIGHT;
});

const goBack = () => {
  router.back();
};

const onScroll = (pos: any) => {
  scrollY.value = -pos.y;
};

const selectItem = async (item: any, index: any) => {
  const res = await getLyric(item.id);
  const res1 = await getSongUrl(item.id);
  props.songs[index]["pic"] = res.data.info.album_pic;
  props.songs[index]["lyric"] = res.data.lrc;
  props.songs[index]["url"] = res1.data.url;
  // Object.defineProperty(props.songs[index], "pic", {
  //   value: res.data.info.album_pic,
  // });
  // Object.defineProperty(props.songs[index], "url", {
  //   value: res1.data.url,
  // });

  store.setlectPlay(props.songs, index);
};

const random = async () => {
  store.randomPlay(props.songs);
};

const playBtnStyle = computed(() => {
  let display = "";
  if (scrollY.value >= maxTranslateY.value) {
    display = "none";
  }
  return {
    display,
  };
});
const noResult = computed(() => {
  return !props.loading && !props.songs.length;
});
const scrollStyle = computed(() => {
  return {
    top: `${imageHeight.value}px`,
  };
});
const filterStyle = computed(() => {
  let blur = 0;
  const scrollY2 = scrollY.value;
  const imageHeight2 = imageHeight.value;

  if (scrollY2 >= 0) {
    blur =
      Math.min(maxTranslateY.value / imageHeight2, scrollY2 / imageHeight2) *
      10;
  }

  return {
    backdropFilter: `blur(${blur}px)`,
  };
});
const bgImageStyle = computed(() => {
  const scrollY1 = scrollY.value;
  let zIndex = 0;
  let paddingTop: any = "70%";
  let height: any = 0;
  let translateZ = 0;
  if (scrollY1 > maxTranslateY.value) {
    zIndex = 10;
    paddingTop = 0;
    height = `${RESERVED_HEIGHT}px`;
  }

  let scale = 1;

  if (scrollY1 < 0) {
    scale = 1 + Math.abs(scrollY1 / imageHeight.value);
  }
  return {
    zIndex,
    paddingTop,
    height,
    backgroundImage: `url(${props.pic})`,
    transform: `scale(${scale})translateZ(${translateZ}px)`,
  };
});
</script>
<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    // height: 300px;
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
