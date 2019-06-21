<template>
  <div>
    <div class="player" v-show="currentSong.name && fullScreen">
    <i class="el-icon-arrow-down back" @click="close"></i>
    <div v-show="showImage" class="image-wrapper" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
      <div class="image" :class="ifRotated">
        <img width="100%" height="100%" :src="currentSong.image || singer.image"/>
      </div>
    </div>
    <div v-show="!showImage" class="lyric-wrapper" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
      <scroll class="lyric" :data="lyric" ref="lyricScroll">
        <ul>
          <li v-for="(item, index) in lyric" :key="index" ref="lyricItem" v-show="_formatLyric(item)">
            {{_formatLyric(item)}}
          </li>
        </ul>
      </scroll>
    </div>
    <div class="control">
      <div class="dots">
        <span class="dot" :class="{active:currentIndex === 0}"></span>
        <span class="dot" :class="{active:currentIndex === 1}"></span>
      </div>
      <div class="control-time">
        <span class="time">{{format(currentTime / 1000)}}</span>
        <el-slider class="el-slider" v-model="currentTime" :max="duration" @change="change"></el-slider>
        <span class="time">{{format(duration / 1000)}}</span>
      </div>
      <div class="control-song">
        <div class="icon">
          <i class="iconfont icon-step-backward" @click="prev"></i>
          &nbsp;
          <i class="iconfont" :class="isPlaying" @click="togglePlay"></i>
          &nbsp;
          <i class="iconfont icon-step-forward" @click="next"></i>
        </div>
      </div>
    </div>
    <audio :src="currentSongUrl" autoplay ref="audio" @timeupdate="updateTime" @ended="end" @pause="pause" @play="play">
      <source :src="currentSongUrl" />
    </audio>
  </div>
    <div class="mini-player" v-show="currentSong.name && !fullScreen" @click="open">
      <div class="left">
        <div class="image" :class="ifRotated">
          <img width="40" height="40" :src="currentSong.image || singer.image">
        </div>
        <div class="name">
          <span class="song-detail">{{currentSong.name}}<br>--{{currentSong.artist}}</span>
        </div>
      </div>
      <div class="icon">
        <i class="iconfont" :class="isPlaying" @click.stop="togglePlay"></i>
        &nbsp;&nbsp;
        <i class="iconfont icon-unorderedlist" @click.stop="toggleShowPlayList"></i>
      </div>
    </div>
    <div class="playList-wrapper" v-show="showPlayList">
      <div class="blur" @click="closeShowPlayList"></div>
      <div class="title">播放列表</div>
      <play-list class="playList" ref="playList"></play-list>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {getSongUrl, getSongDuration, getSongLyric} from '../../api/player'
import playList from '../../components/play-list/play-list'
import Scroll from '../../base/scroll/scroll'

export default {
  data() {
    return {
      currentSongUrl: '', // 当前歌曲url
      currentTime: 0, // 当前播放到的时间
      duration: 0, // 当前歌曲总时间
      lyric: [], // 歌词
      playing: false, // 是否在播放
      showPlayList: false, // 是否显示播放列表
      showImage: true, // 显示图片还是歌词
      currentIndex: 0 // 当前所在页面
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
    closeShowPlayList() {
      this.showPlayList = false
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
        this.currentIndex = 0
      }
      if (deltaX < -20) {
        this.showImage = false
        this.currentIndex = 1
      }
    },
    touchEnd() {

    },
    getTimes() {
      let times = []
      this.lyric.forEach((l) => {
        let arr1 = l.substring(1)
        let arr2 = arr1.split(']')
        times.push(arr2[0])
      })
      times.pop()
      // console.log(times)
      return times
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    _formatLyric(lyric) {
      let l = lyric.split(']')
      return l[1]
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
                // this.currentSongUrl = res.data.data[0].url
                this.currentSongUrl = `https://music.163.com/song/media/outer/url?id=${newVal.id}.mp3`
                // alert(this.currentSongUrl)
                // 偶尔出现获取不到歌曲url的情况（当部署在阿里云上时），这种方法也可获取到
                getSongLyric(newVal.id).then((res) => {
                  if (res.data.code === 200) {
                    this.lyric = res.data.lrc.lyric.split('\n')
                    // this.getTimes()
                  }
                })
              }
            })
          }
        })
      }
    },
    currentTime(newVal) {
      let times = this.getTimes()
      let timesArray = []
      let nowItem = 0
      times.forEach((time) => {
        let arr = time.split(':')
        let s = (parseInt(arr[0]) * 60 + parseFloat(arr[1])) * 1000
        timesArray.push(s)
      })
      if (newVal < timesArray[0]) {
        nowItem = 0
      }
      if (newVal > timesArray[timesArray.length - 1]) {
        nowItem = timesArray.length - 1
      }
      for (let i = 0; i < timesArray.length; i++) {
        if (newVal > timesArray[i] && newVal < timesArray[i + 1]) {
          nowItem = i
        }
      }
      // console.log(nowItem)
      // console.log(timesArray)
      setTimeout(() => {
        let lyricItems = this.$refs.lyricItem
        if (nowItem !== 0) {
          if (this.lyric[nowItem].split(']')[1] === '') {
            this.$refs.lyricScroll.scrollToElement(lyricItems[nowItem - 1])
          } else {
            this.$refs.lyricScroll.scrollToElement(lyricItems[nowItem])
          }
        }
        lyricItems.forEach((item, index) => {
          let flag
          if (this.lyric[nowItem].split(']')[1] === '') {
            flag = nowItem - 1
          } else {
            flag = nowItem
          }
          if (index === flag) {
            item.style.color = '#409EFF'
          } else {
            item.style.color = 'grey'
          }
        })
      }, 20)
    }
  },
  computed: {
    isPlaying() {
      return this.playing ? 'icon-timeout' : 'icon-play-circle'
    },
    ifRotated() {
      return this.playing ? 'play' : 'pause'
    },
    ...mapGetters([
      'currentSong',
      'fullScreen',
      'playlist',
      'singer'
    ])
  },
  components: {
    playList,
    Scroll
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
        &.play
          animation: rotate 20s linear infinite
        &.pause
          animation-play-state paused
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
        width 300px
        height 300px
        margin 0 auto
        margin-top 100px
        overflow hidden
        white-space: pre-line
        text-align center
        line-height 20px
        font-size $font-size-medium
        color $color-border
    .control
      position absolute
      top 440px
      bottom 0
      left 0
      right 0
      .dots
        height 20px
        text-align center
        font-size 0
        .dot
          display inline-block
          margin 0 4px
          width 8px
          height 8px
          border-radius 50%
          background white
          &.active
            width 20px
            border-radius 5px
            background $color-theme
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
          .iconfont
            font-size 50px
  .mini-player
    display flex
    position fixed
    bottom 0
    width 100%
    height 60px
    background $color-background
    z-index 100
    .left
      flex 1
      display flex
      overflow hidden
      .image
        flex 0 40px
        padding 10px
        &.play
          animation: rotate 20s linear infinite
        &.pause
          animation-play-state paused
        img
          border-radius 50%
      .name
        flex 1
        text-overflow ellipsis
        white-space nowrap
        overflow hidden
        padding 10px
        line-height 20px
        font-size $font-size-medium
        color $color-theme
    .icon
      flex 0 100px
      display flex
      justify-content center
      align-items center
      text-align center
      color $color-theme
      .iconfont
        font-size 30px
  .playList-wrapper
    position fixed
    display flex
    flex-direction column
    top 0
    left 0
    right 0
    bottom 60px
    z-index 10000
    .blur
      flex 1
      // filter blur(100px)
      background $color-background
      opacity .8
    .title
      flex 0 30px
      background-color $color-background
      line-height 30px
      text-align center
      color $color-theme
    .playList
      flex 0 200px
      border-radius 5px
      height 200px
</style>
