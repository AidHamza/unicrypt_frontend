<template>
  <div>

    <div class="pa-8 text-center">
      <v-icon color="text" size="80">mdi-account-outline</v-icon>

      <div class="display-1 font-weight-bold mb-8">
        Log in
      </div>

      <!--
      <div class="mt-2 d-flex align-center pa-3 r-outlined br-20 white">
        <c-input :value.sync="username" placeholder="Username..." class="heading--text">
        </c-input>
      </div>
      -->

      <template v-if="tab === 0">
        <v-btn @click="tab = 1" outlined block x-large rounded color="" class="mt-8">
          with a wallet
        </v-btn>

        <v-btn @click="tab = 2" outlined block x-large rounded color="" class="mt-4">
          with a password
        </v-btn>
      </template>

      <div v-if="tab !== 0">
        <v-btn icon @click="tab = 0" color="text">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </div>
      
      <template v-if="tab === 1">

        <template v-if="sEthers.coinbase">

          <v-btn @click="sign" block outlined x-large rounded color="text" class="mt-8">
            SIGN MESSAGE
          </v-btn>

          <div v-if="loginErrMsgMethodSign" class="textFaint--text mt-4">
            Error: {{ loginErrMsgMethodSign }}
          </div>

        </template>

        <template v-else>
          <div class="title white--text">
            <v-btn @click="connectWallet" outlined block x-large rounded color="" class="">
              Connect wallet
            </v-btn>
          </div>
        </template>

      </template>

      <template v-if="tab === 2">

        <div class="mt-2 d-flex align-center pa-3 br-20 inputcolor">
          <c-input :value.sync="username" placeholder="Username...">
          </c-input>
          
          <v-icon small v-if="username.length > 0" @click="username = ''" tabindex="-1">
            mdi-close
          </v-icon>

        </div>
        <div class="mt-2 d-flex align-center pa-3 br-20 inputcolor">
          <c-input :value.sync="password" placeholder="Password..." :type="textType">
          </c-input>
          
          <v-icon small v-if="password.length > 0" @click="password = ''" tabindex="-1" class="mr-2">
            mdi-close
          </v-icon>

          <v-icon v-if="textType === 'text'" @click="textType = 'password'" tabindex="-1">
            mdi-eye-off
          </v-icon>
          <v-icon v-else @click="textType = 'text'" tabindex="-1">
            mdi-eye
          </v-icon>

        </div>

        <v-btn @click="loginWithPassword" outlined block x-large rounded color="" class="mt-8">
          Log in
        </v-btn>

        <div v-if="loginErrMsgMethodPassword" class="textFaint--text mt-4">
          Error: {{ loginErrMsgMethodPassword }}
        </div>

      </template>

      <!--
      <v-btn v-if="verifiedMessageMatchesAccount" @click="login" block x-large rounded color="white" class="mt-8">
        LOGIN
      </v-btn>
      -->

    </div>

  </div>
</template>

<script>
import { ethers } from 'ethers'
import ERC20 from '@/smart-contracts/erc20'

export default {
  components: {
  },

  data: () => ({
    username: '',
    password: '',
    balance: '0',
    signedMessage: null,
    messageToSign: 'Login',
    tab: 0,
    loginErrMsgMethodSign: null,
    loginErrMsgMethodPassword: null,
    textType: 'password'
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    uncxBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.balance, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
    verifiedMessage () {
      try {
        return ethers.utils.verifyMessage(this.messageToSign, this.signedMessage)
      } catch {
        return ''
      }
    }
  },

  methods: {
    connectWallet () {
      this.$root.$dialog.connectWalletDialog.open()
        .catch(e => {})
    },
    async getUncxBalance () {
      var balance = await ERC20.getBalance(this.sEthers.coinbase, '0xaDB2437e6F65682B85F814fBc12FeC0508A7B1D0')
      this.balance = balance
    },
    async loginWithSignature () {
      var data = {address: this.sEthers.coinbase, signedMessage: this.signedMessage}
      this.$userAxios.post(`/users/login-with-signature`, data)
        .then(response => {
          console.log(response.data)
          this.$store.commit('login', response.data)
          // localStorage.setItem('token', response.data.token)
          // localStorage.setItem('accessControl', JSON.stringify(keyObj.accessControl))
          // localStorage.setItem('username', keyObj.username)
          // localStorage.setItem('email', keyObj.email)
        })
        .catch(error => {
          // console.log(error.response.data.errors[0])
          this.loginErrMsgMethodSign = error.response.data.errors[0]
        })
    },
    async loginWithPassword () {
      var data = {username: this.username, password: this.password}
      console.log(this.$userAxios.defaults)
      this.$userAxios.post(`/users/login-with-password`, data)
        .then(response => {
          this.$store.commit('login', response.data)
          // localStorage.setItem('token', response.data.token)
          // localStorage.setItem('accessControl', JSON.stringify(keyObj.accessControl))
          // localStorage.setItem('username', keyObj.username)
          // localStorage.setItem('email', keyObj.email)
        })
        .catch(error => {
          console.log(error.response.data.errors[0])
          this.loginErrMsgMethodPassword = "Invalid login"
        })
    },
    async sign () {
      // this.signedMessage = await this.sEthers.signer.signMessage(this.messageToSign)
      const domain = {
        name: 'Unicrypt Browser'
      }
      const types = {
        Message: [
          { name: 'content', type: 'string' }
        ]
      }
      const message = {
        content: 'Unicrypt browser login'
      }

      this.signedMessage = await this.sEthers.signer._signTypedData(domain, types, message)
      this.loginWithSignature()
    }
  },

  created () {
    this.getUncxBalance()
  }
}
</script>