<template>
  <v-container style="max-width: 600px;" :class="[{'pa-0 foreground': $vuetify.breakpoint.xs}]">

    <div :class="['mb-16', {'': $vuetify.breakpoint.xs}, {'v-card br-20': !$vuetify.breakpoint.xs}]">
      
      <!-- ADVERT 740 x 140 px -->
      <!--
      <div v-if="showAdvert && !loggedIn" class="">
        <div>
          <a href="https://t.me/YMLNews" class="deadlink d-flex">
            <img 
            src="https://i.imgur.com/mORW59I.jpg"
            width="100%">
          </a>
          <div class="d-flex primary white--text caption pa-2 align-center">
            <div style="width: 28px;">

            </div>
            <v-spacer></v-spacer>
            This is a sponsored advertisment
            <v-spacer></v-spacer>
            <v-btn small icon @click="showAdvert = false" color="white">
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      -->

      <div class="pt-10 pb-3 pl-2 pr-2" style="min-height: 160px; position: relative;">

        <v-icon size="130" style="color: var(--v-background-base)!important; position: absolute; left: -30px; top: 20px;">mdi-lock-outline</v-icon>

        <div style="position: relative;">

          <div v-if="lock_stats.tval" class="text-center caption">
            <div class="display-1 font-weight-medium primary--text">
              ${{ totalLockedHuman }}
            </div>
            <div class="textFaint--text">
              total value locked in {{ lock_stats.pair_count }} pairs
            </div>
          </div>
          <div v-else class="text-center caption">
            <div class="display-1 font-weight-medium primary--text">
              ...
            </div>
            <div class="textFaint--text">
              Loading...
            </div>
          </div>

        </div>

        <div class="d-flex align-center justify-center mt-2 mb-4 font-weight-medium">
          <v-btn :to="`${$store.state.ammPrefix}/locker`" rounded outlined color="white" class="primary">
            <v-icon small class="mr-2">mdi-lock</v-icon>
            {{ $store.state.exchange === 'Pancakeswap V1' ? 'Migrate / Withdraw Liquidity' : 'Lock / Withdraw Liquidity' }}
          </v-btn>
        </div>

        <!--
        <div v-if="singleTokenView" class="white--text">
          <div class="d-flex align-center br-20 mb-6">
            <coin-icon :address="singleToken.address" :size="32"></coin-icon>
            <div class="ml-3">
              <div class="font-weight-bold"> {{ singleToken.symbol }} </div>
              <div class="t-small"> {{ singleToken.name }} </div>
            </div>
            <v-spacer></v-spacer>
            <v-btn small rounded depressed color="white" class="primary--text" @click="showAllFarms">
              Show all
            </v-btn>
          </div>
        </div>
        -->
      </div>
      
      <div class="pa-2">

        <div class="mb-5 d-flex align-center inputcolor pa-3 r-outlined br-20">
          <img 
          :src="$settings.AMMS[this.$store.state.exchange].icon" 
          height="20px"
          width="20px"
          class="mr-2 br-20">
          <c-input :value.sync="filters.search" placeholder="Pair name or address...">
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

        <div class="d-flex align-center pl-2">

          <v-spacer></v-spacer>

          <v-menu
          offset-y
          transition="scale-transition"
          >
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                small
                rounded outlined color="primary" class=""
                v-bind="attrs"
                v-on="on"
                style="min-width: 74px;"
              >
                <div class="mr-1 textFaint--text">
                  Sort
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
                <v-icon small color="" :class="[{'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-list style="min-width: 200px;" class="background">
              <div class="pa-4 caption font-italic">
                Sort by
              </div>
              <v-list-item @click="sortList('lock_value')">
                <v-list-item-title>
                  Lock value
                </v-list-item-title>
                <v-icon v-if="filters.sort === 'lock_value'" color="" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
              </v-list-item>
              <v-list-item @click="sortList('most_recent_lock')">
                <v-list-item-title>
                  Newest lock
                </v-list-item-title>
                <v-icon v-if="filters.sort === 'most_recent_lock'" color="" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
              </v-list-item>
              <v-list-item @click="sortList('liquidity')">
                <v-list-item-title>
                  Liquidity
                </v-list-item-title>
                <v-icon v-if="filters.sort === 'liquidity'" color="" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
              </v-list-item>
              <v-list-item @click="sortList('uniswap_index')">
                <v-list-item-title>
                  Latest Pairs
                </v-list-item-title>
                <v-icon v-if="filters.sort === 'uniswap_index'" color="" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
              </v-list-item>
            </v-list>
          </v-menu>

        </div>

      </div>

      <div>
        <!-- PAGINATION -->
        <div v-if="pageCount > 1" class="d-flex align-center my-1 justify-end mr-2">
          <v-btn :disabled="page === 0" @click="firstPage" text icon color="text">
            <v-icon small>mdi-page-first</v-icon>
          </v-btn>
          <v-btn @click="previousPage" :disabled="page <= 0" text icon color="text">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn icon :disabled="!nextPageExists" @click="nextPage" text color="text">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-btn icon :disabled="!nextPageExists" @click="lastPage" text color="text">
            <v-icon small>mdi-page-last</v-icon>
          </v-btn>
        </div>
        <!-- PAGINATION -->
      </div>

      <div v-if="firstLoad" class="text-center pa-12">
        <v-progress-circular
        indeterminate
        size="80"
        width="3"
        color="#aaa">
          <img 
          src="@/assets/img/UNCX_fill.svg" 
          height="70px"
          width="70px"
          class="greyscale">
        </v-progress-circular>
      </div>

      <row
      v-for="(item, i) of items" 
      :key="item.address"
      :index="(page * filters.rowsPerPage) + i + 1"
      class="border-b"
      :item="item">
      </row>

      <div v-if="items.length === 0 && !firstLoad" class="pa-4 text-center">
        <v-icon size="100" color="textFaint">mdi-magnify</v-icon>
        <div class="textFaint--text">
          No pairs found. Your filters may be too restricting.
        </div>
      </div>

      <!-- PAGINATION -->
      <div v-if="pageCount > 1" class="d-flex align-center my-2 justify-center">
        <v-btn :disabled="page === 0" @click="firstPage" text icon color="text">
          <v-icon small>mdi-page-first</v-icon>
        </v-btn>
        <v-btn @click="previousPage" :disabled="page <= 0" text icon color="text">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <div class="px-2 textFaint--text">
          {{ page + 1 }} / {{ pageCount }}
        </div>
        <v-btn icon :disabled="!nextPageExists" @click="nextPage" text color="text">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn icon :disabled="!nextPageExists" @click="lastPage" text color="text">
          <v-icon small>mdi-page-last</v-icon>
        </v-btn>
      </div>
      <!-- PAGINATION -->

    </div>
    
  </v-container>
</template>

<script>
import _ from 'lodash'
import Row from '@/views/pairs/row'

export default {
  name: 'PairsComponent',
  components: {
    Row
  },

  data: () => ({
    items: [],
    page: 0,
    filters: {
      rowsPerPage: 20,
      sort: 'lock_value',
      sortAscending: false,
      search: ''
    },
    firstLoad: true,
    loading: false,
    showSearchLoader: false,
    lock_stats: {},
    nextPageExists: false,
    uniswapPairCount: null,
    showAdvert: true,
    rowCount: 0
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    loggedIn () {
      return this.$store.state.user.username
    },
    totalLockedHuman () {
      var amount = parseInt(this.lock_stats.tval)
      // amount = '1230000' // for testing
      if (amount >= 1000000) {
        var deci = Number(amount / 1000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return deci + 'M'
      } else if (amount > 1000) {
        return Math.floor(amount / 1000) + 'k'
      }
      return amount
    },
    pageCount () {
      return Math.ceil(this.rowCount / this.filters.rowsPerPage)
    }
  },

  watch: {
    'filters.search' (nv) {
      this.showSearchLoader = true
      this.page = 0
      this.normalLoad()
    }
  },

  methods: {
    sortList (sorting) {
      this.showSearchLoader = true
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
      this.showSearchLoader = true
      this.page++
      this.normalLoad()
    },

    firstPage () {
      if (this.page === 0) {
        return
      }
      this.showSearchLoader = true
      this.page = 0
      this.normalLoad()
    },

    lastPage () {
      if (this.page === this.pageCount - 1) {
        return
      }
      this.showSearchLoader = true
      this.page = this.pageCount - 1
      this.normalLoad()
    },

    previousPage () {
      if (this.page <= 0) {
        return
      }
      this.showSearchLoader = true
      this.page--
      this.normalLoad()
    },

    normalLoad: _.debounce(function () {
      this.APIFetch()
        .then(response => {
          var rows = response.data.rows
          this.items = rows
          this.rowCount = Number(response.data.count)
          // this.nextPageExists = rows.length === 2
          var endOfPage = (this.page + 1) * this.filters.rowsPerPage
          this.nextPageExists = endOfPage < response.data.count
        })
    }, 300, {leading: false}),

    APIFetch () {
      return new Promise((resolve, reject) => {
        this.loading = true
        this.$axios.post(`/uniswap/search?network=${this.$store.state.ethers.network}`, {filters: this.filters, page: this.page})
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
            this.firstLoad = false
          })

        this.$axios.get(`/pol/lock-stats`)
          .then(response => {
            this.lock_stats = response.data
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    fetchUniswapPairCount () {
      this.$axios.get('/uniswap/pair-count')
        .then(response => {
          this.uniswapPairCount = response.data.count
        })
        .catch(error => {
          console.log(error)
        })
        .then(() => {
          // this.firstLoad = false
        })
    },
  },

  created () {
    this.fetchUniswapPairCount()
    this.normalLoad()
  }
}
</script>