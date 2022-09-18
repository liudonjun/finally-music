import { createApp } from "vue";
import App from "./App.vue";
// import store from './store'
import router from "./router/index";
import { createPinia } from "pinia";
import { mainStore } from "@/store/index";
import VueLazyLoad from "vue3-lazyload";
import loadingDirective from "@comp/base/loading/directive";
import noResultDirective from "@comp/base/no-result/directive";
import { load, saveAll } from "@util/array-store.ts";
// 导入全局样式
import "./styles/index.scss";

let app = createApp(App);
let pinia = createPinia();
app.use(router);
app.use(pinia);
app.directive("loading", loadingDirective);
app.directive("no-result", noResultDirective);
app.use(VueLazyLoad, {
  loading: new URL("./assets/images/default.png", import.meta.url),
});
app.mount("#app");

const store = mainStore();

const favoriteSongs = load("__favorite__");
if (favoriteSongs.length > 0) {
  store.setFavoriteList(favoriteSongs);
  saveAll(favoriteSongs, "__favorite__");
}

const historySongs = load("__play__");
if (historySongs.length > 0) {
  store.setPlayHistory(historySongs);
  saveAll(historySongs, "__play__");
}
