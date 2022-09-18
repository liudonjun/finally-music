import {
  h,
  mergeProps,
  withCtx,
  renderSlot,
  ref,
  computed,
  watch,
  nextTick,
} from "vue";
import Scroll from "@comp/base/scroll/scroll.vue";
import { mainStore } from "@/store/index";

export default {
  name: "wrap-scroll",
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(
      Scroll,
      mergeProps(
        {
          ref: "scrollRef",
        },
        ctx.$props,
        {
          onScroll: (e) => {
            ctx.$emit("scroll", e);
          },
        }
      ),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, "default")];
        }),
      }
    );
  },
  setup() {
    const scrollRef = ref(null);
    const scroll = computed(() => {
      return scrollRef.value.scroll;
    });

    const store = mainStore();
    const playlist = computed(() => store.playlist);

    watch(playlist, async () => {
      await nextTick();
      scroll.value.refresh();
    });

    return {
      scrollRef,
      scroll,
    };
  },
};
