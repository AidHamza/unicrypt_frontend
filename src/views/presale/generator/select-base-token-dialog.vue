<template>
  <v-dialog v-model="dialog" persistent max-width="450" content-class="br-20">
    <v-card class="br-20">
      <div>
        <v-row class="pa-4 ma-0 font-weight-medium background align-center">
          Select a token
          <v-spacer></v-spacer>
          
          <v-btn @click="close" icon color="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <!-- Main content -->
        <div class="py-2">
          
          <div v-if="false" class="pa-4">
            <div class="mt-4">
              Enter a token address
            </div>

            <div class="mt-2 d-flex align-center pa-3 r-outlined br-20 inputcolor">
              <c-input :value.sync="tokenAddress" placeholder="Token address...">
              </c-input>

              <v-progress-circular
              v-if="loadingToken"
              indeterminate
              width="2"
              class="mr-2"
              size="24"
              color="primary"
              ></v-progress-circular>
            </div>
          </div>

          <token-row v-for="item in coinList" :key="item.address" :item="item" @click.native="selectToken(item)">
          </token-row>

        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import TokenRow from './select-base-token-row'
import ERC20 from '@/smart-contracts/erc20'
import { ethers } from 'ethers'

export default {
  components: {
    TokenRow
  },

  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    tokenAddress: '',
    tokenHydrated: {},
    loadingToken: false,
    defaultList: []
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    coinList () {
      if (this.tokenHydrated.address) {
        return [this.tokenHydrated]
      }
      return this.defaultList
    }
  },

  watch: {
    tokenAddress (nv) {
      try {
        ethers.utils.getAddress(nv)
      } catch (e) {
        this.tokenHydrated = {}
        return false
      }
      this.loadTokenInfo(nv)
    }
  },

  methods: {
    open () {
      this.dialog = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    selectToken (item) {
      this.resolve(item)
      this.dialog = false
    },
    close () {
      this.dialog = false
      this.reject()
    },
    async loadTokenInfo (address) {
      this.loadingToken = true
      await ERC20.getERC20(address)
        .then(token => {
          this.tokenHydrated = token
        })
        .catch (e => {})
        .then(() => {
          this.loadingToken = false
        })
    },
  },

  created () {
    var lists = {
      'Mainnet': [
        {
          name: 'Ethereum',
          symbol: 'ETH',
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          decimals: 18
        },
        {
          name: 'DAI',
          symbol: 'DAI',
          address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18
        },
        {
          name: 'Wrapped BTC',
          symbol: 'WBTC',
          address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
          decimals: 8
        },
        {
          name: 'USDC',
          symbol: 'USDC',
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 6
        }
      ],
      'Kovan': [
        {
          name: 'Ethereum',
          symbol: 'ETH',
          address: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
          decimals: 18
        },
        {
          name: 'DAI',
          symbol: 'DAI',
          address: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
          decimals: 18
        }
      ],
      'xDai': [
        {
          name: 'xDai',
          symbol: 'xDai',
          address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
          decimals: 18
        },
        {
          name: 'Unicrypt on xDai',
          symbol: 'UNCX',
          address: '0x0116e28B43A358162B96f70B4De14C98A4465f25',
          decimals: 18
        },
        {
          name: 'Honey',
          symbol: 'HNY',
          address: '0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9',
          decimals: 18
        }
      ],
      'BSC_MAINNET': [
        {
          name: 'Wrapped BNB',
          symbol: 'WBNB',
          address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
          decimals: 18
        },
        {
          name: 'UniCrypt on xDai on BSC',
          symbol: 'UNCX',
          address: '0x09a6c44c3947B69E2B45F4D51b67E6a39ACfB506',
          decimals: 18
        },
        {
          name: 'BUSD Token',
          symbol: 'BUSD',
          address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
          decimals: 18
        },
        {
          name: 'Ethereum Token',
          symbol: 'ETH',
          address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
          decimals: 18
        }
      ],
      'Matic': [
        {
          name: 'Wrapped Matic',
          symbol: 'WMATIC',
          address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
          decimals: 18
        },
        {
          name: 'Wrapped Ether',
          symbol: 'WETH',
          address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          decimals: 18
        },
        {
          name: 'USD Coin (PoS)',
          symbol: 'USDC',
          address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 6
        }
      ],
    }
    this.defaultList = lists[this.$store.state.requiredNetwork]
  }
}
</script>