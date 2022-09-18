import { mainStore } from "@/store/index";
import { computed, ref, watch } from "vue";

export default function useCd() {
  const cdRef = ref(null);
  const cdImageRef = ref(null);
  const store = mainStore();
  const playing = computed(() => store.playing);

  const cdCls = computed(() => {
    return playing.value ? "playing" : "";
  });

  // 同步旋转角度
  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value);
    }
  });

  function syncTransform(wrapper: any, inner: any) {
    const wrapperTransform = window.getComputedStyle(wrapper).transform;
    const innerTransform = getComputedStyle(inner).transform;
    wrapper.style.transform =
      wrapperTransform === "none"
        ? innerTransform
        : innerTransform.concat(" ", wrapperTransform);
  }

  return { cdCls, cdRef, cdImageRef };
}
