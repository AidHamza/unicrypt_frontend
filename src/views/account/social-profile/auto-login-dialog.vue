<template>
  <v-dialog v-model="dialog" persistent content-class="br-20" max-width="450">
    <v-card class="pa-2 br-20">

      <v-icon size="180" style="color: var(--v-background-base)!important; position: absolute; left: -30px; top: -30px;">mdi-emoticon-excited-outline</v-icon>

      <div style="position: relative;">

        <div>
          <div class="pa-8 text-center">
            <div class="display-1 mb-6">
              Welcome back {{ $store.state.user.username }}
            </div>
            <div>
              Session expires in: {{ expiryFromNow }}
            </div>
            <v-btn x-large rounded block @click="cancel" class="grad-green white--text">
              GREAT!
            </v-btn>
          </div>
        </div>

      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'

export default {
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null
  }),

  computed: {
    expiryFromNow () {
      var expiryDate = this.$store.state.user.jwtObject.exp
      if (moment.unix(expiryDate).isValid()) {
        return moment.unix(expiryDate).fromNow()
      }
      return ''
    },
  },

  methods: {
    open () {
      this.dialog = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    cancel () {
      this.reject()
      this.dialog = false
    },
  }
}
</script>