<template>
  <div :class="['br-20 v-card', {'pa-4': $vuetify.breakpoint.xs}, {'pa-8': !$vuetify.breakpoint.xs}]">

    <v-btn icon v-if="stage > 0" text @click="stage > 0 ? stage-- : ''" class="mb-4 pa-0">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>

    <one-select-pair v-if="stage === 0" @on-continue="continueOne"></one-select-pair>

    <two-withdraw v-if="stage === 1" :uniPair="uniPair"></two-withdraw>

  </div>

</template>

<script>
import OneSelectPair from './one-select-pair'
import TwoWithdraw from './two-withdraw'

export default {
  components: {
    OneSelectPair,
    TwoWithdraw,
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
  }
}
</script>