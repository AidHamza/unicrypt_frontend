<template>
  <v-dialog v-model="dialog" persistent max-width="450" content-class="br-20">
    <v-card class="br-20">

      <v-card-text>
        
        <v-row class="ma-0 align-center">
          <div class="pt-3 pb-3">
            Revoke Condition
          </div>
          <v-spacer></v-spacer>
          <v-btn @click="cancel" icon large color="textFaint">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <div class="caption">
          Revoke this premature unlocking condition, this cannot be undone. Your tokens will then be withdrawbale only by 
          the set end date.
        </div>

      </v-card-text>

      <v-row dense class="ma-2">
        <v-btn x-large rounded block depressed @click="revoke" color="primary" class="white--text grad-green" :loading="withdrawLoading">
          Revoke Conditional Unlock
        </v-btn>
      </v-row>

    </v-card>
  </v-dialog>
</template>

<script>
import { ethers } from 'ethers'
import TxWrapper from '@/smart-contracts/tx-wrapper'
import VestingContract from '@/smart-contracts/token-locker/token-locker-contract'

export default {
  components: {
  },
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    amount: '0',
    amountHuman: '0',
    loading: false,
    withdrawLoading: false,
    lock: {
      amount: '0'
    },
    tokenHydrated: {
      decimals: '0'
    },
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    withdrawableBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.lock.amount_withdrawn, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
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
      this.amountHuman = ethers.utils.formatUnits(this.lock.amount, 18)
    },
    cancel () {
      this.reject()
      this.dialog = false
    },
    onHumanAmountChange (val) {
      this.amount = ethers.utils.parseUnits(val, 18)
    },
    revoke () {
      this.withdrawLoading = true
      TxWrapper.doTransaction(VestingContract.revokeCondition(this.lock.lock_id), this.$root.$dialog.confirmTx)
        .then(() => {
          this.resolve()
          this.dialog = false
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.withdrawLoading = false
        })
    }
  },

  created () {
    this.filteredTokens = this.savedTokens
  }
}
</script>