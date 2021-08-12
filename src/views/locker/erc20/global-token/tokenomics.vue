<template>

  <div>

    <!-- MAIN AREA -->
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
    <v-expand-transition>
      <div v-if="!firstLoad">
        <div>
          <!-- CHART BLOCK -->
          <div class="border-b pb-3 cursor-pointer">
            <div class="mt-2 pa-3">
              <div class="d-flex textFaint--text caption">
                Total Supply
                <v-spacer></v-spacer>
                {{ totalSupplyHuman }}
              </div>
              <div v-if="totalConditionalLockedHuman !== '0'">
                <div class="d-flex textFaint--text caption">
                  Conditional locks (excluded)
                  <v-spacer></v-spacer>
                  <span class="blue--text">{{ totalConditionalLockedHuman }}</span>
                </div>
              </div>
              <div class="d-flex">
                Tokens locked
                <v-spacer></v-spacer>
                <span class="primary--text">{{ totalLockedHuman }}</span>
              </div>
              <div style="width: 50%;" class="mx-auto text-center">
                <v-progress-circular
                :value="totalLockedAsPercentOfTotal"
                :rotate="-90"
                size="60"
                width="4"
                color="primary">
                  <v-icon size="35" color="primary">mdi-lock-outline</v-icon>
                </v-progress-circular>
              </div>
              <div class="text-center primary--text">
                <div class="font-weight-bold">
                  {{ totalLockedAsPercentOfTotal }}%
                </div>
                <div class="caption textFaint--text font-italic">
                  locked of total supply
                </div>
              </div>
            </div>
          </div>
          <!-- CHART BLOCK -->
          <div>

            <div v-if="filteredLocks.length > 0">
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
              :network="cNetwork"
              :disableDialogs="true"
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

            <div v-else class="text-center pa-4 textFaint--text background">
              No locks for this token
            </div>
          </div>

        </div>
      </div>
    </v-expand-transition>
    <!-- END MAIN AREA -->

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
import VestingPager from '@/smart-contracts/token-locker/pager-contract'
import VESTABI from '@/smart-contracts/token-locker/token-locker-abis'
import UserRow from '../user/user-row'
import WithdrawDialog from '../user/dialogs/withdraw-dialog'
import MigrateDialog from '../user/dialogs/migrate-dialog'
import IncrementDialog from '../user/dialogs/increment-dialog'
import RelockDialog from '../user/dialogs/relock-dialog'
import SplitLockDialog from '../user/dialogs/split-lock-dialog'
import TransferOwnershipDialog from '../user/dialogs/transfer-ownership-dialog'
import RevokeDialog from '../user/dialogs/revoke-dialog'
import { ethers } from 'ethers'
import moment from 'moment'

export default {
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

  props: {
    tokenHydrated: {
      type: Object,
      default: () => ({
        symbol: '',
        name: '',
        decimals: '0'
      })
    },
    network: {
      type: String,
      default: null
    }
  },

  data: () => ({
    numLocks: '0',
    locks: [],
    page: 0,
    rowsPerPage: 1,
    filters: {
      sort: 'value',
      sortAscending: false,
      showLocked: true // if false shows all others (withdrawn and unlocked)
    },
    firstLoad: true
  }),

  computed: {
    cNetwork () {
      return this.network ? this.network : this.$store.state.requiredNetwork
    },
    sEthers () {
      return this.$store.state.ethers
    },
    nextPageExists () {
      return (this.page + 1) * this.rowsPerPage < this.filteredLocks.length
    },
    pageCount () {
      var count = Math.ceil(this.filteredLocks.length / this.rowsPerPage)
      return count === 0 ? 1 : count
    },
    totalSupplyHuman () {
      return this.$root.formatAmount(this.tokenHydrated.totalSupply, this.tokenHydrated.decimals)
    },
    totalConditionalLocked () {
      var now = moment().unix()
      var locks = this.locks.filter(item => {
        if (item.end_emission > now && item.shares_withdrawn !== item.shares_deposited && item.condition !== ethers.constants.AddressZero) {
          return item
        }
      })
      var amount = locks.reduce((a, item) => {
        return a.add(item.tokens_deposited).sub(item.tokens_withdrawn)
      }, ethers.BigNumber.from(0))
      return amount
    },
    totalLocked () {
      var now = moment().unix()
      var locks = this.locks.filter(item => {
        if (item.end_emission > now && item.shares_withdrawn !== item.shares_deposited && item.condition === ethers.constants.AddressZero) {
          return item
        }
      })
      var amount = locks.reduce((a, item) => {
        return a.add(item.tokens_deposited).sub(item.tokens_withdrawn)
      }, ethers.BigNumber.from(0))
      return amount
    },
    totalLockedAsPercentOfTotal () {
      var amount = this.totalLocked.mul(10000).div(this.tokenHydrated.totalSupply).toString()
      return Number(amount) / 100
    },
    totalLockedHuman () {
      return this.$root.formatAmount(this.totalLocked, this.tokenHydrated.decimals)
    },
    totalConditionalLockedHuman () {
      return this.$root.formatAmount(this.totalConditionalLocked, this.tokenHydrated.decimals)
    },
    lockedLocks () {
      var now = moment().unix()
      return this.locks.filter(item => {
        if (item.end_emission > now && item.shares_withdrawn !== item.shares_deposited) {
          return item
        }
      })
    },
    unlockedLocks () {
      var now = moment().unix()
      return this.locks.filter(item => {
        if (item.end_emission < now || item.shares_withdrawn === item.shares_deposited) {
          return item
        }
      })
    },
    filteredLocks () {
      return this.lockedLocks.length > 0 ? this.lockedLocks : this.unlockedLocks
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
    }
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
    cNetwork () {
      this.refresh()
    }
  },

  methods: {
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

    async getLocksForTokenLength () {
      var numLocks = await VestingPager.getTokenLocksLength(this.tokenHydrated.address, this.cNetwork)
      this.numLocks = numLocks
    },
    async fetchAllLocks () {
      await this.getLocksForTokenLength()
      var rows = []
      var page = 0;
      while (rows.length < this.numLocks) {
        var lock_ids = await VestingPager.getTokenLocks(this.tokenHydrated.address, page * VESTABI.MAX_GETTER_LENGTH, VESTABI.MAX_GETTER_LENGTH, this.cNetwork)
        var locks = await VestingPager.getLocks(lock_ids, this.cNetwork)
        rows.push(...locks)
        page++
      }
      this.locks = rows
      this.firstLoad = false
    },

    /* loadToken (tokenHydrated) {
      this.tokenHydrated = tokenHydrated
      this.refresh()
    }, */
    async refresh () {
      this.fetchAllLocks()
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