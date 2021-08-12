<template>
  <v-container style="max-width: 600px; overflow: hidden;" :class="[{'pa-0': $vuetify.breakpoint.xs}]">

    <div :class="['mb-16', {'': $vuetify.breakpoint.xs}, {'': !$vuetify.breakpoint.xs}]">

      <div v-if="firstLoad" class="text-center">
        <v-progress-circular
        indeterminate
        size="80"
        width="2"
        color="#aaa">
          <img 
          src="@/assets/img/UNCX_fill.svg" 
          height="60px"
          class="greyscale"
          width="60px">
        </v-progress-circular>
      </div>

      <v-scroll-x-transition mode="out-in">
        <div v-if="!firstLoad">

          <div :class="[{'v-card br-20 ma-2': $vuetify.breakpoint.xs}, {'v-card br-20': !$vuetify.breakpoint.xs}]">
            <div class="text-center">
              <div class="d-flex align-center border-b pa-3">
                <v-btn icon :to="`${$store.state.ammPrefix}/tokens`" color="textFaint">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <coin-icon :address="address" :url="token.icon_url" :size="30" class="mr-2"></coin-icon>
                <v-btn text @click.stop="$root.tokenPage.open(address)" class="title pa-0 font-weight-bold" style="min-width: 10px;">
                  <span>
                    {{ tokenHydrated.symbol }}
                  </span>
                  <v-icon small color="textFaint">mdi-chevron-up</v-icon>
                </v-btn>
                <span class="textFaint--text ml-2">{{ tokenHydrated.name }}</span>
                <v-spacer></v-spacer>
                <enmt-badge v-if="tokenHydrated.isENMT"></enmt-badge>
              </div>
              <div class="background py-2">
                <div>
                  <copy-address :address="address" color="text"></copy-address>
                </div>
                <div class="textFaint--text caption text-center">
                  Total Supply: {{ totalSupplyHuman }}
                </div>
              </div>
            </div>

            <div class="">
              <v-row dense class="pa-4 align-end">
                <v-col cols="4" class="text-center">
                  <div>
                    <div class="">
                      ${{ fullyDilutedMcap }}
                    </div>
                    <div class="textFaint--text caption">
                      Fully diluted mcap
                    </div>
                  </div>
                </v-col>
                <v-col cols="4" class="text-center">
                  <div>
                    <div class="">
                      ${{ volume24hrHuman }}
                    </div>
                    <div class="textFaint--text caption">
                      Volume 24hr
                    </div>
                  </div>
                </v-col>
                <v-col cols="4" class="text-center">
                  <div>
                    <div class="title">
                      <div :class="[token.change_24 >= 0 ? 'primary--text' : 'pink--text']">
                        ${{ priceHuman }}
                      </div>
                    </div>
                    <div class="textFaint--text caption">
                      Price
                    </div>
                  </div>
                </v-col>
              </v-row>
              <lchart v-if="$store.state.requiredNetwork !== 'Kovan'" :address="mostLiquidPair.address" :tokenAddress="address"></lchart>

              <v-row dense class="pa-4 caption">
                <v-col cols="4">
                  <div class="font-weight-regular textFaint--text">
                    30d: 
                    <span :class="['font-weight-bold', token.change_30d >= 0 ? 'primary--text' : 'pink--text']">{{ change30d }}%</span>
                    <v-progress-linear rounded height="4" :value="Math.abs(token.change_30d)" :color="token.change_30d >= 0 ? 'primary' : 'pink'" background-color=""></v-progress-linear>
                  </div>
                </v-col>
                <v-col cols="4" class="text-center">
                  <div class="font-weight-regular textFaint--text">
                    7d: 
                    <span :class="['font-weight-bold', token.change_7d >= 0 ? 'primary--text' : 'pink--text']">{{ change7d }}%</span>
                    <v-progress-linear rounded height="4" :value="Math.abs(token.change_7d)" :color="token.change_7d >= 0 ? 'primary' : 'pink'" background-color=""></v-progress-linear>
                  </div>
                </v-col>
                <v-col cols="4" class="text-end textFaint--text">
                  <div>
                    1d: <span :class="['font-weight-bold', token.change_24 >= 0 ? 'primary--text' : 'pink--text']">{{ change24hr }}%</span>
                    <v-progress-linear rounded height="4" :value="Math.abs(token.change_24)" :color="token.change_24 >= 0 ? 'primary' : 'pink'" background-color=""></v-progress-linear>
                  </div>
                </v-col>
              </v-row>

              <div v-if="false" class="textFaint--text text-center">
                {{ $store.state.exchange }} index: {{ token.first_uniswap_index }}
              </div>

              <div class="py-2 text-center background">
                <v-btn small color="textFaint" text :href="`${$store.state.exchangeTokenLink}/${address}`" target="_blank">
                  {{ $store.state.exchange }}
                  <v-icon x-small>mdi-arrow-top-right</v-icon>
                </v-btn>
                <v-btn small color="textFaint" text :href="`${$store.state.etherscan_url}/address/${address}`" target="_blank">
                  {{ $store.state.explorer_name }}
                  <v-icon x-small>mdi-arrow-top-right</v-icon>
                </v-btn>
                <v-btn icon color="textFaint" class="ml-2 mr-2" :href="`https://twitter.com/search?q=%24${tokenHydrated.symbol}&src=typed_query`" target="_blank">
                  <v-icon>mdi-twitter</v-icon>
                </v-btn>
              </div>
            </div>

          </div>

          <div class="d-flex align-center pt-6 pr-4">
            <v-spacer></v-spacer>
            <v-btn rounded small color="primary" 
            :to="`/services/lock-tokens?token=${tokenHydrated.address}`"
            class="green-button">
              Lock tokens
              <v-icon small class="ml-1">mdi-lock-outline</v-icon>
            </v-btn>
          </div>

          <div :class="[{'v-card br-20 ma-2': $vuetify.breakpoint.xs}, {'mt-2 v-card br-20': !$vuetify.breakpoint.xs}]">
            <global-token :tokenHydrated="tokenHydrated"></global-token>
          </div>

          <!-- LOCKED -->
          <div v-if="token.tval_locked > 0" class="v-card d-flex align-center pa-6 mb-6 mt-2 br-20">

            <v-progress-circular
            :value="token.tval_locked / 1000"
            :rotate="-90"
            size="50"
            width="3"
            color="primary">
              <v-icon size="30" color="primary">mdi-lock-outline</v-icon>
            </v-progress-circular>
            
            <div class="ml-4">

              <div class="title font-weight-medium">
                ${{ tvalLockedHuman }} Locked liquidity
              </div>
              <div class="d-flex textFaint--text caption">
                On Unicrypt Lockers
              </div>
            </div>
          </div>
          <!-- NOT LOCKED -->
          <div v-else :class="['pa-4 mt-2', {'v-card br-20 ma-2': $vuetify.breakpoint.xs}, {'v-card br-20': !$vuetify.breakpoint.xs}]">
            <div class="text-center">
              <img 
              src="@/assets/img/flags/exclamation.svg" 
              height="26px"
              class="mr-2"
              width="26px">
              <div>
                No Liquidity Locks for this token
              </div>
              <div class="textFaint--text caption">
                on Unicrypt
              </div>
            </div>
          </div>

          <div :class="['mt-4', {'v-card br-20 ma-2': $vuetify.breakpoint.xs}, {'v-card br-20': !$vuetify.breakpoint.xs}]">
            <div class="d-flex justify-center py-1 border-b">
              <v-btn text rounded x-large @click="tab = 0" :color="tab === 0 ? 'primary' : 'textFaint'">
                Pairs
              </v-btn>
              <v-btn text rounded x-large @click="tab = 1" :color="tab === 1 ? 'primary' : 'textFaint'">
                Comments (<DisqusCount shortname='unicrypt-network' :identifier="netIdentifier" />)
              </v-btn>
            </div>

            <div v-if="tab === 0">
              <div class="text-center background py-2 textFaint--text">
                {{ token.symbol }} PAIRS
              </div>

              <pairs-card :address="address"></pairs-card>
            </div>

            <div v-if="tab === 1">
              <div class="text-center textFaint--text mb-4">
                Discuss this token. Mention mints / proxies or dangerous code below.
              </div>
              <comments :identifier="`token_${tokenHydrated.address}`"></comments>
            </div>
          </div>

        </div>
      </v-scroll-x-transition>
      
    </div>
    
  </v-container>
</template>

<script>
import _ from 'lodash'
import { ethers } from 'ethers'
import axios from 'axios'
import { DisqusCount } from 'vue-disqus'
import PairsCard from './pairs-card'
import Comments from '@/components/disqus/comments'
import lchart from './lchart'
import GlobalToken from '@/views/locker/erc20/global-token/Main'
import ERC20 from '@/smart-contracts/erc20/pager'

export default {
  components: {
    DisqusCount,
    PairsCard,
    Comments,
    lchart,
    GlobalToken
  },

  props: {
    address: {
      type: String
    }
  },

  data: () => ({
    tab: 0,
    token: {
      total_supply: '0'
    },
    pairs: [],
    page: 0,
    filters: {
      rowsPerPage: 20,
      sort: 'lock_value',
      sortAscending: false,
    },
    nextPageExists: false,
    datar: {
      ohlcv: [
        [1551128400000, 33, 37.1, 14, 14, 196],
        [1551132000000, 13.7, 30, 6.6, 30, 206],
        [1551135600000, 29.9, 33, 21.3, 21.8,74],
        [1551139200000, 21.7, 25.9, 18, 24, 140],
        [1551142800000, 24.1, 24.1, 24, 24.1,29],
      ]
    },
    uniswap_chart: [],
    firstLoad: true,
    mostLiquidPair: {},
    tokenHydrated: {
      address: null
    },
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    netIdentifier () {
      var identifier = `token_${this.tokenHydrated.address}`
      return `${this.$store.state.requiredNetwork}_${identifier}`
    },
    tradingViewOptions () {
      if (this.pairs.length < 1) {
        return null
      }
      var pair = this.pairs[0]
      return {
        symbol: `UNISWAP:${pair.token0.symbol}${pair.token1.symbol}`,
        interval: 'D',
        theme: 'dark',
        style: "3",
        width: '100%'
      }
    },
    percentOfTotal () {
      return 50
    },
    lockedValueHuman () {
      return 700
    },
    change24hr () {
      var value = this.token.change_24
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 1})
    },
    change7d () {
      var value = this.token.change_7d
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 1})
    },
    change30d () {
      var value = this.token.change_30d
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 1})
    },
    tvalLockedHuman () {
      var amount = parseInt(this.token.tval_locked)
      // amount = '1230000' // for testing
      if (amount >= 1000000) {
        var deci = Number(amount / 1000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return deci + 'M'
      } else if (amount > 1000) {
        return Math.floor(amount / 1000) + 'k'
      }
      return amount
    },
    totalSupplyHuman () {
      var tsupply = ethers.utils.formatUnits(this.token.total_supply, this.token.decimals)
      return Number(tsupply).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})
    },
    fullyDilutedMcap () {
      var amount = this.token.price_usd * (this.token.total_supply / Math.pow(10, this.token.decimals))
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
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
    volume24hrHuman () {
      var amount = parseInt(this.token.volume24hr)
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
    priceHuman () {
      var value = Number(this.token.price_usd)
      var digits = 2
      if (value > 1000) {
        digits = 0
      } else if (value > 0.1) {
        digits = 2
      } else if (value > 0.001) {
        digits = 4
      } else if (value > 0.0001) {
        digits = 5
      }
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: digits})
    },
  },

  watch: {
    sEthersWatcher () {
      console.log('refreshing page', this.$store.state.requiredNetwork)
      this.refresh()
    }
  },

  methods: {
    loadAPI: _.debounce(function () {
      return new Promise((resolve, reject) => {
        this.$axios.get(`/erc20/token/${this.address}`)
          .then(response => {
            this.token = response.data
          })
          .then(() => resolve())
          .catch(error => {
            console.log(error)
            reject(error)
          })
      })
    }, 500, {leading: true}),

    async getMostLiquidPair () {
      var pair_response = await this.$axios.get(`/uniswap/token/${this.address}/most-liquid-pair`)
      this.mostLiquidPair = pair_response.data.rows[0]
    },

    fetchChart () {
      return new Promise((resolve, reject) => {
        var address = "0x990f659bf4945886bf070f2acb4ff4894e91c1cd"
        var data = {
          query: `
          {
            pairHourDatas(id: "${address.toLowerCase()}") {
              pair {
                id
              }
              reserve0
              reserve1
              hourStartUnix
            }
          }
        `
        }
        axios.post("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2", data)
          .then(response => {
            this.uniswap_chart = response.data.data.pairHourDatas
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    async loadToken () {
      try {
        var token = await ERC20.getERC20(this.address)
        this.tokenHydrated = token
      } catch (e) {}
    },
    async refresh () {
      await this.loadToken()
      this.loadAPI()
      this.getMostLiquidPair()
    }
  },

  created () {
    this.refresh()
      .then(() => {
        this.firstLoad = false
      })
    // this.fetchChart()
  }
}
</script>