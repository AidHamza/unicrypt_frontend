<template>
  <div>
    <div class="d-flex justify-center mt-2">
      <div style="width: 100%;">
        <line-chart :chartdata="chartData" :options="chartOptions" ref="lineChart" />
      </div>
    </div>
    
    <div class="pa-2">
      <div class="text-center">
        Tokens withdrawable
      </div>
      <div class="d-flex align-center">
        Per day: 
        <v-spacer></v-spacer>
        {{ amountWithdrawablePerDayHuman }}
      </div>
      <div class="d-flex align-center">
        Per month: 
        <v-spacer></v-spacer>
        {{ amountWithdrawablePerMonthHuman }}
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import moment from 'moment'
import LineChart from '@/components/charts/line'

export default {
  props: {
    lock: {
      type: Object,
      default: () => {}
    },
    tokenHydrated: {
      type: Object,
      default: () => ({
        symbol: '',
        name: '',
        decimals: '0'
      })
    },
  },

  components: {
    LineChart
  },

  data: () => ({
    chartData: {
      labels: [],
      datasets: [{
        label: 'Tokens Withdrawable',
        data: [],
        fill: false,
        borderWidth: 2,
        borderColor: 'rgb(33, 150, 243)',
        tension: 0,
        // borderColor: 'rgba(0,0,0,0.1)'
      }]

    },
    chartOptions: {
      responsive: true,
      interaction: {
        intersect: false
      },
      scales: {
        xAxes: [{
          type: 'time'
        }]
      },
      plugins: {
        tooltip: {
          enabled: false,
          position: 'average'
        }
      }
    }
  }),

  computed: {
    unlockPeriodInSeconds () {
      return this.lock.end_emission - this.lock.start_emission
    },
    amountWithdrawablePerMinite () {
      return ethers.BigNumber.from(this.lock.amount).mul(60).div(this.unlockPeriodInSeconds).toString()
    },
    amountWithdrawablePerHour () {
      return ethers.BigNumber.from(this.lock.amount).mul(3600).div(this.unlockPeriodInSeconds).toString()
    },
    amountWithdrawablePerDay () {
      return ethers.BigNumber.from(this.lock.amount).mul(86400).div(this.unlockPeriodInSeconds).toString()
    },
    amountWithdrawablePerMonth () {
      return ethers.BigNumber.from(this.lock.amount).mul(2592000).div(this.unlockPeriodInSeconds).toString()
    },
    amountWithdrawablePerMonthHuman () {
      var amount = ethers.BigNumber.from(this.amountWithdrawablePerMonth).gt(this.lock.amount) ? this.lock.amount : this.amountWithdrawablePerMonth
      return this.$root.formatAmount(amount, this.tokenHydrated.decimals)
    },
    amountWithdrawablePerDayHuman () {
      var amount = ethers.BigNumber.from(this.amountWithdrawablePerDay).gt(this.lock.amount) ? this.lock.amount : this.amountWithdrawablePerDay
      return this.$root.formatAmount(amount, this.tokenHydrated.decimals)
    },
  },

  watch: {
    lock: {
      deep: true,
      handler () {
        this.refresh()
      }
    }
  },

  methods: {
    refresh () {
      if (this.lock.start_emission >= this.lock.end_emission) {
        return
      }
      
      var data = [
        {
          t: moment().unix() * 1000,
          y: 0
        },
        {
          t: this.lock.start_emission * 1000,
          y: 0
        }
      ]

      if (moment().unix() > this.lock.start_emission) {
        data = [
          {
            t: this.lock.start_emission * 1000,
            y: 0
          }
        ]
      }

      var currentEpoch = this.lock.start_emission
      var totalAmount = ethers.BigNumber.from(0)
      var SCALE = 60 // minite ticks
      var AMOUNT_INCREMENT = this.amountWithdrawablePerMinite
      if (this.unlockPeriodInSeconds > 3600 * 24 * 30 * 2) {
        SCALE = 2592000 // monthly ticks
        AMOUNT_INCREMENT = this.amountWithdrawablePerMonth
      } else if (this.unlockPeriodInSeconds > 3600 * 24 * 2) {
        SCALE = 86400 // daily ticks
        AMOUNT_INCREMENT = this.amountWithdrawablePerDay
      } else if (this.unlockPeriodInSeconds > 3600 * 4) {
        SCALE = 3600 // hourly ticks
        AMOUNT_INCREMENT = this.amountWithdrawablePerHour
      }
      while (currentEpoch < this.lock.end_emission) {
        currentEpoch += SCALE
        totalAmount = totalAmount.add(AMOUNT_INCREMENT)
        if (currentEpoch >= this.lock.end_emission) {
          data.push({
            t: this.lock.end_emission * 1000,
            y: ethers.utils.formatUnits(this.lock.amount, this.tokenHydrated.decimals)
          })
          console.log('breaking')
          break
        }
        console.log('iterating')
        data.push({
          t: currentEpoch * 1000,
          y: ethers.utils.formatUnits(totalAmount, this.tokenHydrated.decimals)
        })
      }
      this.chartData.datasets[0].data = data
      this.$refs.lineChart.update()
    }
  },

  created () {
    this.refresh()
  }
}
</script>
