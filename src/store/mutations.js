import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  }
}

export default mutations
