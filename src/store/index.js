import Vue from 'vue'
import Vuex from 'vuex'
import themes from '@/plugins/themes.js'
import ConnectProvider from '@/web3/connect-provider'
import SETTINGS from '@/store/settings'

Vue.use(Vuex)

// SETTINGS - CHANGE ALL
const NETWORK = 'Mainnet' // Hardcoded (wont change) // options: Ganache, Mainnet, Kovan, BSC_MAINNET, XDAI
const EXCHANGE = 'Uniswap V2' // Uniswap, Pancakeswap, Honeyswap

export const store = new Vuex.Store({
  state: {
    theme: 'theme1',
    blockNumber: -1,
    blockNumz: {
      Mainnet: -1,
      BSC_MAINNET: -1,
      xDai: -1,
      Matic: -1
    },
    blocksPerSecond: SETTINGS.BLOCK_TIME[NETWORK],
    requiredNetwork: NETWORK,
    requiredNetworkDisplayName: SETTINGS.CHAIN_DISPLAY_NAME[NETWORK],
    exchange: EXCHANGE,
    ammPrefix: `/amm/${SETTINGS.AMMS[EXCHANGE].shortname}`,
    chainPrefix: `/chain/${SETTINGS.CHAIN_URL_NAME[NETWORK]}`,
    etherscan_url: SETTINGS.ETHERSCAN_URL[NETWORK],
    explorer_name: SETTINGS.EXPLORER_NAME[NETWORK],
    graphExplorer: SETTINGS.AMMS[EXCHANGE].graphExplorer,
    exchangeTokenLink: SETTINGS.AMMS[EXCHANGE].ammTokenLink,
    exchangePairLink: SETTINGS.AMMS[EXCHANGE].ammPairLink,
    nativeGasTokenSymbol: SETTINGS.NATIVE_GAS_TOKEN_SYMBOL[NETWORK],
    wrongNetwork: false,

    superUserMode: false,
    
    user: {
      username: null,
      jwtToken: null,
      jwtObject: {},
      watchlist: {},
      watchlistKeys: [],
      watchlistLastUpdated: null
    },
    ethers: {
      coinbase: null,
      coinbase_condensed: null,
      providerName: null, // values: Metamask, Coinbase
      provider: null,
      signer: null,
      network: 1,
      watcher: null, // watcher
      walletConnectProvider: null,
      walletLinkProvider: null,
    },
    pendingTx: {
      pending: [], // [txhash, txhash]
      tx: {}
    },
  },
  mutations: {
    setSuperUserMode (state, mode) {
      state.superUserMode = mode
    },
    setWrongNetwork (state, flag) {
      state.wrongNetwork = flag
    },
    switchExchange (state, exchange) {
      state.exchange = exchange
      var network = SETTINGS.AMMS[exchange].chain
      console.log(network)
      Vue.prototype.$axios.defaults.baseURL = SETTINGS.AMMS[exchange].server

      state.requiredNetwork = network
      state.requiredNetworkDisplayName = SETTINGS.CHAIN_DISPLAY_NAME[network]
      state.blocksPerSecond = SETTINGS.BLOCK_TIME[network]
      state.etherscan_url = SETTINGS.ETHERSCAN_URL[network]
      state.explorer_name = SETTINGS.EXPLORER_NAME[network]
      state.graphExplorer = SETTINGS.AMMS[exchange].graphExplorer
      state.exchangeTokenLink = SETTINGS.AMMS[exchange].ammTokenLink
      state.exchangePairLink = SETTINGS.AMMS[exchange].ammPairLink
      state.nativeGasTokenSymbol = SETTINGS.NATIVE_GAS_TOKEN_SYMBOL[network]
      state.ammPrefix = `/amm/${SETTINGS.AMMS[exchange].shortname}`
      state.chainPrefix = `/chain/${SETTINGS.CHAIN_URL_NAME[network]}`
      if (!state.ethers.coinbase) {
        ConnectProvider.disconnect()
        ConnectProvider.connectViewOnlyProvider()
      }

      state.user.watchlistKeys = Object.keys((state.user.watchlist[state.requiredNetwork] || {})[state.exchange] || {})
    },
    switchChain (state, network) {
      state.requiredNetwork = network
      state.exchange = null
      state.requiredNetworkDisplayName = SETTINGS.CHAIN_DISPLAY_NAME[network]
      state.blocksPerSecond = SETTINGS.BLOCK_TIME[network]
      state.etherscan_url = SETTINGS.ETHERSCAN_URL[network]
      state.explorer_name = SETTINGS.EXPLORER_NAME[network]
      state.nativeGasTokenSymbol = SETTINGS.NATIVE_GAS_TOKEN_SYMBOL[network]
      state.chainPrefix = `/chain/${SETTINGS.CHAIN_URL_NAME[network]}`
      if (!state.ethers.coinbase) {
        ConnectProvider.disconnect()
        ConnectProvider.connectViewOnlyProvider()
      }
    },
    login (state, loginObject) {
      // JWT
      const base64Url = loginObject.token.split('.')[1]
      const base64 = base64Url.replace('-', '+').replace('_', '/')
      const keyObj = JSON.parse(window.atob(base64))
      state.user.jwtObject = keyObj
      state.user.username = keyObj.username
      state.user.permissions = keyObj.permissions
      state.user.jwtToken = loginObject.token
      localStorage.setItem('token', loginObject.token)
      Vue.prototype.$userAxios.defaults.headers.common.Authorization = `Bearer ${loginObject.token}`
      Vue.prototype.$axios.defaults.headers.common.Authorization = `Bearer ${loginObject.token}`
      // Watchlist copied from 'updateWatchlist'
      state.user.watchlistLastUpdated = Date.now()
      state.user.watchlist = loginObject.watchlist
      state.user.watchlistKeys = Object.keys((loginObject.watchlist[state.requiredNetwork] || {})[state.exchange] || {})
    },
    logout (state) {
      state.user.username = null
      state.user.jwtToken = null
      state.user.jwtObject = {}
      Vue.prototype.$userAxios.defaults.headers.common.Authorization = ``
      Vue.prototype.$axios.defaults.headers.common.Authorization = ``
      localStorage.removeItem('token')
    },
    updateWatchlist (state, watchlist) {
      state.user.watchlistLastUpdated = Date.now()
      state.user.watchlist = watchlist
      state.user.watchlistKeys = Object.keys((watchlist[state.requiredNetwork] || {})[state.exchange] || {})
    },
    setTheme (state, {themeName, vuetify}) {
      state.theme = themeName
      vuetify.theme.setTheme('light', themes[themeName].light)
      localStorage.setItem('theme', themeName)
    },
    setBlockNumber (state, blockNumber) {
      state.blockNumber = blockNumber
    },
    setBlockNum (state, { blockNumber, network }) {
      state.blockNumz[network] = blockNumber
      if (network === state.requiredNetwork) {
        state.blockNumber = blockNumber
      }
    },
    updateEthers (state, payload) {
      state.ethers = Object.assign(state.ethers, payload)
      // state.ethers.watcher = state.ethers.coinbase + state.ethers.network
      state.ethers.watcher = state.ethers.coinbase + state.requiredNetwork
      if ((state.ethers.coinbase || '').length === 42) {
        state.ethers.coinbase_condensed = state.ethers.coinbase.slice(0, 6) + '...' + state.ethers.coinbase.slice(state.ethers.coinbase.length - 4)
      }
    },
    addPendingTx (state, txhash) {
      state.pendingTx.pending.push(txhash)

      var item = {
        created: Date.now(),
        txhash: txhash,
        network: state.requiredNetwork,
        state: 'pending'
      }
      Vue.set(state.pendingTx.tx, txhash, item)
    },
    completePendingTx (state, txhash) {
      state.pendingTx.pending = state.pendingTx.pending.filter(item => item !== txhash)
      state.pendingTx.tx[txhash].state = 'completed'
    },
    failPendingTx (state, txhash) {
      state.pendingTx.pending = state.pendingTx.pending.filter(item => item !== txhash)
      if (state.pendingTx.tx[txhash]) {
        state.pendingTx.tx[txhash].state = 'failed'
      }
    },
  },
  actions: {
  },
  modules: {
  },
  getters: {
  }
})
