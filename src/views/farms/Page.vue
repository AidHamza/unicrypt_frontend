<template>
  <v-container style="max-width: 600px;" :class="[{'pa-0 foreground mobile-page': $vuetify.breakpoint.xs}]">
    
    <v-slide-y-transition appear>
      <div :class="['mb-16', {'pa-4': $vuetify.breakpoint.xs}, {'v-card pa-6 br-20': !$vuetify.breakpoint.xs}]">

        <div class="mb-3 display-1 text-center textFaint--text">
          FARMS
        </div>

        <div class="py-6 textFaint--text text-center">
          V2 is coming soon to all chains, natively in the main app! In the meantime, please use the V1 dedicated app for ETH Mainnet.
        </div>

        <v-btn block large outlined href="https://farm.unicrypt.network">
          <span class="font-weight-medium">Farms V1 (ETH Mainnet)</span>
        </v-btn>
        
      </div>
    </v-slide-y-transition>
    
  </v-container>
</template>

<script>
export default {

  components: {
  },

  data: () => ({
  }),

  computed: {
  },

  methods: {
  },

  created () {
  }
}
</script>