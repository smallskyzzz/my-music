<template>
  <div>
    <scroll class="singer" ref="singer" @scrollY="scrollY" :data="singerList" v-show="singerList.length">
      <div>
        <ul>
          <li v-for="(singer,index) in singerList" :key="index" class="singer-item" ref="singerItem" @click="selectItem(singer)">
            <div class="image">
              <img height="50" width="50" v-lazy="singer.image">
            </div>
            <span class="name">{{singer.name}}</span>
          </li>
        </ul>
      </div>
      <div class="shortcut">
        <ul>
          <li v-for="(singer, index) in singers" :key="index" class="item" :class="{'current':index === currentIndex}" @click="clickShortcut(index)">
            <span>{{singer.shortcut}}</span>
          </li>
        </ul>
      </div>
    </scroll>
    <loading v-show="!singerList.length"></loading>
    <transition name="page-fade-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import {getSinger} from '../../api/singer'
import Singer from '../../common/js/singer'
import Scroll from '../../base/scroll/scroll'
import {mapMutations} from 'vuex'
import {playerMixin} from '../../common/js/mixin'
import Loading from '../../base/loading/loading'

const pinyin = require('pinyin')
const HEIGHT = 60 // 每个li的高度

export default {
  mixins: [playerMixin],
  data() {
    return {
      singers: [], // 处理好的数据结构
      singerList: [], // 歌手一维数组
      listHeight: [], // 计算每个shortcut的height
      // currentIndex: 0, // 当前shortcut的index
      posY: 0 // 当前滚动的y值
    }
  },
  created() {
    this._getSinger()
    // console.log(pinyin('a'))
  },
  computed: {
    currentIndex() {
      if (this.posY >= 0) {
        // console.log(0)
        return 0
      } else {
        // console.log(this.posY)
        // console.log(this.listHeight)
        for (let i = 0; i < this.listHeight.length - 1; i++) {
          if (-this.posY > this.listHeight[i] && -this.posY < this.listHeight[i + 1]) {
            // console.log(i)
            return i
          }
        }
      }
    }
  },
  // watch: {
  //   posY(newVal) {
  //     if (newVal >= 0) {
  //       this.currentIndex = 0
  //     }
  //     if (newVal < 0) {
  //       for (let i = 0; i < this.listHeight.length - 1; i++) {
  //         if (-newVal > this.listHeight[i] && -newVal < this.listHeight[i + 1]) {
  //           this.currentIndex = i
  //         }
  //       }
  //     }
  //   }
  // },
  methods: {
    scrollY(posY) {
      // if (posY >= 0) {
      //   this.currentIndex = 0
      // } else {
      //   for (let i = 0; i < this.listHeight.length - 1; i++) {
      //     if (-posY > this.listHeight[i] && -posY < this.listHeight[i + 1]) {
      //       this.currentIndex = i
      //     }
      //   }
      // }
      // console.log(this.currentIndex + ';' + posY)
      this.posY = posY
    },
    clickShortcut(index) {
      let singerItem = this.$refs.singerItem
      let nums = 0
      for (let i = 0; i < index; i++) {
        nums += this.singers[i].singers.length
      }
      this.currentIndex = index
      this.$refs.singer.scrollToElement(singerItem[nums], 0)
    },
    selectItem(singer) {
      this.$router.push({
        path: `/singer/${singer.name}`
      })
      this.setSinger(singer)
    },
    handlePlayer(currentSong) {
      const bottom = currentSong.name ? '60px' : 0
      this.$refs.singer.$el.style.bottom = bottom
      this.$refs.singer.refresh()
    },
    _getSinger() {
      getSinger().then((res) => {
        if (res.data.code === 200) {
          // console.log(res.data.artists)
          // this.singers = res.data.artists
          this.singers = this._normalizeSingerList(res.data.artists)
          let arr = []
          for (let i = 0; i < this.singers.length; i++) {
            this.singerList = arr.concat(this.singers[i].singers) // 此处经过循环渠道所有的singer
            arr = this.singerList
          }
          setTimeout(() => {
            this._calculateHeight() // 计算每个shortcut对应的高度
          }, 20)
          console.log(this.singers)
        }
      })
    },
    _normalizeSingerList(list) {
      let singers = []
      list.forEach((item) => {
        singers.push(new Singer({
          name: item.name,
          image: item.picUrl,
          id: item.id
        }))
      })
      let ret = []
      for (let i = 0; i < 26; i++) {
        ret.push({
          shortcut: String.fromCharCode(65 + i),
          singers: []
        })
      }
      singers.forEach((singer) => {
        let first = singer.name.substring(0, 1)
        let firstPinYin = pinyin(first)
        ret.forEach((r) => {
          if (r.shortcut === firstPinYin[0][0].substring(0, 1).toUpperCase()) {
            r.singers.push(singer)
          }
        })
      })
      ret.unshift({
        shortcut: '热',
        singers: singers.slice(0, 10)
      })
      return ret // 此处ret即为得到的想要的数据结构
    },
    _calculateHeight() {
      let height = HEIGHT
      let heights = []
      heights.push(0) // 第一项加个0
      this.singers.forEach((singer) => {
        heights.push(singer.singers.length * height)
      })
      for (let i = 0; i < heights.length; i++) {
        let singerHeight = 0
        for (let j = 0; j <= i; j++) {
          singerHeight += heights[j]
        }
        this.listHeight.push(singerHeight)
      }
      // console.log(this.listHeight)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
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
.singer
  position fixed // 相对于浏览器窗口定位，absoult则是相对于最近的（父元素）position不为static（默认值）的元素进行定位
  overflow hidden
  width 100%
  top 40px
  bottom 0
  .singer-item
    display flex
    box-sizing border-box
    padding 5px
    height 60px
    .image
      flex 0 0 60px
    .name
      flex 1
      line-height 50px
      font-size $font-size-medium
  .shortcut
    position absolute
    top 20px
    right 10px
    .item
      margin 5px 0
      width 20px
      text-align center
      font-size $font-size-min
      &.current
        color $color-theme
</style>
