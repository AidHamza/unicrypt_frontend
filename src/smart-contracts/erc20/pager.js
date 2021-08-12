import {store} from '@/store/index'
import { ethers } from "ethers"
import ERC20ABI from '@/smart-contracts/erc20/abis'
import PROVIDERS from '@/web3/providers'

const Self = {
  getERC20: async (_tokenAddress, network = null) => {
    var provider = network ? PROVIDERS[network] : store.state.ethers.provider
    const ERC20Pager = new ethers.Contract(ERC20ABI.erc20_pager_address(network), ERC20ABI.erc20_pager_abi, provider)
    var res = await ERC20Pager.getERC(_tokenAddress)
    var checksum_address = ethers.utils.getAddress(_tokenAddress)
    return {
      address: checksum_address,
      name: res[0],
      symbol: res[1],
      decimals: res[2].toString(),
      totalSupply: res[3].toString(),
      isENMT: Boolean(res[4]),
    }
  }
}

export default Self