<template>
  <div :class="['d-flex align-center border-b pt-2 pb-2', {'textFaint--text': epochHasPassed}]">
    <div>
      <div :class="['font-weight-bold', {'primary--text': item.v2}]">
        ${{ dollarValue }}
      </div>
      <div class="caption textFaint--text">
        {{ amountHuman }} univ2
      </div>
    </div>
    <v-spacer></v-spacer>
    <div class="text-end">
      <div class="font-weight-bold">
        {{ dateFromNow }}
      </div>
      <div class="caption textFaint--text">
        {{ dateSimple }}
      </div>
    </div>
    <v-icon class="ml-3" color="textFaint" v-if="epochHasPassed">mdi-lock-open-outline</v-icon>
    <v-icon class="ml-3" color="primary" v-else>mdi-lock</v-icon>
  </div>
</template>

<script>
import moment from 'moment'
import { ethers } from 'ethers'

export default {
  props: {
    item: {},
    reserveUSD: {
      type: String
    },
    totalSupply: {
      type: String
    }
  },

  computed: {
    percent () {
      if (this.totalSupply === '0') {
        return 0
      }
      var perc = ethers.BigNumber.from(this.item.amount).mul(10000000000).div(this.totalSupply)
      return perc / 10000000000
    },
    dollarValue () {
      var value = this.reserveUSD * this.percent
      return Number(value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
    amountHuman () {
      var amount = ethers.utils.formatUnits(this.item.amount, 18)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})
    },
    dateFromNow () {
      if (moment.unix(this.item.unlock_date).isValid()) {
        return moment.unix(this.item.unlock_date).fromNow()
      }
      return ''
    },
    dateSimple () {
      if (moment.unix(this.item.unlock_date).isValid()) {
        return moment.unix(this.item.unlock_date).format('DD/MM/YYYY HH:mm')
      }
      return ''
    },
    epochHasPassed () {
      return this.item.unlock_date < moment().unix()
    }
  }
}
</script>