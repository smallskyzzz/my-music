<!--songList组件，接受歌曲列表数组-->
<template>
  <div class="song-list">
    <i class="el-icon-back" @click="back"></i>
    <div class="image">
      <img width="100%" height="300" :src="singer.image">
    </div>
    <scroll :data="songs" class="songs">
        <ul v-show="songs.length > 0">
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

export default {
  data() {
    return {
      songs: [] // 歌曲列表
    }
  },
  created() {
    setTimeout(() => {
      this._getSongBySinger()
    }, 20)
  },
  methods: {
    back() {
      this.$router.back()
    },
    selectItem(song) {
      this.setCurrentSong(song)
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
          artist: this.singer.name
        }))
      })
      this.setPlaylist(this.songs)
      console.log(this.songs)
    },
    ...mapMutations({
      setPlaylist: 'SET_PLAYLIST',
      setCurrentSong: 'SET_CURRENTSONG'
    })
  },
  computed: {
    ...mapGetters([
      'singer'
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
  .image
    height 300px
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
