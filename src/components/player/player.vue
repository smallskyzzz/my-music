<template>
  <div class="player" v-show="currentSong.name && currentSongUrl">
    <div class="content">
      <span class="title">当前播放:{{currentSong.name}}</span>
      <div class="icon">
        <i class="el-icon-arrow-left" @click="prev"></i>
        <i :class="isPlaying" @click="togglePlay"></i>
        <i class="el-icon-arrow-right" @click="next"></i>
      </div>
    </div>
    <div class="slider">
      <div class="currentTime time">
        <span>{{format(currentTime / 1000)}}</span>
      </div>
      <el-slider class="el-slider"  v-model="currentTime" :max="duration" @change="change"></el-slider>
      <div class="allTime time">
        <span>{{format(duration / 1000)}}</span>
      </div>
    </div>
    <audio :src="currentSongUrl" autoplay ref="audio" @timeupdate="updateTime" @ended="end" @pause="pause" @play="play">
      <source :src="currentSongUrl" />
    </audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {getSongUrl, getSongDuration} from '../../api/player'

export default {
  data() {
    return {
      currentSongUrl: '', // 当前歌曲url
      currentTime: 0, // 当前播放到的时间
      duration: 0, // 当前歌曲总时间
      playing: false // 是否在播放
    }
  },
  computed: {
    isPlaying() {
      return this.playing ? 'el-icon-check' : 'el-icon-caret-right'
    },
    ...mapGetters([
      'currentSong',
      'playlist'
    ])
  },
  methods: {
    format(duration) {
      duration = duration | 0 // 向下取整
      const minute = duration / 60 | 0
      const second = this._pad(duration % 60)
      return `${minute}:${second}`
    },
    togglePlay() {
      if (this.playing) {
        this.pause()
        this.$refs.audio.pause()
      } else {
        this.play()
        this.$refs.audio.play()
      }
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime * 1000
    },
    change(time) {
      this.$refs.audio.currentTime = time / 1000
    },
    play() {
      this.playing = true
    },
    pause() {
      this.playing = false
    },
    prev() {
      let prev = this.playlist.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      prev--
      if (this.playlist[prev]) {
        this.setCurrentSong(this.playlist[prev])
      } else {
        this.setCurrentSong(this.playlist[this.playlist.length - 1])
      }
    },
    next() {
      let next = this.playlist.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      next++
      if (this.playlist[next]) {
        this.setCurrentSong(this.playlist[next])
      } else {
        this.setCurrentSong(this.playlist[0])
      }
    },
    end() {
      this.next()
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    ...mapMutations({
      'setCurrentSong': 'SET_CURRENTSONG'
    })
  },
  mounted() {
  },
  watch: {
    currentSong(newVal) {
      if (!newVal.id) {
        return
      }
      if (newVal && newVal.id) {
        getSongDuration(newVal.id).then((res) => {
          if (res.data.code === 200) {
            this.duration = res.data.songs[0].dt
            getSongUrl(newVal.id).then((res) => {
              if (res.data.code === 200) {
                this.currentSongUrl = res.data.data[0].url
              }
            })
          }
        })
      }
    }
    // currentTime(newVal) {
    //   // console.log(newVal)
    // }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"
.player
  position fixed
  bottom 0
  left 0
  right 0
  height 60px
  background black
  .content
    position relative
    line-height 30px
    .title
      white-space nowrap
      color $color-theme
    .icon
      float right
      font-size 25px
  .slider
    width 100%
    height 30px
    .time
      display inline-block
      line-height 30px
      width 10%
      text-align center
      font-size $font-size-min
      color $color-theme
      &.currentTime
        float left
      &.allTime
        float right
    .el-slider
      display inline-block
      width 80%
</style>
