import { getAction } from "../utils/http"

// 获取轮播图
const getBanner = () => getAction(`/api/home`)
// 获取歌单列表
const getplayList = () => getAction(`/api/playList1`)
// 获取轮播图歌单列表
const getBannerPlayList = (id: any, pn: any, rn: any) =>
  getAction(`/api/ablumList?id=${id}&pn=${pn}&rn=${rn}`)
// 获取歌单详情列表
const getplayListDetail = (id: any, pn: any, rn: any) =>
  getAction(`/api/playList?id=${id}&pn=${pn}&rn=${rn}&ua=ip=`)
// 获取歌手列表
const getSingerList = () => getAction(`/api/singers`)
// 获取歌手详情
const getSingerDetail = (id: any, pn: any, rn: any) =>
  getAction(`/api/singerDetailList?id=${id}&pn=${pn}&rn=${rn}`)

// 获取排行榜
const getTopList = () => getAction(`/api/rank`)
// 获取排行版详情列表
const getTopListDetail = (id: any, pn: any, rn: any) =>
  getAction(`/api/rankList?id=${id}&pn=${pn}&rn=${rn}`)

  // 获取热门搜索
const getHotSearch = () => getAction(`/api/hotKey`)
// 获取搜索详情列表
const getSearchList = (keyword: any, pn: any) => getAction(`/api/searchList?keyword=${keyword}&pn=${pn}`)
// 获取歌曲信息
const getLyric = (id: any) => getAction(`/api/lyric?id=${id}`)

// 获取播放地址
const getSongUrl = (id: any) => getAction(`/api/player?id=${id}`)
export {
  getBanner,
  getplayList,
  getSingerList,
  getSingerDetail,
  getTopList,
  getLyric,
  getSongUrl,
  getplayListDetail,
  getBannerPlayList,
  getTopListDetail,
  getHotSearch,
  getSearchList
}
