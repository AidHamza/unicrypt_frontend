<template>
  <v-dialog v-model="dialog" persistent max-width="450" content-class="br-20">
    <v-card class="br-20">
      <v-row class="pa-4 ma-0 font-weight-bold align-center">
        <v-spacer></v-spacer>
        
        <v-btn large @click="close" icon color="text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>

      <v-card-text class="pa-8">
        <div class="text-center">
          <v-progress-circular
          indeterminate
          size="80"
          width="2"
          color="text"
          >
          <img 
          src="@/assets/img/black_wings.svg" 
          height="68px"
          width="68px">

          </v-progress-circular>
          <div class="mt-8">
            Confirm this transaction in your wallet
          </div>
          <div class="mt-6 caption">
            Using a mobile wallet?
          </div>
          <div class="caption textFaint--text">
            Sometimes it helps to kill the mobile app and restart it if the transaction is not shown in the wallet.
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
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