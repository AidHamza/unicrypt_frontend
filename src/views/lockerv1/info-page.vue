<template>

  <v-card class="br-20 pa-4">

    <div class=" d-flex align-center mb-8 display-1">
      Explorer
      <v-spacer></v-spacer>
      <v-icon size="50">mdi-lock</v-icon>
    </div>

    <v-card v-for="token of tokens" :key="token.lptoken" class="pa-3 br-20">
      <div class="font-weight-bold mb-3">
        {{ token.lptoken }}
      </div>
      <div v-for="lock of token.locks" :key="lock.lockID">
        <info-row :lock="lock"></info-row>
      </div>
    </v-card>

  </v-card>
</template>

<script>
// import { ethers } from 'ethers'
// import UniswapContract from '@/smart-contracts/uniswap-contract.js'
import LockerContract from '@/smart-contracts/lock-uni-v2/univ2-contract'
import InfoRow from './info-row'

export default {
  components: {
    InfoRow
  },

  data: () => ({
    tokens: []
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
  },

  methods: {
    async getLockedTokens () {
      var numTokens = await LockerContract.getNumLockedTokens()
      var tokens = []
      for (var i = 0; i < numTokens; i++) {
        var token = await LockerContract.getLockedTokenAtIndex(i)
        var locks = await this.getLocks(token)
        tokens.push({
          lptoken: token,
          locks: locks
        })
      }
      this.tokens = tokens
    },
    async getLocks (_lpToken) {
      var numLocks = await LockerContract.getNumLocksForToken(_lpToken)
      var locks = []
      for (var i = 0; i < numLocks; i++) {
        console.log(i + ' of ' + numLocks)
        var lock = await LockerContract.getLockForTokenAtIndex(_lpToken, i)
        locks.push(lock)
      }
      return locks
    }
  },

  created () {
    this.getLockedTokens()
  }
}
</script>