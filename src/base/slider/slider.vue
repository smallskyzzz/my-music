<template>
    <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
        <slot></slot>
      </div>
      <div class="dots">
        <span class="dot" v-for="(item,index) in dots" :key="index" :class="{active:currentPageIndex === index}"></span>
      </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from '../../common/js/dom.js'
export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    loop: {// 是否循环
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
    }, 20)// 此处浏览器刷新时间为17ms，20ms为一个经验值（也可用this.$nextTick）
    // this.$nextTick(() => {
    //   this._setSliderWidth()
    //   this._initDots()
    //   this._initSlider()
    // })
    if (this.autoPlay) {
      this._play()
    }
    window.addEventListener('resize', () => { // 监听浏览器改变事件，不然改变了必须重新刷新才能看到正确的图片切换
      if (!this.slider) {
        return 0
      } else {
        this._setSliderWidth(true)
        this.slider.refresh()
      }
    })
  },
  methods: {
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth// 加两个 保证前后两张图片的效果
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop, // 循环
          threshold: 0.3,
          speed: 400 // 速度
        }
        // click: true
      })
      this.slider.on('scrollEnd', () => { // 封装的事件，能监听到滚动结束，并且可以获取到当前页面的index
        let pageIndex = this.slider.getCurrentPage().pageX
        // if (this.loop) {
        //   pageIndex -= 1
        // }// 貌似该组件更新了，此处不需要减1
        // console.log(pageIndex)
        this.currentPageIndex = pageIndex
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _play () {
      // let pageIndex = this.currentPageIndex + 1
      this.timer = setTimeout(() => {
        // this.slider.goToPage(pageIndex, 0, 400)// 封装的方法
        this.slider.next() // 直接跳转到下一页，解决最后一页无法跳转bug
      }, this.interval)
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  .slider
    min-height 1px
    .slider-group
      position relative
      overflow hidden
      white-space nowrap
      .slider-item
        float left
        box-sizing border-box
        overflow hidden
        text-align center
        a
          display block
          width 100%
          overflow hidden
          text-decoration none
        img
          display block
          width 100%
    .dots
      position absolute
      right 0
      left 0
      bottom 12px
      text-align center
      font-size 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-background
        &.active
          width: 20px
          border-radius: 5px
          background: $color-theme
</style>
