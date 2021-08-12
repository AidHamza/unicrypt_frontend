<template>
  <div>

    <div class="display-1 mb-4">
      Set a new password
    </div>
    <div class="textFaint--text caption">
      Setting a password allows you to log in to the same account from multiple devices
    </div>
    <div class="mt-2 d-flex align-center pa-3 br-20 inputcolor">
      <c-input :value.sync="password" :type="textType" placeholder="Password...">
      </c-input>
      
      <v-icon v-if="password.length > 0" @click="password = ''" class="mr-2" tabindex="-1">
        mdi-close
      </v-icon>

      <v-icon v-if="textType === 'text'" @click="textType = 'password'" tabindex="-1">
        mdi-eye-off
      </v-icon>
      <v-icon v-else @click="textType = 'text'" tabindex="-1">
        mdi-eye
      </v-icon>

    </div>
    <div class="mt-2 d-flex align-center pa-3 br-20 inputcolor">
      <c-input :value.sync="confirmPassword" :type="textType" placeholder="Confirm password...">
      </c-input>
      
      <v-icon v-if="confirmPassword.length > 0" @click="confirmPassword = ''" class="mr-2" tabindex="-1">
        mdi-close
      </v-icon>

      <v-icon v-if="textType === 'text'" @click="textType = 'password'" tabindex="-1">
        mdi-eye-off
      </v-icon>
      <v-icon v-else @click="textType = 'text'" tabindex="-1">
        mdi-eye
      </v-icon>
    </div>

    <div v-if="!passwordsMatch" class="textFaint--text text-center">
      Passwords dont match
    </div>
    <div v-else-if="!passwordLengthValid" class="textFaint--text text-center">
      Password length needs to be 8 characters or more
    </div>

    <v-btn @click="setPassword" :disabled="!passwordIsOK" block x-large rounded outlined class="mt-8">
      Set password
    </v-btn>

    <v-dialog v-model="passwordChangedDialog" persistent content-class="br-20" width="500">
      <v-card class="pa-2 br-20">

        <v-icon size="180" style="color: var(--v-background-base)!important; position: absolute; left: -30px; top: -30px;">mdi-emoticon-excited-outline</v-icon>

        <div style="position: relative;">
          <div class="pa-8 text-center">
            <div class="display-1 mb-6">
              Password successfully changed!
            </div>
            <div class="mb-6">
              Please write it down somewhere safe
            </div>
          </div>
          <v-btn x-large rounded block @click="passwordChangedDialog = false" class="grad-green white--text">
            GREAT!
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
export default {
  data: () => ({
    password: '',
    confirmPassword: '',
    textType: 'password',
    passwordChangedDialog: false
  }),

  computed: {
    passwordsMatch () {
      return this.password === this.confirmPassword
    },
    passwordLengthValid () {
      return this.password.length >= 8
    },
    passwordIsOK () {
      return this.passwordsMatch && this.passwordLengthValid
    }
  },

  methods: {
    async setPassword () {
      var data = {password: this.password, jwtToken: this.$store.state.user.jwtToken}
      this.$userAxios.post(`/users/set-password`, data)
        .then(response => {
          this.passwordChangedDialog = true
        })
        .catch(error => {
          console.log(error.response.data)
          if (error.response.data.errors[0] === 'ER_TOO_SHORT') {
            alert('Username too short')
          }
          if (error.response.data.errors[0] === 'ER_USERNAME_EXISTS') {
            alert('This username already exists')
          }
          if (error.response.data.errors[0] === 'ER_ADDRESS_EXISTS') {
            alert('An account is already associated with this address')
          }
        })
    },
  }
}
</script>