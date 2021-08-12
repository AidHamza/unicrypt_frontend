<template>
  <div
  @click="$router.push(`/pair/${item.address}`)"
  class="pa-4 border-b c-list">
    <div class="d-flex align-center">
      <div class="d-flex align-center">
        <coin-icon :address="item.token0.address" :size="18" style="z-index: 1;"></coin-icon>
        <coin-icon :address="item.token1.address" :size="18" style="margin-left: -6px;" class="mr-2"></coin-icon>
        <div>
          <v-btn text :href="`https://info.uniswap.org/pair/${item.address}`">
            {{ item.token0.symbol }} /
            {{ item.token1.symbol }}
            <v-icon x-small class="ml-1">mdi-arrow-top-right</v-icon>
          </v-btn>
          <div class="t-small textFaint--text font-italic">
            Uniswap index {{ item.uniswap_index }}
          </div>
        </div>
      </div>
      <v-spacer></v-spacer>
      <div class="text-end">
        <div class="purple--text font-weight-bold">
          ${{ item.fee_value }}
        </div>
        <div class="font-weight-bold t-small d-flex align-center justify-end">
          <template v-if="item.fishy">
            ?
          </template>
          <span v-else :class="item.locked_usd > 100000 ? 'primary--text' : ''">
            ${{ dollarValue }}
          </span>
          <v-icon small class="ml-1" :color="item.locked_usd > 100000 ? 'primary' : ''">mdi-lock</v-icon>
        </div>
        <div class="t-small textFaint--text font-italic">
          next {{ dateFromNow }} 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    item: {}
  },
  computed: {
    dollarValueeee () {
      return Number(this.item.locked_usd).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})
    },
    dollarValue () {
      var amount = parseInt(this.item.locked_usd)
      // amount = '1230000' // for testing
      if (amount >= 1000000) {
        var deci = Number(amount / 1000000).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
        return deci + 'M'
      } else if (amount > 1000) {
        return Math.floor(amount / 1000) + 'k'
      }
      return amount
      // return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})
    },
    dateFromNow () {
      if (moment.unix(this.item.next_unlock).isValid()) {
        return moment.unix(this.item.next_unlock).fromNow()
      }
      return ''
    },
  }
}
</script>