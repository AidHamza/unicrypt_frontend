<template>
  <div>

    <div class="mt-10 mb-2 title font-weight-bold text-center">
      {{ baseTokenSymbol }} limit per user
    </div>

    <div class="d-flex align-center inputcolor pa-4 r-outlined">
      <c-input :value.sync="maxSpendHuman" placeholder="0.0" @updateWhileFocussed="onMaxSpendAmountChange" class="pa-2 font-weight-bold">
      </c-input>

      <div class="font-weight-bold">
        {{ baseTokenSymbol }}
      </div>
    </div>

    <v-btn @click="updateMaxSpend" color="primary" class="mt-4" x-large block rounded depressed>
      UPDATE
    </v-btn>
  </div>
</template>

<script>
import PresaleContract from '@/smart-contracts/presales/presale-contract'
import { ethers } from 'ethers'
import TxWrapper from '@/smart-contracts/tx-wrapper'
import ERC20 from '@/smart-contracts/erc20'
import UniswapABI from '@/smart-contracts/uniswap/uniswap-abis'

export default {
  props: {
    address: {
      type: String
    }
  },

  components: {
  },

  data: () => ({
    maxSpend: '0',
    maxSpendHuman: '0',
    presaleInfo: {
      presale_owner: '',
      token: {

      },
      base_token: {
        symbol: ''
      },
      eth_price: '0',
      token_price: '0',
      max_spend_per_buyer: '0',
      hardcap: '0',
      softcap: '0',
      total_eth_collected: '0'
    },
    contractTokenBalance: '0',
    contractETHBalance: '0'
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    userIsOwner () {
      return this.sEthers.coinbase === this.presaleInfo.presale_owner
    },
    baseTokenSymbol () {
      return this.presaleInfo.base_token.address === UniswapABI.weth9_address() ? this.$store.state.nativeGasTokenSymbol : this.presaleInfo.base_token.symbol.toUpperCase()
    },
  },

  methods: {
    onMaxSpendAmountChange (val) {
      this.maxSpend = ethers.utils.parseUnits(val, this.presaleInfo.base_token.decimals)
    },
    async getContractEthBalance () {
      var balance = await this.sEthers.provider.getBalance(this.address)
      this.contractETHBalance = balance
    },
    async getContractTokenBalance () {
      var balance = await ERC20.getBalance(this.address, this.presaleInfo.token.address)
      this.contractTokenBalance = balance
    },
    async getPresaleInfo () {
      var presaleInfo = await PresaleContract.presaleInfo(this.address)
      this.presaleInfo = presaleInfo

      this.maxSpend = presaleInfo.max_spend_per_buyer
      this.maxSpendHuman = ethers.utils.formatUnits(presaleInfo.max_spend_per_buyer, this.presaleInfo.base_token.decimals)
    },
    async updateMaxSpend () {
      this.createLoading = true
      TxWrapper.doTransaction(PresaleContract.updateMaxSpendLimit(this.address, this.maxSpend), this.$root.$dialog.confirmTx)
        .then(() => { 
          this.getPresaleInfo()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.createLoading = false
        })
    },
    async refresh () {
      await this.getPresaleInfo()
      this.getContractEthBalance()
      this.getContractTokenBalance()
    }
  },

  created () {
    this.refresh()
  }
}
</script>