<template>
  <div class="d-flex background br-20 mb-2 align-start pa-4">
    <coin-icon :address="token.address" class="mr-2"></coin-icon>
    <div style="flex: 1;">
      <div :class="['d-flex align-center', {'primaryy--text': balanceMet}]">
        {{ token.name }}
        <v-spacer></v-spacer>
        {{ amountRequiredHuman }}
        {{ token.symbol }}
        <v-icon v-if="balanceMet" color="primary" class="pl-1">mdi-check</v-icon>
      </div>

      <div class="d-flex align-center textFaint--text">
        <a :href="`${$store.state.exchangeTokenLink}${token.address}`" target="_blank" class="deadlink caption primary--text">
          {{ $store.state.exchange }}
          <v-icon x-small color="primary">mdi-arrow-top-right</v-icon>
        </a>

        <v-spacer></v-spacer>
        <div class="caption d-flex align-center textFaint--text font-italic">
          Your balance: {{ balanceHuman }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import ERC20 from '@/smart-contracts/erc20'

export default {
  props: {
    token: {
      type: Object,
      default: () => {

      }
    },
    amount: {
      type: String,
      default: '0'
    }
  },

  data: () => ({
    balance: '0'
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    amountRequiredHuman () {
      var amount = ethers.utils.formatUnits(this.amount, this.token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.token.decimals})
    },
    balanceHuman () {
      var amount = ethers.utils.formatUnits(this.balance, this.token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 6})
    },
    balanceMet () {
      return ethers.BigNumber.from(this.balance).gte(this.amount)
    }
  },

  watch: {
    sEthersWatcher () {
      this.refresh()
    }
  },

  methods: {
    async getBalance () {
      if (!this.sEthers.coinbase) {
        this.balance = '0'
        return
      }
      var balance = await ERC20.getBalance(this.sEthers.coinbase, this.token.address)
      this.balance = balance
    },
    async refresh () {
      this.getBalance()
    }
  },

  created () {
    this.refresh()
  }
}
</script>