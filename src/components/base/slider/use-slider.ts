import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";

import { onMounted, onUnmounted, ref } from "vue";

BScroll.use(Slide);
export default function useSlider(wrapperRef: any) {
  const slider = ref();
  const currentPageIndex = ref(0);

  onMounted(() => {
    const sliderValue = (slider.value = new BScroll(wrapperRef.value, {
      scrollX: true,
      scrollY: false,
      slide: true,
      click: true,
      momentum: false,
      bounce: false,
      probeType: 3,
    }));

    sliderValue.on("slideWillChange", (page: any) => {
      currentPageIndex.value = page.pageX;
    });
  });

  onUnmounted(() => {
    slider.value.destroy();
  });

  return { slider, currentPageIndex };
}
