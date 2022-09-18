<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query" />
      <!-- <input type="text" v-model="query" /> -->
    </div>
    <scroll ref="scrollRef" class="search-content" v-show="!query">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="item in hotKeys"
              :key="item.id"
              @click="addQuery(item.key)"
            >
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <!-- 搜索历史事件派发保存Pinia中 待处理 TODO  -->
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          >
          </confirm>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          ></search-list>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest
        :query="query"
        @select-song="selectSong"
        @select-singer="selectSinger"
      ></suggest>
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :singer="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch, nextTick, computed } from "vue";
import SearchInput from "@comp/search/search-input.vue";
import Confirm from "@/components/base/confirm/confirm.vue";
import { mainStore } from "@/store/index";
import suggest from "@comp/search/suggest.vue";
import Scroll from "@/components/wrap-scroll";
import SearchList from "@/components/base/search-list/search-list.vue";
import { getHotSearch, getLyric, getSongUrl } from "@api/api";
import useSearchHistory from "@/components/search/use-search-history";
import router from "@/router";
const store = mainStore();
const query = ref("");
const hotKeys = ref([]);
const selectedSinger = ref(null);
const scrollRef = ref(null);
const confirmRef = ref(null);

const searchHistory = computed(() => store.searchHistory);

const { saveSearch, deleteSearch, clearSearch } = useSearchHistory();

onBeforeMount(() => {
  getHotSearch().then((res: any) => {
    console.log(res);
    hotKeys.value = res.data;
  });
});

watch(query, async (newQuery) => {
  if (!newQuery) {
    await nextTick();
    refreshScroll();
  }
});

function showConfirm() {
  confirmRef.value.show();
}

function addQuery(s: any) {
  query.value = s;
}

function refreshScroll() {
  scrollRef.value.scroll.refresh();
}

async function selectSong(song: any) {
  await getSongUrl(song.id).then((res: any) => {
    song["url"] = res.data.url;
  });
  await getLyric(song.id).then((res: any) => {
    song["pic"] = res.data.info.album_pic;
    song["lyric"] = res.data.lrc;
  });
  await nextTick();
  saveSearch(query.value);
  store.addSong(song);
}

function selectSinger(singer: any) {
  console.log(singer);
  saveSearch(query.value);
  selectedSinger.value = singer;
  cacheSinger(singer);

  router.push({
    path: `/search/${singer.id}`,
  });
}

function cacheSinger(singer) {
  sessionStorage.setItem("__singer__", JSON.stringify(singer));
}
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
