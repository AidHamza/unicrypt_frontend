import {store} from '@/store/index';
import { ethers } from "ethers";
import PRESALEABI from '@/smart-contracts/presales/presale-abis'
import ERC20 from '@/smart-contracts/erc20'
import PROVIDERS from '@/web3/providers'

const Self = {
  getContractVersion: async (_presaleAddress) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_presaleAddress, PRESALEABI.contract_version_abi, sEthers.provider)
    var res = await Presale.CONTRACT_VERSION()
    return res.toNumber()
  },
  ownerWithdrawTokens: (_presaleAddress) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_presaleAddress, PRESALEABI.presale01_abi, sEthers.signer)
    var res = Presale.ownerWithdrawTokens()
    return res
  },
  userDepositETH: (_presaleAddress, _ethAmount) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_presaleAddress, PRESALEABI.presale01_abi, sEthers.signer)
    var res = Presale.userDeposit(0, {value: _ethAmount})
    return res
  },
  userDepositToken: (_presaleAddress, _tokenAmount) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_presaleAddress, PRESALEABI.presale01_abi, sEthers.signer)
    var res = Presale.userDeposit(_tokenAmount)
    return res
  },
  userWithdrawTokens: (_presaleAddress) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_presaleAddress, PRESALEABI.presale01_abi, sEthers.signer)
    var res = Presale.userWithdrawTokens()
    return res
  },
  userWithdrawBaseTokens: (_presaleAddress) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_presaleAddress, PRESALEABI.presale01_abi, sEthers.signer)
    var res = Presale.userWithdrawBaseTokens()
    return res
  },
  addLiquidity: (_presaleAddress) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_presaleAddress, PRESALEABI.presale01_abi, sEthers.signer)
    var res = Presale.addLiquidity()
    return res
  },
  forceFailByUnicrypt: (_presaleAddress) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_presaleAddress, PRESALEABI.presale01_abi, sEthers.signer)
    var res = Presale.forceFailByUnicrypt()
    return res
  },
  presaleInfo: async (_address, network) => {
    var provider = store.state.ethers.provider
    if (network) {
      provider = PROVIDERS[network]
    }
    const Presale = new ethers.Contract(_address, PRESALEABI.presale01_abi, provider)
    var res = await Presale.PRESALE_INFO()

    var sale_token = {}
    try {
      sale_token = await ERC20.getERC20(res[1])
    } catch {}
    var base_token = {}
    try {
      base_token = await ERC20.getERC20(res[2])
    } catch {}
    return {
      presale_owner: res[0],
      token: sale_token,
      base_token: base_token,
      token_price: res[3].toString(),
      max_spend_per_buyer: res[4].toString(),
      amount: res[5].toString(),
      hardcap: res[6].toString(),
      softcap: res[7].toString(),
      liquidity_percent: res[8].toString(),
      listing_rate: res[9].toString(),
      start_block: res[10].toString(),
      end_block: res[11].toString(),
      lock_period: res[12].toString(),
      presale_in_eth: Boolean(res[13]),
      presale_contract: _address
    }
  },
  presaleSettings: async (_address, network) => {
    var provider = store.state.ethers.provider
    if (network) {
      provider = PROVIDERS[network]
    }
    const Presale = new ethers.Contract(_address, PRESALEABI.presale01_abi, provider)
    var res = await Presale.STATUS()
    return {
      whitelist_only: Boolean(res[0]),
      lp_generation_complete: Boolean(res[1]),
      force_failed: Boolean(res[2]),
      total_base_collected: res[3].toString(),
      total_tokens_sold: res[4].toString(),
      total_tokens_withdrawn: res[5].toString(),
      total_base_withdrawn: res[6].toString(),
      round1_length: res[7].toString(),
      num_buyers: res[8].toString()
    }
  },
  presaleFeeInfo: async (_address, network) => {
    var provider = store.state.ethers.provider
    if (network) {
      provider = PROVIDERS[network]
    }
    const Presale = new ethers.Contract(_address, PRESALEABI.presale01_abi, provider)
    var res = await Presale.PRESALE_FEE_INFO()
    return {
      base_fee: res[0].toString(),
      token_fee: res[1].toString(),
    }
  },
  presaleStatus: async (_address) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_address, PRESALEABI.presale01_abi, sEthers.provider)
    var res = await Presale.presaleStatus()
    return res.toString()
  },
  userInfo: async (_presaleAddress, _user) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_presaleAddress, PRESALEABI.presale01_abi, sEthers.provider)
    var res = await Presale.BUYERS(_user)
    return {
      eth_deposited: res[0].toString(),
      tokens_owed: res[1].toString()
    }
  },
  getUserWhitelistStatus: async (_presaleAddress, _address) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_presaleAddress, PRESALEABI.presale01_abi, sEthers.provider)
    var address = await Presale.getUserWhitelistStatus(_address)
    return address
  },
  // ADMIN FUNCTIONS
  updateMaxSpendLimit: (_presaleAddress, _maxSpend) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_presaleAddress, PRESALEABI.presale01_abi, sEthers.signer)
    var res = Presale.updateMaxSpendLimit(_maxSpend)
    return res
  },
  updateBlocks: (_presaleAddress, _startBlock, _endBlock) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_presaleAddress, PRESALEABI.presale01_abi, sEthers.signer)
    var res = Presale.updateBlocks(_startBlock, _endBlock)
    return res
  },
  setWhitelistFlag: (_presaleAddress, _flag) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_presaleAddress, PRESALEABI.presale01_abi, sEthers.signer)
    var res = Presale.setWhitelistFlag(_flag)
    return res
  },
  editWhitelist: (_presaleAddress, _whitelist, _add) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_presaleAddress, PRESALEABI.presale01_abi, sEthers.signer)
    var res = Presale.editWhitelist(_whitelist, _add)
    return res
  },
  whitelistLength: async (_presaleAddress) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_presaleAddress, PRESALEABI.presale01_abi, sEthers.provider)
    var length = await Presale.getWhitelistedUsersLength()
    return length.toString()
  },
  getWhitelistedUserAtIndex: async (_presaleAddress, _index) => {
    var sEthers = store.state.ethers
    const Presale = new ethers.Contract(_presaleAddress, PRESALEABI.presale01_abi, sEthers.provider)
    var address = await Presale.getWhitelistedUserAtIndex(_index)
    return address
  }
}

export default Self