<template>
  <v-container style="max-width: 600px;">

    <v-card :class="['br-20', {'pa-4': $vuetify.breakpoint.xs}, {'pa-6': !$vuetify.breakpoint.xs}]">
      
      <div class="d-flex align-center mb-6">
        <v-btn icon to="/" color="text">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
        <div class="display-1">
          SWAP
        </div>
        <v-spacer></v-spacer>
        <div style="width: 32px;">

        </div>
      </div>

      <div v-if="!walletConnected" class="pa-6 text-center">
        Connect your wallet to swap your UNC to UNCX
      </div>

      <div class="text-center">
        <v-btn
        @click="connectWallet"
        outlined
        :class="['font-weight-bold mb-4', {'purple-button white--text': !walletConnected}]"
        rounded depressed
        >
            <span v-if="!walletConnected">Connect Wallet</span>
            <span v-else>Account: {{ sEthers.coinbase_condensed }}</span>
        </v-btn>
      </div>

      <div v-if="walletConnected">

        <v-expand-transition mode="out-in">
          <div v-if="firstLoad" class="text--text text-center">
            Loading...
          </div>
        </v-expand-transition>

        <v-expand-transition>
          <div v-show="!firstLoad" class="pa-1">
            <div class="mt-8 text-center">
              Swap rate: 4000 UNC / 1 UNCX
            </div>
            
            <v-row>
              <v-col cols="12">
                <v-card outlined class="pa-4 br-20">
                  <div class="mb-2">
                    You have
                  </div>
                  <div class="t-large d-flex align-center">
                    {{ uncBalanceHuman }} 
                    <v-spacer></v-spacer>
                    <img 
                    src="@/assets/img/UNC_old.svg" 
                    width="32px"
                    class="mr-1">
                    UNC
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-card outlined class="pa-4 br-20">
                  <div class="mb-2">
                    You get
                  </div>
                  <div class="t-large d-flex align-center">
                    {{ swapAmountHuman }} 
                    <v-spacer></v-spacer>
                    <img 
                    src="@/assets/img/UNCX_fill.svg" 
                    width="32px"
                    class="mr-1">
                    UNCX
                  </div>
                </v-card>
              </v-col>

            </v-row>

            <v-card v-if="uncxBalance !== '0'" class="mt-10 mr-2 mb-6 text-center br-20 pa-4">
              <div class="textFaint--text mt-3 mb-2 text-center">
                Current UNCX balance
              </div>
              <div class="display-1">
                {{ currentUNCXBalanceHuman }}
              </div>
              <div class="mb-2 mt-6 ml-4 mr-4 textFaint--text">
                Add UNCX to your wallet by pasting the UNCX address below as a custom token
              </div>
              <v-btn outlined rounded @click="copyUNCXAddress" color="textFaint">
                {{ uncxCondensed }}
                <v-icon small class="ml-3">mdi-content-copy</v-icon>
              </v-btn>
              <div v-if="textCopied" class="primary--text">
                Copied to clipboard
              </div>
              <div v-else style="visibility: hidden;">
                Copied to clipboard
              </div>
            </v-card>

            <v-row dense class="mt-10">
              <v-col cols="6">
                <v-btn @click="approve" color="primary" x-large block depressed :disabled="!allowanceIncreaseRequired" :loading="approvalLoading">
                  Approve
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn @click="doSwap" color="primary" x-large block depressed :disabled="allowanceIncreaseRequired || uncBalance === '0'" :loading="swapInProcess">
                  Swap
                </v-btn>
              </v-col>
            </v-row>

          </div>
        </v-expand-transition>

      </div>

    </v-card>
    
  </v-container>
</template>

<script>
import SwapContract from '@/smart-contracts/swap-unc/swap-contract'
import { ethers } from 'ethers'
import ERC20 from '@/smart-contracts/erc20'
import TxWrapper from '@/smart-contracts/tx-wrapper'
import SwapABI from '@/smart-contracts/swap-unc/swap-abis'

export default {
  components: {
  },

  data: () => ({
    uncBalance: '0',
    uncxBalance: '0',
    swapAmount: '0',
    allowance: '0',
    swapInProcess: false,
    approvalLoading: false,
    textCopied: false,
    firstLoad: true
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    walletConnected () {
      return this.sEthers.coinbase
    },
    uncBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.uncBalance, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 18})
    },
    swapAmountHuman () {
      var amount = ethers.utils.formatUnits(this.swapAmount, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 18})
    },
    currentUNCXBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.uncxBalance, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    },
    allowanceIncreaseRequired () {
      if (ethers.BigNumber.from(this.uncBalance).gt(this.allowance)) {
        return true
      }
      return false
    },
    showSwapButton () {
      if (!this.allowanceIncreaseRequired && this.uncBalance !== '0') {
        return true
      }
      return false
    },
    uncx_address_comp () {
      return SwapABI.uncx_address
    },
    uncxCondensed () {
      var address = SwapABI.uncx_address
      if (!address) {
        return ''
      }
      return address.slice(0, 6) + '...' + address.slice(address.length - 4)
    }
  },

  watch: {
    sEthersWatcher () {
      this.refresh()
        .catch(e => {})
    }
  },

  methods: {
    connectWallet () {
      this.$root.$dialog.connectWalletDialog.open()
        .catch(e => {})
    },
    async getUNCBalance () {
      var balance = await ERC20.getBalance(this.sEthers.coinbase, SwapABI.unc_address)
      this.uncBalance = balance
    },
    async getUNCXBalance () {
      var balance = await ERC20.getBalance(this.sEthers.coinbase, SwapABI.uncx_address)
      this.uncxBalance = balance
    },
    async getSwapAmount () {
      var swapAmount = await SwapContract.getSwapAmount(this.uncBalance)
      this.swapAmount = swapAmount
    },
    async getAllowance () {
      var allowance = await ERC20.getAllowance(SwapABI.unc_address, this.sEthers.coinbase, SwapABI.swap_address)
      this.allowance = allowance
    },
    async refresh () {
      if (!this.sEthers.coinbase) {
        return
      }
      await this.getUNCBalance()
      await this.getUNCXBalance()
      this.getSwapAmount()
      await this.getAllowance()
      this.firstLoad = false
    },
    doSwap () {
      this.swapInProcess = true
      TxWrapper.doTransaction(SwapContract.doSwap(this.uncBalance), this.$root.$dialog.confirmTx)
        .then(() => { })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.refresh()
          this.swapInProcess = false
        })
    },
    approve () {
      var amount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      this.approvalLoading = true
      TxWrapper.doTransaction(ERC20.setAllowance(SwapABI.unc_address, amount, SwapABI.swap_address), this.$root.$dialog.confirmTx)
        .then(() => { 
          this.getAllowance()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.approvalLoading = false
        })
    },
    copyUNCXAddress: function () {
      this.$copyText(SwapABI.uncx_address).then(() => {
        this.textCopied = true
        setTimeout(() => {
          this.textCopied = false
        }, 2000)
      }, function (e) {
        alert('Can not copy')
      })
    },
  },
  created () {
    if (this.$store.state.exchange !== 'Uniswap') {
      this.$store.commit('switchExchange', 'Uniswap')
    }
    this.refresh()
      .catch(e => {})
  }
}
</script>