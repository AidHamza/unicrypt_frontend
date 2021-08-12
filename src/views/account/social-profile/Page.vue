<template>
  <v-container style="max-width: 600px;">

    <v-card v-if="false" class="br-20 mb-2">
      <account-header></account-header>
    </v-card>

    <v-card class="br-20">

      <div class="d-flex align-center pl-4 pt-4">
        <v-btn icon to="/account" color="text">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <span class="ml-4 title textFaint--text">
          Social profile
        </span>
        <v-spacer></v-spacer>
        <div style="width: 36px;"></div>
      </div>

      <template v-if="loggedIn">
        <logged-in></logged-in>
      </template>

      <template v-else>     
        <div style="position: relative;">
          <div class="text-center mb-4 mt-4">
            <v-btn x-large depressed rounded @click="tab = 0" :class="{'primary--text': tab === 0}">
              LOG IN
            </v-btn>
            <v-btn x-large depressed rounded @click="tab = 1" :class="{'primary--text': tab === 1}">
              CREATE ACCOUNT
            </v-btn>
          </div>

          <log-in v-if="tab === 0"></log-in>

          <create-account v-if="tab === 1" @on-created="accountCreatedDialog = true"></create-account>
        </div>
      </template>

      <v-dialog v-model="accountCreatedDialog" persistent content-class="br-20" max-width="450">
        <v-card class="pa-2 br-20">

          <v-icon size="180" style="color: var(--v-background-base)!important; position: absolute; left: -30px; top: -30px;">mdi-emoticon-excited-outline</v-icon>

          <div style="position: relative;">
            <div class="pa-8 text-center">
              <div class="display-1 mb-6">
                Account created
              </div>
              <div class="mb-6">
                Please log in
              </div>
            </div>
            <v-btn x-large rounded block @click="onAccountCreatedDialogClose" class="grad-green white--text">
              GREAT!
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

    </v-card>

  </v-container>
</template>

<script>
import CreateAccount from './create-account'
import LogIn from './log-in'
import LoggedIn from './logged-in'
import AccountHeader from './account-header'

export default {
  components: {
    CreateAccount,
    LogIn,
    LoggedIn,
    AccountHeader
  },

  data: () => ({
    tab: 0,
    accountCreatedDialog: false
  }),

  computed: {
    loggedIn () {
      return this.$store.state.user.username
    }
  },

  methods: {
    onAccountCreatedDialogClose () {
      this.accountCreatedDialog = false
      this.tab = 0
    }
  },

  created () {
  }
}
</script>