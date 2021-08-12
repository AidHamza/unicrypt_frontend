<template>
  <v-container style="max-width: 600px;" :class="[{'pa-0 foreground mobile-page': $vuetify.breakpoint.xs}]">

    <v-slide-x-transition appear>
      <v-card :class="['br-20', {'pa-4': $vuetify.breakpoint.xs}, {'pa-6': !$vuetify.breakpoint.xs}]">

        <div class="d-flex align-center mb-6">
          <div class="display-1 font-weight-bold">
            Locker
          </div>
        </div>
        
        <!--
        <div class="text-center py-2 mb-5">
          <div class="textFaint--text">
            Selected network
          </div>
          <v-btn large block outlined to="/chain?redirect=locker" class="title">
            <img 
            :src="$settings.CHAINS[$store.state.requiredNetwork].icon" 
            height="24px"
            width="24px"
            class="mr-3 br-20">
            {{ $settings.CHAIN_DISPLAY_NAME[$store.state.requiredNetwork] }}
            <v-icon small color="">mdi-chevron-down</v-icon>
          </v-btn>
        </div>
        -->

        <div class="text-center title textFaint--text mb-4">
          Which tokens would you like to lock?
        </div>

        <v-row dense class="title text-center">
          <v-col cols="6">
            <v-card class="pa-6 br-8 c-list" :to="`${$store.state.chainPrefix}/locker/erc20`">
              ERC20 tokens
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="pa-6 br-8 c-list" :to="`${$store.state.chainPrefix}/locker/amm`">
              Liquidity tokens
            </v-card>
          </v-col>
        </v-row>

      </v-card>
    </v-slide-x-transition>
    
  </v-container>
</template>

<script>

export default {
}
</script>