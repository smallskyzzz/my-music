import {mapGetters} from 'vuex'
export const playerMixin = {
  computed: {
    ...mapGetters([
      'currentSong'
    ])
  },
  mounted() {
    this.handlePlayer(this.currentSong)
  },
  activated() {
    this.handlePlayer(this.currentSong)
  },
  watch: {
    currentSong(newVal) {
      this.handlePlayer(newVal)
    }
  },
  methods: {
    handlePlayer() {
      throw new Error('component must implement handlePlayer method')
    }
  }
}
