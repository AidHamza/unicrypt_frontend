<template>
  <div>
    <div>
      Trade time
    </div>

    <div>
      {{ pair }}
    </div>

    <div>
      {{ reserve0Human }} {{ hPair.token0.symbol }}
    </div>
    <div>
      {{ reserve1Human }} {{ hPair.token1.symbol }}
    </div>

    <v-btn @click="refresh">
      Reload
    </v-btn>
  </div>
</template>

<script>
import V2PairContract from '@/smart-contracts/uniswap/v2-pair'
import { ethers } from 'ethers'

export default {
  props: {
    pair: {
      type: String
    }
  },

  data: () => ({
    hPair: {
      reserve0: '0',
      reserve1: '0',
      token0: {
        decimals: 0
      },
      token1: {
        decimals: 0
      }
    }
  }),

  computed: {
    reserve0Human () {
      var tsupply = ethers.utils.formatUnits(this.hPair.reserve0, this.hPair.token0.decimals)
      return Number(tsupply).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    },
    reserve1Human () {
      var tsupply = ethers.utils.formatUnits(this.hPair.reserve1, this.hPair.token0.decimals)
      return Number(tsupply).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    }
  },

  methods: {
    async refresh () {
      var hpair = await V2PairContract.hydratePair(this.pair)
      this.hPair = hpair
    }
  },

  created () {
    this.refresh()
  }
}
</script>