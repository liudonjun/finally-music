<template>
  <div class="progress-bar" ref="progressRoot" @click="onClick">
    <div class="bar-inner">
      <div class="progress" :style="progressStyle" ref="progressRef"></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
const progressBtnWidth = 16; //按钮默认宽度
const progressRoot = ref(null); //父元素   this.$el
const progressRef = ref(null); //进度元素   this.$refs.progressRef
const offset = ref(0); //偏移量
// 进度条的宽度
const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
});

var touch = ref({});

const emit = defineEmits(["progress-changing", "progress-changed"]);

const progressStyle = computed(() => {
  return `width: ${offset.value}px`;
});

const btnStyle = computed(() => {
  return `transform:translate3d(${offset.value}px,0,0)`;
});

// 拖动开始
const onTouchStart = (e: any) => {
  touch.value.x1 = e.touches[0].pageX;
  touch.value.beginWidth = progressRef.value?.clientWidth;
};
// 正在拖动
const onTouchMove = (e: any) => {
  const delta = e.touches[0].pageX - touch.value?.x1;
  const tempWidth = touch.value?.beginWidth + delta;
  const barWidth = progressRoot.value?.clientWidth - progressBtnWidth;
  const progress = Math.min(1, Math.max(tempWidth / barWidth, 0));
  offset.value = barWidth * progress;
  emit("progress-changing", progress);
};
// 拖动结束
const onTouchEnd = () => {
  const barWidth = progressRoot.value.clientWidth - progressBtnWidth;
  const progress: any = progressRef.value.clientWidth / barWidth;
  emit("progress-changed", progress);
};

const onClick = (e: any) => {
  const rect = progressRoot.value.getBoundingClientRect();
  const offsetWidth = e.pageX - rect.left;
  const barWidth = progressRoot.value.clientWidth - progressBtnWidth;
  const progress = offsetWidth / barWidth;
  emit("progress-changed", progress);
};

const setOffset = (progress: any) => {
  const barWidth = progressRoot.value.clientWidth - progressBtnWidth;
  offset.value = barWidth * progress;
};

// 监听进度变化改变偏移量
watch(
  () => props.progress,
  (newProgress: any) => {
    setOffset(newProgress);
  }
);
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
