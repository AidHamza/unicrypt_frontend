<template>
  <v-container style="max-width: 600px;" :class="[{'pa-0 mobile-page': $vuetify.breakpoint.xs}]">
    
    <v-slide-y-transition appear>
      <div :class="['mb-16']">

        <div class="text-center pt-2">
          <div class="textFaint--text caption">
            Selected network
          </div>
          <v-btn large block text @click="$root.$dialog.chainSwitcher.open()" class="title font-weight-bold">
            <img 
            :src="$settings.CHAINS[$store.state.requiredNetwork].icon" 
            height="24px"
            width="24px"
            class="mr-3 br-20">
            {{ $settings.CHAIN_DISPLAY_NAME[$store.state.requiredNetwork] }}
            <v-icon small color="">mdi-chevron-down</v-icon>
          </v-btn>
        </div>

        <div :class="[{'v-card br-20 ma-2': $vuetify.breakpoint.xs}, {'v-card br-20': !$vuetify.breakpoint.xs}]">

          <div class="title text-center textFaint--text pa-4">
            Account
          </div>

          <div class="pa-3 text-center">
            <div v-if="$store.state.user.username">
              <div class="caption textFaint--text">
                Logged in as
              </div>
              <div>
                <v-icon small class="mr-1">mdi-account-circle-outline</v-icon>
                {{ $store.state.user.username }}
              </div>
              <v-btn rounded text color="primary" to="/account/social-profile">
                Social profile
              </v-btn>
            </div>
            <div v-else>
              <div class="textFaint--text caption">
                You are not logged in to a Social Profile.
              </div>
              <v-btn rounded text color="primary" to="/account/social-profile">
                Log in
              </v-btn>
            </div>
          </div>

          <div v-if="!sEthers.coinbase" class="background pa-4">
            <div class="text-center pa-4 textFaint--text caption">
              View all your wallet information here, such as token locks for your account.
            </div>
            <v-btn color="primary" class="title" block depressed large rounded @click="connectWallet">
              <v-icon class="mr-1">mdi-exit-to-app</v-icon>
              Connect your wallet
            </v-btn>
          </div>

          <template v-else>

            <div v-if="sEthers.coinbase" outlined class="">
              <div class="d-flex align-center background pa-3 border-b">
                <v-icon size="50">mdi-wallet</v-icon>
                <div class="ml-3" style="flex: 1;">
                  <div class="d-flex align-start">
                    <div>
                      <copy-address :address="sEthers.coinbase" color="textFaint"></copy-address>
                      <v-btn rounded text class="d-flex align-center pa-2 font-weight-regular">
                        {{ ethBalanceHuman }} {{ $store.state.nativeGasTokenSymbol }}
                        <img 
                        :src="$settings.CHAINS[$store.state.requiredNetwork].icon"
                        height="16px"
                        width="16px"
                        class="ml-2">
                      </v-btn>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn color="textFaint" text small rounded @click="disconnect" >
                      Disconnect
                      <v-icon small class="ml-1">mdi-exit-to-app</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>

              <v-row dense class="ma-0 background">
                <v-col cols="6">
                  <v-btn rounded text class="textFaint--text d-flex align-center pa-2 font-weight-regular" @click="expandCoinBalances = !expandCoinBalances">
                    <img 
                    src="@/assets/img/UNCL.svg" 
                    height="24px"
                    width="24px"
                    class="mr-2">
                    {{ unclBalanceHuman.combined }} UNCL
                    <v-icon small :class="[{'rotate-180': expandCoinBalances}]">mdi-chevron-down</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn rounded text class="textFaint--text d-flex align-center pa-2 font-weight-regular" @click="expandCoinBalances = !expandCoinBalances">
                    <img 
                    src="@/assets/img/UNCX_fill.svg" 
                    height="24px"
                    width="24px"
                    class="mr-2">
                    {{ uncxBalanceHuman.combined }} UNCX
                    <v-icon small :class="[{'rotate-180': expandCoinBalances}]">mdi-chevron-down</v-icon>
                  </v-btn>
                </v-col>
              </v-row>

              <v-expand-transition>
                <div v-if="expandCoinBalances">
                  <v-row dense class="ma-0 px-2 pb-4 caption background">
                    <v-col cols="6">
                      <div class="textFaint--text">
                        Mainnet: {{ unclBalanceHuman.Mainnet }}
                      </div>
                      <div class="textFaint--text">
                        BSC: {{ unclBalanceHuman.BSC_MAINNET }}
                      </div>
                      <div class="textFaint--text">
                        xDai: {{ unclBalanceHuman.xDai }}
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <div class="textFaint--text">
                        Mainnet: {{ uncxBalanceHuman.Mainnet }}
                      </div>
                      <div class="textFaint--text">
                        BSC: {{ uncxBalanceHuman.BSC_MAINNET }}
                      </div>
                      <div class="textFaint--text">
                        xDai: {{ uncxBalanceHuman.xDai }}
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-expand-transition>

            </div>

          </template>

        </div>

        <div :class="[{'v-card br-20 mt-10': !$vuetify.breakpoint.xs}, {'mt-10 v-card': $vuetify.breakpoint.xs}]" v-if="sEthers.coinbase">
          <user-token-locks-controller></user-token-locks-controller>
        </div>

        <div class="py-8">
        </div>
        
      </div>
    </v-slide-y-transition>
    
  </v-container>
</template>

<script>
import ConnectProvider from '@/web3/connect-provider'
import UserTokenLocksController from '@/views/locker/erc20/user/CardController'
import ERC20 from '@/smart-contracts/erc20'
import { ethers } from 'ethers'

export default {

  components: {
    UserTokenLocksController
  },

  data: () => ({
    expandCoinBalances: false,
    ethBalance: '0',
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
    blockNumber () {
      return this.$store.state.blockNumber
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    ethBalanceHuman () {
      return this.$root.formatAmount(this.ethBalance, 18)
    },
    unclBalanceHuman () {
      var combined = ethers.BigNumber.from(this.unclBAL.Mainnet).add(this.unclBAL.BSC_MAINNET).add(this.unclBAL.xDai)
      return {
        'combined': this.$root.formatAmount(combined, 18),
        'Mainnet': this.$root.formatAmount(this.unclBAL.Mainnet, 18),
        'BSC_MAINNET': this.$root.formatAmount(this.unclBAL.BSC_MAINNET, 18),
        'xDai': this.$root.formatAmount(this.unclBAL.xDai, 18)
      }
    },
    uncxBalanceHuman () {
      var combined = ethers.BigNumber.from(this.uncxBAL.Mainnet).add(this.uncxBAL.BSC_MAINNET).add(this.uncxBAL.xDai)
      return {
        'combined': this.$root.formatAmount(combined, 18),
        'Mainnet': this.$root.formatAmount(this.uncxBAL.Mainnet, 18),
        'BSC_MAINNET': this.$root.formatAmount(this.uncxBAL.BSC_MAINNET, 18),
        'xDai': this.$root.formatAmount(this.uncxBAL.xDai, 18)
      }
    },
  },

  watch: {
    sEthersWatcher () {
      this.getEthBalance()
      this.getUncxBalance()
      this.getUnclBalance()
    },
    blockNumber () {
      this.getEthBalance()
    }
  },

  methods: {
    async getEthBalance () {
      if (!this.sEthers.coinbase) {
        return
      }
      var ethBalance = await this.sEthers.provider.getBalance(this.sEthers.coinbase)
      this.ethBalance = ethBalance
    },
    connectWallet () {
      this.$root.$dialog.connectWalletDialog.open()
        .then(() => {
        })
        .catch(e => {})
    },
    disconnect () {
      ConnectProvider.disconnect()
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
  },

  created () {
    this.getEthBalance()
    this.getUncxBalance()
    this.getUnclBalance()
  }
}
</script>