<template>
  <v-btn small rounded outlined @click="$root.tokenPage.open(address)" class="pl-1 font-weight-medium textFaint--text">
    <coin-icon :address="address" :url="icon" class="mr-2" :size="20"></coin-icon>

    <v-progress-circular
    v-if="firstLoad"
    indeterminate
    size="16"
    width="1"
    color="textFaint">
    </v-progress-circular>

    <template v-else>
      ${{ priceHuman }}
      <v-icon x-small color="textFaint">mdi-chevron-up</v-icon>
    </template>
  </v-btn>
</template>

<script>
// import ERC20 from '@/smart-contracts/erc20'
import axios from 'axios'

export default {
  props: {
    address: {
      type: String
    },
    icon: {
      type: String
    }
  },

  data: () => ({
    live_info: {
      total_supply: '0',
      dayData: {}
    },
    pdiff: '0',
    loadingLiveData: false,
    firstLoad: true,
    newTokenLoad: true,
    intervalID: null,
    item: {
      price_usd: ''
    },
  }),

  computed: {
    priceHuman () {
      var value = Number(this.item.price_usd)
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

  methods: {
    fetchLivePrices () {
      // console.log('fetching')
      this.loadingLiveData = true
      this.fetchLivePricesRaw()
        .then(() => {

        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.loadingLiveData = false
          this.firstLoad = false
        })
    },
    async fetchLivePricesRaw () {
      var itemAddress = this.address
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
      var response = await axios.post(this.$store.state.graphExplorer , data)
      var dayData = response.data.data.tokenDayDatas[0]
      if (response.data.data.tokenDayDatas.length > 1) {
        var yesterday = response.data.data.tokenDayDatas[1]
        var diff = dayData.priceUSD - yesterday.priceUSD
        var pdiff = diff / yesterday.priceUSD * 100
        this.pdiff = pdiff
      }
      this.item.price_usd = dayData.priceUSD
      info.dayData = dayData

      /* var erc20 = await ERC20.getERC20(itemAddress)
      info.total_supply = erc20.totalSupply
      this.live_info = info
      this.item.total_supply = erc20.totalSupply */
    },
  },

  created () {
    this.fetchLivePrices()
    this.intervalID = setInterval(this.fetchLivePrices, 8000)
  },

  destroyed () {
    // console.log('destroyed')
    clearInterval(this.intervalID)
  },

  activated () {
    // console.log('activated')
    this.intervalID = setInterval(this.fetchLivePrices, 8000)
  },
  deactivated () {
    // console.log('deactivated')
    clearInterval(this.intervalID)
  }
}
</script>