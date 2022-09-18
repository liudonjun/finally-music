<template>
  <ul class="song-list">
    <li
      class="item"
      v-for="(song, index) in songs"
      :key="song.id"
      @click="selectItem(song, index)"
    >
      <div class="rank" v-if="rank">
        <span :class="getRankCls(index)">{{ getRankText(index) }}</span>
      </div>
      <div class="content">
        <h2 class="name">{{ song.name }}</h2>
        <p class="desc">{{ getDesc(song) }}</p>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps({
  songs: {
    type: Array,
    default() {
      return [];
    },
  },
  rank: Boolean,
});
const emit = defineEmits(["select"]);

const getDesc = (song: any) => {
  return `${song.album_name}·${song.artist_name}`;
};
const selectItem = (song: any, index: any) => {
  emit("select", song, index);
};
const getRankCls = (index: any) => {
  if (index <= 2) {
    return `icon icon${index}`;
  } else {
    return "text";
  }
};
const getRankText = (index: any) => {
  if (index > 2) {
    return index + 1;
  }
};
</script>

<style lang="scss" scoped>
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 20px;
      text-align: center;
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0 {
          @include bg-image("first");
        }
        &.icon1 {
          @include bg-image("second");
        }
        &.icon2 {
          @include bg-image("third");
        }
      }
      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap();
        color: $color-text;
      }
      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
