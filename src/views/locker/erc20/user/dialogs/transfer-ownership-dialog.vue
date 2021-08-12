<template>
  <v-dialog v-model="dialog" persistent max-width="450" content-class="br-20">
    <v-card class="br-20">

      <v-card-text>
        
        <v-row class="ma-0 align-center">
          <div class="pt-3 pb-3">
            Transfer ownership
          </div>
          <v-spacer></v-spacer>
          <v-btn @click="cancel" large icon color="textFaint">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <div class="mt-10">
          Transfer this lock to a new owner
        </div>
        <div class="caption">
          The specified address will be able to withdraw the tokens once the unlock date is reached.
        </div>

        <div class="mt-2 d-flex align-center pa-3 r-outlined br-20 inputcolor">
          <c-input :value.sync="unlockerAccount" placeholder="New owner address...">
          </c-input>
        </div>

      </v-card-text>

      <v-row dense class="ma-2">
        <v-btn x-large block rounded depressed @click="transferLockOwnership" class="white--text grad-green" :loading="withdrawLoading">
          Transfer
          <v-icon class="ml-2">mdi-arrow-up</v-icon>
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
    unlockerAccount: '',
    loading: false,
    withdrawLoading: false,
    lock: {}
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    withdrawableBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.lock.amount, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    },
  },

  watch: {
    
  },

  methods: {
    open (lock) {
      this.lock = lock
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
    transferLockOwnership () {
      this.withdrawLoading = true
      TxWrapper.doTransaction(VestingContract.transferLockOwnership(this.lock.lock_id, this.unlockerAccount), this.$root.$dialog.confirmTx)
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