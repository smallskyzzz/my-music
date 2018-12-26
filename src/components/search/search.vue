<template>
  <div class="search">
    <div class="input">
      <i class="el-icon-search"></i>
      <input class="text" type="text">
      <i class="el-icon-close"></i>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"
.search
  .input
    display flex
    align-items center
    margin 5px
    height 30px
    background $color-border
</style>
