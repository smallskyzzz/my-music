<template>
  <div>
    <scroll class="recommend" :data="arrs" ref="scroll" v-show="arrs.length">
      <div>
        <div class="slider-wrapper" v-if="banners.length"> <!--加上v-if判断有值时再渲染-->
          <slider class="slider">
            <div v-for="(item, index) in banners" :key="index">
              <img width="100%" :src="item.imageUrl"/>
            </div>
          </slider>
        </div>
        <h1 class="title">推荐歌单</h1>
        <div class="personalized">
          <div class="item" v-for="(item, index) in personalized" :key="index" @click="selectItem(item)">
            <span class="count"><i class="el-icon-service"></i>{{(item.playCount / 10000).toFixed(1)}}万</span>
            <img width="100%" v-lazy="item.picUrl"/>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
        <h1 class="title">推荐单曲</h1>
        <ul class="personalizedSongs">
          <li v-for="(item, index) in personalizedSongs" :key="index" class="item" @click="play(item)">
            <i class="iconfont icon-customerservice"></i>
            {{item.name}}
          </li>
        </ul>
        <h1 class="title">推荐MV</h1>
        <ul class="personalizedMV">
          <li v-for="(item, index) in personalizedMV" :key="index" class="item" @click="playMV(item)">
            {{item.name}}
          </li>
        </ul>
        <div class="player-wrapper" v-show="playMVFlag" ref="playerWrapper">
          <i class="iconfont icon-close close" @click="closeMV"></i>
          <player :MV="MV"></player>
        </div>
      </div>
    </scroll>
    <loading v-show="!arrs.length || showLoading"></loading>
    <transition name="page-fade-in">
      <router-view parent="recommend"></router-view>
    </transition>
  </div>
</template>

<script>
import {getRecommend, getDetail, getPersonalizedSongs, getMV} from '../../api/recommend'
import Slider from '../../base/slider/slider'
import Scroll from '../../base/scroll/scroll'
import {mapMutations} from 'vuex'
import Song from '../../common/js/song'
import Singer from '../../common/js/singer'
import {playerMixin} from '../../common/js/mixin'
import Loading from '../../base/loading/loading'
import Player from '../../base/video-player/video-player'

export default {
  mixins: [playerMixin],
  data() {
    return {
      banners: [], // 轮播
      personalized: [], // 推荐歌单
      personalizedSongs: [], // 推荐歌曲
      personalizedMV: [], // 推荐MV
      playMVFlag: false,
      MV: {},
      showLoading: false // 是否显示loading组件
    }
  },
  computed: {
    arrs() {
      return this.banners.concat(this.personalized)
    }
  },
  created() {
    this._getRecommend() // 此处加上延时后就会导致banners图片出现问题（从其他页面跳转过来也会出现该问题）
    // this._getPersonalized()
  },
  mounted() {
    // this.$refs.sliderItem.style.width = '100%'
  },
  methods: {
    selectItem(item) {
      if (!this.showLoading) {
        this.$refs.scroll.$el.style.opacity = 0.1 // 点击后显示正在加载效果
        this.showLoading = true
        getDetail(item.id).then((res) => {
          this.setSinger(new Singer({
            id: 0,
            image: item.picUrl
          }))
          this.setPlaylist(this._normalizeSong(res.data.playlist))
          this.$router.push(`/recommend/${item.id}`)
          this.$refs.scroll.$el.style.opacity = 1 // 正在加载效果复原
          this.showLoading = false
        })
      }
    },
    handlePlayer(currentSong) {
      const bottom = currentSong.name ? '60px' : 0
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    play(item) {
      this.setCurrentSong(item)
    },
    playMV(item) {
      this.playMVFlag = true
      this.MV = item
    },
    closeMV() {
      this.playMVFlag = false
    },
    _normalizeSong(list) {
      let ret = []
      list.tracks.forEach((track) => {
        ret.push(new Song({
          id: track.id,
          artist: track.ar[0].name,
          name: track.name,
          image: track.al.picUrl
        }))
      })
      return ret
    },
    _getRecommend() {
      getRecommend().then((res) => {
        if (res[0].data.code === 200) {
          this.banners = res[0].data.banners
        }
        if (res[1].data.code === 200) {
          this.personalized = res[1].data.result
        }
        return getPersonalizedSongs()
      }).then((res) => {
        this.personalizedSongs = res.data.result
        return getMV()
      }).then((res) => {
        this.personalizedMV = res.data.data
      })
    },
    // _getPersonalized() {
    //   getPersonalized().then((res) => {
    //     if (res.data.code === 200) {
    //       this.personalized = res.data.result
    //     }
    //   })
    // },
    ...mapMutations({
      'setSinger': 'SET_SINGER',
      'setPlaylist': 'SET_PLAYLIST',
      'setCurrentSong': 'SET_CURRENTSONG'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading,
    Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/animation.styl"
  .recommend
    position fixed // 相对于浏览器窗口定位，absoult则是相对于最近的（父元素）position不为static（默认值）的元素进行定位
    overflow hidden
    width 100%
    top 80px
    bottom 0
    .slider-wrapper
      position relative
      width 100%
      overflow hidden
    .title
      line-height 30px
      text-align center
      font-size $font-size-max
      color $color-theme
      background-color #222
    .personalized
      margin 0 5px
      .item
        display inline-block
        position relative
        box-sizing border-box
        width 33.3%
        padding 5px
        .count
          position absolute
          top 7px
          right 7px
          font-size $font-size-min
          color $color-text
        .name
          width 100%
          white-space nowrap
          overflow hidden
          text-overflow ellipsis
          color $color-border
          font-size $font-size-min
    .personalizedSongs,.personalizedMV
      margin 0 10px
      .item
        margin 10px 0
        font-size 16px
        color #808080
    .player-wrapper
      position fixed
      left 0
      right 0
      bottom 0
      .close
        position absolute
        top 10px
        right 10px
        z-index 20
</style>
