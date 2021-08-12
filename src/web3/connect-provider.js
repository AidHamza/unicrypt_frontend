import {store} from '@/store/index'
import { ethers } from "ethers"
import WalletConnectProvider from "@walletconnect/web3-provider"
import WalletLink from 'walletlink'
import StaticConnectorVars from './static'
// import StaticSettings from '@/store/settings'

// Initialize WalletLink
const walletLink = new WalletLink({
  appName: "UniCrypt",
  appLogoUrl: "https://i.imgur.com/WCwbSiX.png",
  darkMode: false
})

const Self = {
  async getCoinbase (provider) {
    var accounts = await provider.send('eth_requestAccounts')
    // var accounts = await provider.eth.getAccounts()
    return accounts[0]
  },
  async connectViewOnlyProvider () {
    this.removeBlockListener() // MUST BE CALLED AT THE START OF ANY PROVIDER CHANING EVENT TO UNREGISTER BLOCK LISTENER
    // var homesteadProvider = ethers.getDefaultProvider('kovan')
    // var homesteadProvider = ethers.getDefaultProvider('ropsten')
    // var homesteadProvider = new ethers.providers.JsonRpcProvider("https://ropsten.infura.io/v3/3cd774e14cf34ff78167908f8377051c");
    // var homesteadProvider = ethers.getDefaultProvider('homestead')
    var requiredNetwork = store.state.requiredNetwork
    var provider
    if (requiredNetwork === 'Mainnet') {
      // provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.alchemyapi.io/v2/1KG6nTCsOnYWt4Ec3S_ghNjIJUEqi4ko")
      provider = new ethers.providers.JsonRpcProvider("https://broken-proud-cherry.quiknode.pro/f146c59b4b14b3c76ea6c04cdb21d0a3/")
      // provider = new ethers.providers.WebSocketProvider("wss://broken-proud-cherry.quiknode.pro/f146c59b4b14b3c76ea6c04cdb21d0a3/")
    } else if (requiredNetwork === 'Kovan') {
      provider = new ethers.providers.JsonRpcProvider("https://summer-small-moon.kovan.quiknode.pro/4d8c4d36044ac85642d3a5fbfd120e16264453d9/")
    } else if (requiredNetwork === 'Ganache') {
      provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    } else if (requiredNetwork === 'Hardhat') {
      provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    } else if (requiredNetwork === 'BSC_MAINNET') {
      provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
    } else if (requiredNetwork === 'xDai') {
      provider = new ethers.providers.JsonRpcProvider("https://rpc.xdaichain.com/");
    } else if (requiredNetwork === 'Matic') {
      // provider = new ethers.providers.JsonRpcProvider("https://rpc-mainnet.maticvigil.com/");
      provider = new ethers.providers.JsonRpcProvider("https://wild-quiet-breeze.matic.quiknode.pro/fb90655e4776074c95611ccb25409f2c1495b427/");
    }

    provider.getBlockNumber()
      .then(blockNumber => {
        store.commit('setBlockNumber', blockNumber)
      })
    
    store.commit('updateEthers', {
      provider: provider
    })

    this.registerBlockListener()
  },
  async connectToMetamask () {
    this.removeBlockListener() // MUST BE CALLED AT THE START OF ANY PROVIDER CHANING EVENT TO UNREGISTER BLOCK LISTENER
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    var coinbase = await this.getCoinbase(provider)
    var checksum_address = ethers.utils.getAddress(coinbase)
    store.commit('updateEthers', {
      coinbase: checksum_address,
      providerName: StaticConnectorVars.METAMASK,
      provider: provider,
      signer: signer,
      // network: StaticMap.networkHexToInt[window.ethereum.chainId]
    })
    this.removeMetamaskListeners()
    this.addMetamaskListeners()
    this.registerBlockListener()
  },
  // coinbase
  async connectToWalletLink () {
    this.removeBlockListener() // MUST BE CALLED AT THE START OF ANY PROVIDER CHANING EVENT TO UNREGISTER BLOCK LISTENER
    var wlprovider = walletLink.makeWeb3Provider("https://broken-proud-cherry.quiknode.pro/f146c59b4b14b3c76ea6c04cdb21d0a3/", 1)
    const provider = new ethers.providers.Web3Provider(wlprovider)
    const signer = provider.getSigner()
    var coinbase = await this.getCoinbase(provider)
    var checksum_address = ethers.utils.getAddress(coinbase)
    store.commit('updateEthers', {
      coinbase: checksum_address,
      providerName: StaticConnectorVars.WALLETLINK,
      provider: provider,
      signer: signer,
      walletLinkProvider: wlprovider
      // network: StaticMap.networkHexToInt[window.ethereum.chainId]
    })
    this.removeMetamaskListeners()
    this.registerBlockListener()
  },
  async connectWalletConnect () {
    this.removeBlockListener() // MUST BE CALLED AT THE START OF ANY PROVIDER CHANING EVENT TO UNREGISTER BLOCK LISTENER
    var requiredNetwork = store.state.requiredNetwork
    var settings
    if (requiredNetwork === 'Mainnet') {
      settings = {
        rpc: {1: "https://broken-proud-cherry.quiknode.pro/f146c59b4b14b3c76ea6c04cdb21d0a3/"}
      }
    } else if (requiredNetwork === 'Kovan') {
      settings = {
        rpc: {42: "https://summer-small-moon.kovan.quiknode.pro/4d8c4d36044ac85642d3a5fbfd120e16264453d9/"}
      }
    } else if (requiredNetwork === 'Ganache') {
      settings = {
        rpc: {1: "https://broken-proud-cherry.quiknode.pro/f146c59b4b14b3c76ea6c04cdb21d0a3/"}
      }
    } else if (requiredNetwork === 'xDai') {
      settings = {
        rpc: {100: "https://rpc.xdaichain.com/"}
      }
    } else if (requiredNetwork === 'BSC_MAINNET') {
      settings = {
        rpc: {56: "https://bsc-dataseed.binance.org/"}
      }
    } else if (requiredNetwork === 'Matic') {
      settings = {
        rpc: {137: "https://rpc-mainnet.maticvigil.com/"}
      }
    }

    const walletConnectProvider = new WalletConnectProvider(settings)
    await walletConnectProvider.enable();
    var connector = new ethers.providers.Web3Provider(walletConnectProvider)
    const signer = connector.getSigner()

    var checksum_address = ethers.utils.getAddress(walletConnectProvider.wc.accounts[0])
    store.commit('updateEthers', {
      coinbase: checksum_address,
      providerName: StaticConnectorVars.WALLETCONNECT,
      provider: connector,
      signer: signer,
      walletConnectProvider: walletConnectProvider
    })

    // Check if connection is already established
    if (!walletConnectProvider.connected) {
      // create new session
      walletConnectProvider.createSession();
    }

    // Subscribe to connection events
    connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
      console.log(accounts)
      console.log(chainId)
    })

    walletConnectProvider.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0]
      console.log(accounts)
      console.log(chainId)
    })

    walletConnectProvider.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }

      // Delete connector
    })
    this.registerBlockListener()
  },
  async connectToMobileWallet () {
    this.removeBlockListener() // MUST BE CALLED AT THE START OF ANY PROVIDER CHANING EVENT TO UNREGISTER BLOCK LISTENER
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    var coinbase = await this.getCoinbase(provider)
    var checksum_address = ethers.utils.getAddress(coinbase)
    var homesteadProvider = ethers.getDefaultProvider('homestead')

    var providerName = ""
    if (window.ethereum.isMetaMask) {
      providerName = StaticConnectorVars.METAMASK
    } else if (window.ethereum.isToshi || window.ethereum.isCoinbaseWallet) {
      providerName = 'Coinbase'
    }
    store.commit('updateEthers', {
      coinbase: checksum_address,
      providerName: providerName,
      provider: homesteadProvider,
      signer: signer,
    })
    // this.close()
    this.registerBlockListener()
  },
  removeMetamaskListeners () {
    window.ethereum.removeAllListeners('accountsChanged')
    window.ethereum.removeAllListeners('chainChanged')
  },
  addMetamaskListeners () {
    window.ethereum.on('accountsChanged', accounts => {
      var checksum_address = ethers.utils.getAddress(accounts[0])
      store.commit('updateEthers', {
        coinbase: checksum_address
      })
    })
    window.ethereum.on('chainChanged', () => {
      this.connectToMetamask()
    })
  },
  disconnect () {
    if (store.state.ethers.providerName === StaticConnectorVars.WALLETCONNECT) {
      store.state.ethers.walletConnectProvider.disconnect()
    }
    if (store.state.ethers.providerName === StaticConnectorVars.WALLETLINK) {
      store.state.ethers.walletLinkProvider.disconnect()
    }
    store.commit('updateEthers', {
      coinbase: null,
      coinbase_condensed: null,
      providerName: null,
      signer: null,
      walletConnectProvider: null,
      walletLinkProvider: null
    })
    
    this.connectViewOnlyProvider()
  },
  registerBlockListener () {
    this.removeBlockListener()
    /* store.state.ethers.provider.on('block', (blockNumber) => {
      if (StaticSettings.CHAIN_IDS[store.state.requiredNetwork] === store.state.ethers.provider.network.chainId) {
        store.commit('setBlockNumber', blockNumber)
      } else {
        console.log('Wrong chain ' + blockNumber)
      }
    }) */
  },
  removeBlockListener () {
    try {
      // store.state.ethers.provider.off('block', null)
    } catch (e) {}
  },
}

export default Self