<template>
  <v-app :class="$store.state.theme === 'theme2' ? 'darktheme' : ''">
    
    <!-- DESKTOP TOOLBAR -->
    <v-app-bar
    v-if="$vuetify.breakpoint.mdAndUp"
    app
    flat
    height="80"
    absolute
    class="pr-3"
    color="foreground"
    >
      <v-toolbar-title v-if="true" class="d-flex align-center font-weight-bold" href="https//www.unicrypt.network">
        <img 
        v-if="true"
        src="@/assets/img/UNCX_fill.svg"
        height="40px"
        width="40px"
        class="mr-2">

        <div v-if="true" class="mr-6" style="font-size: 1.2rem;">
          UNICRYPT
        </div>
      </v-toolbar-title>

      <v-btn rounded text to="/dashboard">
        <v-icon class="blocks-icon-green">mdi-fire</v-icon> DASHBOARD
      </v-btn>

      <v-menu
      offset-y
      open-on-hover
      content-class="br-20 pa-0"
      >
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            text
            rounded
            v-bind="attrs"
            v-on="on"
            style="min-width: 74px;"
            @click.stop="clickBrowserButton"
          >
            BROWSER
            <v-icon small>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list style="min-width: 250px;" class="foreground br-20 pa-0">
          <div class="px-4 py-2 caption font-italic text-center background">
            Select an exchange
          </div>
          <div class="d-flex align-center c-list pa-4 border-b" @click="selectExchange('Uniswap V2')">
            <img 
            :src="$settings.AMMS['Uniswap V2'].icon"
            height="30px"
            width="30px"
            class="mr-3">
            <div>
              <div class="caption">
                Uniswap V2
              </div>
              <div class="caption textFaint--text">
                Ethereum Mainnet
              </div>
            </div>
          </div>
          <div class="d-flex align-center c-list pa-4 border-b" @click="selectExchange('Pancakeswap V2')">
            <img 
            :src="$settings.AMMS['Pancakeswap V2'].icon"
            height="30px"
            width="30px"
            class="mr-3">
            <div>
              <div class="caption">
                Pancakeswap V2
              </div>
              <div class="caption textFaint--text">
                Binance smart chain
              </div>
            </div>
          </div>
          <div class="d-flex align-center c-list px-4 py-3 border-b" @click="$router.push('/amm')">
            <img 
            :src="$settings.AMMS['Sushiswap V1'].icon"
            height="20px"
            width="20px"
            style="z-index: 2;">
            <img 
            :src="$settings.AMMS['Quickswap V1'].icon"
            height="20px"
            width="20px"
            class="br-c"
            style="margin-left: -10px;z-index: 1;">
            <div>
              <div class="ml-4 textFaint--text caption">
                ...other exchanges
                <v-icon small>mdi-chevron-right</v-icon>
              </div>
            </div>
          </div>
        </v-list>
      </v-menu>

      <v-btn text rounded to="/services">
        SERVICES
      </v-btn>

      <v-btn text rounded :to="`${$store.state.chainPrefix}/farms`">
        FARMS
      </v-btn>
      <!--
      <v-btn text href="https://unibot.network/" target="_blank">
        Unibot
      </v-btn>
      -->
      <v-spacer></v-spacer>
      <tx-spinner></tx-spinner>
      
      <v-btn
      v-if="wrongNetwork"
      @click="connectWallet"
      small
      color="red"
      :class="['font-weight-bold']"
      rounded depressed
      >
        Wrong network
        <!--
          <div class="caption ml-1">
          Switch your wallet to {{ $store.state.requiredNetwork }}
        </div>
        -->
      </v-btn>

      <v-btn
      v-else
      @click="connectWallet"
      outlined
      small
      :color="walletConnected ? 'text' : 'text'"
      :class="['font-weight-bold']"
      rounded depressed
      >
          <span v-if="!sEthers.coinbase">CONNECT</span>
          <span v-else>{{ sEthers.coinbase_condensed }}</span>
      </v-btn>

      <v-btn
        icon
        to="/account"
        class="ml-2"
      >
        <v-icon v-if="signedIn" color="text">mdi-account-outline</v-icon>
        <v-icon v-else color="textFaint">mdi-account-question-outline</v-icon>
      </v-btn>

      <div v-if="$store.state.user.jwtObject.user_id === '21'">
        <v-btn @click="toggleSuperUserMode" icon>
          <v-icon :color="$store.state.superUserMode ? 'primary' : ''">mdi-atom</v-icon>
        </v-btn>
      </div>

      <v-btn icon @click="changeTheme" color="textFaint">
        <v-icon small>mdi-white-balance-sunny</v-icon>
      </v-btn>

      <v-btn v-if="false" icon @click="openMenu" color="text" class="mr-2">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

    </v-app-bar>

    <!-- MOBILE TOOLBAR -->
    <v-app-bar
      v-else
      app
      flat
      color="midground"
    >

      <v-btn small rounded outlined to="/dashboard">
        <v-icon class="blocks-icon-green">mdi-fire</v-icon>
        DASHBOARD
      </v-btn>

      <v-toolbar-title v-if="false" class="font-weight-bold">
        <div class="">
          UNICRYPT
        </div>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="text-center">
        <v-btn
        v-if="wrongNetwork"
        @click="connectWallet"
        small
        color="red"
        :class="['font-weight-bold']"
        rounded depressed
        >
          Wrong network
          <!--
            <div class="caption ml-1">
            Switch your wallet to {{ $store.state.requiredNetwork }}
          </div>
          -->
        </v-btn>

        <v-btn
        v-else
        @click="connectWallet"
        small
        outlined
        :color="walletConnected ? 'text' : 'text'"
        :class="['font-weight-bold']"
        rounded depressed
        >
            <span v-if="!walletConnected">Connect</span>
            <span v-else>{{ sEthers.coinbase_condensed }}</span>
        </v-btn>
      </div>

      <div class="">
        <tx-spinner small color="text"></tx-spinner>
      </div>

      <v-btn small icon @click="openMenu" color="text" class="mr-1">
        <v-icon small>mdi-menu</v-icon>
      </v-btn>

    </v-app-bar>

    <v-main :class="['background', {'ima': showBackground && !$vuetify.breakpoint.xs}]">

      <div v-if="!isMainnet && false" class="pa-2 text-center foreground border-b blue--text justify-center" style="">
        <div class="font-weight-bold">
          <v-icon color="blue" class="mr-1" size="18">mdi-information-outline</v-icon>
          {{ $store.state.requiredNetwork }} testnet
        </div>
      </div>

      <!-- <div v-if="darkMode && $vuetify.breakpoint.mdAndUp" class="radial-gr"></div> -->
      <div v-if="darkMode" :class="[{'radial-gr': $vuetify.breakpoint.mdAndUp}, {'radial-gr-mobile': $vuetify.breakpoint.smAndDown}]"></div>
      <!-- Keep alive Pairs? -->

      <router-view></router-view>

      <v-fab-transition>
        <v-btn
        v-scroll="onScroll"
        v-show="scrollFab"
        fab
        dark
        fixed
        bottom
        right
        :style="$vuetify.breakpoint.mobile ? 'bottom: 70px;' : 'bottom: 100px;'"
        color="primary"
        @click="toTop"
        >
          <v-icon color="white">mdi-chevron-up</v-icon>
        </v-btn>
      </v-fab-transition>

    </v-main>

    <!-- DESKTOP FOOTER -->
    <v-footer v-if="$vuetify.breakpoint.mdAndUp" class="pa-4 justify-center foreground border-t">
      <v-btn icon color="textFaint" x-large href="https://twitter.com/UNCX_token" target="_blank">
        <v-icon>mdi-twitter</v-icon>
      </v-btn>
      <v-btn color="textFaint" x-large icon rounded href="https://t.me/uncx_token" target="_blank">
        <v-icon>mdi-telegram</v-icon>
      </v-btn>
      <v-btn text rounded target="_blank" href="https://docs.unicrypt.network">
        Docs
      </v-btn>
      <v-btn text rounded to="/terms" exact>
        Terms and Conditions
      </v-btn>
      <v-btn text rounded to="/terms/privacy-policy">
        Privacy Policy
      </v-btn>
      <v-btn text rounded target="_blank" href="https://www.unicrypt.network">
        unicrypt.network
      </v-btn>
      <!--
      <v-btn text rounded target="_blank" href="https://docs.unicrypt.network">
        Terms and conditions
      </v-btn>
      -->
    </v-footer>
    <!-- END DESKTOP FOOTER -->

    <!-- MOBILE FOOTER -->
    <v-footer v-else app fixed class="justify-center pa-0 foreground border-t">

      <v-bottom-navigation
        color="primary"
        grow
        class="align-center midground"
        style=""
      >

        <v-btn to="/amm" @click.stop="clickBrowserButton">
          <span class="font-weight-medium">BROWSER</span>
          <v-icon>mdi-checkbox-blank-circle-outline</v-icon>
        </v-btn>

        <v-btn to="/services">
          <span class="font-weight-medium">SERVICES</span>
          <v-icon>mdi-checkbox-multiple-blank-circle-outline</v-icon>
        </v-btn>

        <v-btn :to="`${$store.state.chainPrefix}/farms`">
          <span class="font-weight-medium">FARMS</span>
          <v-icon>mdi-sprout-outline</v-icon>
        </v-btn>

        <v-btn to="/account">
          <span class="font-weight-medium">ACCOUNT</span>
          <v-icon v-if="signedIn">mdi-account-outline</v-icon>
          <v-icon v-else>mdi-account-outline</v-icon>
        </v-btn>

        <v-btn v-if="$store.state.superUserMode" :to="`${$store.state.ammPrefix}/sajfkhflkjasdlisdulansdlakds`">
          <span>Super</span>
          <v-icon>mdi-atom</v-icon>
        </v-btn>
      </v-bottom-navigation>

    </v-footer>
    <!-- END MOBILE FOOTER -->

    <main-menu ref="mainMenu"></main-menu>

    <token-page ref="tokenPage"></token-page>

    <!-- DIALOGS -->
    <web-3-error ref="web3Error"></web-3-error>
    <connect-wallet-dialog ref="connectWalletDialog"></connect-wallet-dialog>
    <confirm-tx-dialog ref="confirmTxInWallet"></confirm-tx-dialog>
    <auto-login-dialog ref="autoLoginDialog"></auto-login-dialog>
    <account-intercept-dialog ref="accountInterceptDialog"></account-intercept-dialog>
    <testnet-dialog ref="testnetDialog"></testnet-dialog>
    <global-success-dialog ref="globalSuccessDialog"></global-success-dialog>
    <chain-switcher-dialog ref="chainSwitcherDialog"></chain-switcher-dialog>
    <arbitrage-dialog ref="arbitrageDialog"></arbitrage-dialog>
    <splash-campaign-dialog ref="splashCampaignDialog"></splash-campaign-dialog>
    <!-- DIALOGS -->

    <v-overlay :value="overlay" opacity="1" class="text-center">
      <v-scale-transition appear mode="out-in">
        <div>
          <img 
          src="@/assets/img/unicrypt_network.svg" 
          height="160px"
          width="320px">
          <div v-if="false" class="textFaint--text" style="letter-spacing: 0.5rem!important;">
            DEFI SERVICES
          </div>
        </div>
      </v-scale-transition>
    </v-overlay>

    <v-dialog v-model="wrongNetwork" persistent max-width="450" content-class="br-20">
      <v-card class="br-20">

        <v-card-text class="pa-0">
          <div class="text-center">
            <div class="pa-4 text-center mb-2 background font-weight-medium">
              Wrong Network
            </div>
            <div class="pa-4">
              <div class="text-center">
                <img 
                :src="$settings.CHAINS[$store.state.requiredNetwork].icon" 
                height="34px"
                width="34px"
                class="br-20">
              </div>
              <div class="caption font-italic textFaint--text">
                Switch your wallet to
              </div>
              <div class="">
                {{ $store.state.requiredNetworkDisplayName }}
              </div>
              <v-btn v-if="$store.state.requiredNetwork === 'xDai'" small text color="primary" rounded href="https://www.xdaichain.com/for-users/wallets/metamask/metamask-setup" target="_blank">
                How to switch to {{ $store.state.requiredNetworkDisplayName }}?
              </v-btn>
              <v-btn v-if="$store.state.requiredNetwork === 'BSC_MAINNET'" small text color="primary" rounded href="https://docs.binance.org/smart-chain/wallet/metamask.html" target="_blank">
                How to switch to {{ $store.state.requiredNetworkDisplayName }}?
              </v-btn>
              <v-btn v-if="$store.state.requiredNetwork === 'Matic'" small text color="primary" rounded href="https://docs.matic.network/docs/develop/metamask/config-matic" target="_blank">
                How to switch to {{ $store.state.requiredNetworkDisplayName }}?
              </v-btn>

              <div v-if="false" class="caption mt-4 textFaint--text">
                <div>
                  Your current connection:
                </div>
                {{ currentNetwork }}
              </div>
              <div class="caption my-4 textFaint--text">
                *You can browse the app on all chains by disconnecting your wallet.
              </div>
              <v-btn block large depressed class="green-button white--text" rounded @click="disconnect">
                Disconnect Wallet
              </v-btn>
            </div>
          </div>

        </v-card-text>

      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
import Web3Error from '@/views/DialogWeb3Error'
import ConfirmTxDialog from '@/web3/confirm-tx-in-wallet'
import ConnectWalletDialog from '@/web3/connect-dialog'
import TokenPage from '@/views/tokens/token-page'
import ConnectProvider from '@/web3/connect-provider'
import TxSpinner from '@/web3/transaction-spinner'
import MainMenu from '@/components/ui/main-menu'
import AutoLoginDialog from '@/views/account/social-profile/auto-login-dialog'
import AccountInterceptDialog from '@/views/account/social-profile/account-action-intercept-dialog'
import TestnetDialog from '@/components/dialogs/testnet-only-dialog'
import GlobalSuccessDialog from '@/components/dialogs/global-success-dialog'
import ChainSwitcherDialog from '@/components/dialogs/chain-switcher-dialog'
import SplashCampaignDialog from '@/components/dialogs/splash-campaign'
import PROVIDERS from '@/web3/providers'
import { ethers } from 'ethers'
// import Vue from 'vue'
import ArbitrageDialog from '@/views/arbitrage/dialog'

export default {
  name: 'App',

  components: {
    Web3Error,
    ConnectWalletDialog,
    TxSpinner,
    ConfirmTxDialog,
    MainMenu,
    TokenPage,
    AutoLoginDialog,
    AccountInterceptDialog,
    TestnetDialog,
    GlobalSuccessDialog,
    ChainSwitcherDialog,
    ArbitrageDialog,
    SplashCampaignDialog
  },

  data: () => ({
    showBackground: false,
    scrollFab: false,
    overlay: true,
    intervalID: null,
    currentNetwork: {},
    chains: {
      'BSC_MAINNET': {
        chainId: '0x38',
        chainName: "Binance Smart Chain",
        rpcUrls: ["https://bsc-dataseed.binance.org/"],
        blockExplorerUrls: ['https://bscscan.com/'],
        nativeCurrency: {
          name: "BNB",
          symbol: "BNB",
          decimals: 18
        }
      },
      'xDai': {
        chainId: '0x64',
        chainName: "xDAI Chain",
        rpcUrls: ["https://dai.poa.network"],
        iconUrls: [
          "https://xdaichain.com/fake/example/url/xdai.svg",
          "https://xdaichain.com/fake/example/url/xdai.png"
        ],
        nativeCurrency: {
          name: "xDAI",
          symbol: "xDAI",
          decimals: 18
        }
      },
      'Matic': {
        chainId: '0x89',
        chainName: "Matic",
        rpcUrls: ["https://rpc-mainnet.maticvigil.com"],
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18
        }
      },
      /* 'Kovan': { // THIS DOES NOT WORK YET, AWAITING METAMASK EIP UPDATE TO SUPPORT METAMASK DEFAULT CHAINS
        chainId: '0x2a',
        chainName: "Kovan",
        rpcUrls: ["https://kovan.infura.io/v3/undefined"],
        blockExplorerUrls: ["https://kovan.etherscan.io"],
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18
        }
      }, */
      'Hardhat': {
        chainId: '0x539',
        chainName: "Hardhat",
        rpcUrls: ["http://127.0.0.1:8545/"],
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18
        }
      }
    }
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    wrongNetwork () {
      return this.$store.state.wrongNetwork
    },
    requiredNetwork () {
      return this.$store.state.requiredNetwork
    },
    isMainnet () {
      var mainnets = ['Mainnet', 'BSC_MAINNET', 'xDai', 'Matic']
      return mainnets.includes(this.$store.state.requiredNetwork)
    },
    walletConnected () {
      return this.sEthers.coinbase
    },
    blockNumber () {
      return this.$store.state.blockNumber
    },
    signedIn () {
      return this.$store.state.user.username
    },
    darkMode () {
      var theme = this.$store.state.theme
      return theme === 'theme2' || theme === 'theme3'
    }
  },

  watch: {
    'sEthers.provider' () { // e.g. on manual network change within metamask
      this.wrongNetworkCheck()
    },
    requiredNetwork () { // on an app based change such as switching chains in the UI
      this.wrongNetworkCheck()
    }
  },

  methods: {
    selectExchange (exchange) {
      this.$store.commit('switchExchange', exchange)
      this.$root.ammLink(`/pairs`)
    },
    clickBrowserButton () {
      if (!this.$store.state.exchange || this.$settings.AMMS[this.$store.state.exchange].chain !== this.$store.state.requiredNetwork) {
        var amms = Object.keys(this.$settings.AMMS).filter(key => this.$settings.AMMS[key].chain === this.$store.state.requiredNetwork)
        this.$store.commit('switchExchange', amms[0])
      }
      var url = '/tokens'
      this.$router.replace(`${this.$store.state.ammPrefix}${url}`)
    },
    toggleSuperUserMode () {
      this.$store.commit('setSuperUserMode', !this.$store.state.superUserMode)
    },
    changeTheme () {
      var themeName = "theme1"
      if (this.$store.state.theme === "theme1") {
        themeName = "theme2"
      }
      this.$store.commit('setTheme',{
        themeName: themeName,
        vuetify: this.$vuetify
      })
    },
    async wrongNetworkCheck () {
      var network = await this.sEthers.provider.getNetwork()
      this.currentNetwork = network
      var wrongNetwork = true
      if (this.$store.state.requiredNetwork === 'Mainnet') {
        wrongNetwork = network.chainId !== 1
      } else if (this.$store.state.requiredNetwork === 'Kovan') {
        wrongNetwork = network.chainId !== 42
      } else if (this.$store.state.requiredNetwork === 'Ganache') {
        wrongNetwork = network.chainId !== 1337
      } else if (this.$store.state.requiredNetwork === 'Hardhat') {
        wrongNetwork = network.chainId !== 1337
      } else if (this.$store.state.requiredNetwork === 'BSC_MAINNET') {
        wrongNetwork = network.chainId !== 56
      } else if (this.$store.state.requiredNetwork === 'xDai') {
        wrongNetwork = network.chainId !== 100
      } else if (this.$store.state.requiredNetwork === 'Matic') {
        wrongNetwork = network.chainId !== 137
      }
      this.$store.commit('setWrongNetwork', wrongNetwork)

      if (this.sEthers.coinbase) {
        window.ethereum.request({
          method: 'eth_chainId',
          params: [],
        })
          .then(res => {
            console.log(res)
          })

        window.ethereum.request({
          jsonrpc: "2.0",
          method: 'wallet_addEthereumChain',
          params: [this.chains[this.$store.state.requiredNetwork]],
        })
          .then(success => {
            // console.log(success)
          })
          .catch(console.error)
      }
    },
    openMenu () {
      this.$refs.mainMenu.open()
    },
    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.scrollFab = top > 20
    },
    toTop () {
      this.$vuetify.goTo(0)
    },
    connectWallet () {
      this.$root.$dialog.connectWalletDialog.open()
        .catch(e => {})
    },
    initilizeApp () {
      var theme = localStorage.getItem('theme')
      if (!['theme1', 'theme2', 'theme3'].includes(theme)) {
        theme = 'theme2'
      }
      this.$store.commit('setTheme',{
        themeName: theme,
        vuetify: this.$vuetify
      })

      var jwt = localStorage.getItem('token')
      if (jwt) {
        this.$userAxios.defaults.headers.common.Authorization = `Bearer ${jwt}`
        this.$userAxios.post(`/users/jwt-autologin`)
          .then(response => {
            this.$store.commit('login', response.data)
            // this.$refs.autoLoginDialog.open()
          })
          .catch(error => {
            // console.log(error.response.data.errors[0])
            console.log(error)
          })
      }
    },
    wssReconnect () {
      if (!this.sEthers.coinbase) {
        ConnectProvider.connectViewOnlyProvider()
        // console.log('reconnected')
      }
    },
    disconnect () {
      ConnectProvider.disconnect()
    },
  },

  created () {
    ConnectProvider.connectViewOnlyProvider()
    // this.intervalID = setInterval(this.wssReconnect, 30000)
  },
  mounted () {
    // this.$store.commit('switchExchange', this.$store.state.exchange)
    this.$root.$dialog = {}
    this.$root.$dialog.web3Error = this.$refs.web3Error
    this.$root.$dialog.confirmTx = this.$refs.confirmTxInWallet
    this.$root.$dialog.connectWalletDialog = this.$refs.connectWalletDialog
    this.$root.$dialog.accountInterceptDialog = this.$refs.accountInterceptDialog
    this.$root.$dialog.globalSuccess = this.$refs.globalSuccessDialog
    this.$root.$dialog.chainSwitcher = this.$refs.chainSwitcherDialog
    this.$root.$dialog.arbitrage = this.$refs.arbitrageDialog
    this.$root.PROVIDERS = PROVIDERS
    this.$root.PROVIDERS.init()
    // Vue.set(this.$root.PROVIDERS, 'fucker', -1)

    this.$root.tokenPage = this.$refs.tokenPage

    this.$root.ammLink = (url, push = true) => {
      this.$router.replace(`${this.$store.state.ammPrefix}${url}`)
    }

    this.$root.ammLinkTwo = (url, exchange) => {
      if (this.$store.state.exchange !== exchange) {
        this.$store.commit('switchExchange', exchange)
      }
      this.$router.push(`${this.$store.state.ammPrefix}${url}`)
    }

    this.$root.formatAmount = (_amount, _decimals) => {
      var amount = ethers.utils.formatUnits(_amount, _decimals)
      // var maxDigits = ethers.BigNumber.from(_amount).gt(ethers.BigNumber.from(10).pow(_decimals)) ? 2 : _decimals
      var maxDigits = _decimals
      if (_decimals > 0) {
        if (ethers.BigNumber.from(_amount).gt(ethers.BigNumber.from(10).pow(_decimals - 1))) {
          maxDigits = 2
        }
      }
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: maxDigits})
    }

    this.initilizeApp()
    setTimeout(() => {
      this.overlay = false
      // this.$refs.splashCampaignDialog.open()
      if (!this.isMainnet) {
        // this.$refs.testnetDialog.open() // TODO remove this block if you dont want a tested popup on start
      }
    }, 2500)
  }
}
</script>

<style scoped lang="scss">
.ima {
  background-image: url(https://picsum.photos/1000?image=521);
  background-image: url(https://cdn.pixabay.com/photo/2016/10/30/20/22/astronaut-1784245_1280.jpg);
  // background-image: url(https://cdn.pixabay.com/photo/2016/07/28/14/40/space-1548139_1280.jpg);
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.92), rgba(0, 0, 0, 0.93)), url(https://cdn.pixabay.com/photo/2016/08/03/09/03/universe-1566159_1280.jpg);
  // background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0.93)), url(https://cdn.pixabay.com/photo/2016/10/30/20/22/astronaut-1784245_1280.jpg);
  // background-image: url(https://cdn.pixabay.com/photo/2016/04/15/04/02/water-1330252_1280.jpg);
  // background-image: url(https://cdn.pixabay.com/photo/2020/06/28/00/35/sky-5347490_1280.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.radial-gr {
  right: 0px;
  pointer-events: none;
  height: 200vh;
  mix-blend-mode: color;
  background: radial-gradient(50% 50% at 50% 50%, rgba(33, 114, 229, 0.4) 0%, rgba(255, 255, 255, 0) 100%);
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 9999;
  transform: translateY(-110vh);
  max-width: 100vw !important;
}
.radial-gr-mobile {
  right: 0px;
  pointer-events: none;
  height: 200vh;
  mix-blend-mode: color;
  background: radial-gradient(50% 50% at 50% 50%, rgba(33, 114, 229, 0.4) 0%, rgba(255, 255, 255, 0) 100%);
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 9999;
  transform: translateY(-110vh);
  max-width: 100vw !important;
}
</style>
