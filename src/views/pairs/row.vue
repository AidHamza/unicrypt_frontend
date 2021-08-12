<template>
  <div>

    <div class="c-list pa-4" @click="expandInfo = !expandInfo">
      <div class="d-flex align-center">
        <!--
        <coin-icon :address="item.token0.address" :url="item.token0.icon_url" :exchange="cExchange" :size="22" style="z-index: 1;"></coin-icon>
        <coin-icon :address="item.token1.address" :url="item.token1.icon_url" :exchange="cExchange" :size="22" style="margin-left: -6px;" class="mr-2"></coin-icon>
        -->

        <v-btn text rounded @click.stop="openTokenPage(item.token0.address)" class="title pa-0" style="min-width: 10px;">
          <coin-icon :address="item.token0.address" :url="item.token0.icon_url" :network="cNetwork" :size="20" class="mr-1"></coin-icon>
          <span class="text-truncate" :style="$vuetify.breakpoint.xs ? 'max-width: 9ch;' : 'max-width: 20ch;'">
            {{ token0Symbol }}
          </span>
          <v-icon x-small color="textFaint">mdi-chevron-up</v-icon>
        </v-btn>
        <v-btn text rounded @click.stop="openTokenPage(item.token1.address)" class="ml-2 title pa-0" style="min-width: 10px;">
          <coin-icon :address="item.token1.address" :url="item.token1.icon_url" :network="cNetwork"  :size="20" class="mr-1"></coin-icon>
          <span class="text-truncate" :style="$vuetify.breakpoint.xs ? 'max-width: 9ch;' : 'max-width: 20ch;'">
            {{ token1Symbol }}
          </span>
          <v-icon x-small color="textFaint">mdi-chevron-up</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <div v-if="item.locked_usd" class="">
          <div class="font-weight-bold d-flex align-center justify-end">
            <template v-if="item.fishy">
              ?
            </template>
            <span v-else :class="['font-weight-bold', {'primary--text': dollarValueLive > 100000}]">
              <span v-if="loadReserve" class="textFaint--text">
                ...
              </span>
              <span v-else>
                <template v-if="dollarValueLive > 0">
                  ${{ dollarValueLiveHuman }}
                </template>
              </span>
            </span>

            <v-progress-circular
            :value="dollarValueLive / 1000"
            :rotate="-90"
            size="20"
            width="1.5"
            class="ml-1"
            color="primary">
              <v-icon x-small :color="dollarValueLive > 100000 ? 'primary' : ''">mdi-lock-outline</v-icon>
            </v-progress-circular>

            <!-- <v-icon small class="ml-1" :color="item.locked_usd > 100000 ? 'primary' : ''">mdi-lock</v-icon> -->
          </div>
        </div>
        <div v-else class="text-end textFaint--text">
          <div class="caption font-weight-medium">
            No locked liquidity
            <v-icon small color="textFaint">mdi-alert-outline</v-icon>
          </div>
        </div>

      </div>

      <div class="d-flex align-center">
        <div class="caption textFaint--text font-weight-medium">
          Liquidity: 
          <span v-if="loadReserve">...</span>
          <span v-else-if="!loadReserveFailed" :class="[{'primary--text': item.locked_usd && liveStats.reserveUSD > 100000}, {'pink--text': !item.locked_usd && liveStats.reserveUSD > 100000}]">${{ reserveUSDHuman }}</span>
          <span v-else>?</span>
        </div>

        <v-btn v-if="cExchange === 'Pancakeswap V1' && $store.state.user.username" small color="primary" text rounded @click.stop="$root.$dialog.arbitrage.open(item.token0.address, item.token1.address, cNetwork)">ARB</v-btn>

        <v-spacer></v-spacer>

        <div v-if="item.locked_usd && dateFromNow" class="caption textFaint--text text-end font-weight-medium">
          <span class="textFaint--text caption font-weight-regular">
            ({{ percentLocked }}%)
          </span>
          next {{ dateFromNow }} 
        </div>
        <div v-else class="caption textFaint--text font-weight-medium">
          on Unicrypt
        </div>
        <v-icon small color="textFaint" :class="[{'rotate-180': expandInfo}]">mdi-chevron-down</v-icon>
      </div>
    </div>

    <v-expand-transition>
      <div v-if="expandInfo" class="background">

        <div class="d-flex justify-center pt-2">
          <div class="d-flex align-center foreground textFaint--text font-weight-medium br-20 px-3">
            <coin-icon :address="item.token0.address" :url="item.token0.icon_url" :network="cNetwork"  :size="24" class="mr-1"></coin-icon>
            {{ reserve0Human }}
          </div>
          <div class="d-flex align-center textFaint--text foreground font-weight-medium br-20 px-3">
            <coin-icon :address="item.token1.address" :url="item.token1.icon_url" :network="cNetwork"  :size="24" class="mr-1"></coin-icon>
            {{ reserve1Human }}
          </div>
          <v-btn v-if="!refreshReservesLoading" @click.stop="getReserves" icon color="textFaint">
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
        <div class="caption textFaint--text font-weight-medium font-italic text-center">
          {{ cExchange }} index: {{ item.uniswap_index }}
        </div>
        <div class="text-center mt-1">
          <v-btn color="textFaint" rounded text :href="`${$settings.AMMS[this.cExchange].ammTokenLink}${item.address}`" target="_blank">
            Pair
            <v-icon x-small>mdi-arrow-top-right</v-icon>
          </v-btn>
          <v-btn v-if="dextLink" text color="textFaint" rounded :href="dextLink" target="_blank">
            <img 
            src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x26CE25148832C04f3d7F26F32478a9fe55197166/logo.png" 
            height="14px"
            width="14px"
            class="mr-1">
            Dext
            <v-icon x-small>mdi-arrow-top-right</v-icon>
          </v-btn>
          <v-btn rounded text color="textFaint" @click="$root.ammLinkTwo(`/pair/${item.address}`, cExchange)">
            View lock page
          </v-btn>
        </div>

      </div>
    </v-expand-transition>

  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import { ethers } from 'ethers'
import ERC20 from '@/smart-contracts/erc20'
import SETTINGS from '@/store/settings'
import V2PAIR from '@/smart-contracts/uniswap/v2-pair'

export default {
  props: {
    item: {},
    index: {
      type: Number,
      default: null
    },
    exchange: null
  },

  data: () => ({
    liveStats: {
      reserveUSD: '0',
      totalSupply: '0'
    },
    totalSupply: '0',
    loadReserve: true,
    loadReserveFailed: false,
    refreshReservesLoading: false,
    reserves: {
      reserve0: '0',
      reserve1: '0'
    },
    expandInfo: false
  }),

  computed: {
    dextLink () {
      if (this.cExchange === 'Uniswap V2') {
        return `https://www.dextools.io/app/uniswap/pair-explorer/${this.item.address}`
      } else if (this.cExchange === 'Pancakeswap V2' || this.cExchange === 'Pancakeswap V1') {
        return `https://www.dextools.io/app/pancakeswap/pair-explorer/${this.item.address}`
      }
      return null
    },
    cNetwork () {
      return SETTINGS.AMMS[this.cExchange].chain
    },
    cExchange () {
      return this.exchange || this.$store.state.exchange
    },
    token0Symbol () {
      if (this.item.token0.address === '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') {
        return 'ETH'
      }
      return this.item.token0.symbol
    },
    token1Symbol () {
      if (this.item.token1.address === '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') {
        return 'ETH'
      }
      return this.item.token1.symbol
    },
    percentLocked () {
      if (this.totalSupply === '0') {
        return '0'
      }
      var percent = ethers.BigNumber.from(this.item.locked_univ2).mul(1000).div(this.totalSupply)
      return percent.toNumber() / 10
    },
    dollarValueLive () {
      if (this.loadReserveFailed) {
        return this.item.locked_usd
      }
      if (this.totalSupply === '0') {
        return '0'
      }
      var percent = ethers.BigNumber.from(this.item.locked_univ2).mul(10000000000).div(this.totalSupply)
      var amount = this.liveStats.reserveUSD * percent / 10000000000
      amount = parseInt(amount)
      return amount
    },
    dollarValueLiveHuman () {
      var amount = this.dollarValueLive
      if (amount >= 1000000) {
        var deci = Number(amount / 1000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return deci + 'M'
      } else if (amount > 1000) {
        return Math.floor(amount / 1000) + 'k'
      }
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
    // this is from the database, does not rely on uniswap api
    dollarValueDatabase () {
      var amount = parseInt(this.item.locked_usd)
      // amount = '1230000' // for testing
      if (amount >= 1000000) {
        var deci = Number(amount / 1000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return deci + 'M'
      } else if (amount > 1000) {
        return Math.floor(amount / 1000) + 'k'
      }
      return amount
      // return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
    dateFromNow () {
      if (moment.unix(this.item.next_unlock).isValid() && this.item.next_unlock !== '0') {
        return moment.unix(this.item.next_unlock).fromNow()
      }
      return null
    },
    reserveUSDHuman () {
      var amount = parseInt(this.liveStats.reserveUSD)
      // amount = '1230000000' // for testing
      if (amount >= 1000000000) {
        var bil = Number(amount / 1000000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return bil + 'B'
      } else if (amount >= 1000000) {
        var mil = Number(amount / 1000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return mil + 'M'
      } else if (amount > 1000) {
        return Math.floor(amount / 1000) + 'k'
      }
      return amount
      // return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
    reserve0Human () {
      var amount = ethers.utils.formatUnits(this.reserves.reserve0, this.item.token0.decimals)
      amount = Number(amount)
      if (amount >= 1000000000000) {
        var tril = Number(amount / 1000000000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return tril + ' T'
      } else if (amount >= 1000000000) {
        var bil = Number(amount / 1000000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return bil + ' B'
      } else if (amount >= 1000000) {
        var mil = Number(amount / 1000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return mil + ' M'
      } else if (amount > 1000) {
        return Math.floor(amount / 1000) + 'k'
      }
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
    reserve1Human () {
      var amount = ethers.utils.formatUnits(this.reserves.reserve1, this.item.token1.decimals)
      amount = Number(amount)
      if (amount >= 1000000000) {
        var bil = Number(amount / 1000000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return bil + 'B'
      } else if (amount >= 1000000) {
        var mil = Number(amount / 1000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return mil + 'M'
      } else if (amount > 1000) {
        return Math.floor(amount / 1000) + 'k'
      }
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
  },

  watch: {
    'item.address' (nv) {
      // this.getLiveStats()
    }
  },

  methods: {
    openTokenPage (address) {
      this.$root.tokenPage.open(address, this.cNetwork, this.cExchange)
    },
    async getBlockchainSupply () { // get total supply from the blockchain if the the graph api is down
      var token = await ERC20.getERC20(this.item.address, this.cNetwork)
      this.totalSupply = token.totalSupply
    },
    async getReserves () {
      this.refreshReservesLoading = true
      this.reserves = await V2PAIR.getReserves(this.item.address, this.cNetwork)
      this.refreshReservesLoading = false
    },
    async getLiveStats () {
      this.loadReserve = true
      this.loadReserveFailed = false
      var data = {
        query: `
        {
          pair(id: "${this.item.address.toLowerCase()}") {
            reserveUSD,
            totalSupply
          }
        }
        `
      }

      var graphExplorer = SETTINGS.AMMS[this.cExchange].graphExplorer

      var response = await axios.post(graphExplorer, data)
      if (response.data.data.pair !== null) {
        this.liveStats = response.data.data.pair
        this.totalSupply = ethers.utils.parseUnits(this.liveStats.totalSupply, 18).toString()
      } else {
        await this.getBlockchainSupply()
      }
    },
  },

  created () {
    this.getReserves()
    if (['Pancakeswap V1', 'Pancakeswap V222'].includes(this.cExchange)) {
      this.getBlockchainSupply()
      // this.loadReserveFailed = true
      // this.loadReserve = false
    } else {
      this.getLiveStats()
        .catch(error => {
          console.log(error)
          this.loadReserveFailed = true
        })
        .then(() => {
          this.loadReserve = false
        })
    }
  }
}
</script>