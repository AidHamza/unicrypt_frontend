import {store} from '@/store/index';
import { ethers } from "ethers";
import MINTERABI from '@/smart-contracts/minter/minter-abis';

const Self = {
  createToken: async (_name, _symbol, _decimals, _totalSupply, _ethFee) => {
    var sEthers = store.state.ethers;
    const MintGenerator = new ethers.Contract(MINTERABI.mint_generator01_address(), MINTERABI.mint_generator01_abi, sEthers.signer);
    var res = await MintGenerator.createToken(_name, _symbol, _decimals, _totalSupply, { value: _ethFee });
    return res;
  }   
}

export default Self