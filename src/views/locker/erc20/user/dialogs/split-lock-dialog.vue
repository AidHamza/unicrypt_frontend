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
          Split this lock into another lock with specified amount and the same unlock date. Useful if you have one large lock thats about to become withdrawable 
          and you'd like to split out say 10% and withdraw for marketing or some other usecase
          and relock the remaining 90%.
        </div>

        <div>
          Amount to split to a new lock
        </div>

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

        <!--
        <div>
          {{ amount }}
        </div>
        -->

      </v-card-text>

      <v-row dense class="ma-2">
        <v-btn x-large rounded block depressed @click="splitLock" color="primary" class="white--text grad-green" :loading="splitLoading">
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
import VestingContract from '@/smart-contracts/token-locker/token-locker-contract'

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
    splitLoading: false,
    lock: {
      amount_deposited: '0',
      tokens_deposited: '0',
      tokens_withdrawn: '0',
    },
    tokenHydrated: {
      decimals: '0'
    },
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    amountRemaining () {
      return ethers.BigNumber.from(this.lock.tokens_deposited).sub(this.lock.tokens_withdrawn).toString()
    },
    withdrawableBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.amountRemaining, this.tokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.tokenHydrated.decimals})
    },
  },

  watch: {
    
  },

  methods: {
    open (lock, _tokenHydrated) {
      this.lock = lock
      this.tokenHydrated = _tokenHydrated
      this.dialog = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    setMax () {
      this.amount = this.lock.amount
      this.amountHuman = ethers.utils.formatUnits(this.lock.amount, this.tokenHydrated.decimals)
    },
    cancel () {
      this.reject()
      this.dialog = false
    },
    onHumanAmountChange (val) {
      this.amount = ethers.utils.parseUnits(val, this.tokenHydrated.decimals)
    },
    splitLock () {
      this.splitLoading = true
      TxWrapper.doTransaction(VestingContract.splitLock(this.lock.lock_id, this.amount), this.$root.$dialog.confirmTx)
        .then(() => {
          this.resolve()
          this.dialog = false
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.splitLoading = false
        })
    },
  },

  created () {
  }
}
</script>