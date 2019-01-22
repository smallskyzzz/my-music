<template>
  <scroll class="play-list" :data="playlist" ref="playList">
    <div>
      <h2 class="title">播放列表</h2>
      <ul>
        <li v-for="(l,index) in playlist" :key="index" class="song">
          <i class="iconfont icon-customerservice"></i>
          <span class="name" @click.stop="play(l)">{{l.name}}</span>
          <i class="el-icon-close" @click.stop="deleteOne(l)"></i>
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import Scroll from '../../base/scroll/scroll'

export default {
  methods: {
    deleteOne(l) {
      let index = this.playlist.findIndex((item) => {
        return item === l
      })
      if (index > -1) {
        if (l.id === this.currentSong.id) {
          let currentIndex = this.playlist.indexOf(l)
          let cIndex = currentIndex === this.playlist.length ? 0 : currentIndex + 1
          this.setCurrentSong(this.playlist[cIndex])
          let list = this.playlist.slice(0)
          list.splice(currentIndex, 1)
          this.setPlayList(list)
        } else {
          let list = this.playlist.slice(0)
          list.splice(index, 1)
          this.setPlayList(list)
        }
      }
      // console.log(l)
      // console.log(this.currentSong)
    },
    play(l) {
      this.setCurrentSong(l)
    },
    refresh() {
      this.$refs.playList.refresh()
    },
    ...mapMutations({
      'setPlayList': 'SET_PLAYLIST',
      'setCurrentSong': 'SET_CURRENTSONG'
    })
  },
  computed: {
    ...mapGetters([
      'playlist',
      'currentSong'
    ])
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"
.play-list
  overflow hidden
  z-index 1000
  width 100%
  border-radius 10px
  background $color-background
  .title
    line-height 30px
    text-align center
    color $color-theme
  .song
    position relative
    padding 2px
    line-height 20px
    font-size $font-size-medium
    color $color-theme
    .el-icon-close
      position absolute
      right 10px
</style>
