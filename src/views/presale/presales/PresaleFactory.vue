<template>
  <v-container style="max-width: 600px;" :class="[{'pa-0': $vuetify.breakpoint.xs}]">

    <!--
    <div v-if="!sEthers.coinbase" class="py-3 px-2">
      <v-btn color="primary" class="title" block depressed large rounded @click="connectWallet">
        <v-icon class="mr-1">mdi-exit-to-app</v-icon>
        Connect your wallet
      </v-btn>
    </div>
    -->

    <div :class="['mb-16', {'pa-4': $vuetify.breakpoint.xs}, {'v-card pa-8 br-20': !$vuetify.breakpoint.xs}]">
      
      <div class="d-flex align-center">

        <div class="ml-3 title textFaint--text">
          Launchpad
        </div>

        <v-spacer></v-spacer>
        <v-btn :to="`${$store.state.ammPrefix}/ilo/create`" outlined rounded color="primary">
          Create ILO
        </v-btn>
      </div>

      <div :class="['mb-5 mt-2 d-flex align-center pa-3 r-outlined br-c', {'foreground': $vuetify.breakpoint.xs}, {'inputcolor': !$vuetify.breakpoint.xs}]">
        <c-input :value.sync="filters.search" placeholder="Search token name or address...">
        </c-input>

        <v-progress-circular
        v-if="showSearchLoader"
        indeterminate
        width="2"
        class="mr-2"
        size="24"
        color="primary"
        ></v-progress-circular>

        <v-icon v-if="filters.search === ''">
          mdi-magnify
        </v-icon>
        <v-icon v-else @click="filters.search = ''">
          mdi-close
        </v-icon>
      </div>

      <v-bottom-navigation
        v-if="!filters.search"
        color="primary"
        grow
        class="align-center transparent mb-4"
        style="box-shadow: none;"
        :value="tab"
      >

        <v-btn @click="tab = 0">
          <span class="font-weight-medium">Upcoming</span>
          <v-icon>mdi-clock-outline</v-icon>
        </v-btn>

        <v-btn @click="tab = 1">
          <span class="font-weight-medium">Live</span>
          <v-icon>mdi-checkbox-blank-circle-outline</v-icon>
        </v-btn>

        <v-btn @click="tab = 2">
          <span class="font-weight-medium">Success</span>
          <v-icon>mdi-check-outline</v-icon>
        </v-btn>

        <v-btn @click="tab = 3">
          <span class="font-weight-medium">Failed</span>
          <v-icon>mdi-close-outline</v-icon>
        </v-btn>

      </v-bottom-navigation>

      <div v-if="false" class="caption pa-4 textFaint--text br-20 mb-3">
        Please be aware times may not be exact, this platform uses block numbers for presale start and end periods to prevent miner 
        timestamp manipulation.
      </div>
      
      <!--
      <div v-if="items.length > 0" class="d-flex align-center textFaint--text pt-2 px-3">
        {{ presaleCount }} presale{{ presaleCount === 1 ? '' : 's'}}

        <v-spacer></v-spacer>

        <v-menu
        offset-y
        >
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              small
              rounded text color="" class=""
              v-bind="attrs"
              v-on="on"
              style="min-width: 74px;"
            >
              <div class="mr-1">
                Sort
              </div>
              <div v-if="filters.sort === 'start_block'">
                Start block
              </div>
              <div v-else-if="filters.sort === 'end_block'">
                End block
              </div>
              <div v-else-if="filters.sort === 'liquidity_lock'">
                Lock %
              </div>
              <v-icon small color="" :class="[{'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list style="min-width: 200px;" class="background">
            <div class="pa-4 caption font-italic">
              Sort by
            </div>
            <v-list-item @click="sortList('start_block')">
              <v-list-item-title>
                Start date
              </v-list-item-title>
              <v-icon v-if="filters.sort === 'start_block'" color="" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
            </v-list-item>
            <v-list-item @click="sortList('end_block')">
              <v-list-item-title>
                End date
              </v-list-item-title>
              <v-icon v-if="filters.sort === 'end_block'" color="" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
            </v-list-item>
            <v-list-item @click="sortList('liquidity_lock')">
              <v-list-item-title>
                Liquidity lock %
              </v-list-item-title>
              <v-icon v-if="filters.sort === 'liquidity_lock'" color="" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      -->

      <div class="px-3 d-flex textFaint--text align-center mb-2">
        {{ presaleCount }} presale{{ presaleCount === 1 ? '' : 's'}}

        <v-spacer></v-spacer>

        <v-menu
        offset-y
        >
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              small
              rounded outlined color="" class="textFaint--text"
              v-bind="attrs"
              v-on="on"
              style="min-width: 74px;"
            >
              <div v-if="false" class="mr-1">
                Sort
              </div>
              <div v-if="filters.sort === 'start_block'">
                Start block
              </div>
              <div v-else-if="filters.sort === 'end_block'">
                End block
              </div>
              <div v-else-if="filters.sort === 'liquidity_lock'">
                Lock %
              </div>
              <v-icon small color="" :class="[{'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list style="min-width: 200px;" class="background">
            <div class="pa-4 caption font-italic">
              Sort by
            </div>
            <v-list-item @click="sortList('start_block')">
              <v-list-item-title>
                Start date
              </v-list-item-title>
              <v-icon v-if="filters.sort === 'start_block'" color="" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
            </v-list-item>
            <v-list-item @click="sortList('end_block')">
              <v-list-item-title>
                End date
              </v-list-item-title>
              <v-icon v-if="filters.sort === 'end_block'" color="" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
            </v-list-item>
            <v-list-item @click="sortList('liquidity_lock')">
              <v-list-item-title>
                Liquidity lock %
              </v-list-item-title>
              <v-icon v-if="filters.sort === 'liquidity_lock'" color="" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn color="textFaint" small rounded outlined @click="filters.hide_flagged = !filters.hide_flagged">
          <img 
          v-if="filters.hide_flagged"
          src="@/assets/img/flags/magnify.svg" 
          height="16px"
          class="mr-2"
          width="16px">
          <v-icon v-else size="16" class="mr-2" color="text">mdi-checkbox-blank-circle-outline</v-icon>
          KYC only
        </v-btn>
        <v-menu offset-y open-on-hover transition="scale-transition" max-width="300px">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              @click.stop
              small
              v-bind="attrs"
              v-on="on"
              color="textFaint"
              class="ml-1"
            >
              mdi-help-circle-outline
            </v-icon>
          </template>
          <div class="pa-3 foreground caption">
            Only show presales where the team is known. We strongly reccommend leaving this filter ON.
            New anonymous teams should not be trusted.
          </div>
        </v-menu>
      </div>

      <div v-if="items.length === 0 && loading" class="text-center py-4">
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

      <div v-else>

        <presale-row
        v-for="presale of items"
        @click.native="$root.ammLink(`/ilo/${presale.presale_contract}`)"
        :key="presale.presale_contract"
        :presale="presale"
        >
          
        </presale-row>

        <!-- NO ITEMS -->
        <div outlined v-if="items.length === 0" class="pt-8 textFaint--text">
          <div v-if="filters.search.length > 0" class="d-flex align-center background br-20 pa-4">
            No presales match your search terms
          </div>
          <div v-else>
            <div v-if="filters.hide_flagged" class="d-flex align-center background br-20 pa-4">
              <img 
              src="@/assets/img/flags/magnify.svg" 
              height="40px"
              width="40px">
              <div class="ml-3">
                No KYC'd {{ $store.state.exchange }} presales here, disabling the KYC filters will show Anon team presales.
              </div>
            </div>
            <div v-else class="d-flex align-center background br-20 pa-4">
              No presales here
            </div>
          </div>
        </div>
        <!-- NO ITEMS -->

        <!-- PAGINATION -->
        <div v-if="pageCount > 1" class="d-flex align-center justify-center">
          <v-btn @click="previousPage" :disabled="page <= 0" text>
            Previous
          </v-btn>
          <div class="px-2 textFaint--text">
            {{ page + 1 }} / {{ pageCount }}
          </div>
          <v-btn :disabled="!nextPageExists" @click="nextPage" text>
            Next
          </v-btn>
        </div>
        <!-- PAGINATION -->
      </div>

    </div>

  </v-container>
</template>

<script>
// import { ethers } from 'ethers'
import PresaleRow from './row'
import _ from 'lodash'
// import TxWrapper from '@/smart-contracts/tx-wrapper'
// import ERC20 from '@/smart-contracts/erc20'
// import PresaleABI from '@/smart-contracts/presale-abis'

export default {
  name: 'Presales',
  components: {
    PresaleRow
  },

  data: () => ({
    tab: 0,
    presales: [],
    items: [],
    page: 0,
    filters: {
      sort: 'start_block',
      sortAscending: true,
      search: '',
      hide_flagged: true
    },
    nextPageExists: false,
    showSearchLoader: false,
    loading: false,
    presaleCount: 0, // for your search term or tab
    rowsPerPage: 3
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    pageCount () {
      return Math.ceil(this.presaleCount / this.rowsPerPage)
    }
  },

  watch: {
    tab (nv) {
      this.page = 0
      this.items = []
      this.normalLoad()
    },
    'filters.search' (nv) {
      this.showSearchLoader = true
      this.page = 0
      this.normalLoad()
    },
    'filters.hide_flagged' (nv) {
      this.showSearchLoader = true
      this.page = 0
      this.normalLoad()
    }
  },

  methods: {
    connectWallet () {
      this.$root.$dialog.connectWalletDialog.open()
        .then(() => {
        })
        .catch(e => {})
    },
    /*
    nextPage: _.debounce(function () {
      this.page++
      this.APIFetch()
        .then(response => {
          var rows = response.data.rows
          this.items.push(...rows)
          this.presaleCount = response.data.count
          // this.nextPageExists = rows.length === 2
          var endOfPage = (this.page + 1) * 2
          this.nextPageExists = endOfPage < response.data.count
        })
    }, 500, {trailing: true}), */

    sortList (sorting) {
      if (this.filters.sort === sorting) {
        this.filters.sortAscending = !this.filters.sortAscending
      } else {
        this.filters.sort = sorting
        this.filters.sortAscending = false
      }
      this.page = 0
      this.normalLoad()
    },

    nextPage () {
      if (this.page + 1 >= this.pageCount) {
        return
      }
      this.page++
      this.normalLoad()
    },

    previousPage () {
      if (this.page <= 0) {
        return
      }
      this.page--
      this.normalLoad()
    },

    normalLoad: _.debounce(function () {
      this.APIFetch()
        .then(response => {
          var rows = response.data.rows
          this.items = rows
          this.presaleCount = Number(response.data.count)
          // this.nextPageExists = rows.length === 2
          var endOfPage = (this.page + 1) * this.rowsPerPage
          this.nextPageExists = endOfPage < response.data.count
        })
    }, 500, {leading: true}),

    APIFetch () {
      return new Promise((resolve, reject) => {
        this.loading = true
        this.$axios.post(`/presales/search`, {filters: this.filters, page: this.page, stage: this.tab})
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            console.log(error)
            reject(error)
          })
          .then(() => {
            this.loading = false
            this.showSearchLoader = false
          })
      })
    },
  },

  activated () {
    this.normalLoad()
  },

  created () {
    // this.refresh()
    // this.normalLoad()
  }
}
</script>