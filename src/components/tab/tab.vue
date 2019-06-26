<template>
  <div class="tab-wrapper">
    <div class="logo">
      <div class="image"></div>
    </div>
    <div class="tab">
      <router-link class="tab-item" to="/recommend">推荐</router-link>
      <router-link class="tab-item" to="/singer">歌手</router-link>
      <router-link class="tab-item" to="/rank">排行</router-link>
      <router-link class="tab-item" to="/search">搜索</router-link>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  .tab-wrapper
    z-index 100
    .logo
      height 40px
      text-align center
      .image
        width 40px
        height 40px
        background-image url("./logo.png")
        background-size 40px 40px
        display inline-block
    .tab
      display flex
      z-index 100
      .tab-item
        flex 1
        text-align center
        line-height 38px
        color $color-text
        border-bottom 2px solid $color-background
        &.active
          color $color-theme
          border-bottom 2px solid $color-theme
</style>
