<template>
  <div id="app">
    <tab></tab>
    <transition name="change">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <player></player>
  </div>
</template>

<script>
import Tab from './components/tab/tab'
import Player from './components/player/player'

export default {
  components: {
    Tab,
    Player
  }
}
</script>

<style>
  @import "/common/stylus/animation.styl";
</style>
