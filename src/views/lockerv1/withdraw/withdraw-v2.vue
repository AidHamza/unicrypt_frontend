<template>
  <div>

    <div v-if="loading" class="text-center mt-6">
      <v-progress-circular
      indeterminate
      size="80"
      color="textFaint">
        <v-icon size="60" color="textFaint">mdi-lock-outline</v-icon>
      </v-progress-circular>
    </div>
    <v-scroll-x-transition>
      <div v-if="!loading">

        <div class="display-1 textFaint--text font-weight-bold mb-7">
          Withdraw liquidity
        </div>

        <div class="pa-4 mb-2 text-center">
          <div class="d-flex mb-3 align-center justify-center title font-weight-bold">
            <coin-icon :address="uniPair.token0.address" style="z-index: 1;"></coin-icon>
            <coin-icon :address="uniPair.token1.address" class="mr-2" style="margin-left: -10px;"></coin-icon>
            <span class="title">
              {{ uniPair.token0.symbol }}
            </span>
            <span class="textFaint--text">
              /
            </span>
            <span class="title">
              {{ uniPair.token1.symbol }}
            </span>
          </div>
          <div class="">
            {{ uniPair.token0.name }} /
            {{ uniPair.token1.name }}
          </div>
          <copy-address :address="uniPair.address" color="textFaint"></copy-address>
        </div>

        <div class="mt-8">
          <deposit-row v-for="lock of locks" :key="lock.lockID" :item="lock" :totalSupply="uniPair.totalSupply" 
          @withdraw="withdraw" @migrate="migrate" @relock="relock" @transfer-ownership="transferOwnership" 
          @increment="increment" @split="split">
          </deposit-row>
        </div>

        <div v-if="locks.length === 0">
          No locks for this account
        </div>

        <withdraw-dialog ref="withdrawDialog"></withdraw-dialog>

        <relock-dialog ref="relockDialog"></relock-dialog>

        <transfer-ownership-dialog ref="transferOwnershipDialog"></transfer-ownership-dialog>

        <migrate-dialog ref="migrateDialog"></migrate-dialog>

        <increment-dialog ref="incrementDialog"></increment-dialog>

        <split-lock-dialog ref="splitLockDialog"></split-lock-dialog>

      </div>
    </v-scroll-x-transition>

  </div>
</template>

<script>
// import { ethers } from 'ethers'
import LockerContract from '@/smart-contracts/lock-uni-v2/univ2-contract'
import DepositRow from './deposit-row-v2'
import WithdrawDialog from './withdraw-v2-dialog'
import MigrateDialog from './migrate-dialog'
import IncrementDialog from './increment-dialog'
import RelockDialog from './relock-dialog'
import SplitLockDialog from './split-lock-dialog'
import TransferOwnershipDialog from './transfer-ownership-dialog'

export default {
  props: {
    uniPair: {
      type: Object,
      default: () => {

      }
    }
  },

  components: {
    DepositRow,
    WithdrawDialog,
    MigrateDialog,
    RelockDialog,
    TransferOwnershipDialog,
    IncrementDialog,
    SplitLockDialog
  },

  data: () => ({
    loading: true,
    locks: []
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    blockNumber () {
      return this.$store.state.blockNumber
    },
  },

  watch: {
    sEthersWatcher () {
      this.loadUserLocks(true)
    },
    blockNumber () {
      this.loadUserLocks(false)
    }
  },

  methods: {
    async getLocks () {
      var numTokens = await LockerContract.getUserNumLocksForToken(this.sEthers.coinbase, this.uniPair.address)
      var locks = []
      for (var i = 0; i < numTokens; i++) {
        var token = await LockerContract.getUserLockForTokenAtIndex(this.sEthers.coinbase, this.uniPair.address, i)
        locks.push(token)
      }
      locks.sort((a, b) => a.unlock_date - b.unlock_date)
      this.locks = locks
    },
    withdraw (item) {
      this.$refs.withdrawDialog.open(item, this.uniPair)
    },
    transferOwnership (item) {
      this.$refs.transferOwnershipDialog.open(item, this.uniPair)
    },
    relock (item) {
      this.$refs.relockDialog.open(item, this.uniPair)
    },
    migrate (item) {
      this.$refs.migrateDialog.open(item, this.uniPair)
    },
    increment (item) {
      this.$refs.incrementDialog.open(item, this.uniPair)
    },
    split (item) {
      this.$refs.splitLockDialog.open(item, this.uniPair)
    },
    loadUserLocks (setLoading) {
      if (setLoading) {
        this.loading = true
      }
      this.getLocks()
        .then(() => {
        })
        .catch(e => {})
        .then(() => {
          this.loading = false
        })
    }
  },

  created () {
    this.loadUserLocks(true)
  }
}
</script>