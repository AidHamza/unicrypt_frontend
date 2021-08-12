import {store} from '@/store/index';
import { ethers } from "ethers";
import VESTABI from '@/smart-contracts/token-locker/token-locker-abis'
import PROVIDERS from '@/web3/providers'
// import ERC20 from '@/smart-contracts/erc20'

const Self = {
  getNonce: async () => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.provider)
    var res = await Locker.NONCE()
    return res.toString()
  },
  getLocks: async (_lock_ids, network = null) => {
    var provider = network ? PROVIDERS[network] : store.state.ethers.provider
    const Locker = new ethers.Contract(VESTABI.pager_address(network), VESTABI.pager_abi, provider)
    var res = await Locker.getLocks(_lock_ids)
    return res.map(item => ({
      lock_id: item[0].toString(),
      token_address: item[1].toString(),
      tokens_deposited: item[2].toString(),
      tokens_withdrawn: item[3].toString(),
      shares_deposited: item[4].toString(),
      shares_withdrawn: item[5].toString(),
      start_emission: item[6].toNumber(),
      end_emission: item[7].toNumber(),
      owner: item[8].toString(),
      condition: item[9].toString()
    }))
  },
  getTokenLocks: async (_token, _start, _count, network = null) => {
    var provider = network ? PROVIDERS[network] : store.state.ethers.provider
    const Locker = new ethers.Contract(VESTABI.pager_address(network), VESTABI.pager_abi, provider)
    var res = await Locker.getTokenLocks(_token, _start, _count)
    return res.map(item => item.toNumber())
  },
  getTokenLocksLength: async (_token, network = null) => {
    var provider = network ? PROVIDERS[network] : store.state.ethers.provider
    const Locker = new ethers.Contract(VESTABI.pager_address(network), VESTABI.pager_abi, provider)
    var res = await Locker.getTokenLocksLength(_token)
    return res.toString()
  },
  getNumLockedTokens: async (network = null) => {
    var provider = network ? PROVIDERS[network] : store.state.ethers.provider
    const Locker = new ethers.Contract(VESTABI.pager_address(network), VESTABI.pager_abi, provider)
    var res = await Locker.getNumLockedTokens()
    return res.toString()
  },
  getLockedTokens: async (_start, _count, network = null) => {
    var provider = network ? PROVIDERS[network] : store.state.ethers.provider
    const Locker = new ethers.Contract(VESTABI.pager_address(network), VESTABI.pager_abi, provider)
    var res = await Locker.getLockedTokens(_start, _count)
    return res
  },
  // USER FUNCTIONS
  getUserLockedTokensLength: async (_user) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.pager_address(), VESTABI.pager_abi, sEthers.provider)
    var res = await Locker.getUserLockedTokensLength(_user)
    return res.toString()
  },
  getUserLockedTokens: async (_user, _start, _count) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.pager_address(), VESTABI.pager_abi, sEthers.provider)
    var res = await Locker.getUserLockedTokens(_user, _start, _count)
    return res
  },
  getUserLocksForTokenLength: async (_user, _token) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.pager_address(), VESTABI.pager_abi, sEthers.provider)
    var res = await Locker.getUserLocksForTokenLength(_user, _token)
    return res.toString()
  },
  getUserTokenLocks: async (_user, _token, _start, _count) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.pager_address(), VESTABI.pager_abi, sEthers.provider)
    var res = await Locker.getUserTokenLocks(_user, _token, _start, _count)
    return res.map(item => item.toNumber())
  },
}

export default Self