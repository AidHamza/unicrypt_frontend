<template>
  <v-dialog v-model="dialog" persistent content-class="br-20" max-width="450">
    <v-card class="pa-2 br-20">

      <v-icon size="180" style="color: var(--v-background-base)!important; position: absolute; left: -30px; top: -30px;">mdi-emoticon-excited-outline</v-icon>

      <div style="position: relative;">

        <div>
          <div class="pa-8 text-center">
            <div class="display-1 mb-6">
              Account required
            </div>
            <div class="mb-6">
              Please log in to your account to use this function
            </div>
          </div>

          <v-row dense>
            <v-col>
              <v-btn x-large text block @click="cancel" color="textFaint">
                CANCEL
              </v-btn>
            </v-col>
            <v-col>
              <v-btn x-large rounded block @click="login" class="grad-green white--text">
                LOG IN
              </v-btn>
            </v-col>
          </v-row>

        </div>

      </div>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
  }),

  computed: {
  },

  methods: {
    open () {
      this.dialog = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    login () {
      this.$router.push(`/account`)
      this.dialog = false
      this.resolve('redirect')
    },
    cancel () {
      this.resolve()
      this.dialog = false
    }
  }
}
</script>