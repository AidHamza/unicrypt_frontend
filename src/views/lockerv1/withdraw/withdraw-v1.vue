<template>
  <div>

    <div class="display-1 textFaint--text font-weight-bold mb-7">
      Withdraw liquidity V1
    </div>

    <div class="d-flex align-center t-large">
      <coin-icon :address="uniPair.token0.address" class="mr-2"></coin-icon>
      {{ uniPair.token0.symbol }} /
      <coin-icon :address="uniPair.token1.address" class="ml-2 mr-2"></coin-icon>
       {{ uniPair.token1.symbol }}

      <v-spacer></v-spacer>

    </div>

    <div class="mt-10">
      Withdraw how many LP tokens?
    </div>

    <div class="pa-4 align-center flex-nowrap inputcolor r-outlined">

      <div class="caption text-end mr-3 pt-2">
        Withdrawable: {{ withdrawableBalanceHuman }}
      </div>

      <div class="d-flex align-center">
        <c-input :value.sync="amountHuman" placeholder="0.0" @updateWhileFocussed="onHumanAmountChange" class="pa-2 title font-weight-bold">

        </c-input>

        <div class="title font-weight-bold">
          UNIV2
        </div>

        <v-btn small depressed color="primary" @click="setMax" class="ml-2">
          MAX
        </v-btn>
      </div>

      <div>
        <v-btn small outlined rounded color="textFaint" @click="setPercent(25)" class="mr-1">
          25%
        </v-btn>
        <v-btn small outlined rounded color="textFaint" @click="setPercent(50)" class="mr-1">
          50%
        </v-btn>
        <v-btn small outlined rounded color="textFaint" @click="setPercent(75)" class="mr-1">
          75%
        </v-btn>
        <v-btn small outlined rounded color="textFaint" @click="setMax" class="mr-1">
          100%
        </v-btn>
      </div>

    </div>

    <v-row class="ma-0" dense>
      <v-col cols="6">
        <div class="r-outlined pa-2 caption">
          <div>
            Total In Locker
          </div>
          <div>
            {{ totalInLockerHuman }}
          </div>
        </div>
      </v-col>
      <v-col cols="6">
        <div class="r-outlined pa-2 caption">
          <div>
            Your Balance
          </div>
          <div>
            {{  uniBalanceHuman }}
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row dense class="mt-10">
      <v-btn @click="withdrawTokens" color="primary" x-large block depressed :disabled="amount === '0'" :loading="withdrawLoading">
        Withdraw
      </v-btn>
    </v-row>

    <div class="r-outlined pa-4 mt-2">
      <div class="caption textMid--text text-center">
        {{ depositCount }} deposits made by your account
      </div>

      <v-row class="justify-center mb-4">
        <v-btn 
        @click="screen = 0"
        x-large text :color="screen === 0 ? 'primary' : ''">
          Past
        </v-btn>
        <v-btn 
        @click="screen = 1"
        x-large text :color="screen === 1 ? 'primary' : ''">
          Upcoming
        </v-btn>
      </v-row>

      <template v-if="screen === 1">
        <v-row class="ma-0 pa-0">
          <v-col cols="6">
            Amount
          </v-col>
          <v-col cols="6">
            Withdrawl date
          </v-col>
        </v-row>
        <deposit-row v-for="(deposit, i) of lockedDeposits" :key="i" :item="deposit" :totalSupply="uniPair.totalSupply"></deposit-row>
      </template>
      <template v-else-if="screen === 0">
        <v-row class="ma-0 pa-0">
          <v-col cols="6">
            Amount
          </v-col>
          <v-col cols="6">
            Withdrawl date
          </v-col>
        </v-row>
        <deposit-row v-for="(deposit, i) of unlockedDeposits" :key="i" :item="deposit" :totalSupply="uniPair.totalSupply"></deposit-row>
      </template>

    </div>

  </div>
</template>

<script>
// import _ from 'lodash'
import { ethers } from 'ethers'
import ERC20 from '@/smart-contracts/erc20'
import TxWrapper from '@/smart-contracts/tx-wrapper'
import LockerContract from '@/smart-contracts/pol1/locker-contract'
import moment from 'moment'
import DepositRow from './deposit-row'

export default {
  props: {
    uniPair: {
      type: Object,
      default: () => {

      }
    }
  },

  components: {
    DepositRow
  },

  data: () => ({
    balance: '0',
    withdrawableBalance: '0',
    amount: '0',
    amountHuman: '0',
    totalDeposited: 0,
    totalWithdrawn: 0,
    depositCount: 0,
    deposits: [],
    screen: 0,
    withdrawLoading: false,
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    totalInLocker () {
      return this.totalDeposited - this.totalWithdrawn
    },
    totalInLockerHuman () {
      var balance = this.totalInLocker / Math.pow(10, 18)
      if (balance > 1) {
        return Number(balance).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
      }
      return balance
    },
    withdrawableBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.withdrawableBalance, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9})
    },
    uniBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.balance, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9})
    },
    unlockedDeposits () {
      return this.deposits.filter(item => Number(item.epoch) <= moment().unix())
    },
    lockedDeposits () {
      return this.deposits.filter(item => Number(item.epoch) > moment().unix())
    },
  },

  watch: {
    sEthersWatcher () {
      this.getUniBalance()
      this.getWithdrawableBalance()
    },
  },

  methods: {
    async getUniBalance () {
      var balance = await ERC20.getBalance(this.sEthers.coinbase, this.uniPair.address)
      this.balance = balance
    },
    async getWithdrawableBalance () {
      var balance = await LockerContract.getUserWithdrawableBalance(this.uniPair.address, this.sEthers.coinbase)
      this.withdrawableBalance = balance
    },
    onHumanAmountChange (val) {
      this.amount = ethers.utils.parseUnits(val, 18)
    },
    setMax () {
      this.amount = this.withdrawableBalance
      this.amountHuman = ethers.utils.formatUnits(this.withdrawableBalance, 18)
    },
    setPercent (percent) {
      this.amount = ethers.BigNumber.from(this.withdrawableBalance).mul(percent).div(100)
      this.amountHuman = ethers.utils.formatUnits(this.amount, 18)
    },
    setUnlockDate (date) {
      this.unlockDate = date.unix()
    },
    async withdrawTokens () {
      this.withdrawLoading = true
      var amount = this.amount
      TxWrapper.doTransaction(LockerContract.withdrawToken(this.uniPair.address, amount), this.$root.$dialog.confirmTx)
        .then(() => { 
          this.getUniBalance()
          this.getWithdrawableBalance()
          this.getUserTokenInfo()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.withdrawLoading = false
        })
    },
    async getUserTokenInfo () {
      var userInfo = await LockerContract.getUserTokenInfo(this.uniPair.address, this.sEthers.coinbase)
      this.totalDeposited = userInfo[0]
      this.totalWithdrawn = userInfo[1]
      this.depositCount = userInfo[2]
      this.deposits = await this.getAllDeposits()
    },
    async getAllDeposits () {
      var arr = []
      for (var i = 0; i < this.depositCount; i++) {
        var struct = await LockerContract.getUserVestingAtIndex(this.uniPair.address, this.sEthers.coinbase, i)
        arr.push(struct)
      }
      return arr
    },
  },

  created () {
    this.getUniBalance()
    this.getWithdrawableBalance()
    this.getUserTokenInfo()
  }
}
</script>