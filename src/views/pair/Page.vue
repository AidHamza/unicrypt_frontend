<template>
  <v-container style="max-width: 600px;">

    <v-card :class="['br-20 mb-16', {'pa-4': $vuetify.breakpoint.xs}, {'pa-6': !$vuetify.breakpoint.xs}]">
      
      <div class="d-flex align-center">
        <v-btn icon :to="`${$store.state.ammPrefix}/pairs`" color="text">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
        <v-btn :to="`${$store.state.ammPrefix}/locker?address=${address}`" rounded outlined color="white" class="grad-green">
          <v-icon small class="mr-2">mdi-lock</v-icon>
          Lock Liquidity
        </v-btn>

      </div>

      <trade-test v-if="false" :pair="pair.address">

      </trade-test>

      <div class="pa-4 mb-2 text-center">
        <div class="d-flex mb-3 align-center justify-center title font-weight-bold">
          <coin-icon :address="pair.token0.address" :url="pair.token0.icon_url" style="z-index: 1;"></coin-icon>
          <coin-icon :address="pair.token1.address" :url="pair.token1.icon_url" class="mr-2" style="margin-left: -10px;"></coin-icon>
          <v-btn text class="title pa-0" color="primary" @click="$root.ammLink(`/token/${pair.token0.address}`)">
            {{ token0Symbol }}
          </v-btn>
          <span class="textFaint--text">
            /
          </span>
          <v-btn text class="title pa-0" color="primary" @click="$root.ammLink(`/token/${pair.token1.address}`)">
            {{ token1Symbol }}
          </v-btn>
        </div>
        <div class="">
          {{ pair.token0.name }} /
          {{ pair.token1.name }}
        </div>
        <copy-address :address="pair.address" color="textFaint"></copy-address>
      </div>

      <div class="mt-4 mb-6 text-center">
        <v-btn text color="textFaint" rounded :href="`${$store.state.etherscan_url}/address/${pair.address}`" target="_blank">
          {{ $store.state.explorer_name }}
          <v-icon x-small>mdi-arrow-top-right</v-icon>
        </v-btn>
        <v-btn text color="textFaint" rounded :href="`${$store.state.exchangePairLink}/${pair.address}`" target="_blank">
          {{ $store.state.exchange }}
          <v-icon x-small>mdi-arrow-top-right</v-icon>
        </v-btn>
        <v-btn v-if="dextLink" text color="textFaint" rounded :href="dextLink" target="_blank">
          <img 
          src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x26CE25148832C04f3d7F26F32478a9fe55197166/logo.png" 
          height="18px"
          width="18px"
          class="mr-1">
          Dext
          <v-icon x-small>mdi-arrow-top-right</v-icon>
        </v-btn>
        <div v-if="false" class="">
          Uniswap index: {{ pair.uniswap_index }}
        </div>
      </div>

      <div :class="['']">

        <v-card v-if="uniswapAPIIsDown" class="pa-4 br-20 mb-4">
          <div class="pink--text">
            {{ $store.state.exchange }} API is down / $ value not determinable
          </div>
        </v-card>

        <div v-if="loadingPOL1 && POL1Length > 1" class="text-center">
          <v-progress-circular
          :rotate="-90"
          :value="POL1Progress"
          size="60"
          color="primary">
            <v-icon>mdi-lock</v-icon>
          </v-progress-circular>
          <div>
            {{ POL1SyncIndex }} / {{ POL1Length }}
          </div>
        </div>

        <div v-if="loadingLockedLiquidity" class="text-center textFaint--text">
          <div>
            Loading...
          </div>
        </div>

        <template v-else>
          
          <!-- LOCKED -->
          <div v-if="items.length > 0">
            <div class="d-flex justify-end caption align-center mb-2">
              <div class="caption mr-2">
                Unicrypt Certified Lock
              </div>
              <img 
              src="@/assets/img/flags/verified.svg" 
              height="20px"
              class="mr-2"
              width="20px">
            </div>
            <div class="mb-2 font-weight-medium midground pa-4 br-20" style="position: relative; overflow: hidden;">
              <div class="green" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
              </div>
              <div>
                <div class="ma-1 d-flex align-center">
                  <v-progress-circular
                  :value="percentOfTotal"
                  :rotate="-90"
                  size="50"
                  width="3"
                  color="green">
                    <v-icon size="30" color="green">mdi-lock-outline</v-icon>
                  </v-progress-circular>
                  
                  <div class="ml-4">

                    <div class="title text--text">
                      <span class="text--text">{{ percentOfTotal }}%</span> LOCKED
                    </div>
                    <div class="d-flex">
                      <div class="green--text">
                        ${{ lockedValueHuman }}
                      </div>
                      <div class="textFaint--text ml-1">
                        / ${{ reserveValueHuman }}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- NOT LOCKED -->
          <div v-else class="mb-2 d-flex align-center font-weight-medium midground pa-4 br-20" style="position: relative; overflow: hidden;">
            <div class="orange" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
            </div>
            <div>
              <div class="d-flex align-center mb-2">
                <img 
                src="@/assets/img/flags/exclamation.svg" 
                height="26px"
                class="mr-2"
                width="26px">
                No Locked Liquidity on Unicrypt
              </div>
              <div class="caption font-weight-bold">
                There is no locked liquidity for this pair on the Unicrypt platform.
              </div>
            </div>
          </div>

          <div class="d-flex mt-8">
            Total LP tokens
            <v-spacer></v-spacer>
            {{ totalSupplyHuman }}
          </div>
          <div class="d-flex">
            Total locked LP
            <v-spacer></v-spacer>
            {{ totalLockedHuman }}
          </div>

          <template v-if="items.length > 0">
            <div class="mt-8">
              <div class="t-large">
                Liquidity Locks
              </div>

              <div class="textFaint--text caption mb-8">
                Please be aware only the univ2 tokens are locked. Not the actual dollar value. This changes as people trade. More liquidity tokens are also minted as people add liquidity to the pool.
              </div>
            </div>

            <div class="d-flex mt-4 textFaint--text font-italic">
              <div>
                Value
              </div>
              <v-spacer></v-spacer>
              <div class="mr-9">
                Unlock date
              </div>
            </div>

            <div>
              <unlock-row v-for="(item, index) of items" :item="item" :key="index" :reserveUSD="reserveUSD" :totalSupply="totalSupply"></unlock-row>
            </div>
          </template>

        </template>

        <v2-card v-if="false" :address="address"></v2-card>

      </div>

    </v-card>
    
  </v-container>
</template>

<script>
import TradeTest from '@/views/pair/TradeTest'
import _ from 'lodash'
import POL1Contract from '@/smart-contracts/pol1/locker-contract'
import POL2Contract from '@/smart-contracts/lock-uni-v2/univ2-contract'
import ERC20 from '@/smart-contracts/erc20'
import UnlockRow from './unlock-row'
import { ethers } from 'ethers'
import V2Card from './v2-card'
import moment from 'moment'
import axios from 'axios'

export default {
  components: {
    UnlockRow,
    V2Card,
    TradeTest
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
    totalLockedTokens: '0', // with unlock epoch above now
    items: [],
    totalSupply: '0',
    reserveUSD: '0',
    loadingLockedLiquidity: true,
    loadingPOL1: true,
    POL1Length: 0,
    POL1SyncIndex: 0,
    uniswapAPIIsDown: false
  }),

  computed: {
    dextLink () {
      if (this.$store.state.exchange === 'Uniswap V2') {
        return `https://www.dextools.io/app/uniswap/pair-explorer/${this.pair.address}`
      } else if (this.$store.state.exchange === 'Pancakeswap V2' || this.$store.state.exchange === 'Pancakeswap V1') {
        return `https://www.dextools.io/app/pancakeswap/pair-explorer/${this.pair.address}`
      }
      return null
    },
    sEthers () {
      return this.$store.state.ethers
    },
    totalSupplyHuman () {
      var amount = ethers.utils.formatUnits(this.totalSupply, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    },
    totalLockedHuman () {
      var amount = ethers.utils.formatUnits(this.totalLockedTokens, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    },
    percentOfTotal () {
      if (this.totalSupply === '0') {
        return '0'
      }
      var percent = ethers.BigNumber.from(this.totalLockedTokens).mul(1000).div(this.totalSupply)
      return percent.toNumber() / 10
    },
    reserveValueHuman () {
      var value = this.reserveUSD
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})
    },
    lockedValueHuman () {
      if (this.totalSupply === '0') {
        return '0'
      }
      var percent = ethers.BigNumber.from(this.totalLockedTokens).mul(10000000000).div(this.totalSupply)
      var value = this.reserveUSD * percent / 10000000000
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})
    },
    POL1Progress () {
      if (this.POL1Length === 0) {
        return 0
      }
      var progress = (this.POL1SyncIndex / this.POL1Length) * 100
      return progress
    },
    token0Symbol () {
      if (this.pair.token0.address === '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') {
        return 'ETH'
      }
      return this.pair.token0.symbol
    },
    token1Symbol () {
      if (this.pair.token1.address === '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') {
        return 'ETH'
      }
      return this.pair.token1.symbol
    },
  },

  methods: {
    loadAPI: _.debounce(function () {
      return new Promise((resolve, reject) => {
        this.$axios.get(`/uniswap/pair/${this.address}?network=${this.$store.state.ethers.network}`)
          .then(response => {
            this.pair = response.data
          })
          .then(() => resolve())
          .catch(error => {
            console.log(error)
            reject(error)
          })
      })
    }, 500, {leading: true}),

    async loadLocks () {
      if (this.$store.state.exchange === 'Uniswap V2') {
        await this.loadLocksUniswap()
      } else {
        await this.loadLocksOnlyPOL2()
      }
    },

    async loadLocksOnlyPOL2 () {
      this.loadingPOL1 = true
      // var totalLockedTokens = await POL1Contract.getLockedLiquidity(this.address)

      var len2 = await POL2Contract.getNumLocksForToken(this.address)
      len2 = Number(len2)
      this.POL1Length = len2

      var arr = []
      this.POL1SyncIndex = 0
      for (var i2 = 0; i2 < len2; i2++) {
        this.POL1SyncIndex++
        var struct2 = await POL2Contract.getLockForTokenAtIndex(this.address, i2)
        if (struct2.unlock_date < moment().unix()) {
          continue // only show new locks, comment this to show all
        }
        struct2.v2 = true
        arr.push(struct2)
      }

      arr = arr.sort((a, b) => a.epoch - b.epoch)
      this.items = arr
      this.totalLockedTokens = arr.reduce((a, b) => {
        return ethers.BigNumber.from(a).add(b.amount)
      }, '0')

      this.loadingPOL1 = false

      this.getReserveUSD()
    },

    async loadLocksUniswap () {
      this.loadingPOL1 = true
      // var totalLockedTokens = await POL1Contract.getLockedLiquidity(this.address)

      var len1 = await POL1Contract.getTokenReleaseLength(this.address)
      var len2 = await POL2Contract.getNumLocksForToken(this.address)
      len1 = Number(len1)
      len2 = Number(len2)
      this.POL1Length = len1 + len2

      var arr = []
      this.POL1SyncIndex = 0
      for (var i = 0; i < len1; i++) {
        var struct = await POL1Contract.getTokenReleaseAtIndex(this.address, i)
        this.POL1SyncIndex++
        // console.log(struct)
        if (struct.epoch < moment().unix()) {
          continue // only show new locks, comment this to show all
        }
        arr.push({
          unlock_date: struct.epoch,
          amount: struct.amount
        })
      }

      for (var i2 = 0; i2 < len2; i2++) {
        this.POL1SyncIndex++
        var struct2 = await POL2Contract.getLockForTokenAtIndex(this.address, i2)
        console.log(struct2)
        if (struct2.unlock_date < moment().unix()) {
          continue // only show new locks, comment this to show all
        }
        struct2.v2 = true
        arr.push(struct2)
      }

      arr = arr.sort((a, b) => a.epoch - b.epoch)
      this.items = arr
      this.totalLockedTokens = arr.reduce((a, b) => {
        return ethers.BigNumber.from(a).add(b.amount)
      }, '0')

      this.loadingPOL1 = false

      this.getReserveUSD()
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
      
      axios.post(this.$store.state.graphExplorer, data)
        .then(response => {
          this.reserveUSD = response.data.data.pair.reserveUSD
        })
        .catch(error => {
          console.log(error)
          this.uniswapAPIIsDown = true
        })
    },

    async doFirstLoad () {
      await this.getUniswapTotalSupply() // this needs to be called before loadLocks
      this.loadLocks()
        .then(() => {})
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.loadingLockedLiquidity = false
        })
    }
  },

  created () {
    this.loadAPI()
    this.doFirstLoad()
  }
}
</script>