<template>
  <scroll :data="ranks" class="rank">
    <ul>
      <li v-for="(rank, index) in ranks" :key="index" class="item">
        <div class="image">
          <img v-lazy="rank.coverImgUrl" class="image" width="100" height="100">
        </div>
        <div class="songs">
          <ul>
            <li v-for="(song, i) in rank.tracks.slice(0,3)" class="song" :key="i">
              {{i+1}}.{{song.name}}-{{song.ar[0].name}}
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </scroll>
</template>

<script>
import {getRanks} from '../../api/rank'
import Scroll from '../../base/scroll/scroll'

export default {
  data() {
    return {
      ranks: []
    }
  },
  created() {
    this._getRanks()
  },
  methods: {
    _getRanks() {
      getRanks().then((res) => {
        // console.log(res)
        res.forEach((r) => {
          if (r.data.code === 200) {
            this.ranks.push(r.data.playlist)
            console.log(this.ranks)
          }
        })
      })
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"
.rank
  position fixed
  overflow hidden
  width 100%
  top 40px
  bottom 0
  .item
    display flex
    width 100%
    height 110px
    box-sizing border-box
    padding 5px
    .image
      flex 0 0 110px
    .songs
      flex 1
      padding 5px 0
      height 100%
      .song
        line-height 30px
        font-size $font-size-min
        text-overflow ellipsis
        white-space nowrap
        color $color-border
</style>
