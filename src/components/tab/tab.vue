<template>
  <div class="tab">
    <router-link class="tab-item" to="/recommend">推荐</router-link>
    <router-link class="tab-item" to="/recommend">歌手</router-link>
    <router-link class="tab-item" to="/recommend">排行</router-link>
    <router-link class="tab-item" to="/recommend">搜索</router-link>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .tab
    display flex
    .tab-item
      flex 1
      text-align center
      line-height 40px
</style>
