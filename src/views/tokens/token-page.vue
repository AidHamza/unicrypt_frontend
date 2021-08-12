<template>
  <token-mobile v-if="$vuetify.breakpoint.xs" ref="tokenMobile"></token-mobile>
  <token-desktop v-else ref="tokenDesktop"></token-desktop>
</template>

<script>
import TokenMobile from './bottom-sheet'
import TokenDesktop from './token-dialog'

export default {
  components: {
    TokenMobile,
    TokenDesktop
  },

  data: () => ({
  }),

  methods: {
    open (token, network = null, exchange = null) {
      if (this.$vuetify.breakpoint.xs) {
        this.$refs.tokenMobile.open(token, network, exchange)
      } else {
        this.$refs.tokenDesktop.open(token, network, exchange)
      }
    },
    close () {
      // this.sheet = false
    }
  }
}
</script>