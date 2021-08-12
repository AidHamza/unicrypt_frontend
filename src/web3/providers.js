import { ethers } from "ethers"
import {store} from '@/store/index';

const Self = {
  'Mainnet': new ethers.providers.JsonRpcProvider("https://broken-proud-cherry.quiknode.pro/f146c59b4b14b3c76ea6c04cdb21d0a3/"),
  'Kovan': new ethers.providers.JsonRpcProvider("https://summer-small-moon.kovan.quiknode.pro/4d8c4d36044ac85642d3a5fbfd120e16264453d9/"),
  'BSC_MAINNET': new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/"),
  'xDai': new ethers.providers.JsonRpcProvider("https://lingering-shy-surf.xdai.quiknode.pro/257cd3259316bd50f33deba12f31fa332ccbac7d/"),
  'Matic': new ethers.providers.JsonRpcProvider("https://wild-quiet-breeze.matic.quiknode.pro/fb90655e4776074c95611ccb25409f2c1495b427/"),

  intervals: {
    'Matic': null,
    'xDai': null
  },
  init () {
    Self.Mainnet.on('block', (blockNumber) => {
      store.commit('setBlockNum', { 
        blockNumber: blockNumber,
        network: 'Mainnet'
      })
    })
    Self.BSC_MAINNET.on('block', (blockNumber) => {
      store.commit('setBlockNum', { 
        blockNumber: blockNumber,
        network: 'BSC_MAINNET'
      })
    })
    Self.Kovan.on('block', (blockNumber) => {
      store.commit('setBlockNum', { 
        blockNumber: blockNumber,
        network: 'Kovan'
      })
    })
    /* Self.xDai.on('block', (blockNumber) => {
      store.commit('setBlockNum', { 
        blockNumber: blockNumber,
        network: 'xDai'
      })
    }) */
    Self.intervals.xDai = setInterval(() => {
      Self.getBlockNumberByInterval('xDai')
    }, 10000)
    clearInterval(this.intervalID)
    /* Self.Matic.on('block', (blockNumber) => {
      console.log('block listener', blockNumber)
      store.commit('setBlockNum', { 
        blockNumber: blockNumber,
        network: 'Matic'
      })
    }) */
    Self.intervals.Matic = setInterval(() => {
      Self.getBlockNumberByInterval('Matic')
    }, 10000)
    clearInterval(this.intervalID)
  },
  
  async getBlockNumberByInterval (_network) {
    var blockNumber = await Self[_network].getBlockNumber()
    store.commit('setBlockNum', { 
      blockNumber: blockNumber,
      network: _network
    })
  }
}

export default Self