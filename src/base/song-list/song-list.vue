<!--songList组件，接受歌曲列表数组-->
<template>
  <div class="song-list">
    <div class="back-wrapper">
    </div>
    <div class="image"></div>
    <ul>
      <li v-for="(song,index) in songList" :key="index">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songList: {
      type: Array,
      default: null
    }
  }
}
</script>

<style scoped>

</style>
