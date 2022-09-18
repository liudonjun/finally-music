import { defineStore } from "pinia";
import { PLAY_MODE } from "@/assets/common.ts";
import { shuffle } from "@/utils/util.js";
import { getSongUrl, getLyric } from "@api/api";
import { load } from "@/utils/array-store.ts";

const mainStore = defineStore("main", {
  state: () => {
    return {
      sequenceList: [],
      playlist: [],
      playing: false,
      playMode: PLAY_MODE.sequence,
      currentIndex: 0,
      fullScreen: false,
      favoriteList: load("__favorite__"),
      searchHistory: load("__search__"),
      playHistory: [],
    };
  },
  getters: {
    currentSong(): any {
      return this.playlist[this.currentIndex] || {};
    },
  },
  actions: {
    //  ---- mutations
    //  修改播放状态
    setPlayingState(playing: any) {
      this.playing = playing;
    },
    setSquencaList(sequenceList: any) {
      this.sequenceList = sequenceList;
    },

    // 设置播放列表
    setPlayList(playlist: any) {
      this.playlist = playlist;
    },
    // 设置播放模式
    setPlayMode(playMode: any) {
      this.playMode = playMode;
    },
    // 设置当前播放索引
    setCurrentIndex(currentIndex: any) {
      this.currentIndex = currentIndex;
    },
    // 设置当前是否展示播放页面
    setFullScreen(fullScreen: any) {
      this.fullScreen = fullScreen;
    },
    //
    setFavoriteList(list: any) {
      this.favoriteList = list;
    },

    setPlayHistory(songs) {
      this.playHistory = songs;
    },

    // -----action
    // 点击列表触发
    setlectPlay(list: any, index: any) {
      this.setPlayMode(PLAY_MODE.sequence);
      this.setSquencaList(list);
      this.setPlayingState(true);
      this.setFullScreen(true);
      this.setPlayList(list);
      this.setCurrentIndex(index);
    },
    // 清除播放列表全部歌曲
    clearSongList() {
      this.setSquencaList([]);
      this.setPlayList([]);
      this.setCurrentIndex(0);
      this.setPlayingState(false);
    },
    // 删除单个播放列表歌曲
    removeSong(song) {
      const sequenceList = this.sequenceList.slice();
      const playlist = this.playlist.slice();

      const sequenceIndex = this.findIndex(sequenceList, song);
      const playIndex = this.findIndex(playlist, song);
      if (sequenceIndex < 0 || playIndex < 0) {
        return;
      }

      sequenceList.splice(sequenceIndex, 1);
      playlist.splice(playIndex, 1);

      let currentIndex = this.currentIndex;
      if (playIndex < currentIndex || currentIndex === playlist.length) {
        currentIndex--;
      }

      this.setSquencaList(sequenceList);
      this.setPlayList(playlist);
      this.setCurrentIndex(currentIndex);
      if (!playlist.length) {
        this.setPlayingState(false);
      }
    },
    // 随机播放
    async randomPlay(list: any) {
      this.setPlayMode(PLAY_MODE.random);
      this.setSquencaList(list);
      this.setPlayingState(true);
      this.setFullScreen(true);
      let randomList = shuffle(list);
      await getLyric(randomList[0].id).then((res) => {
        randomList[0]["pic"] = res.data.info.album_pic;
        randomList[0]["lyric"] = res.data.lrc;
      });
      await getSongUrl(randomList[0].id).then((res) => {
        randomList[0]["url"] = res.data.url;
      });
      this.setPlayList(randomList);
      this.setCurrentIndex(0);
    },
    // 左右切换事件派发 对象加入key
    async changeIndex(index: any) {
      await getSongUrl(this.playlist[index].id).then((res) => {
        this.playlist[index]["url"] = res.data.url;
      });
      await getLyric(this.playlist[index].id).then((res) => {
        this.playlist[index]["pic"] = res.data.info.album_pic;
        this.playlist[index]["lyric"] = res.data.lrc;
      });
      this.setCurrentIndex(index);
    },

    changeMode(mode: any) {
      const currentId = this.currentSong.id;
      if (mode === PLAY_MODE.random) {
        this.setPlayList(shuffle(this.sequenceList));
      } else {
        this.setPlayList(this.sequenceList);
      }

      const index = this.playlist.findIndex((song) => {
        return song.id === currentId;
      });
      this.setCurrentIndex(index);
      this.setPlayMode(mode);
    },

    // addsong
    addSong(song: any) {
      const playList = this.playlist.slice();
      const sequenceList = this.sequenceList.slice();
      let currentIndex = this.currentIndex;
      const playIndex = this.findIndex(playList, song);

      if (playIndex > -1) {
        currentIndex = playIndex;
      } else {
        playList.push(song);
        currentIndex = playList.length - 1;
      }

      const sequenceIndex = this.findIndex(sequenceList, song);
      if (sequenceIndex === -1) {
        sequenceList.push(song);
      }
      this.setSquencaList(sequenceList);
      this.setPlayList(playList);
      this.changeIndex(currentIndex);
      this.setCurrentIndex(currentIndex);
      this.setFullScreen(true);
      this.setPlayingState(true);
    },
    setSearchHistory(searches) {
      this.searchHistory = searches;
    },
    // 添加歌词
    addSongLyric(song: any, lyric: any) {
      this.sequenceList.map((item) => {
        if (item.id === song.id) {
          item.lyric = lyric;
        }
        return item;
      });
    },
    findIndex(list: any, song: any) {
      return list.findIndex((item) => {
        return item.id === song.id;
      });
    },
  },
});

export { mainStore };
