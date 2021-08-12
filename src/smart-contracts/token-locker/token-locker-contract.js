import {store} from '@/store/index';
import { ethers } from "ethers";
import VESTABI from '@/smart-contracts/token-locker/token-locker-abis'
import PROVIDERS from '@/web3/providers'
// import ERC20 from '@/smart-contracts/erc20'

const Self = {
  getFees: async () => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.provider)
    var res = await Locker.FEES()
    return {
      token_fee: res[0].toString(),
      free_locking_fee: res[1].toString(),
      fee_address: res[1].toString(),
      free_locking_token: res[3].toString(),
    }
  },
  getTotalShares: async (_token) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.provider)
    var res = await Locker.SHARES(_token)
    return res
  },
  tokenOnZeroFeeWhitelist: async (_address) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.provider)
    var res = await Locker.tokenOnZeroFeeWhitelist(_address)
    return Boolean(res)
  },
  payForFreeTokenLocks: (_token, _ethCreationFee) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.signer)
    var res = Locker.payForFreeTokenLocks(_token, {value: _ethCreationFee})
    return res
  },
  lock: (_token, _lockParams) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.signer)
    var res = Locker.lock(_token, _lockParams)
    return res
  },
  withdraw: (_lockID, _amount) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.signer)
    var res = Locker.withdraw(_lockID, _amount)
    return res
  },
  incrementLock: (_lockID, _amount) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.signer)
    var res = Locker.incrementLock(_lockID, _amount)
    return res
  },
  transferLockOwnership: (_lockID, _newOwner) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.signer)
    var res = Locker.transferLockOwnership(_lockID, _newOwner)
    return res
  },
  relock: (_lockID, _unlock_date) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.signer)
    var res = Locker.relock(_lockID, _unlock_date)
    return res
  },
  splitLock: (_lockID, _amount) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.signer)
    var res = Locker.splitLock(_lockID, _amount)
    return res
  },
  migrate: (_lockID, _option) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.signer)
    var res = Locker.migrate(_lockID, _option)
    return res
  },
  revokeCondition: (_lockID) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.signer)
    var res = Locker.revokeCondition(_lockID)
    return res
  },
  getTokenLocksLength: async (_token) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.provider)
    var res = await Locker.getTokenLocksLength(_token)
    return res.toString()
  },
  getNonce: async () => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.provider)
    var res = await Locker.NONCE()
    return res.toString()
  },
  getNumLockedTokens: async () => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.provider)
    var res = await Locker.getNumLockedTokens()
    return res.toString()
  },
  getWithdrawableShares: async (lockID) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.provider)
    var res = await Locker.getWithdrawableShares(lockID)
    return res.toString()
  },
  getWithdrawableTokens: async (lockID) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.provider)
    var res = await Locker.getWithdrawableTokens(lockID)
    return res.toString()
  },
  // CONDITIONS
  testCondition: async (_address, network = null) => {
    var provider = network ? PROVIDERS[network] : store.state.ethers.provider
    const Locker = new ethers.Contract(VESTABI.vesting_address(network), VESTABI.vesting_abi, provider)
    var state = false
    var abi_implemented = true
    try {
      state = await Locker.testCondition(_address)
    } catch (e) {
      abi_implemented = false
    }
    return {
      abi_implemented: abi_implemented,
      state: Boolean(state)
    }
  },
  getConditionStatus: async (_address) => {
    var sEthers = store.state.ethers
    var conditionABI = [{"inputs":[],"name":"unlockTokens","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]
    const ConditionContract = new ethers.Contract(_address, conditionABI, sEthers.provider)
    var state = false
    var abi_implemented = true
    try {
      state = await ConditionContract.unlockTokens()
    } catch (e) {
      abi_implemented = false
    }
    return {
      abi_implemented: abi_implemented,
      state: Boolean(state)
    }
  },
  // USER FUNCTIONS
  getUserLockedTokensLength: async (_user) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(VESTABI.vesting_address(), VESTABI.vesting_abi, sEthers.provider)
    var res = await Locker.getUserLockedTokensLength(_user)
    return res.toString()
  },
}

export default Self