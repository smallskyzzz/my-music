<template>
  <div class="player" v-show="currentSong.name">
    <div>
      当前播放{{currentSong.name}}
    </div>
    <el-slider v-model="currentTime" :max="duration"></el-slider>
    <audio :src="currentSongUrl" controls autoplay ref="audio" @timeupdate="updateTime">
      <source :src="currentSongUrl" />
    </audio>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSongUrl, getSongDuration} from '../../api/player'

export default {
  data() {
    return {
      currentSongUrl: '', // 当前歌曲url
      currentTime: 0, // 当前播放到的时间
      duration: 0 // 当前歌曲总时间
    }
  },
  computed: {
    ...mapGetters([
      'currentSong'
    ])
  },
  methods: {
    // format(duration) {
    //   duration = duration | 0 // 向下取整
    //   const minute = duration / 60 | 0
    //   const second = this._pad(duration % 60)
    //   return `${minute}:${second}`
    // },
    updateTime(e) {
      this.currentTime = e.target.currentTime * 1000
    }
    // _pad(num, n = 2) {
    //   let len = num.toString().length
    //   while (len < n) {
    //     num = '0' + num
    //     len++
    //   }
    //   return num
    // }
  },
  mounted() {
  },
  watch: {
    currentSong(newVal) {
      if (newVal.id) {
        getSongDuration(newVal.id).then((res) => {
          if (res.data.code === 200) {
            this.duration = res.data.songs[0].dt
            alert(this.duration)
            getSongUrl(newVal.id).then((res) => {
              if (res.data.code === 200) {
                this.currentSongUrl = res.data.data[0].url
              }
            })
          }
        })
      }
    },
    currentTime(newVal) {
      console.log(newVal)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.player
  position fixed
  bottom 0
  height 150px
</style>
