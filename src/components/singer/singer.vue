<template>
  <div>singer</div>
</template>

<script>
import {getSinger} from '../../api/singer'
import Singer from '../../common/js/singer'

const pinyin = require('pinyin')

export default {
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSinger()
    // console.log(pinyin('a'))
  },
  methods: {
    _getSinger() {
      getSinger().then((res) => {
        if (res.data.code === 200) {
          // console.log(res.data.artists)
          // this.singers = res.data.artists
          this._normalizeSingerList(res.data.artists)
        }
      })
    },
    _normalizeSingerList(list) {
      let singers = []
      list.forEach((item) => {
        singers.push(new Singer({
          name: item.name,
          image: item.picUrl
        }))
      })
      let ret = []
      for (let i = 0; i < 26; i++) {
        ret.push({
          shortcut: String.fromCharCode(65 + i),
          singers: []
        })
      }
      singers.forEach((singer) => {
        let first = singer.name.substring(0, 1)
        let firstPinYin = pinyin(first)
        ret.forEach((r) => {
          if (r.shortcut === firstPinYin[0][0].substring(0, 1).toUpperCase()) {
            r.singers.push(singer)
          }
        })
      })
      ret.unshift({
        shortcut: '热门',
        singers: singers.slice(0, 10)
      })
      console.log(ret) // 此处ret即为得到的想要的数据结构
    }
  }
}
</script>

<style scoped>

</style>
