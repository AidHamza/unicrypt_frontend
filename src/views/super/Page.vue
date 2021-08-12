<template>
  <v-container style="max-width: 600px;">

    <v-card class="mb-2 br-20">

      <div v-if="false" class="mt-5 mb-5 d-flex align-center white pa-3 r-outlined ml-2 br-20 mr-2 background">
        <c-input :value.sync="apiKey" placeholder="Key">
        </c-input>
      </div>

      <v-btn x-large text :color="tab === 0 ? 'primary' : ''" @click="tab = 0">
        Cron
      </v-btn>
      <v-btn x-large text :color="tab === 1 ? 'primary' : ''" @click="tab = 1">
        Jobs
      </v-btn>
    </v-card>

    <cron-card></cron-card>
    <set-pair-fishy></set-pair-fishy>
    <set-token-fishy class="mt-3"></set-token-fishy>
    <liquidity-fees-card class="mt-3"></liquidity-fees-card>

    <!--
    <keep-alive>
      <lock-page v-if="tab === 0"></lock-page>
      <withdraw-page v-if="tab === 1"></withdraw-page>
    </keep-alive>
    -->

  </v-container>
</template>

<script>
import CronCard from './cron'
import SetPairFishy from './set-pair-fishy'
import SetTokenFishy from './set-token-fishy'
import LiquidityFeesCard from './liquidity-fees'
// import WithdrawPage from './withdraw/WithdrawPage'

export default {
  name: 'CronTab',
  components: {
    CronCard,
    SetPairFishy,
    SetTokenFishy,
    LiquidityFeesCard
    // WithdrawPage
  },

  data: () => ({
    apiKey: '',
    tab: 0
  }),

  methods: {
  }
}
</script>