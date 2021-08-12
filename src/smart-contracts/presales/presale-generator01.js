import {store} from '@/store/index';
import { ethers } from "ethers";
import PRESALEABI from '@/smart-contracts/presales/presale-abis'

const Self = {
  createPresale: (_owner, _token, _baseToken, _referralAddress, _amount, _tokensPerEth, _maxSpendPerBuyer, _hardcap, _softcap, _liquidityPercent, _listingRate, _startBlock, _endBlock, _lockPeriod, _ethCreationFee) => {
    var sEthers = store.state.ethers
    const PresaleGenerator = new ethers.Contract(PRESALEABI.presale_generator01_address(), PRESALEABI.presale_generator01_abi, sEthers.signer)
    var uint_params = [_amount, _tokensPerEth, _maxSpendPerBuyer, _hardcap, _softcap, _liquidityPercent, _listingRate, _startBlock, _endBlock, _lockPeriod]
    var res = PresaleGenerator.createPresale(_owner, _token, _baseToken, _referralAddress, uint_params, {value: _ethCreationFee})
    return res
  },
}

export default Self