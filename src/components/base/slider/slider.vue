<template>
  <div class="slider" ref="rootRef">
    <div class="slider-group">
      <div class="slider-page" v-for="item in sliders" :key="item.id">
        <span>
          <keep-alive>
            <img :src="item.pic" @click.stop="changePage(item)" />
          </keep-alive>
        </span>
      </div>
    </div>
    <div class="dots-wrapper">
      <span
        class="dot"
        v-for="(item, index) in sliders"
        :key="item.id"
        :class="{ active: currentPageIndex === index }"
      >
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useSlider from "./use-slider";

defineProps({
  sliders: {
    type: Array,
    default() {
      return [];
    },
  },
});

const emit = defineEmits(["select"]);

const changePage = (item: any) => {
  emit("select", item);
};

const rootRef = ref(null);
const { currentPageIndex } = useSlider(rootRef);
</script>

<style lang="scss" scoped>
.slider {
  min-height: 1px;
  font-size: 0;
  touch-action: pan-y;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-page {
      display: inline-block;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      a {
        display: block;
        width: 100%;
      }
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .dots-wrapper {
    position: absolute;
    left: 50%;
    bottom: 12px;
    line-height: 12px;
    transform: translateX(-50%);
    .dot {
      display: inline-block;
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
}
</style>
