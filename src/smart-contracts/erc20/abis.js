import {store} from '@/store/index';

const erc20_pager_address = {
  'Mainnet': '0x4ad4aFc8d908B01429AE87146e6Ff6b843493F84',
  'Kovan': '0x65B1211995a7a19301A90D3EAf7A2D71Ba18A403',
  'BSC_MAINNET': '0x4eaF15D53e854FbD02688a9044f0e252B1f71d52',
  'xDai': '0xCA07E89e9674e9BC5bB9CaDE6771FEc8e14e4042',
  'Matic': '0xd6139E5298167935d367a73839707589e49284B4',
  'Hardhat': '0xADe6aA1bfC271FC0b0953bD7Ed8C19a7433EdB87'
}

const Self = {
  erc20_pager_address: (network = null) => {
    return erc20_pager_address[network || store.state.requiredNetwork]
  },
  erc20_pager_abi: [{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"getERC","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]
}

export default Self