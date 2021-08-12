<template>
  <v-dialog v-model="dialog" persistent max-width="450" content-class="br-20">
    <v-card class="br-20">

      <v-card-text>
        
        <v-row class="ma-0 align-center">
          <div class="pt-3 pb-3">
            Split Lock
          </div>
          <v-spacer></v-spacer>
          <v-btn @click="cancel" icon large color="textFaint">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <div class="caption mb-2">
          Split this lock into another lock with specified amount. Usefull if you have one large lock thats about to become withdrawable 
          and you'd like to split out say 10% and withdraw for marketing or some other usecase
          and relock the remaining 90%.
        </div>

        <div>
          Amount to split to a new lock
        </div>

        <!-- {{ lock }}
        {{ unipair }} -->

        <div  class="pa-1">

          <template>
            <div class="pa-1 align-center flex-nowrap inputcolor r-outlined">
              <div class="caption text-end mr-3 pt-2">
                Amount: {{ withdrawableBalanceHuman }}
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

        <div class="text-center mt-2">
          Fee: {{ ethFeeHuman }} {{ $store.state.nativeGasTokenSymbol }}
        </div>

        <!--
        <div>
          {{ amount }}
        </div>
        -->

      </v-card-text>

      <v-row dense class="ma-2">
        <v-btn x-large rounded block depressed @click="splitLock" color="primary" class="white--text grad-green" :loading="withdrawLoading">
          Create new lock
          <v-icon class="ml-2">mdi-lock-outline</v-icon>
        </v-btn>
      </v-row>

    </v-card>
  </v-dialog>
</template>

<script>
import { ethers } from 'ethers'
import CInput from '@/components/ui/input'
import TxWrapper from '@/smart-contracts/tx-wrapper'
import LockerContract from '@/smart-contracts/lock-uni-v2/univ2-contract'

export default {
  components: {
    CInput
  },
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    amount: '0',
    amountHuman: '0',
    lpTokenAddress: '',
    farmAddress: '',
    farmIndex: '',
    stakedBalance: '0',
    loading: false,
    withdrawLoading: false,
    lock: {
      amount: '0'
    },
    unipair: {},
    feeInfo: {
      eth_fee: '0'
    }
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    withdrawableBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.lock.amount, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    },
    ethFeeHuman () {
      var amount = ethers.utils.formatUnits(this.feeInfo.eth_fee, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
  },

  watch: {
    
  },

  methods: {
    open (lock, unipair) {
      this.lock = lock
      this.unipair = unipair
      this.dialog = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    setMax () {
      this.amount = this.lock.amount
      this.amountHuman = ethers.utils.formatUnits(this.lock.amount, 18)
    },
    cancel () {
      this.reject()
      this.dialog = false
    },
    async getStakedLPBalance () {
      var stakedLPBalance = await LockerContract.userInfo(this.farmAddress, this.sEthers.coinbase)
      this.stakedBalance = stakedLPBalance.amountWithdrawable
    },
    onHumanAmountChange (val) {
      this.amount = ethers.utils.parseUnits(val, 18)
    },
    splitLock () {
      this.withdrawLoading = true
      var ethFee = this.feeInfo.eth_fee
      TxWrapper.doTransaction(LockerContract.splitLock(this.unipair.address, this.lock.user_lock_index, this.lock.lockID, this.amount, ethFee), this.$root.$dialog.confirmTx)
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