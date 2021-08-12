<template>
  <div>
    <div class="font-weight-bold">
      OPTIONAL: Enable free locking for {{ tokenHydrated.symbol }}!
    </div>
    <div class="mt-2 caption textFaint--text">
      Pay a once off fee so that <strong>{{ tokenHydrated.symbol }}</strong> is whitelisted. From then onwards you or anyone from your community can use the Vesting platform 
      to lock <strong>{{ tokenHydrated.symbol }}</strong> with no fees.
    </div>
    <!--
    <div class="d-flex align-center">
      Allowance:
      <v-spacer></v-spacer>
      {{ allowance }}
    </div>
    -->
    <div class="d-flex align-center">
      Your balance:
      <v-spacer></v-spacer>
      {{ feeBalanceHuman }} {{ freeLockingToken.symbol }}
      <coin-icon :address="feeTokenIcon" :url="feeTokenUrl" :size="26" class="ml-2"></coin-icon>
    </div>
    <div class="d-flex align-center">
      Fee:
      <v-spacer></v-spacer>
      {{ freeLockingFeeHuman }} {{ freeLockingToken.symbol }}
      <coin-icon :address="feeTokenIcon" :url="feeTokenUrl" :size="26" class="ml-2"></coin-icon>
    </div>

    <div v-if="eInsufficientBalanceForFee" class="d-flex align-center font-weight-medium background pa-4 br-8 mt-2" style="position: relative; overflow: hidden;">
      <img 
      src="@/assets/img/flags/close.svg" 
      height="26px"
      class="mr-2"
      width="26px">
      <div>
        <div class="caption">
          You do not have enough {{ freeLockingToken.symbol }} in your wallet to perform this transaction.
          {{ freeLockingFeeHuman }}
          <!-- $store.state.nativeGasTokenSymbol -->
          {{ freeLockingToken.symbol }} required.
        </div>
      </div>
    </div>

    <v-row v-if="feeInGasToken" dense class="ma-0 mt-4">
      <v-btn @click="payFee" color="" outlined x-large block depressed :loading="payFeeLoading">
        Pay {{ freeLockingFeeHuman }} {{ freeLockingToken.symbol }} fee
      </v-btn>
    </v-row>
    <v-row v-else dense class="ma-0 mt-4">
      <v-col cols="6">
        <v-btn @click="approve" color="" outlined x-large block depressed :disabled="!allowanceIncreaseRequired || eInsufficientBalanceForFee" :loading="approvalLoading">
          Approve
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn @click="payFee" color="" outlined x-large block depressed :disabled="allowanceIncreaseRequired" :loading="payFeeLoading">
          Pay {{ freeLockingFeeHuman }} {{ freeLockingToken.symbol }} fee
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import ERC20 from '@/smart-contracts/erc20'
import TxWrapper from '@/smart-contracts/tx-wrapper'
import VestingABI from '@/smart-contracts/token-locker/token-locker-abis'
import VestingContract from '@/smart-contracts/token-locker/token-locker-contract'

export default {
  props: {
    tokenHydrated: {
      type: Object,
      default: () => ({
        symbol: '',
        name: '',
        decimals: '0'
      })
    },
    fees: {
      type: Object
    }
  },

  data: () => ({
    freeLockingToken: {},
    allowance: '0',
    balance: '0',
    approvalLoading: false,
    payFeeLoading: false,
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    feeTokenIcon () {
      return !this.feeInGasToken ? this.freeLockingToken.address : ''
    },
    feeTokenUrl () {
      return this.feeInGasToken ? this.$settings.CHAINS[this.$store.state.requiredNetwork].icon : null
    },
    freeLockingFeeHuman () {
      var amount = ethers.utils.formatUnits(this.fees.free_locking_fee, 18) // native gas token always 18 decimals
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    },
    feeInGasToken () {
      return this.fees.free_locking_token === ethers.constants.AddressZero
    },
    feeBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.balance, this.freeLockingToken.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    },
    allowanceIncreaseRequired () {
      if (ethers.BigNumber.from(this.fees.free_locking_fee).gt(this.allowance)) {
        return true
      }
      return false
    },
    eInsufficientBalanceForFee () {
      return ethers.BigNumber.from(this.balance).lt(this.fees.free_locking_fee)
    }
  },

  watch: {
    fees () {
      this.refresh()
    },
    sEthersWatcher () {
      this.getAllowance()
      this.getFeeTokenBalance()
    }
  },

  methods: {
    payFee () {
      this.payFeeLoading = true
      var msgValue = this.feeInGasToken ? this.fees.free_locking_fee : 0
      TxWrapper.doTransaction(VestingContract.payForFreeTokenLocks(this.tokenHydrated.address, msgValue), this.$root.$dialog.confirmTx)
        .then(() => { 
          this.getAllowance()
          this.getFeeTokenBalance()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.payFeeLoading = false
        })
    },
    approve () {
      this.approvalLoading = true
      TxWrapper.doTransaction(ERC20.setAllowance(this.fees.free_locking_token, this.fees.free_locking_fee, VestingABI.vesting_address()), this.$root.$dialog.confirmTx)
        .then(() => { 
          this.getAllowance()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.approvalLoading = false
        })
    },
    async getAllowance () {
      if (this.fees.free_locking_token === ethers.constants.AddressZero) {
        return
      }
      var allowance = await ERC20.getAllowance(this.fees.free_locking_token, this.sEthers.coinbase, VestingABI.vesting_address())
      this.allowance = allowance
    },
    async getFeeTokenBalance () {
      var balance
      if (this.feeInGasToken) {
        balance = await this.sEthers.provider.getBalance(this.sEthers.coinbase)
      } else {
        balance = await ERC20.getBalance(this.sEthers.coinbase, this.fees.free_locking_token)
      }
      this.balance = balance
    },
    async getFeeToken () {
      var freeLockingToken
      if (this.feeInGasToken) {
        freeLockingToken = this.$settings.CHAINS[this.$store.state.requiredNetwork].gasToken
      } else {
        freeLockingToken = await ERC20.getERC20(this.fees.free_locking_token)
      }
      this.freeLockingToken = freeLockingToken
    },
    async refresh () {
      this.getAllowance()
      this.getFeeTokenBalance()
      this.getFeeToken()
    }
  },

  created () {
  }
}
</script>