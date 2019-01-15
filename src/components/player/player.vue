<template>
  <div>
    <div class="player" v-show="currentSong.name && fullScreen">
    <i class="el-icon-arrow-down back" @click="close"></i>
    <div v-show="showImage" class="image-wrapper" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
      <div class="image">
        <img width="100%" height="100%" :src="currentSong.image || singer.image"/>
      </div>
    </div>
    <div v-show="!showImage" class="lyric-wrapper" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
      <span class="lyric">{{lyric}}</span>
    </div>
    <div class="control">
      <div class="control-time">
        <span class="time">{{format(currentTime / 1000)}}</span>
        <el-slider class="el-slider" v-model="currentTime" :max="duration" @change="change"></el-slider>
        <span class="time">{{format(duration / 1000)}}</span>
      </div>
      <div class="control-song">
        <div class="icon">
          <i class="el-icon-arrow-left" @click="prev"></i>
          &nbsp;
          <i :class="isPlaying" @click="togglePlay"></i>
          &nbsp;
          <i class="el-icon-arrow-right" @click="next"></i>
        </div>
      </div>
    </div>
    <audio :src="currentSongUrl" autoplay ref="audio" @timeupdate="updateTime" @ended="end" @pause="pause" @play="play">
      <source :src="currentSongUrl" />
    </audio>
  </div>
    <div class="mini-player" v-show="currentSong.name && !fullScreen" @click="open">
      <div class="image" align="center">
        <img width="40" height="40" :src="currentSong.image || singer.image">
      </div>
      <div class="name">
        <span>{{currentSong.name}}<br>--{{currentSong.artist}}</span>
      </div>
      <div class="icon">
        <i :class="isPlaying" @click.stop="togglePlay"></i>
        &nbsp;
        <i class="el-icon-view" @click.stop="toggleShowPlayList"></i>
      </div>
      <play-list class="playList" v-show="showPlayList" ref="playList"></play-list>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {getSongUrl, getSongDuration, getSongLyric} from '../../api/player'
import playList from '../../components/play-list/play-list'

export default {
  data() {
    return {
      currentSongUrl: '', // 当前歌曲url
      currentTime: 0, // 当前播放到的时间
      duration: 0, // 当前歌曲总时间
      lyric: '', // 歌词
      playing: false, // 是否在播放
      showPlayList: false, // 是否显示播放列表
      showImage: true // 显示图片还是歌词
    }
  },
  created() {
    this.touch = {} // 初始化touch，用于滑动监听
  },
  methods: {
    close() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
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
    change(time) {
      this.$refs.audio.currentTime = time / 1000
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
    updateTime(e) {
      this.currentTime = e.target.currentTime * 1000
    },
    end() {
      this.next()
    },
    play() {
      this.playing = true
    },
    pause() {
      this.playing = false
    },
    toggleShowPlayList() {
      this.showPlayList = !this.showPlayList
      if (this.showPlayList) { // 因为设置为true后播放列表才会显示，此前未显示其height为0，所以无法滚动
        setTimeout(() => {
          this.$refs.playList.refresh()
        }, 20)
      }
    },
    touchStart(e) {
      this.touch.inited = true
      console.log(e)
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    touchMove(e) {
      if (!this.touch.inited) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) { // 当纵轴的滚动之大于纵轴时，什么都不做（认为在滚动歌词而非切换页面）
        return
      }
      if (deltaX > 20) {
        this.showImage = true
      }
      if (deltaX < -20) {
        this.showImage = false
      }
    },
    touchEnd() {

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
      'setFullScreen': 'SET_FULLSCREEN',
      'setCurrentSong': 'SET_CURRENTSONG',
      'setPlayList': 'SET_PLAYLIST'
    })
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
                console.log(res)
                this.currentSongUrl = res.data.data[0].url
                // this.currentSongUrl = `https://music.163.com/song/media/outer/url?id=${newVal.id}.mp3`
                // alert(this.currentSongUrl)
                // 偶尔出现获取不到歌曲url的情况（当部署在阿里云上时），这种方法也可获取到
                getSongLyric(newVal.id).then((res) => {
                  if (res.data.code === 200) {
                    this.lyric = res.data.lrc.lyric
                    console.log(this.lyric.split('\n'))
                  }
                })
              }
            })
          }
        })
      }
    }
  },
  computed: {
    isPlaying() {
      return this.playing ? 'el-icon-check' : 'el-icon-caret-right'
    },
    ...mapGetters([
      'currentSong',
      'fullScreen',
      'playlist',
      'singer'
    ])
  },
  components: {
    playList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  .player
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    z-index 1000
    background $color-background
    .back
      position absolute
      top 10px
      left 10px
      z-index 10000
    .image-wrapper
      position absolute
      top 0
      bottom 200px
      left 0
      right 0
      .image
        width 300px
        height 300px
        margin 0 auto
        margin-top 100px
        img
          border-radius 50%
    .lyric-wrapper
      position absolute
      top 0
      bottom 200px
      left 0
      right 0
      overflow scroll
      .lyric
        white-space: pre-line
        font-size $font-size-min
        color $color-border
    .control
      position absolute
      top 440px
      bottom 0
      left 0
      right 0
      .control-time
        font-size 0
        .time,.el-slider
          line-height 50px
          display inline-block
          font-size $font-size-min
        .time
          width 10%
          text-align center
          color $color-theme
        .el-slider
          width 80%
          align-items center
      .control-song
        .icon
          text-align center
          font-size 50px
  .mini-player
    display flex
    position fixed
    bottom 0
    left 0
    right 0
    height 60px
    background $color-background
    z-index 100
    .image
      flex 1
      img
        margin-top 10px
    .name
      flex 3
      line-height 20px
      padding 10px
      font-size $font-size-min
      color $color-theme
    .icon
      flex 2
      padding 10px
      font-size 30px
      border-radius 50%
      color $color-theme
    .playList
      position fixed
      bottom 60px
      left 0
      height 200px
</style>
