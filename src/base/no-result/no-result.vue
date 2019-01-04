<template>
  <div class="loading">
    <i class="el-icon-warning icon"></i>
    <p class="text">没有结果</p>
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
  .icon
    color $color-border
  .text
    line-height 20px
    font-size $font-size-min
    color $color-border
</style>
