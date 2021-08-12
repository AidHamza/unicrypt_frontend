<template>
  <v-card :class="['br-20', {'pa-4': $vuetify.breakpoint.xs}, {'pa-8': !$vuetify.breakpoint.xs}]">

    <v-btn v-if="stage > 0" text @click="stage > 0 ? stage-- : ''" class="mb-4 pa-0">
      <v-icon>mdi-arrow-left</v-icon>
      Back
    </v-btn>

    <one-select-pair v-if="stage === 0" @on-continue="continueOne"></one-select-pair>

    <two-lock v-if="stage === 1" :uniPair="uniPair" @on-lock="onLock"></two-lock>

    <three-success v-if="stage === 2" :uniPair="uniPair" :lockAmount="lockAmount"></three-success>

  </v-card>

</template>

<script>
import OneSelectPair from './one-select-pair'
import TwoLock from './two-lock'
import ThreeSuccess from './three-success'

export default {
  components: {
    OneSelectPair,
    TwoLock,
    ThreeSuccess
  },

  data: () => ({
    stage: 0,
    uniPair: {},
    lockAmount: '0'
  }),

  methods: {
    continueOne (uniPair) {
      this.uniPair = uniPair
      this.stage = 1
    },
    onLock (amount) {
      this.lockAmount = amount
      this.stage = 2
    }
  }
}
</script>