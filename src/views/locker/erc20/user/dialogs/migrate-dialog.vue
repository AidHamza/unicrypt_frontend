<template>
  <v-dialog v-model="dialog" persistent max-width="450" content-class="br-20">
    <v-card class="br-20">

      <v-card-text>
        
        <v-row class="ma-0 align-center">
          <div class="pt-3 pb-3">
            Migrate Liquidity
          </div>
          <v-spacer></v-spacer>
          <v-btn @click="cancel" icon large color="textFaint">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <!-- {{ lock }}
        {{ unipair }} -->

        <div  class="pa-1">

          Migrateable: {{ withdrawableBalanceHuman }}

        </div>

        <!--
        <div>
          {{ amount }}
        </div>
        -->

      </v-card-text>

      <v-row dense class="ma-2">
        <v-btn x-large rounded block depressed @click="migrate" color="primary" class="white--text grad-green" :loading="withdrawLoading">
          Migrate
          <v-icon class="ml-2">mdi-arrow-right</v-icon>
        </v-btn>
      </v-row>

    </v-card>
  </v-dialog>
</template>

<script>
import { ethers } from 'ethers'
import TxWrapper from '@/smart-contracts/tx-wrapper'
import VestingContract from '@/smart-contracts/token-locker/token-locker-contract'

export default {
  components: {
  },
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    amount: '0',
    amountHuman: '0',
    lpTokenAddress: '',
    farmAddress: '',
    farmIndex: '',
    stakedBalance: '0',
    loading: false,
    withdrawLoading: false,
    lock: {
      amount_withdrawn: '0',
      tokens_deposited: '0',
      tokens_withdrawn: '0',
    },
    tokenHydrated: {
      decimals: '0'
    },
  }),

  computed: {
    sEthers () {
      return this.$store.state.ethers
    },
    amountRemaining () {
      return ethers.BigNumber.from(this.lock.tokens_deposited).sub(this.lock.tokens_withdrawn).toString()
    },
    withdrawableBalanceHuman () {
      var amount = ethers.utils.formatUnits(this.amountRemaining, this.tokenHydrated.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.tokenHydrated.decimals})
    },
  },

  watch: {
    
  },

  methods: {
    open (lock, _tokenHydrated) {
      this.lock = lock
      this.tokenHydrated = _tokenHydrated
      this.dialog = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    setMax () {
      this.amount = this.lock.amount
      this.amountHuman = ethers.utils.formatUnits(this.lock.amount, this.tokenHydrated.decimals)
    },
    cancel () {
      this.reject()
      this.dialog = false
    },
    async getStakedLPBalance () {
      var stakedLPBalance = await VestingContract.userInfo(this.farmAddress, this.sEthers.coinbase)
      this.stakedBalance = stakedLPBalance.amountWithdrawable
    },
    onHumanAmountChange (val) {
      this.amount = ethers.utils.parseUnits(val, 18)
    },
    migrate () {
      this.withdrawLoading = true
      TxWrapper.doTransaction(VestingContract.migrate(this.lock.lock_id, 666), this.$root.$dialog.confirmTx)
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
    this.filteredTokens = this.savedTokens
  }
}
</script>