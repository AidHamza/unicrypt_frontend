<template>
  <div :class="['v-card br-8 mb-6 cursor-pointer']">

    <div v-if="presale.hot" class="d-flex caption justify-end align-center px-4 py-2 border-b">
      Incubated by Unicrypt
      <img 
      src="@/assets/img/icons/rocket.svg" 
      height="30px"
      width="30px"
      class="ml-2 br-c primary-pulse">
    </div>

    <div :class="[{'pa-6': !$vuetify.breakpoint.xs}, {'pa-4': $vuetify.breakpoint.xs}]">

      <template>

        <div v-if="presale.stage === 0" :class="`caption font-weight-bold text-center ${textColor}--text`">
          <template v-if="!firstLoad">
            Starts {{ dateStartBlockHuman }} local time
          </template>
          <span v-else class="font-weight-medium textFaint--text">
            ...loading
          </span>
        </div>

        <div class="d-flex align-center justify-end">
          <div class="caption font-weight-medium border px-2 br-c textFaint--text" style="position: relative; overflow: hidden;">
            <div style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
            </div>
            <span v-if="firstLoad">
              <v-progress-circular
              indeterminate
              size="5"
              width="1"
              :color="auditColor">
              </v-progress-circular>
            </span>
            <span v-else-if="presaleStage === 0">
              Duration {{ presaleDurationHuman }}
            </span>
            <span v-else-if="presaleStage === 1 || presaleStage === 2">
              Ends {{ timeToEndBlock }}
            </span>
            <span v-else>
              Presale ended
            </span>
          </div>

          <!-- PRESALE STAGE -->
          <template v-if="!firstLoad">
            <div class="caption font-weight-medium border px-2 br-c textFaint--text" style="position: relative; overflow: hidden;">
              <div style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">

              </div>
              <span>{{ presaleStageString }}</span>
              &nbsp;
              <span v-if="presaleStage === 0" class="text-uppercasee">{{ timeToStartBlock }}</span>
            </div>
          </template>
          <!-- PRESALE STAGE -->
        </div>

        <div class="d-flex align-center">

          <template v-if="tokenHydrated.address">

            <span v-if="tokenHydrated.isENMT" class="pr-1 d-flex"><enmt-badge></enmt-badge></span>

            <div v-if="presale.audit_rating === 2" class="caption d-flex align-center font-weight-medium midground pr-2 br-8" style="position: relative; overflow: hidden;">
              <div class="red" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
              </div>
              <img 
              src="@/assets/img/flags/close.svg" 
              height="16px"
              class="mr-2"
              width="16px">
              <span>
                Flagged
              </span>
            </div>

            <div v-else-if="presale.audit_rating === 1" class="caption d-flex align-center font-weight-medium midground pr-2 br-8" style="position: relative; overflow: hidden;">
              <div class="orange" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
              </div>
              <img 
              src="@/assets/img/flags/exclamation.svg" 
              height="16px"
              class="mr-2"
              width="16px">
              <span>
                Minor flags
              </span>
            </div>

            <div v-else-if="presale.audit_rating === 0" class="caption d-flex align-center font-weight-medium midground pr-2 br-20" style="position: relative; overflow: hidden;">
              <div class="green" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
              </div>
              <img 
              src="@/assets/img/flags/verified.svg" 
              height="16px"
              class="mr-2"
              width="16px">
              <span>
                Audited
              </span>
            </div>

            <div v-else-if="!tokenHydrated.isENMT" class="caption d-flex align-center font-weight-medium midground pr-2 br-20" style="position: relative; overflow: hidden;">
              <div class="red" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
              </div>
              <img 
              src="@/assets/img/flags/close.svg" 
              height="16px"
              class="mr-2"
              width="16px">
              <span>
                Audited
              </span>
            </div>
          </template>

          <div v-if="presale.kyc_rating === 0" class="caption d-flex align-center font-weight-medium midground pr-2 br-20" style="position: relative; overflow: hidden;">
            <div class="blue" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
            </div>
            <img 
            src="@/assets/img/flags/magnify.svg" 
            height="16px"
            class="mr-2"
            width="16px">
            <span>
              KYC
            </span>
          </div>

          <div v-else class="caption d-flex align-center font-weight-medium midground pr-2 br-20" style="position: relative; overflow: hidden;">
            <div class="red" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
            </div>
            <img 
            src="@/assets/img/flags/close.svg" 
            height="16px"
            class="mr-2"
            width="16px">
            <span>
              KYC
            </span>
          </div>
          
          <v-btn 
          v-if="$store.state.superUserMode && $store.state.user.jwtObject.user_id === '21'"
          @click.stop="togglePresaleHot"
          x-small rounded outlined
          color="text">
            <v-icon small>mdi-fire</v-icon>
          </v-btn>

          <div v-if="presaleStatus.whitelist_only" class="caption d-flex align-center font-weight-medium midground px-2 br-8" style="position: relative; overflow: hidden;">
            <div class="background" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
            </div>
            <span>
              <v-icon small>mdi-file-document-outline</v-icon>
            </span>
          </div>

        </div>
      </template>

      <!-- {{ dateEndBlockHuman }} {{ dateStartBlockHuman }} -->

      <div class="d-flex align-center">
        <coin-icon :url="presale.icon_url" :size="22" class="mr-2"></coin-icon>
        <v-btn text @click.stop="openTokenPage" class="title pa-0" style="min-width: 10px;">
          <span :class="['text-truncate', `${textColor}--text`]" :style="$vuetify.breakpoint.xs ? 'max-width: 10ch;' : 'max-width: 20ch;'">
            {{ presale.s_token.name }}
          </span>
          <v-icon small :color="textColor">mdi-chevron-up</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
      </div>

      <div class="d-flex align-center">

        <div :class="`text-uppercase ${textColor}--text caption font-weight-medium`">
          {{ baseTokenSymbol }} / {{ presale.s_token.symbol }}
        </div>

        <v-spacer></v-spacer>

        <div v-if="!firstLoad" 
        class="caption">
          <span :class="`ml-1 font-weight-regular caption ${textColor}--text`">
            {{ lockPeriodHuman }} lock
          </span>
        </div>
        <div v-else class="caption textFaint--text">
          ...
        </div>

      </div>

      <v-row v-if="false" class="mt-2">
        <v-col cols="6">
          {{ tokenPriceHuman }} {{ presale.s_token.symbol }} <span class="textFaint--text caption font-weight-medium">/ per {{ baseTokenSymbol }}</span>
        </v-col>
        <v-col cols="6">
          {{ listingPriceHuman }} {{ presale.s_token.symbol }} <span class="caption textFaint--text font-weight-medium">/ per {{ baseTokenSymbol }}</span>
        </v-col>
      </v-row>

      <v-row class="">
        <v-col cols="4">
          <div :class="`caption ${textColor}--text`">
            Liquidity lock
          </div>
          <div :class="`font-weight-medium d-flex align-center ${textColor}--text`">
            <div v-if="!firstLoad" 
            :class="[
            '',
            {'font-weight-bold': presaleInfo.liquidity_percent / 10 >= 60}]">
              {{ presaleInfo.liquidity_percent / 10 }}%
            </div>
            <div v-else :class="`${textColor}--text`">
              ...
            </div>

            <!--
            <v-menu
            v-if="false"
              open-on-hover
              top
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  v-on="on"
                  small
                  color="textFaint"
                >
                  mdi-information-outline
                </v-icon>
              </template>

              <div class="pa-8 foreground">
                Effective rate minus Unicrypt fee: {{ actualLiquidityPercent }}%
              </div>
            </v-menu>
            -->

          </div>
        </v-col>
        <v-col cols="4" class="text-center">
          <div :class="`caption ${textColor}--text`">
            Max spend
          </div>
          <div :class="`font-weight-medium ${textColor}--text`">
            {{ userMaxLimitHuman }} {{ baseTokenSymbol }}
          </div>
        </v-col>
        <v-col cols="4" class="text-end">
          <div :class="`caption ${textColor}--text`">
            Soft cap
          </div>
          <div :class="`font-weight-medium ${textColor}--text`">
            {{ softcapHuman }} {{ baseTokenSymbol }}
          </div>
        </v-col>
      </v-row>

      <v-progress-linear rounded striped height="4" :value="presaleProgress" 
      :color="auditColor" class="br-20">
      </v-progress-linear>
      <div class="caption d-flex align-center font-weight-medium">
        <div :class="`${textColor}--text`">
          {{ totalBaseCollectedHuman }}
        </div>
        <div :class="`px-1 ${textColor}--text`">
          /
        </div>
        <div :class="`caption ${textColor}--text d-flex font-weight-medium align-center`">
          {{ hardcapHuman }} {{ baseTokenSymbol }}
        </div>
        <v-spacer></v-spacer>
        <div :class="`d-flex align-center font-weight-medium ${textColor}--text mr-6`">
          <DisqusCount shortname='unicrypt-network' :identifier="netIdentifier" />
          <v-icon size="12" :color="textColor" class="ml-1">mdi-comment</v-icon>
        </div>
        <div :class="`d-flex align-center font-weight-medium ${textColor}--text`">
          {{ presaleStatus.num_buyers }}
          <v-icon size="12" :color="textColor" class="ml-1">mdi-account</v-icon>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import moment from 'moment'
import { ethers } from 'ethers'
import PresaleContract from '@/smart-contracts/presales/presale-contract'
// import UNIV2ABI from '@/smart-contracts/uniswap/uniswap-abis'
import { DisqusCount } from 'vue-disqus'
import SETTINGS from '@/store/settings'
import ERC20 from '@/smart-contracts/erc20/pager'

export default {
  props: {
    presale: {
      type: Object,
      default: () => {
      }
    },
    exchange: null
  },

  data: () => ({
    firstLoad: true,
    presaleInfo: {},
    presaleStatus: {},
    lastSync: 0,
    tokenHydrated: {}
  }),

  components: {
    DisqusCount
  },

  computed: {
    cExchange () {
      return this.exchange || this.$store.state.exchange
    },
    cNetwork () {
      return this.$settings.AMMS[this.cExchange].chain
    },
    textColor () {
      // return this.presale.hot ? 'white' : 'text'
      return 'text'
    },
    netIdentifier () {
      var identifier = `token_${this.presale.s_token.address}`
      return `${this.$store.state.requiredNetwork}_${identifier}`
    },
    blockNumber () {
      if (this.exchange) {
        return this.$store.state.blockNumz[this.$settings.AMMS[this.exchange].chain]
      }
      return this.$store.state.blockNumber
    },
    blocksPerSecond () {
      if (this.exchange) {
        return this.$settings.BLOCK_TIME[this.$settings.AMMS[this.exchange].chain]
      }
      return this.$store.state.blocksPerSecond
    },
    dateStartBlock () {
      var numBlocks = this.presaleInfo.start_block - this.blockNumber
      var seconds = numBlocks * this.blocksPerSecond
      var date = moment().add(seconds, 'seconds')
      return date
    },
    dateStartBlockHuman () {
      return this.dateStartBlock.format('ddd D MMM HH:mm')
    },
    timeToStartBlock () {
      return this.dateStartBlock.fromNow()
    },
    dateEndBlock () {
      var numBlocks = this.presaleInfo.end_block - this.blockNumber
      var seconds = numBlocks * this.blocksPerSecond
      var date = moment().add(seconds, 'seconds')
      return date
    },
    dateEndBlockHuman () {
      return this.dateEndBlock.format('ddd D MMM HH:mm')
    },
    timeToEndBlock () {
      return this.dateEndBlock.fromNow()
    },
    presaleBlockDuration () {
      var blockLength = Number(this.presaleInfo.end_block) - Number(this.presaleInfo.start_block)
      return blockLength
    },
    presaleDurationHuman () {
      var duration = this.presaleBlockDuration * this.blocksPerSecond
      var mdur = moment.duration(duration * 1000)
      if (mdur.days() > 0) {
        return mdur.days() + ' days'
      }
      if (mdur.hours() > 0) {
        return mdur.hours() + ' hours'
      }
      if (mdur.minutes() > 0) {
        return mdur.minutes() + ' minutes'
      }
      return mdur.seconds() + ' seconds'
    },
    softcapHuman () {
      if (this.firstLoad) {
        return 0
      }
      var amount = ethers.utils.formatUnits(this.presaleInfo.softcap, this.presale.b_token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    },
    hardcapHuman () {
      if (this.firstLoad) {
        return 0
      }
      var amount = ethers.utils.formatUnits(this.presaleInfo.hardcap, this.presale.b_token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    },
    tokenPriceHuman () {
      var amount = ethers.utils.formatUnits(this.presaleInfo.token_price, this.presale.s_token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 8})
    },
    listingPriceHuman () {
      var amount = ethers.utils.formatUnits(this.presaleInfo.listing_rate, this.presale.s_token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 8})
    },
    baseTokenSymbol () {
      return this.presale.b_token.address === this.$settings.WRAPPED_GAS_TOKEN[this.cNetwork] ? this.$settings.NATIVE_GAS_TOKEN_SYMBOL[this.cNetwork] : this.presale.b_token.symbol.toUpperCase()
    },
    lockPeriodHuman () {
      var endOfLock = moment().unix() + Number(this.presaleInfo.lock_period)
      if (endOfLock > 9999999999) {
        var diff = Number(this.presaleInfo.lock_period) - moment().unix()
        return moment.duration(diff * 1000).years() + ' Years'
      }
      var duration = moment.duration(this.presaleInfo.lock_period * 1000)
      if (duration.years() >= 1) {
        return duration.years() + ' Years'
      }
      if (duration.months() >= 1) {
        return duration.months() + ' Months'
      }
      return duration.days() + ' Days'
    },
    userMaxLimitHuman () {
      if (this.firstLoad) {
        return 0
      }
      var amount = ethers.utils.formatUnits(this.presaleInfo.max_spend_per_buyer, this.presale.b_token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    },
    presaleProgress () {
      if (this.firstLoad) {
        return 0
      }
      var percent = ethers.BigNumber.from(this.presaleStatus.total_base_collected).mul(1000).div(this.presaleInfo.hardcap)
      return percent.toNumber() / 10
      // return 0
    },
    totalBaseCollectedHuman () {
      if (this.firstLoad) {
        return 0
      }
      var amount = ethers.utils.formatUnits(this.presaleStatus.total_base_collected, this.presale.b_token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
    presaleStage () {
      if (this.firstLoad) {
        return 0
      }
      if (this.presaleStatus.lp_generation_complete) {
        return 5 // finalized
      }
      if (this.presaleStatus.force_failed) {
        return 4 // failed
      }
      if (Number(this.blockNumber) > Number(this.presaleInfo.end_block) && ethers.BigNumber.from(this.presaleStatus.total_base_collected).lt(this.presaleInfo.softcap)) {
        return 4 // failed
      }
      if (ethers.BigNumber.from(this.presaleStatus.total_base_collected).gte(this.presaleInfo.hardcap)) {
        return 3 // success
      }
      if (Number(this.blockNumber) > Number(this.presaleInfo.end_block) && ethers.BigNumber.from(this.presaleStatus.total_base_collected).gte(this.presaleInfo.softcap)) {
        return 3 // success
      }
      if (Number(this.blockNumber) >= Number(this.presaleInfo.start_block) && Number(this.blockNumber) <= Number(this.presaleInfo.end_block)) {
        if (Number(this.blockNumber) < (Number(this.presaleInfo.start_block) + Number(this.presaleStatus.round1_length))) {
          return 1 // round 1
        }
        return 2 // round 2
      }

      return 0 // awaiting start
    },
    presaleStageString () {
      var arr = ['Starts', 'LIVE: Round 1', 'LIVE: Round 2', 'Success', 'Failed', 'Markets initialized']
      return arr[this.presaleStage]
    },
    presaleStageColor () {
      var arr = ['blue', 'primary', 'primary', 'primary', 'pink', 'purple']
      return arr[this.presaleStage]
    },
    auditColor () {
      if (this.presale.audit_rating === null) {
        return 'orange'
      }
      var arr = ['green', 'orange', 'red']
      return arr[this.presale.audit_rating]
    },
    actualLiquidityPercent () {
      return (Number(this.presaleInfo.liquidity_percent) - (Number(this.presale.fees.base_fee))) / 10
    }
  },

  watch: {
    blockNumber () {
      var now = Math.round(new Date() / 1000)
      var elapsed = now - this.lastSync
      // console.log('elapsed: ' + elapsed)
      if (elapsed >= 8) {
        this.lastSync = now
        this.refresh()
      } else {
        // console.log('skipping')
      }
    }
  },

  methods: {
    logSomething () {
      console.log(this.$root.PROVIDERS)
    }, 
    togglePresaleHot () {
      var data = {
        presale_contract: this.presale.presale_contract,
      }
      this.$axios.post(`/presales/toggle-hot`, data)
        .then(response => {
          this.$root.$dialog.globalSuccess.open('Hot successfully submitted')
        })
        .catch(error => {
          this.$root.$dialog.web3Error.open(error.response.data.errors[0])
        })
    },
    async refresh () {
      var network = this.exchange ? SETTINGS.AMMS[this.exchange].chain : null
      var presale_info = await PresaleContract.presaleInfo(this.presale.presale_contract, network)
      var presaleSettings = await PresaleContract.presaleSettings(this.presale.presale_contract, network)
      var presaleFees = await PresaleContract.presaleFeeInfo(this.presale.presale_contract, network)
      this.presaleInfo = presale_info
      this.presaleStatus = presaleSettings
      this.presale.fees = presaleFees
    },
    openTokenPage () {
      this.$root.tokenPage.open(this.presale.s_token.address, this.cNetwork, this.cExchange)
    },
    async hydrateToken () {
      this.tokenHydrated = await ERC20.getERC20(this.presale.s_token.address, this.cNetwork)
    }
  },

  created () {
    // this.presaleInfo = {}
    // this.presale.status = {}
    this.hydrateToken()
    this.refresh()
      .then(() => {})
      .catch(e => { console.log(e) })
      .then(() => {
        setTimeout(() => {
          this.firstLoad = false
        }, 0)
      })
  }
}
</script>