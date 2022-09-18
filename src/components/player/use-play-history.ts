import { mainStore } from "@/store/index";
import { save } from "@/utils/array-store.ts";

export default function usePlayHistory() {
  const store = mainStore();

  const maxLen = 200;

  function savePlay(song) {
    const songs = save(
      song,
      "__play__",
      (item) => {
        return item.id === song.id;
      },
      maxLen
    );

    store.setPlayHistory(songs);
  }

  return {
    savePlay,
  };
}
