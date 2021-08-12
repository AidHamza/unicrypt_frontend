import {store} from '@/store/index';
import { ethers } from "ethers";
import UNISWAPABI from '@/smart-contracts/uniswap/uniswap-abis'
import PROVIDERS from '@/web3/providers'

const Self = {
  allPairsLength: async () => {
    var sEthers = store.state.ethers
    var factory = new ethers.Contract(UNISWAPABI.uniswap_factory_address(), UNISWAPABI.uniswap_factory_abi, sEthers.provider)
    var numPairs = await factory.allPairsLength()
    return numPairs.toString()
  },
  getPair: async (_token0, _token1, _factoryAddress = null, network = null) => {
    var provider = network ? PROVIDERS[network] : store.state.ethers.provider
    var factory = _factoryAddress || UNISWAPABI.uniswap_factory_address()
    const UniswapFactory = new ethers.Contract(factory, UNISWAPABI.uniswap_factory_abi, provider)
    var address = await UniswapFactory.getPair(_token0, _token1)
    return address
  },
  uniPairHasLiquidity: async (_token0, _token1) => {
    var sEthers = store.state.ethers
    const UniswapFactory = new ethers.Contract(UNISWAPABI.uniswap_factory_address(), UNISWAPABI.uniswap_factory_abi, sEthers.provider)
    var address = await UniswapFactory.getPair(_token0, _token1)
    if (address === ethers.constants.AddressZero) {
      return false
    }
    const UniswapPair = new ethers.Contract(address, UNISWAPABI.uniswap_v2pair_abi, sEthers.provider)
    var reserves = await UniswapPair.getReserves()
    return ethers.BigNumber.from(reserves[0]).gt(0) && ethers.BigNumber.from(reserves[1]).gt(0)
  }
}

export default Self