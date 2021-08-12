<template>
  <v-dialog v-model="dialog" persistent max-width="450" content-class="br-20">
    <v-card class="br-20">

      <v-card-text>
        
        <v-row class="ma-0 align-center">
          <div class="pt-3 pb-3">
            Increase Lock
          </div>
          <v-spacer></v-spacer>
          <v-btn @click="cancel" icon large color="textFaint">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <div  class="pa-1">

          <template>
            <div class="pa-1 align-center flex-nowrap inputcolor r-outlined">
              <div class="caption text-end mr-3 pt-2">
                Balance: {{ tokenBalanceHuman }}
              </div>
              <div class="d-flex align-center">
                <c-input :value.sync="amountHuman" placeholder="0.0" @updateWhileFocussed="onHumanAmountChange" class="pa-2 title font-weight-bold">
                </c-input>
                {{ tokenHydrated.symbol }}
                <v-btn small outlined rounded @click="setMax" class="mr-2 grad-green white--text">
                  MAX
                </v-btn>
              </div>
            </div>
          </template>

        </div>

        <div v-if="!tokenOnFeeWhitelist" class="text-center mt-3">
          Fee: {{ fees.token_fee / 100 }}%
        </div>

        <div v-if="lock.owner !== sEthers.coinbase" class="caption orange--text text-center">
          CAUTION: You are not this locks owner. You will be increasing the value of someone elses lock.
          <div class="textFaint--text font-italic">
            Lock Owner:
          </div>
          <div class="textFaint--text font-italic">
            {{ lock.owner }}
          </div>
        </div>

      </v-card-text>

      <v-row dense class="ma-2 mt-3">
        <v-col cols="6">
          <v-btn @click="approve" x-large block depressed :disabled="!allowanceIncreaseRequired" :loading="approvalLoading" class="white--text grad-green">
            Approve
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn @click="incrementLock" x-large block depressed :disabled="allowanceIncreaseRequired || amount === '0'" :loading="withdrawLoading" class="white--text grad-green">
            Lock
            <v-icon class="ml-2">mdi-arrow-up</v-icon>
          </v-btn>
        </v-col>
      </v-row>

    </v-card>
  </v-dialog>
</template>

<script>
import { ethers } from 'ethers'
import CInput from '@/components/ui/input'
import TxWrapper from '@/smart-contracts/tx-wrapper'
import VestingContract from '@/smart-contracts/token-locker/token-locker-contract'
import VestingABI from '@/smart-contracts/token-locker/token-locker-abis'
import ERC20 from '@/smart-contracts/erc20'

export default {
  components: {
    CInput
  },
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    balance: '0',
    allowance: '0',
    amount: '0',
    amountHuman: '0',
    loading: false,
    withdrawLoading: false,
    approvalLoading: false,
    lock: {},
    fees: {
      token_fee: '0',
      free_locking_fee: '0',
      free_locking_token: ''
    },
    tokenOnFeeWhitelist: false,
    tokenHydrated: {
      decimals: '0'
    },
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    tokenBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.balance, this.tokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9})
    },
    allowanceIncreaseRequired () {
      if (ethers.BigNumber.from(this.amount).gt(this.allowance)) {
        return true
      }
      return false
    },
  },

  watch: {
    
  },

  methods: {
    open (lock, _tokenHydrated) {
      this.lock = lock
      this.tokenHydrated = _tokenHydrated
      this.dialog = true
      this.getTokenBalance()
      this.getAllowance()
      this.tokenOnZeroFeeWhitelist()
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    setMax () {
      this.amount = this.balance
      this.amountHuman = ethers.utils.formatUnits(this.balance, this.tokenHydrated.decimals)
    },
    cancel () {
      this.reject()
      this.dialog = false
    },
    async getTokenBalance () {
      if (!this.sEthers.coinbase || !this.tokenHydrated.address) {
        return
      }
      var balance = await ERC20.getBalance(this.sEthers.coinbase, this.tokenHydrated.address)
      this.balance = balance
    },
    async getAllowance () {
      if (!this.sEthers.coinbase || !this.tokenHydrated.address) {
        return
      }
      var allowance = await ERC20.getAllowance(this.tokenHydrated.address, this.sEthers.coinbase, VestingABI.vesting_address())
      this.allowance = allowance
    },
    onHumanAmountChange (val) {
      this.amount = ethers.utils.parseUnits(val, this.tokenHydrated.decimals)
    },
    approve () {
      var amount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      this.approvalLoading = true
      TxWrapper.doTransaction(ERC20.setAllowance(this.tokenHydrated.address, amount, VestingABI.vesting_address()), this.$root.$dialog.confirmTx)
        .then(() => { 
          this.getAllowance()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.approvalLoading = false
        })
    },
    incrementLock () {
      this.withdrawLoading = true
      TxWrapper.doTransaction(VestingContract.incrementLock(this.lock.lock_id, this.amount), this.$root.$dialog.confirmTx)
        .then(() => {
          this.resolve()
          this.dialog = false
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.withdrawLoading = false
        })
    },
    async getFees () {
      var fees = await VestingContract.getFees()
      this.fees = fees
    },
    async tokenOnZeroFeeWhitelist () {
      var tokenOnFeeWhitelist = await VestingContract.tokenOnZeroFeeWhitelist(this.lock.token_address)
      this.tokenOnFeeWhitelist = tokenOnFeeWhitelist
    },
  },

  created () {
    this.getFees()
      .then(() => {
      })
      .catch(e => {})
      .then(() => {
        this.loading = false
      })
  }
}
</script>