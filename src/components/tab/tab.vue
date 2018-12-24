<template>
  <div class="tab">
    <router-link class="tab-item" to="/recommend">推荐</router-link>
    <router-link class="tab-item" to="/singer">歌手</router-link>
    <router-link class="tab-item" to="/rank">排行</router-link>
    <router-link class="tab-item" to="/search">搜索</router-link>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  .tab
    display flex
    z-index 100
    .tab-item
      flex 1
      text-align center
      line-height 40px
      color $color-text
      &.active
        color $color-theme
</style>
