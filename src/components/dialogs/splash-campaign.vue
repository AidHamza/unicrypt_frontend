<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="450" content-class="br-20">
    <v-card class="foreground br-20">
      <div class="d-flex align-center title px-4 py-3 border-b background" style="font-size: 1rem;">
        <div style="width: 24px;">

        </div>
        <v-spacer></v-spacer>
        Community Campaign!
        <v-spacer></v-spacer>
        <v-btn icon color="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-card-text class="pa-0">

        <div class="d-flex align-center c-list pa-4 border-b" href="https://gleam.io/q1jfD/unicrypts-100000-giveaway" target="_blank">
          <svg width="50px" style="stroke:#74ec67;" class="mr-3 draw-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 332.5 332.3" stroke-miterlimit="10"><path d="M166.2 217.7l83-49.1-83-137.6"/><path d="M166.2 31L83.3 168.6l82.9 49.1V131zm0 270.2l83-116.8-83 49"/><path d="M166.2 301.2v-67.8l-82.9-49zm83-132.6l-83-37.6m0 0l-82.9 37.6"/></svg>
          <div>
            <div class="title">
              Ethereum mainnet
            </div>
          </div>
        </div>

        <a href="https://gleam.io/q1jfD/unicrypts-100000-giveaway" class="deadlink" target="_blank">
          <v-card class="pa-4 ma-2 d-flex align-center c-list mb-1">
            <v-icon>mdi-file-document-outline</v-icon>
            <div class="ml-4">
              Documentation
            </div>
          </v-card>
        </a>

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
    },
  }
}
</script>