<template>
  <v-dialog v-model="dialog" persistent max-width="450" content-class="br-20">
    <v-card class="br-20">

      <v-card-text>
        
        <v-row class="ma-0 py-4 align-center">
          <div>
            Migrate Liquidity {{ ammMigrateTo }}
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

            <v-btn class="mb-5 white--text" block depressed color="orange" rounded href="https://docs.unicrypt.network/liquidity-lockers/migration-of-pancakeswap-liquidity-from-v1-to-v2" target="_blank">
              README: Migration documentation
            </v-btn>

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
                  <coin-icon :address="unipair.token0.address" class="mr-2"></coin-icon>
                  {{ $root.formatAmount(reservesV1.reserve0, unipair.token0.decimals) }}
                </div>
                <div class="d-flex align-center">
                  <coin-icon :address="unipair.token1.address" class="mr-2"></coin-icon>
                  {{ $root.formatAmount(reservesV1.reserve1, unipair.token1.decimals) }}
                </div>
              </div>

              <div class="border br-20 pa-2 mt-2">
                <div class="caption font-italic textFaint--text">
                  V2 Pool
                </div>
                <div class="d-flex align-center">
                  <coin-icon :address="unipair.token0.address" class="mr-2"></coin-icon>
                  {{ $root.formatAmount(reservesV2.reserve0, unipair.token0.decimals) }}
                </div>
                <div class="d-flex align-center">
                  <coin-icon :address="unipair.token1.address" class="mr-2"></coin-icon>
                  {{ $root.formatAmount(reservesV2.reserve1, unipair.token1.decimals) }}
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
                There is a high price difference between the two pairs. Migration may fail. 
                Try to balance the pairs before migration. Recommended price difference is 5% Max
              </div>
            </template>
            <div v-else class="caption primary--text">
              <v-icon small color="primary">mdi-check-circle-outline</v-icon>
              No Pair on Pancakeswap V2
            </div>

          </div>
        </v-expand-transition>

        <div  class="pa-1">

          <template>
            <div class="pa-1 align-center flex-nowrap inputcolor r-outlined">
              <div class="caption text-end mr-3 pt-2">
                Migrateable: {{ withdrawableBalanceHuman }}
              </div>
              <div class="d-flex align-center">
                <c-input :value.sync="amountHuman" placeholder="0.0" @updateWhileFocussed="onHumanAmountChange" class="pa-2 title font-weight-bold">
                </c-input>
                <v-btn small outlined rounded @click="setMax" class="mr-2 grad-green white--text">
                  MAX
                </v-btn>
              </div>
            </div>
          </template>

        </div>

        <!--
        <div>
          {{ amount }}
        </div>
        -->

      </v-card-text>

      <div class="caption pa-4 font-italic textFaint--text">
        Any dust amounts of either of the tokens (up to 5% slippage) that does not fit into the new liquidity pool is sent to your wallet.
      </div>

      <div class="text-center mb-3">
        Migration Fee: 1%
      </div>

      <v-row dense class="ma-2">
        <v-btn x-large rounded block depressed @click="migrate" color="primary" class="white--text grad-green" :loading="withdrawLoading">
          Migrate
          <v-icon class="ml-2">mdi-arrow-right</v-icon>
        </v-btn>
      </v-row>

    </v-card>
  </v-dialog>
</template>

<script>
import { ethers } from 'ethers'
import CInput from '@/components/ui/input'
import TxWrapper from '@/smart-contracts/tx-wrapper'
import LockerContract from '@/smart-contracts/lock-uni-v2/univ2-contract'
import V2PAIR from '@/smart-contracts/uniswap/v2-pair'
import V2FACTORY from '@/smart-contracts/uniswap/uniswap-factory-contract'

export default {
  components: {
    CInput
  },
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    amount: '0',
    amountHuman: '0',
    loading: false,
    withdrawLoading: false,
    lock: {
      amount: '0'
    },
    unipair: {
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
    lastSync: 0
  }),

  computed: {
    blockNumber () {
      return this.$store.state.blockNumber
    },
    sortedToken0 () {
      return this.higherValueToken === 0 ? this.unipair.token0 : this.unipair.token1
    },
    sortedToken1 () {
      return this.higherValueToken === 0 ? this.unipair.token1 : this.unipair.token0
    },
    sortedV1Price () {
      if (!this.pairComparator.doneLoading) {
        return 0
      }
      var price = this.higherValueToken === 0 ? this.pairComparator.price_v1_token1 : this.pairComparator.price_v1_token0
      return this.$root.formatAmount(price, this.higherValueToken === 0 ? this.unipair.token1.decimals : this.unipair.token0.decimals)
    },
    sortedV2Price () {
      if (!this.pairComparator.doneLoading) {
        return 0
      }
      var price = this.higherValueToken === 0 ? this.pairComparator.price_v2_token1 : this.pairComparator.price_v2_token0
      return this.$root.formatAmount(price, this.higherValueToken === 0 ? this.unipair.token1.decimals : this.unipair.token0.decimals)
    },
    higherValueToken () {
      if (!this.pairComparator.doneLoading) {
        return 0
      }
      return ethers.BigNumber.from(this.pairComparator.price_v1_token0).div(ethers.BigNumber.from(10).pow(this.unipair.token0.decimals)).gt(1) ? 1 : 0
    },
    ammMigrateTo () {
      if (this.$store.state.exchange === 'Pancakeswap V1') {
        return 'V1 -> V2'
      }
      return '?'
    },
    sEthers () {
      return this.$store.state.ethers
    },
    withdrawableBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.lock.amount, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
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
    open (lock, unipair) {
      this.pairComparator = {
        v2PairExists: -1, // loading
        price_v1_token0: '0',
        price_v1_token1: '0',
        price_v2_token0: '0',
        price_v2_token1: '0',
        priceDiff: 0,
        doneLoading: false
      }
      this.lock = lock
      this.unipair = unipair
      this.dialog = true
      this.refresh()
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    setMax () {
      this.amount = this.lock.amount
      this.amountHuman = ethers.utils.formatUnits(this.lock.amount, 18)
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
      this.reservesV1 = await V2PAIR.getReserves(this.unipair.address)
      var v2PairAddress = await V2FACTORY.getPair(this.unipair.token0.address, this.unipair.token1.address, '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73')
      this.pairComparator.v2PairExists = v2PairAddress === ethers.constants.AddressZero ? 0 : 1
      
      this.pairComparator.price_v1_token0 = ethers.BigNumber.from(ethers.BigNumber.from(10).pow(this.unipair.token1.decimals)).mul(this.reservesV1.reserve0).div(this.reservesV1.reserve1)
      this.pairComparator.price_v1_token1 = ethers.BigNumber.from(ethers.BigNumber.from(10).pow(this.unipair.token0.decimals)).mul(this.reservesV1.reserve1).div(this.reservesV1.reserve0)
      
      if (this.pairComparator.v2PairExists) {
        this.reservesV2 = await V2PAIR.getReserves(v2PairAddress)
        
        this.pairComparator.price_v2_token0 = ethers.BigNumber.from(ethers.BigNumber.from(10).pow(this.unipair.token1.decimals)).mul(this.reservesV2.reserve0).div(this.reservesV2.reserve1)
        this.pairComparator.price_v2_token1 = ethers.BigNumber.from(ethers.BigNumber.from(10).pow(this.unipair.token0.decimals)).mul(this.reservesV2.reserve1).div(this.reservesV2.reserve0)

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
    migrate () {
      this.withdrawLoading = true
      TxWrapper.doTransaction(LockerContract.migrate(this.unipair.address, this.lock.user_lock_index, this.lock.lockID, this.amount), this.$root.$dialog.confirmTx)
        .then(() => {
          this.resolve()
          this.dialog = false
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.withdrawLoading = false
        })
    }
  },

  created () {
  }
}
</script>