<template>
  <v-container>

    <v-card :class="['br-20']">

      <div v-if="loadingLockedLiquidity" class="text-center pa-6">
        <v-progress-circular
        indeterminate
        size="60"
        color="primary">
          <v-icon>mdi-lock</v-icon>
        </v-progress-circular>
        <div>
          Loading
        </div>
      </div>

      <template v-else>

        <template v-if="items.length > 0">

          <div class="pa-4">
            <div class="mt-2 mb-1 t-large">
              V2 Liquidity Locks
            </div>

            <div class="textFaint--text t-small">
              Please be aware only the univ2 tokens are locked. Not the actual dollar value. This changes as people trade. More liquidity tokens are also minted as people add liquidity to the pool.
            </div>
          </div>

          <div class="d-flex mt-4 font-italic">
            <div class="ml-2">
              Value
            </div>
            <v-spacer></v-spacer>
            <div class="mr-8">
              Unlock date
            </div>
          </div>

          <div>
            <unlock-row v-for="(item, index) of items" :item="item" :key="index" :reserveUSD="reserveUSD" :totalSupply="totalSupply"></unlock-row>
          </div>
        </template>

        <div v-else class="pt-10 pb-4 text-center textFaint--text">
          <v-icon size="50" color="textFaint">mdi-lock-open-outline</v-icon>
          <div>
            No liquidity is locked for this pair on UniCrypt
          </div>
        </div>
      </template>

    </v-card>
    
  </v-container>
</template>

<script>
import LockerContract from '@/smart-contracts/lock-uni-v2/univ2-contract'
import ERC20 from '@/smart-contracts/erc20'
import UnlockRow from './v2-row'
import { ethers } from 'ethers'

export default {
  components: {
    UnlockRow
  },

  props: {
    address: {
      type: String
    }
  },

  data: () => ({
    pair: {
      token0: {},
      token1: {}
    },
    totalInLocker: '0',
    items: [],
    totalSupply: '0',
    reserveUSD: '0',
    loadingLockedLiquidity: true,
    textCopied: false,
    uniswapAPIIsDown: false
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    totalSupplyHuman () {
      var amount = ethers.utils.formatUnits(this.totalSupply, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    },
    reserveValueHuman () {
      var value = this.reserveUSD
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})
    },
  },

  methods: {
    async fetchChart () {
      var totalInLocker = await LockerContract.getLockedLiquidity(this.address)

      var len = await LockerContract.getNumLocksForToken(this.address)
      var arr = []
      for (var i = 0; i < len; i++) {
        var struct = await LockerContract.getLockForTokenAtIndex(this.address, i)
        arr.push(struct)
      }
      arr = arr.sort((a, b) => a.unlock_date - b.unlock_date)
      this.items = arr
      this.totalInLocker = totalInLocker

      this.getReserveUSD()
      await this.getUniswapTotalSupply()
    },

    async getUniswapTotalSupply () {
      var token = await ERC20.getERC20(this.address)
      this.totalSupply = token.totalSupply
    },

    getReserveUSD () {
      var data = {
        query: `
        {
          pair(id: "${this.address.toLowerCase()}") {
            reserveUSD
          }
        }
        `
      }
      
      this.$axios.post("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2", data)
        .then(response => {
          this.reserveUSD = response.data.data.pair.reserveUSD
          console.log(response)
        })
        .catch(error => {
          console.log(error)
          this.uniswapAPIIsDown = true
        })
    },
  },

  created () {
    this.fetchChart()
      .then(() => {})
      .catch(() => {})
      .then(() => {
        this.loadingLockedLiquidity = false
      })
  }
}
</script>