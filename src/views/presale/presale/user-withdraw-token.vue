<template>
  <v-card outlined class="background pa-4 br-20">
    <template v-if="userInfo.tokens_owed !== '0'">
      <div class="mt-2 mb-2 title font-weight-bold text-center">
        Claim your tokens!

        <v-btn v-if="false" @click="refresh">
          refresh
        </v-btn>
      </div>
      <div v-if="false" class="caption textFaint--text">
        {{ userInfo }}
      </div>

      <div class="title text-center font-weight-bold">
        {{ userTokensOwedHuman }} {{ presaleInfo.token.symbol }}
      </div>

      <div class="caption mb-4 textFaint--text text-center">
        Wallet balance: {{ walletBalanceHuman }} {{ presaleInfo.token.symbol }}
      </div>

      <v-btn @click="withdraw" color="primary" rounded x-large block depressed outlined :disabled="userInfo.tokens_owed === '0'" :loading="withdrawLoading">
        WITHDRAW {{ presaleInfo.token.symbol }}
      </v-btn>
    </template>
    <template v-else>
      <div class="mt-2 mb-2 title font-weight-bold text-center">
        Successful withdrawl
      </div>

      <div class="caption mb-4 textFaint--text text-center">
        Your Wallet balance: {{ walletBalanceHuman }} {{ presaleInfo.token.symbol }}
      </div>

      <div class="text-center caption textFaint--text">
        Add {{ presaleInfo.token.symbol }} to your wallet as a custom token with the following address
      </div>
      <div class="text-center">
        <copy-address :address="presaleInfo.token.address" color=""></copy-address>
      </div>

    </template>

  </v-card>
</template>

<script>
import PresaleContract from '@/smart-contracts/presales/presale-contract'
import { ethers } from 'ethers'
import TxWrapper from '@/smart-contracts/tx-wrapper'
import ERC20 from '@/smart-contracts/erc20'

export default {
  props: {
    presaleInfo: {
      type: Object,
      default: () => {

      }
    },
    presaleSettings: {
      type: Object,
      default: () => {

      }
    }
  },

  data: () => ({
    userInfo: {
      eth_deposited: '0',
      tokens_owed: '0'
    },
    walletBalance: '0',
    contractBalance: '0',
    withdrawLoading: false
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    userTokensOwedHuman () {
      var tokensRemainingDenominator = ethers.BigNumber.from(this.presaleSettings.total_tokens_sold).sub(this.presaleSettings.total_tokens_withdrawn).toString()
      tokensRemainingDenominator = tokensRemainingDenominator === '0' ? '1' : tokensRemainingDenominator
      var tokensOwed = ethers.BigNumber.from(this.contractBalance).mul(this.userInfo.tokens_owed).div(tokensRemainingDenominator)
      var amount = ethers.utils.formatUnits(tokensOwed, this.presaleInfo.token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.presaleInfo.token.decimals})
    },
    walletBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.walletBalance, this.presaleInfo.token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.presaleInfo.token.decimals})
    },
  },

  watch: {
    sEthersWatcher () {
      this.refresh()
    },
    presaleInfo () {
      this.refresh()
    }
  },

  methods: {
    async getUserInfo () {
      var userInfo = await PresaleContract.userInfo(this.presaleInfo.presale_contract, this.sEthers.coinbase)
      this.userInfo = userInfo
    },
    async getWalletBalance () {
      var walletBalance = await ERC20.getBalance(this.sEthers.coinbase, this.presaleInfo.token.address)
      this.walletBalance = walletBalance
      var contractBalance = await ERC20.getBalance(this.presaleInfo.presale_contract, this.presaleInfo.token.address)
      this.contractBalance = contractBalance
    },
    async refresh () {
      this.getUserInfo()
      this.getWalletBalance()
    },
    async withdraw () {
      this.withdrawLoading = true
      TxWrapper.doTransaction(PresaleContract.userWithdrawTokens(this.presaleInfo.presale_contract), this.$root.$dialog.confirmTx)
        .then(() => { 
          this.refresh()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.withdrawLoading = false
        })
    },
  },

  created () {
    this.refresh()
  }
}
</script>