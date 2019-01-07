import {getSearch} from '../common/js/cache'

const state = {
  singer: {}, // 歌手
  playlist: [], // 播放列表
  currentSong: {},
  // searchHistory: [] // 搜索历史
  searchHistory: getSearch()
}

export default state
