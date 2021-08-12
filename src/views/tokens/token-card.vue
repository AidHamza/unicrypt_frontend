<template>
  <div class="pb-6">
    <div class="d-flex align-center pa-4">
      <template v-if="!newTokenLoad">
        <coin-icon :address="item.address" :url="item.icon_url" :network="network" class="mr-3"></coin-icon>
        <div class="title font-weight-bold">
          {{ tokenHydrated.symbol }}
        </div>
        <div class="textFaint--text ml-2">
          {{ tokenHydrated.name }}
        </div>
      </template>
      <v-spacer></v-spacer>

      <enmt-badge v-if="!newTokenLoad && tokenHydrated.isENMT"></enmt-badge>

      <v-btn icon @click="$emit('on-close')" color="textFaint">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <div style="height: 380px;">

      <div v-if="newTokenLoad" class="text-center" style="position:absolute;left: 0; right: 0;">
        <v-progress-circular
        indeterminate
        size="120"
        width="2"
        color="#aaa">
          <img 
          src="@/assets/img/UNCX_fill.svg" 
          height="110px"
          class="greyscale"
          width="110px">
        </v-progress-circular>
      </div>

      <v-scroll-x-transition mode="out-in">
        <div v-if="!newTokenLoad" style="height: 100%;">

          <div class="pl-1 d-flex py-1 background">
            <v-btn small rounded text @click="tab = 0" :color="tab === 0 ? 'primary' : 'textFaint'">
              Chart
            </v-btn>
            <v-btn small rounded text @click="tab = 1" :color="tab === 1 ? 'primary' : 'textFaint'">
              Info
            </v-btn>
            <v-btn small rounded text @click="tab = 2" :color="tab === 2 ? 'primary' : 'textFaint'">
              Tknomics
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn small rounded color="textFaint" text :href="`${$settings.AMMS[this.exchange].ammTokenLink}${item.address}`" target="_blank">
              Trade
              <v-icon x-small>mdi-arrow-top-right</v-icon>
            </v-btn>

            <div v-if="!loggedIn" class="text-end mr-6">
              <v-btn text small @click="accountIntercept" rounded color="textFaint">
                <v-icon small class="mr-1">mdi-star-outline</v-icon>
                Watchlist
              </v-btn>
            </div>

            <div v-else class="text-end">
              <v-btn v-if="tokenInWatchlist" small @click="removeFromWatchlist" rounded text color="primary">
                <v-icon small class="mr-1">mdi-star-outline</v-icon>
                Watchlist
              </v-btn>
              <v-btn v-else @click="addToWatchlist" small text rounded color="textFaint">
                <v-icon small class="mr-1">mdi-star-outline</v-icon>
                Watchlist
              </v-btn>
            </div>
          </div>

          <v-scroll-x-transition mode="out-in">
            <div v-if="tab === 0" style="height: 100%;">
              <div v-if="network === 'Kovan'" style="height: 100%;" class="pa-8 d-flex flex-column align-center justify-center textFaint--text">
                <v-icon size="100" color="textFaint">mdi-chart-line</v-icon>
                <div>
                  No charts available for Kovan network
                </div>
              </div>
              <div v-else>
                <v-row dense class="align-end pa-4">
                  <v-col cols="4" class="text-center">
                    <div>
                      <div class="">
                        ${{ fullyDilutedMcap }}
                      </div>
                      <div class="textFaint--text t-small">
                        Fully diluted mcap
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <div>
                      <div class="">
                        ${{ volume24hrHuman }}
                      </div>
                      <div class="textFaint--text t-small">
                        Volume 24hr
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <div>
                      <div class="title">
                        <div :class="[item.change_24 >= 0 ? 'primary--text' : 'pink--text']">
                          ${{ priceHuman }}
                        </div>
                      </div>
                      <div class="textFaint--text t-small">
                        Price
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <lchart :address="mostLiquidPair.address" :tokenAddress="item.address" :exchange="exchange"></lchart>

                <v-row dense class="px-4 mb-2 caption mt-2">
                  <v-col cols="4" class="text-center">
                    <div class="font-weight-regular textFaint--text">
                      30d: 
                      <span :class="['font-weight-bold', item.change_30d >= 0 ? 'primary--text' : 'pink--text']">{{ change30d }}%</span>
                      <v-progress-linear rounded height="4" :value="Math.abs(item.change_30d)" :color="item.change_30d >= 0 ? 'primary' : 'pink'" background-color=""></v-progress-linear>
                    </div>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <div class="font-weight-regular textFaint--text">
                      7d: 
                      <span :class="['font-weight-bold', item.change_7d >= 0 ? 'primary--text' : 'pink--text']">{{ change7d }}%</span>
                      <v-progress-linear rounded height="4" :value="Math.abs(item.change_7d)" :color="item.change_7d >= 0 ? 'primary' : 'pink'" background-color=""></v-progress-linear>
                    </div>
                  </v-col>
                  <v-col cols="4" class="text-center textFaint--text">
                    <div>
                      1d: <span :class="['font-weight-bold', item.change_24 >= 0 ? 'primary--text' : 'pink--text']">{{ change24hr }}%</span>
                      <v-progress-linear rounded height="4" :value="Math.abs(item.change_24)" :color="item.change_24 >= 0 ? 'primary' : 'pink'" background-color=""></v-progress-linear>
                    </div>
                  </v-col>
                </v-row>
              </div>

            </div>

            <div v-else-if="tab === 1">

              <div class="text-center mt-4">
                <v-btn rounded class="green-button white--text" @click="goToTokenPage">
                  <coin-icon :address="tokenHydrated.address" :url="item.icon_url" :network="network" :size="22" class="mr-3"></coin-icon>
                  View Token page
                </v-btn>
              </div>

              <div class="px-4 text-center">
                <copy-address :address="tokenHydrated.address" color="textFaint"></copy-address>
                <v-btn small color="textFaint" text :href="`${$settings.AMMS[this.exchange].ammTokenLink}${tokenHydrated.address}`" target="_blank">
                  {{ exchange }}
                  <v-icon x-small>mdi-arrow-top-right</v-icon>
                </v-btn>
                <v-btn small color="textFaint" text :href="`${$settings.ETHERSCAN_URL[network]}/address/${tokenHydrated.address}`" target="_blank">
                  {{ $settings.EXPLORER_NAME[network] }}
                  <v-icon x-small>mdi-arrow-top-right</v-icon>
                </v-btn>
                <v-btn icon color="textFaint" class="ml-1" :href="`https://twitter.com/search?q=%24${tokenHydrated.symbol}&src=typed_query`" target="_blank">
                  <v-icon>mdi-twitter</v-icon>
                </v-btn>
              </div>

              <div class="textFaint--text text-center mt-2 caption">
                Total Supply: {{ totalSupplyHuman }}
              </div>

              <div class="textFaint--text text-center caption font-italic">
                Decimals {{ item.decimals }}
              </div>

              <div v-if="false" class="textFaint--text caption text-center">
                {{ exchange }} index: {{ item.first_uniswap_index }}
              </div>

              <div style="min-height: 139px;">
                <div v-if="pairs.length > 0">
                  <div class="caption pl-4 textFaint--text text-center mt-2">
                    Most liquid pair
                  </div>
                  <pair-row
                  v-for="item of pairs" 
                  :key="item.address"
                  :exchange="exchange"
                  :item="item"
                  class="border-t v-card br-20 ma-2">
                  </pair-row>
                </div>
                <div v-else class="pa-2">
                  <v-card outlined class="background textFaint--text br-20 pa-4">
                    No pairs on {{ exchange }} for this token yet
                  </v-card>
                </div>
              </div>

            </div>

            <div v-else-if="tab === 2">
              <tokenomics-card v-if="tokenHydrated.address" :tokenHydrated="tokenHydrated" :network="network" class="border-t"></tokenomics-card>
            </div>
          </v-scroll-x-transition>

        </div>
      </v-scroll-x-transition>

    </div>

  </div>
</template>

<script>
import { ethers } from 'ethers'
import ERC20 from '@/smart-contracts/erc20/pager'
import axios from 'axios'
import PairRow from '@/views/pairs/row'
import lchart from '@/views/token/lchart'
import TokenomicsCard from '@/views/locker/erc20/global-token/tokenomics'

export default {
  props: {
  },

  components: {
    PairRow,
    lchart,
    TokenomicsCard
  },

  data: () => ({
    tab: 0,
    live_info: {
      dayData: {}
    },
    pdiff: '0',
    newTokenLoad: true,
    intervalID: null,
    item: {
      address: ''
    },
    pairs: [],
    mostLiquidPair: {},
    exchange: null,
    network: null,
    tokenHydrated: {
      symbol: '',
      name: '',
      decimals: '0',
      totalSupply: '0'
    }
  }),

  computed: {
    loggedIn () {
      return this.$store.state.user.username
    },
    change24hr () {
      var value = this.item.change_24
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 1})
    },
    change7d () {
      var value = this.item.change_7d
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 1})
    },
    change30d () {
      var value = this.item.change_30d
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 1})
    },
    totalSupplyHuman () {
      var tsupply = ethers.utils.formatUnits(this.tokenHydrated.totalSupply, this.tokenHydrated.decimals)
      return Number(tsupply).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})
    },
    volume24hrHumannn () {
      var value = this.item.volume24hr
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})
    },
    volume24hrHuman () {
      var amount = parseInt(this.item.volume24hr)
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
      var st = Math.floor(1 / this.item.price_usd).toString()
      var precision = st.length + 1
      var value = Number(this.item.price_usd)
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: precision})
    },
    fullyDilutedMcappp () {
      var mcap = this.item.price_usd * (this.tokenHydrated.totalSupply / Math.pow(10, this.tokenHydrated.decimals))
      return Number(mcap).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})
    },
    fullyDilutedMcap () {
      var amount = this.item.price_usd * (this.tokenHydrated.totalSupply / Math.pow(10, this.tokenHydrated.decimals))
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
    tokenInWatchlist () {
      var wkeys = Object.keys((this.$store.state.user.watchlist[this.network] || {})[this.exchange] || {})
      return wkeys.includes(String(this.item.id))
      // return this.$store.state.user.watchlistKeys.includes(String(this.item.id))
    }
  },

  methods: {
    addToWatchlist () {
      var data = {id: this.item.id, exchange: this.exchange, network: this.network}
      this.$userAxios.post(`/users/token/add-to-watchlist`, data)
        .then(response => {
          this.$store.commit('updateWatchlist', response.data.watchlist)
        })
        .catch(error => {
          console.log(error.response.data)
        })
    },
    removeFromWatchlist () {
      var data = {id: this.item.id, exchange: this.exchange, network: this.network}
      this.$userAxios.post(`/users/token/remove-from-watchlist`, data)
        .then(response => {
          this.$store.commit('updateWatchlist', response.data.watchlist)
        })
        .catch(error => {
          console.log(error.response.data)
        })
    },
    accountIntercept () {
      this.$root.$dialog.accountInterceptDialog.open()
        .then(response => {
          if (response === 'redirect') {
            this.$emit('on-close')
          }
        })
    },
    // reload is called from another parent component
    reload (token) {
      this.live_info = {
        dayData: {}
      }
      this.pdiff = '0'
      this.fetchLivePrices(token)
    },
    async loadToken (address, network = null, exchange = null) {
      this.network = network || this.$store.state.requiredNetwork
      this.exchange = exchange || this.$store.state.exchange
      if (!this.exchange || this.$settings.AMMS[this.exchange].chain !== this.network) {
        var amms = Object.keys(this.$settings.AMMS).filter(key => this.$settings.AMMS[key].chain === this.network)
        this.exchange = amms[0]
      }
      this.newTokenLoad = true
      this.tokenHydrated = await ERC20.getERC20(address, this.network)
      this.doLoad(address)
        .then(() => {})
        .catch(e => {})
        .then(() => {
          this.newTokenLoad = false
          /* setTimeout(() => {
            this.newTokenLoad = false
          }, 3000) */
        })
      this.fetchLivePrices()
      this.intervalID = setInterval(this.fetchLivePrices, 8000)
    },
    async doLoad (address) {
      this.tab = 0
      var token_response = await axios.get(`${this.$settings.AMMS[this.exchange].server}/erc20/token/${address}`)
      var pair_response = await axios.get(`${this.$settings.AMMS[this.exchange].server}/uniswap/token/${address}/most-liquid-pair`)
      this.item = token_response.data
      this.pairs = pair_response.data.rows
      if (pair_response.data.rows.length > 0) {
        this.mostLiquidPair = pair_response.data.rows[0]
      } else {
        this.mostLiquidPair = {}
      }
    },
    stopRefresher () {
      clearInterval(this.intervalID)
      this.tab = 0
    },
    fetchLivePrices () {
      this.fetchLivePricesRaw()
        .then(() => {

        })
        .catch(e => {})
    },
    goToTokenPage () {
      this.$root.ammLinkTwo(`/token/${this.tokenHydrated.address}`, this.exchange)
      this.$emit('on-close')
    },
    // wrap around this method
    async fetchLivePricesRaw () {
      var itemAddress = this.item.address
      var data = {
        query: `
        {
          tokenDayDatas(first:2, orderBy: date, orderDirection: desc,
            where: {
              token: "${itemAddress.toLowerCase()}"
            }
          ) {
              id
              date
              priceUSD
              dailyTxns
              totalLiquidityUSD
              dailyVolumeUSD
          }
        }
        `
      }
      var info = {}
      var graphExplorer = this.$settings.AMMS[this.exchange].graphExplorer
      var response = await axios.post(graphExplorer , data)
      if (this.item.address !== itemAddress) {
        return
      }
      var dayData = response.data.data.tokenDayDatas[0]
      var yesterday = response.data.data.tokenDayDatas[1]
      var diff = dayData.priceUSD - yesterday.priceUSD
      var pdiff = diff / yesterday.priceUSD * 100
      info.dayData = dayData

      if (itemAddress === this.item.address) {
        this.live_info = info
        this.pdiff = pdiff
        this.item.price_usd = dayData.priceUSD
      } else {
        // console.log('SKIPPING')
      }
    },
  },
}
</script>