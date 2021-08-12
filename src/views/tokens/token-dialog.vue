<template>
  <v-dialog v-model="dialog" max-width="450" content-class="br-20">
    <v-card class="foreground">
      <token-card
      @on-close="close"
      ref="tokenCard"
      >
      </token-card>
    </v-card>
  </v-dialog>
</template>

<script>
import TokenCard from './token-card'

export default {
  components: {
    TokenCard
  },

  data: () => ({
    dialog: false,
    token: {}
  }),

  watch: {
    dialog (nv) {
      if (!nv) {
        this.$refs.tokenCard.stopRefresher()
      }
    }
  },

  methods: {
    open (token, network = null, exchange = null) {
      this.token = token
      this.dialog = true
      this.$nextTick(() => {
        this.$refs.tokenCard.loadToken(token, network, exchange)
      })
    },
    close () {
      this.dialog = false
    }
  }
}
</script>