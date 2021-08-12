<template>
  <v-container style="max-width: 600px;">
    
    <v-slide-y-transition appear>
    <div :class="['mb-16', {'foreground v-card br-20': $vuetify.breakpoint.xs}, {'v-card br-20 foreground': !$vuetify.breakpoint.xs}]">
      
      <div class="py-6 title text-center textFaint--text">
        Our services
      </div>

      <router-link 
      to="/services/lock-liquidity"
      v-slot="{ navigate }">
        <div class="d-flex align-center c-list pa-4 border-b" @click="navigate">
          <img 
          src="@/assets/img/icons/padlock.svg" 
          height="60px"
          width="60px"
          class="mr-3">

          <div>
            <div class="">
              Liquidity Locker
            </div>
            <div class="caption textFaint--text">
              Lock Liquidity tokens
            </div>
          </div>
        </div>
      </router-link>

      <router-link 
      to="/services/lock-tokens"
      v-slot="{ navigate }">
        <div class="d-flex align-center c-list pa-4 border-b" @click="navigate">
          <img 
          src="@/assets/img/icons/padlock.svg" 
          height="60px"
          width="60px"
          class="mr-3">
          <div>
            <div class="">
              Token Locker
            </div>
            <div class="caption textFaint--text">
              Lock your ERC20 team tokens
            </div>
            <div class="caption textFaint--text">
              Send tokens to someone else that are locked for a configurable period
            </div>
          </div>
        </div>
      </router-link>

      <router-link 
      to="/services/minter"
      v-slot="{ navigate }">
        <div class="d-flex align-center c-list pa-4 border-b" @click="navigate">
          <img 
          src="@/assets/img/icons/token.svg" 
          height="60px"
          width="60px"
          class="mr-3">
          <div>
            <div class="">
              Token Minter
            </div>
            <div class="caption textFaint--text">
              Create your own ENMT Token. ENMT tokens are fully ERC20 compliant Non-Mintable Tokens (fixed supply).
            </div>
            <div class="caption textFaint--text">
              Requires no coding skills and no additional audits.
            </div>
          </div>
        </div>
      </router-link>

      <router-link 
      to="/services/launchpad"
      v-slot="{ navigate }">
        <div class="d-flex align-center c-list pa-4" @click="navigate">
          <img 
          src="@/assets/img/icons/rocket.svg" 
          height="60px"
          width="60px"
          class="mr-3">
          <div>
            <div class="">
              LaunchPad
            </div>
            <div class="caption textFaint--text">
              Raise capital to kick start your blockchain project
            </div>
            <div class="caption textFaint--text">
              Decentalised presale service
            </div>
          </div>
        </div>
      </router-link>
      
    </div>
    </v-slide-y-transition>
    
  </v-container>
</template>

<script>
export default {

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