import { mainStore } from "@/store/index";
import { computed } from "vue";
import { save, remove } from "@/utils/array-store";

export default function useFavorite() {
  const store = mainStore();
  const favoriteList = computed(() => store.favoriteList);
  const maxLen = 100;

  function getFavoriteIcon(song: any) {
    return isFavorite(song) ? "icon-favorite" : "icon-not-favorite";
  }

  function isFavorite(song: any) {
    return (
      favoriteList.value.findIndex((item: any) => {
        return song.id === item.id;
      }) > -1
    );
  }

  function toggleFavorite(song: any) {
    let list;
    if (isFavorite(song)) {
      // remove
      list = remove("__favorite__", compare);
    } else {
      // save
      list = save(song, "__favorite__", compare, maxLen);
    }
    store.setFavoriteList(list);

    function compare(item: any) {
      return item.id === song.id;
    }
  }

  return {
    getFavoriteIcon,
    toggleFavorite,
  };
}
