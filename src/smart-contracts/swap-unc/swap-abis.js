// mainnet 0x816C82409eC8E0C008fC79e902a8e790bb70840C

const Self = {
  swap_abi: [{"inputs":[{"internalType":"address","name":"_unc","type":"address"},{"internalType":"address","name":"_uncx","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"doSwap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"swapAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"unc","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uncx","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}],

  swap_address: "0x816C82409eC8E0C008fC79e902a8e790bb70840C",
  unc_address: '0xf29e46887FFAE92f1ff87DfE39713875Da541373',
  uncx_address: '0xaDB2437e6F65682B85F814fBc12FeC0508A7B1D0'
}

export default Self