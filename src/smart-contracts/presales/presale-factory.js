import {store} from '@/store/index';
import { ethers } from "ethers";
import PRESALEABI from '@/smart-contracts/presales/presale-abis'

const Self = {
  contractVersion: async (_address) => {
    var sEthers = store.state.ethers
    const PresaleContract = new ethers.Contract(_address, PRESALEABI.contract_version_abi, sEthers.provider)
    var version = await PresaleContract.CONTRACT_VERSION()
    return version.toString()
  },
  presalesLength: async () => {
    var sEthers = store.state.ethers
    const PresaleFactory = new ethers.Contract(PRESALEABI.presale_factory_address(), PRESALEABI.presale_factory_abi, sEthers.provider)
    var length = await PresaleFactory.presalesLength()
    return length.toString()
  },
  presaleAtIndex: async (_index) => {
    var sEthers = store.state.ethers
    const PresaleFactory = new ethers.Contract(PRESALEABI.presale_factory_address(), PRESALEABI.presale_factory_abi, sEthers.provider)
    var address = await PresaleFactory.presaleAtIndex(_index)
    return address
  },
  presaleIsRegistered: async (_address) => {
    if (!ethers.utils.isAddress(_address)) {
      return false
    }
    var sEthers = store.state.ethers
    const PresaleFactory = new ethers.Contract(PRESALEABI.presale_factory_address(), PRESALEABI.presale_factory_abi, sEthers.provider)
    var address = await PresaleFactory.presaleIsRegistered(_address)
    return address
  },
}

export default Self