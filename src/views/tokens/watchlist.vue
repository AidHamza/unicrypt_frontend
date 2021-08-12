<template>
  <div>

    <div v-if="false" class="title textFaint--text font-weight-bold pa-4">
      {{ $store.state.exchange }} Watchlist <!--<span v-if="uniswapTokenCount"> {{ uniswapTokenCount }} </span> -->
    </div>

    <div v-if="!loggedIn" class="pa-8 text-center">
      <v-icon size="100" color="textFaint">mdi-account-outline</v-icon>
      <div>
        Please log in to access this section
      </div>
      <v-btn x-large outlined block rounded to="/account/social-profile" class="grad-green white--text mt-2">
        LOG IN
      </v-btn>
    </div>
    <div v-else class="mb-16">

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

      <v-scroll-x-transition>
        <div v-if="!firstLoad">

          <div v-if="watchlist.length === 0" class="pa-8 text-center">
            <div class="title">
              No tokens in your {{ $store.state.exchange }} watchlist
            </div>
            <div class="caption mt-2 textFaint--text">
              Add tokens from the 'All tokens' list by clicking on a token and selecting 'Add to watchlist'.
            </div>
          </div>

          <template v-else>
            <div class="d-flex align-center t-small justify-end pr-6">
              <v-btn small rounded outlined @click="complexMode = !complexMode">
                <v-icon v-if="complexMode" small color="primary" class="mr-2">mdi-eye</v-icon>
                <v-icon v-else small class="mr-2">mdi-eye-off</v-icon>
                {{ complexMode ? 'Complex' : 'Simple'}}
              </v-btn>
            </div>

            <div>
              <token-row
              v-for="item of watchlist" 
              :key="item.address"
              :item="item"
              :mode="complexMode ? 0 : 1">
              </token-row>
            </div>
          </template>
        </div>
      </v-scroll-x-transition>

    </div>
  
  </div>
</template>

<script>
import TokenRow from './token-row'

export default {
  components: {
    TokenRow
  },

  data: () => ({
    watchlist: [],
    complexMode: true,
    firstLoad: true
  }),
  
  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    loggedIn () {
      return this.$store.state.user.username
    },
    watchlistLastUpdated () {
      return this.$store.state.user.watchlistLastUpdated
    }
  },

  watch: {
    watchlistLastUpdated () {
      this.fetchWatchlist()
    }
  },

  methods: {
    async fetchWatchlistCall () {
      if (!this.loggedIn) {
        return
      }
      var data = {exchange: this.$store.state.exchange}
      var response = await this.$userAxios.post(`/users/get-watchlist`, data)
      var watchlist = response.data
      var exchangeWatchlist = ((watchlist[this.$store.state.requiredNetwork] || {})[this.$store.state.exchange] || {})
      // console.log(exchangeWatchlist)

      var data2 = {watchlist: exchangeWatchlist}
      var response2 = await this.$axios.post(`/users/hydrate-watchlist`, data2)
      this.watchlist = response2.data.watchlist
    },
    async fetchWatchlist () {
      this.fetchWatchlistCall()
        .catch(error => {
          console.log(error)
        })
        .then(() => {
          this.firstLoad = false
        })
    }
  },

  created () {
    this.fetchWatchlist()
  }

}
</script>