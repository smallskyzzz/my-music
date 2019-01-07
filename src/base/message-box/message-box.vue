<template>
  <div class="message-box-wrapper" v-show="showFlag">
    <div class="message-box">
      <div class="title">{{title}}</div>
      <div class="bts">
        <div class="bt" @click="confirm">确认</div>
        <div class="bt" @click="cancel">取消</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // showFlag: { // 这里如果使用props控制显示与隐藏，会报warn，提示子组件不能改变父组件的值   ？？？
    //   type: Boolean,
    //   default: false
    // },
    title: {
      type: String,
      default: '确认删除吗？'
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    confirm() {
      this.hide()
      this.$emit('confirm')
    },
    cancel() {
      this.hide()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"
.message-box-wrapper
  position fixed
  z-index 1000000
  top 0
  left 0
  bottom 0
  right 0
  .message-box
    margin 0 auto
    margin-top 150px
    width 250px
    height 150px
    background black
    border-radius 20px
    .title
      line-height 120px
      text-align center
      font-size $font-size-medium
      color $color-border
    .bts
      display flex
      height 30px
      .bt
        flex 1
        line-height 30px
        text-align center
        font-size $font-size-medium
        color $color-border
</style>
