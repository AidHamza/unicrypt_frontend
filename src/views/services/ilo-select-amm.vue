<template>
  <v-container style="max-width: 600px;">

    <v-slide-x-transition appear>
      <div :class="['mb-16 pa-4', {'foreground v-card br-20': $vuetify.breakpoint.xs}, {'v-card br-20 foreground': !$vuetify.breakpoint.xs}]">
        
        <div class="text-center">
          <img 
          src="@/assets/img/icons/rocket.svg" 
          height="60px"
          width="60px"
          class="">
        </div>

        <div class="title text-center textFaint--text">
          Launchpad
        </div>

        <div class="text-center py-2 mb-5">
          <div class="textFaint--text">
            Selected network
          </div>
          <v-btn large block outlined @click="$root.$dialog.chainSwitcher.open()" class="title">
            <img 
            :src="$settings.CHAINS[$store.state.requiredNetwork].icon" 
            height="24px"
            width="24px"
            class="mr-3 br-20">
            {{ $settings.CHAIN_DISPLAY_NAME[$store.state.requiredNetwork] }}
            <v-icon small color="">mdi-chevron-down</v-icon>
          </v-btn>
        </div>

        <div class="text-center mb-2">
          Launch your token on which exchange?
        </div>

        <div v-for="amm of amms" :key="amm" class="v-card d-flex align-center title c-list pa-4 br-20 mb-2" @click="selectExchange(amm)">
          <img 
          :src="$settings.AMMS[amm].icon" 
          height="40px"
          width="40px"
          class="mr-3 br-20">
          <div>
            <div class="title">
              {{ amm }}
            </div>
            <div class="caption textFaint--text">
              {{ $settings.CHAIN_DISPLAY_NAME[$store.state.requiredNetwork] }}
            </div>
          </div>
        </div>

      </div>
    </v-slide-x-transition>
    
  </v-container>
</template>

<script>

export default {

  data: () => ({
    amms: [] // ['uniswap', 'sushiswap']
  }),

  computed: {
    requiredNetwork () {
      return this.$store.state.requiredNetwork
    },
  },

  watch: {
    requiredNetwork () {
      this.refresh()
    }
  },

  methods: {
    selectExchange (exchange) {
      this.$store.commit('switchExchange', exchange)
      this.$root.ammLink(`/ilo/create`)
    },
    refresh () {
      this.amms = Object.keys(this.$settings.AMMS).filter(key => this.$settings.AMMS[key].chain === this.$store.state.requiredNetwork)
    }
  },

  created () {
    this.refresh()
  }
}
</script>