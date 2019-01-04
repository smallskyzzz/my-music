<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  created() {
    this.$nextTick(() => {
      this._initScroll()
    })
  },
  methods: {
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    _initScroll() {
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: 3, // 此处设为3才能监听到滚动事件
        click: true
      })
      this.scroll.on('scroll', (pos) => {
        this.$emit('scrollY', pos.y)
      })
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  },
  components: {
    BScroll
  }
}
</script>

<style scoped>

</style>
