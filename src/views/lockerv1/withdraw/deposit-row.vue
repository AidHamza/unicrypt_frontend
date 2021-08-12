<template>
  <div class="r-border-b mb-1">
    <v-row class="ma-0 pa-0" dense>
      <v-col cols="6">
        <div>
          {{ percentOfTotal }}%
        </div>
        
        <div class="caption textMid--text">
          {{ depositAmountHuman }} UNi-V2
        </div>
        
      </v-col>
      <v-col cols="6">
        <div>
          {{ dateSimple }}
        </div>
        <div class="caption textMid--text">
          {{ dateFromNow }}
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    item: {
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
      var amount = Number(this.item.amount) / Math.pow(10, 18)
      if (amount < 1) {
        return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 18, maximumFractionDigits: 18})
      }
      var maxDecimals = amount > 1 ? 1 : 4
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: maxDecimals})
    },
    dateFromNow () {
      if (moment.unix(this.item.epoch).isValid()) {
        return moment.unix(this.item.epoch).fromNow()
      }
      return ''
    },
    dateSimple () {
      if (moment.unix(this.item.epoch).isValid()) {
        return moment.unix(this.item.epoch).format('DD/MM/YYYY HH:mm')
      }
      return ''
    },
    percentOfTotal () {
      var locked = Number(this.item.amount) / Math.pow(10, 18)
      var total = Number(this.totalSupply) / Math.pow(10, 18)
      var division = (locked / total) * 100
      var maxDecimals = division > 1 ? 1 : 2
      return Number(division).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: maxDecimals})
    },
  }
}
</script>