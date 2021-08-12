<template>
  <div class="pa-6">

    <div class="text-center">

      <div class="d-flex justify-end">
        <v-btn @click="signout" text rounded color="primary">
          SIGN OUT
        </v-btn>
      </div>

      <v-icon color="textFaint" size="80">mdi-account-outline</v-icon>

      <div class="textFaint--text caption font-italic">
        Logged in as
      </div>
      <div class="textFaint--text font-weight-medium mb-8">
        {{ username }}
      </div>
      
      <div v-if="$store.state.user.jwtObject.user_id === '21'">
        <v-btn @click="toggleSuperUserMode">
          SuperMode: {{ $store.state.superUserMode }}
        </v-btn>
      </div>
      <div class="mb-12 textFaint--text">
        Session expires: {{ expiryFromNow }}
      </div>

      <v-btn block x-large outlined @click="$emit('change-tab', 1)">
        Set / change a password
      </v-btn>

    </div>

  </div>
</template>

<script>
import moment from 'moment'

export default {
  components: {
  },

  data: () => ({
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    username () {
      return this.$store.state.user.username
    },
    expiryFromNow () {
      var expiryDate = this.$store.state.user.jwtObject.exp
      if (moment.unix(expiryDate).isValid()) {
        return moment.unix(expiryDate).fromNow()
      }
      return ''
    },
  },

  methods: {
    toggleSuperUserMode () {
      this.$store.commit('setSuperUserMode', !this.$store.state.superUserMode)
    },
    async signout () {
      this.$store.commit('logout')
    }
  },

  created () {
  }
}
</script>