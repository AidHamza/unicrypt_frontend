<template>
  <v-container style="max-width: 600px;" :class="[{'pa-0 foreground mobile-page': $vuetify.breakpoint.xs}]">
    <v-slide-x-transition appear>
      <div :class="['mb-16', {'pa-4': $vuetify.breakpoint.xs}, {'v-card br-20 pa-6': !$vuetify.breakpoint.xs}]">
        
        <div class="text-center">
          <img 
          src="@/assets/img/icons/padlock.svg" 
          height="60px"
          width="60px"
          class="greyscale">
        </div>

        <div class="title text-center textFaint--text mb-4">
          Token Locker
        </div>

        <div class="caption">
          Introducing Token Vesting Locking Pools. Token locks are represented as shares of a pool, in a similar way to a uniswap pool, allowing all ERC20 tokens including Rebasing and Deflationary mechanisms to be supported.
        </div>

        <div class="caption font-italic textFaint--text mb-4">
          This means lock amounts may change due to decimal rounding, but you will always retain your share of the pool.
        </div>

        <div class="caption font-italic orange--text mb-4">
          Do not lock Liquidity tokens here, they will <strong>not</strong> be shown in the Unicrypt browser, and will <strong>not</strong> be migrateable.
        </div>

        <div class="text-center py-2 mb-5">
          <div class="textFaint--text">
            Selected network
          </div>
          <v-btn large block outlined @click="$root.$dialog.chainSwitcher.open()" class="title">
            <img 
            :src="$settings.CHAINS[$store.state.requiredNetwork].icon" 
            height="24px"
            width="24px"
            class="mr-3 br-20">
            {{ $settings.CHAIN_DISPLAY_NAME[$store.state.requiredNetwork] }}
            <v-icon small color="">mdi-chevron-down</v-icon>
          </v-btn>
        </div>

        <v-btn v-if="!sEthers.coinbase" @click="connectWallet" 
        large block outlined class="title">
          <v-icon class="mr-3">mdi-wallet</v-icon>
          Connect your wallet
        </v-btn>

        <template v-else>

          <div :class="['mt-1 mb-2 d-flex align-center pa-3 r-outlined br-20 mx-2', {'foreground': $vuetify.breakpoint.xs}, {'inputcolor': !$vuetify.breakpoint.xs}]">
            <img 
            :src="$settings.CHAINS[$store.state.requiredNetwork].icon" 
            height="20px"
            width="20px"
            class="mr-2 br-20">
            <c-input :value.sync="tokenAddress" placeholder="Token address..." class="">
            </c-input>

            <v-progress-circular
            v-if="showSearchLoader"
            indeterminate
            width="2"
            class="mr-2"
            size="24"
            color="primary"
            ></v-progress-circular>

            <v-icon v-if="tokenAddress === ''">
              mdi-magnify
            </v-icon>
            <v-icon v-else @click="tokenAddress = ''">
              mdi-close
            </v-icon>

          </div>

          <div v-show="tokenHydrated.address">

            <v-card outlined class="v-card pa-4 br-20 green-button white--text">
              <div class="d-flex align-center white--text">
                <coin-icon :address="tokenHydrated.address" class="mr-2"></coin-icon>
                {{ tokenHydrated.symbol }} 
                <span class="white--text ml-1">/ {{ tokenHydrated.name }}</span>
                <v-spacer></v-spacer>
                <div class="caption white--text">
                  {{ tokenHydrated.decimals }} decimals
                </div>
              </div>
              <div class="text-center">
                <div class="caption white--text font-italic mt-2">
                  Your balance
                </div>
                <div class="title">
                  {{ tokenBalanceHuman }} {{ tokenHydrated.symbol }} 
                </div>
                <v-spacer></v-spacer>
              </div>
            </v-card>

            <div class="mt-2 d-flex align-center mx-auto" style="max-width: 580px;flex: 1 1 0;">

              <div :class="['top-tab', {'active': tab === 0}]" @click="tab = 0">
                <v-icon size="20" class="mr-1">mdi-lock-outline</v-icon>
                <span>New lock</span>
              </div>

              <div :class="['top-tab', {'active': tab === 1}]" @click="tab = 1">
                <v-icon size="20" class="mr-1">mdi-lock</v-icon>
                <span>View locks</span>
              </div>

            </div>

            <!-- LOCK TAB -->
            <div v-show="tab == 0">
              <!-- LOCK ARRAY -->
              <div class="mt-5 v-card br-20">
                <div class="pa-4 border-b">
                  Locks 
                  <span class="textFaint--text">({{ locks.length }})</span>
                </div>
                <lock-row 
                v-for="lock of locks" 
                :key="lock.nonce"
                :lock="lock"
                :tokenHydrated="tokenHydrated"
                :balance="balance"
                @remove-lock="removeLock(lock.nonce)"
                @duplicate="duplicate(lock)">
                </lock-row>

                <div class="background border-b text-center py-2">
                  <v-btn small color="primary" @click="addLock">
                    <v-icon small>mdi-subdirectory-arrow-right</v-icon>
                    Add A lock
                  </v-btn>
                </div>

                <div class="background text-center caption text--text px-2 py-2">
                  <span class="font-weight-bold text--text">{{ totalLockAmountHuman }}</span>
                  /{{ tokenBalanceHuman }} <span class="font-weight-bold text--text">{{ tokenHydrated.symbol }}</span> 
                  total locked
                </div>

              </div>
              <!-- LOCK ARRAY -->

              <!-- TOKEN FEE WHITELIST -->
              <pay-once-off-fee 
              v-if="!tokenOnFeeWhitelist"
              :fees="fees"
              :tokenHydrated="tokenHydrated"
              class="border pa-6 br-8 mt-4 mb-2"
              ></pay-once-off-fee>
              <!-- TOKEN FEE WHITELIST -->

              <div>
                <div v-if="tokenOnFeeWhitelist" class="pa-8 br-20 text-center">
                  <v-icon size="60" color="textFaint">mdi-emoticon-excited-outline</v-icon>
                  <div class="textFaint--text">
                    No fees for this token!
                  </div>
                </div>

                <v-card v-else outlined class="pa-6 br-8 mt-4">
    
                  <div class="d-flex">
                    Fee: 
                    <v-spacer></v-spacer>
                    {{ fees.token_fee / 100 }}%
                  </div>
                  <div class="d-flex">
                    Total Debit: 
                    <v-spacer></v-spacer>
                    <span :class="[{'orange--text': errorInsufficientBalanceForLocks}]">{{ totalDebitAmountHuman }} {{ tokenHydrated.symbol }}</span>
                  </div>

                  <div class="text-center">
                    <v-btn outlined rounded @click="chargeFeeSeperately = !chargeFeeSeperately">
                      Charge fee seperately
                      <v-icon v-if="chargeFeeSeperately" color="primary" class="ml-3">mdi-check-circle-outline</v-icon>
                      <v-icon v-else class="ml-3" color="text">mdi-checkbox-blank-circle-outline</v-icon>
                    </v-btn>
                  </div>

                  <div class="mt-1 caption textFaint--text font-italic text-center">
                    Apply a fee to each lock, or pay it once seperately, paying the fee seperately helps ensure the amount of the lock matches the amount you entered.
                  </div>

                </v-card>
              </div>

              <div class="my-3 textFaint--text caption font-italic text-center">
                Once tokens are locked they cannot be withdrawn under any circumstances until the timer has expired. Please ensure the parameters are correct, as they are final.
              </div>

              <div v-if="errorTotalLockAmountIsZero" class="text-center orange--text py-2">
                Error: Total Lock amount is Zero
              </div>

              <div v-if="locksContainSendToAnotherUser" :class="{'pa-4': $vuetify.breakpoint.xs}">
                <div class="my-2 d-flex align-center font-weight-medium midground pa-4 br-8" style="position: relative; overflow: hidden;">
                  <div class="orange" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
                  </div>
                  <div>
                    <div class="d-flex align-center mb-2">
                      <img 
                      src="@/assets/img/flags/exclamation.svg" 
                      height="26px"
                      class="mr-2"
                      width="26px">
                      Attention!
                    </div>
                    <div class="caption font-weight-bold">
                      Some locks are being sent to users that are not your currently connected account!
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="errorInsufficientBalanceForLocks" class="d-flex align-center font-weight-medium midground pa-4 br-8 mt-2" style="position: relative; overflow: hidden;">
                <div class="red" style="position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px;opacity: 0.2;">
                </div>
                <img 
                src="@/assets/img/flags/close.svg" 
                height="26px"
                class="mr-2"
                width="26px">
                <div>
                  <div class="caption">
                    You do not have enough {{ tokenHydrated.symbol }} for this transaction.
                    {{ totalDebitAmountHuman }}
                    {{ tokenHydrated.symbol }} required.
                  </div>
                </div>
              </div>

              <v-row dense class="ma-0 mt-4">
                <v-col cols="6">
                  <v-btn @click="approve" color="primary" x-large block depressed :disabled="!allowanceIncreaseRequired" :loading="approvalLoading">
                    Approve
                  </v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn @click="lockTokens" color="primary" x-large block depressed :disabled="allowanceIncreaseRequired" :loading="lockLoading">
                    Lock
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <div v-show="tokenHydrated.address && sEthers.coinbase && tab === 1" :class="[{'v-card br-20 mt-4': $vuetify.breakpoint.xs}, {'v-card br-20 mt-4': !$vuetify.breakpoint.xs}]">
              <global-token :tokenHydrated="tokenHydrated"></global-token>
            </div>

          </div>

        </template>

      </div>
    </v-slide-x-transition>

  </v-container>
</template>

<script>
import { ethers } from 'ethers'
import ERC20 from '@/smart-contracts/erc20'
import VestingABI from '@/smart-contracts/token-locker/token-locker-abis'
import VestingContract from '@/smart-contracts/token-locker/token-locker-contract'
import TxWrapper from '@/smart-contracts/tx-wrapper'
import GlobalToken from './global-token/Main'
import LockRow from './lock-tokens/lock-row'
import moment from 'moment'
import PayOnceOffFee from './pay-once-off-fee'

export default {
  components: {
    LockRow,
    PayOnceOffFee,
    GlobalToken
  },

  data: () => ({
    tab: 0,
    allowance: '0',
    balance: '0',
    tokenAddress: '',
    showSearchLoader: false,
    tokenHydrated: {},
    approvalLoading: false,
    lockLoading: false,
    locks: [], // [{amount, owner, start_emission, end_emission}]
    addNonce: -1, // unique nonce for each lock row
    fees: {
      token_fee: '0',
      free_locking_fee: '0',
      free_locking_token: ''
    },
    tokenOnFeeWhitelist: false,
    chargeFeeSeperately: true
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    sEthersWatcher () {
      return this.sEthers.watcher
    },
    blockNumber () {
      return this.$store.state.blockNumber
    },
    tokenBalanceHuman () {
      return this.$root.formatAmount(this.balance, this.tokenHydrated.decimals)
    },
    tokenAddressCondensed () {
      var address = this.tokenHydrated.address
      if (!address) {
        return ''
      }
      return address.slice(0, 6) + '...' + address.slice(address.length - 4)
    },
    allowanceIncreaseRequired () {
      if (ethers.BigNumber.from(this.totalLockAmount).gt(this.allowance)) {
        return true
      }
      return false
    },
    totalLockAmount () {
      return this.locks.reduce((a, b) => {
        return ethers.BigNumber.from(a).add(b.amount)
      }, '0').toString()
    },
    totalLockAmountHuman () {
      var amount = ethers.utils.formatUnits(this.totalLockAmount, this.tokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9})
    },
    totalDebitAmount () {
      return this.locks.reduce((a, b) => {
        var amount = b.amount
        if (!this.tokenOnFeeWhitelist && this.chargeFeeSeperately) {
          amount = ethers.BigNumber.from(b.amount).mul(10000).div(10000 - this.fees.token_fee).toString()
        }
        return ethers.BigNumber.from(a).add(amount)
      }, '0').toString()
    },
    locksContainSendToAnotherUser () {
      for (var lock of this.locks) {
        if (lock.owner !== this.sEthers.coinbase) {
          return true
        }
      }
      return false
    },
    totalDebitAmountHuman () {
      var amount = ethers.utils.formatUnits(this.totalDebitAmount, this.tokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9})
    },
    freeLockingFeeHuman () {
      var amount = ethers.utils.formatUnits(this.fees.free_locking_fee, 18) // native gas token always 18 decimals
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    },
    errorInsufficientBalanceForLocks () {
      return ethers.BigNumber.from(this.balance).lt(this.totalDebitAmount)
    },
    errorTotalLockAmountIsZero () {
      return this.totalLockAmount === '0'
    }
  },

  watch: {
    tokenAddress () {
      this.loadToken()
    },
    sEthersWatcher () {
      console.log('watcher is changed')
      this.loadToken()
      this.getFees()
    },
    blockNumber () {
      this.getTokenBalance()
      this.tokenOnZeroFeeWhitelist()
    }
  },

  methods: {
    generateNonce () {
      this.addNonce++
      return this.addNonce
    },
    connectWallet () {
      this.$root.$dialog.connectWalletDialog.open()
        .then(() => {
        })
        .catch(e => {})
    },
    addLock () {
      this.locks.push({
        owner: this.sEthers.coinbase,
        amount: '0',
        start_emission: 0,
        end_emission: moment().unix(), // + 300,
        condition: ethers.constants.AddressZero,
        nonce: this.generateNonce()
      })
    },
    removeLock (nonce) {
      console.log(nonce)
      this.locks = this.locks.filter(item => item.nonce !== nonce)
    },
    duplicate (lock) {
      var copied = JSON.parse(JSON.stringify(lock))
      copied.nonce = this.generateNonce()
      this.locks.push(copied)
    },
    async getLocks () {
      var response = await VestingContract.getLocks(this.tokenHydrated.address, 0, 1)
      console.log(response)
    },
    async lockTokens () {
      this.lockLoading = true
      var lockParams = this.locks.map(item => {
        var amount = item.amount
        if (!this.tokenOnFeeWhitelist && this.chargeFeeSeperately) {
          amount = ethers.BigNumber.from(item.amount).mul(10000).div(10000 - this.fees.token_fee).toString()
        }
        return [item.owner, amount, item.start_emission, item.end_emission, item.condition]
      })
      TxWrapper.doTransaction(VestingContract.lock(this.tokenHydrated.address, lockParams), this.$root.$dialog.confirmTx)
        .then(() => { 
          this.getAllowance()
          this.getTokenBalance()
          this.$root.$dialog.globalSuccess.open('Tokens locked! Locks are visible on your token page.')
          // this.$emit('on-lock', amount)
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.lockLoading = false
        })
    },
    approve () {
      var amount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      this.approvalLoading = true
      TxWrapper.doTransaction(ERC20.setAllowance(this.tokenHydrated.address, amount, VestingABI.vesting_address()), this.$root.$dialog.confirmTx)
        .then(() => { 
          this.getAllowance()
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.approvalLoading = false
        })
    },
    async loadToken () {
      try {
        ethers.utils.getAddress(this.tokenAddress)
      } catch (e) {
        this.tokenHydrated = {}
        // this.$refs.globalToken.loadToken({})
        return
      }
      this.showSearchLoader = true
      ERC20.getERC20(this.tokenAddress)
        .then(token => {
          this.tokenHydrated = token
          if (this.locks.length === 0) {
            this.addLock()
          }
          this.getTokenBalance()
          this.getAllowance()
          this.tokenOnZeroFeeWhitelist()
        })
        .catch(e => {
          this.tokenHydrated = {}
        })
        .then(() => {
          this.showSearchLoader = false
        })
    },
    async getFees () {
      var fees = await VestingContract.getFees()
      this.fees = fees
    },
    async tokenOnZeroFeeWhitelist () {
      var tokenOnFeeWhitelist = await VestingContract.tokenOnZeroFeeWhitelist(this.tokenHydrated.address)
      this.tokenOnFeeWhitelist = tokenOnFeeWhitelist
    },
    async getTokenBalance () {
      if (!this.sEthers.coinbase || !this.tokenHydrated.address) {
        return
      }
      var balance = await ERC20.getBalance(this.sEthers.coinbase, this.tokenHydrated.address)
      this.balance = balance
    },
    async getAllowance () {
      if (!this.sEthers.coinbase || !this.tokenHydrated.address) {
        return
      }
      var allowance = await ERC20.getAllowance(this.tokenHydrated.address, this.sEthers.coinbase, VestingABI.vesting_address())
      this.allowance = allowance
    },
  },

  created () {
    this.tokenAddress = this.$route.query.token || ''
    this.getFees()
  }
}
</script>