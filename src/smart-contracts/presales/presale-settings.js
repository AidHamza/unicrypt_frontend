import {store} from '@/store/index';
import { ethers } from "ethers";
import PRESALEABI from '@/smart-contracts/presales/presale-abis'
import ERC20 from '@/smart-contracts/erc20'

const Self = {
  getFees: async () => {
    var sEthers = store.state.ethers
    const PresaleFactory = new ethers.Contract(PRESALEABI.presale_settings_address(), PRESALEABI.presale_settings_abi, sEthers.provider)
    var fees = await PresaleFactory.SETTINGS()
    return {
      base_fee: fees[0].toString(),
      token_fee: fees[1].toString(),
      eth_creation_fee: fees[5].toString(),
      max_presale_length: fees[7].toString()
    }
  },
  userHoldsSufficientRound1Token: async (_user) => {
    var sEthers = store.state.ethers
    const PresaleFactory = new ethers.Contract(PRESALEABI.presale_settings_address(), PRESALEABI.presale_settings_abi, sEthers.provider)
    var val = await PresaleFactory.userHoldsSufficientRound1Token(_user)
    return Boolean(val)
  },
  earlyAccessTokensLength: async () => {
    var sEthers = store.state.ethers
    const PresaleFactory = new ethers.Contract(PRESALEABI.presale_settings_address(), PRESALEABI.presale_settings_abi, sEthers.provider)
    var length = await PresaleFactory.earlyAccessTokensLength()
    return length.toString()
  },
  getEarlyAccessTokenAtIndex: async (_index) => {
    var sEthers = store.state.ethers
    const PresaleFactory = new ethers.Contract(PRESALEABI.presale_settings_address(), PRESALEABI.presale_settings_abi, sEthers.provider)
    var res = await PresaleFactory.getEarlyAccessTokenAtIndex(_index)

    var token = {}
    try {
      token = await ERC20.getERC20(res[0])
    } catch {}

    return {
      token: token,
      amount: res[1].toString()
    }
  },
  referrerIsValid: async (_referrer) => {
    var sEthers = store.state.ethers
    const PresaleFactory = new ethers.Contract(PRESALEABI.presale_settings_address(), PRESALEABI.presale_settings_abi, sEthers.provider)
    var res = await PresaleFactory.referrerIsValid(_referrer)
    return Boolean(res)
  },
}

export default Self