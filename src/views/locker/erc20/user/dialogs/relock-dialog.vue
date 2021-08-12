<template>
  <v-dialog v-model="dialog" persistent max-width="450" content-class="br-20">
    <v-card class="br-20">

      <v-card-text>
        
        <v-row class="ma-0 align-center">
          <div class="pt-3 pb-3">
            Relock Tokens
          </div>
          <v-spacer></v-spacer>
          <v-btn @click="cancel" large icon color="textFaint">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <div class="mt-10">
          Current lock date
        </div>

        <div>
          {{ currentLockDateHuman }}
        </div>

        <div class="mt-10">
          New Unlock Date
        </div>

        <div class="d-flex align-center inputcolor r-outlined pa-4">
          <div>
            <div class="font-weight-bold">
              {{ unlockDateHuman }}
            </div>
            <div class="textFaint--text caption">
              {{ unlockDateFromNow }}
            </div>
          </div>
          <v-spacer></v-spacer>
          <c-date @setDate="setUnlockDate"></c-date>
        </div>

        <div v-if="lockDateInvalid" class="text-center caption orange--text">
          Lock date needs to be after current lock date
        </div>

        <div v-if="!tokenOnFeeWhitelist" class="text-center mt-3">
          Fee: {{ fees.token_fee / 100 }}%
        </div>

      </v-card-text>

      <v-row dense class="ma-2">
        <v-btn x-large block rounded @click="relock" class="white--text grad-green" :loading="withdrawLoading">
          Relock
          <v-icon class="ml-2">mdi-lock-outline</v-icon>
        </v-btn>
      </v-row>

    </v-card>
  </v-dialog>
</template>

<script>
import { ethers } from 'ethers'
import TxWrapper from '@/smart-contracts/tx-wrapper'
import VestingContract from '@/smart-contracts/token-locker/token-locker-contract'
import CDate from '@/components/ui/date-picker'
import moment from 'moment'

export default {
  components: {
    CDate
  },
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    unlockDate: '0',
    amount: '0',
    amountHuman: '0',
    loading: true,
    withdrawLoading: false,
    lock: {},
    fees: {
      token_fee: '0',
      free_locking_fee: '0',
      free_locking_token: ''
    },
    tokenOnFeeWhitelist: false,
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    withdrawableBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.lock.amount, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    },
    currentLockDateHuman () {
      return moment.unix(this.lock.end_emission).format('ddd D MMM YYYY HH:mm')
    },
    unlockDateHuman () {
      return moment.unix(this.unlockDate).format('ddd D MMM YYYY HH:mm')
    },
    unlockDateFromNow () {
      return moment.unix(this.unlockDate).fromNow()
    },
    lockDateInvalid () {
      return Number(this.unlockDate) <= Number(this.lock.end_emission)
    },
  },

  watch: {
    
  },

  methods: {
    open (lock) {
      this.lock = lock
      this.unlockDate = lock.end_emission
      this.dialog = true
      this.tokenOnZeroFeeWhitelist()
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel () {
      this.reject()
      this.dialog = false
    },
    setUnlockDate (date) {
      this.unlockDate = date.unix()
    },
    onHumanAmountChange (val) {
      this.amount = ethers.utils.parseUnits(val, 18)
    },
    async getFees () {
      var fees = await VestingContract.getFees()
      this.fees = fees
    },
    async tokenOnZeroFeeWhitelist () {
      var tokenOnFeeWhitelist = await VestingContract.tokenOnZeroFeeWhitelist(this.lock.token_address)
      this.tokenOnFeeWhitelist = tokenOnFeeWhitelist
    },
    relock () {
      this.withdrawLoading = true
      TxWrapper.doTransaction(VestingContract.relock(this.lock.lock_id, this.unlockDate), this.$root.$dialog.confirmTx)
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