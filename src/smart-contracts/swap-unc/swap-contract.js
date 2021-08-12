import {store} from '@/store/index'
import { ethers } from "ethers"
import SwapABI from '@/smart-contracts/swap-unc/swap-abis'
// import ERC20 from '@/smart-contracts/erc20'

const Self = {
  getSwapAmount: async (amount) => {
    var sEthers = store.state.ethers
    var SwapContract = new ethers.Contract(SwapABI.swap_address, SwapABI.swap_abi, sEthers.provider)
    var credit = await SwapContract.swapAmount(amount)
    return credit.toString()
  },
  doSwap: async (amount) => {
    var sEthers = store.state.ethers
    var SwapContract = new ethers.Contract(SwapABI.swap_address, SwapABI.swap_abi, sEthers.signer)
    return SwapContract.doSwap(amount)
  },
}

export default Self