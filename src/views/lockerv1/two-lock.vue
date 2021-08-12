<template>
  <div>

    <v-icon size="180" style="color: var(--v-background-base)!important; position: absolute; right: -30px; top: -10px;">mdi-lock-outline</v-icon>

    <div style="position: relative;">

      <div v-if="firstLoad" class="text-center">
        <v-progress-circular
        indeterminate
        size="150"
        color="textFaint">
          <v-icon size="100" color="textFaint">mdi-lock-outline</v-icon>
        </v-progress-circular>
      </div>

      <v-scroll-x-transition>
        <div v-if="!firstLoad">

          <div class="display-1 textFaint--text text-center font-weight-bold mb-8">
            Lock Liquidity
          </div>

          <div v-if="false" class="caption">
            {{ feeInfo }}
          </div>

          <div class="d-flex align-center justify-center t-large">
            <coin-icon :address="uniPair.token0.address" class="mr-2"></coin-icon>
            {{ uniPair.token0.symbol }} / {{ uniPair.token1.symbol }}
            <coin-icon :address="uniPair.token1.address" class="ml-2 mr-2"></coin-icon>
          </div>

          <div class="mt-10 mb-2 title font-weight-bold text-center">
            Lock how many LP tokens?
          </div>

          <div class="pa-4 align-center flex-nowrap inputcolor r-outlined">

            <div class="caption text-end pt-2">
              Balance: {{ uniBalanceHuman }}
            </div>

            <div class="d-flex align-center">
              <c-input :value.sync="amountHuman" placeholder="0.0" @updateWhileFocussed="onHumanAmountChange" class="pa-2 font-weight-bold">

              </c-input>

              <div class="font-weight-bold">
                UNIV2
              </div>

              <v-btn small depressed color="primary" @click="setMax" class="ml-2">
                MAX
              </v-btn>
            </div>

            <div>
              <v-btn small outlined rounded color="" @click="setPercent(25)" class="mr-1">
                25%
              </v-btn>
              <v-btn small outlined rounded color="" @click="setPercent(50)" class="mr-1">
                50%
              </v-btn>
              <v-btn small outlined rounded color="" @click="setPercent(75)" class="mr-1">
                75%
              </v-btn>
              <v-btn small outlined rounded color="" @click="setMax" class="mr-1">
                100%
              </v-btn>
            </div>

          </div>

          <div class="mt-10 mb-2 title font-weight-bold text-center">
            Unlock Date
          </div>

          <div class="d-flex align-start inputcolor r-outlined pa-4">
            <div>
              <div class="font-weight-bold">
                {{ unlockDateHuman }}
              </div>
              <div class="">
                {{ unlockDateFromNow }} <!-- (unix {{ unlockDate }}) -->
              </div>
            </div>
            <v-spacer></v-spacer>
            <c-date @setDate="setUnlockDate"></c-date>
          </div>

          <div class="mt-10 mb-2 title font-weight-bold text-center">
            Who can withdraw the tokens?
          </div>

          <div class="text-center">
            <v-btn depressed :color="unlockerIsMe ? 'primary' : ''" @click="unlockerIsMe = true">
              Me
            </v-btn>
            <v-btn depressed :color="!unlockerIsMe ? 'primary' : ''" @click="unlockerIsMe = false">
              Someone else
            </v-btn>
          </div>

          <v-slide-y-transition>
            <div v-if="!unlockerIsMe" class="mt-2 d-flex align-center pa-3 r-outlined br-8 inputcolor">
              <c-input :value.sync="unlockerAccount" placeholder="Unlocker address">
              </c-input>
            </div>
          </v-slide-y-transition>

          <!-- REFERRALS -->
          <template v-if="!whitelisted">
            <div class="mt-10 title font-weight-bold text-center">
              Do you have a valid referral address?
            </div>
            <div class="caption textFaint--text text-center mb-2 ">
              Enjoy a {{ referralDiscount }}% flatrate discount if so!
            </div>

            <div class="text-center">
              <v-btn depressed :color="!hasReferralAddress ? 'primary' : ''" @click="hasReferralAddress = false">
                No
              </v-btn>
              <v-btn depressed :color="hasReferralAddress ? 'primary' : ''" @click="hasReferralAddress = true">
                Yes
              </v-btn>
            </div>

            <v-slide-y-transition>
              <div v-if="hasReferralAddress">
                <div class="mt-2 d-flex align-center pa-3 r-outlined br-8 inputcolor">
                  <c-input :value.sync="referralAddress" placeholder="Referral address">
                  </c-input>

                  <v-progress-circular
                  v-if="referralIsLoading"
                  indeterminate
                  width="2"
                  class="mr-2"
                  size="24"
                  color="primary"
                  ></v-progress-circular>
                </div>

                <div v-if="!referralAddressIsAddress && !referralIsLoading" class="text-center pink--text">
                  Referral address not valid
                </div>
                <div v-else-if="referralAddressIsAddress && !referralIsLoading && !referrerBalanceMet" class="text-center pink--text">
                  Invalid account. Referrer needs to be holding at least 
                  {{ referralHoldMinimumHuman }} {{ feeInfo.referral_token.symbol }}
                </div>
                <div v-else class="primary--text justify-center d-flex align-center">
                  <v-icon color="primary">mdi-checkbox-marked-circle-outline</v-icon>
                  Valid
                </div>
              </div>
            </v-slide-y-transition>
          </template>
          <!-- REFERRALS -->

          <div v-if="whitelisted">
            <div class="mt-10 mb-2 title font-weight-bold text-center">
              Fees
            </div>

            <v-card
            class="pa-4"
            > 
              <div :class="['title text-center']">
                {{ liquidityFee }}% UNIV2
              </div>
              <div class="textFaint--text justify-center d-flex align-center mt-2 caption">
                <v-icon color="textFaint" class="mr-2">mdi-checkbox-marked-circle-outline</v-icon>
                Your account is whitelisted for less fees
              </div>
            </v-card>
          </div>

          <template v-else>

            <div class="mt-10 mb-2 title font-weight-bold text-center">
              Fee options
            </div>

            <v-item-group v-model="optionEthFee" mandatory>
              <v-container>
                <v-row dense class="justify-center">
                  <v-col cols="6">
                    <v-item v-slot="{ active, toggle }">
                      <v-card
                        :color="active ? 'primary' : ''"
                        :class="['d-flex align-center']"
                        height="100"
                        @click="toggle"
                      >
                        <div :class="['title flex-grow-1 text-center', {'white--text': active}]">
                          {{ ethFeeHuman }}
                          {{ $store.state.nativeGasTokenSymbol }}
                          <div class="caption">
                            (+ {{ liquidityFee }}% UNIV2)
                          </div>
                        </div>
                      </v-card>
                    </v-item>
                    <div class="caption textFaint--text text-center">
                      Your balance: {{ ethBalanceHuman }} {{ $store.state.nativeGasTokenSymbol }}
                    </div>
                  </v-col>
                  <v-col cols="6" v-if="$store.state.exchange === 'Uniswap'">
                    <v-item v-slot="{ active, toggle }">
                      <v-card
                        :color="active ? 'primary' : ''"
                        class="d-flex align-center"
                        height="100"
                        @click="toggle"
                      >
                        <div :class="['title flex-grow-1 text-center', {'white--text': active}]">
                          {{ secondaryFeeHuman }}
                          {{ feeInfo.secondary_fee_token.symbol }}
                          <div class="caption">
                            (+ {{ liquidityFeeSecondary }}% UNIV2)
                          </div>
                        </div>
                      </v-card>
                    </v-item>
                    <div class="caption textFaint--text text-center">
                      Your balance: {{ secondaryFeeBalanceHuman }} {{ feeInfo.secondary_fee_token.symbol }}
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-item-group>
          </template>

          <div class="mt-8 text-center">
            Once tokens are locked they cannot be withdrawn under any circumstances until the timer has expired. Please ensure the parameters are correct, as they are final.
          </div>

          <v-row dense v-if="optionEthFee === 1 && secondaryAllowanceIncreaseRequired" class="ma-0 mt-4">
            <v-col cols="12">
              <v-btn @click="approveSecondary" color="primary" x-large block depressed :disabled="!secondaryAllowanceIncreaseRequired" :loading="approvalLoading">
                Approve {{ feeInfo.secondary_fee_token.symbol }}
              </v-btn>
            </v-col>
          </v-row>

          <v-row v-else dense class="ma-0 mt-4">
            <v-col cols="6">
              <v-btn @click="approve" color="primary" x-large block depressed :disabled="!allowanceIncreaseRequired" :loading="approvalLoading">
                Approve
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn @click="lockTokens" color="primary" x-large block depressed :disabled="allowanceIncreaseRequired || amount === '0' || !userHasSufficientFlatrateToken" :loading="lockLoading">
                Lock
              </v-btn>
            </v-col>
          </v-row>

          <div v-if="!userHasSufficientFlatrateToken" class="d-flex align-center font-weight-medium midground pa-4 br-8 mt-2" style="position: relative; overflow: hidden;">
            <div class="red" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
            </div>
            <img 
            src="@/assets/img/flags/close.svg" 
            height="26px"
            class="mr-2"
            width="26px">
            <div>
              <div class="caption">
                You do not have enough {{ $store.state.nativeGasTokenSymbol }} in your wallet to perform this transaction.
                {{ ethFeeHuman }}
                {{ $store.state.nativeGasTokenSymbol }} required.
              </div>
            </div>
          </div>

        </div>
      </v-scroll-x-transition>

    </div>

  </div>
</template>

<script>
// import _ from 'lodash'
import { ethers } from 'ethers'
import ERC20 from '@/smart-contracts/erc20'
import CDate from '@/components/ui/date-picker'
import moment from 'moment'
import TxWrapper from '@/smart-contracts/tx-wrapper'
import LockerABI from '@/smart-contracts/lock-uni-v2/univ2-abis'
import LockerContract from '@/smart-contracts/lock-uni-v2/univ2-contract'

export default {
  props: {
    uniPair: {
      type: Object,
      default: () => {

      }
    }
  },

  components: {
    CDate
  },

  data: () => ({
    balance: '0',
    secondaryFeeBalance: '0',
    ethBalance: '0',
    amount: '0',
    amountHuman: '0',
    unlockDate: '0',
    allowance: '0',
    secondaryAllowance: '0',
    unlockerAccount: '',
    referralAddress: '',
    approvalLoading: false,
    lockLoading: false,
    referralIsLoading: false,
    firstLoad: true,
    optionEthFee: 0,
    unlockerIsMe: true,
    hasReferralAddress: false,
    referrerBalanceMet: false,
    whitelisted: false,
    feeInfo: {}
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    secondaryFeeHuman () {
      if (!this.feeInfo.secondary_token_fee) {
        return 0
      }
      var secondaryTokenFee = this.feeInfo.secondary_token_fee
      if (this.hasReferralAddress) {
        secondaryTokenFee = ethers.BigNumber.from(this.feeInfo.secondary_token_fee).mul(1000 - Number(this.feeInfo.referral_discount)).div(1000).toString()
      }
      var amount = ethers.utils.formatUnits(secondaryTokenFee, this.feeInfo.secondary_token_fee.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
    ethFeeHuman () {
      var ethFee = this.feeInfo.eth_fee
      if (this.hasReferralAddress) {
        ethFee = ethers.BigNumber.from(this.feeInfo.eth_fee).mul(1000 - Number(this.feeInfo.referral_discount)).div(1000).toString()
      }
      var amount = ethers.utils.formatUnits(ethFee, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
    referralHoldMinimumHuman () {
      var amount = ethers.utils.formatUnits(this.feeInfo.referral_hold, this.feeInfo.referral_token.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
    liquidityFee () {
      return this.feeInfo.liquidity_fee / 10
    },
    liquidityFeeSecondary () {
      return (this.feeInfo.liquidity_fee / 10) * ((1000 - this.feeInfo.secondary_token_discount) / 1000)
    },
    referralDiscount () {
      return this.feeInfo.referral_discount / 10
    },
    uniBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.balance, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9})
    },
    secondaryFeeBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.secondaryFeeBalance, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
    ethBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.ethBalance, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
    unlockDateHuman () {
      return moment.unix(this.unlockDate).format('ddd D MMM YYYY HH:mm')
    },
    unlockDateFromNow () {
      return moment.unix(this.unlockDate).fromNow()
    },
    userHasSufficientFlatrateToken () {
      return ethers.BigNumber.from(this.ethBalance).gte(this.feeInfo.eth_fee)
    },
    allowanceIncreaseRequired () {
      if (ethers.BigNumber.from(this.amount).gt(this.allowance)) {
        return true
      }
      return false
    },
    secondaryAllowanceIncreaseRequired () {
      if (ethers.BigNumber.from(this.feeInfo.secondary_token_fee).gt(this.secondaryAllowance)) {
        return true
      }
      return false
    },
    referralAddressIsAddress () {
      try {
        ethers.utils.getAddress(this.referralAddress)
        return true
      } catch (e) {
        return false
      }
    },
  },

  watch: {
    sEthersWatcher () {
      this.getUniBalance()
      this.getAllowance()
      this.getEthBalance()
    },
    referralAddress (nv) {
      if (this.referralAddressIsAddress) {
        this.fetchReferralBalance(nv)
      } else {
      }
    }
  },

  methods: {
    async fetchReferralBalance (address) {
      // this.loadingPair = true
      this.referralIsLoading = true
      ERC20.getBalance(address, this.feeInfo.referral_token.address)
        .then(balance => {
          if (ethers.BigNumber.from(balance).gte(this.feeInfo.referral_hold)) {
            this.referrerBalanceMet = true
          } else {
            this.referrerBalanceMet = false
          }
        })
        .catch(e => {})
        .then(() => {
          this.referralIsLoading = false
        })
    },
    async getUniBalance () {
      var balance = await ERC20.getBalance(this.sEthers.coinbase, this.uniPair.address)
      this.balance = balance
    },
    async getSecondaryFeeBalance () {
      var secondaryFeeBalance = await ERC20.getBalance(this.sEthers.coinbase, this.feeInfo.secondary_fee_token.address)
      this.secondaryFeeBalance = secondaryFeeBalance
    },
    async getEthBalance () {
      var ethBalance = await this.sEthers.provider.getBalance(this.sEthers.coinbase)
      this.ethBalance = ethBalance
    },
    async getAllowance () {
      var allowance = await ERC20.getAllowance(this.uniPair.address, this.sEthers.coinbase, LockerABI.locker_mainnet_address())
      this.allowance = allowance

      var secondaryAllowance = await ERC20.getAllowance(this.feeInfo.secondary_fee_token.address, this.sEthers.coinbase, LockerABI.locker_mainnet_address())
      this.secondaryAllowance = secondaryAllowance
    },
    onHumanAmountChange (val) {
      this.amount = ethers.utils.parseUnits(val, 18)
    },
    setMax () {
      this.amount = this.balance
      this.amountHuman = ethers.utils.formatUnits(this.balance, 18)
    },
    setPercent (percent) {
      this.amount = ethers.BigNumber.from(this.balance).mul(percent).div(100).toString()
      this.amountHuman = ethers.utils.formatUnits(this.amount, 18)
    },
    setUnlockDate (date) {
      this.unlockDate = date.unix()
    },
    approve () {
      var amount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      this.approvalLoading = true
      TxWrapper.doTransaction(ERC20.setAllowance(this.uniPair.address, amount, LockerABI.locker_mainnet_address()), this.$root.$dialog.confirmTx)
        .then(() => { 
          this.getAllowance()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.approvalLoading = false
        })
    },
    approveSecondary () {
      var amount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      this.approvalLoading = true
      TxWrapper.doTransaction(ERC20.setAllowance(this.feeInfo.secondary_fee_token.address, amount, LockerABI.locker_mainnet_address()), this.$root.$dialog.confirmTx)
        .then(() => { 
          this.getAllowance()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.approvalLoading = false
        })
    },
    async getFees () {
      var feeInfo = await LockerContract.getFees()
      this.feeInfo = feeInfo
    },
    async getUserWhitelistStatus () {
      var whitelisted = await LockerContract.getUserWhitelistStatus(this.sEthers.coinbase)
      this.whitelisted = whitelisted
    },
    async lockTokens () {
      this.lockLoading = true
      var amount = this.amount
      // this.feeInfo.eth_fee = '400000000000000000'
      var unlocker = this.unlockerIsMe ? this.sEthers.coinbase : this.unlockerAccount
      var referral = this.hasReferralAddress ? this.referralAddress : ethers.constants.AddressZero
      var feeInEth = this.optionEthFee === 0
      var ethFee = this.feeInfo.eth_fee
      if (this.hasReferralAddress) {
        ethFee = ethers.BigNumber.from(this.feeInfo.eth_fee).mul(1000 - Number(this.feeInfo.referral_discount)).div(1000).toString()
      }
      if (this.whitelisted) {
        feeInEth = true
        ethFee = '0'
      }
      TxWrapper.doTransaction(LockerContract.lockLPToken(this.uniPair.address, amount, this.unlockDate, referral, feeInEth, ethFee, unlocker), this.$root.$dialog.confirmTx)
        .then(() => { 
          this.getAllowance()
          this.getUniBalance()
          this.$emit('on-lock', amount)
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.lockLoading = false
        })
    },
    async doFirstLoad () {
      await this.getFees()
      await this.getUniBalance()
      await this.getAllowance()
      await this.getUserWhitelistStatus()
      this.getSecondaryFeeBalance()
      this.getEthBalance()
    }
  },

  created () {
    this.doFirstLoad()
      .then(() => {})
      .catch(e => {})
      .then(() => {
        this.firstLoad = false
      })
    // this.unlockerAccount = this.sEthers.coinbase
    this.unlockDate = moment().add(6, 'M').unix()
  }
}
</script>