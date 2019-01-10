import {getSearch} from '../common/js/cache'

const state = {
  singer: {}, // 歌手
  playlist: [], // 播放列表
  currentSong: {},
  // searchHistory: [] // 搜索历史
  searchHistory: getSearch(),
  fullScreen: true // 播放器组件是否全屏显示
}

export default state
