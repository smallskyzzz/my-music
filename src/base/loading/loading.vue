<template>
  <div class="loading">
    <i class="el-icon-loading"></i>
    <p class="text">正在加载...</p>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"
.loading
  width 100%
  text-align center
  .text
    line-height 20px
    font-size $font-size-min
    color $color-border
</style>
