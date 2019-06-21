<template>
  <div>
    <scroll :data="ranks" class="rank" ref="rank" v-show="ranks.length">
      <ul>
        <li v-for="(rank, index) in ranks" :key="index" class="item" @click="selectItem(rank)">
          <div class="image">
            <img v-lazy="rank.coverImgUrl" class="image" width="100" height="100">
          </div>
          <div class="songs">
            <ul>
              <li v-for="(song, i) in rank.tracks.slice(0,3)" class="song" :key="i">
                {{i+1}}.{{song.name}}-{{song.ar[0].name}}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </scroll>
    <loading v-show="!ranks.length"></loading>
    <transition name="page-fade-in">
      <router-view parent="rank"></router-view>
    </transition>
  </div>
</template>

<script>
import {getRanks} from '../../api/rank'
import Scroll from '../../base/scroll/scroll'
import {mapMutations} from 'vuex'
import Singer from '../../common/js/singer'
import Song from '../../common/js/song'
import {playerMixin} from '../../common/js/mixin'
import Loading from '../../base/loading/loading'

export default {
  mixins: [playerMixin],
  data() {
    return {
      ranks: []
    }
  },
  created() {
    setTimeout(() => {
      this._getRanks()
    }, 20)
  },
  methods: {
    selectItem(rank) {
      this.setSinger(new Singer({
        id: 1,
        image: rank.coverImgUrl
      }))
      this.setPlaylist(this._normalizeSong(rank))
      this.$router.push(`/rank/${rank.id}`)
    },
    handlePlayer(currentSong) {
      const bottom = currentSong.name ? '60px' : 0
      this.$refs.rank.$el.style.bottom = bottom
      this.$refs.rank.refresh()
    },
    _normalizeSong(rank) {
      let ret = []
      rank.tracks.forEach((track) => {
        ret.push(new Song({
          id: track.id,
          artist: track.ar[0].name,
          name: track.name,
          image: track.al.picUrl
        }))
      })
      return ret
    },
    _getRanks() {
      getRanks().then((res) => {
        // console.log(res)
        res.forEach((r) => {
          if (r.data.code === 200) {
            this.ranks.push(r.data.playlist)
            // console.log(this.ranks)
          }
        })
      })
    },
    ...mapMutations({
      'setSinger': 'SET_SINGER',
      'setPlaylist': 'SET_PLAYLIST',
      'setCurrentSong': 'SET_CURRENTSONG'
    })
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"
@import "../../common/stylus/animation.styl"
.rank
  position fixed
  overflow hidden
  width 100%
  top 40px
  bottom 0
  .item
    display flex
    width 100%
    height 110px
    box-sizing border-box
    padding 5px
    .image
      flex 0 0 110px
    .songs
      flex 1
      padding 5px 0
      height 100%
      .song
        line-height 30px
        font-size $font-size-min
        text-overflow ellipsis
        white-space nowrap
        color $color-border
</style>
