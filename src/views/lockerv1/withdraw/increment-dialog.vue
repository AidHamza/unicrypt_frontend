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

        <!-- {{ lock }}
        {{ unipair }} -->

        <div  class="pa-1">

          <template>
            <div class="pa-1 align-center flex-nowrap inputcolor r-outlined">
              <div class="caption text-end mr-3 pt-2">
                Balance: {{ uniBalanceHuman }}
              </div>
              <div class="d-flex align-center">
                <c-input :value.sync="amountHuman" placeholder="0.0" @updateWhileFocussed="onHumanAmountChange" class="pa-2 title font-weight-bold">
                </c-input>
                <v-btn small outlined rounded @click="setMax" class="mr-2 grad-green white--text">
                  MAX
                </v-btn>
              </div>
            </div>
          </template>

        </div>

        <!--
        <div>
          {{ amount }}
        </div>
        -->

        <div class="text-center mt-3">
          {{ liquidityFee }}% fee on relocks
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
import LockerContract from '@/smart-contracts/lock-uni-v2/univ2-contract'
import LockerABI from '@/smart-contracts/lock-uni-v2/univ2-abis'
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
    unipair: {},
    feeInfo: {}
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    uniBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.balance, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9})
    },
    allowanceIncreaseRequired () {
      if (ethers.BigNumber.from(this.amount).gt(this.allowance)) {
        return true
      }
      return false
    },
    liquidityFee () {
      return this.feeInfo.liquidity_fee / 10
    },
  },

  watch: {
    
  },

  methods: {
    open (lock, unipair) {
      this.lock = lock
      this.unipair = unipair
      this.dialog = true
      this.getUniBalance()
      this.getAllowance()
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    setMax () {
      this.amount = this.balance
      this.amountHuman = ethers.utils.formatUnits(this.balance, 18)
    },
    cancel () {
      this.reject()
      this.dialog = false
    },
    async getUniBalance () {
      var balance = await ERC20.getBalance(this.sEthers.coinbase, this.unipair.address)
      this.balance = balance
    },
    async getAllowance () {
      var allowance = await ERC20.getAllowance(this.unipair.address, this.sEthers.coinbase, LockerABI.locker_mainnet_address())
      this.allowance = allowance
    },
    onHumanAmountChange (val) {
      this.amount = ethers.utils.parseUnits(val, 18)
    },
    approve () {
      var amount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      this.approvalLoading = true
      TxWrapper.doTransaction(ERC20.setAllowance(this.unipair.address, amount, LockerABI.locker_mainnet_address()), this.$root.$dialog.confirmTx)
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
      TxWrapper.doTransaction(LockerContract.incrementLock(this.unipair.address, this.lock.user_lock_index, this.lock.lockID, this.amount), this.$root.$dialog.confirmTx)
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
      var feeInfo = await LockerContract.getFees()
      this.feeInfo = feeInfo
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