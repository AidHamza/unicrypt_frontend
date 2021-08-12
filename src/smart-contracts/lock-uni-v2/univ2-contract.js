import {store} from '@/store/index';
import { ethers } from "ethers";
import UNIV2ABI from '@/smart-contracts/lock-uni-v2/univ2-abis'
import ERC20 from '@/smart-contracts/erc20'

const Self = {
  getFees: async () => {
    var sEthers = store.state.ethers
    var Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.provider)
    var fees = await Locker.gFees()

    var secondaryFeeToken = {}
    try {
      secondaryFeeToken = await ERC20.getERC20(fees[1])
    } catch {}
    var referralToken = {}
    try {
      referralToken = await ERC20.getERC20(fees[6])
    } catch {}

    return {
      eth_fee: fees[0].toString(),
      secondary_fee_token: secondaryFeeToken,
      secondary_token_fee: fees[2].toString(),
      secondary_token_discount: fees[3].toString(),
      liquidity_fee: fees[4].toString(),
      referral_percent: fees[5].toString(),
      referral_token: referralToken,
      referral_hold: fees[7].toString(),
      referral_discount: fees[8].toString()
    }
  },
  lockLPToken: (_lpToken, amount, unlock_date, referral, fee_in_eth, _eth_fee, coinbase) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.signer)
    var ethFee = fee_in_eth ? _eth_fee : '0'
    var res = Locker.lockLPToken(_lpToken, amount, unlock_date, referral, fee_in_eth, coinbase, {value: ethFee})
    return res
  },
  withdraw: (_lpToken, _index, _lockID, _amount) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.signer)
    var res = Locker.withdraw(_lpToken, _index, _lockID, _amount)
    return res
  },
  incrementLock: (_lpToken, _index, _lockID, _amount) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.signer)
    var res = Locker.incrementLock(_lpToken, _index, _lockID, _amount)
    return res
  },
  relock: (_lpToken, _index, _lockID, _unlock_date) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.signer)
    var res = Locker.relock(_lpToken, _index, _lockID, _unlock_date)
    return res
  },
  transferLockOwnership: (_lpToken, _index, _lockID, _newOwner) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.signer)
    var res = Locker.transferLockOwnership(_lpToken, _index, _lockID, _newOwner)
    return res
  },
  migrate: (_lpToken, _index, _lockID, _amount) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.signer)
    var res = Locker.migrate(_lpToken, _index, _lockID, _amount)
    return res
  },
  splitLock: (_lpToken, _index, _lockID, _amount, _ethFee) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.signer)
    var res = Locker.splitLock(_lpToken, _index, _lockID, _amount, {value: _ethFee})
    return res
  },
  // GLOBAL INFO
  getNumLockedTokens: async () => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.provider)
    var num = await Locker.getNumLockedTokens()
    return num.toString()
  },
  getLockedTokenAtIndex: async (_index) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.provider)
    var address = await Locker.getLockedTokenAtIndex(_index)
    return address.toString()
  },
  getNumLocksForToken: async (_lpToken) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.provider)
    var res = await Locker.getNumLocksForToken(_lpToken)
    return res.toString()
  },
  getLockForTokenAtIndex: async (_lpToken, index) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.provider)
    var res = await Locker.tokenLocks(_lpToken, index)
    return {
      lock_date: res[0].toString(),
      amount: res[1].toString(),
      initial_amount: res[2].toString(),
      unlock_date: res[3].toString(),
      lockID: res[4].toString(),
      owner: res[5].toString()
    }
  },
  getLockedLiquidity: async (pair_address) => {
    var sEthers = store.state.ethers
    var contract_abi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]
    var IUniswapV2Pair = new ethers.Contract(pair_address, contract_abi, sEthers.provider)
    var locked = await IUniswapV2Pair.balanceOf(UNIV2ABI.locker_mainnet_address())
    return locked.toString()
  },
  // USER INFO
  getUserNumLockedTokens: async (_user) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.provider)
    var res = await Locker.getUserNumLockedTokens(_user)
    return res.toString()
  },
  getUserLockedTokenAtIndex: async (_user, _index) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.provider)
    var address = await Locker.getUserLockedTokenAtIndex(_user, _index)
    return address.toString()
  },
  getUserNumLocksForToken: async (_user, _lpToken) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.provider)
    var len = await Locker.getUserNumLocksForToken(_user, _lpToken)
    return len.toString()
  },
  getUserLockForTokenAtIndex: async (_user, _lpToken, _index) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.provider)
    var res = await Locker.getUserLockForTokenAtIndex(_user, _lpToken, _index)
    return {
      lock_date: res[0].toString(),
      amount: res[1].toString(),
      initial_amount: res[2].toString(),
      unlock_date: res[3].toString(),
      lockID: res[4].toString(),
      owner: res[5].toString(),
      user_lock_index: _index
    }
  },
  getUserWhitelistStatus: async (_user) => {
    var sEthers = store.state.ethers
    const Locker = new ethers.Contract(UNIV2ABI.locker_mainnet_address(), UNIV2ABI.locker_abi, sEthers.provider)
    var res = await Locker.getUserWhitelistStatus(_user)
    return Boolean(res)
  },
}

export default Self