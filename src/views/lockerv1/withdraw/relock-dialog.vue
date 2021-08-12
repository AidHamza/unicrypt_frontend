<template>
  <v-dialog v-model="dialog" persistent max-width="450" content-class="br-20">
    <v-card class="br-20">

      <v-card-text>
        
        <v-row class="ma-0 align-center">
          <div class="pt-3 pb-3">
            Relock Liquidity
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
            <div class="font-weight-bold title">
              {{ unlockDateHuman }}
            </div>
            <div class="textFaint--text">
              {{ unlockDateFromNow }} (unix {{ unlockDate }})
            </div>
          </div>
          <v-spacer></v-spacer>
          <c-date @setDate="setUnlockDate"></c-date>
        </div>

        <div v-if="lockDateInvalid" class="text-center pink--text">
          Lock date needs to be after current lock date
        </div>

        <div class="text-center mt-3">
          {{ liquidityFee }}% fee on relocks
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
import LockerContract from '@/smart-contracts/lock-uni-v2/univ2-contract'
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
    unipair: {},
    feeInfo: {}
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
      return moment.unix(this.lock.unlock_date).format('ddd D MMM YYYY HH:mm')
    },
    unlockDateHuman () {
      return moment.unix(this.unlockDate).format('ddd D MMM YYYY HH:mm')
    },
    unlockDateFromNow () {
      return moment.unix(this.unlockDate).fromNow()
    },
    lockDateInvalid () {
      return Number(this.unlockDate) <= Number(this.lock.unlock_date)
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
      this.unlockDate = lock.unlock_date
      this.dialog = true
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
      var feeInfo = await LockerContract.getFees()
      this.feeInfo = feeInfo
    },
    relock () {
      this.withdrawLoading = true
      TxWrapper.doTransaction(LockerContract.relock(this.unipair.address, this.lock.user_lock_index, this.lock.lockID, this.unlockDate), this.$root.$dialog.confirmTx)
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