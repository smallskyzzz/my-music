import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_CURRENTSONG](state, song) {
    state.currentSong = song
  },
  [types.SET_SEARCHHISTORY](state, history) {
    state.searchHistory = history
  }
}

export default mutations
