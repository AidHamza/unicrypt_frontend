import {store} from '@/store/index'
import { ethers } from "ethers"
import PROVIDERS from '@/web3/providers'
// import AddressABI from '@/smart-contracts/address-abis'

const erc20_abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"receivers","type":"address[]"},{"name":"amounts","type":"uint256[]"}],"name":"multiTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"player","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"player","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]

const Self = {
  getERC20: async (address, network = null) => {
    var provider = network ? PROVIDERS[network] : store.state.ethers.provider
    console.log("provider=>", provider);
    if (!ethers.utils.isAddress(address)) {
      throw new Error('Not a valid Ethereum address')
    }
    
    // try get name
    var name, nameABI, nameContract
    try {
      nameABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]
      nameContract = new ethers.Contract(address, nameABI, provider)
      name = await nameContract.name()
    } catch (e) {}
    if (!name) {
      try {
        nameABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}]
        nameContract = new ethers.Contract(address, nameABI, provider)
        name = await nameContract.name()
        name = ethers.utils.parseBytes32String(name)
      } catch (e) {}
    }
    if (!name) {
      name = 'Unknown'
    }

    // try get symbol
    var symbol, symbolABI, symbolContract
    try {
      symbolABI = [{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]
      symbolContract = new ethers.Contract(address, symbolABI, provider)
      symbol = await symbolContract.symbol()
    } catch (e) {}
    if (!symbol) {
      try {
        symbolABI = [{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}]
        symbolContract = new ethers.Contract(address, symbolABI, provider)
        symbol = await symbolContract.symbol()
        symbol = ethers.utils.parseBytes32String(symbol)
      } catch (e) {}
    }
    if (!symbol) {
      symbol = 'Unknown'
    }
    
    var erc20 = {}
    var tokenContract = new ethers.Contract(address, erc20_abi, provider)
    // var name = await tokenContract.name()
    // var symbol = await tokenContract.symbol()
    var decimals
    try {
      decimals = await tokenContract.decimals()
    } catch (e) {
      decimals = 0
    }
    var totalSupply
    try {
      totalSupply = await tokenContract.totalSupply()
    } catch (e) {
      totalSupply = 0
    }
    var checksum_address = ethers.utils.getAddress(address)
    erc20 = {
      name: name,
      symbol: symbol,
      decimals: decimals,
      totalSupply: totalSupply.toString(),
      address: checksum_address
    }
    return erc20
  },
  getBalance: async (user, token, network = null) => {
    var provider = network ? PROVIDERS[network] : store.state.ethers.provider
    if (!ethers.utils.isAddress(user)) {
      throw new Error('Not a valid user address')
    }

    if (!ethers.utils.isAddress(token)) {
      throw new Error('Not a valid token address')
    }

    var tokenContract = new ethers.Contract(token, erc20_abi, provider)
    
    var balance = await tokenContract.balanceOf(user)
    return balance.toString()
  },
  getAllowance: async (token, coinbase, spender) => {
    var sEthers = store.state.ethers
    const TokenContract = new ethers.Contract(token, erc20_abi, sEthers.provider)
    var allowance = await TokenContract.allowance(coinbase, spender)
    return allowance
  },
  setAllowance: (token, amount, spender) => {
    var sEthers = store.state.ethers
    const TokenContract = new ethers.Contract(token, erc20_abi, sEthers.signer)
    var res = TokenContract.approve(spender, amount)
    return res
  },
  transfer: (token, to, amount) => {
    var sEthers = store.state.ethers
    const TokenContract = new ethers.Contract(token, erc20_abi, sEthers.signer)
    var res = TokenContract.transfer(to, amount)
    return res
  },
}

export default Self