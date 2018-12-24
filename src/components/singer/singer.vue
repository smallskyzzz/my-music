<template>
  <scroll class="singer" ref="singer">
    <div>
      <ul>
        <li v-for="(singer,index) in singerList" :key="index" class="singer-item">
          <div class="image">
            <img height="50" width="50" v-lazy="singer.image">
          </div>
          <span class="name">{{singer.name}}</span>
        </li>
      </ul>
    </div>
    <div class="shortcut">
      <ul>
        <li v-for="(singer, index) in singers" :key="index" class="item">
          <span>{{singer.shortcut}}</span>
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import {getSinger} from '../../api/singer'
import Singer from '../../common/js/singer'
import Scroll from '../../base/scroll/scroll'

const pinyin = require('pinyin')

export default {
  data() {
    return {
      singers: [], // 处理好的数据结构
      singerList: [] // 歌手一维数组
    }
  },
  created() {
    this._getSinger()
    // console.log(pinyin('a'))
  },
  methods: {
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
          console.log(this.singers)
        }
      })
    },
    _normalizeSingerList(list) {
      let singers = []
      list.forEach((item) => {
        singers.push(new Singer({
          name: item.name,
          image: item.picUrl
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
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"
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
