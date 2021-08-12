<template>
  <v-card class="pa-4">
    <div class="mt-6 mb-2 title font-weight-bold text-center">
      Withdraw {{ baseTokenSymbol }}
    </div>
    <div v-if="false" class="caption textFaint--text">
      {{ userInfo }}
    </div>
    
    <v-row dense class="my-4">
      <v-col cols="6">
        <v-card class="pa-3">
          <div class="caption textFaint--text">
            Your owed
          </div>
          <div class="title primary--text font-weight-bold">
            {{ userTokensOwedHuman }} {{ baseTokenSymbol }}
          </div>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="pa-3">
          <div class="caption textFaint--text">
            Your wallet balance
          </div>
          <div class="title font-weight-bold">
            {{ walletBalanceHuman }} {{ baseTokenSymbol }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-btn @click="withdraw" color="primary" x-large block depressed>
      WITHDRAW {{ baseTokenSymbol }}
    </v-btn>
    
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
    }
  },

  data: () => ({
    userInfo: {
      eth_deposited: '0',
      tokens_owed: '0'
    },
    walletBalance: '0'
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    userTokensOwedHuman () {
      var amount = ethers.utils.formatUnits(this.userInfo.eth_deposited, this.presaleInfo.base_token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.presaleInfo.base_token.decimals})
    },
    /* baseTokenSymbol () {
      return this.presaleInfo.presale_in_eth ? 'ETH' : this.presaleInfo.base_token.symbol.toUpperCase()
    }, */
    baseTokenSymbol () {
      return this.presaleInfo.presale_in_eth ? this.$store.state.nativeGasTokenSymbol : this.presaleInfo.base_token.symbol.toUpperCase()
    },
    walletBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.walletBalance, this.presaleInfo.base_token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.presaleInfo.base_token.decimals})
    },
  },

  watch: {
    presaleInfo () {
      // this.refresh()
    }
  },

  methods: {
    async getUserInfo () {
      var userInfo = await PresaleContract.userInfo(this.presaleInfo.presale_contract, this.sEthers.coinbase)
      this.userInfo = userInfo
    },
    async refresh () {
      this.getUserInfo()
      this.getWalletBalance()
    },
    async getWalletBalance () {
      var walletBalance
      if (this.presaleInfo.presale_in_eth) {
        walletBalance = await this.sEthers.provider.getBalance(this.sEthers.coinbase)
      } else {
        walletBalance = await ERC20.getBalance(this.sEthers.coinbase, this.presaleInfo.base_token.address)
      }
      this.walletBalance = walletBalance
    },
    async withdraw () {
      TxWrapper.doTransaction(PresaleContract.userWithdrawBaseTokens(this.presaleInfo.presale_contract), this.$root.$dialog.confirmTx)
        .then(() => { 
          this.refresh()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          // this.lockLoading = false
        })
    },
  },

  created () {
    this.refresh()
  }
}
</script>