import { mainStore } from "@/store/index";
import { computed } from "vue";
import { PLAY_MODE } from "@/assets/common";

export default function useMode() {
  const store = mainStore();
  const playMode = computed(() => store.playMode);

  const modeIcon = computed(() => {
    const playModeVal = playMode.value;
    return playModeVal === PLAY_MODE.sequence
      ? "icon-sequence"
      : playModeVal === PLAY_MODE.loop
      ? "icon-loop"
      : "icon-random";
  });

  function changeMode() {
    const mode = (playMode.value + 1) % 3;
    store.changeMode(mode);
  }

  return {
    modeIcon,
    changeMode,
  };
}
