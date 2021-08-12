<template>
  <img 
  :src="srcUrl" 
  :height="`${size}px`"
  :width="`${size}px`"
  @error="setAltImg"
  style="border-radius: 500px;">
</template>

<script>
export default {
  props: {
    address: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 30
    },
    url: {
      type: String,
      default: null
    },
    network: null
  },

  data: () => ({
    coinMap: {
      'Matic': {
        '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png',
        '0x831753DD7087CaC61aB5644b308642cc1c33Dc13': 'https://raw.githubusercontent.com/sameepsi/quickswap-interface/master/public/favicon.jpeg',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
        '0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7': 'https://etherscan.io/token/images/AavegotchiGHST_32.png',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
        '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
        '0xC3Ec80343D2bae2F8E680FDADDe7C17E71E114ea': 'https://etherscan.io/token/images/mantradao_32.png',
        '0x9719d867A500Ef117cC201206B8ab51e794d3F82': 'https://aavegotchi.com/images/matokens/maUSDC.svg',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      'xDai': {
        '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d': 'https://raw.githubusercontent.com/1Hive/default-token-list/master/src/assets/xdai/0xe91d153e0b41518a2ce8dd3d7944fa863463a97d/logo.png',
        '0x3a97704a1b25F08aa230ae53B352e2e72ef52843': 'https://raw.githubusercontent.com/1Hive/default-token-list/master/src/assets/xdai/0x3a97704a1b25f08aa230ae53b352e2e72ef52843/logo.png',
        '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
        '0x0116e28B43A358162B96f70B4De14C98A4465f25': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xaDB2437e6F65682B85F814fBc12FeC0508A7B1D0/logo.png',
        '0x703120F2f2011a0D03A03a531Ac0e84e81F15989': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2f4eb47A1b1F4488C71fc10e39a4aa56AF33Dd49/logo.png',
      },
      'BSC_MAINNET': {
        '0x09a6c44c3947B69E2B45F4D51b67E6a39ACfB506': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xaDB2437e6F65682B85F814fBc12FeC0508A7B1D0/logo.png',
        '0x0E8D5504bF54D9E44260f8d153EcD5412130CaBb': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2f4eb47A1b1F4488C71fc10e39a4aa56AF33Dd49/logo.png',
      }
    }
  }),

  computed: {
    srcUrl () {
      var network = this.network || this.$store.state.requiredNetwork
      if (network === 'BSC_MAINNET') {
        return this.url ? this.url : `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${this.address}/logo.png`
      } else if (network === 'xDai') {
        return this.url ? this.url : `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/xdai/assets/${this.address}/logo.png`
      } else if (network === 'Matic') {
        return this.url ? this.url : `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${this.address}/logo.png`
      }
      return this.url ? this.url : `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${this.address}/logo.png`
    }
  },

  methods: {
    setAltImg (event) {
      var network = this.network || this.$store.state.requiredNetwork
      var override_icon = (this.coinMap[network] || {})[this.address]
      if (override_icon) {
        event.target.src = override_icon
      } else {
        event.target.src = require('@/assets/img/no-icon.png')
      }
    }
  }
}
</script>