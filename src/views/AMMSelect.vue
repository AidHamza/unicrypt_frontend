<template>
  <v-container style="max-width: 600px;">
    
    <v-slide-y-transition appear>
    <div :class="['mb-16', {'': $vuetify.breakpoint.xs}, {'v-card br-20 foreground': !$vuetify.breakpoint.xs}]">
      
      <!--
      <div class="title text-center mb-1">
        UNICRYPT
      </div>
      <div class="textFaint--text text-center mb-6">
        Cross chain decentralised protocols
      </div>

      <v-card class="v-card d-flex align-center pa-4 br-20 mb-6 blocks" to="/dashboard">
        <v-icon color="white" size="40" class="mr-3">
          mdi-fire
        </v-icon>
        <div>
          <div class="title white--text">
            Whats trending?
          </div>
          <div class="caption white--text">
            ILOs and Liquidity locks across all AMMS
          </div>
        </div>
      </v-card>
      -->
      
      <div class="py-6 title text-center textFaint--text">
        Select an exchange
      </div>

      <div class="d-flex align-center c-list pa-4 border-b" @click="selectExchange('Uniswap V2')">
        <img 
        :src="getExchangeIcon('Uniswap V2')" 
        height="40px"
        width="40px"
        class="mr-3">
        <div>
          <div class="title">
            Uniswap V2
          </div>
          <div class="caption textFaint--text">
            Ethereum Mainnet
          </div>
        </div>
      </div>

      <div class="d-flex align-center c-list pa-4 border-b" @click="selectExchange('Sushiswap V1')">
        <img 
        :src="getExchangeIcon('Sushiswap V1')" 
        height="40px"
        width="40px"
        class="mr-3 br-20">
        <div>
          <div class="title">
            Sushiswap
          </div>
          <div class="caption textFaint--text">
            Ethereum Mainnet
          </div>
        </div>
      </div>

      <div class="d-flex align-center c-list pa-4 border-b" @click="selectExchange('Pancakeswap V2')">
        <img 
        :src="getExchangeIcon('Pancakeswap V2')" 
        height="40px"
        width="40px"
        class="mr-3 br-20">
        <div>
          <div class="title">
            Pancakeswap V2
          </div>
          <div class="caption textFaint--text">
            Binance Smart Chain
          </div>
        </div>
      </div>

      <div class="d-flex align-center c-list pa-4 border-b" @click="selectExchange('Pancakeswap V1')">
        <img 
        :src="getExchangeIcon('Pancakeswap V1')" 
        height="40px"
        width="40px"
        class="mr-3 br-20 greyscale">
        <div>
          <div class="title">
            Pancakeswap V1
          </div>
          <div class="caption textFaint--text">
            Binance Smart Chain
          </div>
        </div>
      </div>

      <div class="d-flex align-center c-list pa-4 border-b" @click="selectExchange('Quickswap V1')">
        <img 
        :src="getExchangeIcon('Quickswap V1')" 
        height="40px"
        width="40px"
        class="mr-3 br-20">
        <div>
          <div class="title">
            Quickswap
          </div>
          <div class="caption textFaint--text">
            Matic chain
          </div>
        </div>
      </div>

      <div class="d-flex align-center c-list pa-4 border-b" @click="selectExchange('Julswap V1')">
        <img 
        :src="getExchangeIcon('Julswap V1')" 
        height="40px"
        width="40px"
        class="mr-3 br-20">
        <div>
          <div class="title">
            Julswap
          </div>
          <div class="caption textFaint--text">
            Binance Smart Chain
          </div>
        </div>
      </div>

      <div class="d-flex align-center c-list pa-4 border-b" @click="selectExchange('Honeyswap V1')">
        <img 
        :src="getExchangeIcon('Honeyswap V1')" 
        height="40px"
        width="40px"
        class="mr-3">
        <div>
          <div class="title">
            Honeyswap
          </div>
          <div class="caption textFaint--text">
            xDai chain
          </div>
        </div>
      </div>

      <div class="textFaint--text py-2 background text-center">
        Testnets
      </div>

      <div class="d-flex align-center c-list pa-4" @click="selectExchange('Uniswap V2 - Kovan')">
        <img 
        :src="getExchangeIcon('Uniswap V2 - Kovan')" 
        height="40px"
        width="40px"
        class="mr-3 greyscale">
        <div>
          <div class="title">
            Uniswap V2 - Kovan
          </div>
          <div class="caption textFaint--text">
            Kovan Testnet
          </div>
        </div>
      </div>
      
    </div>
    </v-slide-y-transition>
    
  </v-container>
</template>

<script>
import SETTINGS from '@/store/settings'

export default {

  data: () => ({
  }),

  computed: {
  },

  methods: {
    getExchangeIcon (exchange) {
      return SETTINGS.AMMS[exchange].icon
    },
    selectExchange (exchange) {
      this.$store.commit('switchExchange', exchange)
      this.$root.ammLink(`/pairs`)
    }
  },

  created () {
  }
}
</script>