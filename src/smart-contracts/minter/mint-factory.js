import {store} from '@/store/index';
import { ethers } from "ethers";
import MINTERABI from '@/smart-contracts/minter/minter-abis';

const Self = {
  getTokenLengthByOwner: async (_owner) => {
    var sEthers = store.state.ethers;
    const MintFactory = new ethers.Contract(MINTERABI.mint_factory_address(), MINTERABI.mint_factory_abi, sEthers.provider);
    var length = await MintFactory.getTokensLengthByOwner(_owner);
    return length.toString();
  },
  getTokenByOwnerAtIndex: async (_owner, _index) => {
    var sEthers = store.state.ethers
    const MintFactory = new ethers.Contract(MINTERABI.mint_factory_address(), MINTERABI.mint_factory_abi, sEthers.provider);
    var address = await MintFactory.getTokenByOwnerAtIndex(_owner, _index)
    return address
  },  
}

export default Self