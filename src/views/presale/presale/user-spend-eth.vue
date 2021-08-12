<template>
  <div>

    <div class="py-4 br-8 d-flex align-center">

      <v-progress-circular
      :value="(userEthDepositedHuman / userMaxLimitHuman) * 100"
      :rotate="-90"
      size="30"
      width="3"
      class="ml-1"
      color="primary">
      </v-progress-circular>

      <div class="ml-3">
        <div class="text--text">
          Your spent allowance
        </div>
        <div class="font-weight-bold">
          {{ userEthDepositedHuman }} / {{ userMaxLimitHuman }} {{ baseTokenSymbol }}
        </div>
      </div>
    </div>

    <div v-if="remainingSpendableAllowance === '0'" class="text-center">
      You have spent the maximum allowance for this account.
    </div>

    <template v-else>
      <div class="mt-6 mb-2 title font-weight-bold text-center">
        Spend how much {{ baseTokenSymbol }}?
      </div>

      <div class="pa-4 align-center flex-nowrap inputcolor r-outlined">

        <div class="caption text-end pt-2">
          Balance: {{ baseBalanceHuman }}
        </div>

        <div class="d-flex align-center">
          <c-input :value.sync="amountHuman" placeholder="0.0" @updateWhileFocussed="onHumanAmountChange" class="pa-2 font-weight-bold">

          </c-input>

          <div class="font-weight-bold">
            {{ baseTokenSymbol }}
          </div>

          <v-btn rounded small depressed color="primary" @click="setMax" class="ml-2">
            MAX
          </v-btn>
        </div>

        <div>
          <v-btn small outlined rounded color="" @click="setPercent(25)" class="mr-1">
            25%
          </v-btn>
          <v-btn small outlined rounded color="" @click="setPercent(50)" class="mr-1">
            50%
          </v-btn>
          <v-btn small outlined rounded color="" @click="setPercent(75)" class="mr-1">
            75%
          </v-btn>
          <v-btn small outlined rounded color="" @click="setMax" class="mr-1">
            100%
          </v-btn>
        </div>

      </div>

      <div class="text-center pa-4">
        <div>
          You get
        </div>
        <div class="font-weight-bold">
          {{ amountTokensForBuy }} {{ presaleInfo.token.symbol }}
        </div>
        <div class="caption textFaint--text">
          Please be aware if the token you are purchasing has deflationary mechanisms such as burn on transfer you 
          may receive less than the amount stated.
        </div>
        <div class="caption textFaint--text mt-2">
          Your tokens will be locked in the contract until the presale has concluded.
        </div>
      </div>

      <div v-if="showWarning" :class="{'pa-4': $vuetify.breakpoint.xs}">
        <div class="mb-2 d-flex align-center font-weight-medium midground pa-4 br-20" style="position: relative; overflow: hidden;">
          <div class="orange" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
          </div>
          <div>
            <div class="d-flex align-center mb-2">
              <img 
              src="@/assets/img/flags/exclamation.svg" 
              height="26px"
              class="mr-2"
              width="26px">
              Safety Alert
            </div>
            <div class="caption font-weight-bold">
              This is a decentralised and open presale platform. Similar to Uniswap anyone can create and name a presale freely
              including fake versions of existing tokens. It is also possible for developers of a token to mint near infinite
              tokens and dump them on locked liquidity.
              Please do your own research before using this platform.
            </div>
            <div class="mt-2 text-end">
              <v-btn href="https://unicrypt.medium.com/decentralised-presales-99809cdb398d" target="_blank"
              rounded text color="text" class="mr-2">
                More info
              </v-btn>
              <v-btn color="orange" rounded text class="white--text" @click="showWarning = false">
                Accept and proceed
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <v-btn v-if="baseTokenIsETH" @click="userDeposit" color="primary" rounded :loading="purchaseLoading" x-large block depressed :disabled="showWarning">
        Purchase
      </v-btn>

      <v-row v-else dense class="ma-0 mt-4">
        <v-col cols="6">
          <v-btn @click="approve" color="primary" x-large block depressed :disabled="!allowanceIncreaseRequired || showWarning" :loading="approvalLoading">
            Approve
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn @click="userDeposit" color="primary" x-large block depressed :disabled="allowanceIncreaseRequired || amount === '0' || showWarning" :loading="purchaseLoading">
            Purchase
          </v-btn>
        </v-col>
      </v-row>

      <div class="caption textFaint--text text-center mt-2">
        Any excess {{ baseTokenSymbol }} above your allowance is immediately refunded
      </div>

    </template>

  </div>
</template>

<script>
import { ethers } from 'ethers'
import UniswapABI from '@/smart-contracts/uniswap/uniswap-abis'
import PresaleContract from '@/smart-contracts/presales/presale-contract'
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

  components: {
  },

  data: () => ({
    showWarning: true,
    userInfo: {
      eth_deposited: '0',
      tokens_owed: '0'
    },
    baseBalance: '0',
    allowance: '0',
    amount: '0',
    amountHuman: '0',
    approvalLoading: false,
    purchaseLoading: false
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    blockNumber () {
      return this.$store.state.blockNumber
    },
    baseTokenIsETH () {
      return this.presaleInfo.base_token.address === UniswapABI.weth9_address()
    },
    baseTokenSymbol () {
      return this.presaleInfo.base_token.address === UniswapABI.weth9_address() ? this.$store.state.nativeGasTokenSymbol : this.presaleInfo.base_token.symbol.toUpperCase()
    },
    baseBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.baseBalance, this.presaleInfo.base_token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
    amountTokensForBuy () {
      var decimalDenominator = ethers.BigNumber.from(10).pow(this.presaleInfo.base_token.decimals)
      var amount = ethers.BigNumber.from(this.amount).mul(this.presaleInfo.token_price).div(decimalDenominator).toString()
      amount = ethers.utils.formatUnits(amount, this.presaleInfo.token.decimals)
      return amount
    },
    userMaxLimitHuman () {
      var amount = ethers.utils.formatUnits(this.presaleInfo.max_spend_per_buyer, this.presaleInfo.base_token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.presaleInfo.base_token.decimals})
    },
    userEthDepositedHuman () {
      var amount = ethers.utils.formatUnits(this.userInfo.eth_deposited, this.presaleInfo.base_token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.presaleInfo.base_token.decimals})
    },
    allowanceIncreaseRequired () {
      if (ethers.BigNumber.from(this.amount).gt(this.allowance)) {
        return true
      }
      return false
    },
    remainingSpendableAllowance () {
      return ethers.BigNumber.from(this.presaleInfo.max_spend_per_buyer).sub(this.userInfo.eth_deposited).toString()
    }
  },

  watch: {
    sEthersWatcher () {
      this.refresh()
    },
    blockNumber () {
      this.refresh()
    }
  },

  methods: {
    onHumanAmountChange (val) {
      try {
        this.amount = ethers.utils.parseUnits(val, this.presaleInfo.base_token.decimals)
      } catch (e) {
        this.amount = '0'
      }
    },
    setPercent (percent) {
      this.amount = ethers.BigNumber.from(this.baseBalance).mul(percent).div(100).toString()
      this.amountHuman = ethers.utils.formatUnits(this.amount, this.presaleInfo.base_token.decimals)
    },
    setMax () {
      this.amount = this.baseBalance
      this.amountHuman = ethers.utils.formatUnits(this.baseBalance, this.presaleInfo.base_token.decimals)
    },
    async getBaseBalance () {
      var baseBalance
      if (this.baseTokenIsETH) {
        baseBalance = await this.sEthers.provider.getBalance(this.sEthers.coinbase)
      } else {
        baseBalance = await ERC20.getBalance(this.sEthers.coinbase, this.presaleInfo.base_token.address)
      }
      this.baseBalance = baseBalance
    },
    async getAllowance () {
      var allowance = await ERC20.getAllowance(this.presaleInfo.base_token.address, this.sEthers.coinbase, this.presaleInfo.presale_contract)
      this.allowance = allowance
    },
    async getUserInfo () {
      var userInfo = await PresaleContract.userInfo(this.presaleInfo.presale_contract, this.sEthers.coinbase)
      this.userInfo = userInfo
      var userIsWhitelisted = await PresaleContract.getUserWhitelistStatus(this.presaleInfo.presale_contract, this.sEthers.coinbase)
      this.userIsWhitelisted = userIsWhitelisted
    },
    async userDeposit () {
      this.purchaseLoading = true
      var txPromise
      if (this.baseTokenIsETH) {
        txPromise = TxWrapper.doTransaction(PresaleContract.userDepositETH(this.presaleInfo.presale_contract, this.amount), this.$root.$dialog.confirmTx)
      } else {
        txPromise = TxWrapper.doTransaction(PresaleContract.userDepositToken(this.presaleInfo.presale_contract, this.amount), this.$root.$dialog.confirmTx)
      }
      txPromise
        .then(() => { 
          this.refresh()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.purchaseLoading = false
        })
    },
    approve () {
      var amount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      this.approvalLoading = true
      TxWrapper.doTransaction(ERC20.setAllowance(this.presaleInfo.base_token.address, amount, this.presaleInfo.presale_contract), this.$root.$dialog.confirmTx)
        .then(() => { 
          this.getAllowance()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.approvalLoading = false
        })
    },
    async refresh () {
      this.getBaseBalance()
      this.getAllowance()
      this.getUserInfo()
    },
  },

  created () {
    this.refresh()
  }
}
</script>