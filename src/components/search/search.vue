<template>
  <div class="search">
    <loading v-show="!hotList.length"></loading>
    <div class="input" v-show="hotList.length">
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
    <div class="history" v-show="!songs.length && !searchValue">
      <h1 class="title">搜索历史</h1>
      <ul class="items">
        <li v-for="(history, index) in searchHistory" :key="index" class="item" @click="selectHistory(history)">
          <span class="name">{{history}}</span>
          <span class="icon" @click.stop="deleteHistory(history)">
            <i class="el-icon-delete"></i>
          </span>
        </li>
      </ul>
    </div>
    <loading v-show="!songs.length && searchValue && albumCount"></loading>
    <no-result v-show="!songs.length && searchValue && !albumCount"></no-result>
    <scroll :data="songs" class="songs" v-show="songs.length" ref="songs">
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
    <message-box ref="messageBox" @confirm="confirmDelete"></message-box>
    <router-view></router-view>
  </div>
</template>

<script>
import {getHot, search} from '../../api/search'
import Song from '../../common/js/song'
import Singer from '../../common/js/singer'
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'
import NoResult from '../../base/no-result/no-result'
import {mapMutations, mapActions, mapGetters} from 'vuex'
import {playerMixin} from '../../common/js/mixin'
import MessageBox from '../../base/message-box/message-box'

export default {
  mixins: [playerMixin],
  data() {
    return {
      searchValue: '', // 输入框内的值
      hotList: [], // 热门搜索列表
      songs: [], // 歌曲列表
      singer: {}, // 当前搜索中包含的歌手（固定一个）
      albumCount: 1, // 判断搜索结果为空还是正在加载中
      deleteOne: '' // 需要删除的值
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
      this._saveSearchHistory()
    },
    selectItem(index) {
      this.setSinger(this.singer)
      this.setCurrentSong(this.songs[index])
      this.setPlaylist(this.songs)
      this._saveSearchHistory()
    },
    handlePlayer(currentSong) {
      const bottom = currentSong.name ? '60px' : 0
      this.$refs.songs.$el.style.bottom = bottom
      this.$refs.songs.refresh()
    },
    selectHistory(history) {
      this.searchValue = history
    },
    deleteHistory(history) {
      this.deleteOne = history
      this.$refs.messageBox.show()
    },
    confirmDelete() {
      this.deleteSearchHistory(this.deleteOne)
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
    _saveSearchHistory() {
      this.saveSearchHistory(this.searchValue)
    },
    ...mapMutations({
      'setSinger': 'SET_SINGER',
      'setCurrentSong': 'SET_CURRENTSONG',
      'setPlaylist': 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  },
  watch: {
    searchValue(newVal) {
      this.albumCount = 1 // 搜索前将其置为1
      let timer
      if (timer) { // 节流函数
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        if (newVal) {
          search(newVal).then((res) => { // res为数组，第一项为歌手，第二项为歌曲
            // console.log(res)
            if (res[0].data.code === 200) {
              if (res[0].data.result.albumCount !== 0) {
                this.singer = new Singer({
                  id: res[0].data.result.albums[0].artist.id,
                  name: res[0].data.result.albums[0].artist.name,
                  image: res[0].data.result.albums[0].artist.picUrl
                })
                // console.log(this.singer)
              }
            } else {
              this.singer = {}
            }
            if (res[1].data.code === 200) {
              if (res[0].data.result.albumCount !== 0) {
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
              } else {
                this.songs = []
                this.albumCount = 0
              }
            }
            // console.log(this.songs)
          })
        } else {
          this.songs = []
        }
      }, 200)
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  components: {
    Scroll,
    Loading,
    NoResult,
    MessageBox
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
      .item + .item
        padding 5px 0 5px 5px
      .item
        display inline-block
        font-size $font-size-medium
        color $color-border
  .history
    margin 10px 5px 5px 5px
    .title
      font-size $font-size-medium
      color $color-theme
    .items
      padding-top 10px
      .item
        display flex
        padding 3px
        font-size $font-size-medium
        color $color-border
        .name
          flex 1
  .songs
    position fixed
    top 120px
    bottom 0
    overflow hidden
    .song
      line-height 20px
      padding 5px
      font-size $font-size-medium
      color $color-border
</style>
