<template>
  <div>
    <div class="title text-center mt-2">
      <span @click="expand = !expand" style="cursor: pointer;">
        Info
        <v-icon small :class="['ml-1', {'rotate-180': expand}]">mdi-chevron-down</v-icon>
      </span>
    </div>

    <v-slide-y-transition>
      <div v-if="expand">
        <v-row>
          <v-col cols="6">
            <v-card outlined class="pa-4 font-weight-bold">
              {{ contractETHBalanceHuman }} {{ baseTokenSymbol }}
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card outlined class="pa-4 font-weight-bold">
              {{ contractTokenBalanceHuman }} {{ presaleInfo.token.symbol }}
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-slide-y-transition>

  </div>
</template>

<script>
import PresaleContract from '@/smart-contracts/presales/presale-contract'
import { ethers } from 'ethers'
import ERC20 from '@/smart-contracts/erc20'

export default {

  props: {
    address: {
      type: String
    }
  },

  components: {
  },

  data: () => ({
    expand: false,
    maxSpend: '0',
    maxSpendHuman: '0',
    startBlock: '0',
    endBlock: '0',
    presaleInfo: {
      presale_owner: '',
      token: {

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
    baseTokenSymbol () {
      return this.presaleInfo.presale_in_eth ? 'ETH' : this.presaleInfo.base_token.symbol.toUpperCase()
    },
    contractTokenBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.contractTokenBalance, this.presaleInfo.token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.presaleInfo.token.decimals})
    },
    contractETHBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.contractETHBalance, this.presaleInfo.base_token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.presaleInfo.base_token.decimals})
    },
  },
  
  methods: {
    onMaxSpendAmountChange (val) {
      this.maxSpend = ethers.utils.parseUnits(val, 18)
    },
    async getContractBaseBalance () {
      var balance;
      if (this.presaleInfo.presale_in_eth) {
        balance = await this.sEthers.provider.getBalance(this.address)
      } else {
        balance = await ERC20.getBalance(this.address, this.presaleInfo.base_token.address)
      }
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
      this.maxSpendHuman = ethers.utils.formatUnits(presaleInfo.max_spend_per_buyer, 18)

      this.startBlock = presaleInfo.start_block
      this.endBlock = presaleInfo.end_block
    },
    async refresh () {
      await this.getPresaleInfo()
      this.getContractBaseBalance()
      this.getContractTokenBalance()
    }
  },

  created () {
    this.refresh()
  }
}
</script>