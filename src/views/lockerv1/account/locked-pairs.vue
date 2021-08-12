<template>
  <div>

    <div v-if="loading" class="text-center">
      <v-progress-circular
      indeterminate
      size="80"
      color="textFaint">
        <v-icon size="60" color="textFaint">mdi-lock-outline</v-icon>
      </v-progress-circular>
    </div>
    <template v-else>
      <locked-pair-row v-for="token of usersLockedTokens" :key="token.address" :item="token" @on-select="$emit('on-select', token)"></locked-pair-row>
    </template>
  </div>
</template>

<script>
import UniswapContract from '@/smart-contracts/uniswap-contract.js'
import LockerContract from '@/smart-contracts/lock-uni-v2/univ2-contract'
import LockedPairRow from './locked-pairs-row'

export default {
  components: {
    LockedPairRow
  },

  data: () => ({
    loading: true,
    usersLockedTokens: []
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    }
  },
  
  methods: {
    async getLockedTokens () {
      var numTokens = await LockerContract.getUserNumLockedTokens(this.sEthers.coinbase)
      var tokens = []
      for (var i = 0; i < numTokens; i++) {
        var address = await LockerContract.getUserLockedTokenAtIndex(this.sEthers.coinbase, i)
        var token = await UniswapContract.getV2PairInfo(address)
        tokens.push(token)
      }
      this.usersLockedTokens = tokens
    },
  },

  created () {
    this.getLockedTokens()
      .then(() => {
      })
      .catch(e => {})
      .then(() => {
        this.loading = false
      })
  }
}
</script>