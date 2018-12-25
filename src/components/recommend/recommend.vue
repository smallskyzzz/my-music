<template>
  <scroll class="recommend" :data="arrs">
    <div>
      <slider class="slider">
        <div v-for="(item, index) in banners" :key="index" class="item">
          <img width="100%" :src="item.imageUrl"/>
        </div>
      </slider>
      <h1 class="title">推荐歌单</h1>
      <div class="personalized">
        <div class="item" v-for="(item, index) in personalized" :key="index">
          <img width="100%" v-lazy="item.picUrl"/>
        </div>
      </div>
    </div>
  </scroll>
</template>

<script>
import {getBanner, getPersonalized} from '../../api/recommend'
import Slider from '../../base/slider/slider'
import Scroll from '../../base/scroll/scroll'

export default {
  data() {
    return {
      banners: [], // 轮播
      personalized: [] // 推荐歌单
    }
  },
  computed: {
    arrs() {
      return this.banners.concat(this.personalized)
    }
  },
  created() {
    this._getBanner()
    this._getPersonalized()
  },
  methods: {
    _getBanner() {
      getBanner().then((res) => {
        if (res.data.code === 200) {
          this.banners = res.data.banners
        }
      })
    },
    _getPersonalized() {
      getPersonalized().then((res) => {
        if (res.data.code === 200) {
          this.personalized = res.data.result
        }
      })
    }
  },
  components: {
    Slider,
    Scroll
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  .recommend
    position fixed // 相对于浏览器窗口定位，absoult则是相对于最近的（父元素）position不为static（默认值）的元素进行定位
    overflow hidden
    width 100%
    top 40px
    bottom 0
    .slider
      position relative
      width 100%
      overflow hidden
      .item
        width 100%
    .title
      line-height 30px
      text-align center
      font-size $font-size-max
      color $color-theme
    .personalized
      margin 0 5px
      .item
        display inline-block
        box-sizing border-box
        width 33.3%
        padding 5px
</style>
