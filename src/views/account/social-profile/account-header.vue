<template>
  <div>
    <div v-if="!sEthers.coinbase" class="pa-6">
      <v-btn
      @click="connectWallet"
      outlined
      :class="['font-weight-bold']"
      rounded depressed
      >
          <span>Connect Wallet</span>
      </v-btn>
    </div>
    <div v-if="sEthers.coinbase">
      <v-row class="pa-4 ma-0 font-weight-medium foreground align-center">
        <div>
          Your wallet
        </div>
        <v-spacer></v-spacer>
      </v-row>
      <v-card outlined class="background blocks br-0 d-flex align-center pa-3">
        <img 
        src="@/assets/img/UNCL.svg"
        width="40px"
        class="">
        <div class="ml-3" style="flex: 1;">
          <div class="caption d-flex align-center white--text font-weight-medium">
            <copy-address :address="sEthers.coinbase" color="white"></copy-address>
            <v-spacer></v-spacer>
            Connected - {{ $store.state.requiredNetworkDisplayName }}
          </div>
          <div class="d-flex align-center white--text">
            {{ ethBalanceHuman }} {{ $store.state.nativeGasTokenSymbol }}
            <v-spacer></v-spacer>
            <v-btn color="white" depressed class="blue--text" small rounded @click="disconnect" >
              Disconnect
              <v-icon small class="ml-1">mdi-exit-to-app</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import ConnectProvider from '@/web3/connect-provider'

export default {
  computed: {
    sEthers () {
      return this.$store.state.ethers
    }
  },

  methods: {
    disconnect () {
      ConnectProvider.disconnect()
    },
    connectWallet () {
      this.$root.$dialog.connectWalletDialog.open()
        .catch(e => {})
    },
  }
}
</script>