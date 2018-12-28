<template>
  <div class="search">
    <div class="input">
      <i class="el-icon-search"></i>
      <input class="text" type="text" v-model="searchValue">
      <i class="el-icon-close" v-show="searchValue" @click="clear"></i>
    </div>
    <div class="hot" v-show="!songs.length && !searchValue">
      <h1 class="title">热门搜索</h1>
      <div class="hot-item">
        <span class="item" v-for="(hot,index) in hotList" :key="index" @click="selectHot(hot)">{{hot}}</span>
      </div>
    </div>
    <loading v-show="!songs.length && searchValue"></loading>
    <scroll :data="songs" class="songs" v-show="songs.length">
      <ul>
        <li class="song" @click="selectSinger">
          <i class="el-icon-star-off"></i>
          {{singer.name}}
        </li>
        <li class="song" v-for="(song,index) in songs" :key="index" @click="selectItem(index)">
          <i class="el-icon-service"></i>
          {{song.name}}-{{song.artist}}
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {getHot, search} from '../../api/search'
import Song from '../../common/js/song'
import Singer from '../../common/js/singer'
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'
import {mapMutations} from 'vuex'

export default {
  data() {
    return {
      searchValue: '', // 输入框内的值
      hotList: [], // 热门搜索列表
      songs: [], // 歌曲列表
      singer: {} // 当前搜索中包含的歌手（固定一个）
    }
  },
  created() {
    this._getHot()
  },
  methods: {
    clear() {
      this.searchValue = ''
    },
    selectHot(hot) {
      this.searchValue = hot
    },
    selectSinger() {
      this.setSinger(this.singer)
      this.$router.push(`/search/${this.singer.name}`)
    },
    selectItem(index) {
      this.setSinger(this.singer)
      this.setCurrentSong(this.songs[index])
      this.setPlaylist(this.songs)
    },
    _getHot() {
      getHot().then((res) => {
        if (res.data.code === 200) {
          let hots = res.data.result.hots
          hots.forEach((hot) => {
            this.hotList.push(hot.first)
          })
        }
      })
    },
    ...mapMutations({
      'setSinger': 'SET_SINGER',
      'setCurrentSong': 'SET_CURRENTSONG',
      'setPlaylist': 'SET_PLAYLIST'
    })
  },
  watch: {
    searchValue(newVal) {
      if (newVal) {
        search(newVal).then((res) => { // res为数组，第一项为歌手，第二项为歌曲
          console.log(res)
          if (res[0].data.code === 200) {
            this.singer = new Singer({
              id: res[0].data.result.albums[0].artist.id,
              name: res[0].data.result.albums[0].artist.name,
              image: res[0].data.result.albums[0].artist.picUrl
            })
            console.log(this.singer)
          }
          if (res[1].data.code === 200) {
            res[1].data.result.songs.forEach((song) => {
              let artist = ''
              song.artists.forEach((ar) => {
                artist += ar.name + ' '
              })
              this.songs.push(new Song({
                id: song.id,
                name: song.name,
                artist: artist
              }))
            })
          }
          console.log(this.songs)
        })
      } else {
        this.songs = []
      }
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"
.search
  position relative
  .input
    display flex
    align-items center
    margin 5px
    height 30px
    background $color-border
    color $color-theme
    .el-icon-search
      width 10%
      text-align center
    .text
      border-radius 20px
      font-size $font-size-min
      background $color-background
      color $color-text
      width 80%
  .hot
    margin 20px 5px 5px 5px
    .title
      font-size $font-size-medium
      color $color-theme
    .hot-item
      padding-top 10px
      .item
        margin 0 5px
        font-size $font-size-min
        color $color-border
  .songs
    position fixed
    top 80px
    bottom 0
    overflow hidden
    .song
      line-height 20px
      font-size $font-size-min
      color $color-border
</style>
