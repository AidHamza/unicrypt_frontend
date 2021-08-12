<template>
  <div>

    <div outlined class="pa-8 text-center">
      <v-icon color="text" size="80">mdi-account-outline</v-icon>

      <div class="display-1 font-weight-bold mb-8">
        Create account
      </div>

      <template v-if="sEthers.coinbase">

        <div class="mt-2 d-flex align-center pa-3 br-20 inputcolor">
          <c-input :value.sync="username" placeholder="Username...">
          </c-input>

          <v-progress-circular
          v-if="showNameLoader"
          indeterminate
          width="2"
          class="mr-2"
          size="18"
          color="primary"
          ></v-progress-circular>
          
          <template v-if="username.length > 0">
            <v-icon v-if="nameAvailable" color="primary" small>mdi-check</v-icon>
            <v-icon v-else small>mdi-emoticon-sad-outline</v-icon>

            <v-icon small @click="username = ''" tabindex="-1">
              mdi-close
            </v-icon>
          </template>

        </div>

        <div v-if="!nameAvailable" class="pink--text">
          Username "{{ username }}"" is taken
        </div>

        <div class="mt-4 caption">
          {{ sEthers.coinbase }}
        </div>
        <div v-if="addressAvailable" class="primary--text">
          <v-icon color="primary" small>mdi-check</v-icon>
          This address is available
        </div>
        <div v-else class="pink--text">
          <v-icon color="pink" small>mdi-close</v-icon>
          This address is already linked to an account
        </div>

        <div class="title mt-10">
          Requirements
        </div>

        <v-row>
          <v-col cols="5">
            <img 
            src="@/assets/img/UNCL.svg" 
            height="40px"
            width="40px">
            <div class="title">
              50 UNCL
            </div>
            <div class="textFaint--text">
              <v-icon v-if="unclBalanceMet" color="primary" small>mdi-check</v-icon>
            </div>
            <div class="textFaint--text">
              Mainnet: {{ unclBalanceHuman.Mainnet }} UNCL
            </div>
            <div class="textFaint--text">
              BSC: {{ unclBalanceHuman.BSC_MAINNET }} UNCL
            </div>
            <div class="textFaint--text">
              xDai: {{ unclBalanceHuman.xDai }} UNCL
            </div>
          </v-col>
          <v-col cols="2" class="display-1 textFaint--text d-flex align-center">
            OR
          </v-col>
          <v-col cols="5">
            <img 
            src="@/assets/img/UNCX_fill.svg" 
            height="40px"
            width="40px">
            <div class="title">
              3 UNCX
            </div>
            <div class="textFaint--text">
              <v-icon v-if="uncxBalanceMet" color="primary" small>mdi-check</v-icon>
            </div>
            <div class="textFaint--text">
              Mainnet: {{ uncxBalanceHuman.Mainnet }} UNCX
            </div>
            <div class="textFaint--text">
              BSC: {{ uncxBalanceHuman.BSC_MAINNET }} UNCX
            </div>
            <div class="textFaint--text">
              xDai: {{ uncxBalanceHuman.xDai }} UNCX
            </div>
          </v-col>
        </v-row>

        <div class="mt-6 caption font-weight-regular textFaint--text">
          Your wallet needs 50 UNCL OR 3 UNCX in it to create an account. If your balance falls below your account will be 
          temporarily deactivated until
          it holds 3 UNCX or 50 UNCL again.
        </div>

        <v-btn @click="sign" block x-large rounded outlined color="" class="mt-8" :disabled="!allConditionsMet">
          SIGN
        </v-btn>
        
        <v-btn v-if="verifiedMessageMatchesAccount" @click="createAccount" :disabled="!allConditionsMet" block depressed x-large rounded color="text" class="background--text mt-2">
          CREATE
        </v-btn>

        <div class="mt-6 caption">
          Sign a message in your wallet to prove you own this wallet address.
        </div>

        <div class="mt-6 caption" style="overflow-wrap: break-word;">
          {{ signedMessage }}
        </div>
        <div class="mt-6 caption" style="overflow-wrap: break-word;">
          {{ verifiedMessage }}
        </div>

      </template>

      <template v-else>
        <div>
          <v-btn @click="connectWallet" outlined block x-large rounded color="" class="">
            Connect wallet
          </v-btn>
        </div>
      </template>

    </div>

  </div>
</template>

<script>
import { ethers } from 'ethers'
import ERC20 from '@/smart-contracts/erc20'
import _ from 'lodash'

export default {
  components: {
  },

  data: () => ({
    username: '',
    signedMessage: null,
    messageToSign: 'Create account',
    showNameLoader: false,
    showAddressLoader: false,
    nameAvailable: true,
    addressAvailable: true,
    uncxBAL: {
      'Mainnet': '0',
      'BSC_MAINNET': '0',
      'xDai': '0',
    },
    unclBAL: {
      'Mainnet': '0',
      'BSC_MAINNET': '0',
      'xDai': '0',
    }
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    unclBalanceHuman () {
      var mainnet = ethers.utils.formatUnits(this.unclBAL.Mainnet, 18)
      mainnet = Number(mainnet).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})

      var bsc_mainnet = ethers.utils.formatUnits(this.unclBAL.BSC_MAINNET, 18)
      bsc_mainnet = Number(bsc_mainnet).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})

      var xdai = ethers.utils.formatUnits(this.unclBAL.xDai, 18)
      xdai = Number(xdai).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})

      return {
        'Mainnet': mainnet,
        'BSC_MAINNET': bsc_mainnet,
        'xDai': xdai
      }
    },
    uncxBalanceHuman () {
      var mainnet = ethers.utils.formatUnits(this.uncxBAL.Mainnet, 18)
      mainnet = Number(mainnet).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})

      var bsc_mainnet = ethers.utils.formatUnits(this.uncxBAL.BSC_MAINNET, 18)
      bsc_mainnet = Number(bsc_mainnet).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})

      var xdai = ethers.utils.formatUnits(this.uncxBAL.xDai, 18)
      xdai = Number(xdai).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})

      return {
        'Mainnet': mainnet,
        'BSC_MAINNET': bsc_mainnet,
        'xDai': xdai
      }
    },
    verifiedMessage () {
      try {
        const domain = {
          name: 'Unicrypt Browser'
        }
        const types = {
          Message: [
            { name: 'content', type: 'string' }
          ]
        }
        const message = {
          content: `Unicrypt: Create account for ${this.sEthers.coinbase}`
        }
        return ethers.utils.verifyTypedData(domain, types, message, this.signedMessage)
      } catch {
        return ''
      }
    },
    verifiedMessageMatchesAccount () {
      return this.verifiedMessage === this.sEthers.coinbase
    },
    unclBalanceMet () {
      if (ethers.BigNumber.from(this.unclBAL.Mainnet).gte(ethers.utils.parseUnits('50', 18))) {
        return true
      }
      if (ethers.BigNumber.from(this.unclBAL.BSC_MAINNET).gte(ethers.utils.parseUnits('50', 18))) {
        return true
      }
      if (ethers.BigNumber.from(this.unclBAL.xDai).gte(ethers.utils.parseUnits('50', 18))) {
        return true
      }
      return false
    },
    uncxBalanceMet () {
      if (ethers.BigNumber.from(this.uncxBAL.Mainnet).gte(ethers.utils.parseUnits('3', 18))) {
        return true
      }
      if (ethers.BigNumber.from(this.uncxBAL.BSC_MAINNET).gte(ethers.utils.parseUnits('3', 18))) {
        return true
      }
      if (ethers.BigNumber.from(this.uncxBAL.xDai).gte(ethers.utils.parseUnits('3', 18))) {
        return true
      }
      return false
    },
    allConditionsMet () {
      // return true
      if (this.nameAvailable && this.addressAvailable && (this.unclBalanceMet || this.uncxBalanceMet)) {
        return true
      }
      return false
    }
  },

  watch: {
    sEthersWatcher () {
      this.checkIfAddressAvailable()
      this.getUncxBalance()
      this.getUnclBalance()
    },
    username (nv) {
      this.showNameLoader = true
      this.checkIfNameAvailable()
    }
  },

  methods: {
    connectWallet () {
      this.$root.$dialog.connectWalletDialog.open()
        .catch(e => {})
    },
    async getUncxBalance () {
      var mainnet = await ERC20.getBalance(this.sEthers.coinbase, this.$settings.UNCX_ADDRESS.Mainnet, 'Mainnet')
      this.uncxBAL.Mainnet = mainnet

      var bsc_mainnet = await ERC20.getBalance(this.sEthers.coinbase, this.$settings.UNCX_ADDRESS.BSC_MAINNET, 'BSC_MAINNET')
      this.uncxBAL.BSC_MAINNET = bsc_mainnet

      var xdai = await ERC20.getBalance(this.sEthers.coinbase, this.$settings.UNCX_ADDRESS.xDai, 'xDai')
      this.uncxBAL.xDai = xdai
    },
    async getUnclBalance () {
      var mainnet = await ERC20.getBalance(this.sEthers.coinbase, this.$settings.UNCL_ADDRESS.Mainnet, 'Mainnet')
      this.unclBAL.Mainnet = mainnet

      var bsc_mainnet = await ERC20.getBalance(this.sEthers.coinbase, this.$settings.UNCL_ADDRESS.BSC_MAINNET, 'BSC_MAINNET')
      this.unclBAL.BSC_MAINNET = bsc_mainnet

      var xdai = await ERC20.getBalance(this.sEthers.coinbase, this.$settings.UNCL_ADDRESS.xDai, 'xDai')
      this.unclBAL.xDai = xdai
    },
    async createAccount () {
      var data = {address: this.sEthers.coinbase, username: this.username, signature: this.signedMessage}
      this.$userAxios.post(`/users/create`, data)
        .then(response => {
          this.$emit('on-created')
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

    checkIfNameAvailable: _.debounce(function () {
      this.showAddressLoader = true
      var data = {username: this.username}
      this.$userAxios.post(`/users/name-available-check`, data)
        .then(response => {
          this.nameAvailable = response.data.name_available
        })
        .catch(error => {
          console.log(error.response.data)
        })
        .then(() => {
          this.showNameLoader = false
        })
    }, 300, {leading: true}),

    checkIfAddressAvailable: _.debounce(function () {
      var data = {address: this.sEthers.coinbase}
      this.$userAxios.post(`/users/address-available-check`, data)
        .then(response => {
          this.addressAvailable = response.data.address_available
        })
        .catch(error => {
          console.log(error.response.data)
        })
        .then(() => {
          this.showAddressLoader = false
        })
    }, 300, {leading: true}),
    async sign () {
      const domain = {
        name: 'Unicrypt Browser'
      }
      const types = {
        Message: [
          { name: 'content', type: 'string' }
        ]
      }
      const message = {
        content: `Unicrypt: Create account for ${this.sEthers.coinbase}`
      }

      this.signedMessage = await this.sEthers.signer._signTypedData(domain, types, message)
    }
  },

  created () {
    this.getUncxBalance()
    this.getUnclBalance()
    this.checkIfAddressAvailable()
  }
}
</script>