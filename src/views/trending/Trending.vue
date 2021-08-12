<template>
  <v-container :style="`max-width: ${$vuetify.breakpoint.xs ? '600px': '1100px'};`" :class="[{'pa-0 foreground mobile-page': $vuetify.breakpoint.xs}]">

    <template v-if="$vuetify.breakpoint.mdAndUp">
      <div class="v-card br-20 pa-4 mb-3">
        <div class="title primary--text text-center font-weight-bold">
          ${{ tvalHumanFormat(tvalLocked) }} TVL
        </div>
        <div class="text-center caption textFaint--text">
          Total Value locked across all AMMS
        </div>
      </div>

      <v-row dense class="ma-0">
        <v-col cols="12" md="6">
          <buy-tokens></buy-tokens>

          <div v-if="numPresales > 0" class="v-card br-20 mb-4">
            <template>
              <div class="title d-flex align-center text-center mb-1 mb-6 background pa-4">
                <img 
                src="@/assets/img/icons/rocket.svg" 
                height="40px"
                width="40px"
                class="mr-4">
                Unicrypt Incubated ILOs
              </div>
            </template>

            <div class="pa-2">
              <template v-for="exchange of Object.keys(presales)">
                <template v-if="presales[exchange].length > 0">
                  <div v-if="false" class="pa-2 d-flex align-center" :key="`${exchange}-ilo`">
                    <img 
                    :src="$settings.AMMS[exchange].icon" 
                    height="26px"
                    width="26px"
                    class="mr-2 br-20">
                    {{ exchange }}
                    <v-spacer></v-spacer>

                    <v-btn color="textFaint" small rounded outlined @click="goToPresales(exchange)">
                      View all
                      <v-icon small>
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>

                  </div>
                  <presale-row
                  @click.native="goToPresale(presale)"
                  v-for="presale of presales[exchange]" 
                  :key="presale.presale_contract"
                  :exchange="presale.exchange"
                  :presale="presale"
                  >
                  </presale-row>
                </template>
              </template>
            </div>
          </div>

          <v-slide-x-transition appear>
            <div :class="['mb-16', {'pa-4': $vuetify.breakpoint.xs}, {'v-card br-20': !$vuetify.breakpoint.xs}]">
              
              <template v-if="presalesLoading">
                <div class="text-center pa-8">
                  <v-progress-circular
                  indeterminate
                  size="80"
                  width="3"
                  color="textFaint">
                    <v-icon color="textFaint" size="50">mdi-lock-outline</v-icon>
                  </v-progress-circular>
                </div>
              </template>
              <v-scroll-y-transition>
                <div v-if="!presalesLoading">

                  <div class="pa-4 d-flex align-center mb-1 mb-6 background">
                    <v-icon color="text" size="22" class="mr-2">mdi-lock-outline</v-icon>
                    New Liquidity Locks (>100k)a
                  </div>

                  <template v-for="exchange of Object.keys(locks)">
                    <div :key="`${exchange}-lock`" class="">a
                      <div v-if="false" class="pr-4 border-b d-flex align-center text-center py-2">
                        <v-btn color="text" text rounded @click="goToLocks(exchange)">
                          <img 
                          :src="$settings.AMMS[exchange].icon" 
                          height="24px"
                          width="24px"
                          class="mr-2 br-20">
                          {{ exchange }}
                          <v-icon small>
                            mdi-chevron-right
                          </v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <div class="text-end">
                          <div class="text--text font-weight-medium">
                          ${{ tvalHumanFormat(tval[exchange].tval) }} Locked
                          </div>
                          <div class="textFaint--text caption">
                          in {{ tval[exchange].pair_count }} pairs
                          </div>
                        </div>
                      </div>{{exchange}}
                      <lock-row
                      v-for="item of locks[exchange]" 
                      :key="item.address"
                      :exchange="item.exchange"
                      class="border-b"
                      :item="item">
                      </lock-row>
                    </div>
                  </template>

                </div>
              </v-scroll-y-transition>
              
            </div>
          </v-slide-x-transition>
        </v-col>
        <v-col cols="12" md="6">
          
          <a href="https://unicrypt.network/community-campaign" class="deadlink" target="_blank">
            <div class="primary-pulse pa-1 br-20 mb-3">
              <div class="border primary white--text br-20 pa-4 c-list">
                <div class="title text-center font-weight-bold">
                  Community Campaign now LIVE
                </div>
                <div class="text-center">
                  Earn USDC by completing educational tasks.
                </div>
                <div class="text-center caption font-italic">
                  Click here to find out more!
                </div>
              </div>
            </div>
          </a>

          <services-card class="v-card mb-4 br-20"></services-card>

          <div :class="['mb-16', {'pa-4': $vuetify.breakpoint.xs}, {'v-card br-20': !$vuetify.breakpoint.xs}]">

            <div class="pa-4 d-flex align-center mb-1 mb-6 background">
              <v-icon color="text" size="22" class="mr-2">mdi-lock-outline</v-icon>
              New Token Locks
            </div>

            <div class="mt-2 br-20">
              <div class="pa-3 d-flex align-center">
                <img 
                :src="$settings.CHAINS['Mainnet'].icon" 
                height="24px"
                width="24px"
                class="mr-3 br-20">
                Mainnet
              </div>
              <global-tokens chain="Mainnet"></global-tokens>
            </div>

            <div class="mt-2 br-20">
              <div class="pa-3 d-flex align-center">
                <img 
                :src="$settings.CHAINS['BSC_MAINNET'].icon" 
                height="24px"
                width="24px"
                class="mr-3 br-20">
                Binance smart chain
              </div>
              <global-tokens chain="BSC_MAINNET"></global-tokens>
            </div>

            <div class="mt-2 br-20">
              <div class="pa-3 d-flex align-center">
                <img 
                :src="$settings.CHAINS['xDai'].icon" 
                height="24px"
                width="24px"
                class="mr-3 br-20">
                xDai
              </div>
              <global-tokens chain="xDai"></global-tokens>
            </div>

            <div class="mt-2 br-20">
              <div class="pa-3 d-flex align-center">
                <img 
                :src="$settings.CHAINS['Matic'].icon" 
                height="24px"
                width="24px"
                class="mr-3 br-20">
                Matic
              </div>
              <global-tokens chain="Matic"></global-tokens>
            </div>

            <div class="mt-2 br-20">
              <div class="pa-3 d-flex align-center">
                <img 
                :src="$settings.CHAINS['Kovan'].icon" 
                height="24px"
                width="24px"
                class="mr-3 br-20">
                Kovan
              </div>
              <global-tokens chain="Kovan"></global-tokens>
            </div>

          </div>
        </v-col>
      </v-row>
    </template>

    <div v-else :class="['mb-16']">
      <div class="text-center mb-4 px-4 pt-2">
        <v-btn text rounded @click="mobileTab = 0" :color="mobileTab === 0 ? 'primary' : 'textFaint'">
          Dashboard
        </v-btn>
        <v-btn text rounded @click="mobileTab = 1" :color="mobileTab === 1 ? 'primary' : 'textFaint'">
          Services
        </v-btn>
      </div>

      <template v-if="mobileTab === 0">

        <a href="https://unicrypt.network/community-campaign" class="deadlink" target="_blank">
          <div class="primary-pulse pa-1 mx-2 br-20 mb-3">
            <div class="border primary white--text br-20 pa-4 c-list">
              <div class="title text-center font-weight-bold">
                Community Campaign now LIVE
              </div>
              <div class="text-center">
                Earn USDC by completing educational tasks.
              </div>
              <div class="text-center caption font-italic">
                Click here to find out more!
              </div>
            </div>
          </div>
        </a>

        <div class="v-card br-20 pa-4 mx-2 mb-3">
          <div class="title primary--text text-center font-weight-bold">
            ${{ tvalHumanFormat(tvalLocked) }} TVL
          </div>
          <div class="text-center caption textFaint--text">
            Total Value locked across all AMMS
          </div>
        </div>

        <buy-tokens class="mx-2"></buy-tokens>

        <div v-if="numPresales > 0" class="br-20 mb-4 mx-2">

          <div class="text-center mt-10">
            <img 
            src="@/assets/img/icons/rocket.svg" 
            height="40px"
            width="40px"
            class="">
            <div class="text-center title mb-4">
              Unicrypt Incubated ILOs
            </div>
          </div>

          <div class="pa-2">
            <template v-for="exchange of Object.keys(presales)">
              <template v-if="presales[exchange].length > 0">
                <div v-if="false" class="pa-2 d-flex align-center" :key="`${exchange}-ilo`">
                  <img 
                  :src="$settings.AMMS[exchange].icon" 
                  height="26px"
                  width="26px"
                  class="mr-2 br-20">
                  {{ exchange }}
                  <v-spacer></v-spacer>

                  <v-btn color="textFaint" small rounded outlined @click="goToPresales(exchange)">
                    View all
                    <v-icon small>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>

                </div>
                <presale-row
                @click.native="goToPresale(presale)"
                v-for="presale of presales[exchange]" 
                :key="presale.presale_contract"
                :exchange="presale.exchange"
                :presale="presale"
                >
                </presale-row>
              </template>
            </template>
          </div>
        </div>

        <template v-if="presalesLoading">
          <div class="text-center">
            <v-progress-circular
            indeterminate
            size="80"
            width="3"
            color="textFaint">
              <v-icon color="textFaint" size="50">mdi-lock-outline</v-icon>
            </v-progress-circular>
          </div>
        </template>
        <v-scroll-y-transition>
          <div v-if="!presalesLoading">

            <div class="text-center mt-10">
              <img 
              src="@/assets/img/icons/padlock.svg" 
              height="40px"
              width="40px"
              class="greyscale">
              <div class="text-center textFaint--text mb-4">
                New Liquidity Locks (>100k)
              </div>
            </div>

            <template v-for="exchange of Object.keys(locks)">
              <div :key="`${exchange}-lock`" class="">
                <div v-if="false" class="pr-4 border-b d-flex align-center text-center py-2">
                  <v-btn color="text" text rounded @click="goToLocks(exchange)">
                    <img 
                    :src="$settings.AMMS[exchange].icon" 
                    height="24px"
                    width="24px"
                    class="mr-2 br-20">
                    {{ exchange }}
                    <v-icon small>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <div class="text-end">
                    <div class="text--text font-weight-medium">
                    ${{ tvalHumanFormat(tval[exchange].tval) }} Locked
                    </div>
                    <div class="textFaint--text caption">
                    in {{ tval[exchange].pair_count }} pairs
                    </div>
                  </div>
                </div>
                <lock-row
                v-for="item of locks[exchange]" 
                :key="item.address"
                :exchange="item.exchange"
                class="border-b"
                :item="item">
                </lock-row>
              </div>
            </template>

            <div>

              <div class="text-center mt-10">
                <img 
                src="@/assets/img/icons/padlock.svg" 
                height="40px"
                width="40px"
                class="greyscale">
                <div class="text-center textFaint--text mb-4">
                  New Token Locks
                </div>
              </div>

              <div class="mt-2 br-20">
                <div class="pa-3 d-flex align-center justify-center">
                  <img 
                  :src="$settings.CHAINS['Mainnet'].icon" 
                  height="24px"
                  width="24px"
                  class="mr-3 br-20">
                  Mainnet
                </div>
                <global-tokens chain="Mainnet"></global-tokens>
              </div>

              <div class="mt-2 br-20">
                <div class="pa-3 d-flex align-center justify-center">
                  <img 
                  :src="$settings.CHAINS['BSC_MAINNET'].icon" 
                  height="24px"
                  width="24px"
                  class="mr-3 br-20">
                  Binance smart chain
                </div>
                <global-tokens chain="BSC_MAINNET"></global-tokens>
              </div>

              <div class="mt-2 br-20">
                <div class="pa-3 d-flex align-center justify-center">
                  <img 
                  :src="$settings.CHAINS['xDai'].icon" 
                  height="24px"
                  width="24px"
                  class="mr-3 br-20">
                  xDai
                </div>
                <global-tokens chain="xDai"></global-tokens>
              </div>

              <div class="mt-2 br-20">
                <div class="pa-3 d-flex align-center justify-center">
                  <img 
                  :src="$settings.CHAINS['Matic'].icon" 
                  height="24px"
                  width="24px"
                  class="mr-3 br-20">
                  Matic
                </div>
                <global-tokens chain="Matic"></global-tokens>
              </div>

              <div class="mt-2 br-20">
                <div class="pa-3 d-flex align-center justify-center">
                  <img 
                  :src="$settings.CHAINS['Kovan'].icon" 
                  height="24px"
                  width="24px"
                  class="mr-3 br-20">
                  Kovan
                </div>
                <global-tokens chain="Kovan"></global-tokens>
              </div>
              
            </div>

          </div>
        </v-scroll-y-transition>
      </template>

      <template v-else-if="mobileTab === 1">
        <div>

          <services-card class="v-card mb-4 br-20"></services-card>

        </div>
      </template>
    </div>
    
  </v-container>
</template>

<script>
import SETTINGS from '@/store/settings'
import axios from 'axios'
import LockRow from '@/views/pairs/row'
import PresaleRow from '@/views/presale/presales/row'
import GlobalTokens from '@/views/locker/erc20/global-token/GlobalTokens'
import BuyTokens from './buy-uncx-uncl'
import ServicesCard from './services'

export default {

  components: {
    PresaleRow,
    LockRow,
    GlobalTokens,
    BuyTokens,
    ServicesCard
  },

  data: () => ({
    presales: {
      'Uniswap V2': [],
      'Honeyswap V1': [],
      'Pancakeswap V1': [],
      'Pancakeswap V2': [],
      'Julswap V1': [],
      'Sushiswap V1': [],
      'Quickswap V1': [],
    },
    locks: {
      'Uniswap V2': [],
      'Pancakeswap V2': [],
      'Pancakeswap V1': [],
      'Julswap V1': [],
      'Sushiswap V1': [],
      'Quickswap V1': [],
      'Honeyswap V1': [],
    },
    tval: {
      'Uniswap V2': '',
      'Honeyswap V1': '',
      'Pancakeswap V1': '',
      'Pancakeswap V2': '',
      'Julswap V1': '',
      'Sushiswap V1': '',
      'Quickswap V1': '',
    },
    presalesLoading: true,
    locksLoading: true,
    mobileTab: 0
  }),

  computed: {
    numPresales () {
      var length = Object.keys(this.presales).reduce((a, exchange) => { return a + this.presales[exchange].length }, 0)
      return length
    },
    tvalLocked () {
      var tval = Object.keys(this.tval).reduce((a, exchange) => { return a + (parseInt(this.tval[exchange].tval) || 0) }, 0)
      return tval
    }
  },

  methods: {
    tvalHumanFormat (tval) {
      var amount = parseInt(tval)
      if (amount >= 1000000) {
        var deci = Number(amount / 1000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return deci + 'M'
      } else if (amount > 1000) {
        return Math.floor(amount / 1000) + 'k'
      }
      return amount || 0
    },
    goToPresale (presale) {
      // this.$store.commit('switchExchange', presale.exchange)
      this.$root.ammLinkTwo(`/ilo/${presale.presale_contract}`, presale.exchange)
    },
    goToPresales (exchange) {
      this.$root.ammLinkTwo(`/ilos`, exchange)
    },
    goToLocks (exchange) {
      this.$root.ammLinkTwo(`/pairs`, exchange)
    },
    async loadToken (address, exchange) {
      var presale_response = await axios.get(`${SETTINGS.AMMS[exchange].server}/presales/info/${address}`)
      var presale = presale_response.data
      var token_response = await axios.get(`${SETTINGS.AMMS[exchange].server}/erc20/token/${presale.s_token}`)
      var token = token_response.data
      token.exchange = exchange
      token.presale_contract = address
      this.tokens.push(token)
    },
    async getPresales (exchange) {
      var page = 0
      var filters = {
        sort: 'start_block',
        sortAscending: true,
        search: '',
        hide_flagged: false,
        hot_only: true
      }
      var response = await axios.post(`${SETTINGS.AMMS[exchange].server}/presales/search`, {filters: filters, page: page, stage: 0})
      var presales = response.data.rows
      presales.map(item => {
        item.exchange = exchange
      })
      this.presales[exchange] = presales
    },
    async getAll () {
      await Promise.all([
        this.getPresales('Uniswap V2'),
        this.getPresales('Pancakeswap V1'),
        this.getPresales('Pancakeswap V2'),
        this.getPresales('Honeyswap V1'),
        this.getPresales('Julswap V1'),
        this.getPresales('Sushiswap V1'),
        this.getPresales('Quickswap V1'),

        this.getNewLocks('Uniswap V2'),
        this.getNewLocks('Honeyswap V1'),
        this.getNewLocks('Pancakeswap V1'),
        this.getNewLocks('Pancakeswap V2'),
        this.getNewLocks('Julswap V1'),
        this.getNewLocks('Sushiswap V1'),
        this.getNewLocks('Quickswap V1'),

        this.getTVAL('Uniswap V2'),
        this.getTVAL('Honeyswap V1'),
        this.getTVAL('Pancakeswap V1'),
        this.getTVAL('Pancakeswap V2'),
        this.getTVAL('Julswap V1'),
        this.getTVAL('Sushiswap V1'),
        this.getTVAL('Quickswap V1'),
      ])
    },
    async getNewLocks (exchange) {
      var page = 0
      var filters = {
        rowsPerPage: 10,
        sort: 'most_recent_lock',
        sortAscending: false,
        search: ''
      }
      var response = await axios.post(`${SETTINGS.AMMS[exchange].server}/uniswap/search`, {filters: filters, page: page})
      var locks = response.data.rows
      locks.map(item => {
        item.exchange = exchange
      })
      locks = locks.filter(item => item.locked_usd > 100000)
      this.locks[exchange] = locks
      console.log("locks===>", this.locks);
    },
    async getTVAL (exchange) {
      var response = await axios.get(`${SETTINGS.AMMS[exchange].server}/pol/lock-stats`)
      this.tval[exchange] = response.data
    }
  },

  created () {
    // this.loadToken('0x67A6EaBB1fB634cdFe5636688961556260C48629', 'Pancakeswap')
    this.getAll()
      .catch(e => {})
      .then(() => {
        this.presalesLoading = false
      })
  }
}
</script>