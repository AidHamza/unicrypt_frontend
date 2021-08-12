<template>

  <div class="">

    <div class="pa-4 border-b background">
      <div class="d-flex align-center">

        <coin-icon :address="tokenHydrated.address" class="mr-3"></coin-icon>

        <div class="d-flex align-center">
          Your Vested
          <v-btn text @click.stop="openTokenPopup" class="ml-2 pa-0 font-weight-bold" style="min-width: 10px;">
            <span class="text-truncate" :style="$vuetify.breakpoint.xs ? 'max-width: 10ch;' : 'max-width: 20ch;'">
              {{ tokenHydrated.symbol }}
            </span>
            <v-icon small color="textFaint">mdi-chevron-up</v-icon>
          </v-btn>
        </div>

        <v-spacer></v-spacer>

        <v-btn v-if="!loading" @click="refresh" icon color="textFaint">
          <v-icon small>mdi-refresh</v-icon>
        </v-btn>
        <div v-else style="height: 36px; width: 36px;" class="d-flex align-center justify-center">
          <v-progress-circular
          indeterminate
          size="14"
          width="2"
          color="primary">
          </v-progress-circular>
        </div>

      </div>

      <div class="caption textFaint--text">
        Your Balance: {{ userBalanceHuman }}
      </div>
    </div>

    <div v-if="firstLoad" class="text-center py-4">
      <v-progress-circular
      indeterminate
      size="60"
      width="2"
      color="#aaa">
        <img 
        src="@/assets/img/UNCX_fill.svg" 
        height="50px"
        class="greyscale"
        width="50px">
      </v-progress-circular>
    </div>
    <v-slide-y-transition>
      <div v-if="!firstLoad">

        <div class="pa-2 d-flex align-center textFaint--text pl-10">
          {{ filteredLocks.length }} / {{ numLocks }} locks
          <v-spacer></v-spacer>

          <v-menu
          offset-y
          transition="scale-transition"
          :close-on-content-click="false"
          >
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                small
                rounded outlined color="" class=""
                v-bind="attrs"
                v-on="on"
              >
                <div class="mr-1 textFaint--text">
                  Filter

                  <v-icon class="" color="primary" v-if="filters.showLocked" size="16">mdi-lock</v-icon>
                  <v-icon class="" color="textFaint" v-if="filters.showUnlocked" size="16">mdi-lock-open-outline</v-icon>
                  <v-icon class="" color="textFaint" v-if="filters.showWithdrawn" size="16">mdi-check-circle-outline</v-icon>

                </div>
                <div v-if="filters.sort === 'liquidity'">
                  liquidity
                </div>
                <div v-if="filters.sort === 'uniswap_index'">
                  latest
                </div>
                <div v-if="filters.sort === 'most_recent_lock'">
                  new lock
                </div>
                <div v-else-if="filters.sort === 'lock_value'">
                  value
                </div>
                <v-icon small color="textFaint" :class="[{'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-list style="min-width: 200px;" class="pa-0 foreground">
              <div class="pa-4 background caption font-italic">
                Show
              </div>
              <v-list-item @click="filters.showLocked = !filters.showLocked">
                <v-list-item-title>
                  Locked
                </v-list-item-title>
                <v-list-item-action>
                  <v-checkbox :input-value="filters.showLocked"></v-checkbox>
                </v-list-item-action>
              </v-list-item>
              <v-list-item @click="filters.showUnlocked = !filters.showUnlocked">
                <v-list-item-title>
                  Unlocked
                </v-list-item-title>
                <v-list-item-action>
                  <v-checkbox :input-value="filters.showUnlocked" color="orange"></v-checkbox>
                </v-list-item-action>
              </v-list-item>
              <v-list-item @click="filters.showWithdrawn = !filters.showWithdrawn">
                <v-list-item-title>
                  Withdrawn
                </v-list-item-title>
                <v-list-item-action>
                  <v-checkbox :input-value="filters.showWithdrawn" color="textFaint"></v-checkbox>
                </v-list-item-action>
              </v-list-item>
              <div class="pa-4 background caption font-italic">
                Sort
              </div>
              <v-list-item @click="sortList('value')">
                <v-list-item-title>
                  Amount
                </v-list-item-title>
                <v-icon v-if="filters.sort === 'value'" color="primary" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
              </v-list-item>
              <v-list-item @click="sortList('latest')">
                <v-list-item-title>
                  Newest Lock
                </v-list-item-title>
                <v-icon v-if="filters.sort === 'latest'" color="primary" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
              </v-list-item>
              <v-list-item @click="sortList('unlock_date')">
                <v-list-item-title>
                  Unlock Date
                </v-list-item-title>
                <v-icon v-if="filters.sort === 'unlock_date'" color="primary" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
              </v-list-item>
            </v-list>
          </v-menu>

        </div>

        <template v-if="numLocks > 0">
          <div v-if="filteredLocks.length === 0" class="pa-4 textFaint--text text-center">
            No locks for your selection (see filters)
          </div>

          <div v-else>

            <v-row dense class="background border-b caption font-weight-medium textFaint--text">
              <v-col class="ml-10">
                Amount
              </v-col>
              <v-col class="text-end mr-10">
                Unlock Date
              </v-col>
            </v-row>

            <user-row 
            v-for="lock in paginatedLocks" 
            :key="lock.id"
            :item="lock"
            :tokenHydrated="tokenHydrated"
            @withdraw="withdraw" 
            @migrate="migrate" 
            @relock="relock" 
            @transfer-ownership="transferOwnership" 
            @increment="increment" 
            @split="split"
            @revoke="revoke">
            </user-row>

            <div v-if="pageCount > 1" class="d-flex align-center justify-center background pa-2">
              <v-btn @click="goPrevious" text :disabled="page === 0">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              {{ page + 1 }} / {{ pageCount }}
              <v-btn @click="goNext" text :disabled="!nextPageExists">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </div>
        </template>
        
      </div>
    </v-slide-y-transition>

    <withdraw-dialog ref="withdrawDialog"></withdraw-dialog>
    <relock-dialog ref="relockDialog"></relock-dialog>
    <transfer-ownership-dialog ref="transferOwnershipDialog"></transfer-ownership-dialog>
    <migrate-dialog ref="migrateDialog"></migrate-dialog>
    <increment-dialog ref="incrementDialog"></increment-dialog>
    <split-lock-dialog ref="splitLockDialog"></split-lock-dialog>
    <revoke-dialog ref="revokeDialog"></revoke-dialog>

  </div>
    
</template>

<script>
// import VestingContract from '@/smart-contracts/token-locker/token-locker-contract'
import VestingPager from '@/smart-contracts/token-locker/pager-contract'
import VestingContract from '@/smart-contracts/token-locker/token-locker-contract'
import VESTABI from '@/smart-contracts/token-locker/token-locker-abis'
import UserRow from './user-row'
import WithdrawDialog from './dialogs/withdraw-dialog'
import MigrateDialog from './dialogs/migrate-dialog'
import IncrementDialog from './dialogs/increment-dialog'
import RelockDialog from './dialogs/relock-dialog'
import SplitLockDialog from './dialogs/split-lock-dialog'
import TransferOwnershipDialog from './dialogs/transfer-ownership-dialog'
import RevokeDialog from './dialogs/revoke-dialog'
import ERC20 from '@/smart-contracts/erc20'
import { ethers } from 'ethers'
import moment from 'moment'

export default {
  props: {
    tokenHydrated: {
      type: Object,
      default: () => ({
        symbol: '',
        name: '',
        decimals: '0'
      })
    }
  },

  components: {
    UserRow,
    WithdrawDialog,
    MigrateDialog,
    RelockDialog,
    TransferOwnershipDialog,
    IncrementDialog,
    SplitLockDialog,
    RevokeDialog
  },

  data: () => ({
    numLocks: '0',
    locks: [],
    page: 0,
    rowsPerPage: 10,
    userBalance: '0',
    totalShares: '0',
    firstLoad: true,
    loading: true,
    filters: {
      sort: 'value',
      sortAscending: false,
      showLocked: true,
      showUnlocked: false,
      showWithdrawn: false,

    },
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    nextPageExists () {
      return (this.page + 1) * this.rowsPerPage < this.filteredLocks.length
    },
    pageCount () {
      var count = Math.ceil(this.filteredLocks.length / this.rowsPerPage)
      return count === 0 ? 1 : count
    },
    filteredLocks () {
      var now = moment().unix()
      return this.locks.filter(item => {
        if (this.filters.showWithdrawn && item.shares_deposited === item.shares_withdrawn) {
          return item
        }
        if (this.filters.showUnlocked && item.end_emission < now && item.shares_withdrawn !== item.shares_deposited) {
          return item
        }
        if (this.filters.showLocked && item.end_emission > now && item.shares_withdrawn !== item.shares_deposited) {
          return item
        }
      })
    },
    sortedLocks () {
      var duplicate = JSON.parse(JSON.stringify(this.filteredLocks))
      duplicate.sort((a, b) => {
        if (this.filters.sort === 'value') {
          var aAmount = ethers.BigNumber.from(a.tokens_deposited).sub(a.tokens_withdrawn)
          var bAmount = ethers.BigNumber.from(b.tokens_deposited).sub(b.tokens_withdrawn)
          if (aAmount.gt(bAmount)) {
            return this.filters.sortAscending ? 1 : -1
          }
          if (bAmount.gt(aAmount)) {
            return this.filters.sortAscending ? -1 : 1
          }
          return 0
        } else if (this.filters.sort === 'latest') {
          return this.filters.sortAscending ? a.lock_id - b.lock_id : b.lock_id - a.lock_id
        } else if (this.filters.sort === 'unlock_date') {
          return this.filters.sortAscending ? b.end_emission - a.end_emission : a.end_emission - b.end_emission
        }
      })
      return duplicate
    },
    paginatedLocks () {
      var offset = this.page * this.rowsPerPage
      return this.sortedLocks.slice(offset, offset + this.rowsPerPage)
    },
    userBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.userBalance, this.tokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.tokenHydrated.decimals})
    },
  },

  watch: {
    tokenHydrated () {
      this.page = 0
      this.refresh()
    },
    filters: {
      deep: true,
      handler () {
        this.page = 0
      }
    },
    sEthersWatcher () {
      this.refresh()
    },
  },

  methods: {
    openTokenPopup () {
      this.$root.tokenPage.open(this.tokenHydrated.address, this.$store.state.requiredNetwork)
    },
    goNext () {
      this.page++
    },
    goPrevious () {
      this.page--
    },
    sortList (sorting) {
      if (this.filters.sort === sorting) {
        this.filters.sortAscending = !this.filters.sortAscending
      } else {
        this.filters.sort = sorting
        this.filters.sortAscending = false
      }
    },
    async getTotalShares () {
      var shares = await VestingContract.getTotalShares(this.tokenHydrated.address)
      this.totalShares = shares
    },
    async getUserTokenLocks (_start, _count) {
      return await VestingPager.getUserTokenLocks(this.sEthers.coinbase, this.tokenHydrated.address, _start, _count)
    },
    async getUserLocksForTokenLength () {
      var numLocks = await VestingPager.getUserLocksForTokenLength(this.sEthers.coinbase, this.tokenHydrated.address)
      this.numLocks = numLocks
    },
    async fetchAllLocks () {
      this.loading = true
      await this.getUserLocksForTokenLength()
      var rows = []
      var page = 0;
      while (rows.length < this.numLocks) {
        var lock_ids = await this.getUserTokenLocks(page * VESTABI.MAX_GETTER_LENGTH, VESTABI.MAX_GETTER_LENGTH)
        var locks = await VestingPager.getLocks(lock_ids)
        rows.push(...locks)
        page++
      }
      this.locks = rows
      this.firstLoad = false
      this.loading = false
    },
    async refresh () {
      this.getTotalShares()
      this.fetchAllLocks()
      this.getUserBalance()
    },
    async getUserBalance () {
      var balance = await ERC20.getBalance(this.sEthers.coinbase, this.tokenHydrated.address)
      this.userBalance = balance
    },
    withdraw (item) {
      this.$refs.withdrawDialog.open(item, this.tokenHydrated)
        .then(() => {
          this.refresh()
        })
        .catch(() => {})
    },
    transferOwnership (item) {
      this.$refs.transferOwnershipDialog.open(item)
    },
    relock (item) {
      this.$refs.relockDialog.open(item)
    },
    migrate (item) {
      this.$refs.migrateDialog.open(item, this.tokenHydrated)
    },
    increment (item) {
      this.$refs.incrementDialog.open(item, this.tokenHydrated)
    },
    split (item) {
      this.$refs.splitLockDialog.open(item, this.tokenHydrated)
    },
    revoke (item) {
      this.$refs.revokeDialog.open(item, this.tokenHydrated)
    },
  },

  created () {
    this.refresh()
  }
}
</script>