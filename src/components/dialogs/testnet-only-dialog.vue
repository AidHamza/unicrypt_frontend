<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="450" content-class="br-20">
    <v-card class="br-20">

      <v-card-text class="pa-6">
        <div class="text-center">
          <div class="display-1 mb-4">
            {{ $store.state.requiredNetwork }} Testnet
          </div>
          <v-icon color="pink" size="60">mdi-alert-outline</v-icon>
          <div class="mt-4">
            This app is for testing on {{ $store.state.requiredNetwork }} testnet only. 
            Make sure your wallet is connected to {{ $store.state.requiredNetwork }}.
          </div>
          <div class="mt-4 caption textFaint--text">
            Do not interact with any contracts while connected to a Mainnet wallet as you will lose funds permanently.
          </div>
          <div class="caption mt-2 pink--text font-weight-bold">
            By proceeding to use this app you acknowledge you stand to lose tokens if connected to a mainnet wallet and to 
            not hold the Unicrypt team accountable for any losses.
          </div>

          <v-btn x-large rounded block color="pink" class="mt-4 white--text" @click="close">
            I Understand
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false
  }),
  methods: {
    open () {
      this.dialog = true
    },
    close () {
      this.dialog = false
    }
  }
}
</script>