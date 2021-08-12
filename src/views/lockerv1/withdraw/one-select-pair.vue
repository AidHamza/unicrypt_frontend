<template>

  <div>

    <v-icon size="180" style="color: var(--v-background-base)!important; position: absolute; right: -30px; top: -30px;">mdi-arrow-up-circle-outline</v-icon>

    <div style="position: relative;">

      <div class="display-1 textFaint--text font-weight-bold mb-8">
        Edit / Withdraw
      </div>

      <div v-if="!sEthers.coinbase" class="mt-6 text-center">
        <v-btn
        @click="connectWallet"
        outlined
        :class="['font-weight-bold mb-4', {'purple-button white--text': !sEthers.coinbase}]"
        rounded depressed
        >
            <span v-if="!sEthers.coinbase">Connect Wallet</span>
            <span v-else>Account: {{ sEthers.coinbase_condensed }}</span>
        </v-btn>
      </div>

      <template v-else>

        <div class="mt-8">
          Enter the {{ $store.state.exchange }} pair address youd like to access
        </div>

        <div class="mt-2 d-flex align-center pa-3 r-outlined br-20 inputcolor">
          <c-input :value.sync="searchPair" :placeholder="`${$store.state.exchange} pair address...`" class="heading--text">
          </c-input>
        </div>

        <div class="caption textFaint--text">
          e.g. 0xc70bb2736e218861dca818d1e9f7a1930fe61e5b
        </div>

        <div v-if="loadingPair" class="mt-4 mb-4 text-center">
          <v-progress-circular
          indeterminate
          size="60"
          color="primary">
          </v-progress-circular>
          <div>
            Finding pair
          </div>
        </div>

        <div v-if="uniswapPair.address">

          <div class="mt-8 pt-2 pb-2 t-large">
            Pair found
          </div>

          <div class="d-flex align-center">
            <coin-icon :address="uniswapPair.token0.address"></coin-icon>
            <coin-icon :address="uniswapPair.token1.address" class="mr-2"></coin-icon>
            {{ uniswapPair.token0.symbol }} / {{ uniswapPair.token1.symbol }}

            <v-spacer></v-spacer>

            {{ uniBalanceHuman }}
          </div>

          <v-btn @click="$emit('on-continue', uniswapPair)" depressed rounded color="primary" block x-large class="mt-6">
            Continue
          </v-btn>

        </div>

        <user-locked-pairs @on-select="onSelectLockedPair" :key="sEthers.coinbase" class="mt-8"></user-locked-pairs>

      </template>
    </div>

  </div>
</template>

<script>
// import _ from 'lodash'
import { ethers } from 'ethers'
import UniswapContract from '@/smart-contracts/uniswap-contract.js'
import ERC20 from '@/smart-contracts/erc20'
import UserLockedPairs from '@/views/lockerv1/account/locked-pairs'

export default {
  components: {
    UserLockedPairs
  },

  data: () => ({
    searchPair: '',
    uniswapPair: {},
    balance: '0',
    loadingPair: false
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    searchTextIsAddress () {
      try {
        ethers.utils.getAddress(this.searchPair)
        return true
      } catch (e) {
        return false
      }
    },
    uniBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.balance, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 18})
    },
  },

  watch: {
    searchPair (nv) {
      if (this.searchTextIsAddress) {
        this.loadUniswapPair(nv)
      } else {
        this.uniswapPair = {}
      }
    }
  },

  methods: {
    onSelectLockedPair (unipair) {
      this.$emit('on-continue', unipair)
      // this.searchPair = unipair.address
    },
    loadUniswapPair (address) {
      this.loadingPair = true
      this.getUniBalance()
      UniswapContract.getV2PairInfo(address)
        .then(pair => {
          this.uniswapPair = pair
        })
        .catch(() => {})
        .then(() => {
          this.loadingPair = false
        })
    },
    async getUniBalance () {
      var balance = await ERC20.getBalance(this.sEthers.coinbase, this.searchPair)
      this.balance = balance
    },
    connectWallet () {
      this.$root.$dialog.connectWalletDialog.open()
        .catch(e => {})
    },
  },

  created () {
  }
}
</script>