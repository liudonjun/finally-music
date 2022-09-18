<template>
  <!-- 歌手列表基础列表组件 -->
  <Scroll class="index-list" :probe-type="3" @scroll="onScroll" ref="scrollRef">
    <ul ref="groupRef">
      <li
        v-for="group in data"
        :key="group.title"
        class="group"
        :style="group.list.length == 1 ? 'padding-bottom:20px' : ''"
      >
        <h2 class="title">{{ group.title }}</h2>
        <ul>
          <li
            @click="onItemClick(item)"
            v-for="item in group.list"
            :key="item.id"
            class="item"
          >
            <img class="avatar" v-lazy="item.pic" alt="" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="fixed" v-show="fixedTitle">
      <div class="fixed-title" :style="fixedStyle">{{ fixedTitle }}</div>
    </div>
    <!-- 右侧快速入口 -->
    <div
      class="shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="item"
          :data-index="index"
          class="item"
          :class="{ current: currentIndex === index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </Scroll>
</template>
<script lang="ts" setup>
import Scroll from "@/components/wrap-scroll";
import useFixed from "./use-fixed.ts";
import useShortcut from "./use-shortcut.ts";

const props = defineProps({
  data: {
    type: Array,
    defalute: () => [],
  },
});

const emit = defineEmits(["select"]);

const onItemClick = (item: any) => {
  emit("select", item);
};

const { groupRef, onScroll, fixedTitle, fixedStyle, currentIndex } =
  useFixed(props);
const { shortcutList, scrollRef, onShortcutTouchStart, onShortcutTouchMove } =
  useShortcut(props, groupRef);
</script>
<style lang="scss" scoped>
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
  .shortcut {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $color-theme;
      }
    }
  }
}
</style>
