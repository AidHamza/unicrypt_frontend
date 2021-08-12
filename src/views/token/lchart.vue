<template>
  <div>
    <div ref="chartContainer" style="position: relative;">
      <div ref="tooltip" class="floating-tooltip-2" style="visibility: hidden;">
        <div>
          {{ hoverPrice}}
        </div>
        <div>
          {{ hoverDate}}
        </div>
      </div>

      <div v-if="loading" class="text-center" style="position:absolute; left: 0; right: 0; top: 40px;">
        <v-progress-circular
        indeterminate
        size="60"
        width="2"
        color="#aaa">
          <img 
          src="@/assets/img/UNCX_fill.svg" 
          height="50px"
          class="greyscale"
          width="50px">
        </v-progress-circular>
      </div>

      <div v-if="!loading && errorLoadingChart" class="textFaint--text text-center" style="position:absolute; left: 0; right: 0; bottom: 0; top: 60px;">
        Error loading chart
      </div>
      
    </div>
    <div class="d-flex align-center px-2">
      <v-btn v-if="pairName" @click="microWrapper" rounded outlined small :color="tab === 0 ? 'text' : 'textFaint'">{{ pairName }}</v-btn>
      <v-btn @click="oneDayWrapper" rounded outlined small :color="tab === 1 ? 'text' : 'textFaint'">$ Macro</v-btn>
      <v-spacer></v-spacer>
      <div class="t-small d-flex align-center textFaint--text">
        Charts by TradingView
        <v-menu offset-y open-on-hover transition="scale-transition" max-width="300px">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              @click.stop
              size="14"
              v-bind="attrs"
              v-on="on"
              color="textFaint"
              class="ml-1"
            >
              mdi-help-circle-outline
            </v-icon>
          </template>
          <div class="pa-3 foreground caption">
            TradingView Lightweight Charts <br />
            Copyright (с) 2020 TradingView, Inc.
            <a href="https://www.tradingview.com/" target="_blank">
              https://www.tradingview.com/
            </a>
          </div>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { createChart } from 'lightweight-charts'
import axios from 'axios'
import SETTINGS from '@/store/settings'

export default {
  props: {
    address: {
      type: String
    },
    tokenAddress: {
      type: String
    },
    exchange: null
  },

  data: () => ({
    tab: 0,
    cdata: [],
    chart: {},
    chartData: {},
    hoverPrice: 0,
    hoverDate: '',
    pairName: '',
    loading: false,
    errorLoadingChart: false
  }),

  computed: {
    cExchange () {
      return this.exchange || this.$store.state.exchange
    }
  },

  methods: {
    oneDayWrapper () {
      this.loading = true
      this.tab = 1
      this.errorLoadingChart = false
      this.oneDay()
        .then()
        .catch(e => {
          this.errorLoadingChart = true
        })
        .then(() => {
          this.loading = false
        })
    },
    microWrapper () {
      this.loading = true
      this.tab = 0
      this.errorLoadingChart = false
      this.micro()
        .then()
        .catch(e => {
          this.errorLoadingChart = true
        })
        .then(() => {
          this.loading = false
        })
    },
    async oneDay () {
      var data = {
        query: `
        {
          tokenDayDatas(first:1000, orderBy: date, orderDirection: desc,
            where: {
              token: "${this.tokenAddress.toLowerCase()}"
            }
          ) {
              id
              date
              priceUSD
          }
        }
      `
      }
      var graphExplorer = SETTINGS.AMMS[this.cExchange].graphExplorer
      var response = await axios.post(graphExplorer, data)
      var chartData = response.data.data.tokenDayDatas
      chartData.reverse()

      var chartxx = chartData.map(item => ({
        time: item.date,
        value: Number(item.priceUSD)
      }))

      var lastItem = chartxx[chartxx.length - 1]
      var minMove = 1
      var st = Math.floor(1 / lastItem.value).toString()
      var precision = st.length + 1
      minMove = 1 / Math.pow(10, st.length + 1)

      var clientWidth = this.$refs.chartContainer.clientWidth
      this.cdata = chartxx
      this.chartData.setData(this.cdata)
      this.chart.timeScale().fitContent()
      this.chart.resize(clientWidth, 200)
      this.chartData.applyOptions({
        priceFormat: {
          type: 'price',
          precision: precision,
          minMove: minMove
        },
      })
      /* this.chart.applyOptions({
        localization: {
          priceFormatter: price => '$' + price.toFixed(precision)
        },
      }) */
    },
    async micro () {
      var data = {
        query: `
        {
          swaps(first: 1000, orderBy: timestamp, orderDirection: desc, where:
          { pair: "${this.address.toLowerCase()}" }
          ) {
              pair {
                token0 {
                  symbol
                }
                token1 {
                  symbol
                }
              }
              amount0In
              amount0Out
              amount1In
              amount1Out
              amountUSD
              timestamp
          }
        }
      `
      }
      var graphExplorer = SETTINGS.AMMS[this.cExchange].graphExplorer
      var response = await axios.post(graphExplorer, data)
      var chartData = response.data.data.swaps
      chartData.map(item => {
        if (item.amount1In !== '0' && item.amount0Out !== '0') {
          item.rate = item.amount0Out / item.amount1In
        } else {
          item.rate = item.amount0In / item.amount1Out
        }
      })
      /* var mapped = chartData.map(item => ({
        time: Number(item.timestamp),
        open: item.rate,
        high: item.rate,
        low: item.rate,
        close: item.rate
      })) */
      var mapped = chartData.reduce((a, i) => {
        a[i.timestamp] = {
          rate: i.rate
        }
        return a
      }, {})
      var orderedKeys = Object.keys(mapped).sort((a, b) => a - b)
      var chartxx = orderedKeys.reduce((a, timestamp) => {
        a.push({
          time: Number(timestamp),
          value: mapped[timestamp].rate,
        })
        return a
      }, [])
      
      var lastItem = chartxx[chartxx.length - 1]
      var minMove = 1
      var st = Math.floor(1 / lastItem.value).toString()
      var precision = st.length + 1
      minMove = 1 / Math.pow(10, st.length + 1)

      this.cdata = chartxx
      this.chartData.setData(this.cdata)
      this.chart.timeScale().fitContent()

      var clientWidth = this.$refs.chartContainer.clientWidth
      this.chart.resize(clientWidth, 200)
      this.chartData.applyOptions({
        priceFormat: {
          type: 'price',
          precision: precision,
          minMove: minMove
        },
      })
    },
    async getPairNames () {
      var data = {
        query: `
        {
          swaps(first: 1, orderBy: timestamp, orderDirection: desc, where:
          { pair: "${this.address.toLowerCase()}" }
          ) {
              pair {
                token0 {
                  symbol
                }
                token1 {
                  symbol
                }
              }
              amount0In
              amount0Out
              amount1In
              amount1Out
              amountUSD
              timestamp
          }
        }
      `
      }
      var graphExplorer = SETTINGS.AMMS[this.cExchange].graphExplorer
      var response = await axios.post(graphExplorer, data)
      var swap = response.data.data.swaps[0]
      this.pairName = swap.pair.token0.symbol + '/' + swap.pair.token1.symbol
    },
    makechart () {
      var width = 500
      var height = 200
      var chart = createChart(this.$refs.chartContainer, {
        width: width,
        height: height,
        layout: {
          textColor: '#d1d4dc',
          backgroundColor: '#ff000000',
        },
        crosshair: {
          vertLine: {
            width: 5,
            color: 'rgba(224, 227, 235, 0.1)',
            style: 0,
          },
          horzLine: {
            visible: true,
            labelVisible: true,
          },
        },
        grid: {
          vertLines: {
            color: 'rgba(42, 46, 57, 0)',
          },
          horzLines: {
            color: 'rgba(42, 46, 57, 0)',
          },
        },
      });

      var candleSeries = chart.addAreaSeries({
        priceScaleId: 'right',
        topColor: 'rgba(14, 207, 114, 0.56)',
        bottomColor: 'rgba(14, 207, 114, 0.04)',
        lineColor: 'rgba(14, 207, 114, 1)',
        lineWidth: 2,
        scaleMargins: {
          top: 0.1,
          bottom: 0.3,
        },
      })

      this.chart = chart
      this.chartData = candleSeries

      // TOOLTIP
      var toolTipWidth = 100;
      var toolTipHeight = 80;
      var toolTipMargin = 15;

      var toolTip = this.$refs.tooltip

      // update tooltip
      chart.subscribeCrosshairMove(param => {
        if (!param.time || param.point.x < 0 || param.point.x > width || param.point.y < 0 || param.point.y > height) {
          // toolTip.style.display = 'none';
          return;
        }

        var dateStr = param.time

        toolTip.style.display = 'block';
        this.hoverPrice = param.seriesPrices.get(candleSeries)
        this.hoverDate = dateStr
        var y = param.point.y;

        var left = param.point.x + toolTipMargin;
        if (left > width - toolTipWidth) {
          left = param.point.x - toolTipMargin - toolTipWidth;
        }

        var top = y + toolTipMargin;
        if (top > height - toolTipHeight) {
          top = y - toolTipHeight - toolTipMargin;
        }

        toolTip.style.left = left + 'px';
        toolTip.style.top = top + 'px';
      });

      // candleSeries.setData();
    },
  },

  mounted () {
    // this.microWrapper()
    this.oneDayWrapper()
    this.getPairNames()
    this.makechart()
  }
}
</script>

<style scoped lang="scss">
.floating-tooltip-2 {
  width: 96px;
  height: 80px;
  position: absolute;
  display: none;
  padding: 8px;
  box-sizing: border-box;
  font-size: 12px;
  color: #131722;
  background-color: rgba(255, 255, 255, 1);
  text-align: left;
  z-index: 1000;
  top: 12px;
  left: 12px;
  pointer-events: none;
  border: 1px solid rgba(255, 70, 70, 1);
  border-radius: 2px;
}
</style>