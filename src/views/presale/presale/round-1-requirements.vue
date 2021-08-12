<template>
  <div class="">

    <div v-if="loading" class="text-center">
      <v-progress-circular
      indeterminate
      size="70"
      color="#aaa">
        <img 
        src="@/assets/img/UNCX_fill.svg" 
        height="60px"
        width="60px"
        class="greyscale">
      </v-progress-circular>
    </div>

    <template v-else>
      <template v-if="tokens.length > 0">
        <div class="pa-4 textFaint--text text-center">
          <div class="title text--text">
            <!--Round 1: Lasts {{ presaleDurationHuman }} -->
            Round 1 Requirements
          </div>
          To participate in round 1 you need to hold at least the specified amount of ONE of the following tokens.
        </div>

        <token-row v-for="(token, index) of tokens" :key="token.token.address" :token="token.token" :amount="token.amount" 
        :class="{'border-b': index != tokens.length -1}">
        </token-row>
      </template>

      <div v-else>
        UNCX and UNCL holding requirements have been waived for round 1 of this presale!
      </div>
    </template>
  </div>
</template>

<script>
import PresaleSettingsContract from '@/smart-contracts/presales/presale-settings'
import TokenRow from './roun-1-req-row'
import moment from 'moment'

export default {
  props: {
    round1Length: {
      type: String,
      default: '0'
    }
  },

  data: () => ({
    tokens: [],
    loading: true
  }),

  components: {
    TokenRow
  },

  computed: {
    presaleDurationHuman () {
      var duration = this.round1Length * this.$store.state.blocksPerSecond
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
  },

  methods: {
    async getTokens () {
      var numPresales = await PresaleSettingsContract.earlyAccessTokensLength()
      var tokens = []
      for (var i = 0; i < numPresales; i++) {
        var tokenInfo = await PresaleSettingsContract.getEarlyAccessTokenAtIndex(i)
        tokens.push(tokenInfo)
      }
      this.tokens = tokens
      this.loading = false
    },
    refresh () {
      this.getTokens()
    }
  },

  created () {
    this.refresh()
  }
}
</script>