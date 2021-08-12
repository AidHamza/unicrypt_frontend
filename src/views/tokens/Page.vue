<template>
  <v-container style="max-width: 600px;" :class="[{'pa-0': $vuetify.breakpoint.xs}]">

    <div :class="['mb-16', {'foreground': $vuetify.breakpoint.xs}, {'v-card br-20': !$vuetify.breakpoint.xs}]">

      <!-- ADVERT 740 x 140 px -->
      <!--
      <div v-if="showAdvert && !loggedIn" class="">
        <div>
          <a href="https://t.me/YMLNews" class="deadlink d-flex">
            <img 
            src="https://i.imgur.com/mORW59I.jpg"
            width="100%">
          </a>
          <div class="d-flex primary white--text caption pa-2 align-center">
            <div style="width: 28px;">

            </div>
            <v-spacer></v-spacer>
            This is a sponsored advertisment
            <v-spacer></v-spacer>
            <v-btn small icon @click="showAdvert = false" color="white">
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      -->
      
      <div>

        <div>

          <div :class="['d-flex border-b foreground mb-2', {'mt-2 border-t': $vuetify.breakpoint.xs}]" style="overflow: hidden;">
            <div :class="['d-flex align-center flex pa-3 c-list top-tab', {'background': tab === 0}]" @click="tab = 0">
              <v-icon class="mr-1">mdi-magnify</v-icon>
              All tokens
            </div>
            <div :class="['d-flex align-center flex pa-3 c-list top-tab', {'background': tab === 1}]" @click="tab = 1">
              <v-icon class="mr-1">mdi-eye-outline</v-icon>
              Watchlist
            </div>
          </div>

          <all-tokens v-if="tab === 0"></all-tokens>
          <watchlist v-else></watchlist>
        </div>

      </div>

    </div>
    
  </v-container>
</template>

<script>
import AllTokens from './all-tokens'
import Watchlist from './watchlist'

export default {
  name: 'TokensPage',
  components: {
    AllTokens,
    Watchlist
  },

  data: () => ({
    tab: 0,
    showAdvert: true
  }),

  computed: {
    loggedIn () {
      return this.$store.state.user.username
    }
  },

  created () {
  }
}
</script>