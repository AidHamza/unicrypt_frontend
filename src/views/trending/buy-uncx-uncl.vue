<template>
  <div>

    <div class="d-flex border-b foreground border mb-2 br-20" style="overflow: hidden;">
      <div :class="['d-flex align-center flex pa-3 c-list top-tab', {'background': tab === 0}]" @click="tab = 0">
        <img 
        src="@/assets/img/UNCX_fill.svg" 
        height="30px"
        width="30px"
        class="mr-1">
        UNCX
        <span class="ml-2 primary--text font-weight-medium">${{ Number(uncx.priceUSD).toFixed(2) }} </span>
      </div>
      <div :class="['d-flex align-center flex pa-3 c-list top-tab', {'background': tab === 1}]" @click="tab = 1">
        <img 
        src="@/assets/img/UNCL.svg" 
        height="30px"
        width="30px"
        class="mr-1">
        UNCL
        <span class="ml-2 primary--text font-weight-medium">${{ Number(uncl.priceUSD).toFixed(2) }} </span>
      </div>
    </div>

    <!--
    <div class="v-card br-20 mb-4">

      <div v-if="tab === 0">
        <div class="text-center">
          <div class="title mb-2 text-center font-weight-bold pt-2">
            Buy UNCX on
          </div>
          <div>
            <v-btn rounded outlined small color="textFaint">
              Pancakeswap
            </v-btn>
            <v-btn rounded outlined small color="textFaint">
              Uniswap
            </v-btn>
            <v-btn rounded outlined small color="textFaint">
              Honeyswap
            </v-btn>
          </div>
          <v-btn small outlined rounded>
            UNCX Utility
          </v-btn>
        </div>
        <lchart address="0xC70bB2736e218861DCa818d1e9f7A1930Fe61E5b" tokenAddress="0xaDB2437e6F65682B85F814fBc12FeC0508A7B1D0" exchange="Uniswap V2" :key="1"></lchart>
      </div>

      <div v-if="tab === 1">
        <div class="text-center">
          <div class="title mb-2 text-center font-weight-bold pt-2">
            Buy UNCL on
          </div>
          <div>
            <v-btn rounded outlined small color="textFaint">
              Pancakeswap
            </v-btn>
            <v-btn rounded outlined small color="textFaint">
              Uniswap
            </v-btn>
            <v-btn rounded outlined small color="textFaint">
              Honeyswap
            </v-btn>
          </div>
          <v-btn small outlined rounded>
            UNCX Utility
          </v-btn>
        </div>
        <lchart address="0x43FdbEE01A1f6698766a51A69D4A849eC09CBe81" tokenAddress="0x2f4eb47A1b1F4488C71fc10e39a4aa56AF33Dd49" exchange="Uniswap V2" :key="2"></lchart>
      </div>
    </div>
    -->

    <div class="v-card pa-3 br-20 mb-4" v-if="tab === 0" key="uncxTab">

      <div class="d-flex align-center">
        <img 
        src="@/assets/img/UNCX_fill.svg" 
        :height="imageSize"
        :width="imageSize">
        <div class="ml-3 flex">

          <div class="title ml-4">
            Buy UNCX on
          </div>
          <div>
            <v-btn rounded outlined small color="textFaint" 
            href="https://exchange.pancakeswap.finance/#/swap?inputCurrency=0x09a6c44c3947B69E2B45F4D51b67E6a39ACfB506" target="_blank">
              <img 
              :src="$root.$settings.AMMS['Pancakeswap V2'].icon" 
              height="20px"
              width="20px"
              class="mr-1">
              Pancakeswap
            </v-btn>
            <v-btn rounded outlined small color="textFaint"
            href="https://app.uniswap.org/#/swap?inputCurrency=0xadb2437e6f65682b85f814fbc12fec0508a7b1d0" target="_blank">
              <img 
              :src="$root.$settings.AMMS['Uniswap V2'].icon" 
              height="20px"
              width="20px"
              class="mr-1">
              Uniswap
            </v-btn>
          </div>

          <div v-if="false" class="d-flex align-center justify-center">
            <span class="primary--text">${{ Number(uncx.priceUSD).toFixed(2) }} </span>
            <span :class="['caption ml-2', {'primary--text': uncx.pdiff >= 0}, {'orange--text': uncx.pdiff < 0}]">({{ Number(uncx.pdiff).toFixed(2) }}%)</span>
          </div>

        </div>
      </div>
      
      <lchart address="0xC70bB2736e218861DCa818d1e9f7A1930Fe61E5b" tokenAddress="0xaDB2437e6F65682B85F814fBc12FeC0508A7B1D0" exchange="Uniswap V2"></lchart>
    </div>

    <div class="v-card pa-3 br-20 mb-4" v-if="tab === 1">

      <div class="d-flex align-center">
        <img 
        src="@/assets/img/UNCL.svg" 
        :height="imageSize"
        :width="imageSize">
        <div class="ml-3 flex">

          <div class="title ml-4">
            Buy UNCL on
          </div>
          <div>
            <v-btn rounded outlined small color="textFaint"
            href="https://exchange.pancakeswap.finance/#/swap?inputCurrency=0x0E8D5504bF54D9E44260f8d153EcD5412130CaBb" target="_blank">
              <img 
              :src="$root.$settings.AMMS['Pancakeswap V2'].icon" 
              height="20px"
              width="20px"
              class="mr-1">
              Pancakeswap
            </v-btn>
            <v-btn rounded outlined small color="textFaint"
            href="https://app.uniswap.org/#/swap?inputCurrency=0x2f4eb47a1b1f4488c71fc10e39a4aa56af33dd49" target="_blank">
              <img 
              :src="$root.$settings.AMMS['Uniswap V2'].icon" 
              height="20px"
              width="20px"
              class="mr-1">
              Uniswap
            </v-btn>
          </div>

          <div v-if="false" class="d-flex align-center justify-center">
            <span class="primary--text">${{ Number(uncl.priceUSD).toFixed(2) }} </span>
            <span :class="['caption ml-2', {'primary--text': uncl.pdiff >= 0}, {'orange--text': uncl.pdiff < 0}]">({{ Number(uncl.pdiff).toFixed(2) }}%)</span>
          </div>

        </div>
      </div>
      
      <lchart address="0x43FdbEE01A1f6698766a51A69D4A849eC09CBe81" tokenAddress="0x2f4eb47A1b1F4488C71fc10e39a4aa56AF33Dd49" exchange="Uniswap V2"></lchart>
    </div>

  </div>
</template>

<script>
import lchart from '@/views/token/lchart'
import axios from 'axios'

export default {
  props: {
  },

  components: {
    lchart
  },

  data: () => ({
    tab: 0,
    uncx: {
      priceUSD: null,
      pdiff: null
    },
    uncl: {
      priceUSD: null,
      pdiff: null
    },
    intervalID: null,
  }),

  computed: {
    imageSize () {
      return this.$vuetify.breakpoint.xs ? '50px' : '100px'
    }
  },

  methods: {
    async fetchLivePricesRaw (itemAddress, dataObject) {
      console.log('fetching prices')
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
      var response = await axios.post(this.$settings.AMMS['Uniswap V2'].graphExplorer , data)
      var dayData = response.data.data.tokenDayDatas[0]
      if (response.data.data.tokenDayDatas.length > 1) {
        var yesterday = response.data.data.tokenDayDatas[1]
        var diff = dayData.priceUSD - yesterday.priceUSD
        dataObject.pdiff = diff / yesterday.priceUSD * 100
      }
      dataObject.priceUSD = dayData.priceUSD
    },

    fetchLivePrices () {
      this.fetchLivePricesRaw('0xaDB2437e6F65682B85F814fBc12FeC0508A7B1D0', this.uncx)
      this.fetchLivePricesRaw('0x2f4eb47A1b1F4488C71fc10e39a4aa56AF33Dd49', this.uncl)
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
}

</script>
