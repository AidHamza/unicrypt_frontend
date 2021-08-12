import {store} from '@/store/index';
import { ethers } from "ethers";
import MINTERABI from '@/smart-contracts/minter/minter-abis';

const Self = {
  getFees: async () => {
    var sEthers = store.state.ethers;
    const TokenFees = new ethers.Contract(MINTERABI.token_fees_address(), MINTERABI.token_fees_abi, sEthers.provider);
    var res = await TokenFees.SETTINGS()
    return {
      flat_fee: res[0].toString(),
      ts_fee: res[1].toString()
    }
  }   
}

export default Self;