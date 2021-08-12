<template>
  <div :class="['v-card pa-6 mb-6 br-20', {'grad-green white--text': epochHasPassed}]">

    <v-icon v-if="epochHasPassed" size="130" style="color: rgba(0,0,0,0.05)!important; position: absolute; right: -30px; top: 20px;">mdi-lock-open-outline</v-icon>
    <v-icon v-else size="80" style="color: var(--v-background-base)!important; position: absolute; right: -30px; top: 30px;">mdi-lock-outline</v-icon>
    
    <div style="position: relative;">

      <div class="d-flex align-center">
        
        <!--
        <v-icon v-if="epochHasPassed" class="ml-1" color="white" size="40">mdi-lock-open-outline</v-icon>
        <v-icon v-else class="ml-1" color="textFaint" size="40">mdi-lock</v-icon>
        -->

        <div class="">
          <div class="title font-weight-bold">
            {{ percentOfTotal }}% {{ epochHasPassed ? 'UNLOCKED' : 'LOCKED' }}
          </div>
          <div class="caption">
            {{ depositAmountHuman }} UNi-V2
          </div>
        </div>

        <v-spacer></v-spacer>

        <v-menu
        offset-y
        left
        >
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              icon :color="epochHasPassed ? 'white' : ''" class=""
              v-bind="attrs"
              large
              v-on="on"
            >

              <v-icon>mdi-settings</v-icon>
            </v-btn>
          </template>

          <v-list style="min-width: 200px;" class="background">
            <v-list-item @click="$emit('relock', item)">
              <v-list-item-title>
                Relock
              </v-list-item-title>
              <v-icon class="ml-1" color="">mdi-update</v-icon>
            </v-list-item>
            <v-list-item @click="$emit('transfer-ownership', item)">
              <v-list-item-title>
                Transfer ownership
              </v-list-item-title>
              <v-icon class="ml-1" color="">mdi-account-outline</v-icon>
            </v-list-item>
            <v-list-item v-if="$store.state.exchange === 'Pancakeswap V1'" @click="$emit('migrate', item)">
              <v-list-item-title>
                Migrate
              </v-list-item-title>
              <v-icon class="ml-1" color="">mdi-arrow-right</v-icon>
            </v-list-item>
            <v-list-item @click="$emit('increment', item)">
              <v-list-item-title>
                Increment Lock
              </v-list-item-title>
              <v-icon class="ml-1" color="">mdi-plus</v-icon>
            </v-list-item>
            <v-list-item @click="$emit('split', item)">
              <v-list-item-title>
                Split Lock
              </v-list-item-title>
              <v-icon class="ml-1" color="">mdi-call-split</v-icon>
            </v-list-item>
          </v-list>
        </v-menu>

      </div>

      <v-btn x-large v-if="epochHasPassed" depressed rounded block color="white" class="text-uppercase mt-4" @click="$emit('withdraw', item)">
        <span style="color: #4AB2A4;">Withdraw</span>
      </v-btn>

      <div v-if="!epochHasPassed" class="d-flex mt-4 align-center">
        <div class="">
          {{ dateSimple }}
        </div>
        <v-spacer></v-spacer>
        <div class="caption textMid--text">
          {{ dateFromNow }} - #{{ item.lockID }}
        </div>
      </div>

      <div v-if="false" class="mt-4 text-center">
        <v-btn small text rounded color="textFaint" @click="$emit('relock', item)">
          Relock
          <v-icon small class="ml-1" color="">mdi-lock-open-outline</v-icon>
        </v-btn>
        <v-btn small text rounded color="textFaint" @click="$emit('transfer-ownership', item)">
          Transfer ownership
          <v-icon small class="ml-1" color="">mdi-account-outline</v-icon>
        </v-btn>
        <v-btn small rounded text color="textFaint" @click="$emit('migrate', item)">
          Migrate
          <v-icon small class="ml-1" color="">mdi-lock-open-outline</v-icon>
        </v-btn>
        <v-btn small rounded text color="textFaint" @click="$emit('increment', item)">
          Increment lock
          <v-icon small class="ml-1" color="">mdi-plus</v-icon>
        </v-btn>
      </div>

    </div>
        
  </div>
</template>

<script>
import moment from 'moment'
import { ethers } from 'ethers'

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
      var amount = ethers.utils.formatUnits(this.item.amount, 18)
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
      if (moment.unix(this.item.unlock_date).isValid()) {
        return moment.unix(this.item.unlock_date).fromNow()
      }
      return ''
    },
    dateSimple () {
      if (moment.unix(this.item.unlock_date).isValid()) {
        return moment.unix(this.item.unlock_date).format('ddd D MMM YYYY HH:mm')
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
    epochHasPassed () {
      return this.item.unlock_date < moment().unix()
      // return true // for testing withdrawl before unlock
    }
  }
}
</script>