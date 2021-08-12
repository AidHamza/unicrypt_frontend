<template>
  <div class="">

    <div class="">
      <div class="background d-flex align-center px-4">
        <div v-if="!firstLoad" class="textFaint--text font-italic caption">
          {{ numTokens }} {{ numTokens === 1 ? 'token' : 'tokens'}}
        </div>
        <v-spacer></v-spacer>

        <v-btn v-if="!loading" @click="refresh" icon color="textFaint">
          <v-icon small>mdi-refresh</v-icon>
        </v-btn>
        <div v-else style="height: 36px; width: 36px;" class="d-flex align-center justify-center">
          <v-progress-circular
          indeterminate
          size="14"
          width="2"
          color="primary">
          </v-progress-circular>
        </div>

      </div>

      <div v-if="firstLoad" class="text-center py-4">
        <v-progress-circular
        indeterminate
        size="60"
        width="2"
        color="#aaa">
          <img 
          src="@/assets/img/UNCX_fill.svg" 
          height="50px"
          class="greyscale"
          width="50px">
        </v-progress-circular>
      </div>

      <v-slide-y-transition appear>
        <div v-if="!firstLoad">
          
          <template v-if="tokens.length > 0">
            <div 
            v-for="token of tokens" 
            :key="token.address" 
            :class="['d-flex align-center pa-3 border-b c-list']" 
            @click="$emit('on-select-token', token)">
              <coin-icon :address="token.address" class="mr-3"></coin-icon>
              {{ token.symbol }}
            </div>

            <div v-if="pageCount > 1" class="d-flex align-center justify-center background pa-2">
              <v-btn @click="goPrevious" text :disabled="page === 0">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              {{ page + 1 }} / {{ pageCount }}
              <v-btn @click="goNext" text :disabled="!nextPageExists">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </template>

          <div v-else class="caption pa-8 text-center textFaint--text">
            No Token locks for your account on this chain.
          </div>

        </div>
      </v-slide-y-transition>

    </div>

  </div>
</template>

<script>
import VestingPager from '@/smart-contracts/token-locker/pager-contract'
import VESTABI from '@/smart-contracts/token-locker/token-locker-abis'
import ERC20 from '@/smart-contracts/erc20'

export default {
  components: {
  },

  data: () => ({
    numTokens: 0,
    tokens: [],
    page: 0,
    firstLoad: true,
    loading: true
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    nextPageExists () {
      return (this.page + 1) * VESTABI.MAX_GETTER_LENGTH < this.numTokens
    },
    pageCount () {
      return Math.ceil(this.numTokens / VESTABI.MAX_GETTER_LENGTH)
    }
  },

  watch: {
    address () {
      this.refresh()
    },
    sEthersWatcher () {
      console.log('watcher updated')
      this.refresh()
    },
  },

  methods: {
    goNext () {
      this.page++
      this.refresh()
    },
    goPrevious () {
      this.page--
      this.refresh()
    },
    async getUserLockedTokens (_start, _count) {
      var tokens = await VestingPager.getUserLockedTokens(this.sEthers.coinbase, _start, _count)
      return tokens
    },
    async getUserLockedTokensLength () {
      var numTokens = await VestingPager.getUserLockedTokensLength(this.sEthers.coinbase)
      this.numTokens = Number(numTokens)
    },
    async refresh () {
      this.loading = true
      try {
        await this.getUserLockedTokensLength()
        var addresses = await this.getUserLockedTokens(this.page * VESTABI.MAX_GETTER_LENGTH, VESTABI.MAX_GETTER_LENGTH)
        var tokens = []
        for (var address of addresses) {
          var token = await ERC20.getERC20(address)
          tokens.push(token)
        }
        this.tokens = tokens
        this.firstLoad = false
        this.loading = false
      } catch (e) {
        this.firstLoad = false
        this.loading = false
      }
    }
  },

  created () {
    this.refresh()
  }
}
</script>