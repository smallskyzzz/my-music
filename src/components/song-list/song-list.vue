<!--songList组件，接受歌曲列表数组-->
<template>
  <div class="song-list">
    <i class="el-icon-back" @click="back"></i>
    <div class="image">
      <img width="100%" height="300" :src="singer.image">
      <button class="btn" @click="playAll">播放全部</button>
    </div>
    <scroll :data="songs" class="songs" ref="songs">
        <ul v-show="songs.length > 0" ref="songs">
          <li v-for="(song, index) in songs" :key="index" class="song" @click="selectItem(song)">
            {{song.name}}
          </li>
        </ul>
    </scroll>
    <loading v-show="songs.length === 0"></loading>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {getSongBySinger} from '../../api/singer'
import Song from '../../common/js/song'
import Loading from '../../base/loading/loading'
import Scroll from '../../base/scroll/scroll'
import {playerMixin} from '../../common/js/mixin'

export default {
  mixins: [playerMixin],
  props: {
    parent: {
      type: String,
      default: 'singer'
    }
  },
  data() {
    return {
      songs: [] // 歌曲列表
    }
  },
  created() {
    if (this.songs.length === 0 && this.playlist.length === 0) {
      this.$router.back()
      return
    }
    if (this.parent === 'singer') {
      setTimeout(() => {
        this._getSongBySinger()
      }, 20)
    }
    if (this.parent === 'rank' || this.parent === 'recommend') {
      setTimeout(() => {
        this.songs = this.playlist
      })
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    selectItem(song) {
      this.setCurrentSong(song)
      this.setFullScreen(true)
    },
    playAll() {
      console.log(this.$refs.songs.children[0])
      this.selectItem(this.songs[0])
    },
    handlePlayer(currentSong) {
      const bottom = currentSong.name ? '60px' : 0
      this.$refs.songs.$el.style.bottom = bottom
      this.$refs.songs.refresh()
    },
    _getSongBySinger() {
      if (!this.singer.id) {
        this.$router.back()
        return
      }
      getSongBySinger(this.singer.id).then((res) => {
        console.log(res)
        if (res.data.code === 200) {
          this._normalizeSongs(res.data.hotSongs)
        }
      })
    },
    _normalizeSongs(list) {
      list.forEach((l) => {
        this.songs.push(new Song({
          id: l.id,
          name: l.name,
          artist: this.singer.name,
          image: l.al.picUrl
        }))
      })
      this.setPlaylist(this.songs)
      console.log(this.songs)
    },
    ...mapMutations({
      setPlaylist: 'SET_PLAYLIST',
      setCurrentSong: 'SET_CURRENTSONG',
      setFullScreen: 'SET_FULLSCREEN'
    })
  },
  computed: {
    ...mapGetters([
      'singer',
      'playlist'
    ])
  },
  components: {
    Loading,
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"
.song-list
  position fixed
  z-index 100
  top 0
  left 0
  bottom 0
  right 0
  background $color-background
  .el-icon-back
    position absolute
    top 10px
    left 10px
    z-index 100000
  .image
    position relative
    height 300px
    .btn
      position absolute
      left 50%
      bottom 10px
      margin 0 0 0 -35px
      border 0
      border-radius 20px
      width 70px
      text-align center
      background $color-theme
      color $color-text
  .songs
    position absolute
    top 300px
    bottom 0
    left 0
    right 0
    overflow hidden
    .song
      margin 5px
      line-height 20px
      font-size $font-size-medium
      color $color-border
</style>
