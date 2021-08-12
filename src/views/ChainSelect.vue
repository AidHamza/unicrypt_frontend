<template>
  <v-container style="max-width: 600px;">
    
    <v-slide-x-transition appear>
      <div :class="['br-20 mb-16', {'pa-4': $vuetify.breakpoint.xs}, {'pa-6': !$vuetify.breakpoint.xs}]">
        
        <div class="mb-3 title text-center textFaint--text">
          Select Network
        </div>

        <div class="v-card d-flex align-center c-list pa-4 br-20 mb-2" @click="selectChain('Mainnet')">
          <img 
          :src="$settings.CHAINS['Mainnet'].icon" 
          height="40px"
          width="40px"
          class="mr-3">
          <div>
            <div class="title">
              Ethereum mainnet
            </div>
          </div>
        </div>

        <div class="v-card d-flex align-center c-list pa-4 br-20 mb-2" @click="selectChain('BSC_MAINNET')">
          <img 
          :src="$settings.CHAINS['BSC_MAINNET'].icon" 
          height="40px"
          width="40px"
          class="mr-3">
          <div>
            <div class="title">
              Binance Smart Chain
            </div>
          </div>
        </div>

        <div class="v-card d-flex align-center c-list pa-4 br-20 mb-2" @click="selectChain('xDai')">
          <img 
          :src="$settings.CHAINS['xDai'].icon" 
          height="40px"
          width="40px"
          class="mr-3 br-20">
          <div>
            <div class="title">
              xDai
            </div>
          </div>
        </div>

        <div class="v-card d-flex align-center c-list pa-4 br-20 mb-2" @click="selectChain('Matic')">
          <img 
          :src="$settings.CHAINS['Matic'].icon" 
          height="40px"
          width="40px"
          class="mr-3 br-20">
          <div>
            <div class="title">
              Matic
            </div>
          </div>
        </div>

        <div class="textFaint--text pl-2 mt-8">
          Testnets
        </div>

        <div class="v-card d-flex align-center c-list pa-4 br-20 mb-2" @click="selectChain('Kovan')">
          <img 
          src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png" 
          height="40px"
          width="40px"
          class="mr-3">
          <div>
            <div class="title">
              Kovan
            </div>
          </div>
        </div>

        <div class="v-card d-flex align-center c-list pa-4 br-20 mb-2" @click="selectChain('Ganache')">
          <img 
          src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png" 
          height="40px"
          width="40px"
          class="mr-3">
          <div>
            <div class="title">
              Ganache
            </div>
          </div>
        </div>

        <div class="v-card d-flex align-center c-list pa-4 br-20 mb-2" @click="selectChain('Hardhat')">
          <img 
          :src="$settings.CHAINS['Hardhat'].icon" 
          height="40px"
          width="40px"
          class="mr-3 br-20">
          <div>
            <div class="title">
              Hardhat
            </div>
          </div>
        </div>
        
      </div>
    </v-slide-x-transition>
    
  </v-container>
</template>

<script>
export default {

  data: () => ({
  }),

  computed: {
  },

  methods: {
    selectChain (requiredChain) {
      this.$store.commit('switchChain', requiredChain)
      if (this.$route.query.redirect === 'locker') {
        this.$router.push(`${this.$store.state.chainPrefix}/locker`)
      } else if (this.$route.query.redirect === 'minter') {
        this.$router.push(`${this.$store.state.chainPrefix}/minter`)
      } else {
        this.$router.push('/dashboard')
      }
    }
  },

  created () {
  }
}
</script>