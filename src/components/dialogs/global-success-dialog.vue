<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="450" content-class="br-20">
    <v-card outlined class="br-20 blocks">

      <v-row v-if="false" class="pa-4 ma-0 t-large font-weight-bold align-center">
        <v-spacer></v-spacer>
        <v-btn @click="close" icon color="text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>

      <v-card-text class="pa-6">
        <div class="text-center">
          <div class="white--text display-1 mb-4">
            Success
          </div>
          <v-icon color="white" size="50">mdi-check-outline</v-icon>
          <div class="mt-4 white--text">
            {{ message }}
          </div>

          <v-btn x-large rounded block color="white" class="mt-4 green--text" @click="close">
            CLOSE
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    message: ''
  }),
  methods: {
    open (message) {
      this.message = message
      this.dialog = true
    },
    close () {
      this.dialog = false
    }
  }
}
</script>

<style scoped lang="scss">
.blocks {
  background: url('~@/assets/img/textures/blocks.svg'), radial-gradient(104.47% 188.91% at 94% 0%, #27e25d 0%, #71b8ff 100%), #ff7171;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>