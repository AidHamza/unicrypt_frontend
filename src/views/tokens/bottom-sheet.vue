<template>
  <v-bottom-sheet v-model="sheet" :overlay-opacity="opacity">
    <v-sheet
      class="foreground"
    >
      <div class="border-t">
        <token-card
        @on-close="close"
        ref="tokenCard">
        </token-card>
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import TokenCard from './token-card'

export default {
  components: {
    TokenCard
  },

  data: () => ({
    sheet: false,
    token: {}
  }),

  computed: {
    darkMode () {
      var theme = this.$store.state.theme
      return theme === 'theme2' || theme === 'theme3'
    },
    opacity () {
      return this.darkMode ? 0.8 : 0.3
    }
  },

  watch: {
    sheet (nv) {
      if (!nv) {
        this.$refs.tokenCard.stopRefresher()
      }
    }
  },

  methods: {
    open (token, network = null, exchange = null) {
      this.token = token
      this.sheet = true
      this.$nextTick(() => {
        this.$refs.tokenCard.loadToken(token, network, exchange)
      })
    },
    close () {
      this.sheet = false
    }
  }
}
</script>