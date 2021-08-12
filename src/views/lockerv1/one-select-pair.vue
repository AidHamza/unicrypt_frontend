<template>

  <div>

    <v-icon size="120" style="color: var(--v-background-base)!important; position: absolute; right: 30px; top: 0px;">mdi-lock-outline</v-icon>

    <div style="position: relative;">

      <div class="d-flex align-center title font-weight-bold mb-4">
        <img 
        :src="$settings.AMMS[$store.state.exchange].icon" 
        height="40px"
        width="40px"
        class="mr-3 br-20">
        {{ $store.state.exchange }} Locker
      </div>

      <div class="mb-2">
        Use the locker to prove to investors you have locked liquidity. If you are not a token developer, this section is almost definitely not for you.
      </div>
      <div>
        Our lockers offer
        <ul>
          <li>Lock splitting</li>
          <li>Liquidity Migration</li>
          <li>Relocking</li>
          <li>Lock ownership transfer</li>
        </ul>
      </div>

      <div v-if="!sEthers.coinbase" class="mt-6 text-center">
        <v-btn
        @click="connectWallet"
        outlined
        color="primary"
        :class="['font-weight-bold mb-4']"
        rounded depressed
        >
            <span v-if="!sEthers.coinbase">Connect Wallet</span>
            <span v-else>Account: {{ sEthers.coinbase_condensed }}</span>
        </v-btn>
      </div>

      <template v-else>

        <div class="mt-8">
          Enter the {{ $store.state.exchange }} pair address youd like to lock liquidity for
        </div>

        <div class="mt-2 d-flex align-center pa-3 r-outlined br-20 inputcolor">
          <c-input :value.sync="searchPair" :placeholder="`${$store.state.exchange} pair address...`">
          </c-input>
        </div>

        <div class="caption text-center textFaint--text">
          e.g. 0xc70bb2736e218861dca818d1e9f7a1930fe61e5b
        </div>

        <div v-if="loadingPair" class="mt-4 mb-4 text-center">
          <v-progress-circular
          indeterminate
          size="60"
          color="primary">
            <v-icon>mdi-lock</v-icon>
          </v-progress-circular>
          <div>
            Finding pair
          </div>
        </div>

        <v-slide-y-transition>
          <div v-if="uniswapPair.address" class="v-card pa-4 br-20 mt-4">

            <div class="pb-2 t-large">
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
              <span>CONTINUE</span>
            </v-btn>

          </div>
        </v-slide-y-transition>

        <!--
        <div v-for="token of usersLockedTokens" :key="token.address" @click="$emit('on-continue', token)">
          <div class="d-flex align-center pa-3 font-weight-bold">
            <coin-icon :address="token.token0.address"></coin-icon>
            <coin-icon :address="token.token1.address" class="mr-2"></coin-icon>
            {{ token.token0.symbol }} / {{ token.token1.symbol }}

            <v-spacer></v-spacer>

            {{ token.address }}

          </div>
        </div>
        -->

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
    onSelectLockedPair (unipair) {
      this.$emit('on-continue', unipair)
      // this.searchPair = unipair.address
    },
    async getUniBalance () {
      var balance = await ERC20.getBalance(this.sEthers.coinbase, this.searchPair)
      this.balance = balance
    },
    connectWallet () {
      this.$root.$dialog.connectWalletDialog.open()
        .then(() => {
        })
        .catch(e => {})
    },
  },

  created () {
    this.searchPair = this.$route.query.address || ''
  }
}
</script>