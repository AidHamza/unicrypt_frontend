<template>
  <div class="r-border-b mb-1">
    <div class="pt-2 pb-2 border-b">
        
      <div>
        {{ depositAmountHuman }} UNi-V2
      </div>

      <div>
        {{ dateSimple }}
      </div>
      <div class="caption textMid--text">
        {{ dateFromNow }} - #{{ lock.lockID }}
      </div>

      <div class="caption ma-2">
        {{ lock }}
      </div>
        
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { ethers } from 'ethers'

export default {
  props: {
    lock: {
      type: Object,
      default: function () {
        return {}
      }
    },
    totalSupply: {
      type: String,
      default: '0'
    }
  },
  computed: {
    depositAmountHuman () {
      var amount = ethers.utils.formatUnits(this.lock.amount, 18)
      var decimals = 18
      if (amount > 1) {
        decimals = 2
      } else if (amount > 0.0001) {
        decimals = 6
      } else if (amount < 0.000000001) {
        decimals = 18
      }
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: decimals})
    },
    dateFromNow () {
      if (moment.unix(this.lock.unlock_date).isValid()) {
        return moment.unix(this.lock.unlock_date).fromNow()
      }
      return ''
    },
    dateSimple () {
      if (moment.unix(this.lock.unlock_date).isValid()) {
        return moment.unix(this.lock.unlock_date).format('ddd D MMM YYYY HH:mm')
      }
      return ''
    },
    epochHasPassed () {
      return this.lock.unlock_date < moment().unix()
      // return true // for testing withdrawl before unlock
    }
  }
}
</script>