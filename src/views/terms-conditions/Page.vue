<template>
  <v-container style="max-width: 600px;">
    
    <v-slide-y-transition appear>
    <div :class="['mb-16', {'foreground v-card br-20': $vuetify.breakpoint.xs}, {'v-card br-20 foreground': !$vuetify.breakpoint.xs}]">
      
      <div class="py-6 title text-center textFaint--text">
        Terms and conditions
      </div>

      <router-link 
      to="/terms/privacy-policy"
      v-slot="{ navigate }">
        <div class="d-flex align-center c-list pa-4 border-b" @click="navigate">
          <v-icon color="text" size="40" class="mr-3">mdi-information-outline</v-icon>
          <div>
            <div class="title">
              Privacy Policy
            </div>
          </div>
        </div>
      </router-link>

      <router-link 
      to="/terms/general"
      v-slot="{ navigate }">
        <div class="d-flex align-center c-list pa-4 border-b" @click="navigate">
          <v-icon color="text" size="40" class="mr-3">mdi-information-outline</v-icon>
          <div>
            <div class="title">
              General
            </div>
            <div class="caption textFaint--text">
              Terms and conditions
            </div>
          </div>
        </div>
      </router-link>

      <router-link 
      to="/terms/farms"
      v-slot="{ navigate }">
        <div class="d-flex align-center c-list pa-4 border-b" @click="navigate">
          <v-icon color="text" size="40" class="mr-3">mdi-sprout-outline</v-icon>
          <div>
            <div class="title">
              Farms
            </div>
            <div class="caption textFaint--text">
              Terms and conditions
            </div>
          </div>
        </div>
      </router-link>

      <router-link 
      to="/terms/ilos"
      v-slot="{ navigate }">
        <div class="d-flex align-center c-list pa-4 border-b" @click="navigate">
          <v-icon color="text" size="40" class="mr-3">mdi-rocket</v-icon>
          <div>
            <div class="title">
              ILOs (Initial Liquidity Offerings)
            </div>
            <div class="caption textFaint--text">
              Terms and conditions
            </div>
          </div>
        </div>
      </router-link>

      <!--
      <router-link 
      to="/services/minter"
      v-slot="{ navigate }">
        <div class="d-flex align-center c-list pa-4" @click="navigate">
          <v-icon color="text" size="40" class="mr-3">mdi-leaf</v-icon>
          <div>
            <div class="title">
              Token Minter
            </div>
            <div class="caption textFaint--text">
              Create your own <span class="primary--text font-weight-bold">ENMT token</span>! ENMT tokens are fully ERC20 compliant Non-Mintable Tokens (fixed supply).
            </div>
            <div class="caption textFaint--text">
              Requires no coding skills and no additional audits.
            </div>
          </div>
        </div>
      </router-link>
      -->
      
    </div>
    </v-slide-y-transition>
    
  </v-container>
</template>

<script>
import SETTINGS from '@/store/settings'

export default {

  data: () => ({
  }),

  computed: {
  },

  methods: {
    getExchangeIcon (exchange) {
      return SETTINGS.AMMS[exchange].icon
    },
    selectExchange (exchange) {
      this.$store.commit('switchExchange', exchange)
      this.$root.ammLink(`/pairs`)
    }
  },

  created () {
  }
}
</script>