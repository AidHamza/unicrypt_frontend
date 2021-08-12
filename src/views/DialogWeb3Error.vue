<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="450" content-class="br-20">
    <v-card class="br-20">
      <v-row class="pa-4 ma-0 t-large font-weight-bold align-center">
        Error
        <v-spacer></v-spacer>
        
        <v-btn @click="close" icon color="text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>

      <v-card-text class="pa-6">
        <div class="text-center">
          {{ error_message }}
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    error_message: ''
  }),
  methods: {
    open (error_message) {
      this.error_message = error_message
      this.dialog = true
    },
    close () {
      this.dialog = false
    }
  }
}
</script>