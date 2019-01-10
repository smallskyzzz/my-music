<template>
  <div class="play-list">
    <ul>
      <li v-for="(l,index) in playlist" :key="index">
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  }
}
</script>

<style scoped>

</style>
