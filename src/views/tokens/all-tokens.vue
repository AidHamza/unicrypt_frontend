<template>
  <div>
      
    <div class="">

      <div v-if="false" class="display-1 text--text font-weight-medium pa-2 text-center">
        {{ $store.state.exchange }} Tokens <!--<span v-if="uniswapTokenCount"> {{ uniswapTokenCount }} </span> -->
      </div>

      <div :class="['d-flex align-center pa-3 r-outlined br-c mx-2', {'inputcolor': $vuetify.breakpoint.xs}, {'inputcolor': !$vuetify.breakpoint.xs}]">
        <c-input :value.sync="filters.search" placeholder="Token name or address..." class="">
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

      <div class="d-flex align-center t-small justify-end py-2">

        <v-btn small rounded text @click="showFilterPanel = !showFilterPanel">
          <v-icon small class="mr-2" :color="filtersActive ? 'text' : 'textFaint'">mdi-filter-outline</v-icon>
          Filter
          <v-icon small :class="['ml-1', {'rotate-180': showFilterPanel}]">mdi-chevron-down</v-icon>
        </v-btn>

        <v-btn icon small rounded outlined @click="complexMode = !complexMode">
          <v-icon v-if="complexMode" small color="text">mdi-eye-outline</v-icon>
          <v-icon v-else small>mdi-eye-off</v-icon>
        </v-btn>

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
              <div class="mr-1 textFaint--text">
                Sort
              </div>
              <v-icon small v-if="filters.sort === 'first_uniswap_index'" color="">mdi-clock-outline</v-icon>
              <div v-else-if="filters.sort === 'volume24hr'">
                vol
              </div>
              <div v-else-if="filters.sort === 'change_24hr'">
                24h
              </div>
              <div v-else-if="filters.sort === 'change_7d'">
                7d
              </div>
              <div v-else-if="filters.sort === 'change_30d'">
                30d
              </div>

              <v-icon small color="" :class="[{'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list style="min-width: 200px;" class="background">
            <div class="pa-4 caption font-italic">
              Sort by
            </div>
            <v-list-item @click="sortList('first_uniswap_index')">
              <v-list-item-title>
                Latest
              </v-list-item-title>
              <v-icon v-if="filters.sort === 'first_uniswap_index'" color="" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
            </v-list-item>
            <v-list-item @click="sortList('volume24hr')">
              <v-list-item-title>
                Volume
              </v-list-item-title>
              <v-icon v-if="filters.sort === 'volume24hr'" color="" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
            </v-list-item>

            <v-list-item @click="sortList('change_24hr')">
              <v-list-item-title>
                Change 24hr
              </v-list-item-title>
              <v-icon v-if="filters.sort === 'change_24hr'" color="" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
            </v-list-item>

            <v-list-item @click="sortList('change_7d')">
              <v-list-item-title>
                Change 7d
              </v-list-item-title>
              <v-icon v-if="filters.sort === 'change_7d'" color="" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
            </v-list-item>
            
            <v-list-item @click="sortList('change_30d')">
              <v-list-item-title>
                Change 30d
              </v-list-item-title>
              <v-icon v-if="filters.sort === 'change_30d'" color="" :class="['ml-1', {'rotate-180': filters.sortAscending}]">mdi-chevron-down</v-icon>
            </v-list-item>
          </v-list>
        </v-menu>

      </div>

      <v-slide-y-transition>
        <div v-if="showFilterPanel" class="border-t pt-2">
          <div class="textFaint--text caption text-center">
            Advanced filters
          </div>
          <div class="mt-2 d-flex align-center justify-center pa-2 br-8">
            <v-btn small rounded outlined @click="filters.excludeStablecoins = !filters.excludeStablecoins" :color="filters.excludeStablecoins ? 'primary' : 'textFaint'">
              <v-icon small class="mr-1">mdi-currency-usd</v-icon>
              Hide stable coins
            </v-btn>

            <v-btn small rounded outlined @click="filters.showLockedOnly = !filters.showLockedOnly" :color="filters.showLockedOnly ? 'primary' : 'textFaint'">
              <v-icon small class="mr-2">mdi-lock-outline</v-icon>
              Locked
            </v-btn>

            <v-menu
            offset-y
            >
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  small
                  rounded outlined :color="filters.minVolume !== '0' ? 'primary' : 'textFaint'" class=""
                  v-bind="attrs"
                  v-on="on"
                  style="min-width: 74px;"
                >
                  Volume
                  {{ filters.minVolume === '50000' ? '> 50k' : ''}}
                  {{ filters.minVolume === '500000' ? '> 500k' : ''}}
                </v-btn>
              </template>

              <v-list style="min-width: 200px;" class="background">
                <div class="pa-4 caption font-italic">
                  Volume above
                </div>
                <v-list-item @click="filters.minVolume = '0'">
                  <v-list-item-title :class="{'primary--text': filters.minVolume === '0'}">
                    Disable
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="filters.minVolume = '50000'">
                  <v-list-item-title :class="{'primary--text': filters.minVolume === '50000'}">
                    50k
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="filters.minVolume = '500000'">
                  <v-list-item-title :class="{'primary--text': filters.minVolume === '500000'}">
                    500k
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

        </div>
      </v-slide-y-transition>

    </div>

    <div v-if="firstLoad" class="text-center pa-12">
      <v-progress-circular
      indeterminate
      size="80"
      width="3"
      color="#aaa">
        <img 
        src="@/assets/img/UNCX_fill.svg"
        class="greyscale"
        height="70px"
        width="70px">
      </v-progress-circular>
    </div>

    <v-scroll-x-transition>
      <div v-if="!firstLoad">

        <div :class="['d-flex align-center border-b border-t', $vuetify.breakpoint.xs ? 'px-2' : 'px-2']">
          <token-chip v-for="tokenChip of tokenChips" :address="tokenChip.address" :icon="tokenChip.icon" :key="tokenChip.address"></token-chip>
          <v-spacer></v-spacer>
          <!-- PAGINATION -->
          <div class="d-flex align-center my-2 justify-center">
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

        <token-row
        v-for="(item, i) of items" 
        :key="item.address"
        :item="item"
        :index="(page * filters.rowsPerPage) + i + 1"
        :mode="complexMode ? 0 : 1">
        </token-row>

        <div v-if="items.length === 0 && !firstLoad" class="pa-4 text-center">
          <v-icon size="100" color="textFaint">mdi-magnify</v-icon>
          <div class="textFaint--text">
            No tokens found. Your filters may be too restricting.
          </div>
          <v-btn class="mt-4" @click="disableFilters" outlined rounded>
            Disable filters
          </v-btn>
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
    </v-scroll-x-transition>
    
  </div>
</template>

<script>
import _ from 'lodash'
import TokenRow from './token-row'
import TokenChip from '@/views/tokens/token-chip'

export default {
  components: {
    TokenRow,
    TokenChip
  },

  data: () => ({
    tokenChips: [],
    items: [],
    page: 0,
    tab: 0,
    filters: {
      rowsPerPage: 20,
      sort: 'volume24hr',
      sortAscending: false,
      minVolume: '0',
      minTX: '0',
      search: '',
      showLockedOnly: false,
      excludeStablecoins: true
    },
    loading: false,
    firstLoad: true,
    showSearchLoader: false,
    nextPageExists: false,
    complexMode: true,
    uniswapTokenCount: null,
    showFilterPanel: false,
    rowCount: 0
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    filtersActive () {
      if (this.filters.showLockedOnly !== false || this.filters.minVolume !== '0' || this.filters.excludeStablecoins !== false) {
        return true
      }
      return false
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
    },
    'filters.showLockedOnly' (nv) {
      this.page = 0
      this.normalLoad()
    },
    'filters.excludeStablecoins' (nv) {
      this.page = 0
      this.normalLoad()
    },
    filters: {
      deep: true,
      handler () {
        this.page = 0
        this.normalLoad()
      }
    }
  },

  methods: {
    disableFilters () {
      this.filters.showLockedOnly = false
      this.filters.minVolume = '0'
      this.filters.excludeStablecoins = false
    },
    onScroll (e) {
      if (typeof window === 'undefined') return
      if ((window.innerHeight + window.pageYOffset) >= document.body.scrollHeight - 10) {
        this.nextPage()
      }
    },
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
    }, 500, {leading: false}),

    nextPage () {
      if (this.page + 1 >= this.pageCount) {
        return
      }
      this.page++
      this.normalLoad()
    },

    firstPage () {
      if (this.page === 0) {
        return
      }
      this.page = 0
      this.normalLoad()
    },

    lastPage () {
      if (this.page === this.pageCount - 1) {
        return
      }
      this.page = this.pageCount - 1
      this.normalLoad()
    },

    previousPage () {
      if (this.page <= 0) {
        return
      }
      this.page--
      this.normalLoad()
    },

    APIFetch () {
      return new Promise((resolve, reject) => {
        this.loading = true
        this.$axios.post(`/erc20/search?network=${this.$store.state.ethers.network}`, {filters: this.filters, page: this.page})
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
      })
    },

    fetchUniswapTokenCount () {
      this.$axios.get('/uniswap/token-count')
        .then(response => {
          this.uniswapTokenCount = response.data.count
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
    var tokenChips = {
      'Uniswap V2': [
        {
          address: '0xaDB2437e6F65682B85F814fBc12FeC0508A7B1D0' // UNCX
        },
        {
          address: '0x2f4eb47A1b1F4488C71fc10e39a4aa56AF33Dd49' // UNCL
        }
      ],
      'Honeyswap V1': [
        {
          address: '0x0116e28B43A358162B96f70B4De14C98A4465f25', // UNCX
          icon: 'https://i.imgur.com/HJDDoWo.png'
        },
        {
          address: '0x703120F2f2011a0D03A03a531Ac0e84e81F15989', // UNCL
          icon: 'https://i.imgur.com/XuKS0pu.png'
        }
      ],
      'Pancakeswap V1': [
        {
          address: '0x09a6c44c3947B69E2B45F4D51b67E6a39ACfB506', // UNCX
          icon: 'https://i.imgur.com/HJDDoWo.png'
        },
        {
          address: '0x0E8D5504bF54D9E44260f8d153EcD5412130CaBb', // UNCL
          icon: 'https://i.imgur.com/XuKS0pu.png'
        }
      ],
      'Pancakeswap V2': [
        {
          address: '0x09a6c44c3947B69E2B45F4D51b67E6a39ACfB506', // UNCX
          icon: 'https://i.imgur.com/HJDDoWo.png'
        },
        {
          address: '0x0E8D5504bF54D9E44260f8d153EcD5412130CaBb', // UNCL
          icon: 'https://i.imgur.com/XuKS0pu.png'
        }
      ],
      'Julswap V1': [
        {
          address: '0x09a6c44c3947B69E2B45F4D51b67E6a39ACfB506', // UNCX
          icon: 'https://i.imgur.com/HJDDoWo.png'
        },
        {
          address: '0x0E8D5504bF54D9E44260f8d153EcD5412130CaBb', // UNCL
          icon: 'https://i.imgur.com/XuKS0pu.png'
        }
      ]
    }
    this.tokenChips = tokenChips[this.$store.state.exchange]
    this.fetchUniswapTokenCount()
    this.normalLoad()
  }
}
</script>