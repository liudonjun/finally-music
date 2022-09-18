import { save, remove, clear } from "@/utils/array-store.ts";
import { mainStore } from "@/store/index";

export default function useSearchHistory() {
  const maxLen = 200;

  const store = mainStore();

  function saveSearch(query: any) {
    const searches = save(
      query,
      "__search__",
      (item: any) => {
        return item === query;
      },
      maxLen
    );
    store.setSearchHistory(searches);
  }

  function deleteSearch(query: any) {
    const searches = remove("__search__", (item: any) => {
      return item === query;
    });
    store.setSearchHistory(searches);
  }

  function clearSearch() {
    const searches = clear("__search__");
    store.setSearchHistory(searches);
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch,
  };
}
