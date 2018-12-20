<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  mounted() {
    this.$nextTick(() => {
      this._initScroll() // 此处初始化应在dom渲染完毕后
    })
  },
  methods: {
    _initScroll() {
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: true
      })
    }
  },
  components: {
    BScroll
  }
}
</script>

<style scoped>

</style>
