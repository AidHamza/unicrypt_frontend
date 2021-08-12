<template>
  <div>
    
    <template v-if="$store.state.exchange === 'Uniswap V2'">
      <div class="caption text-center textFaint--text mb-2">
        If you cant find your lock, switch to V1 Lockers
      </div>
      <div class="text-center mb-4">
        <v-btn depressed rounded @click="version = 0" :class="{'grad-green white--text': version === 0}">
          V1
        </v-btn>
        <v-btn depressed rounded @click="version = 1" :class="{'grad-green white--text': version === 1}">
          V2
        </v-btn>
      </div>
    </template>

    <withdraw-v1 v-if="version === 0" :uniPair="uniPair"></withdraw-v1>

    <withdraw-v2 v-if="version === 1" :uniPair="uniPair"></withdraw-v2>

  </div>

</template>

<script>
import WithdrawV1 from './withdraw-v1'
import WithdrawV2 from './withdraw-v2'

export default {
  components: {
    WithdrawV1,
    WithdrawV2,
  },

  props: {
    uniPair: {
      type: Object,
      default: () => {

      }
    }
  },

  data: () => ({
    version: 1
  }),

  methods: {
  }
}
</script>