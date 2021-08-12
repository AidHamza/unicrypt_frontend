<template>
  <v-container style="max-width: 600px;">

    <v-card v-if="$store.state.exchange === 'Uniswap'" class="pa-4 br-20 mb-2">
      <div class="caption font-weight-medium">
        We now offer Yield Farming services to virtually any ERC20 token on our all inclusive yield farming dApp.
        Boost your pairs liquidity and reward your community for providing liquidity today!
      </div>
      <div class="d-flex mt-2">
        <v-btn small href="https://farm.unicrypt.network/" target="_blank" rounded outlined class="mr-2">
          <v-icon small class="mr-2">mdi-sprout-outline</v-icon>
          Yield Farming dApp
        </v-btn>
        <!--
        <v-btn small href="https://docs.unicrypt.network/farming/create" target="_blank" rounded outlined>
          <v-icon small class="mr-2">mdi-file-document-outline</v-icon>
          Documentation
        </v-btn>
        -->
      </div>
    </v-card>

    <v-card class="mb-2 br-20">
      <v-btn x-large text :color="tab === 0 ? 'primary' : ''" @click="tab = 0">
        New Lock
      </v-btn>
      <v-btn x-large text :color="tab === 1 ? 'primary' : ''" @click="tab = 1">
        {{ $store.state.exchange === 'Pancakeswap V1' ? 'Migrate / Withdraw' : 'Edit / Withdraw' }}
      </v-btn>
      <!--
      <v-btn x-large text :color="tab === 2 ? 'primary' : ''" @click="tab = 2">
        Info
      </v-btn>
      -->
    </v-card>

    <keep-alive>
      <lock-page v-if="tab === 0"></lock-page>
      <withdraw-page v-if="tab === 1"></withdraw-page>
      <info-page v-if="tab === 2"></info-page>
    </keep-alive>

  </v-container>
</template>

<script>
import LockPage from './LockPage'
import WithdrawPage from './withdraw/WithdrawPage'
import InfoPage from './info-page.vue'

export default {
  components: {
    LockPage,
    WithdrawPage,
    InfoPage
  },

  data: () => ({
    tab: 0
  }),

  methods: {
  }
}
</script>