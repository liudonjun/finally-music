<template>
  <div class="player" v-show="playList.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img v-lazy="currentSong.pic" alt="" />
        </div>
        <!-- 顶部标题区域 -->
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.artist_name }}</h2>
        </div>
        <!-- 播放器组件中间部分 -->
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper" ref="cdWrapperRef">
              <div class="cd" ref="cdRef">
                <img
                  ref="cdImageRef"
                  class="image"
                  :class="cdCls"
                  v-lazy="currentSong.pic"
                  alt=""
                />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <!-- :style="middleRStyle" -->
          <scroll class="middle-r" :style="middleRStyle" ref="lyricScrollRef">
            <div class="lyric-wrapper">
              <div
                v-if="currentSong"
                ref="lyricListRef"
                @touchstart.prevent="onTouchStart"
                @touchend="onTouchEnd"
                @touchmove="onTouchMove"
              >
                <p
                  class="text"
                  :class="{
                    current: currentLineNum === index,
                  }"
                  v-for="(line, index) in currentSong.lyric"
                  :key="line.time"
                >
                  {{ line.lineLyric }}
                </p>
              </div>
              <!-- <div class="pure-music" v-show="pureMusicLyric">
              <p>{{ pureMusicLyric }}</p>
            </div> -->
            </div>
          </scroll>
        </div>
        <div></div>
        <!-- 操作按钮组 -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span
              class="dot"
              @click="currentDot('cd')"
              :class="{ active: currentShow === 'cd' }"
            ></span>
            <span
              @click="currentDot('lyric')"
              class="dot"
              :class="{ active: currentShow === 'lyric' }"
            ></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                ref="barRootRef"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
                :progress="progress"
              />
            </div>
            <span class="time time-r">{{ formatTime(duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="modeIcon"></i>
            </div>
            <div class="icon i-left" :style="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :style="disableCls">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :style="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i
                @click="toggleFavorite(currentSong)"
                :class="getFavoriteIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <mini-player :progress="progress" :togglePlay="togglePlay" />
    <audio
      ref="audioRef"
      @timeupdate="updateTime"
      @canplay="ready()"
      @error="error"
      @ended="end"
    ></audio>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { mainStore } from "@/store/index";
import { computed, watch, ref, nextTick, onMounted } from "vue";
import useMode from "./use-mode";
import useFavorite from "./use-favorite";
import useMiddleInteractive from "./use-middle-interactive";
import useAnimation from "./use-animation";
import useCd from "./use-cd";
import ProgressBar from "./progress-bar.vue";
import Scroll from "@/components/wrap-scroll";
import usePlayHistory from "./use-play-history";
import { formatTime } from "@/utils/util";
import { PLAY_MODE } from "../../assets/common";
import MiniPlayer from "./mini-player.vue";
const store = mainStore();

const audioRef = ref(null);
const songReady = ref(false);
const barRootRef = ref(null);
const currentTime = ref(0);

const lyricisTouch = ref(false);

// 当前展示歌词
const playingLyric = ref("");

// 歌词相关
const lyricScrollRef = ref(null);
const lyricListRef = ref(null);

let progressChange = false;
const { savePlay } = usePlayHistory();
const { modeIcon, changeMode } = useMode();
const { getFavoriteIcon, toggleFavorite } = useFavorite();
const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation();

const {
  currentShow,
  middleLStyle,
  middleRStyle,
  onMiddleTouchEnd,
  onMiddleTouchMove,
  onMiddleTouchStart,
} = useMiddleInteractive();

const { cdCls, cdRef, cdImageRef } = useCd();

const playList = computed(() => {
  return store.playlist;
});
const currentIndex = computed(() => {
  return store.currentIndex;
});
const fullScreen = computed(() => {
  return store.fullScreen;
});
const currentSong = computed(() => {
  return store.currentSong;
});

const duration = computed(() => {
  if (!songReady.value) {
    return 0;
  }
  return audioRef.value.duration;
});

// 播放模式
const playMode = computed(() => store.playMode);

// 播放结束
const end = () => {
  currentTime.value = 0;
  if (playMode.value === PLAY_MODE.loop) {
    loop();
  } else {
    next();
  }
};

const currentDot = (type: String) => {
  currentShow.value = type;
  let currentView = "cd";
  let offsetWidth;
  let opacity;
  if (currentShow.value === "cd") {
    currentView = "cd";
    offsetWidth = 0;
    opacity = 1;
  } else {
    currentView = "lyric";
    offsetWidth = -window.innerWidth;
    opacity = 0;
  }

  const duration = 300;
  middleLStyle.value = {
    opacity,
    transitionDuration: `${duration}ms`,
  };

  middleRStyle.value = {
    transform: `translate3d(${offsetWidth}px, 0, 0)`,
    transitionDuration: `${duration}ms`,
  };
};

// const currentLineNum = (list: any) => {
//   for (let i = 0; i < list.length; i++) {
//     const item = list[i];
//     if (parseFloat(item.time) < currentTime.value) {
//       return i;
//     }
//   }
//   // list.forEach(item,index => {
//   //     item.time
//   // });
//   // currentTime.value
// };

const currentLineNum = computed(() => {
  if (!currentSong.value.lyric) {
    return 0;
  }
  const list = currentSong.value.lyric;
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const item1 = list[i + 1];
    if (!list[i + 1]) {
      return list.length - 1;
    }
    if (
      currentTime.value >= parseFloat(item.time) &&
      currentTime.value <= parseFloat(item1.time)
    ) {
      // console.log(i);
      playingLyric.value = currentSong.value.lyric[i].lineLyric;
      // 拿到歌词播放到第几行 i
      // const scrollComp = lyricScrollRef.value;
      // const listEl = lyricListRef.value;
      // if (!listEl) {
      //   return;
      // }

      // if (i > 6 && !lyricisTouch.value) {
      //   // 歌词往下走
      //   const lineEl = listEl.children[i - 6];
      //   scrollComp.scroll.scrollToElement(lineEl, 1000); //滚到某个元素
      // } else {
      //   scrollComp.scroll.scrollTo(0, 0, 1000);
      // }
      return i;
    }
  }
});

watch(currentLineNum, (newVal, oldVal) => {
  if (newVal === oldVal) {
    return;
  }
  const scrollComp = lyricScrollRef.value;
  const listEl = lyricListRef.value;
  if (!listEl) {
    return;
  }
  if (newVal > 6 && !lyricisTouch.value && listEl.children.length) {
    // 歌词往下走
    const lineEl = listEl.children[newVal - 6];
    if (!lineEl) {
      return;
    }
    scrollComp.scroll.scrollToElement(lineEl, 1000); //滚到某个元素
  } else {
    scrollComp.scroll.scrollTo(0, 0, 1000);
  }
});

const onTouchStart = (e: any) => {
  console.log(e);
  lyricisTouch.value = true;
};
const onTouchMove = (e: any) => {
  console.log(e);
  lyricisTouch.value = true;
};
const onTouchEnd = (e: any) => {
  console.log(e);
  lyricisTouch.value = false;
};

// watch(currentLineNum, (lineNum) => {
//   const scrollComp = lyricScrollRef.value;
//   const listEl = lyricListRef.value;
//   if (!listEl) {
//     return;
//   }
//   if (lineNum > 5) {
//     const lineEl = listEl.children[lineNum - 5];
//     scrollComp.scroll.scrollToElement(lineEl, 1000);
//   } else {
//     scrollComp.scroll.scrollTo(0, 0, 1000);
//   }
// });

const progress = computed(() => {
  // console.log((currentTime.value / duration.value) * 1000);
  // console.log(currentTime.value);
  return currentTime.value / duration.value;
});

const disableCls = computed(() => {
  return songReady.value ? "" : "disable";
});
// 播放状态
const playing = computed(() => {
  return store.playing;
});

const onProgressChanging = (progress: any) => {
  progressChange = true;
  currentTime.value = duration.value * progress;
};

const onProgressChanged = (progress: any) => {
  progressChange = false;
  audioRef.value.currentTime = currentTime.value = progress * duration.value;
  if (!playing.value) {
    store.setPlayingState(true);
  }
};

//播放/暂停
const togglePlay = () => {
  if (!songReady.value) return;
  store.setPlayingState(!playing.value);
};

const updateTime = (e: any) => {
  if (!progressChange) {
    currentTime.value = e.target.currentTime;
  }
  // console.log(audioRef.value.duration);
};

const prev = () => {
  const list = playList.value;
  if (!songReady.value || !list.length) return;
  if (list.length === 1) {
    loop();
  } else {
    let index = currentIndex.value - 1;
    if (index === -1) {
      index = list.length - 1;
    }
    store.changeIndex(index);
    // store.setCurrentIndex(index);
    if (!playing.value) {
      store.setPlayingState(true);
    }
  }
};
const next = () => {
  const list = playList.value;
  if (!songReady.value || !list.length) return;
  if (list.length === 1) {
    loop();
  } else {
    let index = currentIndex.value + 1;
    if (index === list.length) {
      index = 0;
    }
    store.changeIndex(index);
    // store.setCurrentIndex(index);
    if (!playing.value) {
      store.setPlayingState(true);
    }
  }
};
//循环播放
const loop = () => {
  const audioEl = audioRef.value;
  audioEl.currentTime = 0;
  audioRef.value.play();
  store.setPlayingState(true);
};

//
const ready = () => {
  if (songReady.value) return;
  songReady.value = true;
  savePlay(currentSong.value);
};
const error = () => {
  songReady.value = true;
};

const playIcon = computed(() => {
  return playing.value ? "icon-pause" : "icon-play";
});

const goBack = () => {
  store.setFullScreen(false);
};

watch(playing, (newval) => {
  if (!songReady.value) return;
  if (newval) {
    audioRef.value.play();
  } else {
    audioRef.value.pause();
  }
});

// TODO: bug 暂不处理
// 处理mini播放进度展示错误问题
// watch(fullScreen, async (newval) => {
//   if (newval) {
//     await nextTick();
//     barRootRef.value.setOffset(progress.value);
//   }
// });

watch(currentSong, (newSong) => {
  console.log(newSong);
  if (!newSong.id || !newSong.url) {
    return;
  }
  // currentLineNum.value = 0; //当前播放歌词下标
  currentTime.value = 0;
  songReady.value = false;
  const audioEl = audioRef.value;
  audioEl.src = newSong.url;
  audioEl.play();
});
</script>
<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
