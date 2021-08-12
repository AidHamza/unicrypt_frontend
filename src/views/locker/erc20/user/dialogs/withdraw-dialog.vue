<template>
  <v-dialog v-model="dialog" persistent max-width="450" content-class="br-20">
    <v-card class="br-20">

      <v-card-text>
        
        <v-row class="ma-0 align-center">
          <div class="pt-3 pb-3">
            Withdraw Tokens
          </div>
          <v-spacer></v-spacer>
          <v-btn @click="cancel" large icon color="textFaint">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <div  class="pa-1">

          <template>
            <div class="pa-1 align-center flex-nowrap inputcolor r-outlined">
              <div class="caption text-end mr-3 pt-2">
                <div v-if="false" class="textFaint--text font-italic">
                  Withdrawbale Shares: {{ withdrawableSharesHuman }}
                </div>
                <div class="textFaint--text">
                  Withdrawable: {{ withdrawableTokensHuman }}
                </div>
              </div>
              <div class="d-flex align-center">
                <c-input :value.sync="amountHuman" placeholder="0.0" @updateWhileFocussed="onHumanAmountChange" class="pa-2 title font-weight-bold">
                </c-input>
                <span class="mr-2">
                  {{ tokenHydrated.symbol }}
                </span>
                <v-btn small outlined rounded @click="setMax" class="mr-2 grad-green white--text">
                  MAX
                </v-btn>
              </div>
            </div>
          </template>

        </div>

        <!--
        <div>
          {{ amount }}
        </div>
        -->

      </v-card-text>

      <!--
      <div>
        {{ shareAmount }}
      </div>
      <div>
        You get: {{ realWithdrawlAmountHuman }}
      </div>
      -->

      <v-row dense class="ma-2">
        <v-btn x-large rounded block @click="withdraw" color="primary" class="white--text grad-green" :loading="withdrawLoading">
          Withdraw
          <v-icon class="ml-2">mdi-arrow-up</v-icon>
        </v-btn>
      </v-row>

    </v-card>
  </v-dialog>
</template>

<script>
import { ethers } from 'ethers'
import CInput from '@/components/ui/input'
import TxWrapper from '@/smart-contracts/tx-wrapper'
import VestingContract from '@/smart-contracts/token-locker/token-locker-contract'

export default {
  components: {
    CInput
  },
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    amount: '0',
    amountHuman: '0',
    withdrawLoading: false,
    lock: {
    },
    tokenHydrated: {
      decimals: '0'
    },
    wdrwShares: '0',
    wdrwTokens: '0',
    lastSync: 0
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    blockNumber () {
      return this.$store.state.blockNumber
    },
    /* withdrawableBalanceHuman () {
      var remain = ethers.BigNumber.from(this.lock.amount_deposited).sub(this.lock.amount_withdrawn)
      var amount = ethers.utils.formatUnits(remain, this.tokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    }, */
    withdrawableSharesHuman () {
      var amount = ethers.utils.formatUnits(this.wdrwShares, this.tokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.tokenHydrated.decimals})
    },
    withdrawableTokensHuman () {
      var amount = ethers.utils.formatUnits(this.wdrwTokens, this.tokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.tokenHydrated.decimals})
    },
    shareAmount () {
      if (this.wdrwTokens === '0') {
        return '0'
      }
      return ethers.BigNumber.from(this.wdrwShares).mul(this.amount).div(this.wdrwTokens)
    },
    realWithdrawlAmount () {
      if (this.wdrwShares === '0') {
        return '0'
      }
      return ethers.BigNumber.from(this.shareAmount).mul(this.wdrwTokens).div(this.wdrwShares)
    },
    realWithdrawlAmountHuman () {
      var amount = ethers.utils.formatUnits(this.realWithdrawlAmount, this.tokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.tokenHydrated.decimals})
    }
  },

  watch: {
    blockNumber () {
      var now = Math.round(new Date() / 1000)
      var elapsed = now - this.lastSync
      // console.log('elapsed: ' + elapsed)
      if (elapsed >= 8) {
        this.lastSync = now
        this.refresh()
      } else {
        // console.log('skipping')
      }
    }
  },

  methods: {
    open (lock, _tokenHydrated) {
      this.tokenHydrated = _tokenHydrated
      this.lock = lock
      this.wdrwShares = '0'
      this.wdrwTokens = '0'
      this.refresh()
      this.dialog = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    setMax () {
      // this.amount = ethers.BigNumber.from(this.lock.amount_deposited).sub(this.lock.amount_withdrawn).toString()
      this.amount = this.wdrwTokens
      this.amountHuman = ethers.utils.formatUnits(this.amount, this.tokenHydrated.decimals)
    },
    cancel () {
      this.reject()
      this.dialog = false
    },
    onHumanAmountChange (val) {
      this.amount = ethers.utils.parseUnits(val, this.tokenHydrated.decimals)
    },
    async getWithdrawableShares () {
      var wdrwShares = await VestingContract.getWithdrawableShares(this.lock.lock_id)
      this.wdrwShares = wdrwShares
    },
    async getWithdrawableTokens () {
      var wdrwTokens = await VestingContract.getWithdrawableTokens(this.lock.lock_id)
      this.wdrwTokens = wdrwTokens
    },
    async refresh () {
      this.getWithdrawableShares()
      this.getWithdrawableTokens()
    },
    async withdraw () {
      this.withdrawLoading = true
      TxWrapper.doTransaction(VestingContract.withdraw(this.lock.lock_id, this.amount), this.$root.$dialog.confirmTx)
        .then(() => {
          this.resolve()
          this.dialog = false
        })
        .catch(e => { this.$root.$dialog.web3Error.open(e.message) })
        .then(() => {
          this.withdrawLoading = false
        })
    }
  },

  created () {
  }
}
</script>