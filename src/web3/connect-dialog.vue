<template>
  <v-dialog v-model="dialog" persistent max-width="450" content-class="br-20">
    <v-card class="br-20">
      <div>
        <v-row class="pa-4 ma-0 font-weight-medium background align-center">
          <div>
            <div class="caption textFaint--text">
              Unicrypt Version 1.03
            </div>
            Connect your wallet
          </div>
          <v-spacer></v-spacer>

          <v-btn v-if="false" @click="test">
            TEST
          </v-btn>
          
          <v-btn @click="close" icon color="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <v-expand-transition mode="out-in">
          <v-card v-if="sEthers.coinbase" outlined class="background blocks br-0 d-flex align-center pa-3">
            <img 
            src="@/assets/img/UNCL.svg"
            width="40px"
            class="greyscale">
            <div class="ml-3" style="flex: 1;">
              <div class="caption d-flex align-center white--text font-weight-medium">
                <copy-address :address="sEthers.coinbase" color="white"></copy-address>
                <v-spacer></v-spacer>
                Connected
              </div>
              <div class="d-flex align-center white--text">
                {{ ethBalanceHuman }} {{ $store.state.nativeGasTokenSymbol }}
                <v-spacer></v-spacer>
                <v-btn color="white" depressed class="blue--text" small rounded @click="disconnect" >
                  Disconnect
                  <v-icon small class="ml-1">mdi-exit-to-app</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-expand-transition>

        <div class="text-center mb-4 mt-4">
          <v-btn text rounded @click="tab = 0" :color="tab === 0 ? 'text' : 'textFaint'">
            Desktop
          </v-btn>
          <v-btn text rounded @click="tab = 1" :color="tab === 1 ? 'text' : 'textFaint'">
            Mobile
          </v-btn>
        </div>

        <div v-if="wrongNetwork" class="pa-4 br-20 ma-2 red white--text">
          Wrong Network
          <div class="caption ml-1">
            Switch your wallet to {{ $store.state.requiredNetwork }}
          </div>
        </div>

        <div class="caption textFaint--text pa-4 d-flex align-center">
          <v-icon small color="textFaint" class="mr-2">mdi-star-outline</v-icon>
          Unicrypt works best with Metamask on all chains.
        </div>

        <!-- Main content -->
        <div>

          <div v-if="tab === 0">

            <div 
            @click="connectToMetamask()"
            class="c-list border-b pa-4 d-flex align-center">
              <img 
              src="@/assets/img/metamask.svg" 
              width="30px"
              class="mr-3">
              <div class="font-weight-bold d-flex align-center">
                Metamask
                <v-icon small color="text" class="ml-1">mdi-star-outline</v-icon>
              </div>
            </div>

            <div
            v-if="$store.state.requiredNetwork === 'Mainnet'"
            @click="connectToWalletLink" 
            class="c-list border-b pa-4 d-flex align-center">
              <img 
              src="@/assets/img/coinbase-wallet.svg" 
              width="30px"
              class="mr-3">
              <div class="font-weight-bold">
                Coinbase Wallet
              </div>
            </div>
            
            <div
            @click="connectWalletConnect" 
            class="c-list pa-4 d-flex align-center">
              <img 
              src="@/assets/img/wallet-connect.svg" 
              width="30px"
              class="mr-3">
              <div>
                <div class="font-weight-bold">
                  Wallet Connect
                </div>
                <div class="caption textFaint--text">
                  Metamask, TrustWallet, ... + 30 more
                </div>
              </div>
            </div>
            
          </div>

          <div v-if="tab === 1">

            <div 
            @click="connectToMetamask()"
            class="c-list border-b pa-4 d-flex align-center">
              <img 
              src="@/assets/img/metamask.svg" 
              width="30px"
              class="mr-3">
              <div>
                <div class="font-weight-bold d-flex align-center">
                  In-Wallet Browser
                  <v-icon small color="text" class="ml-1">mdi-star-outline</v-icon>
                </div>
                <div v-if="$vuetify.breakpoint.smAndDown" class="caption textFaint--text">
                  Use this option if you are using an in-wallet browser such as Metamask browser, or TrustWallet browser.
                </div>
              </div>
            </div>
            
            <div
            @click="connectWalletConnect" 
            class="c-list pa-4 d-flex align-center">
              <img 
              src="@/assets/img/wallet-connect.svg" 
              width="30px"
              class="mr-3">
              <div>
                <div class="font-weight-bold">
                  Wallet Connect
                </div>
                <div class="caption textFaint--text">
                  Metamask, TrustWallet, ... + 30 more
                </div>
              </div>
            </div>
            
          </div>

        </div>
        <!-- END MAIN CONTENT -->

        <!-- HARDHAT -->
        <div v-if="$store.state.superUserMode"  class="v-card ma-2 pa-2 br-20 text-center">
          <div :class="['mt-1 mb-5 d-flex align-center pa-3 r-outlined br-20 mx-2', {'foreground': $vuetify.breakpoint.xs}, {'inputcolor': !$vuetify.breakpoint.xs}]">
            <c-input :value.sync="impersonate" placeholder="Impersonate address..." class="">
            </c-input>

            <v-icon v-if="impersonate === ''">
              mdi-magnify
            </v-icon>
            <v-icon v-else @click="impersonate = ''">
              mdi-close
            </v-icon>

          </div>
          <v-btn @click="impersonateAccount" rounded small color="primary">
            Impersonate
          </v-btn>
        </div>
        <!-- END HARDHAT -->

        <div class="pa-2 ma-0 font-weight-medium background">
          <div class="ml-2 caption text-end textFaint--text">
            block {{ blockNumber }}
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
// import { ethers } from "ethers";
// import SmartContract from '@/views/liquidity/components/lock-liquidity/smart-contract'
import ConnectProvider from './connect-provider'
import UniswapFactory from '@/smart-contracts/uniswap/uniswap-factory-contract'
import { ethers } from 'ethers'
// https://getwaves.io/

export default {
  components: {
  },
  data: () => ({
    tab: 0,
    dialog: false,
    resolve: null,
    reject: null,
    ethBalance: '0',
    impersonate: ''
  }),
  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    wrongNetwork () {
      return this.$store.state.wrongNetwork
    },
    blockNumber () {
      return this.$store.state.blockNumber
    },
    addressCondensed () {
      var address = this.sEthers.coinbase
      if (!address) {
        return ''
      }
      return address.slice(0, 6) + '...' + address.slice(address.length - 4)
    },
    ethBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.ethBalance, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
  },

  watch: {
    sEthersWatcher () {
      this.getEthBalance()
    },
    blockNumber () {
      if (this.dialog) {
        this.getEthBalance()
      }
    }
  },

  methods: {
    async impersonateAccount () {
      var signer = await this.sEthers.provider.getSigner(this.impersonate)
      this.$store.commit('updateEthers', {
        coinbase: this.impersonate,
        signer: signer,
        // network: StaticMap.networkHexToInt[window.ethereum.chainId]
      })
    },
    async test () {
      var length = await UniswapFactory.allPairsLength()
      console.log(length)
    },
    async getEthBalance () {
      if (!this.sEthers.coinbase) {
        return
      }
      var ethBalance = await this.sEthers.provider.getBalance(this.sEthers.coinbase)
      this.ethBalance = ethBalance
    },
    open () {
      this.tab = this.$vuetify.breakpoint.xs ? 1 : 0
      this.dialog = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    close () {
      this.dialog = false
      this.reject()
    },
    closeAndResolve () {
      this.dialog = false
      this.resolve()
    },
    requireConnectionThen (callback) {
      if (!this.sEthers.coinbase) {
        this.open()
          .then(() => {
            callback()
          })
          .catch(e => {})
      } else {
        callback()
      }
    },
    async connectToWalletLink () {
      await ConnectProvider.connectToWalletLink()
      this.closeAndResolve()
    },
    async connectWalletConnect () {
      await ConnectProvider.connectWalletConnect()
      this.closeAndResolve()
    },
    async connectToMetamask () {
      await ConnectProvider.connectToMetamask()
      this.closeAndResolve()
    },
    disconnect () {
      ConnectProvider.disconnect()
    },
  }
}
</script>