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
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    refresh() {
      this.scroll && this.scroll.refresh()
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
        this.scroll.refresh()
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
