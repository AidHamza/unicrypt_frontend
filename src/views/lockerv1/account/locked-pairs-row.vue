<template>
  <v-card class="c-list mb-2 br-20" @click="$emit('on-select')">
    <div class="d-flex align-center pa-3 font-weight-bold">
      <coin-icon :address="item.token0.address"></coin-icon>
      <coin-icon :address="item.token1.address" class="mr-2"></coin-icon>

      <div>
        {{ item.token0.symbol }} / {{ item.token1.symbol }}

        <div v-if="false" class="caption font-weight-regular">
          {{ reserve0Human }} / {{ reserve1Human }}
        </div>
      </div>

      <v-spacer></v-spacer>

      {{ tokenAddressCondensed }}

    </div>

  </v-card>
</template>

<script>
import { ethers } from 'ethers'

export default {
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },

  computed: {
    tokenAddressCondensed () {
      var address = this.item.address
      if (!address) {
        return ''
      }
      return address.slice(0, 6) + '...' + address.slice(address.length - 4)
    },
    reserve0Human () {
      var amount = ethers.utils.formatUnits(this.item.reserve0, this.item.token0.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.item.token0.decimals})
    },
    reserve1Human () {
      var amount = ethers.utils.formatUnits(this.item.reserve1, this.item.token1.decimals)
      return Number(amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: this.item.token1.decimals})
    },
  }
}
</script>