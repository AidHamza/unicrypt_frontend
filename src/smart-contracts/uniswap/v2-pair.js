import {store} from '@/store/index';
import { ethers } from "ethers";
import UNISWAPABI from '@/smart-contracts/uniswap/uniswap-abis'
import ERC20 from '@/smart-contracts/erc20'
import PROVIDERS from '@/web3/providers'

const Self = {
  getReserves: async (_pairAddress, network = null) => {
    var provider = store.state.ethers.provider
    if (network) {
      provider = PROVIDERS[network]
    }
    const UniswapPair = new ethers.Contract(_pairAddress, UNISWAPABI.uniswap_v2pair_abi, provider)
    var reserves = await UniswapPair.getReserves()
    return {
      reserve0: reserves[0].toString(),
      reserve1: reserves[1].toString(),
    }
  },
  hydratePair: async (_pairAddress) => {
    var sEthers = store.state.ethers
    var UniswapPair = new ethers.Contract(_pairAddress, UNISWAPABI.uniswap_v2pair_abi, sEthers.provider)
    var token0 = await UniswapPair.token0()
    var token1 = await UniswapPair.token1()
    var totalSupply = await UniswapPair.totalSupply()
    var reserves = await UniswapPair.getReserves()
    token0 = await ERC20.getERC20(token0)
    token1 = await ERC20.getERC20(token1)
    return {
      address: _pairAddress,
      token0: token0,
      token1: token1,
      reserve0: reserves[0].toString(),
      reserve1: reserves[1].toString(),
      totalSupply: totalSupply.toString()
    }
  },
}

export default Self