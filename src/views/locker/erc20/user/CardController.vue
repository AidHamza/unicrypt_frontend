<template>
  <div class="">
    <div class="pa-4 border-b">
      Your Token Locks
    </div>

    <v-fade-transition mode="out-in">
      <user-tokens v-if="tab === 0" @on-select-token="selectToken"></user-tokens>

      <div v-if="tab === 1">
        <div class="pl-2 pt-2 background">
          <v-btn icon @click="tab = 0" color="text">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </div>
        <user-locks-for-token :tokenHydrated="tokenHydrated"></user-locks-for-token>
      </div>
    </v-fade-transition>
  </div>
</template>

<script>
import UserTokens from './UserTokens'
import UserLocksForToken from './UserLocksForToken'

export default {
  components: {
    UserTokens,
    UserLocksForToken
  },

  data: () => ({
    tab: 0,
    tokenHydrated: {}
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    }
  },

  watch: {
    sEthersWatcher () {
      this.tab = 0
    },
  },

  methods: {
    selectToken (token) {
      this.tokenHydrated = token
      this.tab = 1
    }
  },

  created () {
  }
}
</script>