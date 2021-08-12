<template>
  <v-dialog v-model="dialog" persistent max-width="450" content-class="br-20">
    <v-card class="br-20">

      <v-card-text>
        
        <v-row class="ma-0 py-4 align-center">
          <div>
            Arbitrage
          </div>
          <v-spacer></v-spacer>
          <v-btn @click="cancel" icon large color="textFaint">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <div v-if="!pairComparator.doneLoading" class="caption my-2 textFaint--text text-center">
          Loading...
        </div>

        <v-expand-transition>
          <div v-show="pairComparator.doneLoading" class="pa-0">

            <div class="d-flex align-center textFaint--text caption font-italic">
              Pancakeswap V1
              <v-spacer></v-spacer>
              <v-progress-circular
              v-if="loading"
              indeterminate
              width="2"
              class="mr-2"
              size="12"
              color="text"
              ></v-progress-circular>
            </div>
            <div class="d-flex align-center">
              <div class="d-flex align-center border pr-3 background br-20">
                <coin-icon :address="sortedToken0.address" class="mr-2"></coin-icon>
                1 {{ sortedToken0.symbol }}
              </div>
              <div class="mx-2">
                =
              </div>
              <div class="d-flex align-center border pr-3 background br-20">
                <coin-icon :address="sortedToken1.address" class="mr-2"></coin-icon>
                {{ sortedV1Price }} {{ sortedToken1.symbol }}
              </div>
            </div>

            <div class="textFaint--text caption font-italic mt-3">
              Pancakeswap V2
            </div>
            <template v-if="pairComparator.v2PairExists === 1">
              <div class="d-flex align-center">
                <div class="d-flex align-center border pr-3 background br-20">
                  <coin-icon :address="sortedToken0.address" class="mr-2"></coin-icon>
                  1 {{ sortedToken0.symbol }}
                </div>
                <div class="mx-2">
                  =
                </div>
                <div class="d-flex align-center border pr-3 background br-20">
                  <coin-icon :address="sortedToken1.address" class="mr-2"></coin-icon>
                  {{ sortedV2Price }} {{ sortedToken1.symbol }}
                </div>
              </div>

              <!-- POOLS -->
              <div class="border br-20 pa-2 mt-2">
                <div class="caption font-italic textFaint--text">
                  V1 Pool
                </div>
                <div class="d-flex align-center">
                  <coin-icon :address="tokens.token0.address" class="mr-2"></coin-icon>
                  {{ $root.formatAmount(reservesV1.reserve0, tokens.token0.decimals) }}
                </div>
                <div class="d-flex align-center">
                  <coin-icon :address="tokens.token1.address" class="mr-2"></coin-icon>
                  {{ $root.formatAmount(reservesV1.reserve1, tokens.token1.decimals) }}
                </div>
              </div>

              <div class="border br-20 pa-2 mt-2">
                <div class="caption font-italic textFaint--text">
                  V2 Pool
                </div>
                <div class="d-flex align-center">
                  <coin-icon :address="tokens.token0.address" class="mr-2"></coin-icon>
                  {{ $root.formatAmount(reservesV2.reserve0, tokens.token0.decimals) }}
                </div>
                <div class="d-flex align-center">
                  <coin-icon :address="tokens.token1.address" class="mr-2"></coin-icon>
                  {{ $root.formatAmount(reservesV2.reserve1, tokens.token1.decimals) }}
                </div>
              </div>
              <!-- POOLS -->

              <div class="text-center mt-3">
                <strong :class="pairComparator.priceDiff > 4.5 ? 'orange--text' : ''">{{ pairComparator.priceDiff }}%</strong>
                <div class="textFaint--text caption font-italic">
                  Price Difference
                </div>
              </div>
              <div v-if="pairComparator.priceDiff > 4.5" class="py-2 caption orange--text font-italic">
                There is a high price difference between these two pairs. Arbitrage opportunities may exist 
                if this token does not burn a large % on transfer.
              </div>
            </template>
            <div v-else class="caption primary--text">
              <v-icon small color="primary">mdi-check-circle-outline</v-icon>
              No Pair on Pancakeswap V2
            </div>

          </div>
        </v-expand-transition>

        <!--
        <div>
          {{ amount }}
        </div>
        -->

      </v-card-text>

    </v-card>
  </v-dialog>
</template>

<script>
import { ethers } from 'ethers'
import V2PAIR from '@/smart-contracts/uniswap/v2-pair'
import V2FACTORY from '@/smart-contracts/uniswap/uniswap-factory-contract'
import ERC20 from '@/smart-contracts/erc20'

export default {
  components: {
  },
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    amount: '0',
    amountHuman: '0',
    loading: false,
    withdrawLoading: false,
    tokens: {
      token0: {},
      token1: {}
    },
    reservesV1: {},
    reservesV2: {},
    pairComparator: {
      v2PairExists: -1, // loading
      price_v1_token0: '0',
      price_v1_token1: '0',
      price_v2_token0: '0',
      price_v2_token1: '0',
      priceDiff: 0,
      doneLoading: false
    },
    lastSync: 0,
    network: null
  }),

  computed: {
    cNetwork () {
      return this.network || this.$store.state.requiredNetwork
    },
    blockNumber () {
      return this.$store.state.blockNumber
    },
    sortedToken0 () {
      return this.higherValueToken === 0 ? this.tokens.token0 : this.tokens.token1
    },
    sortedToken1 () {
      return this.higherValueToken === 0 ? this.tokens.token1 : this.tokens.token0
    },
    sortedV1Price () {
      if (!this.pairComparator.doneLoading) {
        return 0
      }
      var price = this.higherValueToken === 0 ? this.pairComparator.price_v1_token1 : this.pairComparator.price_v1_token0
      return this.$root.formatAmount(price, this.higherValueToken === 0 ? this.tokens.token1.decimals : this.tokens.token0.decimals)
    },
    sortedV2Price () {
      if (!this.pairComparator.doneLoading) {
        return 0
      }
      var price = this.higherValueToken === 0 ? this.pairComparator.price_v2_token1 : this.pairComparator.price_v2_token0
      return this.$root.formatAmount(price, this.higherValueToken === 0 ? this.tokens.token1.decimals : this.tokens.token0.decimals)
    },
    higherValueToken () {
      if (!this.pairComparator.doneLoading) {
        return 0
      }
      return ethers.BigNumber.from(this.pairComparator.price_v1_token0).div(ethers.BigNumber.from(10).pow(this.tokens.token0.decimals)).gt(1) ? 1 : 0
    },
    sEthers () {
      return this.$store.state.ethers
    },
  },

  watch: {
    blockNumber () {
      var now = Math.round(new Date() / 1000)
      var elapsed = now - this.lastSync
      // console.log('elapsed: ' + elapsed)
      if (elapsed >= 8) {
        this.lastSync = now
        this.refresh()
      } else {
        // console.log('skipping')
      }
    }
  },

  methods: {
    async open (token0Address, token1Address, network = null) {
      this.network = network
      this.pairComparator = {
        v2PairExists: -1, // loading
        price_v1_token0: '0',
        price_v1_token1: '0',
        price_v2_token0: '0',
        price_v2_token1: '0',
        priceDiff: 0,
        doneLoading: false
      }
      this.dialog = true
      this.tokens.token0 = await ERC20.getERC20(token0Address, this.cNetwork)
      this.tokens.token1 = await ERC20.getERC20(token1Address, this.cNetwork)
      this.refresh()
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel () {
      this.reject()
      this.dialog = false
      this.pairComparator.doneLoading = false
    },
    async refresh () {
      if (!this.dialog) {
        return
      }
      this.loading = true
      var pancakeV1PairAddress = await V2FACTORY.getPair(this.tokens.token0.address, this.tokens.token1.address, '0xBCfCcbde45cE874adCB698cC183deBcF17952812', this.cNetwork)
      this.reservesV1 = await V2PAIR.getReserves(pancakeV1PairAddress, this.cNetwork)

      var v2PairAddress = await V2FACTORY.getPair(this.tokens.token0.address, this.tokens.token1.address, '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73', this.cNetwork)
      this.pairComparator.v2PairExists = v2PairAddress === ethers.constants.AddressZero ? 0 : 1
      
      this.pairComparator.price_v1_token0 = ethers.BigNumber.from(ethers.BigNumber.from(10).pow(this.tokens.token1.decimals)).mul(this.reservesV1.reserve0).div(this.reservesV1.reserve1)
      this.pairComparator.price_v1_token1 = ethers.BigNumber.from(ethers.BigNumber.from(10).pow(this.tokens.token0.decimals)).mul(this.reservesV1.reserve1).div(this.reservesV1.reserve0)
      
      if (this.pairComparator.v2PairExists) {
        this.reservesV2 = await V2PAIR.getReserves(v2PairAddress, this.cNetwork)
        
        this.pairComparator.price_v2_token0 = ethers.BigNumber.from(ethers.BigNumber.from(10).pow(this.tokens.token1.decimals)).mul(this.reservesV2.reserve0).div(this.reservesV2.reserve1)
        this.pairComparator.price_v2_token1 = ethers.BigNumber.from(ethers.BigNumber.from(10).pow(this.tokens.token0.decimals)).mul(this.reservesV2.reserve1).div(this.reservesV2.reserve0)

        var priceDifference
        if (this.pairComparator.price_v1_token0.gte(this.pairComparator.price_v2_token0)) {
          priceDifference = this.pairComparator.price_v1_token0.sub(this.pairComparator.price_v2_token0)
          priceDifference = priceDifference.mul(10000).div(this.pairComparator.price_v2_token0).toString()
        } else {
          priceDifference = this.pairComparator.price_v2_token0.sub(this.pairComparator.price_v1_token0)
          priceDifference = priceDifference.mul(10000).div(this.pairComparator.price_v1_token0).toString()
        }
        this.pairComparator.priceDiff = Number(priceDifference / 100)
      }
      this.pairComparator.doneLoading = true
      this.loading = false
    },
    onHumanAmountChange (val) {
      this.amount = ethers.utils.parseUnits(val, 18)
    },
  },

  created () {
  }
}
</script>