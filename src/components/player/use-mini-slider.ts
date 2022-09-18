import {
  ref,
  computed,
  onMounted,
  watch,
  nextTick,
  onUnmounted,
  watch,
} from "vue";
import { mainStore } from "@/store/index";
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";

BScroll.use(Slide);

export default function useMiniSlider() {
  const slider = ref(null);
  const sliderWrapperRef = ref(null);
  const store = mainStore();
  const fullScreen = computed(() => store.fullScreen);
  const playlist = computed(() => store.playlist);
  const currentIndex = computed(() => store.currentIndex);
  const slideShow = computed(() => {
    return !fullScreen.value && !!playlist.value;
  });
  onMounted(() => {
    let slideVal;
    watch(slideShow, async (newSlideShow) => {
      if (newSlideShow) {
        await nextTick();
        if (!slideVal) {
          slideVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            bounce: false,
            momentum: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true,
            },
          });
          slideVal.on("slidePageChanged", ({ pageX }) => {
            console.log(pageX);
            store.changeIndex(pageX);
            store.setPlayingState(true);
          });
        } else {
          slideVal.refresh();
        }
        slideVal.goToPage(currentIndex.value, 0, 0);
      }
    });
    watch(currentIndex, (newIndex: number) => {
      if (slideVal && slideShow.value) {
        slideVal.goToPage(newIndex, 0, 0);
      }
    });
  });

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy();
    }
  });

  return {
    slider,
    sliderWrapperRef,
  };
}
