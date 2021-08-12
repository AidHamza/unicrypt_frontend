import {store} from '@/store/index';

const mint_factory_address = {
  'Mainnet': '0xBfAA7A85D2C737e31341d6Cb11d5EEA63d23684A',
  'Kovan': '0x50627eB066E547320332527Cb2344Ab025EA86D2',
  'BSC_MAINNET': '0xD0fb57eeEe221bcDc9F29BF4542487C54D40CD33',
  'xDai': '0xdc8Fa9e2Eb8Ef1D727B443226b7a67Aa55EbA25e',
  'Matic': '0xC765bddB93b0D1c1A88282BA0fa6B2d00E3e0c83',
  'Hardhat': '0xADe6aA1bfC271FC0b0953bD7Ed8C19a7433EdB87'
}

const mint_generator01_address = {
  'Mainnet': '0x0Fd433e474ECB81005ac906e0BCFab66E1d49371',
  'Kovan': '0x5B8e76075D0a2382F0E3cfb2a8f0444b29E9Fb55',
  'BSC_MAINNET': '0x863b49ae97c3D2A87Fd43186dfd921F42783C853',
  'xDai': '0xF810c00fA01AA31096868abb86909aC979A243cF',
  'Matic': '0xCf1A319FECDD5C4E299A47f3d698Db5Ee203e50a',
  'Hardhat': '0x2829873FC9a27bb7548Af72C04838cC6855378bf'
}

const token_fees_address = {
  'Mainnet': '0xf72e2D5D025Cbce9CE4D25E5AC4a5c3437ff8d26',
  'Kovan': '0xD0fb57eeEe221bcDc9F29BF4542487C54D40CD33',
  'BSC_MAINNET': '0x2C552F9DA0b3752C2526C45901C54Ba4dFb4287d',
  'xDai': '0x7ac35a1a03D9D864F5D2aB1E61590567112c852e',
  'Matic': '0xe013681EeA920114E5F315842a2D7fc9274547E3',
  'Hardhat': '0xcFB8Fdb116785F560dcE9259F8F7BF0700A40c3e'
}

const Self = {
  mint_factory_address: (network = null) => {
    return mint_factory_address[network || store.state.requiredNetwork]
  },
  mint_generator01_address: (network = null) => {
    return mint_generator01_address[network || store.state.requiredNetwork]
  },
  token_fees_address: (network = null) => {
    return token_fees_address[network || store.state.requiredNetwork]
  },
  mint_factory_abi: [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"address","name":"tokenOwner","type":"address"}],"name":"tokenRegistered","type":"event"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"bool","name":"_allow","type":"bool"}],"name":"adminAllowTokenGenerator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenOwner","type":"address"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getTokenByOwnerAtIndex","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenOwner","type":"address"}],"name":"getTokensLengthByOwner","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"}],"name":"isENMT","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenOwner","type":"address"},{"internalType":"address","name":"_tokenAddress","type":"address"}],"name":"registerToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"tokenAtIndex","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"tokenGeneratorAtIndex","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenGenerator","type":"address"}],"name":"tokenGeneratorIsAllowed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenGeneratorsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokensLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}],
  mint_generator01_abi: [{"inputs":[{"internalType":"address","name":"_mintFactory","type":"address"},{"internalType":"address","name":"_tokenFees","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"MINT_FACTORY","outputs":[{"internalType":"contractIMintFactory","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOKEN_FEES","outputs":[{"internalType":"contractITokenFees","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint8","name":"decimals","type":"uint8"},{"internalType":"uint256","name":"totalSupply","type":"uint256"}],"name":"createToken","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}],
  token_fees_abi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"SETTINGS","outputs":[{"internalType":"uint256","name":"FLAT_FEE","type":"uint256"},{"internalType":"uint256","name":"TS_FEE","type":"uint256"},{"internalType":"addresspayable","name":"TOKEN_FEE_ADDRESS","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getFlatFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTokenFeeAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTotalSupplyFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_flatFee","type":"uint256"}],"name":"setFlatFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"addresspayable","name":"_tokenFeeAddress","type":"address"}],"name":"setTokenFeeAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tsFee","type":"uint256"}],"name":"setTotalSupplyFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
}

export default Self