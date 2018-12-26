<!--songList组件，接受歌曲列表数组-->
<template>
  <div class="song-list">
    <i class="el-icon-back" @click="back"></i>
    <div class="image">
      <img width="100%" height="300" :src="singer.image">
    </div>
    <scroll :data="songs">
      <div>
        <ul v-show="songs.length > 0" class="songs">
          <li v-for="(song, index) in songs" :key="index" class="song">
            {{song.name}}
          </li>
        </ul>
      </div>
    </scroll>
    <loading v-show="songs.length === 0"></loading>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
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
    this._getSongBySinger()
  },
  methods: {
    back() {
      this.$router.back()
    },
    _getSongBySinger() {
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
          id: l.al.id,
          name: l.name,
          artist: this.singer.name
        }))
      })
      console.log(this.songs)
    }
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
    overflow hidden
    .song
      margin 5px
      line-height 20px
      font-size $font-size-medium
      color $color-border
</style>
