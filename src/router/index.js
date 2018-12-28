import Vue from 'vue'
import Router from 'vue-router'
import recommend from '../components/recommend/recommend'
import rank from '../components/rank/rank'
import singer from '../components/singer/singer'
import search from '../components/search/search'
import SongList from '../components/song-list/song-list'

Vue.use(Router)

export default new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: recommend,
      children: [
        {
          path: ':id',
          component: SongList
        }
      ]
    },
    {
      path: '/rank',
      component: rank,
      children: [
        {
          path: ':id',
          component: SongList
        }
      ]
    },
    {
      path: '/singer',
      component: singer,
      children: [
        {
          path: ':id',
          component: SongList
        }
      ]
    },
    {
      path: '/search',
      component: search
    }
  ]
})
